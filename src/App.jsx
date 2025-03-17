import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/admin/Dashboard'
import AddUserForm from './pages/admin/AddUserForm'
import ViewEmployees from './pages/admin/ViewEmployees'
import AssignWorks from './pages/admin/AssignWorks'
import Login from './pages/Login'
import User_dash from './pages/user/User_dash'
import User_database from './pages/user/User_databse'
import ViewProgress from './pages/admin/ViewProgress'
import Landing from './pages/Landing'
import 'bootstrap/dist/css/bootstrap.min.css';
import User_notconnected from './pages/user/User_notconnected';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/add-user" element={<AddUserForm />} />
        <Route path="/admin/view-employees" element={<ViewEmployees />} />
        <Route path="/admin/assign-works" element={<AssignWorks />} />
        <Route path="/admin/view-progress" element={<ViewProgress />} />

        <Route path="/user/dashboard" element={<User_dash />} />
        <Route path="/user/database" element={<User_database />} />
        <Route path="/user/notconnected" element={<User_notconnected />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App