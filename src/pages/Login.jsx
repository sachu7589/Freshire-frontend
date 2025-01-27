import { useState } from 'react'
import '../assets/Login.css'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await axios.post('http://localhost:3000/api/users/login', {
        email: username, // Using email as username
        password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // Check if user account is inactive
      if (response.data.user.status === 'inactive') {
        setError('Your account has been disabled');
        Swal.fire({
          icon: 'error',
          title: 'Account Disabled',
          text: 'Your account has been disabled. Please contact the administrator.',
          confirmButtonColor: '#4f46e5'
        });
        setPassword(''); // Clear password field
        return; // Exit early before setting session storage or redirecting
      }
      if (response.data.user) {
        // Start session with user details
        sessionStorage.setItem('userId', response.data.user._id);
        sessionStorage.setItem('userName', response.data.user.name);
        sessionStorage.setItem('userRole', response.data.user.role);
        
        console.log(response.data.message); // Log welcome message
        
        // Redirect based on role
        if (response.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (response.data.user.role === 'employee') {
          navigate('/user/dashboard');
        } else {
          navigate('/'); // Fallback redirect
        }
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || 'An error occurred');
      setPassword(''); // Clear password field
      setError(error.response?.data?.message || 'The email or password you entered is incorrect')
      Swal.fire({
        icon: 'error',
        title: 'Invalid Credentials',
        text: error.response?.data?.message || 'The email or password you entered is incorrect',
        confirmButtonColor: '#4f46e5'
      });
    }
  }

  return (
    <>
      <div className="login-container">
        <h1 className="brand-heading">FresHHire</h1>
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  )
}

export default Login
