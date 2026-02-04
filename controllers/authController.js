const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper component to generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

exports.sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ message: 'Phone number is required' });

        // Generate 4-digit OTP
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP to DB
        await Otp.findOneAndUpdate(
            { phone },
            { code, expiresAt },
            { upsert: true, new: true }
        );

        // MOCK: Send OTP (In real world, use SMS provider)
        console.log(`[MOCK OTP] code for ${phone}: ${code}`);

        res.status(200).json({ message: 'OTP sent successfully', dev_note: 'Check console for code' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { phone, code } = req.body;
        if (!phone || !code) return res.status(400).json({ message: 'Phone and code are required' });

        const otpRecord = await Otp.findOne({ phone, code });

        if (!otpRecord) return res.status(400).json({ message: 'Invalid OTP' });
        if (otpRecord.expiresAt < Date.now()) return res.status(400).json({ message: 'OTP expired' });

        // Check if user exists
        let user = await User.findOne({ phone });

        // Delete OTP after usage
        await Otp.deleteOne({ _id: otpRecord._id });

        if (user) {
            const token = generateToken(user._id);
            res.status(200).json({ message: 'Login successful', token, user });
        } else {
            res.status(200).json({ message: 'OTP verified. Proceed to registration.', isNewUser: true });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth, phone } = req.body;
        let avatar = req.body.avatar;

        if (req.file) {
            avatar = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        // Basic validation
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email or phone' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            dateOfBirth,
            phone,
            avatar,
            isVerified: true,
            authProvider: 'local'
        });

        await newUser.save();

        const token = generateToken(newUser._id);
        res.status(201).json({ message: 'User registered successfully', token, user: newUser });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

        // Find user by email OR phone
        const user = await User.findOne({
            $or: [{ email: email }, { phone: email }]
        });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check if user has a password (might be social only)
        if (!user.password) return res.status(400).json({ message: 'Please login with Google/Apple' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id);
        res.status(200).json({ message: 'Login successful', token, user });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ message: 'Google ID Token is required' });

        // Verify Token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                if (user.authProvider === 'local') user.authProvider = 'google';
                await user.save();
            }
        } else {
            user = new User({
                name,
                email,
                password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
                googleId,
                avatar: picture,
                authProvider: 'google',
                isVerified: true,
                phone: `google_${googleId}`
            });
            await user.save();
        }

        const token = generateToken(user._id);
        res.status(200).json({ message: 'Google login successful', token, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Google Auth Failed', error: error.message });
    }
};

exports.appleLogin = async (req, res) => {
    try {
        // Placeholder Apple Login
        res.status(501).json({ message: 'Apple Login not fully implemented (requires Apple Developer Keys)' });
    } catch (error) {
        res.status(500).json({ message: 'Apple Auth Failed', error: error.message });
    }
};
