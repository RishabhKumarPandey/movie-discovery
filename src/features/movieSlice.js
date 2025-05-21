import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    getPopularMovies, 
    searchMovies, 
    getMovieDetails,
    searchPeople,
    getMoviesByMood,
    getPersonDetails
} from '../services/tmdbApi';

// Error handler utility
const handleAsyncError = (error) => {
    if (error.response) {
        return error.response.data.message || 'Server error';
    }
    return error.message || 'Network error';
};

// Async thunks
export const fetchPopularMovies = createAsyncThunk(
    'movies/fetchPopular',
    async (page, { rejectWithValue }) => {
        try {
            const response = await getPopularMovies(page);
            return response;
        } catch (error) {
            return rejectWithValue(handleAsyncError(error));
        }
    }
);

export const fetchMoviesBySearch = createAsyncThunk(
    'movies/search',
    async ({ query, page }, { rejectWithValue }) => {
        try {
            const response = await searchMovies(query, page);
            return response;
        } catch (error) {
            return rejectWithValue(handleAsyncError(error));
        }
    }
);

export const fetchPeopleBySearch = createAsyncThunk(
    'movies/searchPeople',
    async ({ query, page }, { rejectWithValue }) => {
        try {
            const response = await searchPeople(query, page);
            return response;
        } catch (error) {
            return rejectWithValue(handleAsyncError(error));
        }
    }
);

export const fetchMoviesByMood = createAsyncThunk(
    'movies/fetchByMood',
    async ({ mood, page }, { rejectWithValue }) => {
        try {
            const response = await getMoviesByMood(mood, page);
            return response;
        } catch (error) {
            return rejectWithValue(handleAsyncError(error));
        }
    }
);

export const fetchMovieDetails = createAsyncThunk(
    'movies/fetchDetails',
    async (movieId, { rejectWithValue }) => {
        try {
            const response = await getMovieDetails(movieId);
            return response;
        } catch (error) {
            return rejectWithValue(handleAsyncError(error));
        }
    }
);

export const fetchPersonDetails = createAsyncThunk(
    'movies/fetchPersonDetails',
    async (personId, { rejectWithValue }) => {
        try {
            const response = await getPersonDetails(personId);
            return response;
        } catch (error) {
            return rejectWithValue(handleAsyncError(error));
        }
    }
);

// Load watchlist from localStorage
const loadWatchlist = () => {
    try {
        const savedWatchlist = localStorage.getItem('movieWatchlist');
        return savedWatchlist ? JSON.parse(savedWatchlist) : [];
    } catch (error) {
        console.error('Error loading watchlist:', error);
        return [];
    }
};

const initialState = {
    movies: [],
    actors: [],
    selectedMovie: null,
    selectedPerson: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    searchQuery: '',
    hasMore: true,
    currentMood: null,
    searchType: 'movies', // 'movies' or 'people'
    lastUpdated: null,
    watchlist: loadWatchlist(),
};

const movieSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            if (!action.payload) {
                state.movies = [];
                state.actors = [];
                state.currentPage = 1;
                state.totalPages = 1;
            }
        },
        setSearchType: (state, action) => {
            state.searchType = action.payload;
            state.movies = [];
            state.actors = [];
            state.currentPage = 1;
            state.totalPages = 1;
            state.searchQuery = '';
        },
        clearSelectedMovie: (state) => {
            state.selectedMovie = null;
        },
        clearSelectedPerson: (state) => {
            state.selectedPerson = null;
        },
        setCurrentMood: (state, action) => {
            state.currentMood = action.payload;
            if (!action.payload) {
                state.movies = [];
                state.currentPage = 1;
                state.totalPages = 1;
            }
        },
        resetState: (state) => {
            const watchlist = state.watchlist; // Preserve watchlist
            return { ...initialState, watchlist };
        },
        addToWatchlist: (state, action) => {
            const movie = action.payload;
            if (!state.watchlist.some(m => m.id === movie.id)) {
                state.watchlist.push(movie);
                localStorage.setItem('movieWatchlist', JSON.stringify(state.watchlist));
            }
        },
        removeFromWatchlist: (state, action) => {
            const movieId = action.payload;
            state.watchlist = state.watchlist.filter(movie => movie.id !== movieId);
            localStorage.setItem('movieWatchlist', JSON.stringify(state.watchlist));
        },
    },
    extraReducers: (builder) => {
        // Helper functions for common state updates
        const handlePending = (state) => {
            state.loading = true;
            state.error = null;
        };

        const handleRejected = (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            state.lastUpdated = new Date().toISOString();
        };

        builder
            // Handle fetchPopularMovies
            .addCase(fetchPopularMovies.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                // Only clear movies if it's the first page
                if (action.meta.arg === 1) {
                    state.movies = [];
                }
            })
            .addCase(fetchPopularMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const newMovies = action.payload.results;
                if (action.payload.page === 1) {
                    state.movies = newMovies;
                } else {
                    state.movies = [...state.movies, ...newMovies];
                }
                state.currentPage = action.payload.page;
                state.totalPages = action.payload.total_pages;
                state.hasMore = action.payload.page < action.payload.total_pages;
                state.currentMood = null;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchPopularMovies.rejected, handleRejected)
            // Handle searchMovies
            .addCase(fetchMoviesBySearch.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                // Only clear movies if it's the first page
                if (action.meta.arg.page === 1) {
                    state.movies = [];
                }
            })
            .addCase(fetchMoviesBySearch.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const newMovies = action.payload.results;
                if (action.payload.page === 1) {
                    state.movies = newMovies;
                } else {
                    state.movies = [...state.movies, ...newMovies];
                }
                state.currentPage = action.payload.page;
                state.totalPages = action.payload.total_pages;
                state.hasMore = action.payload.page < action.payload.total_pages;
                state.currentMood = null;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchMoviesBySearch.rejected, handleRejected)
            // Handle fetchMovieDetails
            .addCase(fetchMovieDetails.pending, handlePending)
            .addCase(fetchMovieDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.selectedMovie = action.payload;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchMovieDetails.rejected, handleRejected)
            // Handle fetchPeopleBySearch
            .addCase(fetchPeopleBySearch.pending, handlePending)
            .addCase(fetchPeopleBySearch.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.actors = action.payload.results || [];
                state.currentPage = action.payload.page || 1;
                state.totalPages = action.payload.total_pages || 1;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchPeopleBySearch.rejected, handleRejected)
            // Handle fetchMoviesByMood
            .addCase(fetchMoviesByMood.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                // Only clear movies if it's the first page
                if (action.meta.arg.page === 1) {
                    state.movies = [];
                }
            })
            .addCase(fetchMoviesByMood.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const newMovies = action.payload.results;
                if (action.payload.page === 1) {
                    state.movies = newMovies;
                } else {
                    state.movies = [...state.movies, ...newMovies];
                }
                state.currentPage = action.payload.page;
                state.totalPages = action.payload.total_pages;
                state.hasMore = action.payload.page < action.payload.total_pages;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchMoviesByMood.rejected, handleRejected)
            // Handle fetchPersonDetails
            .addCase(fetchPersonDetails.pending, handlePending)
            .addCase(fetchPersonDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.selectedPerson = action.payload;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchPersonDetails.rejected, handleRejected)
    },
});

export const { 
    setSearchQuery, 
    setSearchType, 
    clearSelectedMovie,
    clearSelectedPerson,
    setCurrentMood,
    resetState,
    addToWatchlist,
    removeFromWatchlist,
} = movieSlice.actions;

export default movieSlice.reducer;
