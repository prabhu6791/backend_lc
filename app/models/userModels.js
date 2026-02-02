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
        const { name, email, username, password, role, phone } = userData;

        // Validate required fields
        if (!name || !email || !username || !password || !phone) {
            throw new Error("All fields are required");
        }

        const query = `
            INSERT INTO users 
            (name, email, phone_number, username, password, role, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;

        const values = [name, email, phone, username, password, role];

        return new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) {
                    return reject({
                        success: false,
                        message: "Database error",
                        error: err,
                    });
                }

                // result guaranteed here
                resolve({
                    success: true,
                    id: result.insertId,
                    name,
                    email,
                    username,
                    role,
                });
            });
        });

    } catch (error) {
        console.error("Error in createUser:", error);
        return {
            success: false,
            message: error.message,
            error,
        };
    }
};

const getAllCustomers = async (limit, offset) => {
    try {
        const dataQuery = `
            SELECT * FROM users 
            WHERE role = 'customer' AND status = 'A'
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;

        const countQuery = `
            SELECT COUNT(*) AS total 
            FROM users 
            WHERE role = 'customer' AND status = 'A'
        `;

        return new Promise((resolve, reject) => {
            db.query(countQuery, (err, countResult) => {
                if (err) return reject(err);

                const total = countResult[0].total;

                db.query(dataQuery, [limit, offset], (err, dataResult) => {
                    if (err) return reject(err);

                    resolve({
                        total,
                        data: dataResult
                    });
                });
            });
        });

    } catch (error) {
        throw error;
    }
};

const checkusernameOnly = async (username, id) => {
    try {
        if (!username || !id) {
            throw new Error('Username and ID are required');
        }

        const query = "SELECT * FROM users WHERE username = ? AND id != ?";

        return new Promise((resolve, reject) => {
            db.query(query, [username, id], (err, result) => {
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

const updateCustomer = async (userData, id) => {
    try {
        const { name, email, username } = userData;

        // Validate required fields
        if (!name || !email || !username) {
            throw new Error('All fields are required');
        }

        const query = "UPDATE users SET name = ?, email = ?, username = ? WHERE id = ?";
        const values = [name, email, username, id];

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
                    message: 'Customer updated successfully'
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

const deleteCustomer = async (id) => {
    try {
        if (!id) {
            throw new Error('ID is required');
        }

        const query = "UPDATE users SET status = 'D' WHERE id = ?";

        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, result) => {
                if (err) {
                    reject({
                        success: false,
                        message: 'Database error',
                        error: err
                    });
                }

                resolve({
                    success: true,
                    message: 'Customer deleted successfully'
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

const saveContact = async (contactData) => {
    try {
        const { name, email, message, phone, subject } = contactData;

        // Validate required fields
        if (!name || !email || !message || !subject) {
            throw new Error("All fields are required");
        }

        const query = `
            INSERT INTO contacts
            (name, email, phone, subject, message, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;

        const values = [name, email, phone || null, subject, message];

        return new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) {
                    return reject({
                        success: false,
                        message: "Database error",
                        error: err,
                    });
                }

                // result guaranteed here
                resolve({
                    success: true,
                    id: result.insertId,
                });
            });
        });

    } catch (error) {
        console.error("Error in saveContact:", error);
        return {
            success: false,
            message: error.message,
            error,
        };
    }
};

module.exports = { checkusername, createUser, getAllCustomers, checkusernameOnly, updateCustomer, deleteCustomer, saveContact };