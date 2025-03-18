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
      <div className="main-content">
        <div className="content-grid">
          {/* Left Side - Form */}
          <div className="form-section">
            <div className="form-container">
              <div className="form-header">
                <h2 className="form-title">Add New User</h2>
                <p className="form-subtitle">Enter user details to create a new account</p>
              </div>
              
              {!canAddUser() && (
                <div className="permission-notice">
                  Only Sales Officers can add new users. Other officers can add users only in the absence of a Sales Officer.
                </div>
              )}
              
              <form className="add-user-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-sections">
                  <div className="form-section">
                    <h3 className="section-title">Personal Information</h3>
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
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

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <div className="input-wrapper">
                        <input
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

                    <div className="form-group">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <div className="input-wrapper">
                        <input
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

                <div className="form-actions">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="submit-button"
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
          <div className="terms-section">
            <div className="terms-container">
              <h3 className="terms-title">User Addition Guidelines</h3>
              
              <div className="terms-content">
                <h4>Permission Hierarchy</h4>
                <ul className="terms-list">
                  <li>Sales Officers have primary authority to add new (COLD CALLING) users</li>
                  <li>In absence of Sales Officers, other officers can add users</li>
                </ul>

                <h4>Required Information</h4>
                <ul className="terms-list">
                  <li>Full Name (as per official documents)</li>
                  <li>Valid Email Address (for login credentials)</li>
                  <li>Active Phone Number (for verification)</li>
                </ul>

                <h4>Important Notes</h4>
                <ul className="terms-list">
                  <li>Verify all information before submission</li>
                  <li>Login credentials will be sent to the provided email</li>
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
