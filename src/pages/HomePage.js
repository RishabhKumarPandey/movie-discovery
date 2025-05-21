import React, { useEffect, useCallback, useRef } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Grid,
    Container,
    Typography,
    Box,
    Pagination,
    CircularProgress,
    Button,
    Paper,
    Tabs,
    Tab,
} from '@mui/material';
import LazyMovieCard from '../components/LazyMovieCard';
import SearchBar from '../components/SearchBar';
import ActorCard from '../components/ActorCard';
import { 
    fetchPopularMovies,
    fetchMoviesBySearch,
    fetchPeopleBySearch,
    fetchMoviesByMood,
    setSearchQuery,
    setSearchType,
    setCurrentMood,
    resetState
} from '../features/movieSlice';
import { moodCategories } from '../services/tmdbApi';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        movies,
        actors,
        loading,
        error,
        currentPage,
        totalPages,
        searchQuery,
        searchType,
        currentMood
    } = useSelector((state) => state.movies);

    useEffect(() => {
        // Set initial search type
        dispatch(setSearchType('movies'));
        
        // Get mood from URL if present
        const path = window.location.pathname;
        const match = path.match(/\/movies\/(.+)/);
        if (match) {
            const routeMood = match[1];
            // Convert URL format back to mood name
            if (routeMood === 'feel-good') {
                dispatch(setCurrentMood('Feel Good'));
                dispatch(fetchMoviesByMood({ mood: 'Feel Good', page: 1 }));
            } else if (routeMood === 'action-fix') {
                dispatch(setCurrentMood('Action Fix'));
                dispatch(fetchMoviesByMood({ mood: 'Action Fix', page: 1 }));
            } else if (routeMood === 'mind-bending') {
                dispatch(setCurrentMood('Mind Benders'));
                dispatch(fetchMoviesByMood({ mood: 'Mind Benders', page: 1 }));
            }
            return;
        }
        
        // Fetch popular movies only if no search or mood is active
        if (!searchQuery && !currentMood) {
            dispatch(fetchPopularMovies(1));
        }
    }, [dispatch, searchQuery, currentMood]);

    const observer = useRef();
    const lastMovieElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && currentPage < totalPages) {
                const nextPage = currentPage + 1;
                if (searchQuery) {
                    if (searchType === 'movies') {
                        dispatch(fetchMoviesBySearch({ query: searchQuery, page: nextPage }));
                    } else {
                        dispatch(fetchPeopleBySearch({ query: searchQuery, page: nextPage }));
                    }
                } else if (currentMood) {
                    dispatch(fetchMoviesByMood({ mood: currentMood, page: nextPage }));
                } else {
                    dispatch(fetchPopularMovies(nextPage));
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, currentPage, totalPages, searchQuery, searchType, currentMood]);

    const handlePageChange = (event, value) => {
        if (searchQuery) {
            if (searchType === 'movies') {
                dispatch(fetchMoviesBySearch({ query: searchQuery, page: value }));
            } else {
                dispatch(fetchPeopleBySearch({ query: searchQuery, page: value }));
            }
        } else if (currentMood) {
            dispatch(fetchMoviesByMood({ mood: currentMood, page: value }));
        } else {
            dispatch(fetchPopularMovies(value));
        }
    };

    const handleMoodSelect = (mood) => {
        // Set the current mood in Redux
        dispatch(setCurrentMood(mood));
        
        // Update the URL based on mood
        const urlPath = mood === 'Feel Good' ? 'feel-good' :
                       mood === 'Action Fix' ? 'action-fix' :
                       mood === 'Mind Benders' ? 'mind-bending' : '';
        
        if (urlPath) {
            navigate(`/movies/${urlPath}`);
            // Fetch movies for the selected mood
            dispatch(fetchMoviesByMood({ mood: mood, page: 1 }));
        }
    };

    const handleClearFilters = () => {
        dispatch(resetState());
        dispatch(fetchPopularMovies(1));
    };

    const handleSearchTypeChange = (event, newValue) => {
        dispatch(setSearchType(newValue));
        if (searchQuery) {
            if (newValue === 'movies') {
                dispatch(fetchMoviesBySearch({ query: searchQuery, page: 1 }));
            } else {
                dispatch(fetchPeopleBySearch({ query: searchQuery, page: 1 }));
            }
        }
    };

    // Only show full page loader for initial load
    if (loading && (!movies || movies.length === 0)) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ my: 4, textAlign: 'center' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ my: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="error" gutterBottom>
                        Error: {error}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClearFilters}
                        sx={{ mt: 2, mr: 2 }}
                    >
                        Return to Popular Movies
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                    >
                        Try Again
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        sx={{
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #1976d2, #dc004e)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Movie Discovery
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<BookmarkIcon />}
                        onClick={() => navigate('/watchlist')}
                    >
                        My Watchlist
                    </Button>
                </Box>
                <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ color: 'text.secondary' }}
                >
                    Discover movies based on your mood
                </Typography>

                {!searchQuery && !currentMood && (
                    <Box my={4}>
                        <Typography variant="h5" gutterBottom textAlign="center">
                            What's your mood today?
                        </Typography>
                        <Grid container spacing={2} justifyContent="center">
                            {['Feel Good', 'Action Fix', 'Mind Benders'].map((mood) => (
                                <Grid item key={mood}>
                                    <Button
                                        variant={currentMood === mood ? 'contained' : 'outlined'}
                                        color="primary"
                                        size="large"
                                        onClick={() => handleMoodSelect(mood)}
                                    >
                                        {mood}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                <Paper elevation={0} sx={{ my: 4 }}>
                    <SearchBar />
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Tabs
                            value={searchType}
                            onChange={handleSearchTypeChange}
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            <Tab value="movies" label="Movies" />
                        </Tabs>
                    </Box>
                </Paper>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                    {(currentMood || searchQuery) && (
                        <Button
                            variant="outlined"
                            onClick={() => {
                                dispatch(resetState());
                                dispatch(fetchPopularMovies(1));
                                navigate('/');
                            }}
                            startIcon={<ArrowBackIcon />}
                        >
                            Back to Home
                        </Button>
                    )}
                    <Typography variant="h5" component="h2">
                        {currentMood
                            ? `${currentMood} Movies`
                            : searchQuery
                            ? `Search Results for "${searchQuery}"`
                            : 'Popular Movies'}
                    </Typography>
                </Box>

                {searchType === 'movies' && movies.length === 0 && (
                    <Typography textAlign="center" mt={4}>
                        No movies found
                    </Typography>
                )}

                {searchType === 'people' && actors.length === 0 && (
                    <Typography textAlign="center" mt={4}>
                        No actors found
                    </Typography>
                )}

                <Grid container spacing={3} sx={{ mt: 4 }}>
                    {searchType === 'movies'
                        ? movies.map((movie, index) => (
                            <Grid 
                                item 
                                xs={12} 
                                sm={6} 
                                md={4} 
                                lg={3} 
                                key={movie.id}
                                ref={index === movies.length - 1 ? lastMovieElementRef : null}
                            >
                                <LazyMovieCard movie={movie} />
                            </Grid>
                        ))
                        : actors.map((actor) => (
                            actor && (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={actor.id}>
                                    <ActorCard actor={actor} />
                                </Grid>
                            )
                        ))}
                </Grid>

                {(movies.length > 0 || actors.length > 0) && (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Pagination
                            count={Math.min(totalPages, 500)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default HomePage;
