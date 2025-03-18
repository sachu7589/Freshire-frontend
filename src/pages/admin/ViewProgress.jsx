import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import "../../assets/ViewProgress.css";
import { X, Check, ChevronRight, Clock, AlertCircle, Inbox, Phone, Calendar, Eye, Search, Filter } from 'lucide-react';
import Swal from 'sweetalert2';

const ViewProgress = () => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  // Status configuration with categories
  const statusConfig = {
    called: {
      label: 'Called',
      color: 'status-called',
      category: 'pending'
    },
    not_responding: {
      label: 'Not Responding',
      color: 'status-not-responding',
      category: 'pending'
    },
    interested: {
      label: 'Interested',
      color: 'status-interested',
      category: 'interested'
    },
    not_interested: {
      label: 'Not Interested',
      color: 'status-not-interested',
      category: 'not-interested'
    },
    wrong_number: {
      label: 'Wrong Number',
      color: 'status-wrong-number',
      category: 'pending'
    },
    callback: {
      label: 'Callback',
      color: 'status-callback',
      category: 'pending'
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/contact-updates`);
        const result = await response.json();
        
        if (result.success) {
          const formattedData = result.data
            .filter(item => item.view === 0)
            .map(item => ({
              id: item._id,
              name: item.employeeid.name,
              companyName: item.contactid.companyName,
              phone: item.contactid.phone,
              status: item.status.toLowerCase().replace(' ', '_'),
              notes: item.notes,
              view: item.view,
              createdAt: item.createdAt,
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

  // Filter and sort data with tab filtering
  const filteredAndSortedData = useMemo(() => {
    return [...progressData]
      .filter(item => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
          item.name.toLowerCase().includes(searchLower) ||
          item.companyName.toLowerCase().includes(searchLower) ||
          item.phone.includes(searchLower);
        
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        
        // Single date filtering
        const matchesDate = !selectedDate || 
          new Date(item.createdAt).toDateString() === new Date(selectedDate).toDateString();

        const matchesTab = activeTab === 'all' || 
          statusConfig[item.status]?.category === activeTab;

        return matchesSearch && matchesStatus && matchesTab && matchesDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [progressData, searchQuery, filterStatus, sortOrder, activeTab, selectedDate]);

  // Handle status update
  const handleUpdateView = async (id, viewValue) => {
    try {
      const actionText = viewValue === 1 ? "reject" : "approve";
      
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to ${actionText} this item?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${actionText} it!`
      });

      if (result.isConfirmed) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/contact-updates/${id}/view/${viewValue}`, {
          method: 'PATCH'
        });
        const data = await response.json();
        
        if (data.success) {
          setProgressData(prevData => prevData.filter(item => item.id !== id));
          Swal.fire({
            title: `${viewValue === 1 ? 'Rejected' : 'Approved'}!`,
            text: `Item has been ${viewValue === 1 ? 'rejected' : 'approved'} successfully.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error(data.message || 'Failed to update status');
        }
      }
    } catch (error) {
      console.error('Error updating view:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'An error occurred while updating the status',
        icon: 'error'
      });
    }
  };

  const handleClearDate = () => {
    setSelectedDate('');
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <div className="progress-container">
          {/* Header Section */}
          <div className="progress-header">
            <div className="header-left">
              <h1>Progress Overview</h1>
              <div className="breadcrumb">
                <span>Dashboard</span>
                <ChevronRight size={16} />
                <span className="current">Progress</span>
              </div>
            </div>
            <div className="header-stats">
              <div className="stat-box">
                <div className="stat-icon">
                  <Clock size={20} />
                </div>
                <div className="stat-text">
                  <span className="stat-number">{filteredAndSortedData.length}</span>
                  <span className="stat-label">Pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="status-tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
              <span className="tab-count">
                {progressData.length}
              </span>
            </button>
            <button 
              className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
              <span className="tab-count">
                {progressData.filter(item => statusConfig[item.status]?.category === 'pending').length}
              </span>
            </button>
            <button 
              className={`tab ${activeTab === 'interested' ? 'active' : ''}`}
              onClick={() => setActiveTab('interested')}
            >
              Interested
              <span className="tab-count">
                {progressData.filter(item => statusConfig[item.status]?.category === 'interested').length}
              </span>
            </button>
            <button 
              className={`tab ${activeTab === 'not-interested' ? 'active' : ''}`}
              onClick={() => setActiveTab('not-interested')}
            >
              Not Interested
              <span className="tab-count">
                {progressData.filter(item => statusConfig[item.status]?.category === 'not-interested').length}
              </span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="search-filter-bar">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by name, company or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-sort-group">
              <div className="date-filter">
                <Calendar size={20} />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  placeholder="Select Date"
                />
                <button 
                  className={`clear-date ${!selectedDate ? 'hidden' : ''}`}
                  onClick={handleClearDate}
                  title="Clear date filter"
                >
                  <X size={16} />
                </button>
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
            Showing {filteredAndSortedData.length} of {progressData.length} items
          </div>

          {/* Content */}
          <div className="progress-content">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <span>Loading data...</span>
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
                {filteredAndSortedData.map((item, index) => (
                  <div key={item.id} className="progress-item">
                    <div className="item-header">
                      <div className="user-info">
                        <div className="user-avatar">
                          {item.name.charAt(0)}
                        </div>
                        <div className="user-details">
                          <h3>{item.name}</h3>
                          <span>{item.companyName}</span>
                        </div>
                      </div>
                      <div className="status-tag">
                        <span className={`status ${statusConfig[item.status]?.color || 'status-default'}`}>
                          {statusConfig[item.status]?.label || item.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="item-body">
                      <div className="info-grid">
                        <div className="info-item">
                          <Phone size={16} />
                          <span>{item.phone}</span>
                        </div>
                        <div className="info-item">
                          <Calendar size={16} />
                          <span>{item.date}</span>
                        </div>
                      </div>
                      <div className="notes">
                        <p>{item.notes}</p>
                      </div>
                    </div>

                    <div className="item-footer">
                      <button className="btn-secondary">
                        <Eye size={16} />
                        View Details
                      </button>
                      <div className="action-buttons">
                        <button 
                          className="btn-success"
                          onClick={() => handleUpdateView(item.id, 2)}
                        >
                          <Check size={16} />
                          Approve
                        </button>
                        <button 
                          className="btn-danger"
                          onClick={() => handleUpdateView(item.id, 1)}
                        >
                          <X size={16} />
                          Reject
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

export default ViewProgress;
