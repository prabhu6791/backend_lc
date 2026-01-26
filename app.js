const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./app/routes/userRoutes');
app.use('/api', userRoutes);

app.get('/', (req, res) => {
    res.send("API is running...");
});

app.listen(3002, () => {
    console.log("Server running on port 3002 🚀");
});
