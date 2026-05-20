import { useState, useEffect } from 'react'
import './App.css'
import { api } from './api'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { HabitsList } from './pages/HabitsList'
import { AddHabit } from './pages/AddHabit'

function App() {
  const [currentPage, setCurrentPage] = useState('habits')
  const [habits, setHabits] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

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
      setError('Failed to load data. Make sure backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddHabit = async (title, description) => {
    try {
      setSubmitLoading(true)
      setError(null)
      await api.createHabit(title, description)
      await loadData()
      setCurrentPage('habits')
    } catch (err) {
      setError('Failed to create habit')
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
      setError('Failed to delete habit')
      console.error(err)
    }
  }

  const handleMarkComplete = async (habitId, date, startTime, endTime, logId, isDelete) => {
    try {
      setError(null)
      if (isDelete) {
        await api.deleteLog(logId)
      } else if (logId) {
        await api.updateLog(logId, startTime, endTime)
      } else {
        await api.createLog(habitId, date, startTime, endTime)
      }
      await loadData()
    } catch (err) {
      setError('Failed to mark completion')
      console.error(err)
    }
  }

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="main-content">
        <Header />
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
      </div>
    </div>
  )
}

export default App
