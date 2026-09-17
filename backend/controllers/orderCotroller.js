import OrderModel from "../models/Order.js";
import ProductModel from "../models/Product.js";

// ==========================================
// ADD ORDER - CUSTOMER
// ==========================================

const addOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Check product ID
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Find product
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items are available`,
      });
    }

    // Calculate total price on backend
    const totalPrice = product.price * quantity;

    // Create order
    const order = await OrderModel.create({
      customer: req.user._id,
      product: product._id,
      quantity: quantity,
      totalPrice: totalPrice,
    });

    // Decrease stock
    product.stock -= quantity;

    await product.save();

    // Populate order
    const populatedOrder = await OrderModel.findById(order._id)
      .populate("customer", "name email")
      .populate({
        path: "product",
        select: "name description price category",
        populate: {
          path: "category",
          select: "categoryName",
        },
      });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Error adding order:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while placing order",
      error: error.message,
    });
  }
};

// ==========================================
// GET MY ORDERS - CUSTOMER
// ==========================================

const getMyOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({
      customer: req.user._id,
    })
      .populate("customer", "name email")
      .populate({
        path: "product",
        select: "name description price category",
        populate: {
          path: "category",
          select: "categoryName",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error getting orders:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// ==========================================
// GET ALL ORDERS - ADMIN
// ==========================================

const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("customer", "name email")
      .populate("product", "name description price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error getting all orders:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while getting orders",
    });
  }
};

// ==========================================
// UPDATE ORDER STATUS - ADMIN
// ==========================================

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Confirmed", "Delivered", "Cancelled"];

    // Validate status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // Find order
    const order = await OrderModel.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while updating order status",
    });
  }
};

export { addOrder, getMyOrders, getAllOrders, updateOrderStatus };
