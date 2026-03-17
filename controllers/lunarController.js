const LunarDay = require('../models/LunarDay');
const User = require('../models/User');
const { getMoonPhaseName, getZodiacSignFromLongitude } = require('../utils/astrology');
const Astronomy = require('astronomy-engine');

// Helper to generate a dummy LunarDay if it doesn't exist in DB
const generateMockLunarDay = async (dateStr) => {
    const date = new Date(dateStr);
    const observer = new Astronomy.Observer(0, 0, 0);
    const astroTime = Astronomy.MakeTime(date);

    // Get Moon position
    const equat = Astronomy.Equator(Astronomy.Body.Moon, astroTime, observer, true, true);
    const ecliptic = Astronomy.Ecliptic(equat.vec);
    const moonSign = getZodiacSignFromLongitude(ecliptic.elon);
    const moonPhase = getMoonPhaseName(date);

    // Tip of the day based on moon phase
    let tip = "Хороший день для планирования.";
    if (moonPhase === "Новолуние") tip = "Начинайте новые дела и ставьте цели.";
    if (moonPhase === "Полнолуние") tip = "Будьте осторожны с эмоциями, лучше отдохнуть.";
    if (moonPhase.includes("Убывающая")) tip = "Завершайте начатые проекты, очищайте пространство.";
    if (moonPhase.includes("Растущая")) tip = "Хорошее время для роста и обучения.";

    const defaultPractices = [
        { type: "Медитация", title: "Очищение энергии", description: "Сядьте в удобную позу и сфокусируйтесь на дыхании..." },
        { type: "Чек-лист", title: "Очищение пространства", description: "Уберите лишние вещи с рабочего стола..." },
        { type: "Аффирмация", title: "Я открыт для новых потоков энергии и готов к позитивным переменам.", description: "Повторяйте эту фразу утром перед зеркалом." }
    ];

    const newDay = new LunarDay({
        date: dateStr,
        moonPhase: moonPhase,
        zodiacSign: moonSign,
        lunarDayNumber: Math.floor(Math.random() * 29) + 1, // Lunar day number still random as it's complex to calculate exactly without more time
        scores: {
            health: Math.floor(Math.random() * 100),
            work: Math.floor(Math.random() * 100),
            relationships: Math.floor(Math.random() * 100),
            haircut: Math.floor(Math.random() * 100),
        },
        tipOfTheDay: tip,
        practices: defaultPractices
    });

    return await newDay.save();
};

// 1. Get info for a specific date (Детальный день)
exports.getDayDetails = async (req, res) => {
    try {
        const { date } = req.params; // Format 'YYYY-MM-DD'
        let lunarInfo = await LunarDay.findOne({ date });

        // If the date is not in DB, generate dummy info on the fly for UI integration
        if (!lunarInfo) {
            lunarInfo = await generateMockLunarDay(date);
        }

        res.status(200).json(lunarInfo);
    } catch (error) {
        console.error("getDayDetails error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 2. Get info for an entire month (Главный календарь)
exports.getMonthOverview = async (req, res) => {
    try {
        const { year, month } = req.params;
        // Search dates matching YYYY-MM prefix
        const datePrefix = `${year}-${month.padStart(2, '0')}`;
        const days = await LunarDay.find({ date: new RegExp(`^${datePrefix}`) })
            .select('date moonPhase zodiacSign lunarDayNumber');

        // This will only return days that exist in the DB. 
        // For a full calendar, the frontend can query `/day/:date` for specifics if missing.
        res.status(200).json(days);
    } catch (error) {
        console.error("getMonthOverview error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 3. Update User Lunar Settings for Push Notifications (Настройки)
exports.updateSettings = async (req, res) => {
    try {
        const { newAndFullMoon, moonPhaseChange, tipOfTheDay, affirmation } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    "lunarSettings.newAndFullMoon": newAndFullMoon !== undefined ? newAndFullMoon : true,
                    "lunarSettings.moonPhaseChange": moonPhaseChange !== undefined ? moonPhaseChange : true,
                    "lunarSettings.tipOfTheDay": tipOfTheDay !== undefined ? tipOfTheDay : true,
                    "lunarSettings.affirmation": affirmation !== undefined ? affirmation : true
                }
            },
            { new: true }
        ).select("lunarSettings");

        res.status(200).json(updatedUser.lunarSettings);
    } catch (error) {
        console.error("updateLunarSettings error:", error);
        res.status(500).json({ error: error.message });
    }
};
