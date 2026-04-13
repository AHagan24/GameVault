import { createContext, useEffect, useState } from "react";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  function addFavorite(game) {
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
