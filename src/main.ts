import express, { Application } from 'express';
import mongoose from 'mongoose';
import { AuthRouter } from './auth/auth.route';
import { connectMongoDB } from './db/db';
import userRouter from './users/users.route';

const app: Application = express();
const PORT = +process.env.PORT! || 6000;

app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', AuthRouter);

app.get('/api/v1/healthcheck', (req, res) => {
  try {
    res.send({ message: 'Server is up and running' });
  } catch (error: any) {
    console.error('Error checking health of the server: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

app.all('/{*any}', (req, res) => {
  res.status(404).json({
    message: 'Resource not found',
  });
});

let server: any;

// Start the server after MongoDB connection
const startServer = async () => {
  await connectMongoDB();

  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Graceful shutdown handler
const shutdown = async () => {
  console.log('Shutting down gracefully...');

  try {
    // Close the express server
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log('Express server closed');
          resolve();
        });
      });
    }

    // Close MongoDB connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }

    process.exit(0);
  } catch (error: any) {
    console.error('Error during shutdown: ', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
