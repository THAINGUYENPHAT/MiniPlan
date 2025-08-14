const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const MINUTES_BEFORE = 10;

exports.checkDeadlines = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    const now = new Date();
    const todosSnapshot = await db.collection("todos").get();

    todosSnapshot.forEach(async (docSnap) => {
      const todo = docSnap.data();
      const deadline = todo.deadline ? new Date(todo.deadline) : null;

      if (deadline) {
        const diffMinutes = (deadline - now) / 1000 / 60;
        if (diffMinutes > 0 && diffMinutes <= MINUTES_BEFORE) {
          const tokenSnap = await db.collection("userTokens").get();
          tokenSnap.forEach(async (t) => {
            if (t.id === todo.userId) {
              const token = t.data().token;
              const message = {
                token,
                notification: {
                  title: "Nhắc nhở công việc",
                  body: `Deadline sắp tới: ${todo.text}`,
                },
              };
              await admin.messaging().send(message);
            }
          });
        }
      }
    });

    return null;
  });
