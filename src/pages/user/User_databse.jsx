import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./User_sidebar";
import TopNavbar from "./User_navbar";
import Swal from "sweetalert2";
import "../../assets/User_dash.css";

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
        const response = await fetch(`https://freshire-backend.onrender.com/api/contacts/employee/${userId}`);
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
      const updateResponse = await fetch('https://freshire-backend.onrender.com/api/contact-updates', {
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
      const viewResponse = await fetch(`https://freshire-backend.onrender.com/api/contacts/${contactId}/view`, {
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
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <TopNavbar />
          <main className="main-content">
            <div>Loading contacts...</div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <TopNavbar />
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
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <TopNavbar />
        <main className="main-content">
          
          <div className="table-container">
            <table className="database-table">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Social Media</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data-cell">
                      <div className="no-data-message">
                        No contacts available
                      </div>
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact, index) => (
                    <tr key={contact._id || index}>
                      <td>{contact.companyName}</td>
                      <td>{contact.email}</td>
                      <td>{contact.phone}</td>
                      <td>
                        <div className="social-links">
                          {contact.socialMedia && (
                            <a href={contact.socialMedia} target="_blank" rel="noopener noreferrer">Social Media</a>
                          )}
                        </div>
                      </td>
                      <td>
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
                      <td>
                        <textarea
                          className="notes-textarea"
                          value={contactNotes[contact._id] || ""}
                          onChange={(e) => setContactNotes({
                            ...contactNotes,
                            [contact._id]: e.target.value
                          })}
                          placeholder="Add notes here..."
                        />
                      </td>
                      <td>
                        <button 
                          className="submit-button"
                          onClick={() => handleSubmit(contact._id)}
                        >
                          Submit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <style>
            {`
              .table-container {
                margin: 2rem;
                background: white;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                overflow: hidden;
              }

              .database-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 0.95rem;
              }

              .database-table th {
                background: #4f46e5;
                color: white;
                padding: 1rem;
                text-align: left;
                font-weight: 600;
              }

              .database-table td {
                padding: 1rem;
                border-bottom: 1px solid #eee;
              }

              .database-table tr:hover {
                background-color: #f8f9fa;
              }

              .social-links {
                display: flex;
                gap: 1rem;
              }

              .social-links a {
                color: #4f46e5;
                text-decoration: none;
                font-weight: 500;
              }

              .social-links a:hover {
                text-decoration: underline;
              }

              .status-dropdown {
                padding: 0.5rem;
                border: 1px solid #ddd;
                border-radius: 5px;
                background: white;
                width: 100%;
                font-size: 0.9rem;
              }

              .status-dropdown:focus {
                outline: none;
                border-color: #4f46e5;
                box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
              }

              .notes-textarea {
                width: 100%;
                min-height: 80px;
                padding: 0.5rem 1rem 0.5rem 0.5rem;
                border: 1px solid #ddd;
                border-radius: 5px;
                resize: vertical;
                font-family: inherit;
                font-size: 0.9rem;
              }

              .notes-textarea:focus {
                outline: none;
                border-color: #4f46e5;
                box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
              }

              .submit-button {
                padding: 0.5rem 1rem;
                background-color: #4f46e5;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: background-color 0.2s;
              }

              .submit-button:hover {
                background-color: #4338ca;
              }

              .error-container {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 400px;
                background: white;
                margin: 2rem;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }

              .error-message {
                text-align: center;
                color: #4f46e5;
              }

              .error-message h2 {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
              }

              .error-message p {
                color: #666;
              }

              .no-data-cell {
                text-align: center;
              }

              .no-data-message {
                padding: 2rem;
                color: #666;
                font-size: 1.1rem;
              }
            `}
          </style>
        </main>
      </div>
    </div>
  );
}

export default User_databse;
