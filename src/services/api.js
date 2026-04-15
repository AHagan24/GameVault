const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

const DEFAULT_BROWSE_QUERY = "Batman";
const DEFAULT_BROWSE_TERMS = [
  "Batman",
  "Inception",
  "Interstellar",
  "Harry Potter",
  "Spider-Man",
  "Jurassic Park",
  "Star Wars",
];
const DEFAULT_BROWSE_LIMIT = 12;
const DEFAULT_BROWSE_RESULTS_PER_TERM = 2;
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

function isAbortError(error) {
  return error?.name === "AbortError";
}

function isOmdbFailure(data) {
  return !data || data.Response === "False";
}

async function fetchFromOmdb(params, signal) {
  let response;

  try {
    response = await fetch(createUrl(params), { signal });
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new Error("Network error");
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

async function searchMoviesSafely(query, page, type, year, signal) {
  try {
    return await searchMovies(query, page, type, year, signal);
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }

    return [];
  }
}

async function fetchMovieDetailsSafely(imdbID, signal) {
  if (!imdbID) {
    return null;
  }

  try {
    return await fetchMovieDetails(imdbID, signal);
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }

    return null;
  }
}

async function hydrateMoviesWithDetails(movies, signal) {
  const validMovies = movies.filter((movie) => movie?.imdbID);

  const hydratedMovies = await Promise.all(
    validMovies.map(async (movie) => {
      try {
        const details = await fetchMovieDetailsSafely(movie.imdbID, signal);

        if (!details) {
          return movie;
        }

        return {
          ...movie,
          ...details,
        };
      } catch (error) {
        if (isAbortError(error)) {
          throw error;
        }

        return movie;
      }
    }),
  );

  return hydratedMovies.filter(Boolean);
}

export async function searchMoviesWithDetails(
  query,
  page = 1,
  type = "All",
  year = "",
  signal,
) {
  const movies = await searchMovies(query, page, type, year, signal);
  return hydrateMoviesWithDetails(movies, signal);
}

export async function searchMovies(
  query,
  page = 1,
  type = "All",
  year = "",
  signal,
) {
  const normalizedQuery = query?.trim() || DEFAULT_BROWSE_QUERY;
  const normalizedType = type && type !== "All" ? type : undefined;
  const normalizedYear = year?.trim() || undefined;
  const data = await fetchFromOmdb(
    {
      s: normalizedQuery,
      ...(normalizedType ? { type: normalizedType } : {}),
      ...(normalizedYear ? { y: normalizedYear } : {}),
      page: String(page),
    },
    signal,
  );

  if (isOmdbFailure(data)) {
    return [];
  }

  return Array.isArray(data.Search)
    ? data.Search.map(normalizeMovie).filter(Boolean).filter(hasValidPoster)
    : [];
}

export async function fetchDefaultMovies(
  { type = "All", year = "" } = {},
  signal,
) {
  const settledGroups = await Promise.allSettled(
    DEFAULT_BROWSE_TERMS.map(async (term) => {
      const movies = await searchMovies(term, 1, type, year, signal);

      return movies.map((movie) => ({
        ...movie,
        sourceTerm: term,
      }));
    }),
  );
  const groups = settledGroups
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  if (groups.length === 0) {
    const firstFailure = settledGroups.find(
      (result) => result.status === "rejected",
    );
    throw firstFailure?.reason || new Error("Network error");
  }

  const uniqueMovies = [];
  const seenIds = new Set();

  for (const movies of groups) {
    let pickedForTerm = 0;

    for (const movie of movies) {
      if (seenIds.has(movie.imdbID)) {
        continue;
      }

      uniqueMovies.push(movie);
      seenIds.add(movie.imdbID);
      pickedForTerm += 1;

      if (
        pickedForTerm === DEFAULT_BROWSE_RESULTS_PER_TERM ||
        uniqueMovies.length === DEFAULT_BROWSE_LIMIT
      ) {
        break;
      }
    }

    if (uniqueMovies.length === DEFAULT_BROWSE_LIMIT) {
      break;
    }
  }

  for (const movies of groups) {
    for (const movie of movies) {
      if (seenIds.has(movie.imdbID)) {
        continue;
      }

      uniqueMovies.push(movie);
      seenIds.add(movie.imdbID);

      if (uniqueMovies.length === DEFAULT_BROWSE_LIMIT) {
        break;
      }
    }

    if (uniqueMovies.length === DEFAULT_BROWSE_LIMIT) {
      break;
    }
  }

  return uniqueMovies
    .map(({ sourceTerm, ...movie }) => movie)
    .slice(0, DEFAULT_BROWSE_LIMIT);
}

export async function fetchMovieDetails(imdbID, signal) {
  if (!imdbID) {
    throw new Error("Movie not found!");
  }

  const data = await fetchFromOmdb(
    {
      i: imdbID,
      plot: "full",
    },
    signal,
  );

  if (isOmdbFailure(data)) {
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
      try {
        const movies = await searchMoviesSafely(term, 1, "movie", "", signal);

        return movies
          .filter(hasValidPoster)
          .slice(0, HOME_FEATURED_RESULTS_PER_TERM)
          .map((movie) => ({
            ...movie,
            sourceTerm: term,
          }));
      } catch (error) {
        if (isAbortError(error)) throw error;
        return []; // ← THIS IS THE FIX
      }
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
    HOME_FEATURED_TERMS.map(async (term) => {
      try {
        const movies = await searchMoviesSafely(term, 1, "movie", "", signal);

        return movies
          .filter(hasValidPoster)
          .slice(0, HOME_FEATURED_RESULTS_PER_TERM)
          .map((movie) => ({
            ...movie,
            sourceTerm: term,
          }));
      } catch (error) {
        if (isAbortError(error)) throw error;
        return []; // ← THIS IS THE FIX
      }
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
