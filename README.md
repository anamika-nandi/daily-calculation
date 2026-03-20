# daily-calculation (AWS EC2) - Quick Start & Deployment Guide

This document collects the most common commands, installation steps, and deployment notes for the `daily-calculation` project when running on an AWS EC2 instance.

> ⚠️ This repo is expected to be run on an AWS EC2 instance (Amazon Linux 2023) and requires:
>
> - SSH access with a private key (`awsanamika1.pem`)
> - Node.js (v24+) installed
> - A MongoDB connection string (Atlas or self-hosted)

---

## 1) Accessing the EC2 Instance (SSH)

```bash
chmod 400 awsanamika1.pem
ssh -i awsanamika1.pem ec2-user@<EC2_PUBLIC_IP>
```

Replace `<EC2_PUBLIC_IP>` with your instance's public IPv4 address.

---

## 2) Clone the Repository

Once logged in:

```bash
cd ~
git clone "https://github.com/anamika-nandi/daily-calculation.git"
cd daily-calculation
```

---

## 3) Install Node.js & npm (Amazon Linux 2023)

Amazon Linux does not ship with Node.js by default. Install it via NodeSource:

```bash
sudo yum update -y
curl -fsSL https://rpm.nodesource.com/setup_24.x | sudo bash -
sudo yum install -y nodejs
```

Verify:

```bash
node -v
npm -v
```

---

## 4) Install Dependencies

### Backend

```bash
cd ~/daily-calculation/backend
npm install
```

### Frontend

```bash
cd ~/daily-calculation/frontend
npm install
```

---

## 5) Configure Environment Variables

Both the backend and frontend expect an `.env` file in their respective directories. Create and edit them.

### Backend `.env` (example)

```env
# backend/.env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.krdkhfh.mongodb.net/<dbname>
# any other vars your app expects
```

### Frontend `.env` (example)

```env
# frontend/.env
VITE_API_BASE_URL=http://localhost:3000
# or point to your hosted backend URL
```

> ✅ If the backend fails with `querySrv ENOTFOUND _mongodb._tcp...`, it means DNS resolution for the MongoDB Atlas host failed. Ensure:
>
> - Your EC2 instance has outbound internet access (security groups, NACLs) and can resolve DNS.
> - The `MONGO_URI` string is correct.

---

## 6) Running Locally (Development)

### Backend (dev mode)

```bash
cd ~/daily-calculation/backend
npm run dev
```

This runs `node --watch server.js` and restarts on file changes.

### Frontend (Vite)

```bash
cd ~/daily-calculation/frontend
npm run dev
```

By default, Vite uses port `5173`. To expose the server on the EC2 network (so you can reach it from your browser using the EC2 IP), run:

```bash
npm run dev -- --host
```

Then open:

- Local (inside EC2): `http://localhost:5173/`
- From your machine (if security group allows): `http://<EC2_PUBLIC_IP>:5173/`

---

## 7) Common Issues & Fixes

### Port already in use (Vite)

If you see `Port 5173 is in use, trying another one...`:

```bash
sudo lsof -i :5173
kill <PID>
```

### SSH disconnects (broken pipe)

This is normal if you stop the dev server or lose connection. Use `screen`, `tmux`, or run as a managed service (see deployment below).

---

## 8) Deployment Guidance (Production)

For production, you typically want the backend and frontend to run as managed services (so they restart on reboot) and be reachable on standard ports.

### (A) Backend: Run with PM2 (recommended)

```bash
cd ~/daily-calculation/backend
npm install -g pm2
pm2 start server.js --name daily-backend --watch
pm2 save
pm2 startup
```

### (B) Frontend: Build + Serve

If the frontend is a static site (Vite build):

```bash
cd ~/daily-calculation/frontend
npm run build
# then serve with a static server such as 'serve' or configure nginx
npm install -g serve
serve -s dist -l 5173
```

