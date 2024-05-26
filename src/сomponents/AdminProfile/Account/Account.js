import React, { useState, useEffect } from 'react';
import './Account.css';
import {notification } from "antd";
import noPhoto from './no_photo.jpg';

const Account = () => {
  const [accountInfo, setAccountInfo] = useState({});
  const [formState, setFormState] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    newEmail: '',
    firstName: '',
    lastName: '',
    patronymic: '',
    phoneNumber: '',
    sex: '',
    dateOfBirth: '',
    avatarPath: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  const fetchAccountInfo = async () => {
    try {
      const response = await fetch('https://localhost:7235/api/Account/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAccountInfo(data.value);
        setFormState({
          firstName: data.value.firstName,
          lastName: data.value.lastName,
          patronymic: data.value.patronymic,
          phoneNumber: data.value.phoneNumber,
          sex: data.value.sex,
          dateOfBirth: data.value.dateOfBirth ? data.value.dateOfBirth.split('T')[0] : '',
          avatarPath: data.value.avatarPath || ''
        });
      } else {
        console.error('Failed to fetch account info');
      }
    } catch (error) {
      console.error('Error fetching account info:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState({ ...formState, avatarPath: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7235/api/Account/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          oldPassword: formState.oldPassword,
          newPassword: formState.newPassword,
          confirmNewPassword: formState.confirmNewPassword
        })
      });
      if (response.status === 204) {
        alert('Password changed successfully');
      } else {
        const data = await response.json();
        if (data.success) {
          alert('Password changed successfully');
        } else {
          console.error('Failed to change password');
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7235/api/Account/change-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          newEmail: formState.newEmail
        })
      });
      if (response.status === 204) {
        alert('Email changed successfully');
      } else {
        const data = await response.json();
        if (data.success) {
          alert('Email changed successfully');
        } else {
          console.error('Failed to change email');
        }
      }
    } catch (error) {
      console.error('Error changing email:', error);
    }
  };

  const handleAccountChange = async (e) => {
    e.preventDefault();
    const dataToSend = {
      id: accountInfo.id,
      firstName: formState.firstName,
      lastName: formState.lastName,
      patronymic: formState.patronymic,
      email: accountInfo.email,
      password: '',
      phoneNumber: formState.phoneNumber,
      sex: parseInt(formState.sex, 10),
      dateOfBirth: formState.dateOfBirth,
      avatarPath: formState.avatarPath,
      isNew: false
    };
    console.log(JSON.stringify(dataToSend));
    try {
      const response = await fetch('https://localhost:7235/api/User', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(dataToSend)
      });
      if (response.status === 204) {
        notification.success({
          message: "Success",
          description:
            "Данные профиля успешно обновлены! ",
        });
        fetchAccountInfo(); // Fetch updated account info
      } else {
        const data = await response.json();
        if (data.success) {
          alert('Account details updated successfully');
          fetchAccountInfo(); // Fetch updated account info
        } else {
          console.error('Failed to update account details');
        }
      }
    } catch (error) {
      console.error('Error updating account details:', error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('https://localhost:7235/api/Account/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          email: accountInfo.email
        })
      });
      if (response.status === 204) {
        alert('Password reset email sent successfully');
      } else {
        const data = await response.json();
        if (data.success) {
          alert('Password reset email sent successfully');
        } else {
          console.error('Failed to send password reset email');
        }
      }
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  };

  return (
    <div className="account">
      <div className="account-info">
        <img
          src={accountInfo.avatarPath || noPhoto}
          alt="Avatar"
          className="avatar"
        />
        <div className="account-details">
          <p><strong>Полное имя:</strong> {`${accountInfo.lastName} ${accountInfo.firstName} ${accountInfo.patronymic}`}</p>
          <p><strong>Email:</strong> {accountInfo.email}</p>
          <p><strong>Номер телефона:</strong> {accountInfo.phoneNumber}</p>
          <p><strong>Пол:</strong> {accountInfo.sex === 0 ? 'Мужской' : accountInfo.sex === 1 ? 'Женский' : 'Не выбрано'}</p>
          <p><strong>Дата рождения:</strong> {accountInfo.dateOfBirth ? accountInfo.dateOfBirth.split('T')[0] : ''}</p>
        </div>
      </div>

      <div className="change-section">
        <h3 onClick={() => setShowPasswordForm(!showPasswordForm)}>Изменить пароль</h3>
        {showPasswordForm && (
          <form onSubmit={handlePasswordChange}>
            <input
              type="password"
              name="oldPassword"
              value={formState.oldPassword}
              onChange={handleInputChange}
              placeholder="Старый пароль"
              required
            />
            <input
              type="password"
              name="newPassword"
              value={formState.newPassword}
              onChange={handleInputChange}
              placeholder="Новый пароль"
              required
            />
            <input
              type="password"
              name="confirmNewPassword"
              value={formState.confirmNewPassword}
              onChange={handleInputChange}
              placeholder="Повторите новый пароль"
              required
            />
            <button type="submit">Изменить пароль</button>
          </form>
        )}
      </div>

      <div className="change-section">
        <h3 onClick={() => setShowEmailForm(!showEmailForm)}>Изменить email</h3>
        {showEmailForm && (
          <form onSubmit={handleEmailChange}>
            <input
              type="email"
              name="newEmail"
              value={formState.newEmail}
              onChange={handleInputChange}
              placeholder="Новый Email"
              required
            />
            <button type="submit">Изменить email</button>
          </form>
        )}
      </div>

      <div className="change-section">
        <h3 onClick={() => setShowAccountForm(!showAccountForm)}>Редактировать данные профиля</h3>
        {showAccountForm && (
          <form onSubmit={handleAccountChange}>
            <input
              type="text"
              name="firstName"
              value={formState.firstName}
              onChange={handleInputChange}
              placeholder="Имя"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formState.lastName}
              onChange={handleInputChange}
              placeholder="Фамилия"
              required
            />
            <input
              type="text"
              name="patronymic"
              value={formState.patronymic}
              onChange={handleInputChange}
              placeholder="Отчество"
              required
            />
            <input
              type="text"
              name="phoneNumber"
              value={formState.phoneNumber}
              onChange={handleInputChange}
              placeholder="Номер телефона"
              required
            />
            <select
              name="sex"
              value={formState.sex}
              onChange={handleInputChange}
              required
            >
              <option value="2">Не выбрано</option>
              <option value="0">Мужской</option>
              <option value="1">Женский</option>
            </select>
            <input
              type="date"
              name="dateOfBirth"
              value={formState.dateOfBirth}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="avatarPath"
              value={formState.avatarPath}
              onChange={handleInputChange}
              placeholder="Ссылка на фото"
            />
            <button type="submit">Редактировать данные</button>
          </form>
        )}
      </div>

      <button className="forgot-password-button" onClick={handleForgotPassword}>Забыли пароль?</button>
    </div>
  );
};

export default Account;
