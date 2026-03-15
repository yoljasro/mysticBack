const TarotCard = require('../models/TarotCard');
const User = require('../models/User');

// @desc    Get a daily tarot card or draw a new one
// @route   GET /api/tarot/daily
// @access  Private
exports.drawDailyCard = async (req, res) => {
    try {
        // Find all cards
        const count = await TarotCard.countDocuments();
        if (count === 0) {
            return res.status(404).json({ success: false, message: 'No tarot cards found in the database.' });
        }

        // Generate a random number between 0 and count-1
        const randomIndex = Math.floor(Math.random() * count);
        
        // Find a random card
        const randomCard = await TarotCard.findOne().skip(randomIndex);

        if (!randomCard) {
            return res.status(500).json({ success: false, message: 'Server error while drawing a card.' });
        }

        res.status(200).json({
            success: true,
            data: {
                card: randomCard
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
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
            return res.status(404).json({ success: false, message: 'No tarot cards found in the database.' });
        }

        const randomIndex = Math.floor(Math.random() * count);
        
        const randomCard = await TarotCard.findOne().skip(randomIndex);

        if (!randomCard) {
            return res.status(500).json({ success: false, message: 'Server error while drawing a card.' });
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
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
