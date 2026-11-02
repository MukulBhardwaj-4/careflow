
import 'dotenv/config';

import { app, initializeSocket } from './app.js';
import connectDB from './db/db.js';
import { initializeFCM } from './services/fcmService.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB connected successfully');

    // Initialize Firebase FCM
    initializeFCM();

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });

    // Initialize Socket.IO on the same HTTP server
    initializeSocket(server);

    console.log('Socket.IO initialized successfully');

    server.on('error', (error) => {
      console.error('Server error:', error);
    });

  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
};

startServer();
