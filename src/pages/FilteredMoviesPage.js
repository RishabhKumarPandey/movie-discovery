import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Grid,
    Typography,
    Box,
    Pagination,
    CircularProgress,
    IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MovieCard from '../components/MovieCard';
import {
    fetchMoviesByMood,
    resetState,
} from '../features/movieSlice';

const FilteredMoviesPage = () => {
    const { mood } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        movies,
        loading,
        error,
        currentPage,
        totalPages,
    } = useSelector((state) => state.movies);

    const moodTitles = {
        'feel-good': 'Feel Good Movies',
        'action-fix': 'Action Fix Movies',
        'mind-benders': 'Mind Bending Movies'
    };

    useEffect(() => {
        dispatch(fetchMoviesByMood({ mood: moodTitles[mood].split(' ')[0] + ' ' + moodTitles[mood].split(' ')[1], page: 1 }));
        
        // Cleanup when unmounting
        return () => {
            dispatch(resetState());
        };
    }, [dispatch, mood]);

    const handlePageChange = (event, value) => {
        dispatch(fetchMoviesByMood({ 
            mood: moodTitles[mood].split(' ')[0] + ' ' + moodTitles[mood].split(' ')[1], 
            page: value 
        }));
    };

    const handleBack = () => {
        dispatch(resetState());
        navigate('/');
    };

    if (loading) {
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
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <IconButton 
                        onClick={handleBack}
                        sx={{ mr: 2 }}
                        aria-label="back to home"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1">
                        {moodTitles[mood]}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {movies.map((movie) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                            <MovieCard movie={movie} />
                        </Grid>
                    ))}
                </Grid>

                {totalPages > 1 && (
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            count={totalPages}
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

export default FilteredMoviesPage;
