import React, { useState, useEffect} from "react";
import { Route, Routes,useNavigate  } from 'react-router-dom';
import EventList from './EventList'; 
import EventDetails from './EventDetails';
import EventForm from './EventForm';
import GuestList from './GuestList';
import GuestDetails from './GuestDetails'; 
import Navbar from './Navbar';
import GuestForm from './GuestForm';
import EventGuest from './EventGuest';
import RegisterForm from '../authentication/RegistrationForm';
import LoginForm from "../authentication/LoginForm";
import Home from "./Home";



const App = () => {
  const [events, setEvents] = useState([]);
  const [guests, setGuests] = useState([]);
  const [user, setUser] = useState(null);
  // const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      fetch(`https://eventplanner-cf0e.onrender.com/check_session`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        // credentials: 'include'
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to check session');
        }
      })
      .then(userData => {
        setUser(userData[0]);
        navigate(window.location.pathname); 
      })
      .catch(error => {
        console.error('Error checking session:', error);
        
      });
    };

    // if (accessToken) {
      checkSession();
    // }
  }, [navigate]);
  
  
  // Fetch events and guests
  useEffect(() => {
    fetch(`https://eventplanner-cf0e.onrender.com/events`)
      .then((r) => r.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));

    fetch(`https://eventplanner-cf0e.onrender.com/guests`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch guests');
        }
        return response.json();
      })
      .then(data => {
        setGuests(data);
      })
      .catch(error => {
        console.error('Error fetching guests:', error);
      });
  }, []);

  // Delete event
  function handleDeleteEvent(eventId) {
    if (window.confirm("Are you sure you want to delete this event?")) {
      fetch(`https://eventplanner-cf0e.onrender.com/event/${eventId}`, {
        method: "DELETE",
      }).then((r) => {
        if (r.ok) {
          setEvents((events) => events.filter((event) => event.id !== eventId));
        }
      });
    }
  }

  // Delete guest
  const handleDeleteGuest = (guestId) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      fetch(`https://eventplanner-cf0e.onrender.com/guest/${guestId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to delete guest');
          }
          // Remove the deleted guest from the guests state
          setGuests(guests.filter(guest => guest.id !== guestId));
        })
        .catch(error => {
          console.error('Error deleting guest:', error);
        });
    }
  };

  // Logout
  // console.log(user)

  // If the user is not logged in, show login and registration forms
  if (!localStorage.getItem('jwt')) {
    return (
      <Routes>
        
        <Route path="/" exact element={<RegisterForm />}/>  
        <Route path="/login" exact element={<LoginForm />}/>
      </Routes>
    )}
  

  // If the user is logged in, show the content
  return (
    <>
    <Navbar setUser={setUser} user={user}/>
      <Routes>
        <Route path="/home" element={<Home/>}/>
        <Route path="/events" exact element={<EventList events={events} handleDeleteEvent={handleDeleteEvent}/>}/>
        <Route path="/event/:event/:id" element={<EventDetails />}/>
        <Route path="/create-event" element={<EventForm user={user} />}/>
        <Route path="/guests" element={<GuestList guests={guests} handleDeleteGuest={handleDeleteGuest}  />}/>
        <Route path="/guest/:guestname/:id" element={<GuestDetails />}/>
        <Route path="/createguest" element={<GuestForm />}/>
        <Route path="/inviteguest" element={<EventGuest events={events}  guests={guests}   />}/>
        
      </Routes>
    </>
  );
    
};

export default App;
