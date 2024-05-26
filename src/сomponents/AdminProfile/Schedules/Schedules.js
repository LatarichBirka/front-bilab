import React, { useState, useEffect } from 'react';
import './Schedules.css';

const Schedules = () => {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    fromTime: 0,
    toTimeTime: 0,
    dayOfWeek: 0,
    typeOfDayId: '',
    userId: ''
  });
  const [typeOfDays, setTypeOfDays] = useState([]);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const accessToken = localStorage.getItem('accessToken');

  const daysOfWeek = [
    { name: 'Понедельник', value: 1 },
    { name: 'Вторник', value: 2 },
    { name: 'Среда', value: 3 },
    { name: 'Четверг', value: 4 },
    { name: 'Пятница', value: 5 },
    { name: 'Суббота', value: 6 },
    { name: 'Воскресенье', value: 0 }
  ];

  useEffect(() => {
    fetchEmployees();
    fetchTypeOfDays();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchSchedules();
    }
  }, [selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('https://localhost:7235/allEmployee', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setEmployees(data.value);
      } else {
        console.error('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await fetch('https://localhost:7235/api/Shedule', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const employeeSchedules = data.value.filter(schedule => schedule.userId === selectedEmployee.id);
        setSchedules(employeeSchedules);
      } else {
        console.error('Failed to fetch schedules');
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const fetchTypeOfDays = async () => {
    try {
      const response = await fetch('https://localhost:7235/api/TypeOfDay', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setTypeOfDays(data.value);
      } else {
        console.error('Failed to fetch type of days');
      }
    } catch (error) {
      console.error('Error fetching type of days:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule({ ...newSchedule, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingSchedule({ ...editingSchedule, [name]: value });
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...newSchedule,
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      userId: selectedEmployee.id,
      fromTime: parseInt(newSchedule.fromTime, 10),
      toTimeTime: parseInt(newSchedule.toTimeTime, 10),
      dayOfWeek: parseInt(newSchedule.dayOfWeek, 10)
    };
    try {
      const response = await fetch('https://localhost:7235/api/Shedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(dataToSend)
      });
      if (response.status === 204 || (await response.json()).success) {
        fetchSchedules();
        setNewSchedule({
          fromTime: 0,
          toTimeTime: 0,
          dayOfWeek: 0,
          typeOfDayId: '',
          userId: ''
        });
      } else {
        console.error('Failed to add schedule');
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const handleEditSchedule = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...editingSchedule,
      userId: selectedEmployee.id,
      fromTime: parseInt(editingSchedule.fromTime, 10),
      toTimeTime: parseInt(editingSchedule.toTimeTime, 10),
      dayOfWeek: parseInt(editingSchedule.dayOfWeek, 10)
    };
    try {
      const response = await fetch('https://localhost:7235/api/Shedule', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(dataToSend)
      });
      if (response.status === 204 || (await response.json()).success) {
        fetchSchedules();
        setEditingSchedule(null);
      } else {
        console.error('Failed to edit schedule');
      }
    } catch (error) {
      console.error('Error editing schedule:', error);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      const response = await fetch(`https://localhost:7235/api/Shedule/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.status === 204) {
        fetchSchedules();
      } else {
        console.error('Failed to delete schedule');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEditingSchedule(null);
    setNewSchedule({
      fromTime: 0,
      toTimeTime: 0,
      dayOfWeek: 0,
      typeOfDayId: '',
      userId: ''
    });
  };

  return (
    <div className="schedules">
      <h2>Графики работников</h2>
      <div className="employee-list">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className={`employee-item ${selectedEmployee?.id === employee.id ? 'selected' : ''}`}
            onClick={() => handleSelectEmployee(employee)}
          >
            <img src={employee.avatarPath} alt={employee.lastName} className="employee-avatar" />
            <p>{`${employee.lastName} ${employee.firstName} ${employee.patronymic}`}</p>
          </div>
        ))}
      </div>

      {selectedEmployee && (
        <div className="employee-schedules">
          {schedules.length < 7 && !editingSchedule && (
            <div className="new-schedule-form">
              <h3>Добавить график</h3>
              <form onSubmit={handleAddSchedule}>
                <select name="dayOfWeek" value={newSchedule.dayOfWeek} onChange={handleInputChange} required>
                  <option value="">Выберите день недели</option>
                  {daysOfWeek.map((day) => (
                    <option key={day.value} value={day.value}>{day.name}</option>
                  ))}
                </select>
                <input type="number" name="fromTime" value={newSchedule.fromTime} onChange={handleInputChange} placeholder="Начало (час)" required />
                <input type="number" name="toTimeTime" value={newSchedule.toTimeTime} onChange={handleInputChange} placeholder="Конец (час)" required />
                <select name="typeOfDayId" value={newSchedule.typeOfDayId} onChange={handleInputChange} required>
                  <option value="">Выберите тип дня</option>
                  {typeOfDays.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                <button type="submit">Добавить</button>
              </form>
            </div>
          )}

          {editingSchedule && (
            <div className="edit-schedule-form">
              <h3>Редактировать график</h3>
              <form onSubmit={handleEditSchedule}>
                <select name="dayOfWeek" value={editingSchedule.dayOfWeek} onChange={handleEditInputChange} required>
                  <option value="">Выберите день недели</option>
                  {daysOfWeek.map((day) => (
                    <option key={day.value} value={day.value}>{day.name}</option>
                  ))}
                </select>
                <input type="number" name="fromTime" value={editingSchedule.fromTime} onChange={handleEditInputChange} placeholder="Начало (час)" required />
                <input type="number" name="toTimeTime" value={editingSchedule.toTimeTime} onChange={handleEditInputChange} placeholder="Конец (час)" required />
                <select name="typeOfDayId" value={editingSchedule.typeOfDayId} onChange={handleEditInputChange} required>
                  <option value="">Выберите тип дня</option>
                  {typeOfDays.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                <button type="submit">Сохранить</button>
              </form>
            </div>
          )}

          {schedules.length === 7 && !editingSchedule && <h3>У работника уже созданы все 7 дней графика</h3>}

          <h3>Существующие графики {`${selectedEmployee.lastName} ${selectedEmployee.firstName} ${selectedEmployee.patronymic}`}</h3>
          {schedules
            .sort((a, b) => (a.dayOfWeek === 0 ? 7 : a.dayOfWeek) - (b.dayOfWeek === 0 ? 7 : b.dayOfWeek))
            .map((schedule) => (
              <div key={schedule.id} className="schedule-item">
                <p>
                  <span>День:</span> {daysOfWeek.find(day => day.value === schedule.dayOfWeek)?.name}, <span>Время:</span> {schedule.fromTime}-{schedule.toTimeTime}, <span>Тип:</span> {typeOfDays.find((type) => type.id === schedule.typeOfDayId)?.name}
                </p>
                <button onClick={() => setEditingSchedule(schedule)}>Редактировать</button>
                <button onClick={() => handleDeleteSchedule(schedule.id)}>Удалить</button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Schedules;
