import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../../assets/User_navbar.css";

const TopNavbar = () => {
  const navigate = useNavigate();
  const userName = sessionStorage.getItem('userName');

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
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
    <Navbar className="top-navbar">
      <Container fluid>
        {/* <Nav className="d-none d-lg-flex me-auto">
          <div className="search-box">
            <input
              type="search"
              placeholder="Search..."
              className="search-input"
            />
          </div>
        </Nav> */}

        <Nav className="align-items-center ms-auto">
          <Nav.Item className="notification-bell d-none d-md-block">
            <button className="icon-button">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
          </Nav.Item>

          <Dropdown align="end">
            <Dropdown.Toggle as="div" className="profile-dropdown">
              <div className="avatar">
                <User size={20} />
              </div>
              <span className="username d-none d-md-inline">{userName}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>
                <User size={16} className="me-2" />
                Profile
              </Dropdown.Item>
              <Dropdown.Item>
                <Settings size={16} className="me-2" />
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <LogOut size={16} className="me-2" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;