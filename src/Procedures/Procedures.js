import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Procedures.css';
import NavigationBar from "../сomponents/NavigationBar/NavigationBar.js";
import Hollow from "../сomponents/NavigationBar/Hollow.js";
import Footer from "../сomponents/Footer/Footer.js";

const Procedures = () => {
  const [procedures, setProcedures] = useState([]);

  useEffect(() => {
    // URL на путь к API
    fetch('https://localhost:7235/api/Procedure')
      .then(response => response.json())
      .then(data => setProcedures(data.value))
      .catch(error => console.error('Error fetching procedures:', error));
  }, []);

  return (
    <div>
      <NavigationBar />
      <Hollow />
      <div className="procedures-container">
        <h1>Процедуры</h1>
        <div className="procedures-grid">
          {procedures.map(procedure => (
            <div key={procedure.id} className="procedure-card">
              <Link to={`/procedure/${procedure.id}`} className="procedure-link">
                <img src={procedure.picture} alt={procedure.name} style={{ width: '400px', height: '300px', 
                objectFit: 'cover' }}  />
                <h2 className="procedure-name">{procedure.name}</h2>
                <p className="procedure-price">Цена - {procedure.price}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />

    </div>
  );
};

export default Procedures;
