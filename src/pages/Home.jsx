import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import GameCard from "../components/GameCard";
import SkeletonCard from "../components/SkeletonCard";
import SkeletonHero from "../components/SkeletonHero";
import { fetchFeaturedGames, fetchGames } from "../services/api";

function Home() {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [popularLoading, setPopularLoading] = useState(true);
  const [popularError, setPopularError] = useState("");

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
    async function loadPopularGames() {
      try {
        const games = await fetchGames();
        setPopularGames(games.slice(0, 3));
      } catch (err) {
        console.error(err);
        setPopularError("Failed to load popular games.");
      } finally {
        setPopularLoading(false);
      }
    }

    loadPopularGames();
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
    return (
      <>
        <SkeletonHero />

        <section className="home-section home-section-popular">
          <div className="home-section-header">
            <div>
              <p className="home-section-eyebrow">Browse</p>
              <h2>Popular Right Now</h2>
              <p className="home-section-copy">
                A quick look at standout titles worth jumping into next.
              </p>
            </div>

            <Link to="/games" className="home-section-link">
              Browse All Games
            </Link>
          </div>

          <div className="games-grid games-grid-compact">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return <section className="hero-status">{error}</section>;
  }

  if (featuredGames.length === 0) {
    return (
      <section className="hero-status">No featured games available.</section>
    );
  }

  const featuredGame = featuredGames[currentIndex] || featuredGames[0];
  const supportingText =
    Array.isArray(featuredGame.genres) && featuredGame.genres.length > 0
      ? `Explore ${featuredGame.genres
          .slice(0, 2)
          .map((genre) => genre.name)
          .join(" and ")} in one of GameVault's standout picks.`
      : "Jump into one of the most talked-about games in the collection.";

  return (
    <>
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
            <span>⭐ {featuredGame.rating?.toFixed(1)}</span>
            <span>Released: {featuredGame.released || "TBA"}</span>
          </div>
          <Link to={`/games/${featuredGame.id}`} className="hero-button">
            View Details
          </Link>
        </div>
      </section>

      <section className="home-section home-section-popular">
        <div className="home-section-header">
          <div>
            <p className="home-section-eyebrow">Browse</p>
            <h2>Popular Right Now</h2>
            <p className="home-section-copy">
              A quick look at standout titles worth jumping into next.
            </p>
          </div>

          <Link to="/games" className="home-section-link">
            Browse All Games
          </Link>
        </div>

        {popularLoading ? (
          <div className="games-grid games-grid-compact">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : popularError ? (
          <div className="games-empty-state">{popularError}</div>
        ) : (
          <div className="games-grid games-grid-compact">
            {popularGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>

      <section className="home-section">
        <div className="home-section-header home-section-header-centered">
          <div>
            <p className="home-section-eyebrow">Why GameVault</p>
            <h2>Everything you need for your next session</h2>
          </div>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-card-kicker">Discover New Games</span>
            <p>
              Browse fresh picks, revisit classics, and move from curiosity to
              your next playthrough fast.
            </p>
          </article>

          <article className="feature-card">
            <span className="feature-card-kicker">Save Favorites</span>
            <p>
              Keep your shortlist close so the games you want to track are
              always easy to find.
            </p>
          </article>

          <article className="feature-card">
            <span className="feature-card-kicker">Watch Trailers</span>
            <p>
              Preview the look and feel of a game before you dive deeper into
              the full details page.
            </p>
          </article>
        </div>
      </section>

      <section className="home-cta-section">
        <div className="home-cta-card">
          <p className="home-section-eyebrow">Start Exploring</p>
          <h2>Ready to explore your next favorite game?</h2>
          <p>
            Dive into the full library and find something worth playing tonight.
          </p>
          <Link to="/games" className="hero-button">
            Explore Games
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
