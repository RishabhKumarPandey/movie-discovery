import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Skeleton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ActorCard = ({ actor }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    if (!actor) return null;

    const imageUrl = actor.profile_path && !imageError
        ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
        : '/placeholder-person.jpg';

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const knownFor = actor.known_for
        ? actor.known_for
            .filter(item => item && (item.title || item.name))
            .map(item => item.title || item.name)
            .slice(0, 3)
            .join(', ')
        : 'No known works';

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
            <CardActionArea onClick={() => navigate(`/person/${actor.id}`)}>
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
                    alt={actor.name || 'Actor profile'}
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
                        title={actor.name}
                    >
                        {actor.name || 'Unknown Actor'}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.2,
                                height: '2.4em',
                            }}
                            title={knownFor}
                        >
                            Known for: {knownFor}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ActorCard;
