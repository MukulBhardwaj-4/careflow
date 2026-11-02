===============================================================================
                    FIREBASE FCM INTEGRATION GUIDE
===============================================================================

IMPLEMENTATION COMPLETE ✅

The CareFlow AI frontend now includes full Firebase Cloud Messaging (FCM)
integration for real-time push notifications.

===============================================================================
                         WHAT HAS BEEN ADDED
===============================================================================

NEW FILES CREATED:

1. src/services/firebaseService.js
   - Firebase initialization
   - FCM token generation
   - Message listener setup
   - Notification payload handling

2. src/services/notificationService.js
   - FCM initialization wrapper
   - Token registration with backend
   - Notification permission requests
   - Service worker registration
   - Message handling & dispatch

3. src/context/NotificationContext.jsx
   - React Context for notifications
   - Notification state management
   - Hook: useNotifications()
   - Auto-remove notifications (5 sec)

4. src/components/NotificationToast.jsx
   - Toast notification component
   - Different icons per notification type
   - Auto-dismiss functionality
   - Color-coded by type (medication, escalation, assignment)

5. public/firebase-messaging-sw.js
   - Service Worker for background messages
   - Handles notifications when app is closed
   - Shows system notifications

6. .env.example
   - Firebase configuration template
   - All required environment variables

===============================================================================
                         SETUP INSTRUCTIONS
===============================================================================

STEP 1: GET FIREBASE CREDENTIALS
1. Go to https://console.firebase.google.com
2. Create a new project named "CareFlow AI"
3. Go to Project Settings → Service Accounts
4. Download service account key (for backend)
5. Go to Project Settings → Web App
6. Copy the Firebase config

STEP 2: CREATE .env FILE
Copy .env.example to .env and fill in Firebase credentials:

cp .env.example .env

Then edit .env:
VITE_FIREBASE_API_KEY=your_api_key_from_console
VITE_FIREBASE_AUTH_DOMAIN=careflow-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=careflow-ai
VITE_FIREBASE_STORAGE_BUCKET=careflow-ai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key

STEP 3: GENERATE VAPID KEY
1. Open Firebase Console
2. Go to Messaging
3. Click "Generate key pair"
4. Copy the public key to VITE_FIREBASE_VAPID_KEY

STEP 4: ENABLE NOTIFICATIONS IN BROWSER
- Allow notifications when prompted
- Chrome, Firefox, Edge all supported

STEP 5: RESTART FRONTEND
npm run dev
# Restart dev server to load new .env variables

===============================================================================
                      NOTIFICATION TYPES
===============================================================================

1. MEDICATION_REMINDER
   - Title: "Medication Reminder"
   - Body: "Time to take your medication: {medicineName} - {dosage}"
   - Icon: Bell icon (blue)
   - Data: { type: "MEDICATION_REMINDER", reminderId, ... }

2. ESCALATION
   - Title: "Escalation Alert"
   - Body: "Patient requires attention for medication: {medicineName}"
   - Icon: Alert icon (red)
   - Data: { type: "ESCALATION", escalationId, patientId, ... }

3. PATIENT_ASSIGNMENT
   - Title: "Patient Assignment"
   - Body: "You have been assigned a new patient"
   - Icon: Check icon (green)
   - Data: { type: "PATIENT_ASSIGNMENT", patientId, ... }

4. GENERAL
   - Title: "CareFlow AI"
   - Body: Custom message
   - Icon: Info icon (blue)
   - Data: Custom data

===============================================================================
                         HOW IT WORKS
===============================================================================

INITIALIZATION FLOW:
1. App starts → NotificationProvider wraps children
2. NotificationProvider useEffect triggers on mount
3. Service worker registered
4. User prompted for notification permission
5. FCM token generated
6. Token stored in localStorage
7. Token sent to backend (/api/v1/notifications/register-token)
8. Message listeners setup

MESSAGE FLOW:
1. Backend sends FCM notification
2. Firebase delivers to device
3. If app is open: onMessage handler triggers
4. If app is closed: Service worker shows notification
5. Notification added to state
6. Toast appears on screen (5 sec auto-dismiss)
7. User can dismiss manually

===============================================================================
                         FRONTEND USAGE
===============================================================================

USE NOTIFICATION HOOK IN COMPONENTS:

import { useNotifications } from '@/context/NotificationContext'

export default function MyComponent() {
  const { notifications, addNotification, removeNotification } = useNotifications()

  const handleAddNotification = () => {
    addNotification({
      type: 'medication_reminder',
      title: 'Time to take medicine',
      body: 'Aspirin 500mg',
      data: { reminderId: '123' },
    })
  }

  return (
    <div>
      <button onClick={handleAddNotification}>Add Notification</button>
      <p>Active notifications: {notifications.length}</p>
    </div>
  )
}

NOTIFICATION STRUCTURE:
{
  id: 1730572040789,              // Auto-generated timestamp
  timestamp: Date,                // When received
  type: 'medication_reminder',    // medication_reminder | escalation | patient_assignment | general
  title: 'Medication Reminder',   // Notification title
  body: 'Time to take Aspirin',   // Notification body
  data: {                         // Optional custom data
    type: 'MEDICATION_REMINDER',
    reminderId: '...',
    medicineName: 'Aspirin',
    dosage: '500mg'
  }
}

===============================================================================
                      BACKEND INTEGRATION
===============================================================================

OPTIONAL: Add token registration endpoint (if not implemented)

POST /api/v1/notifications/register-token
Headers:
  Authorization: Bearer <accessToken>

Request:
{
  "deviceToken": "fcm_token_string"
}

Response:
{
  "statusCode": 200,
  "data": { "tokenId": "...", "userId": "...", "token": "fcm_token" },
  "message": "Token registered successfully"
}

