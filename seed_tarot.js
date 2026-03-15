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
            strength: 'Глубина',
            focus: 'Эмоции',
            tipOfTheDay: 'Не колебаться, если захочешь написать первой'
        },
        image: 'star_card.png'
    },
    {
        name: "Влюбленные",
        description: "Гармония, союз и важный выбор. Прислушайтесь к своему сердцу.",
        loveForecast: {
            strength: 'Связь',
            focus: 'Отношения',
            tipOfTheDay: 'Будьте открыты для новых чувств и искреннего общения.'
        },
        image: 'lovers_card.png'
    },
    {
        name: "Солнце",
        description: "Радость, успех и жизненная энергия. Все складывается наилучшим образом.",
        loveForecast: {
            strength: 'Теплота',
            focus: 'Позитив',
            tipOfTheDay: 'Подарите свою улыбку тому, кто вам дорог.'
        },
        image: 'sun_card.png'
    },
    {
        name: "Луна",
        description: "Интуиция, тайны и подсознание. Обратите внимание на свои сны и предчувствия.",
        loveForecast: {
            strength: 'Интуиция',
            focus: 'Скрытые мотивы',
            tipOfTheDay: 'Прислушайтесь к внутреннему голосу в вопросах любви.'
        },
        image: 'moon_card.png'
    },
    {
        name: "Императрица",
        description: "Плодородие, изобилие и материнская забота. Время для роста и создания комфорта.",
        loveForecast: {
            strength: 'Забота',
            focus: 'Чувственность',
            tipOfTheDay: 'Проявите ласку и внимание к своему партнеру.'
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
