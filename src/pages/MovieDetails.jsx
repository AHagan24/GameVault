import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SkeletonDetails from "../components/SkeletonDetails";
import { FavoritesContext } from "../context/FavoritesContext";
import { fetchMovieDetails } from "../services/api";

function MovieDetails() {
  const { imdbID } = useParams();
  const { addFavorite, removeFavorite, isFavorite } =
    useContext(FavoritesContext);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovieDetails() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchMovieDetails(imdbID, controller.signal);
        setMovie(result);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error(error);
        setError(
          error.message === "Movie not found!"
            ? "Movie not found."
            : "Failed to load movie.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMovieDetails();

    return () => {
      controller.abort();
    };
  }, [imdbID]);

  if (loading) {
    return <SkeletonDetails />;
  }

  if (error) {
    return <section className="hero-status">{error}</section>;
  }

  if (!movie) {
    return <section className="hero-status">No movie found.</section>;
  }

  const favorite = isFavorite(movie.imdbID);

  function handleFavoriteClick() {
    if (favorite) {
      removeFavorite(movie.imdbID);
      return;
    }

    addFavorite(movie);
  }

  return (
    <div className="game-details-page">
      <div className="game-details-header">
        <h1>{movie.Title}</h1>
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`favorite-icon-button details-favorite-icon${favorite ? " active" : ""}`}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
        >
          <span aria-hidden="true">{favorite ? "\u2665" : "\u2661"}</span>
        </button>
      </div>

      {movie.Poster && (
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="game-details-hero"
        />
      )}

      <div className="movie-details-meta">
        <p>
          <strong>Year:</strong> {movie.Year}
        </p>
        <p>
          <strong>Genre:</strong> {movie.Genre}
        </p>
        <p>
          <strong>Runtime:</strong> {movie.Runtime}
        </p>
        <p>
          <strong>Director:</strong> {movie.Director}
        </p>
        <p>
          <strong>Actors:</strong> {movie.Actors}
        </p>
        <p>
          <strong>IMDb Rating:</strong> {movie.imdbRating}
        </p>
        <p>
          <strong>Type:</strong> {movie.Type}
        </p>
      </div>

      <p className="game-details-description">{movie.Plot}</p>
    </div>
  );
}

export default MovieDetails;
