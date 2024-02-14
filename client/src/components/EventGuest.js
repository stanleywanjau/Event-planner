import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EventGuest = ({ events, guests }) => {
  const { event_id, guest_id } = useParams();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [invitationSuccess, setInvitationSuccess] = useState(false);

  useEffect(() => {
    // Find the event based on the provided event_id
    const foundEvent = events.find(event => event.id === parseInt(event_id));
    if (foundEvent) {
      setSelectedEvent(foundEvent);
    }

    // Find the guest based on the provided guest_id
    const foundGuest = guests.find(guest => guest.id === parseInt(guest_id));
    if (foundGuest) {
      setSelectedGuest(foundGuest);
    }
  }, [event_id, guest_id, events, guests]);

  const associateGuestWithEvent = () => {
    if (selectedEvent && selectedGuest) {
      fetch(`https://eventplanner-cf0e.onrender.com/event/${selectedEvent.id}/guest/${selectedGuest.id}`, {
        method: 'POST'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to associate guest with event');
          }
          return response.json();
        })
        .then(data => {
          setInvitationSuccess(true); 
          // Optionally, you can perform additional actions after successful association
        })
        .catch(error => {
          console.error('Error associating guest with event:', error);
        });
    }
  };

  return (
    <div>
      <h2>EventGuest Component</h2>
      {invitationSuccess }
      <div>
        <label htmlFor="event-select">Select an Event:</label>
        <select id="event-select" value={selectedEvent ? selectedEvent.id : ''} onChange={(e) => setSelectedEvent(events.find(event => event.id === parseInt(e.target.value)))}>
          <option value="">Select an event</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="guest-select">Select a Guest:</label>
        <select id="guest-select" value={selectedGuest ? selectedGuest.id : ''} onChange={(e) => setSelectedGuest(guests.find(guest => guest.id === parseInt(e.target.value)))}>
          <option value="">Select a guest</option>
          {guests.map(guest => (
            <option key={guest.id} value={guest.id}>{guest.name}</option>
          ))}
        </select>
      </div>
      <button onClick={associateGuestWithEvent} disabled={!selectedEvent || !selectedGuest}>Associate Guest with Event</button>
    </div>
  );
};

export default EventGuest;
