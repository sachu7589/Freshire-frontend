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
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <div className="content-wrapper">
          <h2>Send Professional Email</h2>
          <form onSubmit={handleSubmit} className="email-form">
            <div className="form-group">
              <label htmlFor="to">To</label>
              <input type="email" id="to" name="to" value={emailData.to} onChange={handleChange} placeholder="Recipient's email" className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" value={emailData.subject} onChange={handleChange} placeholder="Enter subject" className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="body">Email Body</label>
              <textarea id="body" name="body" value={emailData.body} onChange={handleChange} placeholder="Compose your email..." className="form-control" rows="10"></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send Email'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailSent;
