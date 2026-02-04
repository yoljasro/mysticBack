const http = require('http');

const postRequest = (path, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: body }));
        });

        req.on('error', (error) => reject(error));
        req.write(data);
        req.end();
    });
};

const runTest = async () => {
    console.log('Testing /api/auth/send-otp...');
    const phoneData = JSON.stringify({ phone: '+998901234567' });

    try {
        const res = await postRequest('/api/auth/send-otp', phoneData);
        console.log(`Status: ${res.status}`);
        console.log(`Body: ${res.body}`);

        if (res.status === 200) {
            console.log('✅ send-otp Passed');
        } else {
            console.log('❌ send-otp Failed');
        }
    } catch (err) {
        console.error('Request failed:', err.message);
    }
};

runTest();
