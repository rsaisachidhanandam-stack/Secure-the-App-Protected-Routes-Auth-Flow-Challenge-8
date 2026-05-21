import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

/**
 * AuthProvider provides the authentication state to the application.
 * Note: Submitting multiple bugs here for the student to find.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  // Layer 2 — Read token from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('authUser')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, []) // runs once on mount — restores auth state after refresh

  // BUG 2: Login handles state but fails to persist the session to localStorage
  const login = (userData, fakeToken) => {
    setUser(userData)
    setToken(fakeToken)
    localStorage.setItem('authToken', fakeToken)
    localStorage.setItem('authUser', JSON.stringify(userData))
    
    console.log('✅ User logged in:', userData.email)
  }

  // BUG 3 (Part 2): Logout clears state but may leave data in storage or has issues
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    console.log('🚪 User logged out')
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token, // Derived state for Bug 3
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
