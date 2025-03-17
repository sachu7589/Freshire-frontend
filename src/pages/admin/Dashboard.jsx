import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Table, Badge, ProgressBar } from "react-bootstrap";
import { FaUsers, FaBriefcase, FaCalendarCheck, FaChartLine, FaArrowUp, FaArrowDown, FaFileUpload, FaExchangeAlt, FaUserPlus } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import "../../assets/Dashboard.css";
import axios from "axios";

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

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();

    // Add new fetch for recent activities
    const fetchRecentActivities = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/activities/recent`);
        if (response.status === 200) {
          setRecentActivities(response.data);
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

  return (
    <div className="app">
      <Sidebar />
      <div className={`main-content ${isMobile ? 'mobile' : ''}`}>
        <div className="content">
          <Container fluid>
            <Row className="mb-4">
              <Col>
                <div className="dashboard-header">
                  <div>
                    <h2 className="dashboard-title">Admin Dashboard</h2>
                    <p className="dashboard-subtitle text-muted">Welcome back! Here's what's happening with your recruitment pipeline today.</p>
                  </div>
                  
                </div>
              </Col>
            </Row>
            
            <Row className="mb-4 g-3">
              <Col xs={12} sm={6} md={4} lg={3}>
                <Card className="dashboard-card shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="stat-title text-muted mb-1">Total Employees</p>
                        <h3 className="stat-number mb-2">{stats.totalEmployees}</h3>
                        <div className="stat-change">
                          <span className="text-muted">Active: {stats.activeEmployees}</span>
                        </div>
                      </div>
                      <div className="stat-icon-container bg-primary-subtle">
                        <FaUsers className="stat-icon text-primary" />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col xs={12} sm={6} md={4} lg={3}>
                <Card className="dashboard-card shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="stat-title text-muted mb-1">Pending Works</p>
                        <h3 className="stat-number mb-2">{stats.pendingWorks}</h3>
                      </div>
                      <div className="stat-icon-container bg-warning-subtle">
                        <FaBriefcase className="stat-icon text-warning" />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col xs={12} sm={6} md={4} lg={3}>
                <Card className="dashboard-card shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="stat-title text-muted mb-1">Completed Works</p>
                        <h3 className="stat-number mb-2">{stats.completedWorks}</h3>
                      </div>
                      <div className="stat-icon-container bg-success-subtle">
                        <FaCalendarCheck className="stat-icon text-success" />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <Row className="g-3">
              <Col xs={12} lg={8}>
                <Card className="dashboard-card shadow-sm hover-lift">
                  <Card.Header className="bg-transparent border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-semibold">Recent Progress Updates</h5>
                      <div className="dropdown">
                        <span role="button" className="text-muted" aria-label="More options">
                          <BsThreeDotsVertical />
                        </span>
                      </div>
                    </div>
                  </Card.Header>
                  <div className="table-responsive d-none d-md-block">
                    <Table responsive hover className="mb-0 align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Employee</th>
                          <th>Company</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUpdates.map(update => (
                          <tr key={update.id}>
                            <td className="fw-medium">{update.name}</td>
                            <td>{update.company}</td>
                            <td>{getStatusBadge(update.status)}</td>
                            <td><span className="text-nowrap">{update.date}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  
                  <div className="d-md-none">
                    {recentUpdates.map(update => (
                      <div key={update.id} className="p-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0 fw-bold text-truncate me-2">{update.name}</h6>
                          {getStatusBadge(update.status)}
                        </div>
                        <div className="d-flex flex-column flex-sm-row justify-content-between text-muted small">
                          <span className="mb-1 mb-sm-0">{update.company}</span>
                          <span className="text-nowrap">{update.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Card.Footer className="bg-transparent border-0 text-center py-3">
                    <a href="/admin/view-progress" className="btn btn-outline-primary btn-sm fw-medium" onClick={(e) => { e.preventDefault(); navigate('/admin/view-progress'); }}>
                      View All Updates
                    </a>
                  </Card.Footer>
                </Card>
              </Col>
              
              <Col xs={12} lg={4}>
                <Card className="dashboard-card shadow-sm hover-lift h-100">
                  <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-semibold">Recent Users</h5>
                    <span role="button" className="text-muted" aria-label="More options">
                      <BsThreeDotsVertical />
                    </span>
                  </Card.Header>
                  
                  {/* Desktop view */}
                  <div className="d-none d-md-block">
                    <Card.Body className="p-0">
                      <div className="user-list">
                        {recentUsers.map(user => (
                          <div key={user.id} className="p-3 border-bottom">
                            <div className="d-flex align-items-center">
                              <div className="user-avatar me-3 flex-shrink-0">
                                <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{width: "40px", height: "40px"}}>
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="flex-grow-1 min-width-0">
                                <h6 className="mb-1 text-truncate">{user.name}</h6>
                                <p className="text-muted mb-0 small text-truncate">{user.email}</p>
                              </div>
                              <Badge 
                                bg={user.status === 'active' ? 'success-subtle' : 'danger-subtle'} 
                                className="ms-2 flex-shrink-0 hover-lift" 
                                style={{
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: '20px',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  textTransform: 'capitalize',
                                  border: `1px solid ${user.status === 'active' ? '#28a745' : '#dc3545'}`,
                                  color: user.status === 'active' ? '#28a745' : '#dc3545'
                                }}
                              >
                                {user.status === 'active' ? '● Active' : '● Inactive'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </div>
                  {/* hello there */}
                  
                  {/* Mobile view */}
                  <div className="d-md-none">
                    <Card.Body className="p-0">
                      <div className="user-list">
                        {recentUsers.map(user => (
                          <div key={user.id} className="p-2 border-bottom">
                            <div className="d-flex align-items-center">
                              <div className="user-avatar me-2 flex-shrink-0">
                                <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{width: "35px", height: "35px", fontSize: "0.9rem"}}>
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="flex-grow-1 min-width-0">
                                <h6 className="mb-0 fs-6 text-truncate">{user.name}</h6>
                                <p className="text-muted mb-0 small text-truncate" style={{fontSize: "0.75rem"}}>{user.email}</p>
                              </div>
                              <Badge bg={user.status === 'active' ? 'success' : 'danger'} className="ms-1 flex-shrink-0" pill size="sm">
                                {user.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </div>
                  
                  <Card.Footer className="bg-transparent border-0 text-center py-2 py-md-3">
                    <a href="/admin/view-employees" className="btn btn-outline-primary btn-sm fw-medium" onClick={(e) => { e.preventDefault(); navigate('/admin/view-employees'); }}>
                      View All Employees
                    </a>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
            
            {/* <Row>
              <Col lg={12} className="mb-4">
                <Card className="dashboard-card shadow-sm">
                  <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Recent Activities</h5>
                    <BsThreeDotsVertical />
                  </Card.Header>
                  <Card.Body>
                    <div className="activity-timeline">
                      {recentActivities.map((activity, index) => (
                        <div key={activity._id || index} className="activity-item d-flex align-items-start mb-3">
                          <div className="activity-icon me-3">
                            <div className="icon-circle bg-light">
                              {activity.type === 'upload' && <FaFileUpload className="text-primary" />}
                              {activity.type === 'status_change' && <FaExchangeAlt className="text-warning" />}
                              {activity.type === 'new_user' && <FaUserPlus className="text-success" />}
                            </div>
                          </div>
                          <div className="activity-content flex-grow-1">
                            <p className="mb-1 fw-bold">{activity.title}</p>
                            <p className="text-muted mb-0">{activity.description}</p>
                            <small className="text-muted">
                              {new Date(activity.timestamp).toLocaleString()}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-0 text-center">
                    <button className="btn btn-link">View All Activities</button>
                  </Card.Footer>
                </Card>
              </Col>
            </Row> */}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
