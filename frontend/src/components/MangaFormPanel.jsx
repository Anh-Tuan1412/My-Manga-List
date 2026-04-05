import { STATUS_OPTIONS } from '../constants/manga'

function MangaFormPanel({ form, editingId, saving, onChange, onSubmit, onReset }) {
  return (
    <article className="panel">
      <h2>{editingId ? 'Cap nhat manga' : 'Them manga moi'}</h2>
      <form onSubmit={onSubmit} className="stack-form">
        <label>
          Ten manga
          <input name="title" value={form.title} onChange={onChange} placeholder="One Piece" required />
        </label>

        <label>
          Tac gia (ngan cach dau phay)
          <input
            name="authors"
            value={form.authors}
            onChange={onChange}
            placeholder="Eiichiro Oda"
          />
        </label>

        <label>
          The loai (ngan cach dau phay)
          <input
            name="genres"
            value={form.genres}
            onChange={onChange}
            placeholder="Shonen, Adventure"
          />
        </label>

        <label>
          Link anh bia
          <input name="coverImage" value={form.coverImage} onChange={onChange} placeholder="https://..." />
        </label>

        <label>
          Tom tat
          <textarea
            name="synopsis"
            value={form.synopsis}
            onChange={onChange}
            rows={4}
            placeholder="Noi dung chinh cua manga"
          />
        </label>

        <div className="number-grid">
          <label>
            Tong tap
            <input type="number" min="0" name="totalChapters" value={form.totalChapters} onChange={onChange} />
          </label>

          <label>
            Da so huu
            <input type="number" min="0" name="ownedChapters" value={form.ownedChapters} onChange={onChange} />
          </label>

          <label>
            Danh gia (0-10)
            <input type="number" min="0" max="10" step="0.5" name="rating" value={form.rating} onChange={onChange} />
          </label>

          <label>
            Trang thai
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
          Gia du kien (VND)
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
            {saving ? 'Dang luu...' : editingId ? 'Luu thay doi' : 'Them manga'}
          </button>
          {editingId && (
            <button className="ghost-btn" type="button" onClick={onReset}>
              Huy sua
            </button>
          )}
        </div>
      </form>
    </article>
  )
}

export default MangaFormPanel
