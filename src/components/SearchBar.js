import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, InputBase, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { 
    setSearchQuery, 
    fetchMoviesBySearch, 
    fetchPeopleBySearch,
    fetchPopularMovies,
    setCurrentMood
} from '../features/movieSlice';

const SearchBar = () => {
    const dispatch = useDispatch();
    const { searchType, searchQuery } = useSelector((state) => state.movies);
    const [localQuery, setLocalQuery] = useState(searchQuery || '');
    const [isTyping, setIsTyping] = useState(false);

    const handleSearch = useCallback((e) => {
        if (e) e.preventDefault();
        const query = localQuery.trim();
        
        // Don't perform a new search if the query is empty
        if (!query) {
            handleClear();
            return;
        }

        // Don't perform a new search if the query hasn't changed
        if (query === searchQuery) return;

        setIsTyping(false);
        dispatch(setSearchQuery(query));
        dispatch(setCurrentMood(null));

        try {
            if (searchType === 'movies') {
                dispatch(fetchMoviesBySearch({ query, page: 1 }));
            } else {
                dispatch(fetchPeopleBySearch({ query, page: 1 }));
            }
        } catch (error) {
            console.error('Search failed:', error);
        }
    }, [dispatch, localQuery, searchQuery, searchType]);

    // Update localQuery when searchQuery changes
    useEffect(() => {
        setLocalQuery(searchQuery || '');
    }, [searchQuery]);

    const handleClear = useCallback(() => {
        setLocalQuery('');
        setIsTyping(false);
        dispatch(setSearchQuery(''));
        dispatch(setCurrentMood(null));
        dispatch(fetchPopularMovies(1));
    }, [dispatch]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Escape') {
            handleClear();
        } else if (e.key === 'Enter') {
            handleSearch(e);
        }
    }, [handleClear, handleSearch]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLocalQuery(value);
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSearch}
            sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: 600,
                margin: '20px auto',
                boxShadow: 2,
                transition: 'box-shadow 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: 3,
                },
            }}
        >
            <Box sx={{ position: 'relative', width: '100%' }}>
                <InputBase
                    sx={{ ml: 1, flex: 1, width: '100%' }}
                    placeholder={`Search for ${searchType === 'movies' ? 'movies' : 'actors'}...`}
                    value={localQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    autoFocus
                    inputProps={{
                        'aria-label': `Search for ${searchType === 'movies' ? 'movies' : 'actors'}`,
                        spellCheck: 'false',
                    }}
                />
            </Box>
            {localQuery && (
                <IconButton
                    onClick={handleClear}
                    sx={{ p: '10px' }}
                    aria-label="clear search"
                >
                    <ClearIcon />
                </IconButton>
            )}
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
    );
};

export default SearchBar;
