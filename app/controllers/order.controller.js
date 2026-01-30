const model = require("../models/order.model");

exports.createOrder = async (req, res) => {
  try {
    const { user_id, items } = req.body;

    if (!user_id || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
      });
    }

    const result = await model.createOrder(user_id, items);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: result.orderId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await model.getOrdersByUser(req.params.userId);

    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
