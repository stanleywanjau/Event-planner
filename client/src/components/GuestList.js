import React from 'react';
import { useNavigate } from 'react-router-dom';

const GuestList = ({guests,handleDeleteGuest}) => {

  const navigate = useNavigate();

  

  const handleGuestClick = (guestname,guestId) => {
    navigate(`/guest/${guestname}/${guestId}`);
  };

  const create_guest = () => {
    navigate(`/createguest`);
  };

  
  return (
    <div className="guest-list-container">
      <h2>Guest List</h2>
      <button onClick={create_guest}>add guest</button>
      <ul className="guest-list">
        {guests.map((guest) => (
          <li key={guest.id} className="guest-item" >
            <span className="guest-name">Name: {guest.name}</span>
            <span className="guest-email">Email: {guest.email}</span>
            <span className="guest-status">Status: {guest.status}</span>
            <button onClick={() => handleGuestClick(guest.name,guest.id)}>view details</button>
            <button onClick={() => handleDeleteGuest(guest.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuestList;
