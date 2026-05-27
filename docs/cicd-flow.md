# CI/CD Flow
#
## Tổng quan
Document này mô tả quy trình CI/CD (Continuous Integration / Continuous Deployment) cho dự án Habit Tracker, bao gồm development workflow, testing strategy, và deployment process.

## Current Setup - Docker Compose

### Architecture
Hiện tại dự án sử dụng Docker Compose để orchestrate các services trong môi trường development và có thể deploy lên production.

```yaml
services:
  - db (PostgreSQL 15)
  - backend (Node.js + Express)
  - frontend (React + Vite) - optional
```

## Development Workflow

### 1. Local Development Setup

#### Bước 1: Clone repository
```bash
git clone <repository-url>
cd habit-tracker
```

#### Bước 2: Cấu hình Environment Variables
```bash
# Root .env (cho Docker Compose)
cp .env.example .env

# Backend .env
cp backend/.env.example backend/.env

# Frontend .env
cp frontend/.env.example frontend/.env
```

**Cập nhật các giá trị:**
- `DB_PASSWORD`: Mật khẩu PostgreSQL
- `PORT`: Port cho backend (default: 5000)
- `VITE_API_URL`: URL của backend API

#### Bước 3: Start Database
```bash
# Start PostgreSQL container
docker-compose up -d db

# Verify database is running
docker ps | grep habit-tracker-db

# Check logs
docker logs habit-tracker-db
```

#### Bước 4: Run Database Migration
```bash
cd backend
npm install
npm run migrate
```

**Expected output:**
```
Starting database migrations...
Connecting to localhost:5432/habits...
✅ Migrations completed successfully!
```

#### Bước 5: Start Backend (Development Mode)
```bash
cd backend
npm run dev
```

**Expected output:**
```
[nodemon] starting `node --env-file .env src/server.js`
Server running on port 5000
```

#### Bước 6: Start Frontend (Development Mode)
```bash
cd frontend
npm install
npm run dev
```

**Expected output:**
```
VITE v8.0.12  ready in 500 ms

➜  Local:   http://localhost:5001/
➜  Network: use --host to expose
```

### 2. Development Cycle

```
┌─────────────────────────────────────────────────────┐
│  1. Write Code                                      │
│     ↓                                               │
│  2. Test Locally (npm run dev)                     │
│     ↓                                               │
│  3. Run Linter (npm run lint)                      │
│     ↓                                               │
│  4. Commit to feature branch                       │
│     ↓                                               │
│  5. Push to GitHub                                 │
│     ↓                                               │
│  6. Create Pull Request                            │
│     ↓                                               │
│  7. Code Review                                    │
│     ↓                                               │
│  8. Merge to main                                  │
│     ↓                                               │
│  9. Deploy to Production                           │
└─────────────────────────────────────────────────────┘
```

## Git Workflow

### Branch Strategy

```
main (production)
  ↑
  └── dev (staging)
       ↑
       ├── feature/add-habit-tags
       ├── feature/user-authentication
       └── bugfix/cors-error
```

### Branch Naming Convention
- `feature/<feature-name>`: Tính năng mới
- `bugfix/<bug-name>`: Sửa lỗi
- `hotfix/<issue-name>`: Sửa lỗi khẩn cấp trên production
- `refactor/<component-name>`: Refactor code

### Commit Message Convention
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Cập nhật documentation
- `style`: Format code (không ảnh hưởng logic)
- `refactor`: Refactor code
- `test`: Thêm/sửa tests
- `chore`: Cập nhật build tools, dependencies

**Examples:**
```
feat(habits): add ability to archive habits
fix(api): resolve CORS error on production
docs(readme): update installation instructions
```

## CI/CD Pipeline (Proposed)

### Trigger Events
- **Push** to `main` or `dev` branch
- **Pull Request** to `main` or `dev` branch
- **Manual trigger** via GitHub Actions UI

### Pipeline Stages

```
┌──────────────┐
│   Trigger    │ (Push/PR)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Stage 1:    │
│  Checkout    │ (Clone repository)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Stage 2:    │
│  Install     │ (npm install)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Stage 3:    │
│  Lint        │ (npm run lint)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Stage 4:    │
│  Test        │ (npm test)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Stage 5:    │
│  Build       │ (npm run build)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Stage 6:    │
│  Deploy      │ (Docker/Cloud)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Stage 7:    │
│  Verify      │ (Health check)
└──────────────┘
```

