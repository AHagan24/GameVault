import { useContext } from "react";
import GameCard from "../components/GameCard";
import { FavoritesContext } from "../context/FavoritesContext";

function Favorites() {
  const { favorites } = useContext(FavoritesContext);

  return (
    <section className="favorites-page">
      <h1>Your Favorites</h1>

      {favorites.length === 0 ? (
        <p className="favorites-empty-state">
          You have no favorite movies yet. Save a few titles to build your
          shortlist.
        </p>
      ) : (
        <div className="games-grid">
          {favorites.map((movie) => (
            <GameCard key={movie.imdbID} game={movie} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
