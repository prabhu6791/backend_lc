const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");
const verifyToken = require("../middleware/authMiddleware");


// CRUD Routes
router.get("/products", verifyToken, controller.getAllProducts);
router.get("/products/:id", verifyToken, controller.getProductById);
router.post("/products", verifyToken, controller.createProduct);
router.put("/products/:id", verifyToken, controller.updateProduct);
router.delete("/products/:id", verifyToken, controller.deleteProduct);

module.exports = router;
