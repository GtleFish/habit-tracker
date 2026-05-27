# Habit Tracker - Setup Guide (MySQL)

## Prerequisites

You need to have **MySQL** installed and running on your system.

### Bước 2: Chạy toàn bộ hệ thống
```bash
docker-compose up -d
```

### Bước 3: Chạy migration
```bash
docker exec habit-tracker-backend npm run migrate
```
#
### Bước 4: Kiểm tra
- Backend: http://localhost:5000/api/health
- Database: localhost:5432

#### macOS
```bash
brew install mysql
brew services start mysql
mysql_secure_installation  # (optional setup)
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

## Setup Steps

### 1. Create Database
Open MySQL and create the `habits` database:

```bash
mysql -u root -p
```

Then in the MySQL prompt:
```sql
CREATE DATABASE habits;
exit
```

Or run directly:
```bash
mysql -u root -p -e "CREATE DATABASE habits;"
```

Tạo file `.env`:
```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=habits
```

**Note:** 
- If you didn't set a password during MySQL installation, leave `DB_PASSWORD` empty
- Default MySQL port is `3306`
- Default user is `root`

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Initialize Database Tables
```bash
npm run init-db
```

You should see: `✓ Database tables created successfully`

### 5. Start the Servers

**Terminal 1 - Backend:**
```bash
curl http://localhost:5000/api/health
```

### 2. Tạo habit mới
```bash
curl -X POST http://localhost:5000/api/habits \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Exercise\",\"description\":\"Daily workout\"}"
```

**Terminal 2 - Frontend:**
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

1. Click **"Add Habit"** in the sidebar
2. Enter habit title and description
3. Click **SUBMIT**
4. Your habit appears on the **"My Habits"** page
5. Click the day buttons to mark completion:
   - ✓ (Green) = Completed
   - ✕ (Red) = Missed
   - ⊘ (Gray) = No data
6. Click the **✕** button on a habit card to delete it

## Troubleshooting

### Lỗi: "Connection refused" khi kết nối database
- Kiểm tra PostgreSQL đã chạy: `docker ps` hoặc `pg_isready`
- Kiểm tra thông tin kết nối trong `.env`

### Lỗi: "Port 5000 already in use"
- Đổi PORT trong `.env` hoặc kill process đang dùng port 5000

### Lỗi: "relation does not exist"
- Chạy lại migration: `npm run migrate`

```bash
# Connect to MySQL
mysql -u root -p

# Show all databases
SHOW DATABASES;

# Select database
USE habits;

# Show all tables
SHOW TABLES;

# View habits
SELECT * FROM habits;

# View logs
SELECT * FROM logs;

# Reset database (delete all data)
DROP DATABASE habits;
CREATE DATABASE habits;
```

