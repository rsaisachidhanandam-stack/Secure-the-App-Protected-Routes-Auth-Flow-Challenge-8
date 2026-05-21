# Auth Bugs Analysis: Baseline Observations & Root Causes

This document details the security vulnerabilities and structural flaws identified in **VaultApp**'s authentication flow before implementing any changes.

---

## 🔍 Observed Behaviours

The following behaviours were observed in an incognito window without logging in, as well as during standard authentication flows:

1. **Unprotected Direct Access (`/dashboard`)**:
   * *Observation*: Navigating directly to `http://localhost:5173/dashboard` bypasses the authentication entirely, rendering the full Dashboard component (recent transactions, total balance, account sync options) without any redirection or login prompt.
2. **Unprotected Direct Access (`/settings`)**:
   * *Observation*: Navigating directly to `http://localhost:5173/settings` renders the Settings panel (Security Preferences, Notifications, Danger Zone) without credentials.
3. **Unprotected Direct Access (`/profile`)**:
   * *Observation*: Navigating directly to `http://localhost:5173/profile` displays the user profile details (Name, Location, Active Sessions) with zero authentication checks.
4. **Token Persistence Failure (State Loss on Refresh)**:
   * *Observation*: Logging in with correct credentials (`demo@vault.app` / `password123`) updates the view and redirects to `/dashboard`. However, pressing refresh (`F5` or `Ctrl + R`) immediately clears the state, kicking the user out and forcing them to re-authenticate.
   * *DevTools Check*: Under Chrome DevTools → Application → Local Storage for `http://localhost:5173`, no values are stored for either a token (`authToken`) or user information (`authUser`).
5. **Auth-Blind Navbar**:
   * *Observation*: After logging in, the Navbar is completely unchanged. It continues to show the hardcoded "Login" link on the top right. It never shows the user's name ("Hi, Demo User") or any option to "Logout".

---

## 🛠️ Root Cause Analysis

### 🐛 Bug 1: Context Provider Not Wired Up
* **File Location**: [src/main.jsx](file:///d:/New%20folder/src/main.jsx#L6-L19)
* **Root Cause**: The `AuthProvider` component, defined to house global authentication state, is imported but commented out. Furthermore, in the React DOM tree rendering block, `<App />` is wrapped *only* in `<BrowserRouter>` and `<React.StrictMode>`. Because `AuthProvider` is missing, the custom `useAuth()` hook in children components defaults to returning `null` or crashing the application if accessed directly without safety checks.

### 🐛 Bug 2: Session and Token Do Not Persist
* **File Location**: [src/context/AuthContext.jsx](file:///d:/New%20folder/src/context/AuthContext.jsx#L13-L33)
* **Root Cause**:
  1. The `login()` method inside `AuthProvider` sets `user` and `token` in the local React state but completely fails to synchronize this session data to `localStorage`.
  2. The `logout()` method updates state to `null` but does not clear `localStorage` items.
  3. The `AuthProvider` is missing a `useEffect` hook to read the token and user data from `localStorage` upon mounting. Because state is volatile and resets to `null` when React is reloaded, the session is lost on every refresh.

### 🐛 Bug 3: Lack of Route Protection
* **File Location**: [src/App.jsx](file:///d:/New%20folder/src/App.jsx#L22-L25)
* **Root Cause**: The router configuration inside `App.jsx` registers all routes (`/dashboard`, `/settings`, `/profile`) directly. There is no `ProtectedRoute` component wrapping these paths. Consequently, React Router renders these components regardless of whether a token exists, making the pages fully public via direct URL entry.

### 🐛 Bug 4: Non-Responsive Navbar
* **File Location**: [src/components/Navbar.jsx](file:///d:/New%20folder/src/components/Navbar.jsx#L9-L34)
* **Root Cause**: The Navbar component does not fetch the global authentication state. The `useAuth()` call is commented out, and the component does not access `isAuthenticated` or `user`. The "Login" button is hardcoded in the JSX. There is no conditional logic to check if a user is logged in, and therefore it cannot render user details or a "Logout" option.
