import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import Swal from "sweetalert2";
import '../../assets/AssignWorks.css';

export default function AssignWorks() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadingEmployeeId, setUploadingEmployeeId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");

    if (!userId || userRole !== "admin") {
      navigate("/");
    }

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/employees`);
        if (response.status === 200) {
          // Filter only active employees
          const activeEmployees = response.data.filter(emp => emp.status === 'active');
          setEmployees(activeEmployees);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching employees');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [navigate]);

  const handleFileSelect = (employeeId, file) => {
    setSelectedFiles({
      ...selectedFiles,
      [employeeId]: file
    });
  };

  const handleFileUpload = async (employeeId) => {
    const file = selectedFiles[employeeId];
    if (!file) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please select a file first'
      });
      return;
    }
  
    // Check if file is Excel format
    const fileType = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls'].includes(fileType)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please upload only Excel files (.xlsx or .xls)'
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);  // Make sure this matches the multer field name
  
    try {
      setUploadingEmployeeId(employeeId);
      setUploadProgress(0);
      
      console.log('Uploading file:', {
        employeeId,
        fileName: file.name,
        fileSize: file.size
      });
  
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/contacts/upload/${employeeId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      );
  
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Excel data uploaded and processed successfully!'
        });
        setSelectedFiles({
          ...selectedFiles,
          [employeeId]: null
        });
        document.getElementById(`file-${employeeId}`).value = '';
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: err.response?.data?.message || err.message
      });
    } finally {
      setUploadingEmployeeId(null);
      setUploadProgress(0);
    }
  };

  // Add this function to filter employees
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <div className="sticky-header">
        </div>
        <div className="assign-works-wrapper">
          <div className="header-section">
            <h1 className="page-title" style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1.5rem',
              textAlign: 'left',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '0.75rem'
            }}>Assign Work to Cold Callers</h1>
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading employees...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <span className="error-icon">⚠️</span>
              <p className="error-message">{error}</p>
            </div>
          ) : (
            <div className="assign-works-grid">
              {filteredEmployees.length === 0 ? (
                <div className="no-results">
                  <i className="fas fa-search"></i>
                  <p>No employees found matching "{searchTerm}"</p>
                </div>
              ) : (
                filteredEmployees.map((employee) => (
                  <div key={employee._id} className="employee-card">
                    <div className="employee-header">
                      <div className="avatar">
                        {employee.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="employee-details">
                        <h3 className="employee-name">{employee.name}</h3>
                        <span className="employee-role">Cold Caller</span>
                      </div>
                    </div>
                    
                    <div className="contact-info">
                      <div className="info-item">
                        <i className="fas fa-envelope"></i>
                        <span>{employee.email}</span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-phone"></i>
                        <span>{employee.phoneNumber}</span>
                      </div>
                    </div>

                    <div className="file-upload-section">
                      <div className="file-input-wrapper">
                        <input
                          type="file"
                          id={`file-${employee._id}`}
                          onChange={(e) => handleFileSelect(employee._id, e.target.files[0])}
                          className="file-input"
                          accept=".xlsx,.xls"
                        />
                        <label 
                          htmlFor={`file-${employee._id}`}
                          className="file-input-label"
                        >
                          <i className="fas fa-cloud-upload-alt"></i>
                          {selectedFiles[employee._id]
                            ? selectedFiles[employee._id].name
                            : 'Choose Excel File'}
                        </label>
                      </div>

                      {uploadingEmployeeId === employee._id && (
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div 
                              className="progress-bar-fill"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <span className="progress-text">{uploadProgress}%</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleFileUpload(employee._id)}
                        className={`upload-button ${uploadingEmployeeId === employee._id ? 'uploading' : ''}`}
                        disabled={!selectedFiles[employee._id] || uploadingEmployeeId === employee._id}
                      >
                        {uploadingEmployeeId === employee._id ? (
                          <span>Uploading...</span>
                        ) : (
                          <span>Upload Work File</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
