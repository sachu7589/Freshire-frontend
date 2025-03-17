import { NavLink, useNavigate } from "react-router-dom";
import { Home, LogOut, Database, Menu, User, Bell } from "lucide-react";
import { useState, useEffect } from 'react';
import Swal from "sweetalert2";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const userName = sessionStorage.getItem("userName") || "User";

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsOpen(width > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        sessionStorage.clear();
        navigate('/');
      }
    });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="menu-button-container position-fixed d-md-none" 
        style={{ 
          top: '10px', 
          left: isOpen ? '260px' : '10px', 
          zIndex: 1200,
          transition: 'left 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}>
        <button 
          className="btn btn-primary rounded-circle shadow" 
          onClick={toggleSidebar}
          style={{ padding: '10px', width: '45px', height: '45px' }}
        >
          <Menu size={24} />
        </button>
      </div>
      
      <div className={`d-flex flex-column flex-shrink-0 position-fixed ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`} 
           style={{
             width: isOpen ? '250px' : '0', 
             minHeight: '100vh',
             transition: 'width 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.3s ease',
             opacity: isOpen ? 1 : 0,
             zIndex: 1000,
             overflow: 'hidden',
             background: 'transparent',
             backdropFilter: 'blur(10px)',
             boxShadow: isOpen ? '0 0 20px rgba(0,0,0,0.05)' : 'none'
           }}>
        <div className="p-3 d-flex justify-content-center align-items-center" 
             style={{ 
               background: 'rgba(255,255,255,0.8)',
               transition: 'transform 0.3s ease',
               transform: isOpen ? 'translateX(0)' : 'translateX(-20px)'
             }}>
          <div className="logo-container text-center">
            <img 
              src="/logo.png" 
              alt="Freshire Logo" 
              className="img-fluid" 
              style={{ 
                maxHeight: '60px', 
                maxWidth: '180px',
                transition: 'all 0.3s ease'
              }} 
            />
          </div>
        </div>
        
        <div className="p-3 border-bottom" 
             style={{ 
               background: 'rgba(255,255,255,0.6)',
               transition: 'transform 0.3s ease',
               transform: isOpen ? 'translateX(0)' : 'translateX(-20px)'
             }}>
          <div className="d-flex align-items-center">
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" 
                 style={{ width: '45px', height: '45px' }}>
              <User size={24} className="text-primary" />
            </div>
            <div className="ms-3">
              <h6 className="text-dark mb-0">{userName}</h6>
              <small className="text-muted">Employee</small>
            </div>
          </div>
        </div>
        
        <div className="p-3" 
             style={{ 
               background: 'rgba(255,255,255,0.4)',
               transition: 'transform 0.3s ease',
               transform: isOpen ? 'translateX(0)' : 'translateX(-20px)'
             }}>
          <h6 className="text-uppercase text-muted fw-bold mb-3 small">Main Menu</h6>
        </div>
        
        <ul className="nav nav-pills flex-column mb-auto px-3" 
            style={{ 
              background: 'rgba(255,255,255,0.4)',
              transition: 'transform 0.3s ease',
              transform: isOpen ? 'translateX(0)' : 'translateX(-20px)'
            }}>
          <li className="nav-item mb-2">
            <NavLink
              to="/user/dashboard"
              className={({ isActive }) =>
                `nav-link rounded-pill d-flex align-items-center ${isActive ? "active bg-primary" : "text-dark"}`
              }
              style={{ 
                padding: '10px 15px', 
                background: isActive => isActive ? '' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.3s ease'
              }}
            >
              <Home size={18} className="me-3" />
              <span className="fw-medium">Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink
              to="/user/database"
              className={({ isActive }) =>
                `nav-link rounded-pill d-flex align-items-center ${isActive ? "active bg-primary" : "text-dark"}`
              }
              style={{ 
                padding: '10px 15px', 
                background: isActive => isActive ? '' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.3s ease'
              }}
            >
              <Database size={18} className="me-3" />
              <span className="fw-medium">Database</span>
            </NavLink>
          </li>
          
          <li className="nav-item mb-2">
            <NavLink
              to="/user/notconnected"
              className={({ isActive }) =>
                `nav-link rounded-pill d-flex align-items-center ${isActive ? "active bg-primary" : "text-dark"}`
              }
              style={{ 
                padding: '10px 15px', 
                background: isActive => isActive ? '' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.3s ease'
              }}
            >
              <Bell size={18} className="me-3" />
              <span className="fw-medium">Notifications</span>
            </NavLink>
          </li>
        </ul>
        
        <div className="p-3 mt-5" 
             style={{ 
               background: 'rgba(255,255,255,0.6)',
               transition: 'transform 0.3s ease',
               transform: isOpen ? 'translateX(0)' : 'translateX(-20px)'
             }}>
          <button 
            className="btn btn-danger rounded-pill d-flex align-items-center justify-content-center gap-2 w-100 py-2 shadow-sm" 
            onClick={handleLogout}
            style={{ transition: 'all 0.3s ease' }}
          >
            <LogOut size={18} />
            <span className="fw-medium">Logout</span>
          </button>
        </div>
        
        <div className="p-3 text-center mt-auto" 
             style={{ 
               background: 'rgba(255,255,255,0.4)',
               transition: 'transform 0.3s ease',
               transform: isOpen ? 'translateX(0)' : 'translateX(-20px)'
             }}>
          <small className="text-muted">Freshire © 2025</small>
        </div>
      </div>
    </>
  );
};

export default Sidebar;