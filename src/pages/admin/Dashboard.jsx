import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Table, Badge, ProgressBar } from "react-bootstrap";
import { FaUsers, FaBriefcase, FaCalendarCheck, FaChartLine, FaArrowUp, FaArrowDown, FaFileUpload, FaExchangeAlt, FaUserPlus } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import "../../assets/Dashboard.css";
import axios from "axios";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Phone, AlertCircle, Check, X, Clock } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingWorks: 0,
    completedWorks: 0
  });

  const [recentUpdates, setRecentUpdates] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  const [recentApplications, setRecentApplications] = useState([
    { id: 1, name: "John Doe", position: "Frontend Developer", date: "2023-06-15", status: "Shortlisted" },
    { id: 2, name: "Jane Smith", position: "UX Designer", date: "2023-06-14", status: "In Review" },
    { id: 3, name: "Robert Johnson", position: "Project Manager", date: "2023-06-13", status: "Interviewed" },
    { id: 4, name: "Emily Davis", position: "Backend Developer", date: "2023-06-12", status: "Rejected" },
    { id: 5, name: "Michael Wilson", position: "DevOps Engineer", date: "2023-06-11", status: "Hired" }
  ]);

  const [upcomingInterviews, setUpcomingInterviews] = useState([
    { id: 1, candidate: "Alex Thompson", position: "Data Analyst", time: "10:00 AM", date: "2023-06-20" },
    { id: 2, candidate: "Sarah Parker", position: "Marketing Specialist", time: "2:30 PM", date: "2023-06-21" },
    { id: 3, candidate: "David Miller", position: "Full Stack Developer", time: "11:15 AM", date: "2023-06-22" }
  ]);

  const [recentActivities, setRecentActivities] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Performance data for the area chart
  const performanceData = [
    { name: "Mon", employees: 24, efficiency: 85 },
    { name: "Tue", employees: 28, efficiency: 90 },
    { name: "Wed", employees: 26, efficiency: 87 },
    { name: "Thu", employees: 32, efficiency: 92 },
    { name: "Fri", employees: 30, efficiency: 88 },
    { name: "Sat", employees: 25, efficiency: 85 },
    { name: "Sun", employees: 27, efficiency: 89 }
  ];

  // Task distribution data for pie chart
  const taskDistribution = [
    { name: "Completed", value: 45, color: "#2ecc71" },
    { name: "In Progress", value: 35, color: "#3498db" },
    { name: "Pending", value: 20, color: "#f39c12" }
  ];

  // Recent activities
  const recentActivitiesData = [
    { id: 1, action: "New employee joined", name: "John Doe", time: "2 hours ago", icon: <FaUsers className="text-primary" /> },
    { id: 2, action: "Task completed", name: "Project Alpha", time: "4 hours ago", icon: <FaCalendarCheck className="text-success" /> },
    { id: 3, action: "New project assigned", name: "Market Research", time: "Yesterday", icon: <FaBriefcase className="text-info" /> },
    { id: 4, action: "Performance review", name: "Team Meeting", time: "Yesterday", icon: <FaChartLine className="text-warning" /> }
  ];

  // Add new state for top performers data
  const [topPerformersData, setTopPerformersData] = useState([]);

  useEffect(() => {
    // Check if user is logged in by checking sessionStorage
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");

    if (!userId || userRole !== "admin") {
      navigate("/"); // Redirect to login page if not logged in or not admin
    }
    
    const fetchDashboardData = async () => {
      try {
        // Fetch employees data
        const employeesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users/employees`);
        const employees = employeesResponse.data;
        
        // Fetch recent progress updates
        const updatesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/contact-updates`);
        const updates = updatesResponse.data.data;

        setStats({
          totalEmployees: employees.length,
          activeEmployees: employees.filter(emp => emp.status === 'active').length,
          pendingWorks: updates.filter(update => update.status === 'Pending').length,
          completedWorks: updates.filter(update => update.status === 'Completed').length
        });

        // Set recent updates
        setRecentUpdates(
          updates
            .filter(update => update.view === 0)
            .slice(0, 5)
            .map(update => ({
              id: update._id,
              name: update.employeeid.name,
              company: update.contactid.companyName,
              status: update.status,
              date: new Date(update.createdAt).toLocaleDateString()
            }))
        );

        // Set recent users
        setRecentUsers(
          employees
            .slice(0, 5)
            .map(emp => ({
              id: emp._id,
              name: emp.name,
              email: emp.email,
              status: emp.status
            }))
        );

        // Fetch employee progress data
        const progressResponse = await axios.get(`${import.meta.env.VITE_API_URL}/contacts/`);
        if (progressResponse.data.success && progressResponse.data.viewStatistics) {
          // Process data for top performers
          const sortedPerformers = progressResponse.data.viewStatistics
            .map(stat => ({
              name: stat.employeeName,
              total: stat.totalContacts,
              completed: stat.viewedCount,
              remaining: stat.notViewedCount
            }))
            .sort((a, b) => b.completed - a.completed)
            .slice(0, 5);

          setTopPerformersData(sortedPerformers);

          // ... existing task distribution calculation ...
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();

    // Update the fetchRecentActivities function
    const fetchRecentActivities = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/contact-updates`);
        if (response.data.success) {
          const recentUpdates = response.data.data
            .filter(update => update.view === 0)
            .slice(0, 5)
            .map(update => ({
              id: update._id,
              action: `Updated status to ${update.status}`,
              name: update.contactid.companyName,
              time: new Date(update.createdAt).toLocaleString(),
              icon: getStatusIcon(update.status),
              status: update.status.toLowerCase().replace(' ', '_')
            }));
          setRecentActivities(recentUpdates);
        }
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      }
    };

    fetchRecentActivities();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const getStatusBadge = (status) => {
    const statusMap = {
      "Shortlisted": "primary",
      "In Review": "info",
      "Interviewed": "warning",
      "Rejected": "danger",
      "Hired": "success"
    };
    
    return <Badge bg={statusMap[status] || "secondary"}>{status}</Badge>;
  };

  // Add this helper function to get the appropriate icon for each status
  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('called')) return <Phone className="text-primary" />;
    if (statusLower.includes('interested')) return <Check className="text-success" />;
    if (statusLower.includes('not_interested')) return <X className="text-danger" />;
    if (statusLower.includes('callback')) return <Clock className="text-warning" />;
    return <AlertCircle className="text-secondary" />;
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
                  <span className="text-gradient">Admin Dashboard</span>
                </h1>
                <p className="text-muted">Welcome to your administrative overview</p>
              </div>
              <div className="d-flex align-items-center">
                <div className="date-badge">
                  <span className="fw-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <Row className="g-4 mb-4">
            {[
              { title: 'Total Employees', value: stats.totalEmployees, icon: <FaUsers />, color: '#3a7bd5', type: 'total' },
              { title: 'Active Employees', value: stats.activeEmployees, icon: <FaCalendarCheck />, color: '#2ecc71', type: 'completed' },
              { title: 'Pending Works', value: stats.pendingWorks, icon: <FaBriefcase />, color: '#f39c12', type: 'pending' },
              { title: 'Completed Works', value: stats.completedWorks, icon: <FaCalendarCheck />, color: '#2ecc71', type: 'completed' }
            ].map((stat, index) => (
              <Col key={index} xs={12} sm={6} lg={3}>
                <Card className="shadow-sm border-0 h-100 hover-lift">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center">
                      <div className={`stat-icon ${stat.type} rounded-circle d-flex align-items-center justify-content-center pulse`}>
                        {stat.icon}
                      </div>
                      <div className="ms-3">
                        <h6 className="stat-label text-muted mb-1">{stat.title}</h6>
                        <h3 className="stat-value fw-bold mb-0">{stat.value}</h3>
                      </div>
                    </div>
                    <div className="progress mt-3" style={{ height: "6px" }}>
                      <div className="progress-bar" style={{ width: "100%", backgroundColor: stat.color }}></div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Charts Row */}
          <Row className="g-4 mb-4">
            <Col xs={12} lg={8}>
              <Card className="shadow-sm border-0 h-100 hover-lift">
                <Card.Body className="p-4">
                  <h5 className="card-title fw-bold mb-4">Top Performers Call Statistics</h5>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={topPerformersData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36}/>
                      <Bar dataKey="completed" name="Completed Calls" fill="#3a7bd5" />
                      <Bar dataKey="remaining" name="Remaining Calls" fill="#f39c12" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} lg={4}>
              <Card className="shadow-sm border-0 h-100 hover-lift">
                <Card.Body className="p-4">
                  <h5 className="card-title fw-bold mb-4">Task Distribution</h5>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={taskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {taskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#3a7bd5' : index === 1 ? '#00c6ff' : '#f39c12'} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Activities */}
          <Row className="g-4">
            <Col xs={12}>
              <Card className="shadow-sm border-0 hover-lift">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title fw-bold mb-0">Recent Activities</h5>
                    <Badge 
                      bg="primary" 
                      className="rounded-pill d-flex align-items-center gap-1"
                      style={{
                        background: 'linear-gradient(135deg, #3a7bd5, #00c6ff)',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      <span>{recentActivities.length}</span>
                      <span className="opacity-75">New</span>
                    </Badge>
                  </div>
                  <div className="activities-list">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="activity-item mb-3 pb-3 border-bottom">
                        <div className="d-flex">
                          <div className={`activity-icon me-3 bg-light rounded-circle p-2 status-${activity.status}`}>
                            {activity.icon}
                          </div>
                          <div>
                            <h6 className="mb-1 fw-semibold">{activity.action}</h6>
                            <p className="mb-1">{activity.name}</p>
                            <small className="text-muted">{activity.time}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
