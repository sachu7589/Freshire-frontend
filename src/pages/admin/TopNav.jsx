import "../../assets/Topnav.css";

const TopNav = () => {
  const userName = sessionStorage.getItem('userName');

  return (
    <div className="topnav">
      <h1>FresHire</h1>
      <div className="profile">
        <span>Welcome, {userName}</span>
        <img
          src="/images.jpeg"
          alt="User Profile"
          className="profile-pic"
        />
      </div>
    </div>
  );
};

export default TopNav;
