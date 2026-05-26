# Hướng dẫn Setup Habit Tracker

## Phương án 1: Chạy với Docker (Khuyến nghị)

### Bước 1: Cài đặt Docker
- Tải Docker Desktop: https://www.docker.com/products/docker-desktop

### Bước 2: Chạy toàn bộ hệ thống
```bash
docker-compose up -d
```

### Bước 3: Chạy migration
```bash
docker exec habit-tracker-backend npm run migrate
```

### Bước 4: Kiểm tra
- Backend: http://localhost:5000/api/health
- Database: localhost:5432

### Dừng hệ thống
```bash
docker-compose down
```

### Xem logs
```bash
docker-compose logs -f backend
```

---

## Phương án 2: Chạy Local (Development)

### Bước 1: Cài đặt PostgreSQL
- Windows: https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql`
- Linux: `sudo apt install postgresql`

### Bước 2: Tạo database
```sql
CREATE DATABASE habits;
```

### Bước 3: Setup Backend

```bash
cd backend
npm install
```

Tạo file `.env`:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=habits
NODE_ENV=development
```

Chạy migration:
```bash
npm run migrate
```

Chạy server:
```bash
npm run dev
```

### Bước 4: Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Test API với curl hoặc Postman

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Tạo habit mới
```bash
curl -X POST http://localhost:5000/api/habits \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Exercise\",\"description\":\"Daily workout\"}"
```

### 3. Lấy danh sách habits
```bash
curl http://localhost:5000/api/habits
```

### 4. Đánh dấu hoàn thành
```bash
curl -X POST http://localhost:5000/api/logs \
  -H "Content-Type: application/json" \
  -d "{\"habit_id\":1,\"completed_date\":\"2024-01-15\",\"note\":\"Done!\"}"
```

### 5. Xem lịch sử
```bash
curl http://localhost:5000/api/logs?habit_id=1
```

### 6. Xóa habit
```bash
curl -X DELETE http://localhost:5000/api/habits/1
```

---

## Troubleshooting

### Lỗi: "Connection refused" khi kết nối database
- Kiểm tra PostgreSQL đã chạy: `docker ps` hoặc `pg_isready`
- Kiểm tra thông tin kết nối trong `.env`

### Lỗi: "Port 5000 already in use"
- Đổi PORT trong `.env` hoặc kill process đang dùng port 5000

### Lỗi: "relation does not exist"
- Chạy lại migration: `npm run migrate`

### Reset database
```bash
# Trong PostgreSQL
DROP DATABASE habits;
CREATE DATABASE habits;

# Chạy lại migration
npm run migrate
```

---

## Phân công công việc

### TV1 - Backend Engineer
- ✅ Hoàn thiện API endpoints
- ✅ Viết unit tests cho controllers
- ✅ Xử lý validation và error handling

### TV2 - Frontend Engineer
- Xây dựng UI React
- Tích hợp API
- Responsive design

### TV3 - DevOps Engineer
- Setup GitHub Actions
- Viết CI/CD pipeline
- Automated testing

### TV4 - Infrastructure Engineer
- Hoàn thiện Docker setup
- Deploy lên Render/Railway
- Monitoring

### TV5 - QA/SRE Engineer
- Viết test cases
- Tạo incident reports
- Documentation
