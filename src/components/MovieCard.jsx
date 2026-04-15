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
  const hasRating = Boolean(movie.imdbRating) && movie.imdbRating !== "N/A";
  const imdbRating = hasRating ? movie.imdbRating : "";
  const plot = truncateText(
    movie.Plot && movie.Plot !== "N/A" ? movie.Plot : "No plot available",
  );
  const hasPoster = Boolean(poster) && poster !== "N/A" && !imageError;
  const isPopularVariant = variant === "popular";

  function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();

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
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`favorite-icon-button${favorite ? " active" : ""}`}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={favorite}
          >
            <span aria-hidden="true">{favorite ? "\u2665" : "\u2661"}</span>
          </button>
          {hasPoster ? (
            <img
              src={poster}
              alt={title}
              className="game-card-image"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="game-card-image-fallback" aria-label={`${title} poster unavailable`}>
              <span>Poster unavailable</span>
            </div>
          )}
        </div>

        <div className="game-card-content">
          <h3>{title}</h3>
          {isPopularVariant ? (
            <>
              {hasRating ? <p>{`\u2B50 ${imdbRating}`}</p> : null}
              <p>Year: {year}</p>
              <p>{plot}</p>
            </>
          ) : (
            <>
              {hasRating ? <p>{`\u2B50 ${imdbRating}`}</p> : null}
              <p>Year: {year}</p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
