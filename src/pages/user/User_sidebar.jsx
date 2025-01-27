// Sidebar Component
import { NavLink, useNavigate } from "react-router-dom";
import { Home, LogOut, Database } from "lucide-react";
import Swal from "sweetalert2";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: "Do you want to logout?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear all session storage data
        sessionStorage.clear();
        // Redirect to login page
        navigate('/');
      }
    });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        FresHire
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/user/dashboard"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Home size={20} />
               Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/database"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Database size={20} />
              Database
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="logout-section">
        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;