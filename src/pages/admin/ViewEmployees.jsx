import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import "../../assets/ViewEmployees.css";

const ViewEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check if user is logged in by checking sessionStorage
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");

    if (!userId || userRole !== "admin") {
      navigate("/"); // Redirect to login page if not logged in or not admin
    }

    // Fetch employees data
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/employees`);
        if (response.status === 200) {
          setEmployees(response.data);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching employees');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [navigate]);

  const handleStatusToggle = async (employeeId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = currentStatus === 'active' ? 'deactivate' : 'activate';

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this employee?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} it!`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/employees/${employeeId}`, {
            status: newStatus
          });
          if (response.status === 200) {
            // Update the employees list with the new status
            const updatedEmployee = response.data.employee;
            setEmployees(employees.map(emp => 
              emp._id === employeeId ? updatedEmployee : emp
            ));
            Swal.fire(
              'Updated!',
              `Employee has been ${action}d successfully.`,
              'success'
            );
          }
        } catch (err) {
          Swal.fire(
            'Error!',
            err.response?.data?.message || 'Error updating employee status',
            'error'
          );
        }
      }
    });
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <div className="content-wrapper">
          <div className="content-header">
            <h2>Employee Management</h2>
          </div>
          <div className="content-body">
            {loading ? (
              <div className="loader-container">
                <div className="loader-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <p>Loading employee data...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <div className="error-icon">!</div>
                <div className="error-content">
                  <h4>Error</h4>
                  <p>{error}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="search-container">
                  <div className="search-wrapper">
                    <i className="fas fa-search search-icon"></i>
                    <input
                      type="text"
                      placeholder="Search by name, email, or phone number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    {searchTerm && (
                      <button
                        className="search-clear"
                        onClick={() => setSearchTerm("")}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
                <div className="table-container">
                  <table className="employees-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="no-results">
                            No employees found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredEmployees.map((employee) => (
                          <tr key={employee._id}>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.phoneNumber}</td>
                            <td>
                              <span className={`status-badge ${employee.status}`}>
                                {employee.status}
                              </span>
                            </td>
                            <td>
                              <button 
                                className={`action-button ${employee.status === 'active' ? 'deactivate' : 'activate'}`}
                                onClick={() => handleStatusToggle(employee._id, employee.status)}
                              >
                                {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployees;
