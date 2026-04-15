# 🎬 MovieVault

A modern movie discovery app built with React and powered by the OMDb API.
Browse movies, search in real time, filter results, and save your favorites — all in a clean, responsive UI.

---

## 🚀 Features

* 🔍 **Search Movies** – Real-time search powered by OMDb API
* 🎯 **Filters** – Filter by type (movie/series) and year
* ⭐ **IMDb Ratings** – View ratings directly on movie cards
* ❤️ **Favorites System** – Save and manage your favorite movies
* 🎬 **Dynamic Movie Pages** – Detailed movie info with plot, cast, and more
* 🏠 **Featured Hero Section** – Rotating featured movies on the homepage
* 📱 **Responsive Design** – Works across desktop and mobile devices
* ⚡ **Debounced Search** – Optimized API calls for performance
* 🎨 **Modern UI/UX** – Clean, minimal, and product-style interface

---

## 🛠️ Tech Stack

* **Frontend:** React + Vite
* **Styling:** CSS (custom modern UI)
* **API:** OMDb API
* **State Management:** React Hooks + Context API
* **Routing:** React Router

---

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/movie-vault.git
cd movie-vault
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```bash
VITE_OMDB_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

---

## ⚠️ Notes

* OMDb API has a **1000 request/day limit** on the free tier
* Some movies may not have posters or ratings available
* API key must be activated via email before use

---

## 🎯 What I Learned

* Working with real-world APIs and handling edge cases
* Managing async data and error states in React
* Optimizing performance with debouncing and request control
* Building scalable UI components and reusable logic
* Debugging API limits and production-like issues

---

## 📌 Future Improvements

* Pagination for large result sets
* Better caching to reduce API calls
* Advanced filtering (genre, ratings, etc.)
* User authentication for persistent favorites

---

## 👤 Author

**Addison Hagan**

---

## 📄 License

This project is for educational purposes.
