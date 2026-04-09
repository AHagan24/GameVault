import { Link } from "react-router-dom";

function GameCard({ game }) {
  if (!game) return null;

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
        </div>
      </div>
    </Link>
  );
}

export default GameCard;
