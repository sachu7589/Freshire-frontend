import { useState, useEffect } from 'react'
import '../assets/Login.css'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate, Link } from 'react-router-dom'
import { FaLock, FaUser, FaShieldAlt } from 'react-icons/fa'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const navigate = useNavigate()

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < 768

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
          confirmButtonColor: '#233ce6'
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
        confirmButtonColor: '#233ce6'
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className={`login-card ${isMobile ? 'mobile-login-card' : ''}`}>
        {/* Left Panel - Hidden on mobile */}
        {!isMobile && (
          <div className="login-brand-panel">
            <div className="brand-content">
              <img src="/logo_white.png" alt="FresHire Logo" className="brand-logo" />
              <h1>Welcome to FresHire</h1>
              <p>
                Welcome back to FresHire's internal platform. Access your team's 
                resources and administrative tools with secure authentication.
              </p>
              
              <div className="security-notice">
                <p>
                  <strong>CONFIDENTIAL:</strong> This system contains proprietary information. 
                  Unauthorized access is prohibited. Please safeguard your credentials 
                  and ensure secure login practices.
                </p>
              </div>
            </div>

            <div className="brand-footer">
              <div className="security-feature">
                <div className="icon-circle">
                  <FaShieldAlt />
                </div>
                <div className="feature-text">
                  <h3>Secure Access</h3>
                  <p>Proprietary FresHire security system with advanced protection</p>
                </div>
              </div>
              
              <div className="copyright">
                © 2025 Freshire. All rights reserved.
              </div>
            </div>
          </div>
        )}

        {/* Right Panel - Login Form */}
        <div className={`login-form-panel ${isMobile ? 'mobile-form-panel' : ''}`}>
          <div className="form-wrapper">
            {isMobile && (
              <div className="mobile-header">
                <img 
                  src="/logo.png" 
                  alt="FresHire Logo" 
                  className="mobile-logo" 
                  style={{ 
                    width: '100px', 
                    marginBottom: '1.5rem',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }} 
                />
              </div>
            )}
            
            <h2>Sign in to your account</h2>
            <p className="form-subtitle">
              Enter your credentials to access your dashboard
            </p>

            {error && <div className="error-alert">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="username">Email Address</label>
                <div className="input-with-icon">
                  <FaUser className="field-icon" />
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <FaLock className="field-icon" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
                style={{
                  backgroundColor: '#233ce6',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: '600',
                  width: '100%',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  marginTop: '1rem',
                  fontSize: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '48px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a2fc9'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#233ce6'}
              >
                {isLoading ? (
                  <div className="loading-dots" style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}>
                    <span style={{ 
                      backgroundColor: '#ffffff', 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      display: 'inline-block',
                      animation: 'bounce 1.4s infinite ease-in-out both' 
                    }}></span>
                    <span style={{ 
                      backgroundColor: '#ffffff', 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      display: 'inline-block',
                      animation: 'bounce 1.4s infinite ease-in-out both',
                      animationDelay: '0.2s'
                    }}></span>
                    <span style={{ 
                      backgroundColor: '#ffffff', 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      display: 'inline-block',
                      animation: 'bounce 1.4s infinite ease-in-out both',
                      animationDelay: '0.4s'
                    }}></span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="form-footer">
              <Link to="/" className="home-link">
                Return to Home Page
              </Link>
            </div>
            
            {isMobile && (
              <div className="mobile-footer">
                <div className="security-badge" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '1.5rem 0 1rem',
                  fontSize: '0.8rem',
                  color: '#666'
                }}>
                  <FaShieldAlt style={{ marginRight: '0.5rem', color: '#233ce6' }} />
                  <span>Secure Enterprise Login</span>
                </div>
                <div className="copyright" style={{ 
                  textAlign: 'center', 
                  fontSize: '0.75rem', 
                  color: '#888',
                  marginBottom: '0.5rem'
                }}>
                  © 2025 Freshire. All rights reserved.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
