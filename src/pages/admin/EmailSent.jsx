import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import "../../assets/ViewProgress.css";
import Swal from 'sweetalert2';

const EmailSent = () => {
  const navigate = useNavigate();
  const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [designation, setDesignation] = useState('');

  useEffect(() => {
    const storedUserName = sessionStorage.getItem('userName');
    if (!storedUserName) {
      navigate('/');
      return;
    }

    setUserName(storedUserName);
    const designations = {
      'Aswin Chacko': 'Chief Marketing Officer',
      'Sachu saji': 'Chief Technology Officer', 
      'Aswin Kumar Ps': 'Chief Sales Officer',
      'Eapen Thomas': 'Chief Financial Officer',
      'Aromal p Girish': 'Chief Outreach Officer',
      'Chris Benny': 'Chief Operation Officer'
    };
    setDesignation(designations[storedUserName] || 'Administrator');
  }, [navigate]);

  const handleChange = (e) => {
    setEmailData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailData.to.trim() || !emailData.subject.trim() || !emailData.body.trim()) {
      Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Please fill in all fields' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.to)) {
      Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address' });
      return;
    }

    try {
      setLoading(true);

      const emailPayload = {
        recipientEmail: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
        senderName: userName,
        senderDesignation: designation
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Failed to send email');

      Swal.fire({ icon: 'success', title: 'Success', text: 'Email sent successfully!' });
      setEmailData({ to: '', subject: '', body: '' });

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to send email. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <div className="content-wrapper" style={{ padding: '2rem' }}>
          <div className="header-section" style={{ marginBottom: '2rem' }}>
            <h1 className="page-title" style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#1a2236',
              marginBottom: '0.5rem',
              textAlign: 'left',
              borderBottom: '3px solid #3b82f6',
              paddingBottom: '0.75rem',
              width: 'fit-content'
            }}>Email Communication Center</h1>
            <p style={{
              color: '#6b7280',
              fontSize: '1.1rem',
              marginTop: '0.5rem'
            }}>Send professional emails to clients and team members</p>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '2rem',
            maxWidth: '1600px',
            margin: '0 auto'
          }}>
            {/* Left side - Email Form */}
            <div style={{ flex: '1' }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                padding: '2rem',
                border: '1px solid #e5e7eb'
              }}>
                <form onSubmit={handleSubmit} className="email-form">
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="to" style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>Recipient Email</label>
                    <div className="input-wrapper">
                      <i className="fas fa-envelope input-icon" style={{ color: '#6b7280' }}></i>
                      <input 
                        type="email" 
                        id="to" 
                        name="to" 
                        value={emailData.to} 
                        onChange={handleChange} 
                        placeholder="Enter recipient's email address" 
                        className="form-control with-icon"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 2.5rem',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="subject" style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>Subject</label>
                    <div className="input-wrapper">
                      <i className="fas fa-heading input-icon" style={{ color: '#6b7280' }}></i>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        value={emailData.subject} 
                        onChange={handleChange} 
                        placeholder="Enter email subject" 
                        className="form-control with-icon"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 2.5rem',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="body" style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>Message</label>
                    <div className="input-wrapper">
                      <i className="fas fa-pen-alt input-icon textarea-icon" style={{ color: '#6b7280' }}></i>
                      <textarea 
                        id="body" 
                        name="body" 
                        value={emailData.body} 
                        onChange={handleChange} 
                        placeholder="Compose your message..." 
                        className="form-control with-icon" 
                        rows="12"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 2.5rem',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          fontSize: '1rem',
                          resize: 'vertical',
                          minHeight: '200px',
                          transition: 'all 0.3s ease'
                        }}
                      ></textarea>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className={`send-button ${loading ? 'sending' : ''}`}
                    disabled={loading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#fff',
                      backgroundColor: '#3b82f6',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      width: '100%',
                      opacity: loading ? '0.8' : '1',
                      ':hover': {
                        backgroundColor: '#2563eb'
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="loading-dots">
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                        </div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        <span>Send Email</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right side - Instructions */}
            <div style={{ flex: '1' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  color: '#1a2236',
                  marginBottom: '1.5rem',
                  fontWeight: '600',
                  borderBottom: '2px solid #e5e7eb',
                  paddingBottom: '0.75rem'
                }}>Email Guidelines</h2>

                <div style={{
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  padding: '1.25rem',
                  borderRadius: '8px',
                  marginBottom: '2rem',
                  border: '1px solid #fcd34d'
                }}>
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <i className="fas fa-exclamation-triangle"></i>
                    Important Notice:
                  </strong>
                  <p style={{ lineHeight: '1.5' }}>This email system is strictly for official business communications. Any misuse, including spam, harassment, or unauthorized purposes, will result in immediate disciplinary action.</p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    color: '#1a2236',
                    marginBottom: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <i className="fas fa-check-circle" style={{ color: '#3b82f6' }}></i>
                    Best Practices
                  </h3>
                  <ul style={{ 
                    paddingLeft: '1.5rem',
                    color: '#4b5563',
                    lineHeight: '1.6'
                  }}>
                    <li style={{ marginBottom: '0.75rem' }}>Keep your subject line clear and professional</li>
                    <li style={{ marginBottom: '0.75rem' }}>Introduce yourself and your purpose clearly</li>
                    <li style={{ marginBottom: '0.75rem' }}>Be concise and specific in your message</li>
                    <li style={{ marginBottom: '0.75rem' }}>Proofread before sending</li>
                    <li style={{ marginBottom: '0.75rem' }}>Include a professional signature</li>
                  </ul>
                </div>

                <div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    color: '#1a2236',
                    marginBottom: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <i className="fas fa-list-ol" style={{ color: '#3b82f6' }}></i>
                    Email Structure
                  </h3>
                  <ol style={{ 
                    paddingLeft: '1.5rem',
                    color: '#4b5563',
                    lineHeight: '1.6'
                  }}>
                    <li style={{ marginBottom: '0.75rem' }}>Professional greeting</li>
                    <li style={{ marginBottom: '0.75rem' }}>Brief introduction</li>
                    <li style={{ marginBottom: '0.75rem' }}>Main message body</li>
                    <li style={{ marginBottom: '0.75rem' }}>Clear call to action</li>
                    <li style={{ marginBottom: '0.75rem' }}>Professional closing</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSent;
