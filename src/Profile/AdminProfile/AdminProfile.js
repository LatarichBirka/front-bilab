import React, { useState } from 'react';
import NavigationBar from "../../сomponents/NavigationBar/NavigationBar.js";
import Hollow from "../../сomponents/NavigationBar/Hollow.js";
import Footer from "../../сomponents/Footer/Footer.js";
import Account from "../../сomponents/AdminProfile/Account/Account.js";
import Addresses from "../../сomponents/AdminProfile/Addresses/Addresses.js";
import ProceduresOffers from "../../сomponents/AdminProfile/ProceduresOffers/ProceduresOffers.js";
import Records from "../../сomponents/AdminProfile/Records/Records.js";
import UsersRoles from "../../сomponents/AdminProfile/UsersRoles/UsersRoles.js";
import Schedules from "../../сomponents/AdminProfile/Schedules/Schedules.js";
import './AdminProfile.css';

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <Account />;
      case 'addresses':
        return <Addresses />;
      case 'procedures':
        return <ProceduresOffers />;
      case 'records':
        return <Records />;
      case 'usersRoles':
        return <UsersRoles />;
      case 'schedules':
        return <Schedules />;
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
      <div className="admin-container">
        <div className="sidebar">
          <h2>Личный кабинет админа</h2>
          <ul>
            <li onClick={() => setActiveTab('account')}>Мой профиль</li>
            <li onClick={() => setActiveTab('addresses')}>Адреса</li>
            <li onClick={() => setActiveTab('procedures')}>Процедуры и акции</li>
            <li onClick={() => setActiveTab('records')}>Отчётность записей</li>
            <li onClick={() => setActiveTab('usersRoles')}>Пользователи и их роли</li>
            <li onClick={() => setActiveTab('schedules')}>Графики работников</li>
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

export default AdminProfile;
