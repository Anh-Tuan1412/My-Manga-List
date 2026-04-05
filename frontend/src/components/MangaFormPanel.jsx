import { STATUS_OPTIONS } from '../constants/manga'

function MangaFormPanel({ form, editingId, saving, onChange, onSubmit, onReset }) {
  return (
    <article className="panel">
      <h2>{editingId ? 'Cập nhật manga' : 'Thêm manga mới'}</h2>
      <form onSubmit={onSubmit} className="stack-form">
        <label>
          Tên manga
          <input name="title" value={form.title} onChange={onChange} placeholder="One Piece" required />
        </label>

        <label>
          Tác giả (ngăn cách dấu phẩy)
          <input
            name="authors"
            value={form.authors}
            onChange={onChange}
            placeholder="Eiichiro Oda"
          />
        </label>

        <label>
          Thể loại (ngăn cách dấu phẩy)
          <input
            name="genres"
            value={form.genres}
            onChange={onChange}
            placeholder="Shonen, Adventure"
          />
        </label>

        <label>
          Link ảnh bìa
          <input name="coverImage" value={form.coverImage} onChange={onChange} placeholder="https://..." />
        </label>

        <label>
          Tóm tắt
          <textarea
            name="synopsis"
            value={form.synopsis}
            onChange={onChange}
            rows={4}
            placeholder="Nội dung chính của manga"
          />
        </label>

        <div className="number-grid">
          <label>
            Tổng tập
            <input type="number" min="0" name="totalChapters" value={form.totalChapters} onChange={onChange} />
          </label>

          <label>
            Đã sở hữu
            <input type="number" min="0" name="ownedChapters" value={form.ownedChapters} onChange={onChange} />
          </label>

          <label>
            Đánh giá (0-10)
            <input type="number" min="0" max="10" step="0.5" name="rating" value={form.rating} onChange={onChange} />
          </label>

          <label>
            Trạng thái
            <select name="status" value={form.status} onChange={onChange}>
              {STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Giá dự kiến (VND)
          <input
            type="number"
            min="0"
            step="1000"
            name="priceEstimate"
            value={form.priceEstimate}
            onChange={onChange}
          />
        </label>

        <div className="button-row">
          <button className="primary-btn" type="submit" disabled={saving}>
            {saving ? 'Đang lưu...' : editingId ? 'Lưu thay đổi' : 'Thêm manga'}
          </button>
          {editingId && (
            <button className="ghost-btn" type="button" onClick={onReset}>
              Hủy sửa
            </button>
          )}
        </div>
      </form>
    </article>
  )
}

export default MangaFormPanel
