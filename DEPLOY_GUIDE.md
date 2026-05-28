# Huong Dan Trien Khai & Xu Ly Su Co

Tai lieu nay huong dan deploy du an Habit Tracker tu nhanh **`develop`** len **Render** cho ca **Backend API** va **Frontend UI**.

---

## 0. Cac Duong Link Deploy

| Muc | Duong link |
| :--- | :--- |
| Frontend public (Render) | [https://habit-tracker-frontend-nn40.onrender.com/](https://habit-tracker-frontend-nn40.onrender.com/) |
| Backend API public (Render) | [https://habit-tracker-r2tw.onrender.com](https://habit-tracker-r2tw.onrender.com) |
| Backend health check | [https://habit-tracker-r2tw.onrender.com/api/health](https://habit-tracker-r2tw.onrender.com/api/health) |
| Backend habits API | [https://habit-tracker-r2tw.onrender.com/api/habits](https://habit-tracker-r2tw.onrender.com/api/habits) |
| GitHub nhanh `develop` | [https://github.com/GtleFish/habit-tracker/tree/develop](https://github.com/GtleFish/habit-tracker/tree/develop) |
| Render Dashboard | [https://dashboard.render.com/](https://dashboard.render.com/) |

> Khi mo backend o duong dan goc `/` va thay `Cannot GET /`, day khong nhat thiet la loi. Hay kiem tra bang endpoint `/api/health`; neu tra ve `{ "ok": true }` thi backend dang chay.

---

## 1. Cau Hinh Deploy Tren Render

Tat ca moi truong deploy su dung truc tiep tu nhanh **`develop`**. Moi khi push code moi len `develop`, Render se tu dong build va deploy lai neu Auto-Deploy dang bat.

### 1.1. Backend API

Tao hoac cap nhat Web Service backend tren Render:

| Thiet lap | Gia tri |
| :--- | :--- |
| Service type | Web Service |
| Repository | `GtleFish/habit-tracker` |
| Branch | `develop` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm ci` |
| Start Command | `npm run migrate && npm start` |

Start command phai chay migration truoc khi start API:

```bash
npm run migrate && npm start
```

### 1.2. Frontend UI

Tao hoac cap nhat Web Service frontend tren Render:

| Thiet lap | Gia tri |
| :--- | :--- |
| Service type | Web Service |
| Repository | `GtleFish/habit-tracker` |
| Branch | `develop` |
| Root Directory | `frontend` |
| Runtime | Docker |
| Dockerfile Path | `./Dockerfile` |

Frontend hien dang duoc serve bang Nginx trong Docker image. Public URL hien tai:

```text
https://habit-tracker-frontend-nn40.onrender.com/
```

Neu cau hinh frontend theo Static Site thay vi Docker Web Service, dung:

| Thiet lap | Gia tri |
| :--- | :--- |
| Root Directory | `frontend` |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| Environment Variable | `VITE_API_URL=https://habit-tracker-r2tw.onrender.com` |

---

## 2. Bien Moi Truong

### Backend

Cau hinh trong **Render Dashboard -> Backend service -> Environment**:

| Ten bien | Gia tri / y nghia |
| :--- | :--- |
| `PORT` | Co the de trong de Render tu cap, hoac dat `5000`/`3000` theo service |
| `DB_HOST` | Host PostgreSQL tren Render |
| `DB_PORT` | `5432` |
| `DB_USER` | User database |
| `DB_PASSWORD` | Password database |
| `DB_NAME` | Ten database |
| `NODE_ENV` | `production` |

`NODE_ENV=production` giup ket noi PostgreSQL dung SSL trong moi truong Render.

### Frontend

Neu frontend deploy bang Docker hien tai, app goi API theo relative path `/api` va Nginx proxy request sang backend.

Neu deploy frontend bang Static Site, can them bien:

| Ten bien | Gia tri |
| :--- | :--- |
| `VITE_API_URL` | `https://habit-tracker-r2tw.onrender.com` |

Khong them dau `/` o cuoi URL.

---

## 3. Quy Trinh Deploy

### Deploy tu GitHub

1. Commit code len nhanh `develop`.
2. Push len GitHub:

   ```bash
   git push origin develop
   ```

3. Render tu dong build va deploy lai backend/frontend neu Auto-Deploy dang bat.
4. Kiem tra backend:

   ```bash
   curl https://habit-tracker-r2tw.onrender.com/api/health
   ```

5. Kiem tra frontend:

   ```bash
   curl -I https://habit-tracker-frontend-nn40.onrender.com/
   ```

### Deploy thu cong tren Render

Trong Render Dashboard:

1. Chon service backend hoac frontend.
2. Vao tab **Manual Deploy**.
3. Chon **Deploy latest commit**.

---

## 4. Xu Ly Su Co Thuong Gap

### Frontend khong goi duoc backend

Kiem tra:

- Backend health check co tra `{ "ok": true }` khong.
- Backend co bi sleep do Render free plan khong. Lan dau goi co the mat 30-60 giay.
- Neu frontend la Static Site, bien `VITE_API_URL` phai la `https://habit-tracker-r2tw.onrender.com`.
- Neu frontend la Docker Web Service, Nginx proxy trong `frontend/nginx.conf` phai tro dung backend reachable tu service frontend.

### Backend deploy failed

Kiem tra:

- `backend/package.json` va `backend/package-lock.json` phai dong bo de `npm ci` chay duoc.
- Start Command phai la `npm run migrate && npm start`.
- Cac bien DB tren Render phai dung voi database PostgreSQL.
- `NODE_ENV` nen dat la `production`.

### Frontend van hien ban cu

Thu:

- Hard refresh trinh duyet bang `Ctrl + F5`.
- Mo tab an danh.
- Kiem tra Render service frontend da deploy commit moi nhat chua.
- Trong Render Dashboard, chon **Manual Deploy -> Deploy latest commit**.

### Git bao loi non-fast-forward khi push

Dong bo lai nhanh local voi GitHub:

```bash
git pull --rebase origin develop
git push origin develop
```

Neu co conflict, sua conflict truoc khi push lai.

---

## 5. Chay Local

### Docker

```bash
cp .env.example .env
docker-compose up -d --build
docker exec -it habit-tracker-backend npm run migrate
```

Mo frontend local:

```text
http://localhost:5173
```

### Chay Thu Cong

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run dev
```

Frontend:

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
```

Mo frontend local:

```text
http://localhost:5173
```
