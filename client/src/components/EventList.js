import { useNavigate } from "react-router-dom";

const EventList = ({events,handleDeleteEvent}) => {
  
  const navigate = useNavigate();

  

  const navigateToEventDetails = (eventTitle, eventId) => {
    navigate(`/event/${eventTitle}/${eventId}`);
  };
  const create_event = () => {
    navigate(`/create-event`);
  };

  return (
    <div className="event-list-container">
      <h2>Event List</h2>
      <ul className="event-list">
        <button onClick={create_event}>add event</button>
        {events.map((event) => (
          <li key={event.id} className="event-item">
            <span>{event.title}</span>
            <span>{event.location}</span>
            <span>{event.date}</span>
            <button
              onClick={() => navigateToEventDetails(event.title, event.id)}
            >
              view details
            </button>
            <button
              className="delete-button"
              onClick={(e) => {
                handleDeleteEvent(event.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
