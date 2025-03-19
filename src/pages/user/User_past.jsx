import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import Sidebar from './User_sidebar';
import "../../assets/ViewProgress.css";
import Swal from 'sweetalert2';

const User_past = () => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    status: '',
    notes: ''
  });
  
  useEffect(() => {
    const userName = sessionStorage.getItem('userName');
    if (!userName) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const userId = sessionStorage.getItem('userId'); // Get logged in user's ID
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact-updates`);
      const result = await response.json();
      
      if (result.success) {
        const formattedData = result.data
          .filter(item => item.employeeid._id === userId) // Filter for past contacts of logged in user
          .map(item => ({
            id: item._id,
            name: item.employeeid.name,
            companyName: item.contactid.companyName,
            phone: item.contactid.phone,
            status: item.status,
            notes: item.notes,
            view: item.view,
            date: new Date(item.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          }));
        setProgressData(formattedData);
      } else {
        setError(result.message || 'Failed to fetch progress data');
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setEditFormData({
      status: item.status,
      notes: item.notes
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setCurrentItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact-updates/${currentItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editFormData.status,
          notes: editFormData.notes,
          view: 5
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setProgressData(progressData.map(item => 
          item.id === currentItem.id 
            ? { ...item, status: editFormData.status, notes: editFormData.notes, view: 5 } 
            : item
        ));
        handleCloseModal();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Contact updated successfully!',
          timer: 2000,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: result.message || 'Failed to update contact',
          timer: 2000,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An error occurred while updating the contact',
        timer: 2000,
        showConfirmButton: false,
        position: 'top-end',
        toast: true
      });
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <div className="content-header">
          <h2>My Past Contacts</h2>
        </div>
        
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Company</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {progressData.length > 0 ? (
                  progressData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.date}</td>
                      <td>{item.companyName}</td>
                      <td>{item.phone}</td>
                      <td>
                        <span className={`status-badge status-${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.notes}</td>
                      <td>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No past contacts found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
        
        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitEdit}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select 
                  name="status" 
                  value={editFormData.status} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Interested">Interested</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Call Back">Call Back</option>
                  <option value="Wrong Number">Wrong Number</option>
                  <option value="No Response">No Response</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  value={editFormData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default User_past;
