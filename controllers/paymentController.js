import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

dotenv.config();

const razorpay = new Razorpay({
key_id: process.env.RAZORPAY_KEY_ID,
key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
try {
const { items } = req.body;

if (!Array.isArray(items) || items.length === 0) {
return res.status(400).json({
success: false,
message: "Order items are required",
});
}

let totalAmount = 0;

for (const item of items) {
const product = await Product.findById(item.product);

if (!product) {
return res.status(404).json({
success: false,
message: `Product not found: ${item.product}`,
});
}

const quantity = Number(item.quantity);

if (!Number.isInteger(quantity) || quantity < 1) {
return res.status(400).json({
success: false,
message: "Invalid product quantity",
});
}

totalAmount += product.price * quantity;
}

const options = {
amount: totalAmount * 100,
currency: "INR",
receipt: "receipt_order_" + Date.now(),
};

const order = await razorpay.orders.create(options);

res.status(200).json({
success: true,
order,
});

} catch (error) {
console.log("Razorpay Error:", error);

res.status(500).json({
success: false,
message: "Order create cheyyan pattiyilla",
error: error.message,
});
}
};
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
    } = req.body

    const body =
      razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      })
    }

    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        })
      }

      const quantity = Number(item.quantity)

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid product quantity",
        })
      }

      totalAmount += product.price * quantity

      orderItems.push({
        product: product._id,
        quantity,
        price: product.price,
      })
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      payment: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
      },
      status: "processing",
    })

    return res.status(201).json({
      success: true,
      message: "Payment verified and order created successfully",
      orderId: order._id,
    })
  } catch (error) {
    console.log("Payment Verification Error:", error)

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    })
  }
} 