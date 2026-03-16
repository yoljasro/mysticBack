const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TarotCard = require('./models/TarotCard');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mystic')
    .then(() => console.log('MongoDB connected for seeding Tarot Cards...'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const tarotData = [
    {
        name: "Карта Звезды",
        description: "Надежда и вдохновение освещают ваш путь. Следуйте за своей мечтой.",
        loveForecast: {
            description: "Ваши чувства обретают новую глубину и ясность.",
            strongPoint: "Глубина",
            watchOut: "Идеализация",
            tipOfTheDay: "Не колебаться, если захочешь написать первой"
        },
        careerForecast: {
            description: "Время для новых идей и творческих проектов.",
            strongPoint: "Вдохновение",
            watchOut: "Нереалистичные цели",
            tipOfTheDay: "Начните проект, о котором давно мечтали."
        },
        healthForecast: {
            description: "Ваша энергия на подъеме, отличное время для восстановления.",
            strongPoint: "Витализм",
            watchOut: "Переутомление",
            tipOfTheDay: "Проведите вечер на свежем воздухе."
        },
        image: 'star_card.png'
    },
    {
        name: "Влюбленные",
        description: "Гармония, союз и важный выбор. Прислушайтесь к своему сердцу.",
        loveForecast: {
            description: "Наступает время искренности и глубокой привязанности.",
            strongPoint: "Связь",
            watchOut: "Нерешительность",
            tipOfTheDay: "Будьте открыты для новых чувств и искреннего общения."
        },
        careerForecast: {
            description: "Командная работа принесет отличные результаты.",
            strongPoint: "Сотрудничество",
            watchOut: "Конфликты интересов",
            tipOfTheDay: "Уделите время налаживанию связей с коллегами."
        },
        healthForecast: {
            description: "Баланс во всем — залог вашего хорошего самочувствия.",
            strongPoint: "Гармония",
            watchOut: "Эмоциональное выгорание",
            tipOfTheDay: "Займитесь йогой или медитацией."
        },
        image: 'lovers_card.png'
    },
    {
        name: "Солнце",
        description: "Радость, успех и жизненная энергия. Все складывается наилучшим образом.",
        loveForecast: {
            description: "Ваши отношения наполнены теплом и светом.",
            strongPoint: "Теплота",
            watchOut: "Эгоизм",
            tipOfTheDay: "Подарите свою улыбку тому, кто вам дорог."
        },
        careerForecast: {
            description: "Ваши старания будут замечены и вознаграждены.",
            strongPoint: "Признание",
            watchOut: "Самоуверенность",
            tipOfTheDay: "Верьте в свои силы и двигайтесь вперед."
        },
        healthForecast: {
            description: "Вы полны сил и бодрости. Организм в отличной форме.",
            strongPoint: "Бодрость",
            watchOut: "Перегрев",
            tipOfTheDay: "Займитесь активным спортом."
        },
        image: 'sun_card.png'
    },
    {
        name: "Луна",
        description: "Интуиция, тайны и подсознание. Обратите внимание на свои сны и предчувствия.",
        loveForecast: {
            description: "В чувствах может быть неопределенность, доверяйте интуиции.",
            strongPoint: "Интуиция",
            watchOut: "Иллюзии",
            tipOfTheDay: "Прислушайтесь к внутреннему голосу в вопросах любви."
        },
        careerForecast: {
            description: "Не все факты на виду. Будьте осторожны в делах.",
            strongPoint: "Проницательность",
            watchOut: "Обман",
            tipOfTheDay: "Тщательно проверяйте информацию."
        },
        healthForecast: {
            description: "Обратите внимание на качество сна и психологическое состояние.",
            strongPoint: "Чувствительность",
            watchOut: "Бессонница",
            tipOfTheDay: "Избегайте стресса перед сном."
        },
        image: 'moon_card.png'
    },
    {
        name: "Императрица",
        description: "Плодородие, изобилие и материнская забота. Время для роста и создания комфорта.",
        loveForecast: {
            description: "Ваша женственность/мужественность привлекает партнеров.",
            strongPoint: "Забота",
            watchOut: "Гиперопека",
            tipOfTheDay: "Проявите ласку и внимание к своему партнеру."
        },
        careerForecast: {
            description: "Период процветания и стабильного роста.",
            strongPoint: "Изобилие",
            watchOut: "Лень",
            tipOfTheDay: "Поддерживайте порядок на рабочем месте."
        },
        healthForecast: {
            description: "Прекрасное время для заботы о теле и красоты.",
            strongPoint: "Красота",
            watchOut: "Излишества",
            tipOfTheDay: "Побалуйте себя спа-процедурами."
        },
        image: 'empress_card.png'
    }
];

const seedTarotCards = async () => {
    try {
        await TarotCard.deleteMany({});
        console.log('Cleared existing tarot cards.');

        await TarotCard.insertMany(tarotData);
        console.log('Tarot cards seeded successfully.');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding tarot cards:', err);
        process.exit(1);
    }
};

seedTarotCards();
