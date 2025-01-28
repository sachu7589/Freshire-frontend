import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import "../../assets/ViewProgress.css";
import { X } from 'lucide-react';
import Swal from 'sweetalert2';

const ViewProgress = () => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  
  useEffect(() => {
    const userName = sessionStorage.getItem('userName');
    if (!userName) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/contact-updates`);
        const result = await response.json();
        
        if (result.success) {
          const formattedData = result.data
            .filter(item => item.view === 0)
            .map(item => ({
              id: item._id, // Added id to track items
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
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    fetchProgressData();
  }, []);

  const handleUpdateView = async (id) => {
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to remove this item?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/contact-updates/${id}/view`, {
            method: 'PATCH'
          });
          const data = await response.json();
          
          if (data.success) {
            setProgressData(prevData => prevData.filter(item => item.id !== id));
            Swal.fire(
              'Removed!',
              'Item has been removed successfully.',
              'success'
            );
          }
        }
      });
    } catch (error) {
      console.error('Error updating view:', error);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <div className="table-container">
          <h2>Candidate Progress</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company Name</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Date</th>
                <th>Action</th>
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
                  <td>
                    <X 
                      className="delete-btn" 
                      size={20} 
                      onClick={() => handleUpdateView(item.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewProgress;
