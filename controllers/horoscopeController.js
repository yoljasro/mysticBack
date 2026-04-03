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
            return res.status(400).json({ message: 'Zodiac sign not provided and could not be determined.' });
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
                general: "Zvezdi segodnya molchat. Proverte pozje ili viberite druguyu datu.",
                love: "Lyubovi nikogda ne bivayet slishkom mnogo.",
                career: "Vash put k uspehu chist.",
                health: "Beregyite sebya i svoi sili."
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
        { id: 'aries', name: 'Aries', dates: 'Mar 21 - Apr 19', icon: '♈' },
        { id: 'taurus', name: 'Taurus', dates: 'Apr 20 - May 20', icon: '♉' },
        { id: 'gemini', name: 'Gemini', dates: 'May 21 - Jun 20', icon: '♊' },
        { id: 'cancer', name: 'Cancer', dates: 'Jun 21 - Jul 22', icon: '♋' },
        { id: 'leo', name: 'Leo', dates: 'Jul 23 - Aug 22', icon: '♌' },
        { id: 'virgo', name: 'Virgo', dates: 'Aug 23 - Sep 22', icon: '♍' },
        { id: 'libra', name: 'Libra', dates: 'Sep 23 - Oct 22', icon: '♎' },
        { id: 'scorpio', name: 'Scorpio', dates: 'Oct 23 - Nov 21', icon: '♏' },
        { id: 'sagittarius', name: 'Sagittarius', dates: 'Nov 22 - Dec 21', icon: '♐' },
        { id: 'capricorn', name: 'Capricorn', dates: 'Dec 22 - Jan 19', icon: '♑' },
        { id: 'aquarius', name: 'Aquarius', dates: 'Jan 20 - Feb 18', icon: '♒' },
        { id: 'pisces', name: 'Pisces', dates: 'Feb 19 - Mar 20', icon: '♓' }
    ];
    res.json(signs);
});

module.exports = {
    getHoroscope,
    getSignsList,
    getZodiacSign
};
