const TarotCard = require('../models/TarotCard');
const User = require('../models/User');
const TarotHistory = require('../models/TarotHistory');

// @desc    Get a daily tarot card or draw a new one
// @route   GET /api/tarot/daily
// @access  Private
exports.drawDailyCard = async (req, res) => {
    try {
        // Find all cards
        const count = await TarotCard.countDocuments();
        if (count === 0) {
            return res.status(404).json({ success: false, message: 'Карты Таро не найдены в базе данных.' });
        }

        // Generate a random number between 0 and count-1
        const randomIndex = Math.floor(Math.random() * count);
        
        // Find a random card
        const randomCard = await TarotCard.findOne().skip(randomIndex);

        if (!randomCard) {
            return res.status(500).json({ success: false, message: 'Ошибка сервера при вытягивании карты.' });
        }

        res.status(200).json({
            success: true,
            data: {
                card: randomCard
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
};

// @desc    Explicitly draw a new card (can be used for "Вытянуть еще раз")
// @route   POST /api/tarot/draw
// @access  Private
exports.drawAgain = async (req, res) => {
    try {
        // Find all cards
        const count = await TarotCard.countDocuments();
        if (count === 0) {
            return res.status(404).json({ success: false, message: 'Карты Таро не найдены в базе данных.' });
        }

        const randomIndex = Math.floor(Math.random() * count);
        
        const randomCard = await TarotCard.findOne().skip(randomIndex);

        if (!randomCard) {
            return res.status(500).json({ success: false, message: 'Ошибка сервера при вытягивании карты.' });
        }

        // Technically, "drawing again" might just returning a random card. 
        // Or tracking history in DB. For now, just return a random card.
        res.status(200).json({
            success: true,
            data: {
                card: randomCard
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
};

// @desc    Get all tarot cards
// @route   GET /api/tarot/cards
// @access  Private
exports.getAllCards = async (req, res) => {
    try {
        const cards = await TarotCard.find();
        res.status(200).json({
            success: true,
            count: cards.length,
            data: cards
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
};

// @desc    Get single tarot card by ID
// @route   GET /api/tarot/cards/:id
// @access  Private
exports.getCardById = async (req, res) => {
    try {
        const card = await TarotCard.findById(req.params.id);

        if (!card) {
            return res.status(404).json({ success: false, message: 'Карта Таро не найдена' });
        }

        res.status(200).json({
            success: true,
            data: card
        });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Карта Таро не найдена' });
        }
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
};

// @desc    Draw 3 random cards (Past, Present, Future) and save to history
// @route   GET /api/tarot/spread/three
// @access  Private
exports.drawThreeCardSpread = async (req, res) => {
    try {
        const allCards = await TarotCard.find();
        
        if (allCards.length < 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Недостаточно карт Таро в базе данных для расклада на 3 карты.' 
            });
        }

        // Shuffle and pick 3 unique cards
        const shuffled = allCards.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        const spread = [
            { position: 'Past', card: selected[0] },
            { position: 'Present', card: selected[1] },
            { position: 'Future', card: selected[2] }
        ];

        // Save to history
        await TarotHistory.create({
            user: req.user.id,
            spread: spread.map(item => ({
                position: item.position,
                card: item.card._id
            }))
        });

        res.status(200).json({
            success: true,
            data: {
                spread
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
};

// @desc    Get tarot history for user
// @route   GET /api/tarot/history
// @access  Private
exports.getTarotHistory = async (req, res) => {
    try {
        const history = await TarotHistory.find({ user: req.user.id })
            .populate('spread.card')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
};

// @desc    Delete a tarot history entry
// @route   DELETE /api/tarot/history/:id
// @access  Private
exports.deleteTarotHistory = async (req, res) => {
    try {
        const historyItem = await TarotHistory.findById(req.params.id);

        if (!historyItem) {
            return res.status(404).json({ success: false, message: 'Запись истории не найдена' });
        }

        // Make sure user owns history item
        if (historyItem.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Нет доступа' });
        }

        await historyItem.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Запись истории не найдена' });
        }
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
};

