import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../../assets/AddUserForm.css";
import Sidebar from "./Sidebar";

const AddUserForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [salesOfficerPresent, setSalesOfficerPresent] = useState(false);
  const userRole = sessionStorage.getItem("userRole");

  useEffect(() => {
    // Check if user is logged in
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      navigate("/");
    }

    // Check if there's an active sales officer
    const checkSalesOfficer = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/sales-officer-status`);
        setSalesOfficerPresent(response.data.isPresent);
      } catch (err) {
        console.error("Error checking sales officer status:", err);
      }
    };

    checkSalesOfficer();
  }, [navigate]);

  const canAddUser = () => {
    return userRole === 'sales_officer' || (!salesOfficerPresent && ['admin', 'manager'].includes(userRole));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, formData);
      
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'User Added Successfully',
          text: 'Login credentials have been sent to the provided email address.',
          confirmButtonColor: '#3085d6',
        });
        setFormData({ name: "", email: "", phoneNumber: "" });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An unexpected error occurred');
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.response?.data?.error || 'Unable to add user. Please try again.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content" style={{ padding: '1rem' }}>
        <div className="content-grid" style={{ gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Left Side - Form */}
          <div className="form-section" style={{ flex: '0 1 600px' }}>
            <div className="form-container" style={{ padding: '1.5rem', maxWidth: '100%' }}>
              <div className="form-header" style={{ marginBottom: '1rem' }}>
                <h2 className="form-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Add New User</h2>
                <p className="form-subtitle" style={{ fontSize: '0.875rem', color: 'white' }}>Enter user details to create a new account</p>
              </div>
              
              {!canAddUser() && (
                <div className="permission-notice" style={{ 
                  padding: '0.75rem', 
                  fontSize: '0.875rem', 
                  marginBottom: '1rem' 
                }}>
                  Only Sales Officers can add new users. Other officers can add users only in the absence of a Sales Officer.
                </div>
              )}
              
              <form className="add-user-form" onSubmit={handleSubmit}>
                {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
                
                <div className="form-sections" style={{ gap: '1rem' }}>
                  <div className="form-section" style={{ padding: '0' }}>
                    <h3 className="section-title" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Personal Information</h3>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label htmlFor="name" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Full Name</label>
                      <input
                        style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label htmlFor="email" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email Address</label>
                      <div className="input-wrapper">
                        <input
                          style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          placeholder="Enter email address"
                        />
                        <i className="input-icon email-icon"></i>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label htmlFor="phoneNumber" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Phone Number</label>
                      <div className="input-wrapper">
                        <input
                          style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                          id="phoneNumber"
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          placeholder="Enter phone number"
                        />
                        <i className="input-icon phone-icon"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="submit-button"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  >
                    {loading ? (
                      <span className="loading-state">
                        <span className="loader"></span>
                        Processing...
                      </span>
                    ) : (
                      'Add User'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Terms */}
          <div className="terms-section" style={{ flex: '0 1 400px' }}>
            <div className="terms-container" style={{ padding: '1.5rem' }}>
              <h3 className="terms-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>User Addition Guidelines</h3>
              
              <div className="terms-content" style={{ fontSize: '0.875rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Permission Hierarchy</h4>
                <ul className="terms-list" style={{ marginBottom: '1rem', paddingLeft: '1.25rem' }}>
                  <li style={{ marginBottom: '0.25rem' }}>Sales Officers have primary authority to add new (COLD CALLING) users</li>
                  <li style={{ marginBottom: '0.25rem' }}>In absence of Sales Officers, other officers can add users</li>
                </ul>

                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Required Information</h4>
                <ul className="terms-list" style={{ marginBottom: '1rem', paddingLeft: '1.25rem' }}>
                  <li style={{ marginBottom: '0.25rem' }}>Full Name (as per official documents)</li>
                  <li style={{ marginBottom: '0.25rem' }}>Valid Email Address (for login credentials)</li>
                  <li style={{ marginBottom: '0.25rem' }}>Active Phone Number (for verification)</li>
                </ul>

                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Important Notes</h4>
                <ul className="terms-list" style={{ paddingLeft: '1.25rem' }}>
                  <li style={{ marginBottom: '0.25rem' }}>Verify all information before submission</li>
                  <li style={{ marginBottom: '0.25rem' }}>Login credentials will be sent to the provided email</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;
