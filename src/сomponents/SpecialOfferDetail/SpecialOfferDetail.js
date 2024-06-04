

import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Modal, Form, DatePicker, Select, Input, Button, notification } from 'antd';
import NavigationBar from '../NavigationBar/NavigationBar';
import Hollow from "../NavigationBar/Hollow";
import Footer from "../Footer/Footer";
import './SpecialOfferDetail.css';


const SpecialOfferDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [procedure, setProcedure] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [Adresss, setAdresss] = useState([]);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);


  useEffect(() => {
    // URL на путь к API
    fetch('https://localhost:7235/api/Procedure/sales/'+ id)
    .then(response => {
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
      })
      .then(data => {
        setProcedure(data.value)
      })
      .catch(error => console.error('Error fetching procedures:', error));
  }, [id]);


  useEffect(() => {
    fetch('https://localhost:7235/allEmployee')
      .then(response => response.json())
      .then(data => setEmployees(data.value))
      .catch(error => console.error('Error fetching employees:', error));
    
    fetch('https://localhost:7235/api/Adress')
      .then(response => response.json())
      .then(data => setAdresss(data.value))
      .catch(error => console.error('Error fetching Adresss:', error));
  }, []);

  const handleRecordAppointment = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      history.push('/sign-in');
    } else {
      setIsModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFormSubmit = (values) => {
    console.log('Form values:', values);
    // Логика отправки record
    const accessToken = localStorage.getItem('accessToken');
    const procedureId = procedure.id
    const employerId = values.employee
    const adressId = values.Adress
    const detail = values.details
    const customerId = localStorage.getItem('UserID');
    const admissionDate = values.date.format('YYYY-MM-DD') + "T" + values.time + ":00:00";
    const dataToSend = { id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", employerId, adressId, detail, procedureId, customerId, admissionDate
     };
    console.log(dataToSend)
    setLoading(true);
    fetch(' https://localhost:7235/api/Record', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(dataToSend)
    })
    .then(response => {
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      notification.success({
        message: "Success",
        description:
          "Вы успешно оставили заявкку, пожалуйста, ожидайте звонка за день до даты Заявки ",
      });
      setLoading(false);
    })
    .catch(error => {
      notification.error({
        message: "Error",
        description:
          error.message || "Пожалуйста, попробуйте снова!",
      });
      setLoading(false);
    });
    setIsModalVisible(false);
  };

  const handleDateChange = (date) => {
    // const dayOfWeek = date.day();
    setIsDateSelected(true);
    const employee = form.getFieldValue('employee');
    // console.log(employee);
    const accessToken = localStorage.getItem('accessToken');
    if (employee) {
      fetch("https://localhost:7235/" + employee + "?checkData=" + date.format('YYYY-MM-DD'), {
        // method: 'GET',
        headers: {
            // 'Accept': 'application/json',
            // 'Content-Type': 'application/json',
            // 'Authorization': "Bearer " + accessToken
            'Authorization': `Bearer ${accessToken}`
        }
      })
      .then(response => {
        console.log(response)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => {
          console.log(data)
          setTimes(data.value)
          })
        .catch(error => console.error('Error fetching times:', error));
    }
  };

  const handleEmployeeChange = (employee) => {
    const dateOrigin = form.getFieldValue('date');
    const date = dateOrigin.format('YYYY-MM-DD')
    // console.log(employee);
    if (date) {
      // const date = date.format('YYYY-MM-DD'); // Получаем день недели как число
      const accessToken = localStorage.getItem('accessToken');
      fetch("https://localhost:7235/" + employee + "?checkData=" + date, {
        // method: 'GET',
            headers: {
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/json',
                // 'Authorization': "Bearer " + accessToken
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
          console.log(response)
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
          })
        .then(data => {
          console.log(data)
          setTimes(data.value)
          })
        .catch(error => console.error('Error fetching times:', error));
    }
  };


  if (!procedure) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <NavigationBar />
      <Hollow />
      <div className="special-detail-container">
        <div className="special-detail-content">
          <div className="special-detail-text">
            <h1>{procedure.name}</h1>
            <p>{procedure.description}</p>
            <p>{procedure.detail}</p>
            <p>По сниженной цене - {procedure.newPrice}</p>
            <Button type="primary" onClick={handleRecordAppointment} className="special-detail-button">
              Оставить заявку
            </Button>
          </div>
          <div className="special-detail-image">
            <img src={procedure.picture} alt={procedure.name} />
          </div>
        </div>
      </div>
      <Footer />

      <Modal title="Заявка к специалисту" open={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="date" label="Дата Заявки" rules={[{ required: true, message: 'Пожалуйста, выберите дату!' }]}>
            <DatePicker style={{ width: '100%' }} allowClear={false} onChange={handleDateChange} />
          </Form.Item>
          <Form.Item name="employee" label="Работник" rules={[{ required: true, message: 'Пожалуйста, выберите работника!' }]}>
            <Select disabled={!isDateSelected} onChange={handleEmployeeChange}>
              {employees.map(employee => (
                <Select.Option key={employee.id} value={employee.id}>{`${employee.lastName} ${employee.firstName} ${employee.patronymic}`}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="Adress" label="Адрес" rules={[{ required: true, message: 'Пожалуйста, выберите адрес!' }]}>
            <Select disabled={!isDateSelected}>
              {Adresss.map(Adress => (
                <Select.Option key={Adress.id} value={Adress.id}>{`${Adress.city}, ${Adress.street}, ${Adress.houseNumber}`}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="time" label="Время Заявки почасовое" rules={[{ required: true, message: 'Пожалуйста, выберите время!' }]}>
            <Select>
              {times.map(time => (
                <Select.Option key={time.fromTime} value={time.fromTime}>
                  {time.fromTime === "У работника нет свободного времени на этот день."
          ? time.fromTime
          : `${time.fromTime}:00`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="details" label="Детали">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="procedure-detail-button" htmlType="submit">
              Отправить
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SpecialOfferDetail;