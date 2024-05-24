import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'antd';
import './Employee.css';
import NavigationBar from "../сomponents/NavigationBar/NavigationBar.js";
import Hollow from "../сomponents/NavigationBar/Hollow.js";
import Footer from "../сomponents/Footer/Footer.js";
import EmployeeScheduleModal from "../сomponents/EmployeeScheduleModal/EmployeeScheduleModal.js";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  
  useEffect(() => {
    fetch('https://localhost:7235/allEmployee')
      .then(response => response.json())
      .then(data => setEmployees(data.value))
      .catch(error => console.error('Error fetching employees:', error));

    fetch('https://localhost:7235/api/Shedule')
      .then(response => response.json())
      .then(data => setSchedule(data.value))
      .catch(error => console.error('Error fetching schedule:', error));
  }, []);


  const showScheduleModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <NavigationBar />
      <Hollow />
      <div className="employee-container">
      <div className="header-with-button">
          <h1>Наши специалисты</h1>
          <Button type="link" onClick={showScheduleModal} className="schedule-link-button">
            График работы всех специалистов
          </Button>
        </div>
        <div className="employee-grid">
          {employees.map(employee => (
            <Link to={{
              pathname: `/employee/${employee.id}`,
              state: { employee } // Передача данных о сотруднике
            }} key={employee.id} className="employee-card">
              <img src={employee.picture} alt={employee.firstName} className="employee-image" />
              <div className="employee-name">
                {employee.firstName} {employee.lastName}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
      <EmployeeScheduleModal visible={isModalVisible} onCancel={handleCancel} employees={employees} schedule={schedule} />
    </div>
  );
};

export default Employee;


