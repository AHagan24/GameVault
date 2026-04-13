const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export async function fetchGames() {
  const response = await fetch(`${BASE_URL}/games?key=${API_KEY}`);

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  const data = await response.json();
  return data.results;
}

export async function fetchGameDetails(id) {
  const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);

  if (!response.ok) {
    throw new Error("Failed to fetch game details");
  }

  const data = await response.json();
  return data;
}

export async function fetchGameTrailers(id) {
  const response = await fetch(`${BASE_URL}/games/${id}/movies?key=${API_KEY}`);

  if (!response.ok) {
    throw new Error("Failed to fetch game trailers");
  }

  const data = await response.json();
  return data.results ?? [];
}

export async function fetchGameScreenshots(id) {
  const response = await fetch(
    `${BASE_URL}/games/${id}/screenshots?key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch game screenshots");
  }

  const data = await response.json();
  return data.results ?? [];
}

export async function fetchFeaturedGames() {
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&ordering=-added&page_size=5`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch featured games");
  }

  const data = await response.json();
  return data.results;
}
