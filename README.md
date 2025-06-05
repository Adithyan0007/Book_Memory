# 📚 BookBuddy

**BookBuddy** is a full-stack web application designed to help users **store**, **track**, and **review books**. Built with a modern tech stack including **Vite + React**, **Node.js**, **PostgreSQL**, and **Prisma ORM**, it provides a clean and responsive interface with robust backend services.

---

## 🌟 Features

- 🧾 Register and Login using JWT-based Authentication
- 📖 Add, Edit, and Delete Books
- ✍️ Leave Reviews with Ratings
- 🔎 Search & Pagination Support
- 🧑‍💻 Profile page with analysis of books which are finished reading
- 📊 API structured with REST principles
- 🧼 Clean, modular codebase for easy scalability

---

## 🧱 Tech Stack

| Layer       | Tech Stack                     |
|-------------|--------------------------------|
| Frontend    | Vite + React + Tailwind CSS*   |
| Backend     | Node.js + Express              |
| Database    | PostgreSQL                     |
| ORM         | Prisma                         |
| Auth        | JWT, bcrypt                    |
| Tools       | Axios, dotenv, CORS            |



---

## 🗂️ Folder Structure
```plaintext
BOOKBUDDY/
├── backend/
│   ├── middleware/
│   │   └── authenticateToken.js
│   ├── node_modules/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── routes/
│   │   ├── books.js
│   │   ├── reviews.js
│   │   └── user.js
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── seedBook.js
│   └── server.js
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
```

