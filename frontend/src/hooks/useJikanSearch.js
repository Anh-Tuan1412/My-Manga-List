import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'

export const useJikanSearch = ({ token }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setQuery('')
      setResults([])
      setError('')
      return
    }

    if (query.trim().length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        setError('')

        const response = await apiClient.get('/manga/jikan/search', {
          params: { query },
        })

        setResults(Array.isArray(response.data) ? response.data : [])
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Không tìm thấy dữ liệu Jikan.')
      } finally {
        setLoading(false)
      }
    }, 450)

    return () => clearTimeout(timer)
  }, [query, token])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearError: () => setError(''),
  }
}
