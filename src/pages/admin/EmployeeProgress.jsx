import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Swal from 'sweetalert2';
import "../../assets/ViewProgress.css";
import { ChevronRight, Users, Phone, CheckCircle, Clock, AlertCircle, Search, Filter, MessageCircle } from 'lucide-react';

const EmployeeProgress = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState([]);
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

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    return [...employeeData]
      .filter(employee => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
          employee.name.toLowerCase().includes(searchLower) ||
          employee.totalCalls.toString().includes(searchLower) ||
          employee.completedCalls.toString().includes(searchLower);
        
        const matchesStatus = filterStatus === 'all' || 
          (filterStatus === 'high' && (employee.completedCalls / employee.totalCalls) >= 0.75) ||
          (filterStatus === 'medium' && (employee.completedCalls / employee.totalCalls) >= 0.5 && (employee.completedCalls / employee.totalCalls) < 0.75) ||
          (filterStatus === 'low' && (employee.completedCalls / employee.totalCalls) < 0.5);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOrder === 'desc') {
          return b.completedCalls - a.completedCalls;
        }
        return a.completedCalls - b.completedCalls;
      });
  }, [employeeData, searchQuery, filterStatus, sortOrder]);

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

  // Get performance metrics
  const getPerformanceMetrics = () => {
    if (!employeeData.length) return {
      totalEmployees: 0,
      totalCalls: 0,
      completedCalls: 0,
      remainingCalls: 0
    };

    return employeeData.reduce((acc, emp) => ({
      totalEmployees: acc.totalEmployees + 1,
      totalCalls: acc.totalCalls + emp.totalCalls,
      completedCalls: acc.completedCalls + emp.completedCalls,
      remainingCalls: acc.remainingCalls + emp.remainingCalls
    }), {
      totalEmployees: 0,
      totalCalls: 0,
      completedCalls: 0,
      remainingCalls: 0
    });
  };

  const handleWhatsAppMessage = (employee) => {
    const completionRate = ((employee.completedCalls / employee.totalCalls) * 100).toFixed(1);
    const message = `Hi ${employee.name}, 
Here's your current performance update:
- Total Calls: ${employee.totalCalls}
- Completed: ${employee.completedCalls}
- Remaining: ${employee.remainingCalls}
- Completion Rate: ${completionRate}%

Keep up the good work!`;

    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with the pre-filled message
    // Note: phone number should include country code without '+' symbol
    const phoneNumber = employee.phone?.replace(/\D/g, '') || ''; // Remove non-digits
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <div className="progress-container">
          {/* Header Section */}
          <div className="progress-header">
            <div className="header-left">
              <h1>Employee Performance</h1>
              <div className="breadcrumb">
                <span>Dashboard</span>
                <ChevronRight size={16} />
                <span className="current">Performance</span>
              </div>
            </div>
            <div className="header-stats">
              {Object.entries(getPerformanceMetrics()).map(([key, value]) => (
                <div key={key} className="stat-box">
                  <div className="stat-icon">
                    {key === 'totalEmployees' && <Users size={20} />}
                    {key === 'totalCalls' && <Phone size={20} />}
                    {key === 'completedCalls' && <CheckCircle size={20} />}
                    {key === 'remainingCalls' && <Clock size={20} />}
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
                placeholder="Search by name or performance..."
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
              <div className="filter-dropdown">
                <Filter size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Performance</option>
                  <option value="high">High Performers</option>
                  <option value="medium">Medium Performers</option>
                  <option value="low">Low Performers</option>
                </select>
              </div>

              <div className="sort-dropdown">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Highest First</option>
                  <option value="asc">Lowest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            Showing {filteredAndSortedData.length} of {employeeData.length} employees
          </div>

          {/* Top Performers Section */}
          <div className="progress-list">
            <div className="progress-item top-performer">
              <div className="item-header">
                <div className="user-info">
                  <div className="user-avatar">{getTopCaller().name?.[0]}</div>
                  <div className="user-details">
                    <h3>{getTopCaller().name}</h3>
                    <span>Top Performer</span>
                  </div>
                </div>
                <div className="status-tag">
                  <span className="status status-called">
                    {getTopCaller().completedCalls} Calls
                  </span>
                </div>
              </div>
            </div>

            <div className="progress-item needs-improvement">
              <div className="item-header">
                <div className="user-info">
                  <div className="user-avatar">{getLeastCalls().name?.[0]}</div>
                  <div className="user-details">
                    <h3>{getLeastCalls().name}</h3>
                    <span>Needs Improvement</span>
                  </div>
                </div>
                <div className="status-tag">
                  <span className="status status-not-responding">
                    {getLeastCalls().completedCalls} Calls
                  </span>
                </div>
              </div>
            </div>

            <div className="progress-item most-efficient">
              <div className="item-header">
                <div className="user-info">
                  <div className="user-avatar">{getLeastRemaining().name?.[0]}</div>
                  <div className="user-details">
                    <h3>{getLeastRemaining().name}</h3>
                    <span>Most Efficient</span>
                  </div>
                </div>
                <div className="status-tag">
                  <span className="status status-interested">
                    {getLeastRemaining().remainingCalls} Remaining
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Updated Employee List Section */}
          <div className="table-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <span>Loading employee data...</span>
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
                {filteredAndSortedData.map((employee) => {
                  const completionRate = (employee.completedCalls / employee.totalCalls) * 100;
                  const progressClass = completionRate >= 75 ? 'high' : 
                                       completionRate >= 50 ? 'medium' : 'low';
                  
                  return (
                    <div key={employee.id} className="progress-item">
                      <div className="item-header">
                        <div className="user-info">
                          <div className="user-avatar">{employee.name[0]}</div>
                          <div className="user-details">
                            <h3>{employee.name}</h3>
                            <span>Cold Callers</span>
                          </div>
                        </div>
                      </div>
                      <div className="item-body">
                        <div className="info-grid">
                          <div className="info-item">
                            <Phone size={16} />
                            <span>{employee.totalCalls} Total Calls</span>
                          </div>
                          <div className="info-item">
                            <CheckCircle size={16} />
                            <span>{employee.completedCalls} Completed</span>
                          </div>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className={`progress-fill ${progressClass}`}
                            style={{
                              width: `${completionRate}%`
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="item-footer">
                        <div className="completion-stats">
                          <span className="completion-rate">
                            {completionRate.toFixed(1)}% Complete
                          </span>
                          <span className="remaining-calls">
                            {employee.remainingCalls} calls remaining
                          </span>
                        </div>
                        <button 
                          className="whatsapp-button"
                          onClick={() => handleWhatsAppMessage(employee)}
                          title="Send WhatsApp Message"
                        >
                          <MessageCircle size={16} />
                          Send Update
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProgress;
