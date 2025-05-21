import React, { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieDetailsPage.css';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Grid,
    Typography,
    Box,
    Button,
    CircularProgress,
    Paper,
    Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import { fetchMovieDetails, addToWatchlist, removeFromWatchlist } from '../features/movieSlice';

const MovieDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedMovie, loading, error, currentMood, watchlist } = useSelector((state) => state.movies);
    const isInWatchlist = watchlist.some(movie => movie.id === parseInt(id));
    const [imageLoaded, setImageLoaded] = useState(false);

    // const handleBack = useCallback(() => {
    //     if (currentMood) {
    //         // If we came from a mood-filtered list, go back to that mood
    //         const moodRoute = currentMood === 'Feel Good' ? 'feel-good' :
    //                         currentMood === 'Action Fix' ? 'action-fix' :
    //                         currentMood === 'Mind Benders' ? 'mind-bending' : '';
    //         navigate(`/movies/${moodRoute}`);
    //     } else {
    //         // Otherwise go back to home
    //         navigate('/');
    //     }
    // }, [navigate, currentMood]);

    
const handleBack = () => {
    navigate(-1)
}
useEffect(() => {
        dispatch(fetchMovieDetails(id));
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="loading-container">
                <CircularProgress size={60} />
                <Typography variant="h6" style={{ marginTop: 20 }}>
                    Loading movie details...
                </Typography>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div>Error: {error}</div>
                <button onClick={handleBack} className="back-button">
                    <ArrowBackIcon /> {currentMood ? 'Back to Results' : 'Back to Home'}
                </button>
            </div>
        );
    }

    if (!selectedMovie) return null;

    const backdropUrl = selectedMovie.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${selectedMovie.backdrop_path}`
        : null;

    const formatRuntime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="movie-details-container">
            {/* Hero Section with Backdrop */}
            <div 
                className="hero-backdrop"
                style={{
                    backgroundImage: `url(${backdropUrl})`
                }}
            />

            {/* Back Button */}
            <button onClick={handleBack} className="back-button">
                <ArrowBackIcon /> {currentMood ? 'Back to Results' : 'Back to Home'}
            </button>

            {/* Content Section */}
            <div className="details-paper">
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 300px) 1fr', gap: '40px' }}>
                    {/* Poster */}
                    <div>
                        <img
                            src={`https://image.tmdb.org/t/p/w342${selectedMovie.poster_path}`}
                            alt={selectedMovie.title}
                            loading="lazy"
                            onLoad={() => setImageLoaded(true)}
                            style={{
                                opacity: imageLoaded ? 1 : 0,
                                transition: 'opacity 0.3s ease-in-out'
                            }}
                            className="movie-poster"
                        />
                    </div>

                    {/* Details */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <h1 style={{ fontSize: '2.5rem', margin: 0 }}>
                                {selectedMovie.title}
                            </h1>
                            <Button
                                variant="contained"
                                color={isInWatchlist ? 'error' : 'primary'}
                                startIcon={isInWatchlist ? <BookmarkRemoveIcon /> : <BookmarkAddIcon />}
                                onClick={() => {
                                    if (isInWatchlist) {
                                        dispatch(removeFromWatchlist(selectedMovie.id));
                                    } else {
                                        dispatch(addToWatchlist(selectedMovie));
                                    }
                                }}
                            >
                                {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                            </Button>
                        </div>

                        {selectedMovie.tagline && (
                            <div className="tagline">
                                {selectedMovie.tagline}
                            </div>
                        )}

                        <div style={{ margin: '24px 0' }}>
                            {selectedMovie.genres.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="genre-chip"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <div style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px' }}>
                            {selectedMovie.overview}
                        </div>

                        <div className="movie-info">
                            <div>
                                <strong>Release Date:</strong>
                                {new Date(selectedMovie.release_date).toLocaleDateString()}
                            </div>
                            <div>
                                <strong>Rating:</strong>
                                {selectedMovie.vote_average.toFixed(1)}/10
                                ({selectedMovie.vote_count.toLocaleString()} votes)
                            </div>
                            <div>
                                <strong>Runtime:</strong>
                                {formatRuntime(selectedMovie.runtime)}
                            </div>
                        </div>

                        {/* Movie Trailer Section */}
                        {selectedMovie.videos && selectedMovie.videos.results && selectedMovie.videos.results.length > 0 && (
                            <div style={{ marginTop: '40px' }}>
                                <h2 style={{ marginBottom: '20px' }}>Trailer</h2>
                                <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
                                    <iframe
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                        src={`https://www.youtube.com/embed/${selectedMovie.videos.results[0].key}`}
                                        title="Movie Trailer"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
