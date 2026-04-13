import { useEffect, useMemo, useState } from "react";
import GameCard from "../components/GameCard";
import { fetchGames } from "../services/api";

function Games({ searchQuery }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");

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
  const genreOptions = useMemo(() => {
    const uniqueGenres = new Set();

    games.forEach((game) => {
      game.genres?.forEach((genre) => {
        if (genre?.name) {
          uniqueGenres.add(genre.name);
        }
      });
    });

    return ["All Genres", ...Array.from(uniqueGenres).sort((a, b) => a.localeCompare(b))];
  }, [games]);

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(normalizedQuery);
    const matchesGenre =
      selectedGenre === "All Genres" ||
      game.genres?.some((genre) => genre?.name === selectedGenre);

    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return <h2>Loading games...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <section className="games-page">
      <div className="games-filters">
        <div>
          <p className="games-filters-label">Filter by genre</p>
          <select
            className="games-genre-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {genreOptions.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <p className="games-results-summary">
          Showing {filteredGames.length} of {games.length} games
        </p>
      </div>

      {filteredGames.length === 0 ? (
        <div className="games-empty-state">
          No games match your search and genre filters.
        </div>
      ) : (
        <div className="games-grid">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Games;
