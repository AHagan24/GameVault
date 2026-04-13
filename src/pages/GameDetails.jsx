import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SkeletonDetails from "../components/SkeletonDetails";
import { FavoritesContext } from "../context/FavoritesContext";
import {
  fetchGameDetails,
  fetchGameScreenshots,
  fetchGameTrailers,
} from "../services/api";

function GameDetails() {
  const { id } = useParams();
  const { addFavorite, removeFavorite, isFavorite } =
    useContext(FavoritesContext);

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trailers, setTrailers] = useState([]);
  const [trailersLoading, setTrailersLoading] = useState(true);
  const [trailersError, setTrailersError] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const [screenshotsLoading, setScreenshotsLoading] = useState(false);
  const [screenshotsError, setScreenshotsError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadGame() {
      setLoading(true);
      setError("");
      setGame(null);

      try {
        const data = await fetchGameDetails(id, controller.signal);
        setGame(data);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        console.error(err);
        setError("Failed to load game.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadGame();

    return () => {
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTrailers() {
      setTrailersLoading(true);
      setTrailersError("");
      setTrailers([]);

      try {
        const data = await fetchGameTrailers(id, controller.signal);
        setTrailers(data);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        console.error(err);
        setTrailersError("Failed to load trailers.");
      } finally {
        if (!controller.signal.aborted) {
          setTrailersLoading(false);
        }
      }
    }

    loadTrailers();

    return () => {
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    if (trailersLoading || trailers.length > 0) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadScreenshots() {
      setScreenshotsLoading(true);
      setScreenshotsError("");
      setScreenshots([]);

      try {
        const data = await fetchGameScreenshots(id, controller.signal);
        setScreenshots(data);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        console.error(err);
        setScreenshotsError("Failed to load screenshots.");
      } finally {
        if (!controller.signal.aborted) {
          setScreenshotsLoading(false);
        }
      }
    }

    loadScreenshots();

    return () => {
      controller.abort();
    };
  }, [id, trailers, trailersLoading]);

  if (loading) return <SkeletonDetails />;
  if (error) return <section className="hero-status">{error}</section>;
  if (!game) return <section className="hero-status">No game found.</section>;

  const favorite = isFavorite(game.id);
  const title = game.name || "Untitled game";
  const rating =
    typeof game.rating === "number" ? game.rating.toFixed(1) : "Not rated";
  const releaseDate = game.released || "TBA";
  const genres =
    game.genres
      ?.map((genre) => genre?.name)
      .filter(Boolean)
      .join(", ") || "Not available";
  const platforms =
    game.platforms
      ?.map((platform) => platform?.platform?.name)
      .filter(Boolean)
      .join(", ") || "Not available";
  const description = game.description_raw || "No description available yet.";

  function handleFavoriteClick() {
    if (favorite) {
      removeFavorite(game.id);
      return;
    }

    addFavorite(game);
  }

  return (
    <div className="game-details-page">
      <h1>{title}</h1>

      {game.background_image && (
        <img
          src={game.background_image}
          alt={title}
          className="game-details-hero"
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
        <strong>Rating:</strong> {rating}
      </p>
      <p>
        <strong>Released:</strong> {releaseDate}
      </p>

      <p>
        <strong>Genres:</strong> {genres}
      </p>

      <p>
        <strong>Platforms:</strong> {platforms}
      </p>

      <p className="game-details-description">{description}</p>

      <section className="trailers-section">
        <div className="trailers-section-header">
          <h2>{trailers.length > 0 ? "Trailers" : "Screenshots"}</h2>
        </div>

        {trailersLoading ? (
          <p className="trailers-status">Loading trailers...</p>
        ) : trailers.length > 0 ? (
          <div className="trailers-grid">
            {trailers.map((trailer) => {
              const videoSrc =
                trailer.data?.max ||
                trailer.data?.["480"] ||
                trailer.data?.["preview"];

              return (
                <article key={trailer.id} className="trailer-card">
                  {videoSrc ? (
                    <video
                      className="trailer-video"
                      controls
                      preload="metadata"
                      poster={trailer.preview}
                    >
                      <source src={videoSrc} type="video/mp4" />
                      Your browser does not support video playback.
                    </video>
                  ) : trailer.preview ? (
                    <img
                      src={trailer.preview}
                      alt={trailer.name || `${title} trailer`}
                      className="trailer-video"
                    />
                  ) : null}

                  <div className="trailer-card-content">
                    <h3>{trailer.name || "Official Trailer"}</h3>
                    {videoSrc ? (
                      <a
                        href={videoSrc}
                        target="_blank"
                        rel="noreferrer"
                        className="trailer-link"
                      >
                        Open trailer
                      </a>
                    ) : (
                      <p className="trailers-status">Preview unavailable.</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : screenshotsLoading ? (
          <p className="trailers-status">Loading screenshots...</p>
        ) : screenshots.length > 0 ? (
          <div className="screenshots-grid">
            {screenshots.map((screenshot) => (
              <article key={screenshot.id} className="screenshot-card">
                <img
                  src={screenshot.image}
                  alt={`${title} screenshot`}
                  className="screenshot-image"
                />
              </article>
            ))}
          </div>
        ) : (
          <p className="trailers-status">
            {trailersError || screenshotsError
              ? "No trailers or screenshots available for this game right now."
              : "No trailers or screenshots available for this game."}
          </p>
        )}
      </section>
    </div>
  );
}

export default GameDetails;
