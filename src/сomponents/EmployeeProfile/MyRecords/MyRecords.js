import React, { useState, useEffect } from 'react';
import './MyRecords.css';
import { notification } from 'antd';

const MyRecords = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);
  const [cancelRecordId, setCancelRecordId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('UserID'); // Assuming userId is stored in localStorage

  useEffect(() => {
    fetchRecords();
  }, [weekOffset]);

  const fetchRecords = async () => {
    try {
      const url = `https://localhost:7235/api/Record/employee-records/${userId}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (data.success && data.value.length > 0) {
        setRecords(data.value);
        setError('');
      } else {
        setError('Записи отсутствуют.');
        setRecords([]);
      }
    } catch (error) {
      console.error('Ошибка при получении записей:', error);
      setError('Ошибка при получении записей');
      setRecords([]);
    }
  };

  const handleCancelRecord = async (recordId) => {
    try {
      const response = await fetch('https://localhost:7235/api/Record/closeOrCancel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          recordId,
          isCanceled: true,
          cancelingReason: cancelReason
        })
      });
      if (response.status === 204) {
        notification.success({
          message: "Успех",
          description: "Запись успешно отменена!",
        });
        updateRecordStatus(recordId, true, false);
      } else {
        const data = await response.json();
        if (data.success) {
          notification.success({
            message: "Успех",
            description: "Запись успешно отменена!",
          });
          updateRecordStatus(recordId, true, false);
        } else {
          console.error('Не удалось отменить запись');
        }
      }
    } catch (error) {
      console.error('Ошибка при отмене записи:', error);
    }
    setCancelRecordId(null);
    setCancelReason('');
  };

  const handleCloseRecord = async (recordId) => {
    try {
      const response = await fetch('https://localhost:7235/api/Record/closeOrCancel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          recordId,
          isCanceled: false,
          cancelingReason: ""
        })
      });
      if (response.status === 204) {
        notification.success({
          message: "Успех",
          description: "Запись успешно закрыта!",
        });
        updateRecordStatus(recordId, false, true);
      } else {
        const data = await response.json();
        if (data.success) {
          notification.success({
            message: "Успех",
            description: "Запись успешно закрыта!",
          });
          updateRecordStatus(recordId, false, true);
        } else {
          console.error('Не удалось закрыть запись');
        }
      }
    } catch (error) {
      console.error('Ошибка при закрытии записи:', error);
    }
    setCancelRecordId(null);
  };

  const updateRecordStatus = (recordId, isCanceled, isClosed) => {
    setRecords(records.map(record => 
      record.id === recordId ? { ...record, isCanceled, isClosed } : record
    ));
  };

  const getWeekRecords = (startOfWeek) => {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return records.filter(record => {
      const recordDate = new Date(record.admissionDate);
      return recordDate >= startOfWeek && recordDate <= endOfWeek;
    });
  };

  const getWeekStart = () => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1 + weekOffset * 7);
    return startOfWeek;
  };

  const getFormattedDateRange = (startOfWeek) => {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
  };

  const renderWeekRecords = () => {
    const startOfWeek = getWeekStart();
    const weekRecords = getWeekRecords(startOfWeek);
    const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

    return (
      <div className="employee-profile-week-records">
        {daysOfWeek.map((day, index) => {
          const dayRecords = weekRecords.filter(record => new Date(record.admissionDate).getDay() === (index + 1) % 7);
          return (
            <div key={index} className="employee-profile-day-records">
              <h3>{day}</h3>
              <div className="employee-profile-day-container">
                {dayRecords.length > 0 ? (
                  dayRecords.map(record => (
                    <div key={record.id} className="employee-profile-record-item" onClick={() => setSelectedRecord(record)}>
                      <p><strong>Дата приёма:</strong> {new Date(record.admissionDate).toLocaleString()}</p>
                      <div className="employee-profile-actions">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCancelRecordId(record.id); }} 
                          disabled={record.isClosed || record.isCanceled}
                        >
                          Отмена
                        </button>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleCloseRecord(record.id); }} 
                          disabled={record.isClosed || record.isCanceled}
                        >
                          Закрыть
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="employee-profile-record-item employee-profile-empty-record">
                    <p>Нет записей</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="employee-profile-my-records">
      <h2>Мои записи</h2>
      <div className="employee-profile-week-navigation">
        <button onClick={() => setWeekOffset(weekOffset - 1)}>Предыдущая неделя</button>
        <span className="employee-profile-intervalweek">{getFormattedDateRange(getWeekStart())}</span>
        <button onClick={() => setWeekOffset(weekOffset + 1)}>Следующая неделя</button>
      </div>
      {error && <p className="employee-profile-error">{error}</p>}
      {renderWeekRecords()}
      {cancelRecordId && (
        <div className="employee-profile-cancel-modal">
          <h3>Отмена записи</h3>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Причина отмены"
          />
          <h3>Вы уверены, что хотите отменить?</h3>
          <div className="employee-profile-modal-actions">
            <button onClick={() => handleCancelRecord(cancelRecordId)}>Да</button>
            <button onClick={() => setCancelRecordId(null)}>Нет</button>
          </div>
        </div>
      )}
      {selectedRecord && (
        <div className="employee-profile-record-detail-modal">
          <h3>Детали записи</h3>
          <div className="employee-profile-record-info">
            <p><strong>Дата приёма:</strong> {new Date(selectedRecord.admissionDate).toLocaleString()}</p>
            <p><strong>Полное имя клиента:</strong> {`${selectedRecord.customer.lastName} ${selectedRecord.customer.firstName} ${selectedRecord.customer.patronymic}`}</p>
            <p><strong>Номер телефона клиента:</strong> {selectedRecord.customer.phoneNumber}</p>
            <p><strong>Email клиента:</strong> {selectedRecord.customer.email}</p>
            {selectedRecord.detail && (
              <>
                <p><strong>Комментарий клинета:</strong> {selectedRecord.detail}</p>
              </>
            )}
            <p><strong>Название процедуры:</strong> {selectedRecord.procedure.name}</p>
            <p><strong>Цена:</strong> {selectedRecord.procedure.price} руб.</p>
            <p><strong>Адрес:</strong> {selectedRecord.adress}</p>
            <p><strong>Состояние:</strong> {selectedRecord.isClosed ? (selectedRecord.isCanceled ? 'Отменена' : 'Закрыта') : 'В процессе'}</p>
          </div>
          <div className="employee-profile-modal-actions">
            <button onClick={() => setSelectedRecord(null)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecords;
