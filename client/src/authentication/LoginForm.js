import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate =useNavigate()

  function handleSubmit(e) {
    e.preventDefault();
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((r) => {
      if (r.ok) {
        r.json().then((user) => {setUser(user) 
          navigate(window.location.pathname = '/home')
        } );
      }
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-get-in">
        <h1>Login</h1>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" >Login</button>
      <p>Don't have an account? <Link to='/'>Sign Up</Link></p>
      </form>
    </div>
  );
}

export default Login;