# Habit Tracker - Setup Guide (MySQL)

## Prerequisites

You need to have **MySQL** installed and running on your system.

### Install MySQL

#### Windows
1. Download from: https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the setup wizard
3. Remember the password for the `root` user
4. Make sure MySQL service is running

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

### 2. Update Backend Environment
Edit `backend/.env` with your MySQL credentials:

```env
PORT=3000
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
cd backend
npm run dev
```

Should show: `Server running on port 3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Should show: `➜ Local: http://localhost:5174/`

### 6. Open in Browser
Go to: **http://localhost:5174**

## Usage

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

### "Failed to load data" error
- Make sure backend is running on port 3000
- Check `.env` file has correct MySQL credentials
- Verify MySQL service is running: `mysql -u root -p -e "SELECT 1;"`

### Database connection error
- Check if MySQL is running
- Verify database `habits` exists: `mysql -u root -p -e "SHOW DATABASES;"`
- Verify `.env` credentials match your MySQL setup
- Run `npm run init-db` again to create tables

### Error: "Access denied for user 'root'@'localhost'"
- Your MySQL password is incorrect
- Update `DB_PASSWORD` in `.env`
- Or reset MySQL password (search for "reset mysql password")

### Port already in use
- Frontend: `npm run dev -- --port 5175`
- Backend: `PORT=3001 npm run dev`
- MySQL: Change `DB_PORT` in `.env` and update connection

## Project Structure

```
habit-tracker/
├── frontend/              React UI
│   ├── src/
│   │   ├── components/   (Header, Sidebar, HabitCard)
│   │   ├── pages/        (HabitsList, AddHabit)
│   │   ├── api.js        (API calls)
│   │   ├── App.jsx       (Main app)
│   │   └── App.css       (Styles)
│   └── .env              (API URL config)
│
└── backend/              Node.js + Express API
    ├── src/
    │   ├── controllers/  (Business logic)
    │   ├── routes/       (API endpoints)
    │   ├── middleware/   (Error handling)
    │   └── db/           (MySQL connection)
    ├── scripts/
    │   └── init-db.js    (Create tables)
    └── .env              (MySQL config)
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/habits` - List all habits
- `POST /api/habits` - Create habit
- `DELETE /api/habits/:id` - Delete habit
- `GET /api/logs` - List all logs
- `POST /api/logs` - Create log entry

## Database Schema

### habits table
- `id` - AUTO_INCREMENT PRIMARY KEY
- `name` - VARCHAR(255) NOT NULL
- `description` - TEXT
- `created_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE

### logs table
- `id` - AUTO_INCREMENT PRIMARY KEY
- `habit_id` - INT NOT NULL (FOREIGN KEY to habits.id)
- `date` - DATE NOT NULL
- `created_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- UNIQUE constraint on (habit_id, date)

## Quick MySQL Commands

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

