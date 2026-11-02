import axios from 'axios'
import { getFCMToken, listenForMessages } from './firebaseService'

const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
})

// Store device token in localStorage
export const initializeFCM = async () => {
  try {
    const token = await getFCMToken()

    if (token) {
      // Store token in localStorage
      localStorage.setItem('fcmToken', token)

      // Send token to backend
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        try {
          await API.post(
            '/notifications/register-token',
            { deviceToken: token },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          console.log('FCM token registered with backend')
        } catch (error) {
          console.warn('Failed to register FCM token:', error)
        }
      }

      return token
    }
  } catch (error) {
    console.error('FCM initialization failed:', error)
    return null
  }
}

// Listen for incoming messages and handle notifications
export const setupNotificationListeners = (dispatch) => {
  listenForMessages((payload) => {
    console.log('Notification payload:', payload)

    const { data, notification } = payload

    // Handle different notification types
    if (data?.type === 'MEDICATION_REMINDER') {
      dispatch({
        type: 'NOTIFICATION_RECEIVED',
        payload: {
          type: 'medication_reminder',
          title: notification?.title || 'Medication Reminder',
          body: notification?.body || 'Time to take your medication',
          data,
        },
      })
    } else if (data?.type === 'ESCALATION') {
      dispatch({
        type: 'NOTIFICATION_RECEIVED',
        payload: {
          type: 'escalation',
          title: notification?.title || 'Escalation Alert',
          body: notification?.body || 'Patient requires attention',
          data,
        },
      })
    } else if (data?.type === 'PATIENT_ASSIGNMENT') {
      dispatch({
        type: 'NOTIFICATION_RECEIVED',
        payload: {
          type: 'patient_assignment',
          title: notification?.title || 'Patient Assignment',
          body: notification?.body || 'New patient assigned',
          data,
        },
      })
    } else {
      dispatch({
        type: 'NOTIFICATION_RECEIVED',
        payload: {
          type: 'general',
          title: notification?.title || 'CareFlow AI',
          body: notification?.body || 'New notification',
          data,
        },
      })
    }
  })
}

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

// Register service worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      console.log('Service worker registered')
      return true
    } catch (error) {
      console.error('Service worker registration failed:', error)
      return false
    }
  }
  return false
}

export default API