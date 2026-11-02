// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging.js')

const firebaseConfig = {
  apiKey: 'AIzaSyDummyKeyForDevelopment',
  authDomain: 'careflow-ai.firebaseapp.com',
  projectId: 'careflow-ai',
  storageBucket: 'careflow-ai.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456',
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
    badge: '/badge.png',
    data: payload.data,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})