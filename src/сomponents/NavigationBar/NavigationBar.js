import React, { useState } from 'react';
import './NavigationBar.css'; 
import SearchBar from '../SearchBar/SearchBar'
import logo from './logo.png';
import search from '../SearchBar/search.png';
import { jwtDecode } from 'jwt-decode';

import { Link, useHistory } from 'react-router-dom';

const NavigationBar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const history = useHistory();

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Переход на страницу детали процедуры с передачей поискового запроса
    history.push(`/procedure-search?name=${query}`);
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.role;
        
        if (role === 'Admin') {
          history.push('/admin-profile');
        } else if (role === 'Employee') {
          history.push('/employee-profile');
        } else {
          history.push('/user-profile');
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        history.push('/sign-in');
      }
    } else {
      history.push('/sign-in');
    }
  };

  return (
    <div className="navigation-bar">
      <Link to="/" className="logo">
        <img src={logo} className="logo-image" alt="Logo" />
        <span className="logo-text">B.I.Lab - Центр Косметологии</span>
      </Link>
      <div className="menu">
      <Link to="/procedures">Процедуры</Link>
        <Link to="/specialOffer">Акции</Link>
        <Link to="/employee">Специалисты</Link>
        <Link to="/about">О нас</Link>
      </div>
      <div className="contacts">
      <span className="profile-link" onClick={handleProfileClick}>Личный кабинет</span>
      
      <span className="search-icon" onClick={() => setShowSearch(!showSearch)}>
          <img src={search} alt="Search" />
        </span>
      </div>
      {showSearch && (
        <div className="search-modal">
          <div className="search-modal-content">
            <span className="close-button" onClick={() => setShowSearch(false)}>&times;</span>
            <h2>Поиск</h2>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      )}
    </div>
    

  );
};

export default NavigationBar;
