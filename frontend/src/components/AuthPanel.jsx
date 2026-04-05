import { useState } from 'react'

function AuthPanel({ loading, error, onLogin, onRegister }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (mode === 'register') {
      await onRegister(form)
      return
    }

    await onLogin({
      email: form.email,
      password: form.password,
    })
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">My Manga List</p>
        <h1>{mode === 'login' ? 'Đăng nhập để theo dõi manga' : 'Tạo tài khoản mới'}</h1>
        <p className="auth-sub">Dữ liệu của bạn được tách riêng theo từng tài khoản bằng JWT.</p>

        {error && <p className="error-banner">{error}</p>}

        <div className="auth-switch">
          <button
            type="button"
            className={mode === 'login' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setMode('login')}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setMode('register')}
          >
            Đăng ký
          </button>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Tên hiển thị
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                minLength={2}
                required
                placeholder="Nguyễn Văn A"
              />
            </label>
          )}

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </label>

          <label>
            Mật khẩu
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
              placeholder="Ít nhất 6 ký tự"
            />
          </label>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AuthPanel
