import { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  initializeFCM,
  setupNotificationListeners,
  requestNotificationPermission,
  registerServiceWorker,
} from '../services/notificationService'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const dispatch = useDispatch()
  const [notifications, setNotifications] = useState([])
  const [fcmToken, setFcmToken] = useState(null)

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Register service worker
        await registerServiceWorker()

        // Request notification permission
        const hasPermission = await requestNotificationPermission()
        if (hasPermission) {
          // Initialize FCM
          const token = await initializeFCM()
          setFcmToken(token)

          // Setup listeners
          setupNotificationListeners((payload) => {
            // Add notification to state
            const notification = {
              id: Date.now(),
              timestamp: new Date(),
              ...payload,
            }
            setNotifications((prev) => [notification, ...prev].slice(0, 50))

            // Auto-remove notification after 5 seconds
            setTimeout(() => {
              setNotifications((prev) =>
                prev.filter((n) => n.id !== notification.id)
              )
            }, 5000)
          })
        }
      } catch (error) {
        console.error('Notification setup failed:', error)
      }
    }

    setupNotifications()
  }, [dispatch])

  const addNotification = (notification) => {
    const notif = {
      id: Date.now(),
      timestamp: new Date(),
      ...notification,
    }
    setNotifications((prev) => [notif, ...prev].slice(0, 50))

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id))
    }, 5000)
  }

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const value = {
    notifications,
    fcmToken,
    addNotification,
    removeNotification,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}