function HeaderBar({ user, theme, onToggleTheme, onLogout }) {
  return (
    <header className="hero">
      <div>
        <p className="eyebrow">My Manga List</p>
        <h1>Manga and Book Tracking App</h1>
        <p className="hero-sub">
          Theo dõi tiến độ đọc, đánh giá bộ sưu tập, lọc theo thể loại và đồng bộ nhanh dữ liệu
          từ Jikan API.
        </p>
        <p className="welcome-line">Xin chào, {user?.name || user?.email}</p>
      </div>
      <div className="header-actions">
        <button className="theme-toggle" onClick={onToggleTheme} type="button">
          {theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
        </button>
        <button className="ghost-btn" onClick={onLogout} type="button">
          Đăng xuất
        </button>
      </div>
    </header>
  )
}

export default HeaderBar
