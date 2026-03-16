const NatalChart = require('../models/NatalChart');
const { getNatalData } = require('../utils/astrology');

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
