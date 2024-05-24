import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './SpecialOffer.css';
import NavigationBar from "../сomponents/NavigationBar/NavigationBar.js";
import Hollow from "../сomponents/NavigationBar/Hollow.js";
import Footer from "../сomponents/Footer/Footer.js";

const SpecialOffer = () => {
  const [procedures, setProcedures] = useState([]);

  useEffect(() => {
    // URL на путь к API
    fetch('https://localhost:7235/sales')
      .then(response => response.json())
      .then(data => setProcedures(data.value))
      .catch(error => console.error('Error fetching procedures:', error));
  }, []);

  return (
    <div>
      <NavigationBar />
      <Hollow />
      <div className="specialoffer-container">
        <h1> Акции</h1>
        <div className="specialoffer-grid">
          {procedures.map(procedure => (
            <div key={procedure.id} className="specialoffer-card">
              <Link to={`/specialOffer/${procedure.id}`} className="specialoffer-link">
              <img src={procedure.picture} alt={procedure.name} style={{ width: '400px', height: '300px',
    objectFit: 'cover' }}  />
                <h2 className="specialoffer-name">{procedure.name}</h2>
                <p className="specialoffer-price">Цена - {procedure.newPrice}</p>
                <p className="specialoffer-price">{procedure.detail}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />

    </div>
  );
};

export default SpecialOffer;
