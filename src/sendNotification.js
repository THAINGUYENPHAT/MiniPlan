import admin from "./firebaseAdmin.js";

const fcmToken = "fHdvgw_utBUFKUc4tzRPEM:APA91bEipohJsvC-mbme23osF7SQZBy1_lexUd6PqpcqfNkbgVtL6wCPejgvRCtJy1xpf3Aif4Q6TgjjPoJiBtEOROg7K5p8chMKq1R3L6Kc-qYbjjKBKzM";

const message = {
  token: fcmToken,  // dùng đúng biến
  notification: {
    title: "Nhắc nhở công việc",
    body: "Bạn có deadline sắp tới!",
  },
};

admin
  .messaging()
  .send(message)
  .then((response) => {
    console.log("Successfully sent message:", response);
  })
  .catch((error) => {
    console.error("Error sending message:", error);
  });
