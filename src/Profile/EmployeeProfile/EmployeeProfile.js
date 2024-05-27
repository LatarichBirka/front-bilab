import React, { useState } from 'react';
import NavigationBar from "../../сomponents/NavigationBar/NavigationBar.js";
import Hollow from "../../сomponents/NavigationBar/Hollow.js";
import Footer from "../../сomponents/Footer/Footer.js";
import Account from "../../сomponents/EmployeeProfile/Account/Account.js";
import MyRecords from "../../сomponents/EmployeeProfile/MyRecords/MyRecords.js";
import MySchedule from "../../сomponents/EmployeeProfile/MySchedule/MySchedule.js";
import './EmployeeProfile.css';

const EmployeeProfile = () => {
  const [activeTab, setActiveTab] = useState('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <Account />;
      case 'myRecords':
        return <MyRecords />;
      case 'mySchedule':
        return <MySchedule />;
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
      <div className="employee-container-profile">
        <div className="sidebar">
          <h2>Личный кабинет работника</h2>
          <ul>
            <li onClick={() => setActiveTab('account')}>Мой профиль</li>
            <li onClick={() => setActiveTab('myRecords')}>Мои записи</li>
            <li onClick={() => setActiveTab('mySchedule')}>Мой график</li>
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

export default EmployeeProfile;
