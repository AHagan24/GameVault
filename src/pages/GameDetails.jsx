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
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);

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

  useEffect(() => {
    async function loadTrailers() {
      setTrailersLoading(true);
      setTrailersError("");
      setTrailers([]);

      try {
        const data = await fetchGameTrailers(id);
        setTrailers(data);
      } catch (err) {
        console.error(err);
        setTrailersError("Failed to load trailers.");
      } finally {
        setTrailersLoading(false);
      }
    }

    loadTrailers();
  }, [id]);

  useEffect(() => {
    if (trailersLoading || trailers.length > 0) {
      return;
    }

    async function loadScreenshots() {
      setScreenshotsLoading(true);
      setScreenshotsError("");
      setScreenshots([]);

      try {
        const data = await fetchGameScreenshots(id);
        setScreenshots(data);
      } catch (err) {
        console.error(err);
        setScreenshotsError("Failed to load screenshots.");
      } finally {
        setScreenshotsLoading(false);
      }
    }

    loadScreenshots();
  }, [id, trailers, trailersLoading]);

  if (loading) return <SkeletonDetails />;
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
    <div className="game-details-page">
      <h1>{game.name}</h1>

      {game.background_image && (
        <img
          src={game.background_image}
          alt={game.name}
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

      <p className="game-details-description">{game.description_raw}</p>

      <section className="trailers-section">
        <div className="trailers-section-header">
          <h2>{trailers.length > 0 ? "Trailers" : "Screenshots"}</h2>
        </div>

        {trailersLoading ? (
          <p className="trailers-status">Loading trailers...</p>
        ) : trailers.length > 0 ? (
          <div className="trailers-grid">
            {trailers.map((trailer) => {
              const videoSrc = trailer.data?.max || trailer.data?.["480"];

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
                      alt={trailer.name || `${game.name} trailer`}
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
                  alt={`${game.name} screenshot`}
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
