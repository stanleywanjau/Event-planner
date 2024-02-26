// Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate=useNavigate()
  // function handleLogoutClick() {
  //   fetch("https://eventplanner-cf0e.onrender.com/logout", { method: "post" })
  //     .then((response) => {
  //       if (response.ok) {
  //         setUser(null);
  //         navigate('/login');
  //       } else {
  //         throw new Error('Logout failed');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error logging out:', error);
        
  //     });
  // }
  function handleLogoutClick() {
    localStorage.removeItem('jwt');
    navigate('/login');
  }

  return (
    <header>
      <div className="navbar">
        {user ? (
          <>
            <h1>Welcome, {user.username}</h1>
            <button onClick={handleLogoutClick}>Logout</button>
            <div className="dropdown">
              <button className="dropbtn">Guests</button>
              <div className="dropdown-content">
                <Link to="/guests">View Guests</Link>
                <Link to="/createguest">Add Guest</Link>
              </div>
            </div>
            <div className="dropdown">
              <button className="dropbtn">Events</button>
              <div className="dropdown-content">
                <Link to="/events">View Events</Link>
                <Link to="/create-event">Add Event</Link>
                <Link to="/inviteguest">Invite Guest</Link>
              </div>
            </div>
            <div className="dropdown">
              <button className="dropbtn">Home</button>
              <div className="dropdown-content">
              <Link to='/home'>Home</Link>
                
              </div>
            </div>
            
          </>
        ) : (
          <>
            <Link to="/login">login</Link>
          </>
        )} 
      </div>
    </header>
  );
};

export default Navbar;
