const { Expo } = require('expo-server-sdk');

const expo = new Expo();

exports.sendPushNotification = async (tokens, notification) => {
    // Faqat Expo tokenlarni filterlash
    const validTokens = tokens.filter(t => Expo.isExpoPushToken(t));

    if (validTokens.length === 0) {
        return;
    }

    const messages = validTokens.map(token => ({
        to: token,
        sound: 'default',
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
    }));

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
        try {
            await expo.sendPushNotificationsAsync(chunk);
        } catch (error) {
            console.error('Push notification error:', error);
        }
    }
};
