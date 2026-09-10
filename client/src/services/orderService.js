import api from "./api";

export const createOrder = async (items, shippingAddress) => {
  const { data } = await api.post("/orders", { items, shippingAddress });
  return data; // { order, razorpayOrderId, razorpayKeyId, amount }
};

export const verifyPayment = async (orderId, paymentData) => {
  const { data } = await api.post(`/orders/${orderId}/verify-payment`, paymentData);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/my-orders");
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export const getAllOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}/status`, { status });
  return data;
};

// Loads the Razorpay checkout script once, then opens the payment modal.
// Resolves with the payment response, rejects if the user cancels or it fails.
export const openRazorpayCheckout = ({ orderId, razorpayOrderId, razorpayKeyId, amount, user }) => {
  return new Promise((resolve, reject) => {
    const loadScript = () =>
      new Promise((res) => {
        if (document.getElementById("razorpay-checkout-script")) return res(true);
        const script = document.createElement("script");
        script.id = "razorpay-checkout-script";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => res(true);
        script.onerror = () => res(false);
        document.body.appendChild(script);
      });

    loadScript().then((loaded) => {
      if (!loaded || !window.Razorpay) {
        return reject(new Error("Could not load Razorpay checkout. Check your connection."));
      }

      const rzp = new window.Razorpay({
        key: razorpayKeyId,
        amount,
        currency: "INR",
        name: "Kiln & Co",
        description: "Order payment",
        order_id: razorpayOrderId,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#8A6D5C" },
        handler: (response) => resolve({ orderId, ...response }),
        modal: {
          ondismiss: () => reject(new Error("Payment cancelled")),
        },
      });

      rzp.open();
    });
  });
};