### Stage 1: Checkout Code
```yaml
- name: Checkout code
  uses: actions/checkout@v3
```

### Stage 2: Setup Environment
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '18'
    cache: 'npm'

- name: Install dependencies (Backend)
  run: |
    cd backend
    npm ci

- name: Install dependencies (Frontend)
  run: |
    cd frontend
    npm ci
```

### Stage 3: Linting
```yaml
- name: Run ESLint (Backend)
  run: |
    cd backend
    npm run lint

- name: Run ESLint (Frontend)
  run: |
    cd frontend
    npm run lint
```

**Exit criteria:** All linting rules pass

### Stage 4: Testing
```yaml
- name: Run unit tests (Backend)
  run: |
    cd backend
    npm test

- name: Run unit tests (Frontend)
  run: |
    cd frontend
    npm test
```

**Exit criteria:** All tests pass (100% success rate)

### Stage 5: Build
```yaml
- name: Build Frontend
  run: |
    cd frontend
    npm run build

- name: Build Docker images
  run: |
    docker-compose build
```

**Exit criteria:** Build completes without errors

### Stage 6: Deploy

#### Option A: Docker Compose (VPS/EC2)
```yaml
- name: Deploy to production
  run: |
    docker-compose -f docker-compose.prod.yml up -d
```

#### Option B: Cloud Platform (Render/Railway)
```yaml
- name: Deploy Backend to Render
  uses: render-deploy-action@v1
  with:
    service-id: ${{ secrets.RENDER_SERVICE_ID }}
    api-key: ${{ secrets.RENDER_API_KEY }}

- name: Deploy Frontend to Vercel
  uses: vercel/action@v1
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Stage 7: Post-Deployment Verification
```yaml
- name: Health check
  run: |
    curl -f https://api.example.com/api/health || exit 1

- name: Smoke tests
  run: |
    npm run test:e2e
```

## Environment Variables & Secrets

### GitHub Secrets (Required)
Các secrets cần được cấu hình trong GitHub repository settings:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `DB_PASSWORD` | Database password | `secure_password_123` |
| `RENDER_API_KEY` | Render.com API key | `rnd_xxx...` |
| `VERCEL_TOKEN` | Vercel deployment token | `xxx...` |
| `DOCKER_USERNAME` | Docker Hub username | `myusername` |
| `DOCKER_PASSWORD` | Docker Hub password | `xxx...` |

### Environment-specific Variables

#### Development
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
VITE_API_URL=http://localhost:5000
```

#### Staging
```env
NODE_ENV=staging
PORT=5000
DB_HOST=staging-db.example.com
VITE_API_URL=https://staging-api.example.com
```

#### Production
```env
NODE_ENV=production
PORT=5000
DB_HOST=prod-db.example.com
VITE_API_URL=https://api.example.com
```

## Deployment Strategies

### Strategy 1: Blue-Green Deployment
```
┌─────────────┐
│   Blue      │ (Current production)
│  v1.0.0     │
└─────────────┘
       ↓
┌─────────────┐
│   Green     │ (New version)
│  v1.1.0     │
└─────────────┘
       ↓ (Switch traffic)
┌─────────────┐
│   Green     │ (Now production)
│  v1.1.0     │
└─────────────┘
```

**Pros:** Zero downtime, easy rollback
**Cons:** Requires 2x resources

### Strategy 2: Rolling Deployment
```
Instance 1: v1.0 → v1.1 ✓
Instance 2: v1.0 → v1.1 ✓
Instance 3: v1.0 → v1.1 ✓
```

**Pros:** Gradual rollout, less resources
**Cons:** Mixed versions during deployment

### Strategy 3: Canary Deployment
```
90% traffic → v1.0 (stable)
10% traffic → v1.1 (canary)
       ↓ (Monitor metrics)
100% traffic → v1.1 (if successful)
```

**Pros:** Risk mitigation, early issue detection
**Cons:** Complex routing logic

## Rollback Procedure

### Automatic Rollback Triggers
- Health check fails after deployment
- Error rate > 5% in first 5 minutes
- Response time > 2x baseline

### Manual Rollback Steps
```bash
# 1. Identify last stable version
git log --oneline

# 2. Revert to previous version
git revert <commit-hash>

# 3. Redeploy
docker-compose up -d

# 4. Verify
curl http://localhost:5000/api/health
```

## Monitoring & Alerting

### Health Checks
```bash
# Backend health
GET /api/health
Response: {"ok": true}

