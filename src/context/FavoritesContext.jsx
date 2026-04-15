import { createContext, useEffect, useState } from "react";

export const FavoritesContext = createContext();

function normalizeFavorite(movie) {
  const imdbID = movie?.imdbID || movie?.id;

  if (!imdbID) {
    return null;
  }

  return {
    imdbID,
    Title: movie.Title || "Untitled movie",
    Year: movie.Year || "Unknown year",
    Poster: movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "",
    Type: movie.Type || "movie",
  };
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites");
      const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      return Array.isArray(parsedFavorites)
        ? parsedFavorites.map(normalizeFavorite).filter(Boolean)
        : [];
    } catch (error) {
      console.error("Failed to read favorites from localStorage.", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites to localStorage.", error);
    }
  }, [favorites]);

  function addFavorite(movie) {
    const normalizedMovie = normalizeFavorite(movie);

    if (!normalizedMovie) {
      return;
    }

    setFavorites((previousFavorites) => {
      const alreadyExists = previousFavorites.some(
        (favorite) => favorite.imdbID === normalizedMovie.imdbID,
      );

      if (alreadyExists) {
        return previousFavorites;
      }

      return [...previousFavorites, normalizedMovie];
    });
  }

  function removeFavorite(imdbID) {
    setFavorites((previousFavorites) =>
      previousFavorites.filter((favorite) => favorite.imdbID !== imdbID),
    );
  }

  function isFavorite(imdbID) {
    return favorites.some((favorite) => favorite.imdbID === imdbID);
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
