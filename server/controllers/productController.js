const Product = require("../models/Product");

// @desc    Get products, with optional search/category/price filters + pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const filter = {};

    if (req.query.keyword) {
      filter.$text = { $search: req.query.keyword };
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single product by id or slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

    const product = isObjectId
      ? await Product.findById(id)
      : await Product.findOne({ slug: id });

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products for the homepage
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(6);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, stock, images, glaze, isFeatured } = req.body;

    if (!name || !description || !category || price === undefined) {
      res.status(400);
      throw new Error("Name, description, category and price are required");
    }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      stock: stock || 0,
      images: images || [],
      glaze,
      isFeatured: Boolean(isFeatured),
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const fields = ["name", "description", "category", "price", "stock", "images", "glaze", "isFeatured"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You have already reviewed this product");
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
