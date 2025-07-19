// MovieSearchBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';



export default function MovieSearchBar({setSelectedMovie}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);



   async  function  handleMovieClick(id){
    try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
        const data = await response.json();
        setSelectedMovie(data);
        setOpen(false);
        // setQuery('');
        setSuggestions([]);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
  }

  const fetchSuggestions = useRef(
    debounce(async q => {
      if (!q) {
        setSuggestions([]);
        return;
      }
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        // console.log('API Key:', apiKey);
        if (!apiKey) {
          console.error('API key is not defined');
          return;
        }
        const url = `https://api.themoviedb.org/3/search/movie`
                  + `?api_key=${apiKey}`
                  + `&query=${encodeURIComponent(q)}`
                  + `&page=1`;
  
        const res = await fetch(url);
        const movies = await res.json();
        setSuggestions(movies.results.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    }, 300)
  ).current;
  

  useEffect(() => {
    fetchSuggestions(query);
  }, [query, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = e => {
      if (!e.target.closest('.search-container')) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="search-container  relative w-75% ">
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onFocus={() => setOpen(true)}
        onChange={e => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        className="w-full px-3 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {open && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded max-h-56 overflow-y-auto shadow-lg z-50">
          {suggestions.map(movie => (
            <li
              key={movie.id}
              onClick={() => {
                handleMovieClick(movie.id);
                setQuery(movie.title);
                setOpen(false);
              }}
              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt=""
                  className="w-8 h-12 mr-3 rounded"
                />
              )}
              <div className="text-sm">
                <p className="font-medium text-gray-800">{movie.title}</p>
                <p className="text-gray-500">{(movie.release_date || '').slice(0, 4)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
