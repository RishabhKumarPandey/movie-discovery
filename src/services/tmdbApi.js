import axios from 'axios';

const TMDB_API_KEY = 'aaeed47574ca7855f61da350f63d9c86';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
    },
});

// Mood categories with corresponding genres
export const moodCategories = {
    'Feel Good': {
        genres: [35, 10751], // Comedy, Family
        description: 'Light-hearted and family-friendly movies'
    },
    'Action Fix': {
        genres: [28, 12], // Action, Adventure
        description: 'Action-packed and adventurous movies'
    },
    'Mind Benders': {
        genres: [9648, 53], // Mystery, Thriller
        description: 'Mind-bending mysteries and thrillers'
    },
};

export const getPopularMovies = async (page = 1) => {
    try {
        const response = await tmdbApi.get('/movie/popular', {
            params: { page },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const searchMovies = async (query, page = 1) => {
    try {
        const response = await tmdbApi.get('/search/movie', {
            params: {
                query,
                page,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const searchPeople = async (query, page = 1) => {
    try {
        const response = await tmdbApi.get('/search/person', {
            params: {
                query,
                page,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMoviesByMood = async (mood, page = 1) => {
    try {
        const { genres } = moodCategories[mood];
        const response = await tmdbApi.get('/discover/movie', {
            params: {
                with_genres: genres.join(','),
                sort_by: 'vote_average.desc',
                'vote_count.gte': 10, // Ensure good number of votes for quality results
                page,
                language: 'en-US',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPersonDetails = async (personId) => {
    try {
        const response = await tmdbApi.get(`/person/${personId}`, {
            params: {
                append_to_response: 'movie_credits',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMovieDetails = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}`, {
            params: {
                append_to_response: 'videos'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMovieCredits = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}/credits`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
