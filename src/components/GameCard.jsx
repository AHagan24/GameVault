import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext";

function truncateText(text, maxLength = 100) {
  if (!text) {
    return "No plot available";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}...`;
}

function MovieCard({ movie, variant = "default" }) {
  const { addFavorite, removeFavorite, isFavorite } =
    useContext(FavoritesContext);
  const [imageError, setImageError] = useState(false);

  if (!movie?.imdbID) {
    return null;
  }

  const favorite = isFavorite(movie.imdbID);
  const title = movie.Title || "Untitled movie";
  const year = movie.Year || "Unknown year";
  const poster = movie.Poster || "";
  const imdbRating =
    movie.imdbRating && movie.imdbRating !== "N/A"
      ? movie.imdbRating
      : "No rating available";
  const plot = truncateText(
    movie.Plot && movie.Plot !== "N/A" ? movie.Plot : "No plot available",
  );
  const hasPoster = Boolean(poster) && poster !== "N/A" && !imageError;
  const isPopularVariant = variant === "popular";

  function handleFavoriteClick(e) {
    e.preventDefault();

    if (favorite) {
      removeFavorite(movie.imdbID);
      return;
    }

    addFavorite(movie);
  }

  return (
    <Link to={`/movies/${movie.imdbID}`} className="game-card-link">
      <div className="game-card">
        <div className="game-card-poster">
          {hasPoster ? (
            <img
              src={poster}
              alt={title}
              className="game-card-image"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="game-card-image game-card-image-fallback">
              Poster unavailable
            </div>
          )}
        </div>

        <div className="game-card-content">
          <h3>{title}</h3>
          {isPopularVariant ? (
            <>
              <p>{`\u2B50 ${imdbRating}`}</p>
              <p>Year: {year}</p>
              <p>{plot}</p>
            </>
          ) : (
            <>
              <p>Year: {year}</p>
              <p>Type: {movie.Type || "movie"}</p>
            </>
          )}

          <button
            type="button"
            onClick={handleFavoriteClick}
            className="favorite-button"
          >
            {favorite ? "Remove Favorite" : "Add to Favorites"}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
