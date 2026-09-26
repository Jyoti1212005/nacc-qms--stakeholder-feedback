# NAAC-QMS Production Deployment Guide

This guide details the procedures for containerizing, deploying, and maintaining the **NAAC Stakeholder Feedback & Quality Management System (NAAC-QMS)** in high-availability institutional environments.

---

## 1. System Requirements & Architecture

- **Node.js**: v18.0 or higher (LTS recommended)
- **Memory**: Minimum 1 GB RAM (2 GB+ recommended for production)
- **Storage**: SSD with minimum 10 GB free space for evidence repository artifacts
- **Database**: PostgreSQL 15+ (for persistent relational storage)

```
[ Institutional Users & Stakeholders ]
                 │
                 ▼
         [ Nginx / Cloudflare CDN ] (SSL Termination & Rate Limiting)
                 │
                 ▼
      [ Docker / Node.js Express ] (Port 3000)
        ├── Static Frontend (dist/)
        ├── API Routes (/api/*)
        └── Sentiment & Analytics Service
                 │
                 ▼
     [ PostgreSQL Database Cluster ]
```

---

## 2. Environment Variables

Create a `.env` file in the project root:

```ini
# Application Configuration
NODE_ENV=production
PORT=3000
APP_URL=https://naac-qms.your-institution.edu

# NLP / LLM Analytics Configuration (Optional - heuristics fallback used if omitted)
GEMINI_API_KEY="your-api-key-here"

# Database Configuration (for PostgreSQL deployment)
DATABASE_URL="postgresql://naac_user:secure_password@localhost:5432/naac_qms?schema=public"

# Session & Security
JWT_SECRET="your-256-bit-cryptographic-secret-here"
```

---

## 3. Production Build & Execution

### Standard Build:
```bash
# 1. Install production dependencies
npm install --frozen-lockfile

# 2. Build the Vite production bundle
npm run build

# 3. Start the production server via TSX runtime
npm start
```

### Process Management with PM2:
For process monitoring, clustering, and automatic restarts:

```bash
# Install PM2 globally
npm install -g pm2

# Start the cluster with 2 workers
pm2 start server.ts --name "naac-qms" --interpreter ./node_modules/.bin/tsx -i 2

# Save PM2 state for automatic boot restart
pm2 save
pm2 startup
```

---

## 4. Docker Containerization

### `Dockerfile`
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
RUN npm ci

# Copy source code and build frontend bundle
COPY . .
RUN npm run build

# Prune devDependencies for a lean production image
RUN npm prune --production

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy runtime assets
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

USER node
CMD ["npx", "tsx", "server.ts"]
```

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  app:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - DATABASE_URL=postgresql://naac_user:secret_pass@db:5432/naac_qms
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: naac_user
      POSTGRES_PASSWORD: secret_pass
      POSTGRES_DB: naac_qms
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  pgdata:
```

---

## 5. Reverse Proxy Configuration (Nginx)

Place this configuration inside `/etc/nginx/sites-available/naac-qms`:

```nginx
server {
    listen 80;
    server_name naac-qms.institution.edu;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name naac-qms.institution.edu;

    ssl_certificate /etc/letsencrypt/live/naac-qms.institution.edu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/naac-qms.institution.edu/privkey.pem;

    client_max_body_size 25M; # Allows uploading multi-page accreditation evidence

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 6. Backup & Disaster Recovery Strategy

1. **Daily Database Dumps**:
   ```bash
   pg_dump -U naac_user naac_qms | gzip > /backups/naac_qms_$(date +%Y%m%d).sql.gz
   ```
2. **Evidence Artifact Synchronization**: Sync evidence artifacts to an offsite S3-compatible encrypted bucket daily.
3. **Retention Policy**: Retain daily snapshots for 30 days, monthly snapshots for 5 years (to cover a full 5-year NAAC accreditation cycle).
