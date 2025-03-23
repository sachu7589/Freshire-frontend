import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import Sidebar from './User_sidebar';
import "../../assets/ViewProgress.css";
import Swal from 'sweetalert2';
import { Eye, Clock, AlertCircle, Search, X } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  
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

  const filteredAndSortedData = progressData.filter(item => {
    const query = searchQuery.toLowerCase();
    const matches = item.companyName.toLowerCase().includes(query) || item.phone.includes(query);
    return matches;
  }).sort((a, b) => {
    const dateA = new Date(a.date.split(' ').reverse().join(' '));
    const dateB = new Date(b.date.split(' ').reverse().join(' '));
    if (sortOrder === 'desc') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <div className="page-container">
          {/* Header Section */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-title">
                <h1>Past Contacts</h1>
                <p className="subtitle">View and manage your contact history</p>
              </div>
              <div className="header-actions">
                <div className="metric-cards">
                  <div className="metric-card">
                    <div className="metric-icon">
                      <Eye size={20} />
                    </div>
                    <div className="metric-info">
                      <span className="metric-value">{progressData.length}</span>
                      <span className="metric-label">Total Contacts</span>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">
                      <Clock size={20} />
                    </div>
                    <div className="metric-info">
                      <span className="metric-value">
                        {progressData.filter(item => item.status === 'Call Back').length}
                      </span>
                      <span className="metric-label">Pending Callbacks</span>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">
                      <AlertCircle size={20} />
                    </div>
                    <div className="metric-info">
                      <span className="metric-value">
                        {progressData.filter(item => {
                          const date = new Date(item.date.split(' ').reverse().join(' '));
                          return date >= new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
                        }).length}
                      </span>
                      <span className="metric-label">Recent Updates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="controls-section">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="filters">
              <select
                className="sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="results-info">
            <span>Showing {filteredAndSortedData.length} of {progressData.length} contacts</span>
          </div>

          {/* Contact Cards Grid */}
          <div className="contacts-grid">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading contacts...</p>
              </div>
            ) : filteredAndSortedData.length === 0 ? (
              <div className="empty-state">
                <Search size={48} />
                <h3>No Contacts Found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            ) : (
              filteredAndSortedData.map((contact) => (
                <div key={contact.id} className="contact-card">
                  <div className="card-header">
                    <div className="company-info">
                      <div className="company-avatar">
                        {contact.companyName[0]}
                      </div>
                      <div className="company-details">
                        <h3>{contact.companyName}</h3>
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                    <div className={`status-badge status-${contact.status.toLowerCase().replace(' ', '-')}`}>
                      {contact.status}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="info-row">
                      <span className="label">Date:</span>
                      <span className="value">{contact.date}</span>
                    </div>
                    <div className="notes-section">
                      <span className="label">Notes:</span>
                      <p className="notes-text">{contact.notes}</p>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(contact)}
                    >
                      Edit Contact
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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

      <style jsx>{`
        .page-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
          background: #f8fafc;
          min-height: 100vh;
        }

        .page-header {
          margin-bottom: 32px;
          background: linear-gradient(135deg, #4f46e5 0%, #3b2fd0 100%);
          border-radius: 16px;
          padding: 2px;
        }

        .header-content {
          background: white;
          border-radius: 14px;
          padding: 32px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .header-title h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .subtitle {
          color: #64748b;
          margin: 8px 0 32px 0;
          font-size: 15px;
        }

        .metric-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .metric-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.05);
        }

        .metric-icon {
          background: #f1f5f9;
          padding: 16px;
          border-radius: 12px;
          color: #4f46e5;
          transition: all 0.3s ease;
        }

        .metric-card:hover .metric-icon {
          background: #4f46e5;
          color: white;
        }

        .metric-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-value {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.5px;
        }

        .metric-label {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .controls-section {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          background: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          border: 1px solid #e2e8f0;
        }

        .search-container {
          flex: 1;
          position: relative;
          background: #f8fafc;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .search-container:focus-within {
          background: white;
          box-shadow: 0 0 0 2px #4f46e5;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          color: #1e293b;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #4f46e5;
        }

        .clear-search {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .clear-search:hover {
          background: #f1f5f9;
          color: #64748b;
        }

        .sort-select {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
          font-size: 15px;
          color: #1e293b;
          min-width: 160px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .sort-select:hover {
          border-color: #94a3b8;
        }

        .sort-select:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }

        .results-info {
          color: #64748b;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
          padding: 0 4px;
        }

        .contacts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }

        .contact-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          overflow: hidden;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .contact-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.05);
        }

        .card-header {
          padding: 20px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
        }

        .company-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .company-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #4f46e5 0%, #3b2fd0 100%);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 20px;
          box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);
        }

        .company-details h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .company-details span {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
          display: block;
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .status-interested { 
          background: #dcfce7; 
          color: #15803d;
          border: 1px solid #86efac;
        }
        
        .status-not-interested { 
          background: #fee2e2; 
          color: #b91c1c;
          border: 1px solid #fca5a5;
        }
        
        .status-call-back { 
          background: #fef3c7; 
          color: #b45309;
          border: 1px solid #fcd34d;
        }
        
        .status-wrong-number { 
          background: #f3f4f6; 
          color: #4b5563;
          border: 1px solid #d1d5db;
        }
        
        .status-no-response { 
          background: #e0e7ff; 
          color: #4338ca;
          border: 1px solid #a5b4fc;
        }

        .card-body {
          padding: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .label {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .value {
          font-size: 14px;
          color: #1e293b;
          font-weight: 500;
        }

        .notes-section {
          margin-top: 16px;
        }

        .notes-text {
          margin: 8px 0 0 0;
          font-size: 14px;
          color: #1e293b;
          line-height: 1.6;
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
        }

        .card-footer {
          padding: 20px;
          border-top: 1px solid #f1f5f9;
          background: #f8fafc;
        }

        .edit-button {
          width: 100%;
          padding: 12px 24px;
          background: linear-gradient(135deg, #4f46e5 0%, #3b2fd0 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .edit-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }

        .loading-state,
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 64px;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .spinner {
          border: 3px solid #f1f5f9;
          border-top: 3px solid #4f46e5;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          animation: spin 1s linear infinite;
          margin: 0 auto 24px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state h3 {
          margin: 24px 0 8px;
          color: #1e293b;
          font-size: 18px;
          font-weight: 600;
        }

        .empty-state p {
          margin: 0;
          color: #64748b;
          font-size: 15px;
        }

        /* Modal Styles */
        :global(.modal-content) {
          border-radius: 16px;
          border: none;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        :global(.modal-header) {
          padding: 24px;
          border-bottom: 1px solid #f1f5f9;
          background: #f8fafc;
          border-radius: 16px 16px 0 0;
        }

        :global(.modal-title) {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        :global(.modal-body) {
          padding: 24px;
        }

        :global(.form-label) {
          font-weight: 500;
          color: #1e293b;
          margin-bottom: 8px;
        }

        :global(.form-control),
        :global(.form-select) {
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          padding: 12px;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        :global(.form-control:focus),
        :global(.form-select:focus) {
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }

        :global(.modal-footer) {
          padding: 24px;
          border-top: 1px solid #f1f5f9;
          background: #f8fafc;
          border-radius: 0 0 16px 16px;
        }

        :global(.btn) {
          padding: 10px 20px;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        :global(.btn-primary) {
          background: linear-gradient(135deg, #4f46e5 0%, #3b2fd0 100%);
          border: none;
        }

        :global(.btn-primary:hover) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }

        :global(.btn-secondary) {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #64748b;
        }

        :global(.btn-secondary:hover) {
          background: #e2e8f0;
          color: #1e293b;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 1024px) {
          .metric-cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .contacts-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 16px;
          }

          .header-content {
            padding: 24px;
          }

          .header-title h1 {
            font-size: 24px;
          }

          .metric-cards {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .controls-section {
            flex-direction: column;
            gap: 12px;
            padding: 12px;
          }

          .sort-select {
            width: 100%;
          }

          .contacts-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .contact-card {
            margin: 0;
          }

          .card-header {
            padding: 16px;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .status-badge {
            align-self: flex-start;
          }

          .card-body,
          .card-footer {
            padding: 16px;
          }

          /* Modal Responsive Styles */
          :global(.modal-content) {
            margin: 16px;
          }

          :global(.modal-header),
          :global(.modal-body),
          :global(.modal-footer) {
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .company-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .info-row {
            flex-direction: column;
            gap: 8px;
          }

          .value {
            margin-left: 0;
          }

          .loading-state,
          .empty-state {
            padding: 32px 16px;
          }
        }

        /* Adjust sidebar for mobile */
        @media (max-width: 768px) {
          .admin-container {
            flex-direction: column;
          }

          .main-content {
            margin-left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default User_past;
