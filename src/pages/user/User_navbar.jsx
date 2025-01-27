import { User } from "lucide-react";

const TopNavbar = () => {
  return (
    <div className="top-navbar">
      <div className="navbar-content">
        <div className="navbar-left">
        </div>
        
        <div className="navbar-right">
          <button className="profile-button">
            <div className="avatar">
              <User size={20} />
            </div>
            <span className="username">Welcome, {sessionStorage.getItem('userName')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;