### (C) Reverse Proxy (nginx)

A common setup is to run the backend on `localhost:3000` and serve the frontend via nginx, proxying API calls to the backend.

Install nginx:

```bash
sudo yum install -y nginx
sudo systemctl enable --now nginx
```

Example nginx config (add to `/etc/nginx/conf.d/daily-calculation.conf`):

```nginx
server {
  listen 80;
  server_name _;

  root /home/ec2-user/daily-calculation/frontend/dist;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

Reload nginx:

```bash
sudo nginx -s reload
```

---

## 9) Useful Commands (Summary)

- SSH:
  - `chmod 400 awsanamika1.pem`
  - `ssh -i awsanamika1.pem ec2-user@<IP>`
- Clone repo:
  - `git clone https://github.com/anamika-nandi/daily-calculation.git`
- Install Node:
  - `curl -fsSL https://rpm.nodesource.com/setup_24.x | sudo bash -`
  - `sudo yum install -y nodejs`
- Install dependencies:
  - `npm install` (in `backend` or `frontend`)
- Run backend:
  - `npm run dev` (dev) or `pm2 start server.js`
- Run frontend:
  - `npm run dev -- --host` (dev) or `npm run build` + static server

---

## 10) Full command log (from this setup session)

Below is the full list of commands you ran during setup, along with a short explanation for each. This is intended as a complete reference so nothing is removed.

- `chmod 400 awsanamika1.pem` — set the correct permissions for the SSH private key.
- `ssh -i awsanamika1.pem ec2-user@3.107.77.26` — connect to the EC2 instance as the `ec2-user` account.
- `git clone "https://github.com/anamika-nandi/daily-calculation.git"` — clone the project repository to the EC2 instance.
- `ls` — list files in the current directory.
- `cd daily-calculation` — change into the project directory.
- `cd backend/` — move into the backend subfolder.
- `npm i` / `npm install` — install Node.js dependencies for the current package.
- `sudo yum update -y` — update system packages on Amazon Linux.
- `curl -fsSL https://rpm.nodesource.com/setup_24.x | sudo bash -` — add the NodeSource RPM repo for Node.js 24.
- `node -v` — check the installed Node.js version.
- `sudo yum install -y nodejs` — install Node.js from NodeSource.
- `npm run dev` — start the backend in development mode (`node --watch server.js`).
- `cd ../frontend/` — switch to the frontend folder.
- `touch .env` — create an empty `.env` file.
- `nano .env` — edit the `.env` file interactively.
- `npm run dev -- --host` — start the Vite dev server and bind to the network interface so it can be accessed from other machines.
- `sudo lsof -i :5174` — list processes listening on port 5174.
- `sudo lsof -i :5173` — list processes listening on port 5173.
- `kill -9 <PID>` — forcefully terminate a process by PID (used to free up port 5173).

---

## 12) Production Deployment Session (2026-03-19)

Below is the full list of commands run during the production deployment setup with PM2, nginx, and Namecheap domain.

### Step 1: SSH into EC2

- `chmod 400 awsanamika1.pem` — set correct permissions for the SSH key.
- `ssh -i awsanamika1.pem ec2-user@3.107.77.26` — connect to the EC2 instance.

### Step 2: Install PM2 globally

- `sudo npm install -g pm2` — install PM2 process manager globally (requires `sudo` due to `/usr/lib/node_modules` permissions).

### Step 3: Start backend with PM2

- `cd ~/daily-calculation/backend` — navigate to backend directory.
- `pm2 start server.js --name daily-backend --watch` — start backend with PM2, auto-restart on file changes.
- `pm2 logs` — verify backend started successfully (confirmed MongoDB connected).

### Step 4: Build frontend for production

- `cd ~/daily-calculation/frontend` — navigate to frontend directory.
- `npm run build` — build the Vite/React frontend for production (outputs to `dist/`).

### Step 5: Install `serve` and start frontend with PM2

