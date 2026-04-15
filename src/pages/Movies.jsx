import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import {
  fetchDefaultMovies,
  fetchMovieDetails,
  searchMovies,
} from "../services/api";

function Movies({ debouncedSearchQuery }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [yearInput, setYearInput] = useState("");
  const [appliedYear, setAppliedYear] = useState("");
  const trimmedQuery = debouncedSearchQuery.trim();
  const hasUserSearch = trimmedQuery.length > 0;
  const trimmedYear = appliedYear.trim();
  const resultsHeading = hasUserSearch
    ? `Showing results for "${trimmedQuery}"`
    : "Browse movies";

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setAppliedYear(yearInput);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [yearInput]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      setLoading(true);
      setError("");

      try {
        const results = hasUserSearch
          ? await searchMovies(
              trimmedQuery,
              1,
              selectedType,
              trimmedYear,
              controller.signal,
            )
          : await fetchDefaultMovies(
              {
                type: selectedType,
                year: trimmedYear,
              },
              controller.signal,
            );
        const settledResults = await Promise.allSettled(
          results.map(async (movie) => {
            const details = await fetchMovieDetails(movie.imdbID, controller.signal);

            return {
              ...movie,
              imdbRating: details.imdbRating,
            };
          }),
        );

        const enrichedMovies = results.map((movie, index) => {
          const result = settledResults[index];

          if (result?.status !== "fulfilled") {
            return movie;
          }

          return {
            ...movie,
            ...result.value,
          };
        });

        if (!controller.signal.aborted) {
          setMovies(enrichedMovies);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Movies page error:", error);
        setError(error?.message || "Failed to load movies.");
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
  }, [hasUserSearch, selectedType, trimmedQuery, trimmedYear]);

  if (error) {
    return <section className="hero-status">{error}</section>;
  }

  return (
    <section className="games-page">
      <div className="games-filters">
        <div className="games-toolbar">
          <div>
            <p className="games-filters-label">Movies</p>
            <p className="games-results-heading">{resultsHeading}</p>
          </div>

          <div className="games-filter-controls">
            <label className="games-filter-field">
              <span className="games-filter-name">Type</span>
              <select
                className="games-filter-input"
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
              >
                <option value="All">All</option>
                <option value="movie">Movie</option>
                <option value="series">Series</option>
              </select>
            </label>

            <label className="games-filter-field">
              <span className="games-filter-name">Year</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                className="games-filter-input"
                placeholder="Any year"
                value={yearInput}
                onChange={(event) =>
                  setYearInput(
                    event.target.value.replace(/\D/g, "").slice(0, 4),
                  )
                }
              />
            </label>
          </div>
        </div>

        <p className="games-results-summary">
          Showing {movies.length} movie{movies.length === 1 ? "" : "s"}
        </p>
      </div>

      {loading ? (
        <div className="games-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="games-empty-state">
          {hasUserSearch
            ? `No movies matched "${trimmedQuery}".`
            : "No movies available right now."}
        </div>
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

export default Movies;
