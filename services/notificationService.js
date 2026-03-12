const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You need to place your serviceAccountKey.json in the root directory
try {
    const serviceAccount = require('../../serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized");
} catch (error) {
    console.warn("Firebase Admin NOT initialized: serviceAccountKey.json missing or invalid.");
}

exports.sendPushNotification = async (tokens, notification) => {
    if (!admin.apps.length) {
        console.warn("Skipping push notification: Firebase Admin not initialized.");
        return;
    }

    const message = {
        notification: {
            title: notification.title,
            body: notification.body,
        },
        data: notification.data || {},
        tokens: tokens,
    };

    try {
        const response = await admin.messaging().sendMulticast(message);
        console.log(`${response.successCount} messages were sent successfully`);

        if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(tokens[idx]);
                }
            });
            console.log('List of tokens that caused failures: ' + failedTokens);
        }
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
};
