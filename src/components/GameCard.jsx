import { Link } from "react-router-dom";
import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";

function GameCard({ game }) {
  const { addFavorite, removeFavorite, isFavorite } =
    useContext(FavoritesContext);

  if (!game) return null;

  const favorite = isFavorite(game.id);

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
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={game.name}
            className="game-card-image"
          />
        ) : (
          <div
            className="game-card-image"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#222",
              color: "#aaa",
            }}
          >
            No image available
          </div>
        )}

        <div className="game-card-content">
          <h3>{game.name}</h3>
          <p>Rating: {game.rating}</p>
          <p>Released: {game.released}</p>

          <button onClick={handleFavoriteClick} className="favorite-button">
            {favorite ? "Remove Favorite" : "Add to Favorites"}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default GameCard;
