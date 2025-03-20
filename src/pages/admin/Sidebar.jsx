import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutGrid, 
  LogOut, 
  Users, 
  UserPlus, 
  ClipboardList, 
  LineChart, 
  Menu, 
  User,
  BarChart,
  CheckCircle,
  XCircle,
  Mail,
  ChevronDown
} from "lucide-react";
import { useState, useEffect } from 'react';
import Swal from "sweetalert2";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const userName = sessionStorage.getItem("userName") || "User";
  const [showLogout, setShowLogout] = useState(false);

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
      text: "Are you sure you want to logout?",
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

  const toggleLogout = () => {
    setShowLogout(!showLogout);
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
        
        <div className="p-3 border-bottom" 
             style={{ 
               background: 'rgba(255,255,255,0.6)',
               transition: 'transform 0.3s ease',
               transform: isOpen ? 'translateX(0)' : 'translateX(-20px)'
             }}>
          <div className="text-center mb-3">
            <img 
              src="/logo.png" 
              alt="Freshire Logo" 
              style={{ height: '50px', width: 'auto' }}
            />
          </div>
          <div className="mb-3">
            <div className="d-flex align-items-center position-relative" 
                 style={{ 
                   cursor: 'pointer',
                   padding: '8px',
                   borderRadius: '8px',
                   transition: 'all 0.2s ease',
                   background: showLogout ? 'rgba(0,0,0,0.05)' : 'transparent'
                 }}
                 onClick={toggleLogout}
                 title="Click to show logout option">
              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" 
                   style={{ width: '45px', height: '45px' }}>
                <User size={24} className="text-primary" />
              </div>
              <div className="ms-3 flex-grow-1">
                <h6 className="text-dark mb-0">{userName}</h6>
                <small className="text-muted">
                  {(() => {
                    switch (userName) {
                      case 'Aswin Chacko':
                        return 'Chief Marketing Officer';
                      case 'Sachu saji':
                        return 'Chief Technology Officer';
                      case 'Aswin Kumar Ps':
                        return 'Chief Sales Officer';
                      case 'Eapen Thomas':
                        return 'Chief Financial Officer';
                      case 'Aromal p Girish':
                        return 'Chief Outreach Officer';
                      case 'Chris Benny':
                        return 'Chief Operation Officer';
                      default:
                        return 'Administrator';
                    }
                  })()}
                </small>
              </div>
              <ChevronDown 
                size={20} 
                className="text-muted ms-2"
                style={{ 
                  transform: showLogout ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </div>
            
            <div style={{
              maxHeight: showLogout ? '60px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
              marginTop: showLogout ? '10px' : '0'
            }}>
              <button 
                className="btn btn-danger rounded-pill d-flex align-items-center justify-content-center gap-2 w-100 py-2 shadow-sm" 
                onClick={handleLogout}
                style={{ transition: 'all 0.3s ease' }}
              >
                <LogOut size={16} />
                <span className="fw-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-grow-1 overflow-auto" 
             style={{ 
               position: 'relative',
               height: 'calc(100vh - 200px)' // Adjust based on header + footer height
             }}>
          <ul className="nav nav-pills flex-column p-3" 
              style={{ 
                background: 'rgba(255,255,255,0.4)',
                transition: 'transform 0.3s ease',
                transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                minWidth: '230px'
              }}>
            <li className="nav-item mb-2">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `nav-link rounded-pill d-flex align-items-center ${isActive ? "active bg-primary" : "text-dark"}`
                }
                style={{ 
                  padding: '10px 15px', 
                  background: isActive => isActive ? '' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease'
                }}
              >
                <LayoutGrid size={18} className="me-3" />
                <span className="fw-medium">Dashboard</span>
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink
                to="/admin/view-employees"
                className={({ isActive }) =>
                  `nav-link rounded-pill d-flex align-items-center ${isActive ? "active bg-primary" : "text-dark"}`
                }
                style={{ 
                  padding: '10px 15px', 
                  background: isActive => isActive ? '' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Users size={18} className="me-3" />
                <span className="fw-medium">View Users</span>
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink
                to="/admin/add-user"
                className={({ isActive }) =>
                  `nav-link rounded-pill d-flex align-items-center ${isActive ? "active bg-primary" : "text-dark"}`
                }
                style={{ 
                  padding: '10px 15px', 
                  background: isActive => isActive ? '' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease'
                }}
              >
                <UserPlus size={18} className="me-3" />
                <span className="fw-medium">Add User</span>
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink
                to="/admin/assign-works"
                className={({ isActive }) =>
                  `nav-link rounded-pill d-flex align-items-center ${isActive ? "active bg-primary" : "text-dark"}`
                }
                style={{ 
                  padding: '10px 15px', 
                  background: isActive => isActive ? '' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease'
                }}
              >
                <ClipboardList size={18} className="me-3" />
                <span className="fw-medium">Assign Works</span>
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink
                to="/admin/view-progress"
                className={({ isActive }) =>
                  `nav-link rounded-pill d-flex align-items-center ${isActive ? "active bg-primary" : "text-dark"}`
                }
                style={{ 
                  padding: '10px 15px', 
                  background: isActive => isActive ? '' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease'
                }}
              >
                <LineChart size={18} className="me-3" />
                <span className="fw-medium">View Progress</span>
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink
                to="/admin/edited-response"
                className={({ isActive }) =>
                  `nav-link rounded-pill d-flex align-items-center ${isActive ? "active bg-primary" : "text-dark"}`
                }
                style={{ 
                  padding: '10px 15px', 
                  background: isActive => isActive ? '' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease'
                }}
              >
                <ClipboardList size={18} className="me-3" />
                <span className="fw-medium">Edited Progress</span>
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink
                to="/admin/employee-progress"
                className={({ isActive }) =>
                  `nav-link rounded-pill d-flex align-items-center ${isActive ? "active bg-primary" : "text-dark"}`
                }
                style={{ 
                  padding: '10px 15px', 
                  background: isActive => isActive ? '' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease'
                }}
              >
                <BarChart size={18} className="me-3" />
                <span className="fw-medium">Employee Progress</span>
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink
                to="/admin/accept-response"
                className={({ isActive }) =>
                  `nav-link rounded-pill d-flex align-items-center ${isActive ? "active bg-primary" : "text-dark"}`
                }
                style={{ 
                  padding: '10px 15px', 
                  background: isActive => isActive ? '' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease'
                }}
              >
                <CheckCircle size={18} className="me-3" />
                <span className="fw-medium">Accepted Data</span>
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink
                to="/admin/rejected-response"
                className={({ isActive }) =>
                  `nav-link rounded-pill d-flex align-items-center ${isActive ? "active bg-primary" : "text-dark"}`
                }
                style={{ 
                  padding: '10px 15px', 
                  background: isActive => isActive ? '' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease'
                }}
              >
                <XCircle size={18} className="me-3" />
                <span className="fw-medium">Rejected Data</span>
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <NavLink
                to="/admin/email-sent"
                className={({ isActive }) =>
                  `nav-link rounded-pill d-flex align-items-center ${isActive ? "active bg-primary" : "text-dark"}`
                }
                style={{ 
                  padding: '10px 15px', 
                  background: isActive => isActive ? '' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Mail size={18} className="me-3" />
                <span className="fw-medium">Send Email</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Footer - Remove logout button and keep only copyright */}
        <div style={{ 
          position: 'fixed',
          bottom: 0,
          width: '250px',
          background: 'rgba(255,255,255,0.9)',
          borderTop: '1px solid rgba(0,0,0,0.1)'
        }}>
          <div className="p-2 text-center" 
               style={{ 
                 background: 'rgba(255,255,255,0.4)',
                 transition: 'transform 0.3s ease',
                 transform: isOpen ? 'translateX(0)' : 'translateX(-20px)'
               }}>
          </div>
        </div>
      </div>

      {isOpen && isMobile && (
        <div className="position-fixed top-0 start-0 w-100 h-100" 
             style={{ 
               background: 'rgba(0,0,0,0.25)', 
               backdropFilter: 'blur(2px)',
               zIndex: 999 
             }} 
             onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
