const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

const DEFAULT_BROWSE_QUERY = "Batman";
const HOME_FEATURED_TERMS = [
  "Batman",
  "Harry Potter",
  "Star Wars",
  "Spider-Man",
  "Jurassic Park",
  "Inception",
  "Interstellar",
  "The Matrix",
];
const HOME_FEATURED_RESULTS_PER_TERM = 4;
const HOME_FEATURED_LIMIT = 6;
const HOME_POPULAR_TERMS = [
  "Batman",
  "Harry Potter",
  "Star Wars",
  "Spider-Man",
  "Jurassic Park",
  "Inception",
];
const HOME_POPULAR_RESULTS_PER_TERM = 4;
const HOME_POPULAR_LIMIT = 3;

if (!API_KEY) {
  console.error("Missing OMDb API key");
}

function createUrl(params) {
  const searchParams = new URLSearchParams({
    apikey: API_KEY ?? "",
    ...params,
  });

  return `${BASE_URL}?${searchParams.toString()}`;
}

function cleanField(value, fallback = "") {
  if (!value || value === "N/A") {
    return fallback;
  }

  return value;
}

function normalizeMovie(movie) {
  if (!movie?.imdbID) {
    return null;
  }

  return {
    ...movie,
    imdbID: movie.imdbID,
    Title: cleanField(movie.Title, "Untitled movie"),
    Year: cleanField(movie.Year, "Unknown year"),
    Poster: cleanField(movie.Poster, ""),
    Type: cleanField(movie.Type, "movie"),
    Plot: cleanField(movie.Plot, "No plot available yet."),
    Genre: cleanField(movie.Genre, "Not available"),
    Director: cleanField(movie.Director, "Not available"),
    Actors: cleanField(movie.Actors, "Not available"),
    Runtime: cleanField(movie.Runtime, "Not available"),
    imdbRating: cleanField(movie.imdbRating, "Not rated"),
  };
}

function hasValidPoster(movie) {
  return Boolean(movie?.Poster) && movie.Poster !== "N/A";
}

async function fetchFromOmdb(params, signal) {
  const response = await fetch(createUrl(params), { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

async function hydrateMoviesWithDetails(movies, signal) {
  return Promise.all(
    movies.map(async (movie) => {
      try {
        const details = await fetchMovieDetails(movie.imdbID, signal);
        return {
          ...movie,
          ...details,
        };
      } catch (error) {
        if (error.name === "AbortError") {
          throw error;
        }

        return movie;
      }
    }),
  );
}

export async function searchMovies(query, page = 1, signal) {
  const normalizedQuery = query?.trim() || DEFAULT_BROWSE_QUERY;
  const data = await fetchFromOmdb(
    {
      s: normalizedQuery,
      type: "movie",
      page: String(page),
    },
    signal,
  );

  if (data.Response === "False") {
    if (data.Error === "Movie not found!") {
      return [];
    }

    throw new Error(data.Error || "OMDb search failed");
  }

  return Array.isArray(data.Search)
    ? data.Search.map(normalizeMovie).filter(Boolean)
    : [];
}

export async function fetchMovieDetails(imdbID, signal) {
  const data = await fetchFromOmdb(
    {
      i: imdbID,
      plot: "full",
    },
    signal,
  );

  if (data.Response === "False") {
    throw new Error(data.Error || "Movie details request failed");
  }

  const movie = normalizeMovie(data);

  if (!movie) {
    throw new Error("Movie not found!");
  }

  return movie;
}

export async function fetchFeaturedMovies(signal) {
  const groups = await Promise.all(
    HOME_FEATURED_TERMS.map(async (term) => {
      const movies = await searchMovies(term, 1, signal);

      return movies
        .filter(hasValidPoster)
        .slice(0, HOME_FEATURED_RESULTS_PER_TERM)
        .map((movie) => ({
          ...movie,
          sourceTerm: term,
        }));
    }),
  );

  const selectedMovies = [];
  const selectedIds = new Set();
  const selectedTerms = new Set();

  for (const movies of groups) {
    const movie = movies.find(
      (candidate) =>
        !selectedIds.has(candidate.imdbID) &&
        !selectedTerms.has(candidate.sourceTerm),
    );

    if (!movie) {
      continue;
    }

    selectedMovies.push(movie);
    selectedIds.add(movie.imdbID);
    selectedTerms.add(movie.sourceTerm);

    if (selectedMovies.length === HOME_FEATURED_LIMIT) {
      break;
    }
  }

  for (const movie of groups.flat()) {
    if (selectedMovies.length === HOME_FEATURED_LIMIT) {
      break;
    }

    if (selectedIds.has(movie.imdbID)) {
      continue;
    }

    selectedMovies.push(movie);
    selectedIds.add(movie.imdbID);
  }

  const curatedMovies = selectedMovies
    .map(({ sourceTerm, ...movieData }) => movieData)
    .slice(0, HOME_FEATURED_LIMIT);

  return hydrateMoviesWithDetails(curatedMovies, signal);
}

export async function fetchPopularMovies(signal) {
  const groups = await Promise.all(
    HOME_POPULAR_TERMS.map(async (term) => {
      const movies = await searchMovies(term, 1, signal);

      return movies
        .filter(hasValidPoster)
        .slice(0, HOME_POPULAR_RESULTS_PER_TERM)
        .map((movie) => ({
          ...movie,
          sourceTerm: term,
        }));
    }),
  );

  const selectedMovies = [];
  const selectedIds = new Set();
  const selectedTerms = new Set();

  for (const movies of groups) {
    const movie = movies.find(
      (candidate) =>
        !selectedIds.has(candidate.imdbID) &&
        !selectedTerms.has(candidate.sourceTerm),
    );

    if (!movie) {
      continue;
    }

    selectedMovies.push(movie);
    selectedIds.add(movie.imdbID);
    selectedTerms.add(movie.sourceTerm);

    if (selectedMovies.length === HOME_POPULAR_LIMIT) {
      break;
    }
  }

  for (const movie of groups.flat()) {
    if (selectedIds.has(movie.imdbID)) {
      continue;
    }

    selectedMovies.push(movie);
    selectedIds.add(movie.imdbID);

    if (selectedMovies.length === HOME_POPULAR_LIMIT) {
      break;
    }
  }

  const curatedMovies = selectedMovies
    .map(({ sourceTerm, ...movieData }) => movieData)
    .slice(0, HOME_POPULAR_LIMIT);

  return hydrateMoviesWithDetails(curatedMovies, signal);
}
