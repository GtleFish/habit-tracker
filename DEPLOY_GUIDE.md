# Hướng Dẫn Triển Khai & Sử Dụng (Deployment & Usage Guide)

Tài liệu này hướng dẫn chi tiết cách cấu hình tự động triển khai (Auto-Deploy) từ nhánh `develop` lên **Render** (Backend) và **Vercel** (Frontend), cách vận hành ứng dụng trên Local (có/không dùng Docker) và quản lý môi trường.

---

## 1. Chuyển Nhánh Deploy Tự Động Sang `develop`

Để tránh việc phải chuyển code hoặc push thủ công từ `develop` sang `feature/infrastructure`, hãy thực hiện các bước cấu hình sau trên Dashboard của Render và Vercel:

### 🔹 Cấu Hình Trên Render (Backend)
Render hỗ trợ thay đổi nhánh deploy trực tiếp trên giao diện quản trị mà không làm mất cấu hình biến môi trường:
1. Truy cập vào [Render Dashboard](https://dashboard.render.com/).
2. Chọn Web Service backend của bạn (`habit-tracker-backend` hoặc tên tương ứng).
3. Đi đến mục **Settings** ở thanh menu bên trái.
4. Tìm phần **Branch** (mặc định đang là `feature/infrastructure`).
5. Đổi giá trị thành `develop`.
6. Cuộn xuống và nhấn **Save Changes**.
7. *Kể từ bây giờ, bất kỳ khi nào bạn push code mới lên nhánh `develop` trên GitHub, Render sẽ tự động build và deploy phiên bản mới nhất.*

### 🔹 Cấu Hình Trên Vercel (Frontend)
Nếu bạn kết nối trực tiếp GitHub Repo với Vercel để Auto-Deploy:
1. Truy cập [Vercel Dashboard](https://vercel.com/).
2. Chọn dự án Frontend (`habit-tracker-frontend`).
3. Đi tới tab **Settings** -> **Git**.
4. Trong phần **Production Branch**, đổi nhánh chính từ `main` (hoặc nhánh hiện tại) thành `develop`.
5. Nhấn **Save**.
6. *Mỗi khi có code mới được merge hoặc push vào `develop`, Vercel sẽ tự động build bản Production.*

---

## 2. Quy Trình Deploy Thủ Công (Nếu Cần)

### 🚀 Deploy Backend (Nếu không dùng Auto-Deploy)
Nếu bạn muốn deploy thủ công qua Git lên một nhánh deploy phụ (như `feature/infrastructure`):
```bash
# Push từ nhánh develop local lên nhánh deploy trên github
git push origin develop:feature/infrastructure --force
```

### 🚀 Deploy Frontend Qua Vercel CLI
Nếu bạn muốn trực tiếp deploy từ máy cá nhân lên Vercel production:
```bash
cd frontend
# Đăng nhập (nếu chưa)
vercel login

# Deploy trực tiếp lên production
vercel --prod --yes
```

---

## 3. Kiến Trúc Môi Trường & Biến Môi Trường (Environment Variables)

### 🗄️ Backend (Render - PostgreSQL)
Khi deploy lên Render, hãy đảm bảo các biến môi trường sau đã được cấu hình trong **Settings -> Environment Variables**:

| Tên Biến | Giá trị Khuyến nghị / Mô tả |
| :--- | :--- |
| `PORT` | `3000` (Render sẽ tự động mapping port nếu để trống) |
| `DB_HOST` | Địa chỉ Host của PostgreSQL (Lấy từ Render PostgreSQL Internal Database URL) |
| `DB_PORT` | `5432` |
| `DB_USER` | Tên user database |
| `DB_PASSWORD` | Mật khẩu database |
| `DB_NAME` | Tên database |
| `NODE_ENV` | `production` (khi chạy prod để kích hoạt SSL kết nối DB bảo mật) |

> [!IMPORTANT]
> Lệnh khởi động (Start Command) trên Render cần cấu hình là:
> ```bash
> npm run migrate && npm start
> ```
> Điều này đảm bảo cơ sở dữ liệu luôn được cập nhật tự động bằng tệp SQL Migration mới nhất mỗi khi service khởi chạy.

### 💻 Frontend (Vercel)
Cấu hình trong **Settings -> Environment Variables** trên Vercel:

| Tên Biến | Giá trị / Mô tả |
| :--- | :--- |
| `VITE_API_URL` | Đường dẫn gốc của Backend API (Ví dụ: `https://habit-tracker-r2tw.onrender.com`) |

> [!WARNING]
> Không được hardcode địa chỉ `http://localhost:3000` trong mã nguồn frontend. Luôn sử dụng `import.meta.env.VITE_API_URL` để gọi API.

---

## 4. Hướng Dẫn Chạy Dưới Local (Local Development)

### 🐳 Cách 1: Sử Dụng Docker (Nhanh & Tiện nhất)
Docker tự động thiết lập Node.js và PostgreSQL cục bộ mà không cần cài đặt thủ công.

1. Khởi động Docker Desktop.
2. Tạo file `.env` ở thư mục gốc:
   ```bash
   cp .env.example .env
   ```
3. Khởi động các container:
   ```bash
   docker-compose up -d --build
   ```
4. Chạy migration để tạo bảng cơ sở dữ liệu:
   ```bash
   docker exec -it habit-tracker-backend npm run migrate
   ```
5. Truy cập ứng dụng:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000/api/health`

---

### 💻 Cách 2: Chạy Thủ Công (Không dùng Docker)

#### Bước 1: Setup Cơ Sở Dữ Liệu PostgreSQL
- Đảm bảo đã cài đặt PostgreSQL trên máy.
- Tạo một database mới tên là `habits`.

#### Bước 2: Setup & Chạy Backend
```bash
cd backend
npm install

# Tạo và cấu hình file .env
cp .env.example .env
# Chỉnh sửa file .env với thông tin kết nối DB postgres cục bộ của bạn

# Chạy migration tạo bảng
npm run migrate

# Chạy server ở chế độ Development (tự động reload khi sửa code)
npm run dev
```

#### Bước 3: Setup & Chạy Frontend
```bash
cd ../frontend
npm install

# Tạo file .env và trỏ về local backend
echo "VITE_API_URL=http://localhost:5000" > .env

# Chạy frontend dev server
npm run dev
```
Truy cập giao diện tại: `http://localhost:5173`

---

## 5. Quy Trình Phát Triển & Kiểm Thử Tự Động (CI/CD Pipeline)

Dự án tích hợp sẵn **GitHub Actions** (`.github/workflows/ci.yml`). Bất kỳ khi nào có Pull Request hoặc Push lên nhánh `develop` hoặc `main`, pipeline sẽ tự động thực hiện:

1. **Backend — Lint & Test**:
   - Khởi động một container PostgreSQL ảo.
   - Cài đặt thư viện backend.
   - Chạy toàn bộ các bài kiểm thử tự động (`npm test`) để phát hiện lỗi logic.
2. **Frontend — Lint & Build**:
   - Cài đặt thư viện frontend.
   - Chạy ESLint kiểm tra định dạng và tiêu chuẩn viết mã nguồn.
   - Biên dịch thử nghiệm (`npm run build`) để kiểm tra lỗi cú pháp trước khi deploy thực tế.

> [!TIP]
> Hãy luôn chạy `npm run lint` ở frontend và `npm test` ở backend dưới local trước khi push code lên GitHub để đảm bảo pipeline CI/CD luôn có trạng thái xanh (Passed)!
