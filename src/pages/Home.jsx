import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFeaturedGames } from "../services/api";

function Home() {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFeaturedGames() {
      try {
        const games = await fetchFeaturedGames();
        setFeaturedGames(games);
      } catch (err) {
        console.error(err);
        setError("Failed to load featured games.");
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedGames();
  }, []);

  useEffect(() => {
    if (featuredGames.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredGames.length);
    }, 4500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [featuredGames]);

  if (loading) {
    return <section className="hero-status">Loading featured games...</section>;
  }

  if (error) {
    return <section className="hero-status">{error}</section>;
  }

  if (featuredGames.length === 0) {
    return <section className="hero-status">No featured games available.</section>;
  }

  const featuredGame = featuredGames[currentIndex];
  const supportingText = featuredGame.genres?.length
    ? `Explore ${featuredGame.genres
        .slice(0, 2)
        .map((genre) => genre.name)
        .join(" and ")} in one of GameVault's standout picks.`
    : "Jump into one of the most talked-about games in the collection.";

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: featuredGame.background_image
          ? `linear-gradient(135deg, rgba(8, 10, 18, 0.72), rgba(8, 10, 18, 0.9)), url(${featuredGame.background_image})`
          : "linear-gradient(135deg, rgba(31, 41, 55, 0.92), rgba(17, 24, 39, 0.98))",
      }}
    >
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-eyebrow">Featured Game</p>
        <h1>{featuredGame.name}</h1>
        <p className="hero-copy">{supportingText}</p>
        <div className="hero-meta">
          <span>Rating: {featuredGame.rating}</span>
          <span>Released: {featuredGame.released || "TBA"}</span>
        </div>
        <Link to={`/games/${featuredGame.id}`} className="hero-button">
          View Details
        </Link>
      </div>
    </section>
  );
}

export default Home;
