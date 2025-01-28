import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import Swal from "sweetalert2";

export default function AssignWorks() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadingEmployeeId, setUploadingEmployeeId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'white' }}>
          <TopNav />
        </div>
        <div className="content" style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
              {employees.map((employee) => (
                <div key={employee._id} style={{ 
                  border: 'none',
                  borderRadius: '16px',
                  padding: '24px',
                  width: '320px',
                  backgroundColor: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  ':hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
                  }
                }}>
                  <h3 style={{ 
                    marginTop: 0,
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '16px'
                  }}>{employee.name}</h3>
                  <p style={{
                    color: '#4b5563',
                    fontSize: '0.95rem',
                    marginBottom: '8px'
                  }}>Email: {employee.email}</p>
                  <p style={{
                    color: '#4b5563',
                    fontSize: '0.95rem',
                    marginBottom: '20px'
                  }}>Phone: {employee.phoneNumber}</p>
                  
                  <div style={{ marginTop: '16px' }}>
                    <div>
                      <label 
                        htmlFor={`file-${employee._id}`}
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          color: '#374151',
                          fontWeight: '500'
                        }}
                      >
                        Upload Work File:
                      </label>
                      <input
                        type="file"
                        id={`file-${employee._id}`}
                        onChange={(e) => handleFileSelect(employee._id, e.target.files[0])}
                        style={{ 
                          width: '100%',
                          marginTop: '5px',
                          padding: '8px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: '#f9fafb'
                        }}
                      />
                      {uploadingEmployeeId === employee._id && (
                        <div style={{ 
                          width: '100%', 
                          height: '4px', 
                          backgroundColor: '#e5e7eb',
                          borderRadius: '2px',
                          marginTop: '8px'
                        }}>
                          <div style={{
                            width: `${uploadProgress}%`,
                            height: '100%',
                            backgroundColor: '#4f46e5',
                            borderRadius: '2px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      )}
                      <button
                        onClick={() => handleFileUpload(employee._id)}
                        style={{
                          marginTop: '16px',
                          padding: '10px 20px',
                          backgroundColor: '#4f46e5',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          width: '100%',
                          fontWeight: '500',
                          transition: 'background-color 0.2s',
                          ':hover': {
                            backgroundColor: '#4338ca'
                          },
                          ':disabled': {
                            backgroundColor: '#9ca3af',
                            cursor: 'not-allowed'
                          }
                        }}
                        disabled={!selectedFiles[employee._id] || uploadingEmployeeId === employee._id}
                      >
                        {uploadingEmployeeId === employee._id ? (
                          <span>Uploading... {uploadProgress}%</span>
                        ) : (
                          'Upload File'
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
  );
}
