# System Architecture

## Tổng quan
Habit Tracker là ứng dụng web full-stack giúp người dùng theo dõi và quản lý thói quen hàng ngày. Hệ thống được xây dựng theo kiến trúc 3 tầng (3-tier architecture) với Frontend, Backend API và Database tách biệt.

## Các thành phần chính

### 1. Frontend (React + Vite)
- **Công nghệ:** React 19.2.6, Vite 8.0.12
- **Port:** 5001 (configured in vite.config.js) / 5173 (Vite default)
- **Chức năng:**
  - Giao diện người dùng (UI/UX)
  - Quản lý state với React Hooks
  - Gọi API backend thông qua fetch
  - Client-side routing và navigation
- **Cấu trúc thư mục:**
  ```
  frontend/
  ├── src/
  │   ├── components/     # Reusable components
  │   │   ├── HabitCard.jsx
  │   │   ├── Header.jsx
  │   │   └── Sidebar.jsx
  │   ├── pages/          # Page components
  │   │   ├── HabitsList.jsx
  │   │   ├── AddHabit.jsx
  │   │   └── History.jsx
  │   ├── api.js          # API client
  │   ├── App.jsx         # Main app component
  │   └── main.jsx        # Entry point
  └── .env                # Environment variables
  ```

### 2. Backend (Node.js + Express)
- **Công nghệ:** Node.js, Express 5.2.1, PostgreSQL driver (pg 8.20.0)
- **Port:** 5000 (configurable via .env)
- **Chức năng:**
  - RESTful API endpoints
  - Business logic và validation
  - Database connection pooling
  - Error handling middleware
  - CORS configuration
- **Cấu trúc thư mục:**
  ```
  backend/
  ├── src/
  │   ├── controllers/    # Request handlers
  │   │   ├── habits.controller.js
  │   │   └── logs.controller.js
  │   ├── routes/         # API routes
  │   │   ├── habits.routes.js
  │   │   └── logs.routes.js
  │   ├── db/             # Database
  │   │   ├── index.js    # Connection pool
  │   │   ├── migrate.js  # Migration runner
  │   │   └── migrations/
  │   │       └── 001_init.sql
  │   ├── middleware/     # Express middleware
  │   │   └── error.middleware.js
  │   └── server.js       # Server entry point
  └── app.js              # Express app setup
  ```

### 3. Database (PostgreSQL)
- **Công nghệ:** PostgreSQL 15 (Alpine Linux)
- **Port:** 5432
- **Deploy:** Docker container
- **Chức năng:**
  - Lưu trữ dữ liệu persistent
  - Relational data với foreign keys
  - Indexes để tối ưu query performance

## Sơ đồ kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                    (User Interface)                     │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/HTTPS
                         │ Port 5001
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Frontend Layer                        │
│              React 19 + Vite 8                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Components: HabitCard, Header, Sidebar         │   │
│  │  Pages: HabitsList, AddHabit, History           │   │
│  │  State Management: React Hooks (useState)       │   │
│  │  API Client: fetch (api.js)                     │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ REST API
                         │ http://localhost:5000/api
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend Layer                         │
│              Node.js + Express 5                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Routes: /api/habits, /api/logs                 │   │
│  │  Controllers: Business logic                    │   │
│  │  Middleware: CORS, Error handling               │   │
│  │  Validation: Request body validation            │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ SQL Queries
                         │ pg Pool (TCP 5432)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Database Layer                        │
│              PostgreSQL 15 (Docker)                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Tables: habits, logs                           │   │
│  │  Indexes: habit_id, completed_date              │   │
│  │  Constraints: Foreign keys, UNIQUE              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Data Flow (Luồng dữ liệu)

### Flow 1: Tạo Habit mới
```
1. User nhập form "Tạo Habit" trên Frontend
2. Frontend gọi: POST /api/habits với body {name, description}
3. Backend nhận request → Validate input
4. Backend thực thi: INSERT INTO habits (name, description) VALUES (...)
5. PostgreSQL lưu data → Trả về habit object với id
6. Backend format response → Trả về status 201 + habit object
7. Frontend nhận response → Cập nhật UI (thêm habit vào list)
```

### Flow 2: Đánh dấu hoàn thành
```
1. User click checkbox trên HabitCard
2. Frontend gọi: POST /api/logs với {habit_id, completed_date, note}
3. Backend validate → INSERT INTO logs (...)
4. PostgreSQL lưu log → Trả về log object
5. Backend trả về status 201
6. Frontend reload data → UI hiển thị checkmark
```

