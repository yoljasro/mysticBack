const mongoose = require('mongoose');
const User = require('./models/User');
const Chat = require('./models/Chat');
const Prediction = require('./models/Prediction');
const Achievement = require('./models/Achievement');
const { getAstrologicalJourney } = require('./controllers/astrologyController');
const { sendMessage } = require('./controllers/chatController');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mystic';

async function runTests() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Test 1: Astrological Path Lazy Initialization
        console.log('\n--- Test 1: Astrological Path Lazy Initialization ---');
        const testUser = await User.create({
            name: 'Test User',
            email: `test_${Date.now()}@example.com`,
            password: 'password123'
        });

        const req = { user: { id: testUser._id } };
        const res = {
            json: (data) => {
                console.log('Astrological Path response received.');
                if (data.achievements.length > 0 && data.archivePredictions.length > 0) {
                    console.log('✅ PASS: Achievements and Predictions are not empty.');
                } else {
                    console.error('❌ FAIL: Achievements or Predictions are empty.');
                }
            }
        };

        await getAstrologicalJourney(req, res);

        // Test 2: Chat Blocking Info
        console.log('\n--- Test 2: Chat Blocking Info ---');
        const alice = await User.create({ name: 'Alice', email: `alice_${Date.now()}@example.com`, password: 'password123' });
        const bob = await User.create({ name: 'Bob', email: `bob_${Date.now()}@example.com`, password: 'password123' });

        // Alice blocks Bob
        alice.blockedUsers.push(bob._id);
        await alice.save();

        const chat = await Chat.create({
            chatName: 'Test Chat',
            isGroupChat: false,
            participants: [alice._id, bob._id]
        });

        // Bob tries to send message to Alice
        const req2 = {
            user: bob,
            body: { content: 'Hello Alice', chatId: chat._id },
            protocol: 'http',
            get: (header) => 'localhost:5000',
            app: { get: (key) => null } // Mock io and onlineUsers
        };

        const res2 = {
            status: (code) => {
                return {
                    json: (data) => {
                        console.log(`Response status: ${code}`);
                        console.log('Response data:', data);
                        if (code === 403 && data.error === 'Alice has blocked you.') {
                            console.log('✅ PASS: Correct blocker info returned.');
                        } else {
                            console.error('❌ FAIL: Incorrect response for blocked message.');
                        }
                    }
                };
            },
            sendStatus: (code) => console.log(`Status sent: ${code}`)
        };

        await sendMessage(req2, res2);

        // Clean up
        console.log('\nCleaning up test data...');
        await User.deleteOne({ _id: testUser._id });
        await User.deleteOne({ _id: alice._id });
        await User.deleteOne({ _id: bob._id });
        await Chat.deleteOne({ _id: chat._id });
        await Prediction.deleteMany({ user: testUser._id });
        await Achievement.deleteMany({ user: testUser._id });

        console.log('\nTests completed.');
        process.exit(0);

    } catch (error) {
        console.error('Test error:', error);
        process.exit(1);
    }
}

runTests();
