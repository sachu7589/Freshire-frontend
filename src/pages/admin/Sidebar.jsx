import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Nav } from 'react-bootstrap';
import {
  BsFillGridFill,
  BsPeopleFill,
  BsPersonPlusFill,
  BsListTask,
  BsGraphUp,
  BsBoxArrowRight,
  BsList,
  BsX
} from 'react-icons/bs';
import "../../assets/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsOpen(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

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

  return (
    <>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <BsX size={24} /> : <BsList size={24} />}
      </button>

      <Nav className={`sidebar flex-column ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header p-3">
          <h2 className="text-light mb-0">Admin Panel</h2>
          <hr className="bg-light opacity-25" />
        </div>

        <div className="sidebar-menu">
          <Nav.Item>
            <Link to="/admin/dashboard" className="nav-link sidebar-link">
              <BsFillGridFill className="me-2" /> 
              <span>Dashboard</span>
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link to="/admin/view-employees" className="nav-link sidebar-link">
              <BsPeopleFill className="me-2" /> 
              <span>View Users</span>
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link to="/admin/add-user" className="nav-link sidebar-link">
              <BsPersonPlusFill className="me-2" /> 
              <span>Add User</span>
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link to="/admin/assign-works" className="nav-link sidebar-link">
              <BsListTask className="me-2" /> 
              <span>Assign Works</span>
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link to="/admin/view-progress" className="nav-link sidebar-link">
              <BsGraphUp className="me-2" /> 
              <span>View Progress</span>
            </Link>
          </Nav.Item>
        </div>

        <div className="logout-section">
          <hr className="bg-light opacity-25" />
          <Nav.Item>
            <Link to="#" onClick={handleLogout} className="nav-link sidebar-link logout-button">
              <BsBoxArrowRight className="me-2" /> 
              <span>Logout</span>
            </Link>
          </Nav.Item>
        </div>
      </Nav>

      {isOpen && isMobile && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default Sidebar;
