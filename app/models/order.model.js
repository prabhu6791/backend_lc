const db = require("../config/db");

exports.createOrder = (user_id, items) => {
  return new Promise((resolve, reject) => {
    let total = 0;

    items.forEach(item => {
      total += item.price * item.quantity;
    });

    db.beginTransaction(err => {
      if (err) return reject(err);

      // 1️⃣ Insert into orders table
      const orderQuery = `
        INSERT INTO orders (user_id, total, status)
        VALUES (?, ?, 'pending')
      `;

      db.query(orderQuery, [user_id, total], (err, result) => {
        if (err) return db.rollback(() => reject(err));

        const orderId = result.insertId;

        // 2️⃣ Insert into order_items
        const itemQuery = `
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ?
        `;

        const values = items.map(item => [
          orderId,
          item.product_id,
          item.quantity,
          item.price,
        ]);

        db.query(itemQuery, [values], err => {
          if (err) return db.rollback(() => reject(err));

          // 3️⃣ Update product stock (count decrease)
          const updatePromises = items.map(item => {
            return new Promise((resolve, reject) => {
              const updateQuery = `
                UPDATE products 
                SET count = count - ?
                WHERE id = ? AND count >= ?
              `;

              db.query(updateQuery, [item.quantity, item.product_id, item.quantity], (err, result) => {
                if (err) return reject(err);

                // If stock not enough
                if (result.affectedRows === 0) {
                  return reject(new Error("Stock not enough for product ID: " + item.product_id));
                }

                resolve(true);
              });
            });
          });

          Promise.all(updatePromises)
            .then(() => {
              db.commit(err => {
                if (err) return db.rollback(() => reject(err));
                resolve({ orderId });
              });
            })
            .catch(err => {
              db.rollback(() => reject(err));
            });
        });
      });
    });
  });
};


exports.getOrdersByUser = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT o.id, o.total, o.status, o.created_at,
             oi.product_id, p.product_name, oi.quantity, oi.price
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.id DESC
    `;

        db.query(query, [userId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
