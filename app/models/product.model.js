const db = require("../config/db");

exports.getAllProducts = (limit, offset) => {
    return new Promise((resolve, reject) => {
        const dataQuery = `
      SELECT * FROM products 
      WHERE status = 'A'
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;

        const countQuery = `
      SELECT COUNT(*) AS total 
      FROM products 
      WHERE status = 'A'
    `;

        db.query(countQuery, (err, countResult) => {
            if (err) return reject(err);

            const total = countResult[0].total;

            db.query(dataQuery, [limit, offset], (err, result) => {
                if (err) return reject(err);

                resolve({
                    total,
                    data: result,
                });
            });
        });
    });
};

exports.getProductById = (id) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM products WHERE id = ? AND status = 'A'";

        db.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};

exports.createProduct = (data) => {
    return new Promise((resolve, reject) => {
        const query = `
      INSERT INTO products 
      (product_name, sku, price, description, brand, count, image, created_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 'A')
    `;

        const values = [
            data.product_name,
            data.sku,
            data.price,
            data.description,
            data.brand,
            data.count || 0,
            data.image,
        ];

        db.query(query, values, (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId });
        });
    });
};

exports.updateProduct = (id, data) => {
    return new Promise((resolve, reject) => {
        const query = `
      UPDATE products SET 
        product_name = ?, 
        sku = ?, 
        price = ?, 
        description = ?, 
        brand = ?, 
        count = ?, 
        image = ?
      WHERE id = ?
    `;

        const values = [
            data.product_name,
            data.sku,
            data.price,
            data.description,
            data.brand,
            data.count,
            data.image,
            id,
        ];

        db.query(query, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE products SET status = 'D' WHERE id = ?`;

        db.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
