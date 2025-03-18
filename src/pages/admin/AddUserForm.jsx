import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../../assets/AddUserForm.css";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

const AddUserForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in by checking sessionStorage
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");

    if (!userId || userRole !== "admin") {
      navigate("/"); // Redirect to login page if not logged in or not admin
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        console.log(formData);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, formData);
      
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User created successfully and login credentials sent to email',
        });
        setFormData({ name: "", email: "", phoneNumber: "" });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong!');
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.response?.data?.error || 'Error adding user'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <div className="content">
          <form className="add-user-form" onSubmit={handleSubmit}>
            <h2>Add New User</h2>
            {error && <div className="error-message">{error}</div>}
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </label>
            <label>
              Phone Number:
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Adding User...' : 'Add User'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;
