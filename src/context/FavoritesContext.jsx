import { createContext, useEffect, useState } from "react";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites");
      const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      return Array.isArray(parsedFavorites) ? parsedFavorites : [];
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

  function addFavorite(game) {
    if (!game?.id) {
      return;
    }

    setFavorites((prev) => {
      const alreadyExists = prev.some((item) => item.id === game.id);
      if (alreadyExists) return prev;
      return [...prev, game];
    });
  }

  function removeFavorite(gameId) {
    setFavorites((prev) => prev.filter((item) => item.id !== gameId));
  }

  function isFavorite(gameId) {
    return favorites.some((item) => item.id === gameId);
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
