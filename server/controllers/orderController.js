const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");
const Product = require("../models/Product");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const SHIPPING_FLAT_RATE = 60; // ₹60 flat shipping, keeps checkout math simple

// @desc    Create a local order + a matching Razorpay order to pay against
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error("No order items provided");
    }

    // Recalculate prices server-side from the DB — never trust prices sent
    // from the client, or a tampered request could check out at any price.
    let itemsPrice = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product ${item.product} not found`);
      }
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Not enough stock for ${product.name}`);
      }

      itemsPrice += product.price * item.quantity;
      verifiedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || "",
        price: product.price,
        quantity: item.quantity,
      });
    }

    const totalPrice = itemsPrice + SHIPPING_FLAT_RATE;

    const order = await Order.create({
      user: req.user._id,
      items: verifiedItems,
      shippingAddress,
      itemsPrice,
      shippingPrice: SHIPPING_FLAT_RATE,
      totalPrice,
    });

    // Razorpay expects the amount in paise (smallest currency unit)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100),
      currency: "INR",
      receipt: order._id.toString(),
    });

    order.paymentResult = { razorpayOrderId: razorpayOrder.id };
    await order.save();

    res.status(201).json({
      order,
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature and mark the order as paid
// @route   POST /api/orders/:id/verify-payment
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Recompute the expected signature server-side — this is what actually
    // proves the payment is genuine, never trust a client-sent "success" flag
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      res.status(400);
      throw new Error("Payment verification failed");
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = "processing";
    order.paymentResult = {
      ...order.paymentResult,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    };

    // Decrement stock now that payment is confirmed
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single order by id (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    if (!isOwner && !req.user.isAdmin) {
      res.status(403);
      throw new Error("Not authorized to view this order");
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    order.status = status;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
