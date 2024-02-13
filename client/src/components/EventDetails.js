import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    location: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    fetch(`https://eventplanner-cf0e.onrender.com/event/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        return response.json();
      })
      .then(data => {
        setEvent(data);
        setFormData({
          location: data.location,
          date: data.date,
          time: data.time
        });
      })
      .catch(error => {
        console.error('Error fetching event details:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/event/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update event');
        }
        console.log('Event updated successfully');
        
      })
      .catch(error => {
        console.error('Error updating event:', error);
      });
  };

  if (!event) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="event-details-container">
      <div className="event-details">
      <h2>{event.title}</h2>
        <p>Location: {event.location}</p>
        <p>Date: {event.date}</p>
        <p>Time: {event.time}</p>
        <h2>Guests:</h2>
        <ul className="guest-list">
        {event?.guests?.map(guest => (
          <li key={guest.id}>{guest.username}</li>
          ))}
        </ul>
      </div>
      <form className="event-form" onSubmit={handleSubmit}>
        <label>
          Location:
          <input type="text" name="location" value={formData.location} onChange={handleChange} />
        </label>
        <label>
          Date:
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </label>
        <label>
          Time:
          <input type="time" name="time" value={formData.time} onChange={handleChange} />
        </label>
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EventDetails;
