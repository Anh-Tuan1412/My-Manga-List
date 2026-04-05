function HeaderBar({ user, theme, onToggleTheme, onLogout }) {
  return (
    <header className="hero">
      <div>
        <p className="eyebrow">My Manga List</p>
        <h1>Manga and Book Tracking App</h1>
        <p className="hero-sub">
          Theo doi tien do doc, danh gia bo suu tap, loc theo the loai va dong bo nhanh du lieu
          tu Jikan API.
        </p>
        <p className="welcome-line">Xin chao, {user?.name || user?.email}</p>
      </div>
      <div className="header-actions">
        <button className="theme-toggle" onClick={onToggleTheme} type="button">
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <button className="ghost-btn" onClick={onLogout} type="button">
          Dang xuat
        </button>
      </div>
    </header>
  )
}

export default HeaderBar
