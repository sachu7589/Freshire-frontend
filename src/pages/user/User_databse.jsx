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

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <div className="sticky-header">
        </div>
        <div className="assign-works-wrapper">
          <div className="header-section">
            <h1 className="page-title" style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#1f2937',
              marginTop: '2.5rem',
              marginBottom: '1.5rem',
              textAlign: 'left',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '0.75rem'
            }}>Contact Management</h1>
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-value">{contacts.length}</div>
                <div className="stat-label">Pending Contacts</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-animation">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <h2 className="loading-text">Loading Contacts</h2>
              <p className="loading-subtext">Please wait while we fetch the data</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <span className="error-icon">⚠️</span>
              <p className="error-message">{error}</p>
            </div>
          ) : (
            <div className="contacts-grid">
              {contacts.length === 0 ? (
                <div className="no-results">
                  <i className="fas fa-inbox"></i>
                  <p>No contacts available for processing</p>
                  <p className="subtext">All contacts have been processed or none have been assigned</p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <div key={contact._id} className="contact-card">
                    <div className="contact-header">
                      <div className="avatar">
                        {contact.companyName.charAt(0).toUpperCase()}
                      </div>
                      <div className="contact-details">
                        <h3 className="company-name">{contact.companyName}</h3>
                      </div>
                    </div>

                    <div className="contact-info">
                      <div className="info-item">
                        <i className="fas fa-envelope"></i>
                        <span>{contact.email}</span>
                        <a href={`mailto:${contact.email}`} className="action-link">
                          <i className="fas fa-paper-plane"></i>
                        </a>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-phone"></i>
                        <span>{contact.phone}</span>
                        <a href={`tel:${contact.phone}`} className="action-link">
                          <i className="fas fa-phone-alt"></i>
                        </a>
                      </div>
                      {contact.socialMedia && (
                        <div className="info-item">
                          <i className="fas fa-globe"></i>
                          <span>Website</span>
                          <a href={contact.socialMedia} target="_blank" rel="noopener noreferrer" className="action-link">
                            <i className="fas fa-external-link-alt"></i>
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="status-section">
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
                        <option value="interested">Interested</option>
                        <option value="follow_up">Follow Up</option>
                        <option value="meeting_scheduled">Meeting Scheduled</option>
                        <option value="converted">Converted</option>
                        <option value="not_interested">Not Interested</option>
                      </select>

                      <textarea
                        className="notes-textarea"
                        value={contactNotes[contact._id] || ""}
                        onChange={(e) => setContactNotes({
                          ...contactNotes,
                          [contact._id]: e.target.value
                        })}
                        placeholder="Add your contact notes here..."
                      />

                      <button
                        onClick={() => handleSubmit(contact._id)}
                        className={`submit-button ${(!contactStatuses[contact._id] || !contactNotes[contact._id]) ? 'disabled' : ''}`}
                        disabled={!contactStatuses[contact._id] || !contactNotes[contact._id]}
                      >
                        <i className="fas fa-check-circle"></i>
                        <span>Submit</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default User_databse;
