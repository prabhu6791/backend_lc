const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/login", userController.login);

router.post("/customers", userController.addCustomer);
router.get("/get-all-customers", verifyToken, userController.getAllCustomer);
router.put("/edit-customers/:id", verifyToken, userController.editCustomer);
router.delete("/delete-customers/:id", verifyToken, userController.deleteCustomer);

module.exports = router;
