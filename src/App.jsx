import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

/**
 * App Router Configuration.
 */
function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<div className="p-10 text-center">404 Not Found</div>} />
        </Routes>
      </main>
      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200">
        &copy; {new Date().getFullYear()} VaultApp Security. Built for training purposes.
      </footer>
    </div>
  )
}

export default App
