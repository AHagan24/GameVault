import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext";
import { fetchGameDetails } from "../services/api";

function GameDetails() {
  const { id } = useParams();
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGame() {
      try {
        const data = await fetchGameDetails(id);
        setGame(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load game.");
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [id]);

  if (loading) return <h2>Loading game...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!game) return <h2>No game found.</h2>;

  const favorite = isFavorite(game.id);

  function handleFavoriteClick() {
    if (favorite) {
      removeFavorite(game.id);
      return;
    }

    addFavorite(game);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{game.name}</h1>

      {game.background_image && (
        <img
          src={game.background_image}
          alt={game.name}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
      )}

      <button
        type="button"
        onClick={handleFavoriteClick}
        className={`details-favorite-button${favorite ? " active" : ""}`}
      >
        {favorite ? "Remove Favorite" : "Add to Favorites"}
      </button>

      <p>
        <strong>Rating:</strong> {game.rating}
      </p>
      <p>
        <strong>Released:</strong> {game.released}
      </p>

      <p>
        <strong>Genres:</strong> {game.genres?.map((g) => g.name).join(", ")}
      </p>

      <p>
        <strong>Platforms:</strong>{" "}
        {game.platforms?.map((p) => p.platform.name).join(", ")}
      </p>

      <p style={{ marginTop: "20px", lineHeight: "1.6" }}>
        {game.description_raw}
      </p>
    </div>
  );
}

export default GameDetails;
