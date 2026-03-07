const NatalChart = require('../models/NatalChart');

// 1. Calculate & Save a new Natal Chart
exports.calculateAndSaveChart = async (req, res) => {
    try {
        const { profileName, name, dateOfBirth, timeOfBirth, isTimeUnknown, placeOfBirth } = req.body;

        if (!profileName || !name || !dateOfBirth || !placeOfBirth) {
            return res.status(400).json({ error: "Please provide profileName, name, dateOfBirth and placeOfBirth at least." });
        }

        // --- MOCK ASTROLOGY ENGINE LOGIC ---
        // In the future, you will send dateOfBirth, timeOfBirth, placeOfBirth to an external astrology API
        // For now, we generate placeholder data that matches the UI Figma structures.
        const mockChartData = {
            planets: [
                { name: "Солнце", sign: "Лев", element: "Огонь", description: "Вы прирожденный лидер и стремитесь к успеху..." },
                { name: "Луна", sign: "Телец", element: "Земля", description: "Вы ищете безопасность и комфорт..." },
            ],
            houses: [
                { name: "Дом 1", sign: "Лев", description: "Ваш внешний вид и то, как вас видят другие..." },
                { name: "Дом 2", sign: "Дева", description: "Ваши финансы и материальные ценности..." }
            ],
            aspects: [
                { title: "Солнце 120 Луна", type: "Трин", intensity: "85%", description: "Гармония сознания и подсознания..." },
                { title: "Меркурий 90 Марс", type: "Квадрат", intensity: "60%", description: "Острый ум, но склонность к спорам..." }
            ],
            character: {
                totalScore: "99%",
                traits: [
                    { name: "Огонь", percentage: "40%" },
                    { name: "Земля", percentage: "30%" },
                    { name: "Воздух", percentage: "20%" },
                    { name: "Вода", percentage: "10%" }
                ],
                description: "У вас сильный, независимый характер с преобладанием огненной стихии..."
            },
            compatibility: {
                // optional placeholder for the "Совместимость" tab
                overview: "Ваша карта показывает сильную совместимость с земными знаками..."
            }
        };

        const newChart = await NatalChart.create({
            user: req.user._id,
            profileName,
            name,
            dateOfBirth,
            timeOfBirth: timeOfBirth || '',
            isTimeUnknown: isTimeUnknown || false,
            placeOfBirth,
            chartData: mockChartData
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
