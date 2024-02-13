import React, { useState } from 'react';

const EventForm = ({user}) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const eventData = {
      title,
      location,
      date,
      time,
      user_id :user.id
    };
  
    fetch('https://eventplanner-cf0e.onrender.com/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      return response.json();
    })
    .then(data => {
    
      setMessage(`${data.title} created successfully`);
      // Optionally, you can redirect the user to another page or clear the form
      setTitle('');
      setLocation('');
      setDate('');
      setTime('');
      
    })
    .catch(error => {
      console.error('Error creating event:', error);
      setMessage('Failed to create event');
      // Handle error: show an error message to the user or log it
    });
  };

  return (
    <div className="event-form-container">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <br />
        <label>Location:</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <br />
        <label>Date (dd/mm/yyyy):</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <br />
        <label>Time:
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
        <br />
        
        <button type="submit">Create Event</button>
        {message && <p>{message}</p>} 
      </form>
    </div>
  );
};

export default EventForm;
