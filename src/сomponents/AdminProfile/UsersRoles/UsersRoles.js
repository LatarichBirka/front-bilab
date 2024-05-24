import React, { useState, useEffect } from 'react';
import './UsersRoles.css';

const UsersRoles = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState({});
  const [formState, setFormState] = useState({
    id: '',
    firstName: '',
    lastName: '',
    patronymic: '',
    email: '',
    password: '',
    phoneNumber: '',
    sex: 2, // Default to "Не выбрано"
    dateOfBirth: '',
    avatarPath: '',
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false); // State for selecting between user and employee
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://localhost:7235/api/User', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.value);
        fetchUserRoles(data.value);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUserRoles = async (users) => {
    const userRoles = {};
    for (const user of users) {
      try {
        const response = await fetch(`https://localhost:7235/api/Role/user-roles/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        if (data.success) {
          userRoles[user.id] = data.value[0];
        } else {
          console.error('Failed to fetch user roles');
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
      }
    }
    setRoles(userRoles);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEmployee ? 'https://localhost:7235/add-employee' : 'https://localhost:7235/api/User';
    const method = isUpdate ? 'PUT' : 'POST';
    const body = {
      id: isUpdate ? formState.id : (isEmployee ? "3fa85f64-5717-4562-b3fc-2c963f66afa6" : "3fa85f64-5717-4562-b3fc-2c963f66afa6"),
      firstName: formState.firstName,
      lastName: formState.lastName,
      patronymic: formState.patronymic,
      email: formState.email,
      password: formState.password,
      phoneNumber: formState.phoneNumber,
      sex: formState.sex,
      dateOfBirth: formState.dateOfBirth,
      avatarPath: formState.avatarPath,
      ...(isUpdate && { isNew: false }),
      ...(!isUpdate && isEmployee && { isNew: true })
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
      });

      if (response.status === 204 || (await response.json()).success) {
        fetchUsers();
        setFormState({
          id: '',
          firstName: '',
          lastName: '',
          patronymic: '',
          email: '',
          password: '',
          phoneNumber: '',
          sex: 2, // Reset to "Не выбрано"
          dateOfBirth: '',
          avatarPath: '',
        });
        setIsUpdate(false);
        setIsEmployee(false); // Reset employee state
      } else {
        console.error('Failed to submit user');
      }
    } catch (error) {
      console.error('Error submitting user:', error);
    }
  };

  const handleEdit = (user) => {
    setFormState({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      patronymic: user.patronymic,
      email: user.email,
      password: '',
      phoneNumber: user.phoneNumber,
      sex: user.sex,
      dateOfBirth: user.dateOfBirth,
      avatarPath: user.avatarPath,
    });
    setIsUpdate(true);
    setIsEmployee(false); // Ensure we are not editing an employee
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://localhost:7235/api/User/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status === 204) {
        fetchUsers(); // Refresh users after successful deletion
      } else {
        const data = await response.json();
        if (data.success) {
          fetchUsers(); // Refresh users after successful deletion
        } else {
          console.error('Failed to delete user');
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="users-roles">
      <h2>Manage Users and Employees</h2>
      <div className="creation-toggle">
        <label>
          <input
            type="radio"
            name="userType"
            value="user"
            checked={!isEmployee}
            onChange={() => setIsEmployee(false)}
          />
          Create User
        </label>
        <label>
          <input
            type="radio"
            name="userType"
            value="employee"
            checked={isEmployee}
            onChange={() => setIsEmployee(true)}
          />
          Create Employee
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          value={formState.firstName}
          onChange={handleInputChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formState.lastName}
          onChange={handleInputChange}
          placeholder="Last Name"
          required
        />
        <input
          type="text"
          name="patronymic"
          value={formState.patronymic}
          onChange={handleInputChange}
          placeholder="Patronymic"
          required
        />
        <input
          type="email"
          name="email"
          value={formState.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formState.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
        <input
          type="text"
          name="phoneNumber"
          value={formState.phoneNumber}
          onChange={handleInputChange}
          placeholder="Phone Number"
          required
        />
        <select
          name="sex"
          value={formState.sex}
          onChange={(e) => setFormState({ ...formState, sex: parseInt(e.target.value) })}
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
          placeholder="Date of Birth"
          required
        />
        <input
          type="text"
          name="avatarPath"
          value={formState.avatarPath}
          onChange={handleInputChange}
          placeholder="Avatar Path"
        />
        <button type="submit">{isUpdate ? 'Update User' : 'Create User/Employee'}</button>
      </form>
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <p>{user.firstName} {user.lastName} {user.patronymic}</p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phoneNumber}</p>
            <p>Role: {roles[user.id]}</p>
            <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
            <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersRoles;
