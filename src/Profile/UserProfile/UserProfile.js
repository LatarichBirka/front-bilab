import React, { useState } from 'react';
import NavigationBar from "../../сomponents/NavigationBar/NavigationBar.js";
import Hollow from "../../сomponents/NavigationBar/Hollow.js";
import Footer from "../../сomponents/Footer/Footer.js";
import Account from "../../сomponents/UserProfile/Account/Account.js";
import MyRecords from "../../сomponents/UserProfile/MyRecords/MyRecords.js";
import './UserProfile.css';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <Account />;
      case 'myRecords':
        return <MyRecords />;
      default:
        return <Account />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/'; // Redirect to the homepage after logout
  };

  return (
    <div>
      <NavigationBar />
      <Hollow />
      <div className="user-container">
        <div className="sidebar">
          <h2>Личный кабинет клиента</h2>
          <ul>
            <li onClick={() => setActiveTab('account')}>Мой профиль</li>
            <li onClick={() => setActiveTab('myRecords')}>Мои записи</li>
            <li className="logout" onClick={handleLogout}>Выйти</li>
          </ul>
        </div>
        <div className="content">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
