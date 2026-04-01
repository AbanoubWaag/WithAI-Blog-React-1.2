# Blog App

A full-stack blog application built with **Node.js**, **Express**, **MongoDB**, **React**and vanilla **HTML/CSS/JS**. Features real-time comments and likes via **Socket.IO**, article scraping, image uploads, and JWT authentication.

---

## Features

- **Authentication** — Register & login with JWT tokens, role-based access (user / admin)
- **Posts** — Create, read, update, delete posts with image upload or URL import
- **Comments & Replies** — Nested comments with like/delete support
- **Real-time** — New comments, replies, and likes update live via Socket.IO
- **Article Scraper** — Import title, content, and image from any article URL
- **Image Uploads** — Upload photos (JPEG, PNG, WebP, max 5MB) or use a URL
- **Pagination** — Posts are paginated (9 per page)
- **Admin Controls** — Admins can delete any post or comment

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Backend   | Node.js, Express 5, Mongoose            |
| Database  | MongoDB                                 |
| Auth      | JSON Web Tokens (JWT), bcrypt           |
| Realtime  | Socket.IO                               |
| Scraping  | @postlight/parser, axios, cheerio       |
| Uploads   | Multer                                  |
| Frontend  | Vanilla HTML, CSS, JavaScript  react
# Blogify

A full-stack blog platform built with **Node.js**, **Express**, **MongoDB**, and **React**.

---

## Project Structure

```
blog/
├── backend/          # Express API server
└── frontend-react/   # React + Vite frontend
```

---

## Tech Stack

### Backend
| Package | Purpose |
|---|---|
| Express 5 | HTTP server & routing |
| Mongoose | MongoDB ODM |
| bcrypt | Password hashing |
| jsonwebtoken | JWT authentication |
| multer | File uploads (max 1MB) |
| socket.io | Real-time likes & comments |
| express-validator | Request validation |
| axios + cheerio | Article scraping (fallback) |
| @postlight/parser | Article scraping (primary) |
| dotenv | Environment variables |
| cors | Cross-origin requests |

### Frontend
| Package | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| Socket.IO Client | Real-time updates |

---

## Getting Started

### 1. Install backend dependencies
```bash
cd backend
npm install
```

### 2. Configure environment variables
Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogdb
JWT_SECRET=your_real_secret_here
```

### 3. Start the backend
```bash
cd backend
node server.js
```

### 4. Build the React frontend
```bash
cd frontend-react
npm install
npm run build
```

### 5. Open in browser
```
http://localhost:5000
```

> For frontend development with hot reload:
> ```bash
> cd frontend-react
> npm run dev   # runs on http://localhost:5000
> ```

---

## API Endpoints

### Auth — `/api/auth`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/register` | ✗ | Register new user |
| POST | `/login` | ✗ | Login and get token |
| GET | `/saved` | ✓ | Get saved posts |

### Posts — `/api/posts`
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | ✗ | Get all posts (paginated, searchable) |
| GET | `/:id` | ✗ | Get single post |
| POST | `/` | ✓ | Create post |
| PUT | `/:id` | ✓ | Update post (owner/admin) |
| DELETE | `/:id` | ✓ | Delete post (owner/admin) |
| POST | `/:id/like` | ✓ | Toggle like |
| POST | `/:id/save` | ✓ | Toggle save |
| GET | `/:id/comments` | ✗ | Get comments |
| POST | `/:id/comments` | ✓ | Add comment |

### Comments — `/api/comments`
| Method | Route | Auth | Description |
|---|---|---|---|
| DELETE | `/:id` | ✓ | Delete comment (owner/admin) |
| POST | `/:id/like` | ✓ | Toggle comment like |
| POST | `/:id/replies` | ✓ | Add reply |
| DELETE | `/:id/replies/:replyId` | ✓ | Delete reply (owner/admin) |
| POST | `/:id/replies/:replyId/like` | ✓ | Toggle reply like |

### Scrape — `/api/scrape`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/` | ✓ | Import article from URL |

---

## Features

### Authentication
- Register / Login with JWT (7 day expiry)
- Role-based access: `user` and `admin`
- Passwords hashed with bcrypt (10 rounds)
- Token stored in localStorage

### Posts
- Create, edit, delete posts
- Cover photo upload (max **1MB**, jpeg/jpg/png/webp)
- Import article from any URL (auto-fills title, content, image)
- Like / Unlike posts (real-time via Socket.IO)
- Save / Unsave posts
- Search posts by title or content
- Pagination (9 posts per page)
- Only post owner or admin can edit/delete

### Comments & Replies
- Add, delete comments
- Like / Unlike comments
- Nested replies on comments
- Like / Unlike replies
- Real-time new comments via Socket.IO
- Only comment owner or admin can delete

### Frontend (React)
- **Dark mode** toggle (persists in localStorage)
- **Search** posts from navbar
- **Toast notifications** for all actions
- **Reading time** estimate on posts
- **Hero section** with live post count
- **Post excerpt** preview on cards
- **Numbered pagination**
- Fully responsive design
- Sticky navbar with blur effect

### React Concepts Used
| Concept | Where |
|---|---|
| `useState` | Every component |
| `useEffect` + cleanup | PostDetail, PostForm, useFetch |
| `useContext` + `createContext` | AuthContext, ToastContext |
| `useRef` | PostForm file input |
| `useNavigate`, `useParams` | PostDetail, PostForm, Navbar |
| Custom hooks | `useFetch`, `useForm` |
| Controlled inputs | Login, Register, PostForm |
| List rendering + `key` | Home, CommentSection |
| Conditional rendering | Navbar, PostDetail, CommentSection |
| Props + destructuring | PostCard, UI components |
| `FormData` | PostForm |
| Axios interceptors | `api/axios.js` |
| Socket.IO | PostDetail |
| Protected routes | SavedPosts, PostForm |

---

## Data Models

### User
```js
{ name, email, password, role: "user"|"admin", savedPosts: [PostId] }
```

### Post
```js
{ title, content, photo, author: UserId, likes: [UserId] }
```

### Comment
```js
{
  content, author: UserId, post: PostId,
  likes: [UserId],
  replies: [{ content, author: UserId, likes: [UserId] }]
}
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/blogdb` |
| `JWT_SECRET` | Secret key for JWT signing | `your_strong_secret` |



