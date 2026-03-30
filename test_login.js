const http = require('http');
const querystring = require('querystring');

const postData = querystring.stringify({
  email: 'admin@mystic.uz',
  password: 'adminMysticPass2024!'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', res.headers);
  let data = '';
  res.on('data', (d) => data += d);
  res.on('end', () => console.log('DATA LENGTH:', data.length));
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
