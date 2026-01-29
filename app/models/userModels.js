const db = require('../config/db');

const checkusername = async (username) => {
    try {
        if (!username) {
            throw new Error('Username is required');
        }

        const query = "SELECT * FROM users WHERE username = ?";

        return new Promise((resolve, reject) => {
            db.query(query, [username], (err, result) => {
                if (err) {
                    reject({
                        success: false,
                        message: 'Database error',
                        error: err
                    });
                }

                resolve({
                    success: true,
                    exists: result.length > 0,
                    user: result[0]
                });
            });
        });

    } catch (error) {
        return {
            success: false,
            message: error.message,
            error: error
        };
    }
};

const createUser = async (userData) => {
    try {
        const { name, email, username, password, role } = userData;

        // Validate required fields
        if (!name || !email || !username || !password) {
            throw new Error('All fields are required');
        }

        // Hash the password before saving
        // const hashedPassword = await bcrypt.hash(password, 10);

        const query = "INSERT INTO users (name, email, username, password, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
        const values = [name, email, username, password, role];

        return new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) {
                    reject({
                        success: false,
                        message: 'Database error',
                        error: err
                    });
                }

                resolve({
                    success: true,
                    id: result.insertId,
                    name,
                    email,
                    username,
                    role
                });
            });
        });

    } catch (error) {
        return {
            success: false,
            message: error.message,
            error: error
        };
    }
};

const getAllCustomers = async () => {
    try {
        const query = "SELECT * FROM users WHERE role = 'customer' AND status = 'A'";

        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    reject({
                        success: false,
                        message: 'Database error',
                        error: err
                    });
                }

                resolve(result);
            });
        });

    } catch (error) {
        return {
            success: false,
            message: error.message,
            error: error
        };
    }
};

module.exports = { checkusername, createUser, getAllCustomers };