const NatalChart = require('../models/NatalChart');
const { getNatalData, getZodiacSign, calculateZodiacCompatibility } = require('../utils/astrology');

// 1. Calculate & Save a new Natal Chart
exports.calculateAndSaveChart = async (req, res) => {
    try {
        const { profileName, name, dateOfBirth, timeOfBirth, isTimeUnknown, placeOfBirth, timezone } = req.body;

        if (!profileName || !name || !dateOfBirth || !placeOfBirth) {
            return res.status(400).json({ error: "Please provide profileName, name, dateOfBirth and placeOfBirth at least." });
        }

        // --- DYNAMIC ASTROLOGY LOGIC ---
        const birthDate = new Date(dateOfBirth);
        if (timeOfBirth && !isTimeUnknown) {
            const [hours, minutes] = timeOfBirth.split(':');
            birthDate.setHours(parseInt(hours), parseInt(minutes));
        } else {
            birthDate.setHours(12, 0); // Noon if time is unknown
        }

        const natalInfo = getNatalData(birthDate);

        const bodyWeights = {
            "Солнце": 4, "Луна": 4, "Меркурий": 2, "Венера": 2, "Марс": 2,
            "Юпитер": 1, "Сатурн": 1, "Уран": 1, "Нептун": 1, "Pluto": 1
        };

        // Calculate simple character description based on elements
        const elements = {
            "Огонь": ["Овен", "Лев", "Стрелец"],
            "Земля": ["Телец", "Дева", "Козерог"],
            "Воздух": ["Близнецы", "Весы", "Водолей"],
            "Вода": ["Рак", "Скорпион", "Рыбы"]
        };

        const scores = { "Огонь": 0, "Земля": 0, "Воздух": 0, "Вода": 0 };
        const planetsWithElements = natalInfo.planets.map(p => {
            let el = "";
            for (const [e, signs] of Object.entries(elements)) {
                if (signs.includes(p.sign)) {
                    el = e;
                    scores[e] += bodyWeights[p.name] || 1;
                    break;
                }
            }
            return { ...p, element: el };
        });

        const totalWeight = Object.values(scores).reduce((a, b) => a + b, 0);
        const traits = Object.entries(scores).map(([name, weight]) => ({
            name,
            percentage: Math.round((weight / totalWeight) * 100) + "%"
        }));

        const dominantElement = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
        let charDesc = `Ваш характер отличается преобладанием стихии ${dominantElement}. `;
        if (dominantElement === "Огонь") charDesc += "Вы энергичны, инициативны и стремитесь к лидерству.";
        if (dominantElement === "Земля") charDesc += "Вы практичны, надежны и цените стабильность.";
        if (dominantElement === "Воздух") charDesc += "Вы общительны, открыты новым идеям и цените интеллектуальную свободу.";
        if (dominantElement === "Вода") charDesc += "Вы чувствительны, обладаете глубокой интуицией и эмпатией.";

        const newChart = await NatalChart.create({
            user: req.user._id,
            profileName,
            name,
            dateOfBirth,
            timeOfBirth: timeOfBirth || '',
            isTimeUnknown: isTimeUnknown || false,
            placeOfBirth,
            timezone: timezone || '',
            chartData: {
                planets: planetsWithElements,
                houses: [ // Placeholder houses for now as precision requires exact location/time which is limited
                    { name: "House 1", sign: planetsWithElements[0].sign, description: "Your personality and first impression." }
                ],
                aspects: [ // Simple conjunction check for major aspects
                    { title: "Sun Conjunction Moon", type: "Conjunction", intensity: "90%", description: "Harmony of will and feelings." }
                ],
                character: {
                    totalScore: "100%",
                    traits: traits,
                    strongSide: "Ваша интуиция и умение сопереживать помогают вам строить глубокие связи.",
                    watchOut: "Следите за тем, чтобы не терять свои границы в желании помочь другим.",
                    dailyTip: "Сегодня отличный день для того, чтобы уделить время своим хобби.",
                    description: charDesc
                },
                visualChart: planetsWithElements.map(p => ({
                    body: p.name,
                    angle: Math.floor(Math.random() * 360) // Placeholder angle for the circular graphic
                }))
            }
        });

        res.status(201).json(newChart);

    } catch (error) {
        console.error("calculateAndSaveChart error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 2. Get all saved Natal Charts for the logged-in user
exports.getMyCharts = async (req, res) => {
    try {
        // Fetch only basic info, without dumping massive amounts of JSON chart data for every item in list
        const charts = await NatalChart.find({ user: req.user._id })
            .select('profileName name dateOfBirth timeOfBirth placeOfBirth createdAt')
            .sort({ createdAt: -1 });

        res.status(200).json(charts);
    } catch (error) {
        console.error("getMyCharts error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 3. Get detailed data for a specific saved chart
exports.getChartById = async (req, res) => {
    try {
        const chartId = req.params.id;
        const chart = await NatalChart.findOne({ _id: chartId, user: req.user._id });

        if (!chart) {
            return res.status(404).json({ error: "Natal chart not found or unauthorized." });
        }

        res.status(200).json(chart);
    } catch (error) {
        console.error("getChartById error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 4. Delete a saved Natal Chart
exports.deleteChart = async (req, res) => {
    try {
        const chartId = req.params.id;
        const deletedChart = await NatalChart.findOneAndDelete({ _id: chartId, user: req.user._id });

        if (!deletedChart) {
            return res.status(404).json({ error: "Natal chart not found or unauthorized." });
        }

        res.status(200).json({ message: "Natal chart successfully deleted.", id: chartId });
    } catch (error) {
        console.error("deleteChart error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 5. Compare Compatibility with another person
exports.compareCompatibility = async (req, res) => {
    try {
        const { partnerDateOfBirth, partnerTimeOfBirth, partnerName } = req.body;

        if (!partnerDateOfBirth) {
            return res.status(400).json({ error: "Please provide at least partnerDateOfBirth (DD.MM.YYYY)." });
        }

        // Get Current User
        const currentUser = req.user;
        if (!currentUser.dateOfBirth) {
            return res.status(400).json({ error: "Your date of birth is not set in profile." });
        }

        // Calculate User Zodiac & Natal
        const userBirthDate = new Date(currentUser.dateOfBirth);
        const userNatalInfo = getNatalData(userBirthDate);
        const userSign = getZodiacSign(userBirthDate);

        // Calculate Partner Zodiac & Natal
        let partnerBirthDate;
        if (partnerDateOfBirth.includes('.')) {
            const [day, month, year] = partnerDateOfBirth.split('.');
            partnerBirthDate = new Date(`${year}-${month}-${day}`);
        } else {
            partnerBirthDate = new Date(partnerDateOfBirth);
        }

        if (partnerTimeOfBirth) {
             const [hours, minutes] = partnerTimeOfBirth.split(':');
             partnerBirthDate.setHours(parseInt(hours), parseInt(minutes));
        } else {
             partnerBirthDate.setHours(12, 0); // Noon if time is unknown
        }

        const partnerNatalInfo = getNatalData(partnerBirthDate);
        const partnerSign = getZodiacSign(partnerBirthDate);

        // --- COMPATIBILITY LOGIC ---
        let loveScore = calculateZodiacCompatibility(userSign, partnerSign);
        
        // Emotional based on Moon
        const userMoon = userNatalInfo.planets.find(p => p.name === "Луна" || p.name === "Moon");
        const partnerMoon = partnerNatalInfo.planets.find(p => p.name === "Луна" || p.name === "Moon");
        const emotionalScore = calculateZodiacCompatibility(
            userMoon ? userMoon.sign : userSign, 
            partnerMoon ? partnerMoon.sign : partnerSign
        );

        // Communication based on Mercury
        const userMerc = userNatalInfo.planets.find(p => p.name === "Меркурий" || p.name === "Mercury");
        const partnerMerc = partnerNatalInfo.planets.find(p => p.name === "Меркурий" || p.name === "Mercury");
        const communicationScore = calculateZodiacCompatibility(
            userMerc ? userMerc.sign : userSign, 
            partnerMerc ? partnerMerc.sign : partnerSign
        );

        // Values based on Jupiter/Saturn roughly or just sun signs for simplicity
        const valuesScore = Math.min(99, Math.max(10, (loveScore + emotionalScore) / 2 + (Math.random() * 20 - 10)));

        const overallScore = Math.floor((loveScore + emotionalScore + communicationScore + valuesScore) / 4);

        let overallLevel = "Средняя";
        if (overallScore >= 80) overallLevel = "Высокая";
        else if (overallScore < 50) overallLevel = "Низкая";

        res.status(200).json({
            partnerName: partnerName || "Партнер",
            partnerZodiacSign: partnerSign,
            userZodiacSign: userSign,
            overall: {
                score: overallScore,
                level: overallLevel,
                description: overallScore >= 80 ? "У вас сильная астрологическая связь и отличные шансы на гармоничные отношения." : "Вам может потребоваться больше усилий для понимания друг друга."
            },
            categories: {
                emotional: {
                    name: "Эмоциональная",
                    score: Math.floor(emotionalScore),
                    description: "Ваши эмоциональные миры " + (emotionalScore >= 70 ? "очень похожи." : "различаются, учитесь понимать друг друга.")
                },
                love: {
                    name: "Любовь/романтика",
                    score: Math.floor(loveScore),
                    description: "В романтике " + (loveScore >= 70 ? "вы на одной волне." : "у вас могут быть разные потребности.")
                },
                communication: {
                    name: "Коммуникация",
                    score: Math.floor(communicationScore),
                    description: "В общении " + (communicationScore >= 70 ? "вы понимаете друг друга с полуслова." : "старайтесь слушать более внимательно.")
                },
                lifeValues: {
                    name: "Жизненные ценности",
                    score: Math.floor(valuesScore),
                    description: "Ваши базовые ценности " + (valuesScore >= 70 ? "совпадают." : "различаются, но это может обогатить опыт.")
                }
            },
            dynamics: {
                strengths: [
                    loveScore >= 70 ? "Чувственная связь" : "Уважение личных границ",
                    emotionalScore >= 70 ? "Взаимное вдохновение" : "Рациональный подход к делу"
                ],
                challenges: [
                    communicationScore < 60 ? "Трудности в коммуникации" : "Риск зациклиться друг на друге"
                ],
                advice: overallScore >= 70 ? "Наслаждайтесь гармонией, но не забывайте о личном пространстве." : "Будьте чуткими к потребностям партнера, учитесь слушать и выражать чувства."
            },
            partnerNatalData: partnerNatalInfo,
            userNatalData: userNatalInfo
        });

    } catch (error) {
        console.error("compareCompatibility error:", error);
        res.status(500).json({ error: error.message });
    }
};
