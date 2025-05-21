import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Skeleton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    if (!movie) return null;

    const imageUrl = movie.poster_path && !imageError
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/placeholder.jpg';

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const releaseYear = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : 'N/A';

    const rating = movie.vote_average
        ? `${movie.vote_average.toFixed(1)} ⭐`
        : 'Not rated';

    return (
        <Card 
            sx={{ 
                maxWidth: 345, 
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
            }}
        >
            <CardActionArea onClick={() => navigate(`/movies/${movie.id}`)}>
                {imageLoading && (
                    <Skeleton
                        variant="rectangular"
                        height={450}
                        animation="wave"
                    />
                )}
                <CardMedia
                    component="img"
                    height="450"
                    image={imageUrl}
                    alt={movie.title || 'Movie poster'}
                    sx={{
                        objectFit: 'cover',
                        display: imageLoading ? 'none' : 'block',
                    }}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                />
                <CardContent>
                    <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="div" 
                        noWrap
                        title={movie.title}
                    >
                        {movie.title || 'Untitled'}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            {releaseYear}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {rating}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default MovieCard;
