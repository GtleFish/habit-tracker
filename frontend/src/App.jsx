import { useState, useEffect } from 'react'
import './App.css'
import { api } from './api'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { HabitsList } from './pages/HabitsList'
import { AddHabit } from './pages/AddHabit'
import { History } from './pages/History'

function App() {
  const [currentPage, setCurrentPage] = useState('habits')
  const [habits, setHabits] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    checkHealth()
    loadData()
  }, [])

  const checkHealth = async () => {
    try {
      await api.checkHealth()
      setApiStatus('ok')
    } catch {
      setApiStatus('error')
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [habitsData, logsData] = await Promise.all([
        api.getHabits(),
        api.getLogs(),
      ])
      setHabits(habitsData || [])
      setLogs(logsData || [])
    } catch (err) {
      setError('Không thể kết nối backend. Kiểm tra server đang chạy chưa.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddHabit = async (name, description) => {
    try {
      setSubmitLoading(true)
      setError(null)
      await api.createHabit(name, description)
      await loadData()
      setCurrentPage('habits')
    } catch (err) {
      setError('Không thể tạo habit. Thử lại sau.')
      console.error(err)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteHabit = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa habit này không?')) return
    try {
      setError(null)
      await api.deleteHabit(id)
      await loadData()
    } catch (err) {
      setError('Không thể xóa habit. Thử lại sau.')
      console.error(err)
    }
  }

  const handleMarkComplete = async (habitId, date) => {
    try {
      setError(null)
      await api.createLog(habitId, date)
      await loadData()
    } catch (err) {
      setError('Không thể cập nhật. Thử lại sau.')
      console.error(err)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="app-main">
        <Header apiStatus={apiStatus} />
        <div className="app-content">
          {currentPage === 'habits' && (
            <HabitsList
              habits={habits}
              logs={logs}
              onDelete={handleDeleteHabit}
              onMarkComplete={handleMarkComplete}
              isLoading={loading}
              error={error}
            />
          )}
          {currentPage === 'add' && (
            <AddHabit
              onSubmit={handleAddHabit}
              isLoading={submitLoading}
              error={error}
            />
          )}
          {currentPage === 'history' && (
            <History
              habits={habits}
              logs={logs}
              isLoading={loading}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
