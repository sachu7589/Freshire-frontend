import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Swal from 'sweetalert2';
import "../../assets/ViewProgress.css";

const EmployeeProgress = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userName = sessionStorage.getItem('userName');
    if (!userName) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchEmployeeProgress = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/contacts/`);
        const result = await response.json();
        
        if (result.success) {
          // Use the viewStatistics data directly from the API response
          if (result.viewStatistics && result.viewStatistics.length > 0) {
            // Map the data to match our component's expected format
            const formattedData = result.viewStatistics.map(stat => ({
              id: stat._id,
              name: stat.employeeName,
              totalCalls: stat.totalContacts,
              completedCalls: stat.viewedCount,
              remainingCalls: stat.notViewedCount
            }));
            
            // Sort by completedCalls in descending order
            formattedData.sort((a, b) => b.completedCalls - a.completedCalls);
            setEmployeeData(formattedData);
          } else {
            // Fallback to the old method if viewStatistics is not available
            const employeeMap = new Map();
            
            result.data.forEach(contact => {
              const employeeId = contact.employeeId._id || contact.employeeId;
              const employeeName = contact.employeeId.name || contact.employeeName;
              
              if (!employeeMap.has(employeeId)) {
                employeeMap.set(employeeId, {
                  id: employeeId,
                  name: employeeName,
                  totalCalls: 0,
                  completedCalls: 0,
                  remainingCalls: 0
                });
              }
              
              const employeeStats = employeeMap.get(employeeId);
              employeeStats.totalCalls++;
              
              if (contact.view === 1) {
                employeeStats.completedCalls++;
              } else {
                employeeStats.remainingCalls++;
              }
            });
            
            // Convert to array and sort by completedCalls in descending order
            const sortedData = Array.from(employeeMap.values())
              .sort((a, b) => b.completedCalls - a.completedCalls);
            
            setEmployeeData(sortedData);
          }
        } else {
          setError(result.message || 'Failed to fetch employee progress data');
        }
      } catch (error) {
        console.error('Error fetching employee progress:', error);
        setError('An error occurred while fetching data');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load employee progress data'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeProgress();
  }, []);

  // Get top performers data
  const getTopCaller = () => {
    if (!employeeData.length) return { name: 'N/A', completedCalls: 0 };
    return employeeData[0]; // Already sorted by completedCalls
  };

  const getLeastCalls = () => {
    if (!employeeData.length) return { name: 'N/A', completedCalls: 0 };
    return [...employeeData].sort((a, b) => a.completedCalls - b.completedCalls)[0];
  };

  const getLeastRemaining = () => {
    if (!employeeData.length) return { name: 'N/A', remainingCalls: 0 };
    return [...employeeData].sort((a, b) => a.remainingCalls - b.remainingCalls)[0];
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <div className="table-container">
          <h2>Employee Progress</h2>
          
          {loading ? (
            <p>Loading employee data...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              <div className="stats-cards" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div className="stat-card" style={{ 
                  flex: 1, 
                  backgroundColor: '#e3f2fd', 
                  padding: '15px', 
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                  <h4>Top Caller</h4>
                  <p className="stat-name">{getTopCaller().name}</p>
                  <p className="stat-value">{getTopCaller().completedCalls} completed calls</p>
                </div>
                
                <div className="stat-card" style={{ 
                  flex: 1, 
                  backgroundColor: '#fff8e1', 
                  padding: '15px', 
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                  <h4>Least Calls</h4>
                  <p className="stat-name">{getLeastCalls().name}</p>
                  <p className="stat-value">{getLeastCalls().completedCalls} completed calls</p>
                </div>
                
                <div className="stat-card" style={{ 
                  flex: 1, 
                  backgroundColor: '#e8f5e9', 
                  padding: '15px', 
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                  <h4>Least Remaining</h4>
                  <p className="stat-name">{getLeastRemaining().name}</p>
                  <p className="stat-value">{getLeastRemaining().remainingCalls} remaining calls</p>
                </div>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Assigned Data</th>
                    <th>Completed Calls</th>
                    <th>Remaining Calls</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeData.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <span style={{
                          backgroundColor: '#e6f3ff',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          display: 'inline-block',
                          fontWeight: '500',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          {employee.name}
                        </span>
                      </td>
                      <td>{employee.totalCalls}</td>
                      <td>{employee.completedCalls}</td>
                      <td>{employee.remainingCalls}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProgress;
