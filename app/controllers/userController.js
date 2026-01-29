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
            return res.status(401).json({
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
            return res.status(400).json({
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
        // Assuming you have a method to fetch all customers from the database
        const customers = await model.getAllCustomers(); // You need to implement this method in your model

        res.status(200).json({
            success: true,
            count: customers.length,
            data: customers
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
        const { name, email, username } = req.body;

        // Validate required fields
        if (!name || !email || !username) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Here you would typically update the customer in the database
        // For now, we'll just send a success response
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