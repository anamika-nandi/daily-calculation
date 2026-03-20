# AWS EC2 Deployment Guide — Daily Calculation App

## Prerequisites

- AWS EC2 instance (Amazon Linux 2023)
- PEM key file (awsanamika1.pem)
- EC2 public IP: 3.107.77.26

---

## Step 1: Set PEM Key Permissions

```bash
chmod 400 awsanamika1.pem
```

## Step 2: SSH into EC2 Instance

```bash
ssh -i awsanamika1.pem ec2-user@3.107.77.26
```

## Step 3: Clone the Project

```bash
git clone <your-repo-url>
cd daily-calculation/
```

## Step 4: Install PM2 Globally

```bash
sudo
sudo npm install -g pm2
```

## Step 5: Start Backend with PM2

```bash
cd ~/daily-calculation/backend/
pm2 start server.js --name daily-backend --watch
```

- Backend runs on port 3000
- Connects to MongoDB automatically

## Step 6: Install Serve Globally

```bash
sudo npm install -g serve
```

## Step 7: Set Frontend Environment Variables

```bash
cd ~/daily-calculation/frontend/
nano .env
```

## Step 8: Build Frontend

```bash
npm run build
```

## Step 9: Start Frontend with PM2

```bash
pm2 start npx --name daily-frontend -- serve -s dist -l 5173
```

- Frontend runs on port 5173

## Step 10: Install Nginx

```bash
sudo yum install -y nginx
sudo systemctl enable --now nginx
```

## Step 11: Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/conf.d/daily-calculation.conf
```

Add this configuration:

```nginx
server {
  listen 80;
  server_name your-frontend-domain.com;

  location / {
    proxy_pass http://127.0.0.1:5173;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
  }
}

server {
  listen 80;
  server_name farm-api.yourdomain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
  }
}
```

## Step 12: Test and Reload Nginx

```bash
sudo nginx -t
sudo nginx -s reload
```

## Step 13: Save PM2 Processes (Auto-restart on Reboot)

```bash
pm2 save
pm2 startup
```

---

## Useful Commands

- `pm2 status` — Check running processes
- `pm2 logs` — View logs
- `pm2 restart daily-backend` — Restart backend
- `pm2 restart daily-frontend` — Restart frontend
- `pm2 delete <name>` — Remove a process

## Redeploy Frontend After Code Changes

```bash
cd ~/daily-calculation/frontend/
npm run build
pm2 restart daily-frontend
```

## Redeploy Backend After Code Changes

Backend auto-restarts with --watch flag. Otherwise:

```bash
pm2 restart daily-backend
```
