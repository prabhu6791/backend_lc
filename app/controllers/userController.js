const model = require('../models/userModels');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "123456";

exports.getUsers = async (req, res) => {
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
            { expiresIn: "1h" }
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
