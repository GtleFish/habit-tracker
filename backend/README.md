# Habit Tracker Backend API

Backend API cho ứng dụng Habit Tracker sử dụng Node.js, Express và PostgreSQL.

## Yêu cầu

- Node.js >= 18
- PostgreSQL >= 14
#
## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
copy .env.example .env
```

3. Cấu hình database trong file `.env`:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=habits
```

4. Tạo database PostgreSQL:
```sql
CREATE DATABASE habits;
```

5. Chạy migration để tạo tables:
```bash
npm run migrate
```

## Chạy ứng dụng

### Development mode (với nodemon):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server sẽ chạy tại `http://localhost:5001`

## API Endpoints

### Health Check
- `GET /api/health` - Kiểm tra server hoạt động

### Habits
- `GET /api/habits` - Lấy danh sách tất cả habits
- `POST /api/habits` - Tạo habit mới
  ```json
  {
    "name": "Exercise",
    "description": "Daily workout"
  }
  ```
- `DELETE /api/habits/:id` - Xóa habit

### Logs
- `GET /api/logs` - Lấy danh sách logs (có thể filter: `?habit_id=1`)
- `POST /api/logs` - Đánh dấu hoàn thành habit
  ```json
  {
    "habit_id": 1,
    "completed_date": "2024-01-15",
    "note": "Completed 30 minutes"
  }
  ```

## Database Schema

### Table: habits
- `id` - SERIAL PRIMARY KEY
- `name` - VARCHAR(255) NOT NULL
- `description` - TEXT
- `created_at` - TIMESTAMP

### Table: logs
- `id` - SERIAL PRIMARY KEY
- `habit_id` - INTEGER (FK to habits)
- `completed_date` - DATE NOT NULL
- `note` - TEXT
- `created_at` - TIMESTAMP
- UNIQUE constraint: (habit_id, completed_date)

## Testing

```bash
npm test
```

## Docker

Build image:
```bash
docker build -t habit-tracker-backend .
```

Run container:
```bash
docker run -p 5001:5001 --env-file .env habit-tracker-backend
```
