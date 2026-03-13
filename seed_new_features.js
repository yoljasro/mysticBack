const mongoose = require('mongoose');
const User = require('./models/User');
const Achievement = require('./models/Achievement');
const Prediction = require('./models/Prediction');
const Notification = require('./models/Notification');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mystic');
        console.log('Connected to DB for seeding');

        const user = await User.findOne();
        if (!user) {
            console.log('No user found to seed data for.');
            process.exit(0);
        }

        const userId = user._id;

        // Seed Achievements
        await Achievement.deleteMany({ user: userId });
        await Achievement.create([
            { user: userId, title: '14 dney v ryadu', icon: '🔥' },
            { user: userId, title: '7 dney v ryadu', icon: '🌙' },
            { user: userId, title: '7 dney v ryadu', icon: '🌌' },
            { user: userId, title: '7 dney v ryadu', icon: '🌸' }
        ]);

        // Seed Predictions
        await Prediction.deleteMany({ user: userId });
        await Prediction.create([
            { user: userId, title: 'Uspeh v delah', content: 'Ne zabudte obnovit profil...', date: '2026-03-13' },
            { user: userId, title: 'Aktivnost v chate', content: 'Vash sobesednik otpravil soobshenie...', date: '2026-03-12' }
        ]);

        // Seed Notifications
        await Notification.deleteMany({ user: userId });
        await Notification.create([
            { user: userId, title: 'Uspeh v delah', body: 'Ne zabudte obnovit profil i dobavit noviye foto...', type: 'horoscope' },
            { user: userId, title: 'Aktivnost v chate', body: 'Vash sobesednik otpravil soobshenie. Otkroyte chat...', type: 'message' },
            { user: userId, title: 'Aktivnost v chate', body: 'Vash sobesednik otpravil soobshenie. Otkroyte chat...', type: 'message' }
        ]);

        console.log('Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
