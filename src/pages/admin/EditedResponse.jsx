import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import "../../assets/ViewProgress.css";
import { X, Check } from 'lucide-react';
import Swal from 'sweetalert2';

const EditedResponse = () => {
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
            .filter(item => item.view === 5)
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

  const handleUpdateView = async (id, viewValue) => {
    try {
      const actionText = viewValue === 1 ? "reject" : "approve";
      
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to ${actionText} this item?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${actionText} it!`
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/contact-updates/${id}/view/${viewValue}`, {
            method: 'PATCH'
          });
          const data = await response.json();
          
          if (data.success) {
            setProgressData(prevData => prevData.filter(item => item.id !== id));
            Swal.fire(
              `${viewValue === 1 ? 'Rejected' : 'Approved'}!`,
              `Item has been ${viewValue === 1 ? 'rejected' : 'approved'} successfully.`,
              'success'
            );
          } else {
            Swal.fire(
              'Error',
              data.message || 'Failed to update status',
              'error'
            );
          }
        }
      });
    } catch (error) {
      console.error('Error updating view:', error);
      Swal.fire(
        'Error',
        'An error occurred while updating the status',
        'error'
      );
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <div className="table-container">
          <h2>Edited Responses</h2>
          {loading ? (
            <p>Loading progress data...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : progressData.length === 0 ? (
            <p>No edited responses to review</p>
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
                  <th>Actions</th>
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
                    <td style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <Check 
                        className="approve-btn" 
                        size={20} 
                        onClick={() => handleUpdateView(item.id, 2)}
                        style={{ 
                          cursor: 'pointer',
                          color: 'green',
                          backgroundColor: '#e8f5e9',
                          padding: '4px',
                          borderRadius: '4px'
                        }}
                      />
                      <X 
                        className="reject-btn" 
                        size={20} 
                        onClick={() => handleUpdateView(item.id, 1)}
                        style={{ 
                          cursor: 'pointer',
                          color: 'red',
                          backgroundColor: '#ffebee',
                          padding: '4px',
                          borderRadius: '4px'
                        }}
                      />
                    </td>
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

export default EditedResponse;
