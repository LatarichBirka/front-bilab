import React from 'react';
import { Modal } from 'antd';
import './EmployeeScheduleModal.css';

const EmployeeScheduleModal = ({ visible, onCancel, employees, schedule }) => {
  const getDayName = (dayOfWeek) => {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return days[dayOfWeek];
  };

  const renderSchedule = (employeeId) => {
    const employeeSchedule = schedule.filter(day => day.userId === employeeId);
    const daysOrder = [1, 2, 3, 4, 5, 6, 0]; // Order of days from Monday to Sunday

    return daysOrder.map(dayOfWeek => {
      const day = employeeSchedule.find(d => d.dayOfWeek === dayOfWeek) || { typeOfDayId: 'b6dc3aff-9496-4246-4fe1-08dc7953814d' };
      return (
        <div key={dayOfWeek} className={`schedule-day ${day.typeOfDayId === '4124786d-1808-4c44-4fe2-08dc7953814d' ? 'working' : 'off'}`}>
          <div className="day-name">{getDayName(dayOfWeek)}</div>
          {day.typeOfDayId === '4124786d-1808-4c44-4fe2-08dc7953814d' && (
            <div className="time-range">{day.fromTime}:00-{day.toTimeTime}:00</div>
          )}
          <div className="day-type">{day.typeOfDayId === '4124786d-1808-4c44-4fe2-08dc7953814d' ? 'Прием' : 'Выходной'}</div>
        </div>
      );
    });
  };

  return (
    <Modal
      title="График работы всех специалистов"
      open={visible}
      onCancel={onCancel}
      footer={null}
      className="employee-schedule-modal"
      width={1000} // Adjust the width as needed
    >
      <div className="schedule-container">
        {employees.map(employee => (
          <div key={employee.id} className="employee-schedule-row">
            <div className="employee-name">{employee.firstName} {employee.lastName}</div>
            <div className="schedule-days">
              {renderSchedule(employee.id)}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default EmployeeScheduleModal;
