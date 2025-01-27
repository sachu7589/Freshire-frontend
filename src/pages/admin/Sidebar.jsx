import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../../assets/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

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
    <nav className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/view-employees">View User</Link></li>
        <li><Link to="/admin/add-user">Add User</Link></li>
        <li><Link to="/admin/assign-works">Assign Works</Link></li>
        <li><Link to="/admin/view-progress">View Progress</Link></li>
        <li><Link to="#" onClick={handleLogout}>Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
