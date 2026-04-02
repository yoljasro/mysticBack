const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const http = require('http');

const test = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mystic');
        console.log('Connected to DB');
        
        // get a random user
        let user = await User.findOne({});
        if (!user) {
            user = await User.create({
                name: "Test User",
                email: "test@mystic.uz",
                password: "password",
                dateOfBirth: new Date("1992-10-25"), // Скорпион
                onboardingCompleted: true
            });
        }
        
        // sign token
        const token = jwt.sign({ id: user._id }, 'secret');
        
        // test api
        const payloadData = {
            partnerDateOfBirth: "15.06.1995",
            partnerTimeOfBirth: "14:30",
            partnerName: "Алиса"
        };
        const payload = JSON.stringify(payloadData);
        
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/natal/compatibility',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
                'Authorization': 'Bearer ' + token
            }
        };

        const req = http.request(options, res => {
            console.log('STATUS:', res.statusCode);
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                console.log('DATA:', data);
                mongoose.disconnect();
                process.exit(0);
            });
        });
        
        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            mongoose.disconnect();
            process.exit(1);
        });

        req.write(payload);
        req.end();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

test();
