
````markdown
# 📚 Bookshelf – A Personal Reading Tracker

Bookshelf is a full-stack web application that helps users manage their reading habits, record notes, track statistics, and share their reading profile publicly. Built with **Next.js**, **MongoDB**, and **Tailwind CSS**, it offers a modern and responsive user experience with secure JWT authentication.

---

## 🚀 Features

### ✅ User Account System
- Register and log in with email and password
- Password reset via email
- JWT-based authentication with protected routes
- Customize personal profile slug (e.g. `/profile/tom`)

### 📘 Book Management
- Search and import books via **Google Books API**
- Add/edit/delete books in personal library
- Set reading status, rating, tags, and reading period
- Upload and display book covers

### 📝 Reading Notes
- Write notes for each book
- Edit/delete notes
- Set note visibility (public or private)
- View all notes in a central overview

### 📊 Reading Statistics
- Monthly reading progress chart
- Reading status distribution
- Most-used tags
- Book categories based on Google Books

### 🌐 Public Profile Page
- Share a public profile with selected books and notes
- Access via custom slug (e.g. `/profile/tom`)
- Includes book grid and reading notes
- View-only, no login required

### 🔐 My Page (Private Dashboard)
- View personal info (name, email, avatar)
- Quick links to dashboard, books, notes
- Fallback ID encoded from email if profileSlug not set

---

## ✅ Completed Modules

- [x] **User Authentication**  
- [x] **Book Management Module**  
- [x] **Reading Notes Module**  
- [x] **Reading Statistics Module**  
- [x] **Public Profile Module**  
- [x] **My Profile Page (`/me`)**  
- [x] **Global Navigation Bar**

---

## 🐞 Known Issues & Bugs

- 🔄 **"My Page" Redirects to Login Even After Login**  
  In some cases, after logging in, clicking the "My Page" link redirects the user back to `/login` even though a valid session exists.  
  Temporary fix: Refresh the page or visit `/me` manually.  
  Permanent fix in progress.

- 📄 **Slug Collision Not Handled**  
  Currently, no validation prevents users from choosing the same `profileSlug`.

- 🧹 **No Profile Editing Functionality Yet**  
  Users cannot update their display name, avatar, or slug.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bookshelf.git
   cd bookshelf
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local`:

   ```env
   MONGODB_URI=your-mongodb-uri
   NEXTAUTH_SECRET=your-secret
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY=your-google-api-key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

---

