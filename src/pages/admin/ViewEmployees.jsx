import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ChevronRight, Users, Search, Filter, UserCheck, UserX, Phone, Mail } from 'lucide-react';

import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import "../../assets/ViewProgress.css";

const ViewEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Check if user is logged in
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");

    if (!userId || userRole !== "admin") {
      navigate("/");
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

    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to ${action} this employee?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${action}!`
      });

      if (result.isConfirmed) {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/employees/${employeeId}`, {
          status: newStatus
        });

        if (response.status === 200) {
          const updatedEmployee = response.data.employee;
          setEmployees(employees.map(emp => 
            emp._id === employeeId ? updatedEmployee : emp
          ));
          
          Swal.fire({
            title: 'Updated!',
            text: `Employee has been ${action}d successfully.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }
      }
    } catch (err) {
      Swal.fire(
        'Error!',
        err.response?.data?.message || 'Error updating employee status',
        'error'
      );
    }
  };

  // Filter employees based on search and active tab
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        employee.name.toLowerCase().includes(searchLower) ||
        employee.email.toLowerCase().includes(searchLower) ||
        employee.phoneNumber.toLowerCase().includes(searchLower);
      
      const matchesTab = activeTab === 'all' || employee.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [employees, searchTerm, activeTab]);

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <div className="progress-container">
          {/* Header Section */}
          <div className="progress-header">
            <div className="header-left">
              <h1>Employee Management</h1>
              <div className="breadcrumb">
                <span>Dashboard</span>
                <ChevronRight size={16} />
                <span className="current">Employees</span>
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="status-tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Employees
              <span className="tab-count">{employees.length}</span>
            </button>
            <button 
              className={`tab ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active
              <span className="tab-count">
                {employees.filter(emp => emp.status === 'active').length}
              </span>
            </button>
            <button 
              className={`tab ${activeTab === 'inactive' ? 'active' : ''}`}
              onClick={() => setActiveTab('inactive')}
            >
              Inactive
              <span className="tab-count">
                {employees.filter(emp => emp.status === 'inactive').length}
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="search-filter-bar">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm("")}>
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>

          {/* Employee List */}
          <div className="progress-content">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <span>Loading employees...</span>
              </div>
            ) : error ? (
              <div className="error-state">
                <AlertCircle size={24} />
                <p>{error}</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Users size={48} />
                </div>
                <h3>No Employees Found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="progress-list">
                {filteredEmployees.map((employee) => (
                  <div key={employee._id} className="progress-item">
                    <div className="item-header">
                      <div className="user-info">
                        <div className="user-avatar">{employee.name[0]}</div>
                        <div className="user-details">
                          <h3>{employee.name}</h3>
                          <span>Employee</span>
                        </div>
                      </div>
                      <div className="status-tag">
                        <span className={`status status-${employee.status === 'active' ? 'called' : 'not-responding'}`}>
                          {employee.status}
                        </span>
                      </div>
                    </div>

                    <div className="item-body">
                      <div className="info-grid">
                        <div className="info-item">
                          <Mail size={16} />
                          <span>{employee.email}</span>
                        </div>
                        <div className="info-item">
                          <Phone size={16} />
                          <span>{employee.phoneNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="item-footer">
                      <div className="action-buttons">
                        <button 
                          className={`btn-${employee.status === 'active' ? 'danger' : 'success'}`}
                          onClick={() => handleStatusToggle(employee._id, employee.status)}
                        >
                          {employee.status === 'active' ? (
                            <>
                              <UserX size={16} />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck size={16} />
                              Activate
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployees;
