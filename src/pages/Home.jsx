import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import MovieCard from "../components/GameCard";
import SkeletonCard from "../components/SkeletonCard";
import SkeletonHero from "../components/SkeletonHero";
import { fetchFeaturedMovies, fetchPopularMovies } from "../services/api";

function Home() {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredError, setFeaturedError] = useState("");
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [popularError, setPopularError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadFeaturedMovies() {
      setFeaturedError("");

      try {
        const movies = await fetchFeaturedMovies(controller.signal);
        setFeaturedMovies(movies);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error(error);
        setFeaturedError("Failed to load featured movies.");
      } finally {
        if (!controller.signal.aborted) {
          setLoadingFeatured(false);
        }
      }
    }

    loadFeaturedMovies();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPopularMovies() {
      setPopularError("");

      try {
        const movies = await fetchPopularMovies(controller.signal);
        setPopularMovies(movies);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error(error);
        setPopularError("Failed to load popular movies.");
      } finally {
        if (!controller.signal.aborted) {
          setLoadingPopular(false);
        }
      }
    }

    loadPopularMovies();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (featuredMovies.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCurrentFeaturedIndex(
        (previousIndex) => (previousIndex + 1) % featuredMovies.length,
      );
    }, 4500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [featuredMovies]);

  if (loadingFeatured) {
    return (
      <>
        <SkeletonHero />

        <section className="home-section home-section-popular">
          <div className="home-section-header">
            <div>
              <p className="home-section-eyebrow">Browse</p>
              <h2>Popular Right Now</h2>
              <p className="home-section-copy">
                A quick look at standout movies worth adding to your watchlist.
              </p>
            </div>

            <Link to="/movies" className="home-section-link">
              Browse All Movies
            </Link>
          </div>

          <div className="games-grid games-grid-compact">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </section>
      </>
    );
  }

  if (featuredError) {
    return <section className="hero-status">{featuredError}</section>;
  }

  if (featuredMovies.length === 0) {
    return (
      <section className="hero-status">No featured movies available.</section>
    );
  }

  const featuredMovie =
    featuredMovies[currentFeaturedIndex] || featuredMovies[0];
  const featuredRating =
    featuredMovie.imdbRating && featuredMovie.imdbRating !== "N/A"
      ? featuredMovie.imdbRating
      : "No rating";
  const heroCopy = `Revisit a standout ${featuredMovie.Type || "movie"} from ${
    featuredMovie.Year || "the catalog"
  } and jump into the full details for cast, director, plot, and rating.`;

  return (
    <>
      <section
        className="hero-section"
        style={{
          backgroundImage: featuredMovie.Poster
            ? `linear-gradient(135deg, rgba(8, 10, 18, 0.72), rgba(8, 10, 18, 0.9)), url(${featuredMovie.Poster})`
            : "linear-gradient(135deg, rgba(31, 41, 55, 0.92), rgba(17, 24, 39, 0.98))",
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Featured Movie</p>
          <h1>{featuredMovie.Title}</h1>
          <p className="hero-copy">{heroCopy}</p>
          <div className="hero-meta">
            <span>Year: {featuredMovie.Year || "Unknown"}</span>
            <span>{`\u2B50 ${featuredRating}`}</span>
          </div>
          <Link to={`/movies/${featuredMovie.imdbID}`} className="hero-button">
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
              A quick look at standout movies worth adding to your watchlist.
            </p>
          </div>

          <Link to="/movies" className="home-section-link">
            Browse All Movies
          </Link>
        </div>

        {loadingPopular ? (
          <div className="games-grid games-grid-compact">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : popularError ? (
          <div className="games-empty-state">{popularError}</div>
        ) : popularMovies.length === 0 ? (
          <div className="games-empty-state">
            No popular movies are available right now.
          </div>
        ) : (
          <div className="games-grid games-grid-compact">
            {popularMovies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} variant="popular" />
            ))}
          </div>
        )}
      </section>

      <section className="home-section">
        <div className="home-section-header home-section-header-centered">
          <div>
            <p className="home-section-eyebrow">Why MovieVault</p>
            <h2>Everything you need for movie night</h2>
          </div>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-card-kicker">Discover Movies</span>
            <p>
              Search across the OMDb catalog, revisit classics, and find
              something worth watching in a few clicks.
            </p>
          </article>

          <article className="feature-card">
            <span className="feature-card-kicker">Save Favorites</span>
            <p>
              Keep your shortlist close so the movies you want to revisit are
              always easy to find.
            </p>
          </article>

          <article className="feature-card">
            <span className="feature-card-kicker">See Full Details</span>
            <p>
              Open a movie page for the plot, cast, runtime, genre, director,
              and IMDb rating in one place.
            </p>
          </article>
        </div>
      </section>

      <section className="home-cta-section">
        <div className="home-cta-card">
          <p className="home-section-eyebrow">Start Exploring</p>
          <h2>Ready to explore your next favorite movie?</h2>
          <p>
            Dive into the full catalog and find something worth watching
            tonight.
          </p>
          <Link to="/movies" className="hero-button">
            Explore Movies
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