# Database connectivity
docker exec habit-tracker-db pg_isready -U postgres

# Frontend availability
curl -I http://localhost:5001
```

### Metrics to Monitor
- **Response Time:** < 200ms (p95)
- **Error Rate:** < 1%
- **Uptime:** > 99.9%
- **Database Connections:** < 80% of pool size
- **Memory Usage:** < 80%
- **CPU Usage:** < 70%

### Alerting Rules
```yaml
alerts:
  - name: HighErrorRate
    condition: error_rate > 5%
    duration: 5m
    action: notify_slack

  - name: SlowResponse
    condition: response_time_p95 > 1s
    duration: 10m
    action: notify_email

  - name: DatabaseDown
    condition: db_connection_failed
    duration: 1m
    action: page_oncall
```

## Testing Strategy

### Unit Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

**Coverage target:** > 80%

### Integration Tests
```bash
# Test API endpoints
npm run test:integration
```

**Scenarios:**
- Create habit → Verify in database
- Mark complete → Verify log created
- Delete habit → Verify cascade delete

### End-to-End Tests
```bash
# Using Playwright/Cypress
npm run test:e2e
```

**User flows:**
1. Open app → See empty state
2. Create habit → See in list
3. Mark complete → See checkmark
4. View history → See log entry

## Database Migration Strategy

### Migration Files
```
backend/src/db/migrations/
├── 001_init.sql          (Initial schema)
├── 002_add_tags.sql      (Add tags feature)
└── 003_add_users.sql     (Add authentication)
```

### Migration Process
```bash
# Development
npm run migrate

# Production (with backup)
pg_dump habits > backup_$(date +%Y%m%d).sql
npm run migrate
```

### Rollback Migration
```sql
-- Each migration should have a DOWN script
-- 002_add_tags_down.sql
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS habit_tags;
```

## Disaster Recovery

### Backup Strategy
- **Frequency:** Daily automated backups
- **Retention:** 30 days
- **Storage:** S3 / Cloud Storage
- **Encryption:** AES-256

### Recovery Procedure
```bash
# 1. Stop application
docker-compose down

# 2. Restore database
docker exec -i habit-tracker-db psql -U postgres -d habits < backup.sql

# 3. Restart application
docker-compose up -d

# 4. Verify data integrity
curl http://localhost:5000/api/habits
```

### Recovery Time Objective (RTO)
- **Target:** < 1 hour
- **Maximum acceptable:** 4 hours

### Recovery Point Objective (RPO)
- **Target:** < 1 hour (last backup)
- **Maximum acceptable:** 24 hours

## Security in CI/CD

### Code Scanning
```yaml
- name: Run security audit
  run: npm audit --audit-level=high

- name: Scan for secrets
  uses: trufflesecurity/trufflehog@main
```

### Dependency Scanning
```yaml
- name: Check for vulnerabilities
  run: |
    npm audit
    npm outdated
```

### Container Scanning
```yaml
- name: Scan Docker image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: habit-tracker-backend:latest
```

## Performance Optimization

### Build Optimization
- Use multi-stage Docker builds
- Cache npm dependencies
- Minimize image size (Alpine Linux)

### Runtime Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement database connection pooling
- Add Redis caching layer (future)

## Checklist Before Deployment

### Pre-Deployment
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migration tested
- [ ] Backup created
- [ ] Rollback plan documented

### Post-Deployment
- [ ] Health check passing
- [ ] Smoke tests completed
- [ ] Monitoring dashboards checked
- [ ] Error logs reviewed
- [ ] Performance metrics normal
- [ ] Stakeholders notified

## Troubleshooting Common Issues

### Issue 1: Build Fails
```bash
# Clear cache and rebuild
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue 2: Database Connection Fails
```bash
# Check database is running
docker ps | grep postgres

# Check connection string
echo $DATABASE_URL

# Test connection
docker exec -it habit-tracker-db psql -U postgres -d habits
```

### Issue 3: Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Kill process (Linux/Mac)
kill -9 <PID>
```

## Future Improvements

### Short-term (1-3 months)
- [ ] Implement automated testing in CI
- [ ] Add code coverage reporting
- [ ] Setup staging environment
- [ ] Implement blue-green deployment

### Long-term (3-6 months)
- [ ] Kubernetes orchestration
- [ ] Auto-scaling based on load
- [ ] Multi-region deployment
- [ ] Advanced monitoring (APM)
- [ ] Chaos engineering tests