- `sudo npm install -g serve` — install the `serve` static file server globally.
- `pm2 start npx --name daily-frontend -- serve -s dist -l 5173` — serve the production build on port 5173 via PM2.
- `pm2 save` — save the PM2 process list so it persists across restarts.

### Step 6: Install and enable nginx

- `sudo yum install -y nginx` — install nginx on Amazon Linux 2023.
- `sudo systemctl enable --now nginx` — enable nginx to start on boot and start it immediately.

### Step 7: Configure nginx for subdomains

- `sudo nano /etc/nginx/conf.d/daily-calculation.conf` — create nginx config with two server blocks:
  - `farm.anamikanandi.com` → proxies to `http://127.0.0.1:5173` (frontend)
  - `farm-api.anamikanandi.com` → proxies to `http://127.0.0.1:3000` (backend API)
- `sudo nginx -t` — test nginx configuration (syntax ok).
- `sudo nginx -s reload` — reload nginx to apply the new config.

### Step 8: Configure Namecheap DNS (subdomains)

In Namecheap → Advanced DNS, added two A records:

- `farm` → `3.107.77.26` (frontend)
- `farm-api` → `3.107.77.26` (backend API)

### Step 9: Update frontend environment

- `nano .env` — updated `VITE_API_BASE_URL` to point to `http://farm-api.anamikanandi.com`.
- `npm run build` — rebuilt frontend with the new API URL.
- `pm2 restart daily-frontend` — restarted the frontend process to serve the new build.

### Step 10: Fix Vite `allowedHosts` error

- `nano vite.config.js` — added `allowedHosts: ['farm.anamikanandi.com']` inside the `server` config to allow the custom domain.

### Step 11: Start frontend with Vite dev server (final approach)

- `pm2 delete daily-frontend` — removed the previous frontend process.
- `pm2 start npm --name daily-frontend -- run dev -- --host` — started the Vite dev server via PM2 (binds to all network interfaces).
- `pm2 save` — saved the updated process list.

### Final PM2 status

```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ daily-backend      │ fork     │ 0    │ online    │ 0%       │ 89.7mb   │
│ 1  │ daily-frontend     │ fork     │ 1    │ online    │ 0%       │ 88.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

### URLs

- Frontend: `http://farm.anamikanandi.com`
- Backend API: `http://farm-api.anamikanandi.com`

### Step 12: Add SSL certificate with Let's Encrypt (Certbot)

> Note: Amazon Linux 2023 uses `yum`, not `apt`. Do NOT use `sudo apt update`.
> https://certbot.eff.org/ how to apply ssl certificate to nginx server

1. Install certbot and the nginx plugin:

```bash
sudo yum install -y certbot python3-certbot-nginx
```

2. Request SSL certificates for both subdomains:

```bash
sudo certbot --nginx -d farm.anamikanandi.com -d farm-api.anamikanandi.com
```

- Enter your email when prompted (for renewal notices).
- Agree to the terms of service.
- Certbot will automatically update the nginx config to use HTTPS and redirect HTTP to HTTPS.

3. Verify auto-renewal is working:

```bash
sudo certbot renew --dry-run
```

4. Ensure the EC2 security group allows inbound traffic on:
   - Port **80** (HTTP)
   - Port **443** (HTTPS)

### Step 13: Enable PM2 auto-start on reboot

```bash
pm2 startup
```

Run the command it outputs (it will be a `sudo` command), then:

```bash
pm2 save
```

### Final URLs (after SSL)

- Frontend: `https://farm.anamikanandi.com`
- Backend API: `https://farm-api.anamikanandi.com`

---

## 13) Where to Look Next

- `backend/server.js` (entry point)
- `frontend/src/` (React/Vite app)
- `PRD.md` (product requirements / notes)

---

If anything is unclear or you want the doc tailored to a specific deployment style (Docker, ECS, etc.), just say so.
