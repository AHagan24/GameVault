const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

if (!API_KEY) {
  console.error("Missing RAWG API key");
}

const BASE_URL = "https://api.rawg.io/api";

async function fetchFromApi(path, signal) {
  const response = await fetch(`${BASE_URL}${path}`, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchGames(signal) {
  const data = await fetchFromApi(`/games?key=${API_KEY}`, signal);
  return Array.isArray(data.results) ? data.results : [];
}

export async function fetchGameDetails(id, signal) {
  return fetchFromApi(`/games/${id}?key=${API_KEY}`, signal);
}

export async function fetchGameTrailers(id, signal) {
  const data = await fetchFromApi(`/games/${id}/movies?key=${API_KEY}`, signal);
  return data.results ?? [];
}

export async function fetchGameScreenshots(id, signal) {
  const data = await fetchFromApi(
    `/games/${id}/screenshots?key=${API_KEY}`,
    signal,
  );
  return data.results ?? [];
}

export async function fetchFeaturedGames(signal) {
  const data = await fetchFromApi(
    `/games?key=${API_KEY}&ordering=-added&page_size=5`,
    signal,
  );
  return Array.isArray(data.results) ? data.results : [];
}
