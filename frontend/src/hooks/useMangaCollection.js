import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiClient } from '../api/client'

const DEFAULT_STATS = {
  genreDistribution: [],
  statusDistribution: [],
  wishlistTotalCost: 0,
}

export const useMangaCollection = ({ token, filters, pageSize = 8 }) => {
  const [items, setItems] = useState([])
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const filterKey = useMemo(() => JSON.stringify(filters), [filters])

  const fetchStats = useCallback(async () => {
    const response = await apiClient.get('/manga/stats')
    setStats(response.data || DEFAULT_STATS)
  }, [])

  const fetchPage = useCallback(async ({ pageToLoad, append }) => {
    const response = await apiClient.get('/manga', {
      params: {
        ...filters,
        page: pageToLoad,
        limit: pageSize,
      },
    })

    const payload = response.data || {}
    const newItems = Array.isArray(payload.items) ? payload.items : []

    setItems((prev) => (append ? [...prev, ...newItems] : newItems))
    setPage(payload.page || pageToLoad)
    setHasMore(Boolean(payload.hasMore))
  }, [filters, pageSize])

  const refresh = useCallback(async () => {
    if (!token) {
      return
    }

    setLoading(true)
    setError('')

    try {
      await Promise.all([
        fetchPage({ pageToLoad: 1, append: false }),
        fetchStats(),
      ])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Khong the tai du lieu manga.')
    } finally {
      setLoading(false)
    }
  }, [token, fetchPage, fetchStats])

  const loadMore = useCallback(async () => {
    if (!token || !hasMore || loading || loadingMore) {
      return
    }

    setLoadingMore(true)
    setError('')

    try {
      await fetchPage({
        pageToLoad: page + 1,
        append: true,
      })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Khong the tai them manga.')
    } finally {
      setLoadingMore(false)
    }
  }, [token, hasMore, loading, loadingMore, page, fetchPage])

  const saveManga = useCallback(async ({ payload, editingId }) => {
    setSaving(true)
    setError('')

    try {
      if (editingId) {
        await apiClient.put(`/manga/${editingId}`, payload)
      } else {
        await apiClient.post('/manga', payload)
      }

      await refresh()
      return true
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Khong the luu manga.')
      return false
    } finally {
      setSaving(false)
    }
  }, [refresh])

  const removeManga = useCallback(async (id) => {
    try {
      await apiClient.delete(`/manga/${id}`)
      await refresh()
      return true
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Khong the xoa manga.')
      return false
    }
  }, [refresh])

  useEffect(() => {
    if (!token) {
      setItems([])
      setStats(DEFAULT_STATS)
      setPage(1)
      setHasMore(false)
      setError('')
      setLoading(false)
      setLoadingMore(false)
      setSaving(false)
      return
    }

    refresh()
  }, [token, filterKey, refresh])

  return {
    items,
    stats,
    hasMore,
    loading,
    loadingMore,
    saving,
    error,
    refresh,
    loadMore,
    saveManga,
    removeManga,
    clearError: () => setError(''),
  }
}
