import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './EmployeeDetail.css';
import NavigationBar from '../NavigationBar/NavigationBar';
import Hollow from "../NavigationBar/Hollow";
import Footer from "../Footer/Footer";

const EmployeeDetail = () => {
    const { state } = useLocation();
    const { employee } = state; // Get the employee from location state
    const { id } = useParams();
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        fetch("https://localhost:7235/" + id + "/schedules")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            setSchedule(data.value); // Set the fetched schedule data to state
        })
        .catch(error => console.error('Error fetching schedule:', error));
    }, [id]);

    if (!employee) {
        return <div>Loading...</div>;
    }

    const renderSchedule = () => {
        const daysOrder = [1, 2, 3, 4, 5, 6, 0]; // Order of days from Monday to Sunday
        const daysMap = {
            0: 'Вс',
            1: 'Пн',
            2: 'Вт',
            3: 'Ср',
            4: 'Чт',
            5: 'Пт',
            6: 'Сб'
        };

        const sortedSchedule = daysOrder.map(dayOfWeek => {
            const daySchedule = schedule.find(day => day.dayOfWeek === dayOfWeek);
            return daySchedule || { dayOfWeek, typeOfDayId: 'off' }; // Default to off if no schedule
        });

        return sortedSchedule.map((day, index) => (
            <div key={index} className={`schedule-day ${day.typeOfDayId === '4124786d-1808-4c44-4fe2-08dc7953814d' ? 'working' : 'off'}`}>
                <div className="day-name">{daysMap[day.dayOfWeek]}</div>
                {day.typeOfDayId === '4124786d-1808-4c44-4fe2-08dc7953814d' && (
                    <div className="time-range">{day.fromTime}:00 - {day.toTimeTime}:00</div>
                )}
                <div className="day-type">{day.typeOfDayId === '4124786d-1808-4c44-4fe2-08dc7953814d' ? 'Прием' : 'Выходной'}</div>
            </div>
        ));
    };


    return (
        <div>
            <NavigationBar />
            <Hollow />
            <div className="employee-detail-container">
                <div className="employee-detail-info">
                    <img src={employee.avatarPath} alt={employee.firstName} className="employee-detail-image" />
                    <h2>{employee.firstName} {employee.lastName}</h2>
                    <p>{employee.description}</p> {/* Add other employee fields as needed */}
                </div>
                <div className="employee-schedule">
                    <h3 className="schedule-title">График работы </h3>
                    <div className="schedule-container">
                        {renderSchedule()}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EmployeeDetail;
