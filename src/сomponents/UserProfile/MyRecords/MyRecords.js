import React, { useState, useEffect } from 'react';
import './MyRecords.css';
import { notification } from 'antd';

const MyRecords = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);
  const [cancelRecordId, setCancelRecordId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('UserID'); // Assuming userId is stored in localStorage

  useEffect(() => {
    fetchRecords();
  }, [weekOffset]);

  const fetchRecords = async () => {
    try {
      const url = `https://localhost:7235/api/Record/user-records/${userId}`;
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
        updateRecordStatus(recordId);
      } else {
        const data = await response.json();
        if (data.success) {
          notification.success({
            message: "Успех",
            description: "Запись успешно отменена!",
          });
          updateRecordStatus(recordId);
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

  const updateRecordStatus = (recordId) => {
    setRecords(records.map(record => 
      record.id === recordId ? { ...record, isCanceled: true, isClosed: true } : record
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
      <div className="UserProfile-week-records">
        {daysOfWeek.map((day, index) => {
          const dayRecords = weekRecords.filter(record => new Date(record.admissionDate).getDay() === (index + 1) % 7);
          return (
            <div key={index} className="UserProfile-day-records">
              <h3>{day}</h3>
              <div className="UserProfile-day-container">
                {dayRecords.length > 0 ? (
                  dayRecords.map(record => (
                    <div key={record.id} className="UserProfile-record-item">
                      {!record.isCanceled ? (
                        <div className="UserProfile-record-content">
                          <div className="UserProfile-record-info">
                            <p className="UserProfile-record-field"><strong>Дата приёма:</strong></p>
                            <p className="UserProfile-record-field">{new Date(record.admissionDate).toLocaleString()}</p>
                            {record.detail && (<>
                            <p className="UserProfile-record-field"><strong>Ваш комментарий:</strong></p>
                            <p className="UserProfile-record-field">{record.detail}</p>
                            </>
                            )}
                            <p className="UserProfile-record-field"><strong>Название процедуры:</strong></p>
                            <p className="UserProfile-record-field">{record.procedure.name}</p>
                            <p className="UserProfile-record-field"><strong>Цена:</strong></p>
                            <p className="UserProfile-record-field">{record.procedure.price} руб.</p>
                            <p className="UserProfile-record-field"><strong>Адрес:</strong></p>
                            <p className="UserProfile-record-field">{record.adress}</p>
                            <p className="UserProfile-record-field"><strong>Состояние:</strong></p>
                            <p className="UserProfile-record-field">{record.isClosed ? (record.isCanceled ? 'Отменена' : 'Закрыта') : 'В процессе'}</p>
                          </div>
                          {!record.isClosed && (
                            <div className="UserProfile-actions">
                              <button onClick={() => setCancelRecordId(record.id)}>Отменить запись</button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="UserProfile-record-content">
                          <div className="UserProfile-record-info">
                            <p className="UserProfile-record-field"><strong>Дата приёма:</strong> </p>
                            <p className="UserProfile-record-field">{new Date(record.admissionDate).toLocaleString()}</p>
                            <p className="UserProfile-record-field"><strong>Название процедуры:</strong> </p>
                            <p className="UserProfile-record-field">{record.procedure.name}</p>
                            <p className="UserProfile-record-field"><strong>Состояние:</strong></p>
                            <p className="UserProfile-record-field">Отменена</p>
                            <p className="UserProfile-record-field"><strong>Причина отмены:</strong> </p>
                            <p className="UserProfile-record-field">{record.cancelingReasone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="UserProfile-record-item UserProfile-empty-record">
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
    <div className="UserProfile-my-records">
      <h2>Мои записи</h2>
      <div className="UserProfile-week-navigation">
        <button onClick={() => setWeekOffset(weekOffset - 1)}>Предыдущая неделя</button>
        <span className="UserProfile-intervalweek">{getFormattedDateRange(getWeekStart())}</span>
        <button onClick={() => setWeekOffset(weekOffset + 1)}>Следующая неделя</button>
      </div>
      {error && <p className="UserProfile-error">{error}</p>}
      {renderWeekRecords()}
      {cancelRecordId && (
        <div className="UserProfile-cancel-modal">
          <h3>Отменить запись</h3>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Причина отмены"
          />
          <div className="UserProfile-modal-actions">
            <button onClick={() => handleCancelRecord(cancelRecordId)}>Подтвердить</button>
            <button onClick={() => setCancelRecordId(null)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecords;
