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

app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/chat', chatRoutes);

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

        io.on("connection", (socket) => {
            console.log("Connected to socket.io");

            socket.on("setup", (userData) => {
                socket.join(userData._id);
                console.log("User joined setup room: ", userData._id);
                socket.emit("connected");
            });

            socket.on("join chat", (room) => {
                socket.join(room);
                console.log("User Joined Room: " + room);
            });

            socket.on("typing", (room) => socket.in(room).emit("typing"));
            socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

            socket.on("new message", (newMessageReceived) => {
                var chat = newMessageReceived.chat;

                if (!chat.participants) return console.log("chat.participants not defined");

                chat.participants.forEach((user) => {
                    if (user._id == newMessageReceived.sender._id) return;

                    socket.in(user._id).emit("message received", newMessageReceived);
                });
            });

            socket.off("setup", () => {
                console.log("USER DISCONNECTED");
                socket.leave(userData._id);
            });
        });

    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
