import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
try {
const { items } = req.body;


if (!Array.isArray(items) || items.length === 0) {
return res.status(400).json({
message: "Order items are required",
});
}

let totalAmount = 0;
const orderItems = [];

for (const item of items) {
const product = await Product.findById(item.product);

if (!product) {
return res.status(404).json({
message:` Product not found: ${item.product}`,
});
}


const quantity = Number(item.quantity);

if (!Number.isInteger(quantity) || quantity < 1) {
return res.status(400).json({
message: "Invalid product quantity",
});
}


const itemTotal = product.price * quantity;

totalAmount += itemTotal;

orderItems.push({
product: product._id,
quantity,
price: product.price,
});
}

const order = new Order({
user: req.user.id,
items: orderItems,
totalAmount,
});

const savedOrder = await order.save();

res.status(201).json({
message: "Order placed successfully",
order: savedOrder,
});

} catch (error) {
res.status(500).json({
message: "Failed to create order",
});
}
};
export const getMyOrders = async (req, res) => {
try {
console.log("LOGGED USER ID:", req.user.id);

const orders = await Order.find({
user: req.user.id
})
.populate("items.product")
.sort({ createdAt: -1 });

console.log("MY ORDERS:", orders);

res.status(200).json({ orders });

} catch (error) {
res.status(400).json({
message: error.message
});
}
}
export const getOrderById = async (req, res) => {
try {
const order = await Order.findOne({
_id: req.params.id,
user: req.user.id,
}).populate("items.product");

if (!order) {
return res.status(404).json({
success: false,
message: "Order not found",
});
}

return res.status(200).json({
success: true,
order,
});
} catch (error) {
console.log("Get Order Error:", error);

return res.status(500).json({
success: false,
message: "Failed to fetch order",
});
}
};