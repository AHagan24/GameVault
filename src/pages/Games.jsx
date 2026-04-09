import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { fetchGames } from "../services/api";

function Games() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function loadGames() {
      const fetchedGames = await fetchGames();
      setGames(fetchedGames);
    }

    loadGames();
  }, []);

  return (
    <div className="games-grid">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

export default Games;
