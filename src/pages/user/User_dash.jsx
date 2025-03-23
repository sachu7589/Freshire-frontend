import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Badge } from "react-bootstrap";
import {
  BsBriefcase,
  BsCheckCircle,
  BsClock,
  BsExclamationTriangle,
  BsBell,
  BsArrowUp,
  BsCalendarCheck,
  BsLightbulb
} from "react-icons/bs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import Sidebar from "./User_sidebar";
import "../../assets/User_dash.css";

function User_dash() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    urgentTasks: 0
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [contactDistribution, setContactDistribution] = useState([]);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  // Task distribution data for pie chart
  const taskDistribution = [
    { name: "Development", value: 40, color: "#3498db" },
    { name: "Design", value: 25, color: "#9b59b6" },
    { name: "Research", value: 20, color: "#2ecc71" },
    { name: "Meetings", value: 15, color: "#f39c12" }
  ];

  // Upcoming deadlines
  const upcomingDeadlines = [
    { id: 1, task: "Complete project proposal", deadline: "Tomorrow, 5:00 PM", priority: "High" },
    { id: 2, task: "Client presentation", deadline: "Wed, 10:00 AM", priority: "Medium" },
    { id: 3, task: "Team review meeting", deadline: "Fri, 2:00 PM", priority: "Low" }
  ];

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");

    if (!userId || userRole !== "employee") {
      navigate("/");
    }

    // Fetch all necessary data
    fetchDashboardData(userId);
  }, [navigate]);

  const fetchDashboardData = async (userId) => {
    try {
      // Fetch current contacts
      const currentResponse = await fetch(`${import.meta.env.VITE_API_URL}/contacts/employee/${userId}`);
      const currentResult = await currentResponse.json();

      // Fetch contact updates
      const updatesResponse = await fetch(`${import.meta.env.VITE_API_URL}/contact-updates`);
      const updatesResult = await updatesResponse.json();

      if (currentResult.success && updatesResult.success) {
        const currentContacts = currentResult.data.filter(contact => contact.view === 0);
        const pastContacts = updatesResult.data.filter(update => update.employeeid._id === userId);

        // Update stats
        setStats({
          totalTasks: currentContacts.length + pastContacts.length,
          completedTasks: pastContacts.filter(contact => 
            ['Interested', 'Not Interested', 'Wrong Number'].includes(contact.status)
          ).length,
          pendingTasks: currentContacts.length,
          urgentTasks: pastContacts.filter(contact => 
            contact.status === 'Call Back'
          ).length
        });

        // Set recent contacts
        setRecentContacts(pastContacts
          .slice(0, 4)
          .map(contact => ({
            id: contact._id,
            action: contact.status,
            task: contact.contactid.companyName,
            time: new Date(contact.createdAt).toRelativeTime(),
            icon: getStatusIcon(contact.status)
          })));

        // Calculate contact distribution
        const distribution = calculateDistribution(pastContacts);
        setContactDistribution(distribution);

        // Set upcoming follow-ups
        const followUps = pastContacts
          .filter(contact => contact.status === 'Call Back')
          .slice(0, 3)
          .map(contact => ({
            id: contact._id,
            task: contact.contactid.companyName,
            deadline: "Follow up required",
            priority: "High"
          }));
        setUpcomingFollowUps(followUps);

        // Calculate performance data for the last 7 days
        const last7Days = Array.from({length: 7}, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date;
        }).reverse();

        const weeklyPerformance = last7Days.map(date => {
          const dayUpdates = updatesResult.data.filter(update => {
            const updateDate = new Date(update.createdAt);
            return update.employeeid._id === userId &&
                   updateDate.getDate() === date.getDate() &&
                   updateDate.getMonth() === date.getMonth() &&
                   updateDate.getFullYear() === date.getFullYear();
          });

          const totalTasks = dayUpdates.length;
          const completedTasks = dayUpdates.filter(update => 
            ['Interested', 'Not Interested', 'Wrong Number'].includes(update.status)
          ).length;

          return {
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            tasks: totalTasks,
            efficiency: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
          };
        });

        setPerformanceData(weeklyPerformance);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Interested': return <BsCheckCircle className="text-success" />;
      case 'Not Interested': return <BsExclamationTriangle className="text-danger" />;
      case 'Call Back': return <BsClock className="text-warning" />;
      default: return <BsBell className="text-primary" />;
    }
  };

  const calculateDistribution = (contacts) => {
    const statusCount = contacts.reduce((acc, contact) => {
      acc[contact.status] = (acc[contact.status] || 0) + 1;
      return acc;
    }, {});

    const total = contacts.length;
    return Object.entries(statusCount).map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100),
      color: getStatusColor(name)
    }));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Interested': return '#2ecc71';
      case 'Not Interested': return '#e74c3c';
      case 'Call Back': return '#f39c12';
      case 'Wrong Number': return '#95a5a6';
      case 'No Response': return '#3498db';
      default: return '#bdc3c7';
    }
  };

  // Function to get priority badge color
  const getPriorityColor = (priority) => {
    switch(priority.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <main className="main-content" style={{ paddingTop: "60px" }}>
          <div className="content-header mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="page-title fw-bold">
                  <span className="text-gradient">Welcome, {sessionStorage.getItem("userName")}</span>
                </h1>
                <p className="text-muted">Here's your performance overview for this week</p>
              </div>
              <div className="d-flex align-items-center">
                <div className="date-display me-4 date-badge">
                  <span className="fw-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          <Row className="stats-cards g-4 mb-4">
            <Col xs={12} sm={6} lg={3}>
              <Card className="stat-card shadow-sm border-0 h-100 hover-lift">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="stat-icon total rounded-circle d-flex align-items-center justify-content-center pulse">
                      <BsBriefcase size={22} />
                    </div>
                    <div className="ms-3">
                      <h6 className="stat-label text-muted mb-1">Total Tasks</h6>
                      <h3 className="stat-value fw-bold mb-0">{stats.totalTasks}</h3>
                    </div>
                  </div>
                  <div className="progress mt-3" style={{ height: "6px" }}>
                    <div className="progress-bar bg-primary" style={{ width: "100%" }}></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <Card className="stat-card shadow-sm border-0 h-100 hover-lift">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="stat-icon completed rounded-circle d-flex align-items-center justify-content-center pulse">
                      <BsCheckCircle size={22} />
                    </div>
                    <div className="ms-3">
                      <h6 className="stat-label text-muted mb-1">Completed</h6>
                      <h3 className="stat-value fw-bold mb-0">{stats.completedTasks}</h3>
                    </div>
                  </div>
                  <div className="progress mt-3" style={{ height: "6px" }}>
                    <div className="progress-bar bg-success" style={{ width: `${(stats.completedTasks/stats.totalTasks)*100}%` }}></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <Card className="stat-card shadow-sm border-0 h-100 hover-lift">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="stat-icon pending rounded-circle d-flex align-items-center justify-content-center pulse">
                      <BsClock size={22} />
                    </div>
                    <div className="ms-3">
                      <h6 className="stat-label text-muted mb-1">Pending</h6>
                      <h3 className="stat-value fw-bold mb-0">{stats.pendingTasks}</h3>
                    </div>
                  </div>
                  <div className="progress mt-3" style={{ height: "6px" }}>
                    <div className="progress-bar bg-warning" style={{ width: `${(stats.pendingTasks/stats.totalTasks)*100}%` }}></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <Card className="stat-card shadow-sm border-0 h-100 hover-lift">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="stat-icon urgent rounded-circle d-flex align-items-center justify-content-center pulse">
                      <BsExclamationTriangle size={22} />
                    </div>
                    <div className="ms-3">
                      <h6 className="stat-label text-muted mb-1">Urgent</h6>
                      <h3 className="stat-value fw-bold mb-0">{stats.urgentTasks}</h3>
                    </div>
                  </div>
                  <div className="progress mt-3" style={{ height: "6px" }}>
                    <div className="progress-bar bg-danger" style={{ width: `${(stats.urgentTasks/stats.totalTasks)*100}%` }}></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            <Col xs={12} lg={8}>
              <Card className="shadow-sm border-0 h-100 hover-lift">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title fw-bold mb-0">Weekly Performance</h5>
                    <div className="chart-legend d-flex">
                      <div className="me-3 d-flex align-items-center">
                        <div className="legend-dot bg-primary me-2" style={{ width: "10px", height: "10px", borderRadius: "50%" }}></div>
                        <span className="small">Tasks</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="legend-dot bg-info me-2" style={{ width: "10px", height: "10px", borderRadius: "50%" }}></div>
                        <span className="small">Efficiency</span>
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3498db" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3498db" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2ecc71" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: 'none', 
                          borderRadius: '8px', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="tasks" 
                        stroke="#3498db" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorTasks)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="efficiency" 
                        stroke="#2ecc71" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorEfficiency)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} lg={4}>
              <Card className="shadow-sm border-0 h-100 hover-lift">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title fw-bold mb-0">Task Distribution</h5>
                  </div>
                  <div className="text-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={taskDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {taskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [`${value}%`, name]}
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: 'none', 
                            borderRadius: '8px', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-3 d-flex flex-wrap justify-content-center">
                      {taskDistribution.map((item, index) => (
                        <div key={index} className="mx-2 mb-2 d-flex align-items-center">
                          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: item.color, marginRight: "5px" }}></div>
                          <span className="small">{item.name} ({item.value}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            <Col xs={12} lg={6}>
              <Card className="shadow-sm border-0 h-100 hover-lift">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                      <div className="activity-icon me-2">
                        <BsClock size={20} className="text-primary" />
                      </div>
                      <h5 className="card-title fw-bold mb-0">Recent Activities</h5>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="badge bg-gradient rounded-pill px-3 py-2">
                        {recentContacts.length} New Updates
                      </span>
                    </div>
                  </div>
                  <div className="activities-list">
                    {recentContacts.map((activity) => (
                      <div 
                        key={activity.id} 
                        className="activity-item mb-3 pb-3 border-bottom"
                        onClick={() => navigate('/user/past')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex">
                          <div className="activity-icon me-3 bg-light rounded-circle p-2">
                            {activity.icon}
                          </div>
                          <div>
                            <h6 className="mb-1 fw-semibold">{activity.action}</h6>
                            <p className="mb-1">{activity.task}</p>
                            <small className="text-muted">{activity.time}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="text-center mt-3">
                      <button 
                        className="btn btn-outline-primary btn-sm rounded-pill"
                        onClick={() => navigate('/user/past')}
                      >
                        View All Activities
                      </button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} lg={6}>
              <Card className="shadow-sm border-0 h-100 hover-lift">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title fw-bold mb-0">Contact Status Overview</h5>
                    <button 
                      className="btn btn-outline-primary btn-sm rounded-pill"
                      onClick={() => navigate('/user/database')}
                    >
                      View Database
                    </button>
                  </div>
                  <div className="status-overview">
                    {contactDistribution.map((status, index) => (
                      <div key={index} className="status-item mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="status-label">
                            <div className="d-flex align-items-center">
                              <div 
                                className="status-dot me-2" 
                                style={{ 
                                  width: '10px', 
                                  height: '10px', 
                                  borderRadius: '50%', 
                                  backgroundColor: status.color 
                                }}
                              ></div>
                              {status.name}
                            </div>
                          </span>
                          <span className="status-value fw-bold">{status.value}%</span>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{ 
                              width: `${status.value}%`, 
                              backgroundColor: status.color 
                            }} 
                            aria-valuenow={status.value} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Total Contacts Handled</h6>
                      <span className="fw-bold">{stats.totalTasks}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Response Rate</h6>
                      <span className="fw-bold">
                        {stats.totalTasks ? 
                          `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%` : 
                          '0%'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Pending Follow-ups</h6>
                      <span className="fw-bold text-warning">{stats.urgentTasks}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </main>
      </div>
    </div>
  );
}

// Add this helper function
Date.prototype.toRelativeTime = function() {
  const now = new Date();
  const diff = now - this;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

export default User_dash;
