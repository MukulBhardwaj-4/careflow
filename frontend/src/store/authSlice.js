import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
})

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Signup Doctor
export const signupDoctor = createAsyncThunk(
  'auth/signupDoctor',
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post('/auth/signup/doctor', data)
      localStorage.setItem('accessToken', res.data.data.accessToken)
      localStorage.setItem('user', JSON.stringify(res.data.data.user))
      localStorage.setItem('role', 'doctor')
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed')
    }
  }
)

// Signup Nurse
export const signupNurse = createAsyncThunk(
  'auth/signupNurse',
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post('/auth/signup/nurse', data)
      localStorage.setItem('accessToken', res.data.data.accessToken)
      localStorage.setItem('user', JSON.stringify(res.data.data.user))
      localStorage.setItem('role', 'nurse')
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed')
    }
  }
)

// Login
export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post('/auth/login', data)
      localStorage.setItem('accessToken', res.data.data.accessToken)
      localStorage.setItem('user', JSON.stringify(res.data.data.user))
      localStorage.setItem('role', data.role)
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

// Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await API.post('/auth/logout')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      return null
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed')
    }
  }
)

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  role: localStorage.getItem('role') || null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Signup Doctor
    builder.addCase(signupDoctor.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(signupDoctor.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.role = 'doctor'
    })
    builder.addCase(signupDoctor.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Signup Nurse
    builder.addCase(signupNurse.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(signupNurse.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.role = 'nurse'
    })
    builder.addCase(signupNurse.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
      state.accessToken = null
      state.role = null
    })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer