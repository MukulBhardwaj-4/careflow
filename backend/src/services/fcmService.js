
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { Patient, Nurse } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';

let messaging = null;

const initializeFCM = () => {
  try {
    if (messaging) return messaging;

    const firebaseApp = getApps().length
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });

    messaging = getMessaging(firebaseApp);

    console.log('Firebase FCM initialized successfully');

    return messaging;
  } catch (error) {
    console.error('FCM Initialization Error:', error);
    throw error;
  }
};

const sendNotification = async (deviceToken, title, body, data = {}) => {
  try {
    const fcm = messaging || initializeFCM();

    const message = {
      token: deviceToken,
      notification: { title, body },
      data,
    };

    const response = await fcm.send(message);

    return { success: true, messageId: response };
  } catch (error) {
    console.error('FCM Send Error:', error);
    throw new ApiError(500, 'Failed to send notification');
  }
};

const sendToUser = async (userId, userRole, title, body, data = {}) => {
  try {
    let user;

    if (userRole === 'patient') {
      user = await Patient.findById(userId);
    } else if (userRole === 'nurse') {
      user = await Nurse.findById(userId);
    }

    if (!user || !user.deviceToken) {
      console.log(`No device token for user ${userId}`);
      return { success: false, reason: 'No device token' };
    }

    return await sendNotification(user.deviceToken, title, body, data);
  } catch (error) {
    console.error('Send To User Error:', error);
    throw error;
  }
};

const sendToMultiple = async (deviceTokens, title, body, data = {}) => {
  try {
    if (!deviceTokens.length) {
      return { success: false, reason: 'No device tokens provided' };
    }

    const fcm = messaging || initializeFCM();

    const message = {
      tokens: deviceTokens,
      notification: { title, body },
      data,
    };

    const response = await fcm.sendEachForMulticast(message);

    return { success: true, response };
  } catch (error) {
    console.error('FCM Multicast Error:', error);
    throw new ApiError(500, 'Failed to send notifications');
  }
};

export {
  initializeFCM,
  sendNotification,
  sendToUser,
  sendToMultiple,
};
