// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAp0BhYezMJ8Gr8N5KpC3R5vmWyWOsKwqA",
  authDomain: "miniplan-c5a98.firebaseapp.com",
  projectId: "miniplan-c5a98",
  storageBucket: "miniplan-c5a98.appspot.com",
  messagingSenderId: "315359306607",
  appId: "1:315359306607:web:f731f6ec2501bd2fc51964",
  vapidKey: "BOuTkXYpT5zCUKAmNcFJGACWtTC5jYQmCR5A_qn0y6U2gv24rUEokiaVgdHQGPp_d7RROYxxjUtIi3OPrJUZimU"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('📦 Received background message ', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png' // bạn có thể thay icon khác nếu muốn
  });
});
