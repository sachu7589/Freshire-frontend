import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import "../../assets/ViewProgress.css";

const RejectedResponse = () => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const userName = sessionStorage.getItem('userName');
    if (!userName) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/contact-updates`);
        const result = await response.json();
        
        if (result.success) {
          const formattedData = result.data
            .filter(item => item.view === 1) // Only display items with view value 1
            .map(item => ({
              id: item._id,
              name: item.employeeid.name,
              companyName: item.contactid.companyName,
              phone: item.contactid.phone,
              status: item.status,
              notes: item.notes,
              view: item.view,
              date: new Date(item.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            }));
          setProgressData(formattedData);
        } else {
          setError(result.message || 'Failed to fetch progress data');
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <div className="content-wrapper">
          <h2>Rejected Responses</h2>
          {loading ? (
            <p>Loading progress data...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : progressData.length === 0 ? (
            <p>No rejected responses found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {progressData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <span style={{
                        backgroundColor: '#e6f3ff',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        display: 'inline-block',
                        fontWeight: '500',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        {item.name}
                      </span>
                    </td>
                    <td>{item.companyName}</td>
                    <td>{item.phone}</td>
                    <td>{item.status}</td>
                    <td>{item.notes}</td>
                    <td>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RejectedResponse;
