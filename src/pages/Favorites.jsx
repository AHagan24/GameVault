import { useContext, useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { FavoritesContext } from "../context/FavoritesContext";
import { fetchMovieDetails } from "../services/api";

function Favorites() {
  const { favorites } = useContext(FavoritesContext);
  const [enrichedFavorites, setEnrichedFavorites] = useState(favorites);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFavoriteDetails() {
      if (favorites.length === 0) {
        setEnrichedFavorites([]);
        return;
      }

      try {
        const movies = await Promise.all(
          favorites.map(async (movie) => {
            if (movie.imdbRating && movie.imdbRating !== "N/A") {
              return movie;
            }

            try {
              const details = await fetchMovieDetails(
                movie.imdbID,
                controller.signal,
              );

              return {
                ...movie,
                ...details,
              };
            } catch (error) {
              if (error.name === "AbortError") {
                throw error;
              }

              return movie;
            }
          }),
        );

        if (!controller.signal.aborted) {
          setEnrichedFavorites(movies);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setEnrichedFavorites(favorites);
        }
      }
    }

    loadFavoriteDetails();

    return () => {
      controller.abort();
    };
  }, [favorites]);

  return (
    <section className="favorites-page">
      <div className="favorites-header">
        <p className="favorites-label">My List</p>
        <h1>Favorites</h1>
        <p className="favorites-subtitle">
          Your saved movies, ready whenever you want to press play.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty-state">
          <h2>No saved movies yet</h2>
          <p>Tap the heart icon to add movies</p>
        </div>
      ) : (
        <div className="games-grid favorites-grid">
          {enrichedFavorites.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
