require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes');
const { globalErrorHandler } = require('./src/utils/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1', apiRoutes);

// Global Error Handler 
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));