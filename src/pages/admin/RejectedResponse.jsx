import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ChevronRight, Search, Filter, AlertCircle, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

const RejectedResponse = () => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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
            .filter(item => item.view === 1)
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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load response data'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  const filteredAndSortedData = useMemo(() => {
    return [...progressData]
      .filter(item => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
          item.name.toLowerCase().includes(searchLower) ||
          item.companyName.toLowerCase().includes(searchLower) ||
          item.status.toLowerCase().includes(searchLower);

        const matchesStatus = filterStatus === 'all' || 
          item.status.toLowerCase() === filterStatus.toLowerCase();

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [progressData, searchQuery, filterStatus, sortOrder]);

  const handleViewDetails = (item) => {
    Swal.fire({
      title: 'Response Details',
      html: `
        <div class="details-container" style="text-align: left;">
          <div class="detail-group">
            <h3 style="font-size: 16px; color: #374151; margin-bottom: 12px; font-weight: 600;">
              Contact Information
            </h3>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px;">
              <p style="margin: 8px 0; font-size: 14px;"><strong>Name:</strong> ${item.name}</p>
              <p style="margin: 8px 0; font-size: 14px;"><strong>Company:</strong> ${item.companyName}</p>
              <p style="margin: 8px 0; font-size: 14px;"><strong>Phone:</strong> ${item.phone}</p>
            </div>
          </div>
          
          <div class="detail-group" style="margin-top: 20px;">
            <h3 style="font-size: 16px; color: #374151; margin-bottom: 12px; font-weight: 600;">
              Response Status
            </h3>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px;">
              <p style="margin: 8px 0; font-size: 14px;">
                <strong>Status:</strong> 
                <span style="background-color: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; margin-left: 4px; font-size: 12px;">
                  ${item.status}
                </span>
              </p>
              <p style="margin: 8px 0; font-size: 14px;"><strong>Date:</strong> ${item.date}</p>
            </div>
          </div>
          
          ${item.notes ? `
            <div class="detail-group" style="margin-top: 20px;">
              <h3 style="font-size: 16px; color: #374151; margin-bottom: 12px; font-weight: 600;">
                Additional Notes
              </h3>
              <div style="background: #f3f4f6; padding: 16px; border-radius: 8px;">
                <p style="margin: 0; color: #374151; line-height: 1.5; font-size: 14px;">${item.notes}</p>
              </div>
            </div>
          ` : ''}
        </div>
      `,
      width: '500px',
      padding: '20px',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'swal2-popup-custom',
        closeButton: 'swal2-close-custom'
      }
    });
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <div className="progress-container">
          {/* Header Section */}
          <div className="progress-header">
            <div className="header-left">
              <h1>Rejected Responses</h1>
              <div className="breadcrumb">
                <span>Dashboard</span>
                <ChevronRight size={16} />
                <span className="current">Rejected Responses</span>
              </div>
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
                <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
              )}
            </div>

            <div className="filter-sort-group">
              {/* <div className="filter-dropdown">
                <Filter size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div> */}

              <div className="sort-dropdown">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#fff',
                    fontSize: '14px',
                    color: '#4a5568',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            Showing {filteredAndSortedData.length} of {progressData.length} responses
          </div>

          {/* Response List */}
          <div className="table-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <span>Loading responses...</span>
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
                <h3>No Results Found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="progress-list" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                padding: '20px'
              }}>
                {filteredAndSortedData.map((item) => (
                  <div key={item.id} className="progress-item rejected-item" style={{
                    border: '2px solid #ff0000',
                    backgroundColor: '#fff5f5',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div className="item-header">
                      <div className="user-info">
                        <div className="user-avatar">{item.name[0]}</div>
                        <div className="user-details">
                          <h3>{item.name}</h3>
                          <span>{item.companyName}</span>
                        </div>
                      </div>
                      <div className="status-tag">
                        <span className="status status-rejected" style={{backgroundColor: '#dc2626', color: 'white'}}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="item-body">
                      <div className="info-grid">
                        <div className="info-item">
                          <span>Phone: {item.phone}</span>
                        </div>
                        <div className="info-item">
                          <span>Date: {item.date}</span>
                        </div>
                      </div>
                      {item.notes && (
                        <div className="notes-section">
                          <p>{item.notes.length > 100 ? `${item.notes.substring(0, 100)}...` : item.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="item-footer">
                      <button 
                        className="view-details-button"
                        onClick={() => handleViewDetails(item)}
                      >
                        <Eye size={16} />
                        View Details
                      </button>
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

export default RejectedResponse;
