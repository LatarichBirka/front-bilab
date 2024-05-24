import React, { useState } from 'react';
import './SearchBar.css';
import search from './search.png';

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
  
    const handleSearch = () => {
      onSearch(searchQuery);
    };
  
    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Поиск по сайту"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>
          <img src={search} alt="Search" />
        </button>
      </div>
    );
  };
  
  export default SearchBar;
