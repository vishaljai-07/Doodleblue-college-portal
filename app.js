const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import database connection function
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/user.routes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Built-in JSON body parser middleware
app.use(express.json());

// Base health check route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'College Portal Backend API is running successfully'
  });
});

// Register user routes under /api/users
app.use('/api/users', userRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
