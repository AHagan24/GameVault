import { useEffect, useMemo, useState } from "react";
import GameCard from "../components/GameCard";
import SkeletonCard from "../components/SkeletonCard";
import { fetchGames } from "../services/api";

function Games({ debouncedSearchQuery }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");

  useEffect(() => {
    const controller = new AbortController();

    async function loadGames() {
      try {
        const fetchedGames = await fetchGames(controller.signal);
        setGames(fetchedGames);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        console.error(err);
        setError("Failed to load games.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadGames();

    return () => {
      controller.abort();
    };
  }, []);

  const normalizedQuery = debouncedSearchQuery.trim().toLowerCase();
  const genreOptions = useMemo(() => {
    const uniqueGenres = new Set();

    games.forEach((game) => {
      game.genres?.forEach((genre) => {
        if (genre?.name) {
          uniqueGenres.add(genre.name);
        }
      });
    });

    return [
      "All Genres",
      ...Array.from(uniqueGenres).sort((a, b) => a.localeCompare(b)),
    ];
  }, [games]);

  const filteredGames = games.filter((game) => {
    const matchesSearch = (game.name || "")
      .toLowerCase()
      .includes(normalizedQuery);
    const matchesGenre =
      selectedGenre === "All Genres" ||
      game.genres?.some((genre) => genre?.name === selectedGenre);

    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return (
      <section className="games-page">
        <div className="games-filters">
          <div>
            <p className="games-filters-label">Filter by genre</p>
            <div className="games-genre-select skeleton-block skeleton-select" />
          </div>

          <div className="skeleton-block skeleton-line skeleton-line-short" />
        </div>

        <div className="games-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return <section className="hero-status">{error}</section>;
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
          {games.length === 0
            ? "No games are available right now."
            : "No games match your search and genre filters."}
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
