# Hướng Dẫn Triển Khai & Xử Lý Sự Cố (Deployment & Troubleshooting Guide)

Tài liệu này hướng dẫn chi tiết cách cấu hình tự động triển khai (Auto-Deploy) từ nhánh **`develop`** lên **Render** (Backend) và **Vercel** (Frontend), cách vận hành ứng dụng trên Local (có/không dùng Docker) và các bước xử lý sự cố chi tiết khi triển khai gặp lỗi.

---

## 0. Các Đường Link Deploy

| Mục | Đường link |
| :--- | :--- |
| Frontend public (Vercel) | [https://habit-tracker-frontend-vert.vercel.app](https://habit-tracker-frontend-vert.vercel.app) |
| Backend API public (Render) | [https://habit-tracker-r2tw.onrender.com](https://habit-tracker-r2tw.onrender.com) |
| Backend health check | [https://habit-tracker-r2tw.onrender.com/api/health](https://habit-tracker-r2tw.onrender.com/api/health) |
| Backend habits API | [https://habit-tracker-r2tw.onrender.com/api/habits](https://habit-tracker-r2tw.onrender.com/api/habits) |
| GitHub nhánh `develop` | [https://github.com/GtleFish/habit-tracker/tree/develop](https://github.com/GtleFish/habit-tracker/tree/develop) |
| Vercel Project Dashboard | [https://vercel.com/hoang-ngoc-tue-s-projects/habit-tracker-frontend](https://vercel.com/hoang-ngoc-tue-s-projects/habit-tracker-frontend) |
| Render Dashboard | [https://dashboard.render.com/](https://dashboard.render.com/) |

> Nếu Vercel tạo URL production khác hoặc bạn dùng custom domain, hãy cập nhật lại dòng **Frontend public (Vercel)** theo URL đang hiển thị trong tab **Deployments** của Vercel.
> Khi mở link Backend API public ở đường dẫn gốc `/` và thấy `Cannot GET /`, đó không nhất thiết là lỗi deploy. Hãy kiểm tra bằng endpoint `/api/health`; nếu trả về `{ "ok": true }` thì backend đang chạy.

---

## 1. Cấu Hình Deploy Nhánh `develop`

Để đồng bộ hóa quy trình, tất cả các môi trường (Staging/Production) sẽ được phân phát trực tiếp từ nhánh phát triển chính **`develop`**.

### 🔹 1.1. Cấu Hình Trên Render (Backend API)
Để Render tự động biên dịch và triển khai mỗi khi bạn push code mới lên nhánh `develop` trên GitHub:
1. Truy cập [Render Dashboard](https://dashboard.render.com/).
2. Chọn Web Service của bạn (ví dụ: `habit-tracker-backend`).
3. Điều hướng tới mục **Settings** ở menu bên trái.
4. Tìm trường **Branch** và đổi giá trị thành **`develop`**.
5. Cuộn xuống dưới cùng và nhấn **Save Changes**.
6. *Từ bây giờ, Render sẽ tự động deploy mỗi khi nhánh `develop` trên GitHub được cập nhật.*

### 🔹 1.2. Cấu Hinh Trên Vercel (Frontend UI)
Tùy thuộc vào việc dự án Vercel của bạn đã được kết nối với GitHub hay chưa, hãy chọn một trong hai phương án sau:

#### 👉 Trường Hợp A: Vercel ĐÃ kết nối với GitHub (Auto-Deploy)
Nếu Vercel của bạn được liên kết trực tiếp với GitHub Repository:
1. Truy cập [Vercel Dashboard](https://vercel.com/) -> Chọn dự án `habit-tracker-frontend`.
2. Đi tới **Settings** -> **Git**.
3. Tại phần **Production Branch**, thay đổi nhánh mặc định (thường là `main` hoặc `master`) thành **`develop`** và lưu lại.
4. *Lưu ý quan trọng:* Trong **Settings** -> **General** -> mục **Root Directory**, bạn bắt buộc phải nhập là **`frontend`** (vì đây là cấu trúc monorepo chứa cả backend và frontend).

#### 👉 Trường Hợp B: Vercel CHƯA kết nối với GitHub (Deploy Thủ Công qua CLI)
Nếu phần Git của bạn hiển thị thông báo *"This Project is not connected to a Git repository"*:
Bạn không cần đổi cài đặt trên web, thay vào đó bạn sẽ deploy trực tiếp từ local:
```bash
cd frontend
# Chạy lệnh build và deploy trực tiếp code của nhánh hiện tại lên Vercel
vercel --prod --yes
```

---

## 2. Các Biến Môi Trường Quan Trọng

### 🗄️ Backend (Render - PostgreSQL)
Cấu hình trong mục **Settings -> Environment Variables** trên Render:

| Tên Biến | Giá trị / Ý nghĩa |
| :--- | :--- |
| `PORT` | `3000` (hoặc để trống để Render tự cấu hình) |
| `DB_HOST` | Địa chỉ host của database PostgreSQL trên Render |
| `DB_PORT` | `5432` |
| `DB_USER` | Tên đăng nhập database |
| `DB_PASSWORD` | Mật khẩu database |
| `DB_NAME` | Tên database |
| `NODE_ENV` | `production` (bắt buộc để kích hoạt chế độ SSL bảo mật kết nối với PostgreSQL) |

> [!IMPORTANT]
> **Start Command** trên Render phải được thiết lập chính xác là:
> ```bash
> npm run migrate && npm start
> ```
> Lệnh này đảm bảo Render tự động chạy các tệp migration tạo bảng dữ liệu mới nhất trước khi bật API lên.

### 💻 Frontend (Vercel)
Cấu hình trong **Settings -> Environment Variables** trên Vercel:

| Tên Biến | Giá trị / Ý nghĩa |
| :--- | :--- |
| `VITE_API_URL` | Địa chỉ URL Backend API đã deploy thành công trên Render (ví dụ: `https://habit-tracker-r2tw.onrender.com`) |

---

## 3. Hướng Dẫn Xử Lý Sự Cố Khi Deploy Thất Bại (Troubleshooting)

Dưới đây là tổng hợp các trường hợp lỗi thường gặp và cách xử lý nhanh chóng:

### ❌ Lỗi 1: Trang Vercel chỉ hiển thị màn hình mặc định của Vite (Boilerplate)
* **Triệu chứng:** Khi mở link frontend, bạn chỉ thấy màn hình giới thiệu của Vite "Get started... edit src/App.jsx" thay vì giao diện theo dõi thói quen.
* **Nguyên nhân:** Thư mục chạy deploy bị cấu hình sai, Vercel đang biên dịch file của thư mục gốc của Git chứa mã nguồn mẫu thay vì mã nguồn thực tế nằm trong `/frontend`.
* **Cách khắc phục:**
  1. Nếu deploy qua Git: Truy cập **Vercel Dashboard** -> **Settings** -> **General** -> mục **Root Directory**, sửa thành **`frontend`** và thực hiện Redeploy.
  2. Nếu deploy qua CLI: Đảm bảo bạn đã dùng lệnh `cd frontend` trước khi chạy `vercel --prod --yes`.

---

### ❌ Lỗi 2: Frontend load thành công nhưng không lấy được dữ liệu / Lỗi "Không thể kết nối backend"
* **Triệu chứng:** Giao diện Habit Tracker hiển thị nhưng danh sách thói quen trống trơn và có dòng thông báo lỗi kết nối.
* **Nguyên nhân 1 (Thời gian chờ):** Bạn sử dụng Render gói Free. Nếu không có lượt truy cập trong 15 phút, server API sẽ tự động ngủ (Sleep). Lần truy cập đầu tiên có thể mất từ 30–50 giây để server "thức dậy".
  * *Giải pháp:* Hãy kiên nhẫn đợi 1 phút và F5 tải lại trang.
* **Nguyên nhân 2 (Thiếu biến môi trường):** Vercel chưa nhận diện được địa chỉ API của Backend do thiếu cấu hình biến môi trường.
  * *Giải pháp:* Truy cập **Vercel Settings** -> **Environment Variables**, tạo biến `VITE_API_URL` với giá trị là đường link backend Render của bạn. Lưu ý **không được chứa dấu gạch chéo `/` ở cuối** (Ví dụ: dùng `https://api.com` thay vì `https://api.com/`). Sau đó, vào tab **Deployments** bấm vào dấu 3 chấm của bản deploy mới nhất -> chọn **Redeploy** để áp dụng biến môi trường mới.

---

### ❌ Lỗi 3: Render báo lỗi Build Failed hoặc Deploy Failed
* **Triệu chứng:** Bản build của backend trên Render bị đỏ (Failed).
* **Nguyên nhân 1 (Sai Start Command):** Render cố gắng chạy tệp `.env` nhưng môi trường production không có file vật lý này.
  * *Giải pháp:* Kiểm tra tệp `package.json` của backend. Đảm bảo script `"start"` là `"node src/server.js"` (không dùng `--env-file .env` vì trên Render các biến môi trường được truyền trực tiếp qua hệ thống).
* **Nguyên nhân 2 (Lỗi kết nối PostgreSQL):** Script migrate chạy bị lỗi do cấu hình DB sai.
  * *Giải pháp:* Kiểm tra lại tất cả các biến môi trường của Database trên Render xem có khớp 100% với thông tin bên database hay chưa. Đảm bảo biến `NODE_ENV` đã được set là `production` để driver `pg` sử dụng kết nối SSL an toàn.

---

### ❌ Lỗi 4: Git báo lỗi "Updates were rejected... non-fast-forward" khi push code
* **Triệu chứng:** Khi bạn gõ lệnh `git push`, Git từ chối nhận code mới và báo lỗi xung đột hoặc phân nhánh.
* **Nguyên nhân:** Nhánh trên máy local của bạn và nhánh trên GitHub đang bị lệch lịch sử commit (ví dụ: ai đó đã cập nhật trực tiếp trên GitHub trước).
* **Cách khắc phục:**
  1. Đồng bộ lại lịch sử code local của bạn với GitHub bằng cách chạy:
     ```bash
     git fetch origin develop
     git reset --hard origin/develop
     ```
     *(Cảnh báo: Lệnh này sẽ ghi đè toàn bộ code local của bạn theo bản mới nhất trên GitHub, hãy chắc chắn bạn đã sao lưu các file tự chỉnh sửa trước đó).*
  2. Sau khi đồng bộ, bạn có thể thực hiện chỉnh sửa và push một cách an toàn.

---

## 4. Hướng Dẫn Chạy Dưới Local (Local Development)

### 🐳 Cách 1: Sử Dụng Docker (Khuyên dùng)
1. Tạo file `.env` ở thư mục gốc: `cp .env.example .env`
2. Khởi chạy hệ thống: `docker-compose up -d --build`
3. Tạo cơ sở dữ liệu: `docker exec -it habit-tracker-backend npm run migrate`
4. Mở trình duyệt: `http://localhost:5173`

### 💻 Cách 2: Chạy Thủ Công (Không dùng Docker)
* **Backend:**
  ```bash
  cd backend
  npm install
  cp .env.example .env  # Điền thông tin PostgreSQL local của bạn vào đây
  npm run migrate       # Tạo bảng
  npm run dev           # Chạy server (tự động reload)
  ```
* **Frontend:**
  ```bash
  cd frontend
  npm install
  echo "VITE_API_URL=http://localhost:5000" > .env
  npm run dev
  ```
  Truy cập giao diện tại: `http://localhost:5173`
