import Product from "../models/Product.js";
import OrderModel from "../models/Order.js";

const getData = async (req, res) => {
  try {
    // ==============================
    // 1. Total Products
    // ==============================
    const totalProducts = await Product.countDocuments();

    // ==============================
    // 2. Total Stock
    // ==============================
    const stockResult = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: "$stock" },
        },
      },
    ]);

    const totalStock = stockResult[0]?.totalStock || 0;

    // ==============================
    // 3. Orders Today
    // ==============================
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const ordersToday = await OrderModel.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // ==============================
    // 4. Revenue
    // ==============================
    const revenueResult = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const revenue = revenueResult[0]?.revenue || 0;

    // ==============================
    // 5. Out of Stock Products
    // ==============================
    const outOfStock = await Product.find({
      stock: 0,
    }).select("name stock");

    // ==============================
    // 6. Highest Sale Product
    // ==============================
    const highestSaleResult = await OrderModel.aggregate([
      {
        $group: {
          _id: "$product",
          totalQuantity: {
            $sum: "$quantity",
          },
        },
      },
      {
        $sort: {
          totalQuantity: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    let highestSaleProduct = {
      message: "No sale data available",
    };

    if (highestSaleResult.length > 0) {
      const product = await Product.findById(highestSaleResult[0]._id).populate(
        "category",
        "categoryName",
      );

      if (product) {
        highestSaleProduct = {
          name: product.name,
          category: product.category?.categoryName || "N/A",
          totalQuantity: highestSaleResult[0].totalQuantity,
        };
      }
    }

    // ==============================
    // 7. Low Stock Products
    // ==============================
    const lowStock = await Product.find({
      stock: {
        $gt: 0,
        $lt: 5,
      },
    })
      .select("name stock category")
      .populate("category", "categoryName");

    // ==============================
    // Dashboard Data
    // ==============================
    const dashboardData = {
      totalProducts,
      totalStock,
      ordersToday,
      revenue,
      outOfStock,
      highestSaleProduct,
      lowStock,
    };

    return res.status(200).json({
      success: true,
      dashboardData,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard summary",
      error: error.message,
    });
  }
};

export { getData };
