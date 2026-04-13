import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { FavoritesContext } from "../context/FavoritesContext";

function GameCard({ game }) {
  const { addFavorite, removeFavorite, isFavorite } =
    useContext(FavoritesContext);
  const [imageError, setImageError] = useState(false);

  if (!game) return null;

  const favorite = isFavorite(game.id);
  const title = game.name || "Untitled game";
  const rating =
    typeof game.rating === "number" ? game.rating.toFixed(1) : "Not rated";
  const releaseDate = game.released || "TBA";
  const hasImage = Boolean(game.background_image) && !imageError;

  function handleFavoriteClick(e) {
    e.preventDefault();

    if (favorite) {
      removeFavorite(game.id);
    } else {
      addFavorite(game);
    }
  }

  return (
    <Link to={`/games/${game.id}`} className="game-card-link">
      <div className="game-card">
        {hasImage ? (
          <img
            src={game.background_image}
            alt={title}
            className="game-card-image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="game-card-image game-card-image-fallback">
            No image available
          </div>
        )}

        <div className="game-card-content">
          <h3>{title}</h3>
          <p>Rating: {rating}</p>
          <p>Released: {releaseDate}</p>

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

export default GameCard;
