import { useState } from 'react'
import '../assets/Login.css'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
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
        setIsLoading(false);
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-main">
      <div className="login-background"></div>
      <div className="login-container">
        
        {error && <div className="error-message">{error}</div>}
        <div className="login-form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
            <h1 className="login-heading">FresHire</h1>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className={`login-submit-btn ${isLoading ? 'loading' : ''}`} type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner-circle"></div>
                  <div className="spinner-circle"></div>
                  <div className="spinner-circle"></div>
                </div>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
