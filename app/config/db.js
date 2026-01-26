const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "ecommerce_db"
});

db.connect((err) => {
    if (err) {
        console.error("Database Connection Failed ❌");
        console.error(err);
    } else {
        console.log("Database Connected ✅");
    }
});

module.exports = db;
