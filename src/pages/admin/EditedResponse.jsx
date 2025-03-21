import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import "../../assets/ViewProgress.css";
import { X, Check, ChevronRight, AlertCircle, Search, Filter, Eye, Clock } from 'lucide-react';
import Swal from 'sweetalert2';

const EditedResponse = () => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  
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

  // Filter and sort data
  const filteredAndSortedData = progressData
    .filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return !searchQuery || 
        item.name.toLowerCase().includes(searchLower) ||
        item.companyName.toLowerCase().includes(searchLower) ||
        item.phone.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower);
    })
    .sort((a, b) => {
      const dateA = new Date(a.date.split(' ').reverse().join(' '));
      const dateB = new Date(b.date.split(' ').reverse().join(' '));
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

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

  // Get summary metrics
  const getSummaryMetrics = () => {
    return {
      totalResponses: progressData.length,
      pendingReview: progressData.length,
      recentUpdates: progressData.filter(item => {
        const itemDate = new Date(item.date.split(' ').reverse().join(' '));
        const today = new Date();
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(today.getDate() - 3);
        return itemDate >= threeDaysAgo;
      }).length
    };
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <div className="progress-container">
          {/* Header Section */}
          <div className="progress-header">
            <div className="header-left">
              <h1>Edited Responses</h1>
              <div className="breadcrumb">
                <span>Dashboard</span>
                <ChevronRight size={16} />
                <span className="current">Edited Responses</span>
              </div>
            </div>
            <div className="header-stats">
              {Object.entries(getSummaryMetrics()).map(([key, value]) => (
                <div key={key} className="stat-box">
                  <div className="stat-icon">
                    {key === 'totalResponses' && <Eye size={20} />}
                    {key === 'pendingReview' && <Clock size={20} />}
                    {key === 'recentUpdates' && <AlertCircle size={20} />}
                  </div>
                  <div className="stat-text">
                    <span className="stat-number">{value}</span>
                    <span className="stat-label">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="search-filter-bar">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by name, company or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </button>
              )}
            </div>

            <div className="filter-sort-group">
              <div className="sort-dropdown">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            Showing {filteredAndSortedData.length} of {progressData.length} edited responses
          </div>

          {/* Response List Section */}
          <div className="table-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <span>Loading edited responses...</span>
              </div>
            ) : error ? (
              <div className="error-state">
                <AlertCircle size={24} />
                <p>{error}</p>
              </div>
            ) : filteredAndSortedData.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Search size={48} />
                </div>
                <h3>No Edited Responses Found</h3>
                <p>There are no edited responses to review at this time</p>
              </div>
            ) : (
              <div className="progress-list">
                {filteredAndSortedData.map((item, index) => (
                  <div key={index} className="progress-item">
                    <div className="item-header">
                      <div className="user-info">
                        <div className="user-avatar">{item.name[0]}</div>
                        <div className="user-details">
                          <h3>{item.name}</h3>
                          <span>{item.companyName}</span>
                        </div>
                      </div>
                      <div className="status-tag">
                        <span className="status status-edited">
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="item-body">
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">Phone:</span>
                          <span className="info-value">{item.phone}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Date:</span>
                          <span className="info-value">{item.date}</span>
                        </div>
                      </div>
                      <div className="notes-section">
                        <h4>Notes:</h4>
                        <p>{item.notes}</p>
                      </div>
                    </div>
                    <div className="item-footer">
                      <div className="action-buttons">
                        <button 
                          className="action-button approve"
                          onClick={() => handleUpdateView(item.id, 2)}
                        >
                          <Check size={18} />
                          <span>Approve</span>
                        </button>
                        <button 
                          className="action-button reject"
                          onClick={() => handleUpdateView(item.id, 1)}
                        >
                          <X size={18} />
                          <span>Reject</span>
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

      <style jsx>{`
        .progress-container {
          padding: 24px;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        
        .header-left h1 {
          font-size: 28px;
          margin-bottom: 8px;
          color: #333;
        }
        
        .breadcrumb {
          display: flex;
          align-items: center;
          color: #666;
          font-size: 14px;
        }
        
        .breadcrumb .current {
          font-weight: 500;
          color: #333;
        }
        
        .header-stats {
          display: flex;
          gap: 16px;
        }
        
        .stat-box {
          background: white;
          border-radius: 8px;
          padding: 16px;
          min-width: 140px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .stat-icon {
          background: #f0f4f9;
          border-radius: 8px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4a6bdf;
        }
        
        .stat-text {
          display: flex;
          flex-direction: column;
        }
        
        .stat-number {
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }
        
        .stat-label {
          font-size: 13px;
          color: #666;
        }
        
        .search-filter-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 16px;
        }
        
        .search-box {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border-radius: 8px;
          padding: 0 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .search-box input {
          flex: 1;
          border: none;
          padding: 12px 16px;
          font-size: 15px;
          outline: none;
        }
        
        .clear-search {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #666;
        }
        
        .filter-sort-group {
          display: flex;
          gap: 12px;
        }
        
        .filter-dropdown, .sort-dropdown {
          background: white;
          border-radius: 8px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .filter-dropdown select, .sort-dropdown select {
          border: none;
          padding: 12px 8px;
          font-size: 15px;
          background: transparent;
          outline: none;
          cursor: pointer;
        }
        
        .results-summary {
          font-size: 14px;
          color: #666;
          margin-bottom: 16px;
        }
        
        .progress-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }
        
        .progress-item {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
        }
        
        .item-header {
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #4a6bdf;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 18px;
        }
        
        .


                    .user-details h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }
          
          .user-details span {
            font-size: 14px;
            color: #666;
          }
          
          .status-tag {
            display: flex;
            align-items: center;
          }
          
          .status {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
          }
          
          .status-edited {
            background-color: #e3f2fd;
            color: #1565c0;
          }
          
          .item-body {
            padding: 16px;
            flex: 1;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 16px;
          }
          
          .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          
          .info-label {
            font-size: 13px;
            color: #666;
          }
          
          .info-value {
            font-size: 15px;
            color: #333;
          }
          
          .notes-section {
            margin-top: 16px;
          }
          
          .notes-section h4 {
            font-size: 15px;
            margin: 0 0 8px 0;
            color: #555;
          }
          
          .notes-section p {
            font-size: 14px;
            line-height: 1.5;
            color: #444;
            background: #f9f9f9;
            padding: 12px;
            border-radius: 6px;
            margin: 0;
          }
          
          .item-footer {
            padding: 16px;
            border-top: 1px solid #f0f0f0;
          }
          
          .action-buttons {
            display: flex;
            gap: 12px;
          }
          
          .action-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .action-button.approve {
            background-color: #e8f5e9;
            color: #2e7d32;
          }
          
          .action-button.approve:hover {
            background-color: #c8e6c9;
          }
          
          .action-button.reject {
            background-color: #ffebee;
            color: #c62828;
          }
          
          .action-button.reject:hover {
            background-color: #ffcdd2;
          }
          
          .loading-state, .error-state, .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px 0;
            text-align: center;
          }
          
          .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 4px solid #3498db;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .empty-icon {
            margin-bottom: 16px;
            color: #aaa;
          }
          
          .empty-state h3 {
            margin: 0 0 8px 0;
            color: #555;
          }
          
          .empty-state p {
            color: #777;
            margin: 0;
          }
      `}</style>
    </div>
  );
};

export default EditedResponse;
