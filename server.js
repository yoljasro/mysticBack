const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/admin')) {
        return next();
    }
    express.json({ limit: '50mb' })(req, res, (err) => {
        if (err) return next(err);
        express.urlencoded({ limit: '50mb', extended: true })(req, res, next);
    });
});
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

const horoscopeRoutes = require('./routes/horoscope');
app.use('/api/horoscope', horoscopeRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api', (req, res) => {
    res.send('Welcome to the API. Please use specific endpoints.');
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mystic';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Admin Panel Initialization (After DB Connection)
        const initAdmin = require('./admin/adminConfig');
        try {
            const { admin, router } = await initAdmin();
            app.use(admin.options.rootPath, router);
            console.log(`AdminJS started at ${admin.options.rootPath}`);
        } catch (err) {
            console.error('AdminJS initialization error:', err);
        }

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

        let onlineUsers = {}; // userId -> socket.id (simplified or map structure)

        // ──────────────────────────────────────────────────────────────
        // Chat Roulette: waiting queue
        // Each entry: { socketId, userId, gender, lookingForGender }
        // ──────────────────────────────────────────────────────────────
        let rouletteQueue = [];

        function findMatch(entry) {
            // Gender matching logic:
            // entry.lookingForGender === 'any'   => accepts anyone
            // partner.lookingForGender === 'any' => partner accepts anyone
            for (let i = 0; i < rouletteQueue.length; i++) {
                const candidate = rouletteQueue[i];

                // Don't match with yourself
                if (candidate.socketId === entry.socketId) continue;

                const myGenderOk = entry.lookingForGender === 'any' || candidate.gender === entry.lookingForGender;
                const theirGenderOk = candidate.lookingForGender === 'any' || entry.gender === candidate.lookingForGender;

                if (myGenderOk && theirGenderOk) {
                    // Remove candidate from queue
                    rouletteQueue.splice(i, 1);
                    return candidate;
                }
            }
            return null;
        }

        io.on("connection", (socket) => {
            console.log("Connected to socket.io");

            socket.on("setup", (userData) => {
                socket.join(userData._id);
                onlineUsers[userData._id] = socket.id;
                app.set('onlineUsers', onlineUsers);
                console.log("User joined setup room: ", userData._id);
                socket.emit("connected");

                // Emit unique user IDs to all clients
                io.emit("get online users", Object.keys(onlineUsers));
            });

            socket.on("join chat", (room) => {
                socket.join(room);
                console.log("User Joined Room: " + room);
            });

            socket.on("typing", (room) => socket.in(room).emit("typing"));
            socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

            // ── Chat Roulette Events ──────────────────────────────────

            // Client joins roulette queue
            // Payload: { userId, gender: 'male'|'female'|'other', lookingForGender: 'male'|'female'|'any' }
            socket.on("roulette:join", ({ userId, gender, lookingForGender }) => {
                // Remove any previous entry for this socket (reconnect safety)
                rouletteQueue = rouletteQueue.filter(e => e.socketId !== socket.id);

                const entry = {
                    socketId: socket.id,
                    userId,
                    gender: gender || 'any',
                    lookingForGender: lookingForGender || 'any',
                };

                const partner = findMatch(entry);

                if (partner) {
                    // Create a unique room id for the pair
                    const room = `roulette_${Date.now()}_${Math.random().toString(36).slice(2)}`;

                    // Both join the room
                    socket.join(room);
                    io.sockets.sockets.get(partner.socketId)?.join(room);

                    // Notify both sides
                    socket.emit("roulette:matched", { room, partnerId: partner.userId });
                    io.to(partner.socketId).emit("roulette:matched", { room, partnerId: userId });

                    console.log(`Roulette matched: ${userId} <-> ${partner.userId} in room ${room}`);
                } else {
                    // Add to waiting queue
                    rouletteQueue.push(entry);
                    socket.emit("roulette:waiting");
                    console.log(`Roulette waiting: ${userId} (gender: ${gender}, lookingFor: ${lookingForGender})`);
                }
            });

            // Client leaves roulette queue (cancelled)
            socket.on("roulette:leave", () => {
                rouletteQueue = rouletteQueue.filter(e => e.socketId !== socket.id);
                socket.emit("roulette:cancelled");
                console.log(`Roulette cancelled for socket: ${socket.id}`);
            });

            // Client sends a roulette message (in-room, before chat is created)
            socket.on("roulette:message", ({ room, message }) => {
                socket.to(room).emit("roulette:message", { message });
            });

            // Client skips current partner and re-joins queue
            socket.on("roulette:skip", ({ userId, gender, lookingForGender, room }) => {
                // Leave old roulette room
                if (room) socket.leave(room);

                // Re-join queue
                rouletteQueue = rouletteQueue.filter(e => e.socketId !== socket.id);

                const entry = {
                    socketId: socket.id,
                    userId,
                    gender: gender || 'any',
                    lookingForGender: lookingForGender || 'any',
                };

                const partner = findMatch(entry);

                if (partner) {
                    const newRoom = `roulette_${Date.now()}_${Math.random().toString(36).slice(2)}`;
                    socket.join(newRoom);
                    io.sockets.sockets.get(partner.socketId)?.join(newRoom);

                    socket.emit("roulette:matched", { room: newRoom, partnerId: partner.userId });
                    io.to(partner.socketId).emit("roulette:matched", { room: newRoom, partnerId: userId });
                } else {
                    rouletteQueue.push(entry);
                    socket.emit("roulette:waiting");
                }
            });

            // ─────────────────────────────────────────────────────────

            socket.on("disconnect", () => {
                console.log("USER DISCONNECTED");
                // Remove from roulette queue if present
                rouletteQueue = rouletteQueue.filter(e => e.socketId !== socket.id);

                // Find and remove the user
                for (let userId in onlineUsers) {
                    if (onlineUsers[userId] === socket.id) {
                        delete onlineUsers[userId];
                        break;
                    }
                }
                app.set('onlineUsers', onlineUsers);
                io.emit("get online users", Object.keys(onlineUsers));
            });
        });

    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
