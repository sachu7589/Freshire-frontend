import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import "../../assets/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by checking sessionStorage
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");

    if (!userId || userRole !== "admin") {
      navigate("/"); // Redirect to login page if not logged in or not admin
    }
  }, [navigate]);

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <div className="content">
          <h1>Welcome to the Dashboard</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
