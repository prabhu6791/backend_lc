const express = require("express");
const router = express.Router();
const controller = require("../controllers/order.controller");
const verifyToken = require("../middleware/authMiddleware");

router.post("/orders", verifyToken, controller.createOrder);
router.get("/orders/:userId", verifyToken, controller.getOrdersByUser);

module.exports = router;
