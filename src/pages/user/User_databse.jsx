import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./User_sidebar";
import Swal from "sweetalert2";
import "../../assets/User_database.css";

function User_databse() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contactStatuses, setContactStatuses] = useState({});
  const [contactNotes, setContactNotes] = useState({});

  useEffect(() => {
    // Check if user is logged in by checking sessionStorage
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");

    if (!userId || userRole !== "employee") {
      navigate("/"); // Redirect to login page if not logged in or not an employee
    }

    // Fetch contacts data
    const fetchContacts = async () => {
      setLoading(true);
      try {
        // Only fetch contacts where view=0
        const response = await fetch(`${import.meta.env.VITE_API_URL}/contacts/employee/${userId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch contacts');
        }

        if (result.success) {
          // Filter out any contacts where view=1
          const filteredContacts = result.data.filter(contact => contact.view === 0);
          setContacts(filteredContacts);
          
          // Initialize status and notes for each contact
          const initialStatuses = {};
          const initialNotes = {};
          filteredContacts.forEach(contact => {
            initialStatuses[contact._id] = "";
            initialNotes[contact._id] = "";
          });
          setContactStatuses(initialStatuses);
          setContactNotes(initialNotes);
        } else {
          setError(result.message);
          setContacts([]);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setError(error.message);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [navigate]);

  const handleSubmit = async (contactId) => {
    const userId = sessionStorage.getItem("userId");
    
    // Validate status and notes
    if (!contactStatuses[contactId] || contactStatuses[contactId] === "") {
      Swal.fire({
        icon: 'error',
        title: 'Required Field Empty',
        text: 'Please select a status before submitting'
      });
      return;
    }

    if (!contactNotes[contactId] || !contactNotes[contactId].trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Required Field Empty',
        text: 'Please add notes before submitting'
      });
      return;
    }

    try {
      // First create contact update
      const updateResponse = await fetch(`${import.meta.env.VITE_API_URL}/contact-updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeid: userId, // Changed from employeeId to employeeid
          contactid: contactId, // Changed from contactId to contactid
          status: contactStatuses[contactId],
          notes: contactNotes[contactId]
        })
      });

      const updateResult = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(updateResult.message || 'Failed to create contact update');
      }

      // Then update contact view status
      const viewResponse = await fetch(`${import.meta.env.VITE_API_URL}/contacts/${contactId}/view`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: contactStatuses[contactId], 
          notes: contactNotes[contactId] 
        })
      });

      const viewResult = await viewResponse.json();

      if (!viewResponse.ok) {
        throw new Error(viewResult.message || 'Failed to update contact');
      }

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Contact updated successfully'
      });

      // Remove the submitted contact from the list
      setContacts(contacts.filter(contact => contact._id !== contactId));

    } catch (error) {
      console.error("Error updating contact:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update contact'
      });
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container contacts-dashboard">
        <Sidebar />
        <div className="dashboard-content contacts-content">
          <main className="main-content">
            <div>Loading contacts...</div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container contacts-dashboard">
        <Sidebar />
        <div className="dashboard-content contacts-content">
          <main className="main-content">
            <div className="error-container">
              <div className="error-message">
                <h2>No Data Found</h2>
                <p>{error}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container contacts-dashboard">
      <Sidebar />
      <div className="dashboard-content contacts-content">
        <main className="main-content" style={{ paddingTop: "60px" }}>
          
          <div className="contacts-header">
            <h1 className="contacts-title" style={{ marginTop: "10px" }}>Contact Management</h1>
            <div className="contacts-stats">
              <div className="stat-card">
                <div className="stat-value">{contacts.length}</div>
                <div className="stat-label">Pending Contacts</div>
              </div>
              {/* <div className="stat-card">
                <div className="stat-value">{contacts.filter(c => contactStatuses[c._id]).length}</div>
                <div className="stat-label">In Progress</div>
              </div> */}
            </div>
          </div>
          
          <div className="contacts-table-container">
            <div className="contacts-table-header">
              <h2 className="contacts-table-title">
                <i className="fas fa-address-book"></i> Contact Database
              </h2>
              <div className="contacts-actions">
                <button className="action-button">
                  <i className="fas fa-filter"></i> Filter
                </button>
                <button className="action-button">
                  <i className="fas fa-sort"></i> Sort
                </button>
              </div>
            </div>
            
            <div className="contacts-table-responsive">
              <table className="contacts-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Contact Info</th>
                    <th>Social Media</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="no-data-cell">
                        <div className="no-data-message">
                          <i className="fas fa-inbox empty-icon"></i>
                          <p>No contacts available for processing</p>
                          <p className="action-hint">All contacts have been processed or none have been assigned</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    contacts.map((contact, index) => (
                      <tr key={contact._id || index} className="contact-row">
                        <td data-label="Company">
                          <div className="company-cell">
                            <div className="company-avatar">
                              {contact.companyName.charAt(0)}
                            </div>
                            <span>{contact.companyName}</span>
                          </div>
                        </td>
                        <td data-label="Contact Info">
                          <div className="contact-details">
                            <div className="contact-email">
                              <i className="fas fa-envelope"></i>
                              {contact.email}
                            </div>
                            <div className="contact-phone">
                              <i className="fas fa-phone"></i>
                              {contact.phone}
                            </div>
                          </div>
                        </td>
                        <td data-label="Social Media">
                          <div className="social-links">
                            {contact.socialMedia && (
                              <a href={contact.socialMedia} target="_blank" rel="noopener noreferrer" className="social-link" title="Visit website">
                                <i className="fas fa-globe"></i>
                              </a>
                            )}
                            <a href={`mailto:${contact.email}`} className="social-link" title="Send email">
                              <i className="fas fa-envelope"></i>
                            </a>
                            <a href={`tel:${contact.phone}`} className="social-link" title="Call">
                              <i className="fas fa-phone"></i>
                            </a>
                          </div>
                        </td>
                        <td data-label="Status">
                          <select 
                            className="status-dropdown"
                            value={contactStatuses[contact._id] || ""}
                            onChange={(e) => setContactStatuses({
                              ...contactStatuses,
                              [contact._id]: e.target.value
                            })}
                          >
                            <option value="">Select Status</option>
                            <option value="called">Called</option>
                            <option value="not_responding">Not Responding</option>
                          </select>
                        </td>
                        <td data-label="Notes">
                          <textarea
                            className="notes-textarea"
                            value={contactNotes[contact._id] || ""}
                            onChange={(e) => setContactNotes({
                              ...contactNotes,
                              [contact._id]: e.target.value
                            })}
                            placeholder="Add your contact notes here..."
                          />
                        </td>
                        <td data-label="Action">
                          <button 
                            className="submit-button"
                            onClick={() => handleSubmit(contact._id)}
                            disabled={!contactStatuses[contact._id] || !contactNotes[contact._id]}
                          >
                            <i className="fas fa-check-circle"></i> Submit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Loading state */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="error-container">
              <div className="error-message">
                <i className="fas fa-exclamation-circle error-icon"></i>
                <h2>Unable to Load Contacts</h2>
                <p>{error}</p>
                <button className="retry-button" onClick={() => window.location.reload()}>
                  <i className="fas fa-redo"></i> Try Again
                </button>
              </div>
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
}

export default User_databse;
