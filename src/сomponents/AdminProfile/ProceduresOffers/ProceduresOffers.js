import React, { useState, useEffect } from 'react';
import './ProceduresOffers.css';

const ProceduresOffers = () => {
  const [procedures, setProcedures] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [procedureFormState, setProcedureFormState] = useState({
    id: '',
    name: '',
    description: '',
    type: '',
    price: 0,
    specialOfferId: ''
  });
  const [specialOfferFormState, setSpecialOfferFormState] = useState({
    id: '',
    detail: '',
    newPrice: 0
  });
  const [isUpdateProcedure, setIsUpdateProcedure] = useState(false);
  const [isUpdateSpecialOffer, setIsUpdateSpecialOffer] = useState(false);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchProcedures();
    fetchSpecialOffers();
  }, []);

  const fetchProcedures = async () => {
    try {
      const response = await fetch('https://localhost:7235/api/Procedure', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProcedures(data.value);
      } else {
        console.error('Failed to fetch procedures');
      }
    } catch (error) {
      console.error('Error fetching procedures:', error);
    }
  };

  const fetchSpecialOffers = async () => {
    try {
      const response = await fetch('https://localhost:7235/api/SpecialOffer', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSpecialOffers(data.value);
      } else {
        console.error('Failed to fetch special offers');
      }
    } catch (error) {
      console.error('Error fetching special offers:', error);
    }
  };

  const handleProcedureInputChange = (e) => {
    const { name, value } = e.target;
    setProcedureFormState({ ...procedureFormState, [name]: value });
  };

  const handleSpecialOfferInputChange = (e) => {
    const { name, value } = e.target;
    setSpecialOfferFormState({ ...specialOfferFormState, [name]: value });
  };

  const handleProcedureSubmit = async (e) => {
    e.preventDefault();
    const url = "https://localhost:7235/api/Procedure";
    const method = isUpdateProcedure ? 'PUT' : 'POST';
    const body = {
      ...procedureFormState,
      id: isUpdateProcedure ? procedureFormState.id : "3fa85f64-5717-4562-b3fc-2c963f66afa6"
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
        fetchProcedures();
        setProcedureFormState({
          id: '',
          name: '',
          description: '',
          type: '',
          price: 0,
          specialOfferId: ''
        });
        setIsUpdateProcedure(false);
      } else {
        console.error('Failed to submit procedure');
      }
    } catch (error) {
      console.error('Error submitting procedure:', error);
    }
  };

  const handleSpecialOfferSubmit = async (e) => {
    e.preventDefault();
    const url = "https://localhost:7235/api/SpecialOffer";
    const method = isUpdateSpecialOffer ? 'PUT' : 'POST';
    const body = {
      ...specialOfferFormState,
      id: isUpdateSpecialOffer ? specialOfferFormState.id : "3fa85f64-5717-4562-b3fc-2c963f66afa6"
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
        fetchSpecialOffers();
        setSpecialOfferFormState({
          id: '',
          detail: '',
          newPrice: 0
        });
        setIsUpdateSpecialOffer(false);
      } else {
        console.error('Failed to submit special offer');
      }
    } catch (error) {
      console.error('Error submitting special offer:', error);
    }
  };

  const handleProcedureEdit = (procedure) => {
    setProcedureFormState(procedure);
    setIsUpdateProcedure(true);
  };

  const handleSpecialOfferEdit = (specialOffer) => {
    setSpecialOfferFormState(specialOffer);
    setIsUpdateSpecialOffer(true);
  };

  const handleProcedureDelete = async (id) => {
    try {
      const response = await fetch(`https://localhost:7235/api/Procedure/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status === 204) {
        fetchProcedures(); // Refresh procedures after successful deletion
      } else {
        const data = await response.json();
        if (data.success) {
          fetchProcedures(); // Refresh procedures after successful deletion
        } else {
          console.error('Failed to delete procedure');
        }
      }
    } catch (error) {
      console.error('Error deleting procedure:', error);
    }
  };

  const handleSpecialOfferDelete = async (id) => {
    try {
      const response = await fetch(`https://localhost:7235/api/SpecialOffer/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status === 204) {
        fetchSpecialOffers(); // Refresh special offers after successful deletion
      } else {
        const data = await response.json();
        if (data.success) {
          fetchSpecialOffers(); // Refresh special offers after successful deletion
        } else {
          console.error('Failed to delete special offer');
        }
      }
    } catch (error) {
      console.error('Error deleting special offer:', error);
    }
  };

  return (
    <div className="procedures-offers">
      <h2>Управление процедурами</h2>
      <form onSubmit={handleProcedureSubmit}>
        <input
          type="text"
          name="name"
          value={procedureFormState.name}
          onChange={handleProcedureInputChange}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="description"
          value={procedureFormState.description}
          onChange={handleProcedureInputChange}
          placeholder="Description"
          required
        />
        <input
          type="text"
          name="type"
          value={procedureFormState.type}
          onChange={handleProcedureInputChange}
          placeholder="Type"
          required
        />
        <input
          type="number"
          name="price"
          value={procedureFormState.price}
          onChange={handleProcedureInputChange}
          placeholder="Price"
          required
        />
        <select
          name="specialOfferId"
          value={procedureFormState.specialOfferId}
          onChange={handleProcedureInputChange}
        >
          <option value="">Select Special Offer</option>
          {specialOffers.map((offer) => (
            <option key={offer.id} value={offer.id}>
              {offer.detail}
            </option>
          ))}
        </select>
        <button type="submit">{isUpdateProcedure ? 'Update' : 'Create'}</button>
      </form>
      <h2>Существующие процедуры</h2>
      <div className="procedure-list">
        {procedures.map((procedure) => (
          <div key={procedure.id} className="procedure-item">
            <p>{procedure.name}</p>
            <p>{procedure.description}</p>
            <p>Type: {procedure.type}</p>
            <p>Price: {procedure.price}</p>
            <p>Special Offer ID: {procedure.specialOfferId}</p>
            <button className="edit-button" onClick={() => handleProcedureEdit(procedure)}>Edit</button>
            <button className="delete-button" onClick={() => handleProcedureDelete(procedure.id)}>Delete</button>
          </div>
        ))}
      </div>
      <h2>Управление акциями</h2>
      <form onSubmit={handleSpecialOfferSubmit}>
        <input
          type="text"
          name="detail"
          value={specialOfferFormState.detail}
          onChange={handleSpecialOfferInputChange}
          placeholder="Detail"
          required
        />
        <input
          type="number"
          name="newPrice"
          value={specialOfferFormState.newPrice}
          onChange={handleSpecialOfferInputChange}
          placeholder="New Price"
          required
        />
        <button type="submit">{isUpdateSpecialOffer ? 'Update' : 'Create'}</button>
      </form>
      <h2>Существующие Акции</h2>
      <div className="special-offer-list">
        {specialOffers.map((offer) => (
          <div key={offer.id} className="special-offer-item">
            <p>{offer.detail}</p>
            <p>New Price: {offer.newPrice}</p>
            <button className="edit-button" onClick={() => handleSpecialOfferEdit(offer)}>Edit</button>
            <button className="delete-button" onClick={() => handleSpecialOfferDelete(offer.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProceduresOffers;
