import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Games from "./pages/Games";
import GameDetails from "./pages/GameDetails";
import Favorites from "./pages/Favorites";
import NavBar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <NavBar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:id" element={<GameDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </NavBar>
    </BrowserRouter>
  );
}

export default App;
