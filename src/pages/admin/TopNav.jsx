import { Navbar, Container } from 'react-bootstrap';
import { BsBuildingFill } from 'react-icons/bs';
import "../../assets/Topnav.css";

const TopNav = () => {
  const userName = sessionStorage.getItem('userName');

  return (
    <Navbar className="topnav">
      <Container fluid>
        <Navbar.Brand className="brand">
          <BsBuildingFill className="brand-icon" />
          <span className="brand-text">FresHire</span>
        </Navbar.Brand>
        <div className="profile">
          <span className="welcome-text">Welcome, {userName}</span>
          <div className="profile-image-container">
            <img
              src="/images.jpeg"
              alt="User Profile"
              className="profile-pic"
            />
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default TopNav;
