import { SORT_OPTIONS, STATUS_OPTIONS } from '../constants/manga'

function FilterSortPanel({ filters, genreOptions, onFiltersChange }) {
  const handleChange = (key) => (event) => {
    onFiltersChange((prev) => ({
      ...prev,
      [key]: event.target.value,
    }))
  }

  return (
    <article className="panel">
      <h2>Filter and Sort</h2>
      <div className="filter-grid">
        <label>
          Tim theo ten
          <input value={filters.search} onChange={handleChange('search')} placeholder="Bleach" />
        </label>
        <label>
          Trang thai
          <select value={filters.status} onChange={handleChange('status')}>
            <option value="all">Tat ca</option>
            {STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          The loai
          <select value={filters.genre} onChange={handleChange('genre')}>
            <option value="all">Tat ca</option>
            {genreOptions.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sap xep
          <select value={filters.sortBy} onChange={handleChange('sortBy')}>
            {SORT_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Thu tu
          <select value={filters.order} onChange={handleChange('order')}>
            <option value="desc">Giam dan</option>
            <option value="asc">Tang dan</option>
          </select>
        </label>
      </div>
    </article>
  )
}

export default FilterSortPanel
