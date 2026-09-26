import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, totalUsers, totalOrders, orders] =
      await Promise.all([
        Product.countDocuments(),
        User.countDocuments(),
        Order.countDocuments(),
        Order.find().select("totalAmount"),
      ]);

    const totalRevenue = orders.reduce(
      (total, order) => total + Number(order.totalAmount || 0),
      0
    );

    res.status(200).json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};
