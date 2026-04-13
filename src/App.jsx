import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Games from "./pages/Games";
import GameDetails from "./pages/GameDetails";
import Favorites from "./pages/Favorites";
import Navbar from "./components/Navbar";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  return (
    <BrowserRouter>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/games"
            element={<Games debouncedSearchQuery={debouncedSearchQuery} />}
          />
          <Route path="/games/:id" element={<GameDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
