import React, { useEffect, useState } from 'react';
import './MySchedule.css';

const MySchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const accessToken = localStorage.getItem('accessToken');
    const employeeId = localStorage.getItem('UserID'); // Assuming employeeId is stored in localStorage

    useEffect(() => {
        fetch(`https://localhost:7235/${employeeId}/schedules`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setSchedule(data.value); // Set the fetched schedule data to state
        })
        .catch(error => console.error('Error fetching schedule:', error));
    }, [employeeId, accessToken]);

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
            <div key={index} className={`employeeprofile-schedule-day ${day.typeOfDayId === '1bc7d2a1-0080-476b-f361-08dc80d6707c' ? 'employeeprofile-working' : 'employeeprofile-off'}`}>
                <div className="employeeprofile-day-name">{daysMap[day.dayOfWeek]}</div>
                {day.typeOfDayId === '1bc7d2a1-0080-476b-f361-08dc80d6707c' && (
                    <div className="employeeprofile-time-range">{day.fromTime}:00-{day.toTimeTime}:00</div>
                )}
                <div className="employeeprofile-day-type">{day.typeOfDayId === '1bc7d2a1-0080-476b-f361-08dc80d6707c' ? 'Прием' : 'Выходной'}</div>
            </div>
        ));
    };

    return (
        <div className="employeeprofile-employee-schedule">
            <h3 className="employeeprofile-schedule-title">Мой график работы</h3>
            <div className="employeeprofile-schedule-container">
                {renderSchedule()}
            </div>
        </div>
    );
};

export default MySchedule;
