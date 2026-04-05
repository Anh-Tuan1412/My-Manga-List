# My Manga List - Fullstack Project

A fullstack Manga/Book tracking application based on your requirement:

- React frontend (CRUD, filters, sorting, progress bar, dark mode)
- Node.js + Express backend
- MongoDB database
- Jikan API integration for manga autofill
- Recharts data visualization (genre distribution)
- Wishlist estimated cost tracking
- JWT authentication (register/login)
- Infinite scroll with backend pagination

## 1) Features

- Add, edit, delete manga records
- Track chapters: owned vs total with progress bar
- Personal rating (0-10)
- Reading status: `reading`, `completed`, `wishlist`
- Filter by status and genre
- Sort by created date, rating, progress, title
- Search by title
- Jikan API quick search and autofill
- Pie chart for genre distribution
- Dark mode toggle
- Login/register with JWT
- Private manga list per user account
- Infinite scrolling list (pagination API)
- Frontend refactor with reusable hooks and components

## 2) Project structure

- `backend/`: Express API, JWT auth, MongoDB models
- `frontend/`: React app (Vite) with hooks/components architecture

## 3) Setup

### Backend

1. Go to backend folder:

```bash
cd backend
```

2. Copy env and update values:

```bash
cp .env.example .env
```

3. Install dependencies (already installed in this workspace, but needed on new machine):

```bash
npm install
```

4. Run backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

### Frontend

1. Go to frontend folder:

```bash
cd frontend
```

2. Copy env:

```bash
cp .env.example .env
```

3. Install dependencies (already installed in this workspace, but needed on new machine):

```bash
npm install
```

4. Run frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## 4) API endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `GET /api/manga` (Bearer token, supports `page` and `limit`)
- `POST /api/manga` (Bearer token)
- `PUT /api/manga/:id` (Bearer token)
- `DELETE /api/manga/:id` (Bearer token)
- `GET /api/manga/stats` (Bearer token)
- `GET /api/manga/jikan/search?query=...` (Bearer token)

## 5) Notes

- Make sure MongoDB is running locally or set `MONGO_URI` to your MongoDB Atlas connection string.
- Jikan API has rate limiting. If you get `429`, wait and retry.
- Change `JWT_SECRET` in `backend/.env` before deploying.
