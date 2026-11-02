import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { NotificationProvider } from './context/NotificationContext'
import NotificationToast from './components/NotificationToast'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DoctorDashboard from './pages/DoctorDashboard'
import NurseDashboard from './pages/NurseDashboard'
import PatientDashboard from './pages/PatientDashboard'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const { user, accessToken } = useSelector((state) => state.auth)

  return (
    <NotificationProvider>
      <BrowserRouter>
        <NotificationToast />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {user && accessToken ? (
            <>
              <Route
                path="/doctor/*"
                element={user.role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/" />}
              />
              <Route
                path="/nurse/*"
                element={user.role === 'nurse' ? <NurseDashboard /> : <Navigate to="/" />}
              />
              <Route
                path="/patient/*"
                element={user.role === 'patient' ? <PatientDashboard /> : <Navigate to="/" />}
              />
              <Route
                path="/admin/*"
                element={user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
              />
            </>
          ) : null}

          <Route path="/" element={<Navigate to={user ? `/dashboard` : '/login'} />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  )
}

export default App