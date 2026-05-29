### Habit Tracker

Ứng dụng theo dõi thói quen hàng ngày, xây dựng với React (frontend) và Node.js/Express + PostgreSQL (backend).

## Yêu cầu

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (khuyến nghị)
- Hoặc: Node.js >= 18 + PostgreSQL >= 14

---

## Cách chạy nhanh với Docker

```bash
# 1. Clone repo
git clone <repo-url>
cd habit-tracker

# 2. Tạo file .env từ mẫu
cp .env.example .env
# Chỉnh sửa .env nếu cần (mật khẩu DB, port...)

# 3. Khởi động toàn bộ hệ thống
docker-compose up -d

# 4. Chạy migration tạo bảng
docker exec habit-tracker-backend npm run migrate
```

Sau khi chạy xong:
- **Backend API**: http://localhost:3000/api/health
- **Database**: localhost:5432

### Dừng hệ thống

```bash
docker-compose down
```

---

## Chạy local (không dùng Docker)

### Backend

```bash
cd backend
npm install

# Tạo file .env
cp .env.example .env
# Điền thông tin DB vào .env

# Chạy migration
npm run migrate

# Khởi động server (development)
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại: http://localhost:5173

---

## CI/CD

Project sử dụng **GitHub Actions** (`.github/workflows/ci.yml`).

Pipeline tự động chạy khi **push** hoặc **pull request** vào nhánh `main` / `dev`:

| Bước | Mô tả |
|------|-------|
| Install | Cài đặt dependencies (`npm ci`) |
| Lint | Kiểm tra code style (frontend) |
| Test | Chạy unit tests (backend) |
| Build | Build production bundle (frontend) |

Pipeline sẽ **fail** nếu bất kỳ bước nào có lỗi.

---

## Cấu trúc project

```
habit-tracker/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── db/
│   │   └── middleware/
│   └── Dockerfile
├── frontend/         # React + Vite
│   └── src/
│       ├── components/
│       ├── pages/
│       └── api.js
├── docker-compose.yml
└── .github/
    └── workflows/
        └── ci.yml
```

---

## API chính

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/health` | Kiểm tra server |
| GET | `/api/habits` | Lấy danh sách habits |
| POST | `/api/habits` | Tạo habit mới |
| DELETE | `/api/habits/:id` | Xóa habit |
| GET | `/api/logs` | Lấy lịch sử |
| POST | `/api/logs` | Đánh dấu hoàn thành |

Chi tiết xem tại [backend/README.md](./backend/README.md).

