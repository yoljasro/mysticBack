const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/send-otp
router.post('/send-otp', authController.sendOtp);

// POST /api/auth/verify-otp
router.post('/verify-otp', authController.verifyOtp);

const upload = require('../middleware/upload');

// POST /api/auth/register
router.post('/register', upload.single('avatar'), authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/google
router.post('/google', authController.googleLogin);

// POST /api/auth/apple
router.post('/apple', authController.appleLogin);

module.exports = router;
