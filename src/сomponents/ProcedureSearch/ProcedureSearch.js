import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ProcedureSearch.css';
import NavigationBar from '../NavigationBar/NavigationBar';
import Hollow from "../NavigationBar/Hollow";
import Footer from "../Footer/Footer";
import { Link } from 'react-router-dom';



const ProcedureSearch = () => {
    const location = useLocation();
    const [procedures, setProcedures] = useState([]);
    const [notFound, setNotFound] = useState(false);
  
    useEffect(() => {
      const query = new URLSearchParams(location.search);
      const name = query.get('name');
  
      fetch("https://localhost:7235/api/Procedure/search?SearchText=" + name)
        .then(response => response.json())
        .then(data => {
          if (data && data.value && data.value.items && data.value.items.length > 0) {
            setProcedures(data.value.items); // Устанавливаем найденные процедуры
            setNotFound(false);
          } else {
            setNotFound(true);
          }
        })
        .catch(error => {
          console.error('Error fetching procedure:', error);
          setNotFound(true);
        });
    }, [location.search]);
  
    if (notFound) {
      return (
        <div>
        <NavigationBar />
        <Hollow />
      <div className="proceduresSearch-container">
      <h1 style={{ textAlign: 'center', color: '#800000' }}>По вашему запросу ничего не найдено! </h1>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Попробуйте изменить ваш запрос или перейдите на другие вкладки.</h1>
      </div>
      <Footer />
    </div>);
    }
  
    return (
      <div className="proceduresSearch-container">
        <NavigationBar />
      <Hollow />
      <h1 style={{ textAlign: 'center', color: '#333' }}>Результаты поиска</h1>
        {
          procedures.map((procedure, index) => (
            <div key={index} className="proceduresSearch-card">
              <Link to={`/procedure/${procedure.id}`} className="proceduresSearch-link">
                <img src={procedure.picture} alt={procedure.name} style={{ width: '400px', height: '300px', objectFit: 'cover' }}  />
                <h2 className="proceduresSearch-name">{procedure.name}</h2>
                <p className="proceduresSearch-price">Цена - {procedure.price}</p>
              </Link>
            </div>
          ))
        }
        <Footer />
      </div>
    );
  };
  
  export default ProcedureSearch;
  