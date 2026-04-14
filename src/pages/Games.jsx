import { useEffect, useState } from "react";
import MovieCard from "../components/GameCard";
import SkeletonCard from "../components/SkeletonCard";
import { searchMovies } from "../services/api";

const DEFAULT_QUERY = "Batman";

function Games({ debouncedSearchQuery }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const activeQuery = debouncedSearchQuery || DEFAULT_QUERY;

    async function loadMovies() {
      setLoading(true);
      setError("");

      try {
        const results = await searchMovies(activeQuery, 1, controller.signal);
        setMovies(results);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error(error);
        setError("Failed to load movies.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      controller.abort();
    };
  }, [debouncedSearchQuery]);

  const activeQuery = debouncedSearchQuery || DEFAULT_QUERY;

  if (loading) {
    return (
      <section className="games-page">
        <div className="games-filters">
          <div>
            <p className="games-filters-label">Searching OMDb</p>
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
          <p className="games-filters-label">Search term</p>
          <div className="games-query-chip">{activeQuery}</div>
        </div>

        <p className="games-results-summary">
          Showing {movies.length} movie{movies.length === 1 ? "" : "s"}
        </p>
      </div>

      {movies.length === 0 ? (
        <div className="games-empty-state">No movies matched "{activeQuery}".</div>
      ) : (
        <div className="games-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Games;
