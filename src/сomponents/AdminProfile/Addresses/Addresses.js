import React, { useState, useEffect } from 'react';
import './Addresses.css';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [formState, setFormState] = useState({
    id: '',
    city: '',
    street: '',
    houseNumber: '',
    apartmentNumber: ''
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('https://localhost:7235/api/Adress', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.value);
      } else {
        console.error('Failed to fetch addresses');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "https://localhost:7235/api/Adress";
    const method = isUpdate ? 'PUT' : 'POST';
    const body = {
      ...formState,
      id: isUpdate ? formState.id : "3fa85f64-5717-4562-b3fc-2c963f66afa6"
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
        fetchAddresses();
        setFormState({
          id: '',
          city: '',
          street: '',
          houseNumber: '',
          apartmentNumber: ''
        });
        setIsUpdate(false);
      } else {
        console.error('Failed to submit address');
      }
    } catch (error) {
      console.error('Error submitting address:', error);
    }
  };

  const handleEdit = (address) => {
    setFormState(address);
    setIsUpdate(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://localhost:7235/api/Adress/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status === 204) {
        fetchAddresses(); // Refresh addresses after successful deletion
      } else {
        const data = await response.json();
        if (data.success) {
          fetchAddresses(); // Refresh addresses after successful deletion
        } else {
          console.error('Failed to delete address');
        }
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  return (
    <div className="addresses">
      <h2>Управление адресами</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="city"
          value={formState.city}
          onChange={handleInputChange}
          placeholder="City"
          required
        />
        <input
          type="text"
          name="street"
          value={formState.street}
          onChange={handleInputChange}
          placeholder="Street"
          required
        />
        <input
          type="text"
          name="houseNumber"
          value={formState.houseNumber}
          onChange={handleInputChange}
          placeholder="House Number"
          required
        />
        <input
          type="number"
          name="apartmentNumber"
          value={formState.apartmentNumber}
          onChange={handleInputChange}
          placeholder="Apartment Number"
          required
        />
        <button type="submit">{isUpdate ? 'Update' : 'Create'}</button>
      </form>
      <h2>Список существующих адресов</h2>
      <div className="address-list">
        {addresses.map((address) => (
          <div key={address.id} className="address-item">
            <p>{address.city}, {address.street}, {address.houseNumber}, кв {address.apartmentNumber}</p>
            <button onClick={() => handleEdit(address)}>Edit</button>
            <button onClick={() => handleDelete(address.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;
