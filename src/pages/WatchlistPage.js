import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    Box,
} from '@mui/material';
import { removeFromWatchlist } from '../features/movieSlice';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const WatchlistPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { watchlist } = useSelector((state) => state.movies);

    if (watchlist.length === 0) {
        return (
            <Container>
                <Box sx={{ textAlign: 'center', my: 8 }}>
                    <Typography variant="h4" gutterBottom>
                        Your watchlist is empty
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        Start adding movies you want to watch later!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(-1)}
                        sx={{ mt: 2 }}
                    >
                        Browse Movies
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIosNewIcon />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
                <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
                    My Watchlist
                </Typography>
            </Box>
            <Grid container spacing={3}>
                {watchlist.map((movie) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                sx={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/movies/${movie.id}`)}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    {movie.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {movie.release_date?.split('-')[0]}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<BookmarkRemoveIcon />}
                                    onClick={() => dispatch(removeFromWatchlist(movie.id))}
                                    sx={{ mt: 2 }}
                                    fullWidth
                                >
                                    Remove
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default WatchlistPage;
