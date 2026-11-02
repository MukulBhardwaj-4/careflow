import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, CheckCircle, Clock } from 'lucide-react'

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">CareFlow AI</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Manage registrations, patients, and system operations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-900">Pending Registrations</h3>
              </div>
              <p className="text-3xl font-bold text-yellow-600">0</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Total Patients</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Users</h3>
              <p className="text-sm text-blue-700">Doctors • Nurses • Patients</p>
            </div>
          </div>

          <div className="mt-8 text-gray-600">
            <p>Coming soon: Registration management, patient analytics, and system configuration.</p>
          </div>
        </div>
      </div>
    </div>
  )
}