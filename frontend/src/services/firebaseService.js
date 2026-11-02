import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDummyKeyForDevelopment',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'careflow-ai.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'careflow-ai',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'careflow-ai.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Get messaging instance
let messaging = null
try {
  messaging = getMessaging(app)
} catch (error) {
  console.warn('Messaging not supported:', error)
}

// Get FCM token
export const getFCMToken = async () => {
  if (!messaging) {
    console.warn('Messaging not initialized')
    return null
  }

  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    })

    if (token) {
      console.log('FCM Token:', token)
      // Send token to backend
      return token
    } else {
      console.log('No FCM token generated')
      return null
    }
  } catch (error) {
    console.error('Error getting FCM token:', error)
    return null
  }
}

// Listen for incoming messages
export const listenForMessages = (callback) => {
  if (!messaging) {
    console.warn('Messaging not initialized')
    return
  }

  onMessage(messaging, (payload) => {
    console.log('Message received:', payload)

    // Handle notification
    const notificationTitle = payload.notification?.title || 'CareFlow AI'
    const notificationOptions = {
      body: payload.notification?.body || 'New notification',
      icon: '/logo.png',
      badge: '/badge.png',
      data: payload.data,
    }

    // Show notification
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(notificationTitle, notificationOptions)
      })
    }

    // Call callback with payload
    if (callback) {
      callback(payload)
    }
  })
}

export default app