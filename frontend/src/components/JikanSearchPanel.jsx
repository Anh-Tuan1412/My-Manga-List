function JikanSearchPanel({ query, loading, results, onQueryChange, onPick }) {
  return (
    <article className="panel">
      <h2>Tim nhanh tu Jikan API</h2>
      <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Nhap ten manga de tim" />
      {loading && <p className="mini-note">Dang tim kiem...</p>}
      <div className="jikan-list">
        {results.map((item) => (
          <div className="jikan-item" key={item.jikanId}>
            <img src={item.coverImage} alt={item.title} loading="lazy" />
            <div>
              <strong>{item.title}</strong>
              <p>{(item.synopsis || '').slice(0, 120)}...</p>
              <button className="ghost-btn" type="button" onClick={() => onPick(item)}>
                Chon vao form
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default JikanSearchPanel
