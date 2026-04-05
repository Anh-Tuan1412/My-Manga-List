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
        <h1>{mode === 'login' ? 'Dang nhap de theo doi manga' : 'Tao tai khoan moi'}</h1>
        <p className="auth-sub">Du lieu cua ban duoc tach rieng theo tung tai khoan bang JWT.</p>

        {error && <p className="error-banner">{error}</p>}

        <div className="auth-switch">
          <button
            type="button"
            className={mode === 'login' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setMode('login')}
          >
            Dang nhap
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setMode('register')}
          >
            Dang ky
          </button>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Ten hien thi
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                minLength={2}
                required
                placeholder="Nguyen Van A"
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
            Mat khau
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
              placeholder="It nhat 6 ky tu"
            />
          </label>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Dang xu ly...' : mode === 'login' ? 'Dang nhap' : 'Tao tai khoan'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AuthPanel
