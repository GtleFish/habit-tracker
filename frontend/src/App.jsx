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
      const habitList = habitsData || []
      const habitNamesById = new Map(habitList.map((habit) => [habit.id, habit.name]))
      const enrichedLogs = (logsData || []).map((log) => ({
        ...log,
        habit_name: log.habit_name || habitNamesById.get(log.habit_id) || '',
      }))
      setHabits(habitList)
      setLogs(enrichedLogs)
    } catch (err) {
      setError('Không thể kết nối backend. Kiểm tra server đang chạy chưa.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkHealth()
    loadData()
  }, [])

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
    try {
      setError(null)
      await api.deleteHabit(id)
      await loadData()
    } catch (err) {
      setError('Không thể xóa habit. Thử lại sau.')
      console.error(err)
    }
  }

  const handleMarkComplete = async (habitId, date, startTime = '', endTime = '') => {
    try {
      setError(null)
      await api.createLog(habitId, date, '', startTime, endTime)
      await loadData()
    } catch (err) {
      setError('Không thể cập nhật. Thử lại sau.')
      console.error(err)
    }
  }

  const handleDeleteLog = async (habitId, date) => {
    try {
      setError(null)
      await api.deleteLog(habitId, date)
      await loadData()
    } catch (err) {
      setError('Không thể xóa. Thử lại sau.')
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
              onDeleteLog={handleDeleteLog}
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
