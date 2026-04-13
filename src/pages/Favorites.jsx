import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import GameCard from "../components/GameCard";

function Favorites() {
  const { favorites } = useContext(FavoritesContext);

  return (
    <section className="favorites-page">
      <h1>Your Favorites</h1>

      {favorites.length === 0 ? (
        <p className="favorites-empty-state">You have no favorite games yet.</p>
      ) : (
        <div className="games-grid">
          {favorites.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
