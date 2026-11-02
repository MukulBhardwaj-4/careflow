import { useNotifications } from '../context/NotificationContext'
import { X, Bell, AlertCircle, CheckCircle, Info } from 'lucide-react'

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotifications()

  const getIcon = (type) => {
    switch (type) {
      case 'medication_reminder':
        return <Bell className="w-5 h-5 text-blue-600" />
      case 'escalation':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'patient_assignment':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'medication_reminder':
        return 'bg-blue-50 border-blue-200'
      case 'escalation':
        return 'bg-red-50 border-red-200'
      case 'patient_assignment':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getTextColor = (type) => {
    switch (type) {
      case 'medication_reminder':
        return 'text-blue-800'
      case 'escalation':
        return 'text-red-800'
      case 'patient_assignment':
        return 'text-green-800'
      default:
        return 'text-blue-800'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBackgroundColor(notification.type)} border rounded-lg p-4 shadow-lg animate-slide-in`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`${getTextColor(notification.type)} font-semibold text-sm`}>
                {notification.title}
              </h3>
              <p className={`${getTextColor(notification.type)} text-sm mt-1`}>
                {notification.body}
              </p>
              {notification.data && (
                <p className={`${getTextColor(notification.type)} text-xs mt-2 opacity-75`}>
                  {JSON.stringify(notification.data).substring(0, 100)}...
                </p>
              )}
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className={`flex-shrink-0 ${getTextColor(notification.type)} hover:opacity-70`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}