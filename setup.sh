#!/bin/bash
set -e

DOMAIN="mainstream.ceo"
APP_PORT=5000

echo "--- 1. Updating System ---"
sudo apt-get update
sudo apt-get upgrade -y

echo "--- 2. Installing Dependencies (Node.js 18, Nginx, Certbot) ---"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx

echo "--- 3. Installing MongoDB ---"
if ! command -v mongod &> /dev/null; then
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
    sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg --yes
    
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    
    sudo apt-get update
    sudo apt-get install -y mongodb-org
fi

sudo systemctl start mongod
sudo systemctl enable mongod

echo "--- 4. Installing PM2 ---"
sudo npm install -g pm2

echo "--- 5. Configuring Nginx for $DOMAIN ---"
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sfn /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "--- 6. Setup Firewall ---"
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
# sudo ufw enable # Use carefully to not lock out SSH

echo "--- Server Setup Complete! ---"
echo "Next steps:"
echo "1. Upload code to /root/mysticBack"
echo "2. Run 'npm install'"
echo "3. Run 'pm2 start server.js --name mystic-backend'"
