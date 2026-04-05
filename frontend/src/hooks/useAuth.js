import { useEffect, useState } from 'react'
import { apiClient, setAuthToken } from '../api/client'

const AUTH_STORAGE_KEY = 'manga-auth-v1'

const parseStoredAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) {
      return { token: '', user: null }
    }

    const parsed = JSON.parse(raw)
    return {
      token: parsed.token || '',
      user: parsed.user || null,
    }
  } catch {
    return { token: '', user: null }
  }
}

export const useAuth = () => {
  const initial = parseStoredAuth()

  const [token, setToken] = useState(initial.token)
  const [user, setUser] = useState(initial.user)
  const [loading, setLoading] = useState(Boolean(initial.token))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setAuthToken(token)

    if (token) {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token,
          user,
        })
      )
      return
    }

    localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [token, user])

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await apiClient.get('/auth/me')
        setUser(response.data?.user || null)
      } catch {
        setToken('')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [token])

  const handleSuccessAuth = (responseData) => {
    setToken(responseData?.token || '')
    setUser(responseData?.user || null)
    setError('')
  }

  const login = async ({ email, password }) => {
    setSubmitting(true)
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      handleSuccessAuth(response.data)
      return true
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Dang nhap that bai.')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const register = async ({ name, email, password }) => {
    setSubmitting(true)
    try {
      const response = await apiClient.post('/auth/register', {
        name,
        email,
        password,
      })
      handleSuccessAuth(response.data)
      return true
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Dang ky that bai.')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const logout = () => {
    setToken('')
    setUser(null)
    setError('')
  }

  return {
    token,
    user,
    loading,
    submitting,
    error,
    login,
    register,
    logout,
    clearError: () => setError(''),
  }
}
