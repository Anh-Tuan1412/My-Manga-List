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
      <h2>Lọc và sắp xếp</h2>
      <div className="filter-grid">
        <label>
          Tìm theo tên
          <input value={filters.search} onChange={handleChange('search')} placeholder="Bleach" />
        </label>
        <label>
          Trạng thái
          <select value={filters.status} onChange={handleChange('status')}>
            <option value="all">Tất cả</option>
            {STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Thể loại
          <select value={filters.genre} onChange={handleChange('genre')}>
            <option value="all">Tất cả</option>
            {genreOptions.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sắp xếp
          <select value={filters.sortBy} onChange={handleChange('sortBy')}>
            {SORT_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Thứ tự
          <select value={filters.order} onChange={handleChange('order')}>
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </label>
      </div>
    </article>
  )
}

export default FilterSortPanel
