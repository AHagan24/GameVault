import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { fetchGames } from "../services/api";

function Games({ searchQuery }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGames() {
      try {
        const fetchedGames = await fetchGames();
        setGames(fetchedGames);
      } catch (err) {
        console.error(err);
        setError("Failed to load games.");
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(normalizedQuery)
  );

  if (loading) {
    return <h2>Loading games...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (filteredGames.length === 0) {
    return (
      <div className="games-empty-state">
        No games found for '{searchQuery.trim()}'
      </div>
    );
  }

  return (
    <div className="games-grid">
      {filteredGames.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

export default Games;