### Flow 3: Xem lịch sử
```
1. User click tab "Lịch sử"
2. Frontend gọi: GET /api/logs
3. Backend query: SELECT * FROM logs JOIN habits ON ...
4. PostgreSQL trả về danh sách logs
5. Backend format data → Trả về JSON array
6. Frontend render History component với data
```

## API Endpoints

### Habits API

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/habits` | Lấy tất cả habits | - | `200: Array<Habit>` |
| POST | `/api/habits` | Tạo habit mới | `{name, description?}` | `201: Habit` |
| DELETE | `/api/habits/:id` | Xóa habit | - | `200: {message, habit}` |

### Logs API

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/logs` | Lấy tất cả logs | Query: `?habit_id=1` | `200: Array<Log>` |
| POST | `/api/logs` | Tạo log mới | `{habit_id, completed_date, note?}` | `201: Log` |

### Health Check

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/health` | Kiểm tra server status | `200: {ok: true}` |

## Database Schema

### Table: `habits`
```sql
CREATE TABLE habits (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id`: Primary key, auto-increment
- `name`: Tên habit (bắt buộc, max 255 ký tự)
- `description`: Mô tả chi tiết (optional)
- `created_at`: Timestamp tạo habit

### Table: `logs`
```sql
CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(habit_id, completed_date)
);
```

**Columns:**
- `id`: Primary key, auto-increment
- `habit_id`: Foreign key tới `habits.id` (CASCADE delete)
- `completed_date`: Ngày hoàn thành habit
- `note`: Ghi chú (optional)
- `created_at`: Timestamp tạo log

**Constraints:**
- `UNIQUE(habit_id, completed_date)`: Mỗi habit chỉ được đánh dấu 1 lần/ngày

### Indexes
```sql
CREATE INDEX idx_logs_habit_id ON logs(habit_id);
CREATE INDEX idx_logs_completed_date ON logs(completed_date);
```

## Entity Relationship Diagram (ERD)

```
┌─────────────────────┐
│      habits         │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ description         │
│ created_at          │
└──────────┬──────────┘
           │
           │ 1:N
           │
           ▼
┌─────────────────────┐
│       logs          │
├─────────────────────┤
│ id (PK)             │
│ habit_id (FK)       │
│ completed_date      │
│ note                │
│ created_at          │
└─────────────────────┘
```

**Relationship:** Một habit có thể có nhiều logs (1:N)

## Technology Stack

### Frontend
- **Framework:** React 19.2.6
- **Build Tool:** Vite 8.0.12
- **Language:** JavaScript (ES6+)
- **Styling:** CSS3
- **HTTP Client:** Fetch API

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5.2.1
- **Database Driver:** pg 8.20.0 (PostgreSQL)
- **Middleware:** cors 2.8.6, dotenv 16.4.5
- **Dev Tools:** nodemon 3.1.14

### Database
- **DBMS:** PostgreSQL 15
- **Container:** Docker (postgres:15-alpine)

### DevOps
- **Containerization:** Docker, Docker Compose
- **Environment Management:** .env files

## Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000
```

### Backend (`.env`)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=habits
```

### Docker Compose (root `.env`)
```env
PORT=5000
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=habits
```

## Security Considerations

1. **CORS:** Backend cấu hình CORS để chỉ cho phép Frontend domain
2. **SQL Injection:** Sử dụng parameterized queries ($1, $2) thay vì string concatenation
3. **Environment Variables:** Sensitive data (password) được lưu trong .env, không commit vào Git
4. **Input Validation:** Backend validate tất cả input trước khi query database
5. **Error Handling:** Không expose stack trace ra client trong production

## Scalability & Performance

### Current Limitations
- Single instance backend (không horizontal scaling)
- No caching layer
- No load balancer

### Optimization Opportunities
1. **Database Indexes:** Đã có indexes trên `habit_id` và `completed_date`
2. **Connection Pooling:** Sử dụng pg Pool để reuse connections
3. **Frontend:** Code splitting với React.lazy() (chưa implement)
4. **CDN:** Static assets có thể serve qua CDN

## Deployment Architecture

### Development
```
localhost:5001 (Frontend) → localhost:5000 (Backend) → localhost:5432 (PostgreSQL Docker)
```

### Production (Proposed)
```
Vercel (Frontend) → Render/Railway (Backend) → Managed PostgreSQL (Render/Supabase)
```

## Monitoring & Logging

### Current Implementation
- Console.log trong backend
- Browser DevTools trong frontend
- Docker logs: `docker-compose logs -f`

### Recommended Additions
- Structured logging (Winston, Pino)
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)
- Database query logging