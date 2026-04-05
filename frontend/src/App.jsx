import { useEffect, useMemo, useState } from 'react'
import HeaderBar from './components/HeaderBar'
import MangaFormPanel from './components/MangaFormPanel'
import JikanSearchPanel from './components/JikanSearchPanel'
import FilterSortPanel from './components/FilterSortPanel'
import StatsPanel from './components/StatsPanel'
import MangaListPanel from './components/MangaListPanel'
import AuthPanel from './components/AuthPanel'
import { DEFAULT_FILTERS, EMPTY_FORM } from './constants/manga'
import { useAuth } from './hooks/useAuth'
import { useMangaCollection } from './hooks/useMangaCollection'
import { useJikanSearch } from './hooks/useJikanSearch'
import { useInfiniteObserver } from './hooks/useInfiniteObserver'
import './App.css'

function App() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('manga-theme')
    return stored || 'dark'
  })

  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState('')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const {
    token,
    user,
    loading: authLoading,
    submitting: authSubmitting,
    error: authError,
    login,
    register,
    logout,
    clearError: clearAuthError,
  } = useAuth()

  const {
    items,
    stats,
    hasMore,
    loading,
    loadingMore,
    saving,
    error: dataError,
    loadMore,
    saveManga,
    removeManga,
    clearError: clearDataError,
  } = useMangaCollection({
    token,
    filters,
    pageSize: 8,
  })

  const {
    query: jikanQuery,
    setQuery: setJikanQuery,
    results: jikanResults,
    loading: jikanLoading,
    error: jikanError,
    clearError: clearJikanError,
  } = useJikanSearch({ token })

  const genreOptions = useMemo(
    () => stats.genreDistribution.map((item) => item.name).filter(Boolean),
    [stats.genreDistribution]
  )

  const combinedError = authError || dataError || jikanError

  const infiniteRef = useInfiniteObserver({
    enabled: Boolean(token && hasMore && !loading && !loadingMore),
    onIntersect: loadMore,
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('manga-theme', theme)
  }, [theme])

  const clearAllErrors = () => {
    clearAuthError()
    clearDataError()
    clearJikanError()
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId('')
  }

  const handleLogout = () => {
    logout()
    setForm(EMPTY_FORM)
    setEditingId('')
    setFilters(DEFAULT_FILTERS)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    clearAllErrors()

    const payload = {
      ...form,
      totalChapters: Number(form.totalChapters || 0),
      ownedChapters: Number(form.ownedChapters || 0),
      rating: Number(form.rating || 0),
      priceEstimate: Number(form.priceEstimate || 0),
    }

    const saved = await saveManga({ payload, editingId })
    if (saved) {
      resetForm()
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Ban chac chan muon xoa manga nay?')
    if (!confirmed) {
      return
    }

    clearAllErrors()
    await removeManga(id)
  }

  const handleEdit = (item) => {
    setEditingId(item._id)
    setForm({
      title: item.title || '',
      authors: (item.authors || []).join(', '),
      genres: (item.genres || []).join(', '),
      synopsis: item.synopsis || '',
      coverImage: item.coverImage || '',
      totalChapters: item.totalChapters || 0,
      ownedChapters: item.ownedChapters || 0,
      rating: item.rating || 0,
      status: item.status || 'reading',
      priceEstimate: item.priceEstimate || 0,
      jikanId: item.jikanId || '',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pickFromJikan = (item) => {
    setForm((prev) => ({
      ...prev,
      title: item.title || '',
      synopsis: item.synopsis || '',
      coverImage: item.coverImage || '',
      authors: (item.authors || []).join(', '),
      genres: (item.genres || []).join(', '),
      totalChapters: item.totalChapters || 0,
      jikanId: item.jikanId || '',
    }))
  }

  if (authLoading) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <h1>Dang khoi tao...</h1>
        </section>
      </main>
    )
  }

  if (!user) {
    return <AuthPanel loading={authSubmitting} error={authError} onLogin={login} onRegister={register} />
  }

  return (
    <div className="app-shell">
      <HeaderBar
        user={user}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onLogout={handleLogout}
      />

      {combinedError && <p className="error-banner">{combinedError}</p>}

      <main className="layout-grid">
        <section className="left-panel">
          <MangaFormPanel
            form={form}
            editingId={editingId}
            saving={saving}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onReset={resetForm}
          />

          <JikanSearchPanel
            query={jikanQuery}
            loading={jikanLoading}
            results={jikanResults}
            onQueryChange={setJikanQuery}
            onPick={pickFromJikan}
          />

          <FilterSortPanel filters={filters} genreOptions={genreOptions} onFiltersChange={setFilters} />
        </section>

        <section className="right-panel">
          <StatsPanel stats={stats} displayCount={items.length} />

          <MangaListPanel
            items={items}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onEdit={handleEdit}
            onDelete={handleDelete}
            infiniteRef={infiniteRef}
          />
        </section>
      </main>
    </div>
  )
}

export default App
