const Astronomy = require('astronomy-engine');

const getZodiacSign = (date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();

    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Водолей";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Рыбы";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Овен";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Телец";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Близнецы";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Рак";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Лев";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Дева";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Весы";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Скорпион";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Стрелец";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Козерог";

    return "";
};

const getZodiacSignFromLongitude = (longitude) => {
    const signs = [
        "Овен", "Телец", "Близнецы", "Рак", "Лев", "Дева",
        "Весы", "Скорпион", "Стрелец", "Козерог", "Водолей", "Рыбы"
    ];
    const index = Math.floor(longitude / 30);
    return signs[index % 12];
};

const getMoonPhaseName = (date) => {
    const phase = Astronomy.MoonPhase(date);
    if (phase < 6.25 || phase > 353.75) return "Новолуние";
    if (phase < 83.75) return "Растущая Луна";
    if (phase < 96.25) return "Первая четверть";
    if (phase < 173.75) return "Растущая Луна";
    if (phase < 186.25) return "Полнолуние";
    if (phase < 263.75) return "Убывающая Луна";
    if (phase < 276.25) return "Последняя четверть";
    return "Убывающая Луна";
};

const getNatalData = (date, lat = 0, lon = 0) => {
    const observer = new Astronomy.Observer(lat, lon, 0);
    const time = Astronomy.Seasons(date.getFullYear()).mar_equinox; // Just a placeholder time object base
    // Actually we need a proper Astronomy.Time object
    const astroTime = Astronomy.MakeTime(date);

    const bodies = [
        Astronomy.Body.Sun, Astronomy.Body.Moon, Astronomy.Body.Mercury,
        Astronomy.Body.Venus, Astronomy.Body.Mars, Astronomy.Body.Jupiter,
        Astronomy.Body.Saturn, Astronomy.Body.Uranus, Astronomy.Body.Neptune,
        Astronomy.Body.Pluto
    ];

    const bodyNames = {
        "Sun": "Солнце", "Moon": "Луна", "Mercury": "Меркурий",
        "Venus": "Венера", "Mars": "Марс", "Jupiter": "Юпитер",
        "Saturn": "Сатурн", "Uranus": "Уран", "Neptune": "Нептун",
        "Pluto": "Плутон"
    };

    const planets = bodies.map(body => {
        const equat = Astronomy.Equator(body, astroTime, observer, true, true);
        const ecliptic = Astronomy.Ecliptic(equat.vec);
        return {
            name: bodyNames[body] || body,
            sign: getZodiacSignFromLongitude(ecliptic.elon),
            longitude: ecliptic.elon
        };
    });

    // Simple House calculation (Equal House System for simplicity as astronomy-engine doesn't have built-in Placidus)
    // We need Sidereal Time for precise houses, but let's approximate or just use signs for now if we don't want too much complexity.
    // For a real "Natal Chart", houses are critical.

    return { planets };
};

const getElementForSign = (sign) => {
    const elements = {
        "Огонь": ["Овен", "Лев", "Стрелец"],
        "Земля": ["Телец", "Дева", "Козерог"],
        "Воздух": ["Близнецы", "Весы", "Водолей"],
        "Вода": ["Рак", "Скорпион", "Рыбы"]
    };
    for (const [element, signs] of Object.entries(elements)) {
        if (signs.includes(sign)) return element;
    }
    return null;
};

const getModalityForSign = (sign) => {
    const modalities = {
        "Кардинальный": ["Овен", "Рак", "Весы", "Козерог"],
        "Фиксированный": ["Телец", "Лев", "Скорпион", "Водолей"],
        "Мутабельный": ["Близнецы", "Дева", "Стрелец", "Рыбы"]
    };
    for (const [modality, signs] of Object.entries(modalities)) {
        if (signs.includes(sign)) return modality;
    }
    return null;
};

const calculateZodiacCompatibility = (sign1, sign2) => {
    if (!sign1 || !sign2) return 50;
    if (sign1 === sign2) return 80;

    const el1 = getElementForSign(sign1);
    const el2 = getElementForSign(sign2);

    let score = 50;

    // Element compatibility
    if (el1 === el2) {
        score += 30; // Same element is very compatible
    } else if (
        (el1 === "Огонь" && el2 === "Воздух") || (el1 === "Воздух" && el2 === "Огонь") ||
        (el1 === "Земля" && el2 === "Вода") || (el1 === "Вода" && el2 === "Земля")
    ) {
        score += 20; // Complementary elements
    } else if (
        (el1 === "Огонь" && el2 === "Вода") || (el1 === "Вода" && el2 === "Огонь") ||
        (el1 === "Земля" && el2 === "Воздух") || (el1 === "Воздух" && el2 === "Земля")
    ) {
        score -= 20; // Challenging elements
    }

    const mod1 = getModalityForSign(sign1);
    const mod2 = getModalityForSign(sign2);

    // Modality compatibility (simplified)
    if (mod1 === mod2 && mod1 === "Фиксированный") {
        score -= 10; // Two fixed signs can clash
    } else if (mod1 !== mod2) {
        score += 5; // Different modalities often balance each other
    }

    return Math.max(10, Math.min(99, score)); // clamp between 10 and 99
};

module.exports = { 
    getZodiacSign, 
    getMoonPhaseName, 
    getZodiacSignFromLongitude, 
    getNatalData,
    getElementForSign,
    getModalityForSign,
    calculateZodiacCompatibility
};
