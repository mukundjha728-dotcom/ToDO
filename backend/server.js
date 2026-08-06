const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Database Connection
const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    // Use memory server if no real Mongo URI is provided (great for local testing without setup)
    if (!mongoUri) {
      console.log('No MONGO_URI found. Starting MongoDB Memory Server...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    }

    await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${mongoUri.includes('mongodb-memory-server') ? 'In-Memory' : 'Cloud/Local'}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
