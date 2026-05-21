import { Link, useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

/**
 * Navbar component.
 */
function Navbar() {
  const { user, isAuthenticated, logout } = useAuth() || {}
  const navigate = useNavigate()

  const handleLogout = () => {
    if (logout) {
      logout()
    }
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-brand-600 font-bold text-xl">
          <Shield className="w-6 h-6" />
          <span>VaultApp</span>
        </Link>
        
        <div className="flex items-center space-x-6 text-sm font-medium">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-slate-600 hover:text-brand-600 transition-colors">Dashboard</Link>
              <Link to="/settings" className="text-slate-600 hover:text-brand-600 transition-colors">Settings</Link>
              
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              
              <span className="text-slate-600">Hi, {user?.name || 'User'}</span>
              
              <button 
                onClick={handleLogout}
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-all font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="bg-brand-50 text-brand-600 px-4 py-2 rounded-lg hover:bg-brand-100 transition-all font-semibold"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
