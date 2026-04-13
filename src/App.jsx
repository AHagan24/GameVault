import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Games from "./pages/Games";
import GameDetails from "./pages/GameDetails";
import Favorites from "./pages/Favorites";
import Navbar from "./components/Navbar";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <BrowserRouter>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main
        style={{
          width: "min(1200px, 100%)",
          margin: "24px auto 0",
          padding: "0 24px 40px",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games searchQuery={searchQuery} />} />
          <Route path="/games/:id" element={<GameDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
