const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes = require('./routes/auth');
const onboardingRoutes = require('./routes/onboarding');
const chatRoutes = require('./routes/chat');
const natalRoutes = require('./routes/natal');
const lunarRoutes = require('./routes/lunar');

app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/natal', natalRoutes);
app.use('/api/lunar', lunarRoutes);
const profileRoutes = require('./routes/profile');
const matchRoutes = require('./routes/match');
const tarotRoutes = require('./routes/tarot');

app.use('/api/profile', profileRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/tarot', tarotRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api', (req, res) => {
    res.send('Welcome to the API. Please use specific endpoints.');
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mystic';

const server = mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        const expressServer = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Socket.io Setup
        const io = require('socket.io')(expressServer, {
            pingTimeout: 60000,
            cors: {
                origin: "*", // Adjust this for production
            },
        });

        app.set('io', io);

        let onlineUsers = {}; // socket.id -> userId

        io.on("connection", (socket) => {
            console.log("Connected to socket.io");

            socket.on("setup", (userData) => {
                socket.join(userData._id);
                onlineUsers[socket.id] = userData._id;
                console.log("User joined setup room: ", userData._id);
                socket.emit("connected");

                // Emit unique user IDs to all clients
                io.emit("get online users", Array.from(new Set(Object.values(onlineUsers))));
            });

            socket.on("join chat", (room) => {
                socket.join(room);
                console.log("User Joined Room: " + room);
            });

            socket.on("typing", (room) => socket.in(room).emit("typing"));
            socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

            socket.on("disconnect", () => {
                console.log("USER DISCONNECTED");
                delete onlineUsers[socket.id];
                io.emit("get online users", Array.from(new Set(Object.values(onlineUsers))));
            });
        });

    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