The frontend automatically sends token when app initializes.

===============================================================================
                      TESTING NOTIFICATIONS
===============================================================================

1. START FRONTEND
   npm run dev

2. ALLOW NOTIFICATIONS
   - Browser will ask for permission
   - Click "Allow"

3. GET FCM TOKEN
   - Open browser console (F12)
   - Look for "FCM Token: ..." message
   - Copy the token

4. SEND TEST FROM BACKEND
   - Use Firebase Console OR
   - Call backend FCM service with token

5. EXPECTED BEHAVIOR
   - If app is open: Toast notification appears
   - If app is closed: System notification shows
   - Notification auto-dismisses after 5 seconds

===============================================================================
                         FILE STRUCTURE
===============================================================================

frontend/
├── src/
│   ├── components/
│   │   └── NotificationToast.jsx       (Notification display)
│   ├── context/
│   │   └── NotificationContext.jsx     (State management)
│   ├── services/
│   │   ├── firebaseService.js          (Firebase setup)
│   │   └── notificationService.js      (FCM helpers)
│   ├── App.jsx                         (Updated with NotificationProvider)
│   └── index.css                       (Animations)
├── public/
│   └── firebase-messaging-sw.js        (Service worker)
├── .env                                (Firebase config)
├── .env.example                        (Template)
└── package.json                        (Firebase dependency added)

===============================================================================
                         DEPENDENCIES
===============================================================================

Added:
- firebase (v10.7.0+)
  Contains: app, messaging, cloud-messaging

Already installed:
- react (19.3.1)
- react-dom (19.3.1)
- react-router-dom (7.18.5)
- axios (1.21.0)

===============================================================================
                         BROWSER SUPPORT
===============================================================================

SUPPORTED BROWSERS:
✅ Chrome 63+
✅ Firefox 48+
✅ Edge 79+
✅ Opera 50+
✅ Safari 12.1+ (limited)

NOT SUPPORTED:
❌ Internet Explorer
❌ Safari on iOS (limitation of iOS)

SERVICE WORKER SUPPORT:
✅ All modern browsers
✅ Recommended: Chrome, Firefox, Edge

===============================================================================
                      SECURITY & PRIVACY
===============================================================================

TOKEN MANAGEMENT:
- FCM token stored in localStorage
- Token never exposed in URLs
- Token sent via HTTPS only
- Token invalidates after logout

NOTIFICATION DATA:
- Sensitive data: Never send in notification body
- Use notification IDs, fetch full data from API
- Data field for metadata only (IDs, timestamps)

PERMISSIONS:
- User must grant notification permission
- Can revoke in browser settings
- App respects user's choice

PRIVACY:
- Notifications don't transmit user data to Google servers
- Only notification delivery metadata tracked
- No tracking of notification engagement

===============================================================================
                      TROUBLESHOOTING
===============================================================================

ISSUE: "Service worker not supported"
SOLUTION: Use HTTPS (localhost works in development)
NOTE: Service workers only work on HTTPS or localhost

ISSUE: "Notification permission denied"
SOLUTION: 
1. Click lock icon in address bar
2. Find "Notifications" permission
3. Change to "Allow"
4. Refresh page

ISSUE: "FCM token not generated"
SOLUTION:
1. Check .env file has Firebase config
2. Check browser console for errors
3. Verify service worker is registered
4. Check browser supports FCM (use chrome/firefox)

ISSUE: "Backend not receiving token"
SOLUTION:
1. Check backend endpoint exists
2. Verify token is being sent (console log)
3. Check network tab for POST request
4. Verify Authorization header present

ISSUE: "Notifications not showing"
SOLUTION:
1. Check notification permission granted
2. Check browser doesn't have Do Not Disturb
3. Check notification isn't blocked by OS
4. Try test notification from Firebase Console

===============================================================================
                      TESTING CHECKLIST
===============================================================================

□ Service worker registered (check DevTools)
□ Notification permission granted
□ FCM token generated
□ Token sent to backend
□ Test notification received while app open
□ Toast notification appeared (5 sec)
□ Test notification received while app closed
□ System notification appeared
□ Different notification types display different colors
□ Manual dismiss button works
□ Notification data logged to console

===============================================================================
                         NEXT STEPS
===============================================================================

1. Configure Firebase project (get credentials)
2. Create .env file with Firebase config
3. Restart frontend dev server
4. Allow notifications in browser
5. Test from Firebase Console
6. Integrate with backend token storage (optional)

OPTIONAL ENHANCEMENTS:
- Add notification persistence (localStorage)
- Add notification history page
- Add notification preferences/settings
- Add do-not-disturb hours
- Add notification sounds
- Add notification badges on tabs
- Add analytics tracking

===============================================================================
                      FIREBASE CONSOLE GUIDE
===============================================================================

TO SEND TEST NOTIFICATION:

1. Go to https://console.firebase.google.com
2. Select your project
3. Go to "Messaging"
4. Click "Create Campaign"
5. Select "Firebase Notification messages"
6. Enter title & body
7. Go to "Target"
8. Select "Single Device"
9. Paste FCM token from browser console
10. Click "Review"
11. Click "Publish"

EXPECTED RESULT:
- If frontend is open: Toast appears
- If frontend is closed: System notification shows

===============================================================================
                         SUPPORT RESOURCES
===============================================================================

Firebase Documentation:
https://firebase.google.com/docs/cloud-messaging/js/client

React Integration:
https://github.com/react-redux-firebase/react-redux-firebase

Browser API (Service Workers):
https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

Notification API:
https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API

===============================================================================
                            END OF GUIDE
===============================================================================
