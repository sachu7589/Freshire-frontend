import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import "../../assets/ViewProgress.css";
import { ChevronRight, Search, Filter, AlertCircle, MessageCircle, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import '../../assets/AcceptResponse.css'

const AcceptResponse = () => {
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
            .filter(item => item.view === 2)
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
        <div class="details-container">
          <div class="detail-group">
            <h3 style="font-size: 18px; color: #2c3e50; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 8px;">
              Contact Information
            </h3>
            <p style="margin: 12px 0; font-size: 15px;"><strong style="color: #34495e;">Name:</strong> <span style="color: #2c3e50;">${item.name}</span></p>
            <p style="margin: 12px 0; font-size: 15px;"><strong style="color: #34495e;">Company:</strong> <span style="color: #2c3e50;">${item.companyName}</span></p>
            <p style="margin: 12px 0; font-size: 15px;"><strong style="color: #34495e;">Phone:</strong> <span style="color: #2c3e50;">${item.phone}</span></p>
          </div>
          <div class="detail-group" style="margin-top: 25px;">
            <h3 style="font-size: 18px; color: #2c3e50; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 8px;">
              Response Status
            </h3>
            <p style="margin: 12px 0; font-size: 15px;">
              <strong style="color: #34495e;">Status:</strong> 
              <span class="status status-${item.status.toLowerCase().replace(' ', '-')}" style="margin-left: 8px; padding: 6px 12px; border-radius: 6px; font-weight: 500;">
                ${item.status}
              </span>
            </p>
            <p style="margin: 12px 0; font-size: 15px;"><strong style="color: #34495e;">Date:</strong> <span style="color: #2c3e50;">${item.date}</span></p>
          </div>
          ${item.notes ? `
            <div class="detail-group" style="margin-top: 25px;">
              <h3 style="font-size: 18px; color: #2c3e50; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 8px;">
                Additional Notes
              </h3>
              <div class="notes-section" style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db;">
                <p style="margin: 0; color: #2c3e50; line-height: 1.6; font-size: 15px;">${item.notes}</p>
              </div>
            </div>
          ` : ''}
        </div>
      `,
      customClass: {
        container: 'details-modal',
        popup: 'details-popup',
        content: 'details-content'
      },
      width: '600px',
      showCloseButton: true,
      showConfirmButton: false
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
              <h1>Accepted Responses</h1>
              <div className="breadcrumb">
                <span>Dashboard</span>
                <ChevronRight size={16} />
                <span className="current">Accepted Responses</span>
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
              <div className="filter-dropdown">
                <Filter size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="interested">Interested</option>
                  <option value="not interested">Not Interested</option>
                  <option value="called">Called</option>
                  <option value="not responding">Not Responding</option>
                </select>
              </div>

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
              <div className="progress-list">
                {filteredAndSortedData.map((item) => (
                  <div key={item.id} className="progress-item">
                    <div className="item-header">
                      <div className="user-info">
                        <div className="user-avatar">{item.name[0]}</div>
                        <div className="user-details">
                          <h3>{item.name}</h3>
                          <span>{item.companyName}</span>
                        </div>
                      </div>
                      <div className="status-tag">
                        <span className={`status status-${item.status.toLowerCase().replace(' ', '-')}`}>
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

export default AcceptResponse;
