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

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'white' }}>
        </div>
        <div className="content" style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', padding: '20px 24px 0', zIndex: 99 }}>
            <h2>Employee List</h2>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <table className="employees-table">
                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 98 }}>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phoneNumber}</td>
                      <td>
                        <span style={{
                          backgroundColor: employee.status === 'active' ? '#28a745' : '#dc3545',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          display: 'inline-block'
                        }}>
                          {employee.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          style={{
                            backgroundColor: employee.status === 'active' ? '#dc3545' : '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleStatusToggle(employee._id, employee.status)}
                        >
                          {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployees;
