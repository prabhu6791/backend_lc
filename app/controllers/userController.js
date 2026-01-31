const model = require('../models/userModels');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "123456";

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        const data = await model.checkusername(username);

        if (!data.success || !data.exists) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = data.user;

        if (user.password !== password) {
            return res.send({
                success: false,
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            message: user.role === 'admin' ? "Welcome Admin" : "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

exports.addCustomer = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        // Validate required fields
        if (!name || !email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if username already exists
        const existingUser = await model.checkusername(username);
        if (existingUser.exists) {
            return res.send({
                success: false,
                message: "Username already exists"
            });
        }

        // Create new customer
        const newCustomer = await model.createUser({
            name,
            email,
            username,
            password,
            role: 'customer'
        });

        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            user: {
                id: newCustomer.id,
                name: newCustomer.name,
                email: newCustomer.email,
                username: newCustomer.username,
                role: newCustomer.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

exports.getAllCustomer = async (req, res) => {
    try {
        // query params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const offset = (page - 1) * limit;

        const result = await model.getAllCustomers(limit, offset);

        res.status(200).json({
            success: true,
            page,
            limit,
            totalRecords: result.total,
            totalPages: Math.ceil(result.total / limit),
            data: result.data
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

exports.editCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const { name, email, username, password } = req.body;

        // Validate required fields
        if (!name || !email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        let data = await model.checkusernameOnly(username, customerId);

        if (data.exists) {
            return res.send
                ({
                    success: false,
                    message: "Username already exists"
                });
        }

        await model.updateCustomer(req.body, customerId);

        res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: {
                id: customerId,
                name,
                email,
                username
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;

        if (!customerId) {
            return res.status(400).json({
                success: false,
                message: "Customer ID is required"
            });
        }

        const data = await model.deleteCustomer(customerId);

        if (!data || data.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully",
            data: {
                id: customerId
            }
        });
    } catch (err) {
        console.error('Error deleting customer:', err);
        res.status(500).json({
            success: false,
            message: "Failed to delete customer",
            error: err.message
        });
    }
};
