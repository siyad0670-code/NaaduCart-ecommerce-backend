import Order from "../models/Order.js";

export const getAllOrders = async (req, res) => {
try {
const orders = await Order.find()
.populate("user", "name email")
.sort({ createdAt: -1 });

res.status(200).json(orders);
} catch (error) {
res.status(500).json({
message: "Failed to fetch orders",
error: error.message,
});
}
};

export const getAdminOrderById = async (req, res) => {
try {
const order = await Order.findById(req.params.id)
.populate("user", "name email")
.populate("items.product");

if (!order) {
return res.status(404).json({
message: "Order not found",
});
}

res.status(200).json(order);
} catch (error) {
res.status(500).json({
message: "Failed to fetch order",
error: error.message,
});
}
};

export const updateOrderStatus = async (req, res) => {
try {
const { status } = req.body;

const allowedStatuses = [
"pending",
"processing",
"shipped",
"delivered",
"cancelled",
];

if (!allowedStatuses.includes(status)) {
return res.status(400).json({
message: "Invalid order status",
});
}

const order = await Order.findById(req.params.id);

if (!order) {
return res.status(404).json({
message: "Order not found",
});
}

order.status = status;

const updatedOrder = await order.save();

res.status(200).json({
message: "Order status updated successfully",
order: updatedOrder,
});
} catch (error) {
res.status(500).json({
message: "Failed to update order status",
error: error.message,
});
}
};