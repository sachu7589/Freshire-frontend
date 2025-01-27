import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./User_sidebar";
import TopNavbar from "./User_navbar";
import "../../assets/User_dash.css";

function User_dash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by checking sessionStorage
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");

    if (!userId || userRole !== "employee") {
      navigate("/"); // Redirect to login page if not logged in or not an employee
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <TopNavbar />
        <main className="main-content">
          <div className="content-header">
            <h1 className="page-title">User Dashboard</h1>
          </div>
        </main>
      </div>
    </div>
  );
}

export default User_dash;
