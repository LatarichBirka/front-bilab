import React from 'react';
import './Footer.css';
import addressLogo from './adresslogo.png'; 

const Footer = () => {
  return (
    <div className="footer">
    <div className="footer-address">
      <img src={addressLogo} className="address-logo" alt="Address Logo" />
      <span className="address-text">Слюдянка, ул. Ржанова, 9</span>
    </div>
    <div className="footer-contact">
      <span>Почта для связи с нами</span>
      <span className="contact-email">irinabirkina123@mail.ru</span>
    </div>
    <div className="footer-phone">
      <span className="phone-number">8 (950) 067 45 63</span>
    </div>
    <div className="footer-social">
      <a href="https://vk.com/id315373928" target="_blank" rel="noopener noreferrer">VK</a>
      <a href="https://wa.me/+79500890504" target="_blank" rel="noopener noreferrer">WhatsApp</a>
    </div>
  </div>
  );
};

export default Footer;
