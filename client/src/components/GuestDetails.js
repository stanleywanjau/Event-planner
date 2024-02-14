import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GuestDetails = () => {
  const { id } = useParams();
  const [guest, setGuest] = useState(null);
  

  useEffect(() => {
    fetch(`https://eventplanner-cf0e.onrender.com/guest/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch guest details');
        }
        return response.json();
      })
      .then(data => {
        setGuest(data);
      })
      .catch(error => {
        console.error('Error fetching guest details:', error);
      });
  }, [id]);

  const handleStatusUpdate = () => {
    if (window.confirm(`Are you sure you want to change the status to 'confirmed'?`)) {
      fetch(`/guest/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'confirmed' })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to update guest status');
          }
          // Update the guest status in the state
          setGuest({ ...guest, status: 'confirmed' });
        })
        .catch(error => {
          console.error('Error updating guest status:', error);
        });
    }
  };

  if (!guest) {
    return <div>Loading...</div>;
  }

  return (
    <div className="guest-details-container">
      <h2>Guest Details</h2>
      <div className="guest-info">
        <p><strong>ID:</strong> {guest.id}</p>
        <p><strong>Name:</strong> {guest.name}</p>
        <p><strong>Status:</strong> {guest.status}</p>
        <button onClick={handleStatusUpdate}>Confirm Invite</button>
      </div>
      <div className="guest-events">
        <h3>Events</h3>
        <ul className="event-list">
          {guest.events?.length > 0 ? (
            guest.events.map((event) => (
              <li key={event.id} className="event-item">
                <span><strong>Title:</strong> {event.title}</span>
                <span><strong>Location:</strong> {event.location}</span>
              </li>
            ))
          ) : (
            <li>{guest.message}</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GuestDetails;
