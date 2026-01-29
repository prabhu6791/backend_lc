const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/login", userController.login);

router.post("/customers", verifyToken, userController.addCustomer);
router.get("/get-all-customers", verifyToken, userController.getAllCustomer);
router.put("/edit-customers/:id", verifyToken, userController.editCustomer);

module.exports = router;
