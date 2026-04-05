import { formatCurrency, getProgressPercent } from '../utils/formatters'

function MangaListPanel({
  items,
  loading,
  loadingMore,
  hasMore,
  onEdit,
  onDelete,
  infiniteRef,
}) {
  return (
    <article className="panel">
      <h2>Danh sách manga</h2>
      {loading ? <p className="mini-note">Đang tải dữ liệu...</p> : null}

      {!loading && items.length === 0 ? (
        <p className="mini-note">Chưa có manga nào phù hợp bộ lọc.</p>
      ) : (
        <>
          <div className="manga-list">
            {items.map((item) => {
              const progress = getProgressPercent(item)

              return (
                <article className="manga-card" key={item._id}>
                  <img
                    src={item.coverImage || 'https://placehold.co/160x220?text=No+Cover'}
                    alt={item.title}
                    className="cover"
                    loading="lazy"
                  />

                  <div className="manga-content">
                    <div className="manga-top">
                      <h3>{item.title}</h3>
                      <span className={`status-tag status-${item.status}`}>{item.status}</span>
                    </div>

                    <p className="meta">Tác giả: {(item.authors || []).join(', ') || 'N/A'}</p>
                    <p className="meta">Đánh giá: {item.rating}/10</p>

                    <div className="progress-row">
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <span>
                        {item.ownedChapters}/{item.totalChapters || '?'} tập
                      </span>
                    </div>

                    {(item.genres || []).length > 0 && (
                      <div className="tag-list">
                        {item.genres.map((genre) => (
                          <span key={`${item._id}-${genre}`} className="tag">
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.status === 'wishlist' && (
                      <p className="wishlist-price">Giá dự kiến: {formatCurrency(item.priceEstimate)}</p>
                    )}

                    <p className="synopsis">{item.synopsis || 'Chưa có mô tả.'}</p>

                    <div className="button-row">
                      <button className="ghost-btn" type="button" onClick={() => onEdit(item)}>
                        Sửa
                      </button>
                      <button className="danger-btn" type="button" onClick={() => onDelete(item._id)}>
                        Xóa
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div ref={infiniteRef} className="infinite-sentinel" />
          {loadingMore && <p className="mini-note">Đang tải thêm...</p>}
          {!hasMore && items.length > 0 && <p className="mini-note">Đã hiển thị tất cả manga.</p>}
        </>
      )}
    </article>
  )
}

export default MangaListPanel
