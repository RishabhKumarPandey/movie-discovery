import React, { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const MovieCard = React.lazy(() => import('./MovieCard'));

const LazyMovieCard = (props) => {
    return (
        <Suspense 
            fallback={
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        height: '300px',
                        width: '100%'
                    }}
                >
                    <CircularProgress />
                </Box>
            }
        >
            <MovieCard {...props} />
        </Suspense>
    );
};

export default LazyMovieCard;
