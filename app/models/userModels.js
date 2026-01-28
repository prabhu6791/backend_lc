const db = require('../config/db');

const checkusername = async (username) => {
    try {
        // Validate username parameter
        if (!username) {
            throw new Error('Username is required');
        }

        // Use parameterized query to prevent SQL injection
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


module.exports = { checkusername };