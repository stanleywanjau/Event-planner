import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";

function SignUp({ setAccessToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate =useNavigate()

  function handleSubmit(e) {
    e.preventDefault();
    if (username && email && password && password === passwordConfirmation) {
      fetch("https://eventplanner-cf0e.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      }).then((r) => {
        if (r.ok) {
          r.json().then((user) => {
            localStorage.setItem('jwt', user.access_token);
            navigate('/home');
          });
        } else {
          r.json().then((error) => {
            setError(error.message); // Assuming backend returns error message in JSON format
          });
        }
      });
    } else {
      const newErrors = {};
      if (!username) {
        newErrors.username = "Username is required";
      }
      if (!email) {
        newErrors.email = "Email is required";
      }
      if (!password) {
        newErrors.password = "Password is required";
      }
      if (password !== passwordConfirmation) {
        newErrors.passwordConfirmation = "Passwords do not match";
      }
      setErrors(newErrors);
    }
  }
  return (
    <div className='form-get-in'>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            id='username'
            name='username'
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            required
          />
          {errors.username && <div className='error'>{errors.username}</div>}
        </div>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            name='email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
          {errors.email && <div className='error'>{errors.email}</div>}
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
          {errors.password && <div className='error'>{errors.password}</div>}
        </div>
        <div>
          <label htmlFor='passwordConfirmation'>Confirm Password</label>
          <input
            type='password'
            id='passwordConfirmation'
            name='passwordConfirmation'
            value={passwordConfirmation}
            onChange={(e)=>setPasswordConfirmation(e.target.value)}
            required
          />
          {errors.passwordConfirmation && <div className='error'>{errors.passwordConfirmation}</div>}
        </div>
        <button type='submit' className='btn'>Register</button>
      </form>
      <div>
        <p>Already have an account? <Link to='/login'>Log in</Link></p>
      </div>
    </div>
  );
}

export default SignUp;
