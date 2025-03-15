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

  // Enhanced data for the chart with gradient
  const performanceData = [
    { name: "Mon", tasks: 4, efficiency: 80 },
    { name: "Tue", tasks: 3, efficiency: 75 },
    { name: "Wed", tasks: 5, efficiency: 90 },
    { name: "Thu", tasks: 2, efficiency: 65 },
    { name: "Fri", tasks: 6, efficiency: 95 },
    { name: "Sat", tasks: 3, efficiency: 70 },
    { name: "Sun", tasks: 4, efficiency: 85 }
  ];

  // Recent activities data
  const recentActivities = [
    { id: 1, action: "Completed task", task: "Client outreach", time: "2 hours ago", icon: <BsCheckCircle className="text-success" /> },
    { id: 2, action: "Updated status", task: "Project proposal", time: "4 hours ago", icon: <BsArrowUp className="text-primary" /> },
    { id: 3, action: "Added notes", task: "Follow-up meeting", time: "Yesterday", icon: <BsCalendarCheck className="text-info" /> },
    { id: 4, action: "Started task", task: "Market research", time: "Yesterday", icon: <BsLightbulb className="text-warning" /> }
  ];

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

    // TODO: Fetch actual stats from your API
    setStats({
      totalTasks: 24,
      completedTasks: 16,
      pendingTasks: 6,
      urgentTasks: 2
    });
  }, [navigate]);

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
                    <h5 className="card-title fw-bold mb-0">Recent Activities</h5>
                    <span className="badge bg-primary rounded-pill">{recentActivities.length} New</span>
                  </div>
                  <div className="activities-list">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="activity-item mb-3 pb-3 border-bottom">
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
                      <button className="btn btn-outline-primary btn-sm rounded-pill">View All Activities</button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} lg={6}>
              <Card className="shadow-sm border-0 h-100 hover-lift">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title fw-bold mb-0">Upcoming Deadlines</h5>
                    <span className="badge bg-danger rounded-pill">{upcomingDeadlines.length}</span>
                  </div>
                  <div className="deadlines-list">
                    {upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className="deadline-item mb-3 p-3 border-start border-4 rounded-3" 
                           style={{ borderColor: `var(--bs-${getPriorityColor(deadline.priority)})`, backgroundColor: `rgba(var(--bs-${getPriorityColor(deadline.priority)}-rgb), 0.05)` }}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1 fw-semibold">{deadline.task}</h6>
                            <p className="mb-0 small text-muted">
                              <BsClock className="me-1" /> {deadline.deadline}
                            </p>
                          </div>
                          <Badge bg={getPriorityColor(deadline.priority)} className="rounded-pill px-3">{deadline.priority}</Badge>
                        </div>
                      </div>
                    ))}
                    <div className="text-center mt-3">
                      <button className="btn btn-outline-primary btn-sm rounded-pill">View Calendar</button>
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

export default User_dash;
