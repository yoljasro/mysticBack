const mongoose = require('mongoose');

// Models (CommonJS)
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const Chat = require('../models/Chat');
const Interaction = require('../models/Interaction');
const LunarDay = require('../models/LunarDay');
const Message = require('../models/Message');
const NatalChart = require('../models/NatalChart');
const Notification = require('../models/Notification');
const Otp = require('../models/Otp');
const Prediction = require('../models/Prediction');
const TarotCard = require('../models/TarotCard');
const TarotHistory = require('../models/TarotHistory');
const Horoscope = require('../models/Horoscope');

const initAdmin = async () => {
    // Dynamic imports for ESM modules
    const { default: AdminJS } = await import('adminjs');
    const AdminJSExpress = await import('@adminjs/express');
    const AdminJSMongoose = await import('@adminjs/mongoose');

    AdminJS.registerAdapter(AdminJSMongoose);

    const adminOptions = {
        resources: [
            { resource: User, options: { navigation: { name: 'Users', icon: 'User' } } },
            { resource: TarotCard, options: { navigation: { name: 'Tarot', icon: 'Layers' } } },
            { resource: TarotHistory, options: { navigation: { name: 'Tarot', icon: 'History' } } },
            { resource: NatalChart, options: { navigation: { name: 'Astrology', icon: 'Star' } } },
            { resource: LunarDay, options: { navigation: { name: 'Astrology', icon: 'Moon' } } },
            { resource: Prediction, options: { navigation: { name: 'Astrology', icon: 'CrystalBall' } } },
            { resource: Horoscope, options: { navigation: { name: 'Astrology', icon: 'Compass' } } },
            { resource: Chat, options: { navigation: { name: 'Messages', icon: 'Chat' } } },
            { resource: Message, options: { navigation: { name: 'Messages', icon: 'Send' } } },
            { resource: Interaction, options: { navigation: { name: 'Engagement', icon: 'Heart' } } },
            { resource: Achievement, options: { navigation: { name: 'Engagement', icon: 'Award' } } },
            { resource: Notification, options: { navigation: { name: 'System', icon: 'Bell' } } },
            { resource: Otp, options: { navigation: { name: 'System', icon: 'Lock' } } },
        ],
        branding: {
            companyName: 'Mystic Admin',
            theme: {
                colors: { primary100: '#6d28d9' } // Purple premium look
            },
            logo: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png',
        },
        rootPath: '/admin',
    };

    const admin = new AdminJS(adminOptions);

    const auth = {
        authenticate: async (email, password) => {
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                return { email: process.env.ADMIN_EMAIL };
            }
            return null;
        },
        cookiePassword: process.env.SESSION_SECRET || 'mystic_admin_session_secret_777_long_enough',
    };

    const router = AdminJSExpress.buildAuthenticatedRouter(
        admin,
        auth,
        null, // No predefined router
        {
            resave: false,
            saveUninitialized: true,
            secret: process.env.SESSION_SECRET || 'mystic_admin_session_secret_777_long_enough',
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            }
        }
    );

    return { admin, router };
};

module.exports = initAdmin;
