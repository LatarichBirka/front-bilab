import React, { useState } from 'react';
import './Records.css';

const Records = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [showRecords, setShowRecords] = useState(false);
  const [financialReport, setFinancialReport] = useState({
    totalAmount: 0,
    totalRecords: 0,
    canceledRecords: 0,
    successfulRecords: 0,
    uniqueClients: 0,
  });

  const accessToken = localStorage.getItem('accessToken');

  const fetchRecords = async () => {
    try {
      const url = `https://localhost:7235/api/Record/statistic-by-data?fromDate=${fromDate}&toTime=${toDate}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (data.success && data.value.length > 0) {
        setRecords(data.value);
        calculateFinancialReport(data.value);
        setError('');
      } else {
        setError('Не удалось получить Заявки или Заявки отсутствуют за указанный период');
        setRecords([]);
        setFinancialReport({
          totalAmount: 0,
          totalRecords: 0,
          canceledRecords: 0,
          successfulRecords: 0,
          uniqueClients: 0,
        });
      }
    } catch (error) {
      console.error('Ошибка при получении заявок:', error);
      setError('Ошибка при получении заявок');
      setRecords([]);
      setFinancialReport({
        totalAmount: 0,
        totalRecords: 0,
        canceledRecords: 0,
        successfulRecords: 0,
        uniqueClients: 0,
      });
    }
  };

  const calculateFinancialReport = (records) => {
    let totalAmount = 0;
    let totalRecords = records.length;
    let canceledRecords = 0;
    let successfulRecords = 0;
    let uniqueClientsSet = new Set();

    records.forEach(record => {
      if (record.isClosed && !record.isCanceled) {
        totalAmount += record.procedure.price;
        successfulRecords += 1;
      }
      if (record.isClosed && record.isCanceled) {
        canceledRecords += 1;
      }
      uniqueClientsSet.add(record.customer.id);
    });

    setFinancialReport({
      totalAmount,
      totalRecords,
      canceledRecords,
      successfulRecords,
      uniqueClients: uniqueClientsSet.size,
    });
  };

  const getStatus = (record) => {
    if (record.isClosed && record.isCanceled) {
      return 'Отменена';
    }
    if (record.isClosed) {
      return 'Закрыта';
    }
    return 'В процессе';
  };

  return (
    <div className="records">
      <h2>Отчётность по заявкам</h2>
      <div className="date-inputs">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          placeholder="От даты (ГГГГ-ММ-ДД)"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          placeholder="До даты (ГГГГ-ММ-ДД)"
        />
        <button onClick={fetchRecords}>Получить отчётность</button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="financial-report">
        <p><strong>Общая сумма успешно проведённых процедур:</strong> {financialReport.totalAmount} руб.</p>
        <p><strong>Общее количество заявок:</strong> {financialReport.totalRecords}</p>
        <p><strong>Количество отменённых заявок:</strong> {financialReport.canceledRecords}</p>
        <p><strong>Количество успешно проведённых заявок:</strong> {financialReport.successfulRecords}</p>
        <p><strong>Количество клиентов:</strong> {financialReport.uniqueClients}</p>
      </div>

      <button onClick={() => setShowRecords(!showRecords)}>
        {showRecords ? 'Скрыть заявки' : 'Показать все заявки за этот период'}
      </button>

      {showRecords && (
        <div className="records-list">
          {records.map((record) => (
            <div key={record.id} className="record-item">
              <h3>{record.procedure.name}</h3>
              <p><strong>Дата приёма:</strong> {new Date(record.admissionDate).toLocaleString()}</p>
              <p><strong>Комментарий клиента:</strong> {record.detail}</p>
              <p><strong>Название процедуры:</strong> {record.procedure.name}</p>
              <p><strong>Цена:</strong> {record.procedure.price} руб.</p>
              <p><strong>Адрес:</strong> {record.adress}</p>
              <div className="record-details">
                <div className="customer-info">
                  <img src={record.customer.avatarPath} alt={`${record.customer.lastName} ${record.customer.firstName}`} />
                  <p><strong>Клиент:</strong> {`${record.customer.lastName} ${record.customer.firstName} ${record.customer.patronymic}`}</p>
                  <p><strong>Email:</strong> {record.customer.email}</p>
                  <p><strong>Телефон:</strong> {record.customer.phoneNumber}</p>
                </div>
                <div className="employer-info">
                  <img src={record.employer.avatarPath} alt={`${record.employer.lastName} ${record.employer.firstName}`} />
                  <p><strong>Работник:</strong> {`${record.employer.lastName} ${record.employer.firstName} ${record.employer.patronymic}`}</p>
                  <p><strong>Email:</strong> {record.employer.email}</p>
                  <p><strong>Телефон:</strong> {record.employer.phoneNumber}</p>
                </div>
              </div>
              <p><strong>Состояние:</strong> {getStatus(record)}</p>
              {record.isCanceled && <p><strong>Причина отмены:</strong> {record.cancelingReasone}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Records;
