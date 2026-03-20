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

---

# GitHub CI/CD Setup Guide

This section explains how to configure GitHub Secrets and Variables so that the CI/CD workflows (`deploy-backend.yml`, `deploy-frontend.yml`, `deploy-full.yml`, `setup-server.yml`) can deploy to your EC2 instance.

---

## Step 1: Open Repository Settings

1. Go to your GitHub repository: `https://github.com/anamika-nandi/daily-calculation`
2. Click **Settings** tab (top bar)
3. In the left sidebar, expand **Secrets and variables**
4. Click **Actions**

You'll see two tabs: **Secrets** and **Variables**

---

## Step 2: Add Repository Secrets

Secrets are encrypted and used for sensitive values. Click the **Secrets** tab, then click **New repository secret** for each one.

### EC2 Connection Secrets (required for all workflows)

| Secret Name    | Value                                  | How to Get It                                    |
| -------------- | -------------------------------------- | ------------------------------------------------ |
| `EC2_HOST`     | Your EC2 public IP (e.g. `3.107.77.26`) | AWS Console → EC2 → Instances → Public IPv4     |
| `EC2_USER`     | `ec2-user`                             | Default for Amazon Linux 2023                    |
| `EC2_SSH_KEY`  | Contents of your `.pem` file           | See instructions below                           |

**How to get `EC2_SSH_KEY` value:**

```bash
# On your local machine, copy the FULL contents of your PEM file
cat ~/path/to/awsanamika1.pem
```

Copy the **entire output** including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` lines. Paste this as the secret value.

### Application Secrets (required for backend deploy)

Click **New repository secret** for each:

| Secret Name             | Value                          | Where to Find                          |
| ----------------------- | ------------------------------ | -------------------------------------- |
| `MONGODB_URI`           | Your MongoDB connection string | MongoDB Atlas → Connect → Connection String |
| `JWT_SECRET`            | Random secret string           | Generate: `openssl rand -base64 32`    |
| `JWT_REFRESH_SECRET`    | Random secret string           | Generate: `openssl rand -base64 32`    |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth client secret     | Google Cloud Console → Credentials     |
| `GH_OAUTH_CLIENT_SECRET`| GitHub OAuth app secret        | GitHub → Settings → Developer settings → OAuth Apps |
| `SMTP_PASS`             | SMTP password / app password   | Your email provider (e.g. Gmail App Password) |

---

## Step 3: Add Repository Variables

Variables are for non-sensitive configuration values. Click the **Variables** tab, then click **New repository variable** for each.

| Variable Name            | Example Value                                          |
| ------------------------ | ------------------------------------------------------ |
| `APP_PORT`               | `3000`                                                 |
| `NODE_ENV`               | `production`                                           |
| `JWT_ACCESS_EXPIRES_IN`  | `15m`                                                  |
| `JWT_REFRESH_EXPIRES_IN` | `7d`                                                   |
| `GOOGLE_CLIENT_ID`       | `xxxx.apps.googleusercontent.com`                      |
| `GOOGLE_CALLBACK_URL`    | `https://your-api-domain.com/api/auth/google/callback` |
| `GH_OAUTH_CLIENT_ID`     | `Ov23liXXXXXXXXXX`                                    |
| `GITHUB_CALLBACK_URL`    | `https://your-api-domain.com/api/auth/github/callback` |
| `SMTP_HOST`              | `smtp.gmail.com`                                       |
| `SMTP_PORT`              | `587`                                                  |
| `SMTP_USER`              | `your-email@gmail.com`                                 |
| `SMTP_FROM`              | `"Daily Calculation <your-email@gmail.com>"`           |
| `FRONTEND_URL`           | `https://your-frontend-domain.com`                     |

---

## Step 4: Verify All Secrets & Variables Are Set

After adding everything, your **Secrets** tab should show **9 secrets**:

```
EC2_HOST
EC2_USER
EC2_SSH_KEY
MONGODB_URI
JWT_SECRET
JWT_REFRESH_SECRET
GOOGLE_CLIENT_SECRET
GH_OAUTH_CLIENT_SECRET
SMTP_PASS
```

Your **Variables** tab should show **13 variables**:

```
APP_PORT
NODE_ENV
JWT_ACCESS_EXPIRES_IN
JWT_REFRESH_EXPIRES_IN
GOOGLE_CLIENT_ID
GOOGLE_CALLBACK_URL
GH_OAUTH_CLIENT_ID
GITHUB_CALLBACK_URL
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_FROM
FRONTEND_URL
```

---

## Step 5: Run the Setup Workflow (First Time Only)

1. Go to your repo on GitHub
2. Click the **Actions** tab
3. In the left sidebar, click **Setup EC2 Server**
4. Click **Run workflow** → select branch `main` → click the green **Run workflow** button
5. Click on the running workflow to watch the logs
6. Verify all tools show "already installed" or "installing..."

---

## Step 6: Test a Deployment

After the server is set up, test a full deployment:

1. Go to **Actions** tab
2. Click **Deploy Full Stack** in the left sidebar
3. Click **Run workflow** → select `main` → click **Run workflow**
4. Watch the logs — it should pull code, write `.env`, install deps, and restart PM2

---

## How the Workflows Trigger

| Workflow             | Trigger                                  | File                   |
| -------------------- | ---------------------------------------- | ---------------------- |
| Setup EC2 Server     | Manual only (`workflow_dispatch`)        | `setup-server.yml`     |
| Deploy Backend       | Push to `main` with changes in `backend/`| `deploy-backend.yml`   |
| Deploy Frontend      | Push to `main` with changes in `frontend/`| `deploy-frontend.yml` |
| Deploy Full Stack    | Manual only (`workflow_dispatch`)        | `deploy-full.yml`      |

---

## Troubleshooting

### "Permission denied (publickey)" error
- Make sure `EC2_SSH_KEY` contains the **full PEM file content** (including header/footer lines)
- Make sure `EC2_USER` is `ec2-user` (not `root` or `ubuntu`)

### "Host key verification failed"
- The `appleboy/ssh-action` handles this automatically — no action needed

### Workflow not triggering on push
- Check that you're pushing to `main` branch
- Check that your changes are in the correct path (`backend/` or `frontend/`)

### Secrets not being passed to the script
- Make sure the secret/variable names match **exactly** (they are case-sensitive)
- Check that all names are listed in the `envs:` field of the workflow
