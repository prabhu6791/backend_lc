const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./app/routes/userRoutes');
const productRoutes = require('./app/routes/product.routes');
const அRoutes = require('./app/routes/order.routes');
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', அRoutes);

app.get('/', (req, res) => {
    res.send("API is running...");
});

app.listen(3002, () => {
    console.log("Server running on port 3002");
});
