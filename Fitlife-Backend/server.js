require('dotenv').config(); // Load .env variables
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const authMiddleware = require("./middlewares/authMiddleware");
const healthDataRoutes = require('./routes/healthDataRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection Check
db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL database");
    }
});

// Routes
app.use("/api", authRoutes);
const waterRoutes = require("./routes/water");
app.use("/api", waterRoutes);
app.use('/api',healthDataRoutes);



// Default Route (For Testing)
app.get('/', (req, res) => {
    res.send('🚀 FitLife API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
