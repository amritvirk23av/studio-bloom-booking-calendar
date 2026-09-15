import { Route, Routes } from 'react-router-dom'
import { AppDataProvider } from './context/AppDataContext'
import { AdminPage } from './pages/AdminPage'
import { BookingCalendarPage } from './pages/BookingCalendarPage'

function App() {
  return (
    <AppDataProvider>
      <Routes>
        <Route path="/" element={<BookingCalendarPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </AppDataProvider>
  )
}

export default App
