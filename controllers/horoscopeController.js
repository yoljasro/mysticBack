const Horoscope = require('../models/Horoscope');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Determine zodiac sign from date of birth
 * @param   {Date} dob - Born date
 * @returns {String} - Sign name in lowercase
 */
const getZodiacSign = (dob) => {
    const date = new Date(dob);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // 1-indexed

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces';
    return '';
};

/**
 * @desc    Get horoscope prediction
 * @route   GET /api/horoscope
 * @access  Private
 */
const getHoroscope = asyncHandler(async (req, res) => {
    let { sign, type, date } = req.query;

    type = type || 'daily';
    
    // If no sign provided, use user's sign
    if (!sign) {
        const user = await User.findById(req.user.id);
        if (user && user.zodiacSign) {
            sign = user.zodiacSign.toLowerCase();
        } else if (user && user.dateOfBirth) {
            sign = getZodiacSign(user.dateOfBirth);
        } else {
            return res.status(400).json({ message: 'Знак зодиака не указан и не может быть определен.' });
        }
    }

    // Default date if missing
    if (!date) {
        const now = new Date();
        if (type === 'daily') {
            date = now.toISOString().split('T')[0];
        } else if (type === 'weekly') {
            // Simple week calculation (Year + WeekNumber)
            const oneJan = new Date(now.getFullYear(), 0, 1);
            const numberOfDays = Math.floor((now - oneJan) / (24 * 60 * 60 * 1000));
            const weekNumber = Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
            date = `${now.getFullYear()}-W${weekNumber}`;
        } else if (type === 'monthly') {
            date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        }
    }

    const horoscope = await Horoscope.findOne({ sign: sign.toLowerCase(), type, date });

    if (!horoscope) {
        return res.status(200).json({
            sign,
            type,
            date,
            predictions: {
                general: "Звезды сегодня молчат. Проверьте позже или выберите другую дату.",
                love: "Любви никогда не бывает слишком много.",
                career: "Ваш путь к успеху чист.",
                health: "Берегите себя и свои силы."
            },
            luckyNumber: Math.floor(Math.random() * 100),
            luckyColor: "Azure",
            compatibility: ['leo', 'libra'] // Example placeholder
        });
    }

    res.json(horoscope);
});

/**
 * @desc    Get list of all 12 signs with their date ranges
 * @route   GET /api/horoscope/signs
 * @access  Public
 */
const getSignsList = asyncHandler(async (req, res) => {
    const signs = [
        { id: 'aries', name: 'Овен', dates: '21 мар - 19 апр', icon: '♈' },
        { id: 'taurus', name: 'Телец', dates: '20 апр - 20 мая', icon: '♉' },
        { id: 'gemini', name: 'Близнецы', dates: '21 мая - 20 июн', icon: '♊' },
        { id: 'cancer', name: 'Рак', dates: '21 июн - 22 июл', icon: '♋' },
        { id: 'leo', name: 'Лев', dates: '23 июл - 22 авг', icon: '♌' },
        { id: 'virgo', name: 'Дева', dates: '23 авг - 22 сен', icon: '♍' },
        { id: 'libra', name: 'Весы', dates: '23 сен - 22 окт', icon: '♎' },
        { id: 'scorpio', name: 'Скорпион', dates: '23 окт - 21 ноя', icon: '♏' },
        { id: 'sagittarius', name: 'Стрелец', dates: '22 ноя - 21 дек', icon: '♐' },
        { id: 'capricorn', name: 'Козерог', dates: '22 дек - 19 янв', icon: '♑' },
        { id: 'aquarius', name: 'Водолей', dates: '20 янв - 18 фев', icon: '♒' },
        { id: 'pisces', name: 'Рыбы', dates: '19 фев - 20 мар', icon: '♓' }
    ];
    res.json(signs);
});

module.exports = {
    getHoroscope,
    getSignsList,
    getZodiacSign
};
