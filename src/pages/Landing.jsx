import { Link } from 'react-router-dom';
import '../assets/Landing.css';
import { FaShieldAlt, FaLock, FaWifi, FaLaptop, FaFolder } from 'react-icons/fa';

function Landing() {
  return (
    <div className="landing-main">
      <nav className="landing-nav" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        position: 'fixed',
        width: '100%',
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <div className="landing-logo">
          <img src="/logo.png" alt="FresHire Logo" height="50" />
        </div>
        <Link to="/login" className="landing-login-btn" style={{ backgroundColor: '#233ce6', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none' }}>
          <FaLock /> Admin Access
        </Link>
      </nav>

      <div className="landing-container" style={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e6f0ff 100%)',
        width: '100%',
        maxWidth: '100%',
        padding: '15rem 2rem 6rem 2rem', /* Adjusted padding for mobile */
        borderBottom: '5px solid #233ce6',
        minHeight: '100vh'
      }}> 
        <div className="landing-content" style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          flexWrap: 'wrap',
          gap: '3rem' /* Added gap for better spacing when wrapped */
        }}>
          <div className="landing-text" style={{ flex: '1', minWidth: '280px' }}>
            <div style={{ width: '80px', height: '5px', background: '#233ce6', marginBottom: '1.5rem' }}></div>
            <h1 style={{ color: '#1a2b4b', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', letterSpacing: '0.5px' }}>
              ENTERPRISE
              <br />
              <span className="highlight" style={{ color: '#233ce6', fontWeight: 700, position: 'relative' }}>
                MANAGEMENT SYSTEM
                <span style={{ position: 'absolute', bottom: '-10px', left: '0', width: '60px', height: '3px', background: '#233ce6' }}></span>
              </span>
            </h1>
            <p className="subtitle" style={{ color: '#2c3e50', lineHeight: '1.8', maxWidth: '600px', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', margin: '2rem 0' }}>
              Welcome to FresHire's secure administrative platform. Streamlined resource 
              management with enterprise-grade security for organizational excellence.
            </p>
            <div className="cta-container" style={{ 
              marginTop: '2rem', 
              display: 'flex', 
              gap: '1rem',
              flexWrap: 'wrap' /* Allow buttons to wrap on small screens */
            }}>
              <button 
                className="learn-more-btn" 
                onClick={() => document.getElementById('policy-section').scrollIntoView({ behavior: 'smooth' })}
                style={{ 
                  backgroundColor: '#233ce6', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '4px', 
                  border: 'none', 
                  fontWeight: 600, 
                  boxShadow: '0 4px 6px rgba(35, 60, 230, 0.2)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                Learn More
              </button>
              <a href="https://wa.me/919645937029" className="contact-btn" style={{ 
                backgroundColor: 'transparent', 
                color: '#233ce6', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '4px', 
                border: '2px solid #233ce6', 
                fontWeight: 600,
                transition: 'background-color 0.3s ease, color 0.3s ease',
                textDecoration: 'none',
                display: 'inline-block'
              }}>Contact Us</a>
            </div>
            <div className="feature-badges" style={{ 
              display: 'flex', 
              gap: 'clamp(0.5rem, 3vw, 1.5rem)', 
              marginTop: '3rem',
              flexWrap: 'wrap' /* Allow badges to wrap */
            }}>
              {['Secure', 'Scalable', 'Reliable'].map(badge => (
                <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#233ce6' }}></div>
                  <span style={{ color: '#1a2b4b', fontWeight: '500' }}>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="illustration" style={{ 
            flex: '1', 
            minWidth: '280px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            margin: '0 auto' /* Center on small screens */
          }}>
            <div 
              className="dashboard-preview" 
              style={{ 
                position: 'relative',
                background: 'white', 
                borderRadius: '12px', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(35, 60, 230, 0.1)',
                width: '100%',
                maxWidth: '500px',
                overflow: 'hidden',
                transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                // Only apply effects on devices that support hover
                if (window.matchMedia('(hover: hover)').matches) {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateY(-8deg) rotateX(8deg) scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (window.matchMedia('(hover: hover)').matches) {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(5deg)';
                }
              }}
              onMouseMove={(e) => {
                if (window.matchMedia('(hover: hover)').matches) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  
                  const moveX = (x - centerX) / 20;
                  const moveY = (y - centerY) / 20;
                  
                  e.currentTarget.style.transform = `perspective(1000px) rotateY(${-5 - moveX}deg) rotateX(${5 + moveY}deg) scale(1.02)`;
                }
              }}
            >
              <div className="dashboard-header" style={{ 
                background: 'linear-gradient(90deg, #233ce6, #3b5fe9)', 
                padding: '1rem', 
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img src="/logo_white.png" alt="FresHire Logo" style={{ height: '30px', width: 'auto', marginRight: '8px', filter: 'brightness(1.2)' }} /> 
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <FaFolder />
                  <FaLaptop />
                  <FaWifi />
                </div>
              </div>
              <div className="dashboard-content" style={{ padding: '1.5rem' }}>
                <div className="dashboard-stats" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ 
                      background: i === 1 ? 'rgba(35, 60, 230, 0.1)' : '#f8fafc', 
                      padding: '1rem', 
                      borderRadius: '8px',
                      height: '80px',
                      boxShadow: i === 1 ? '0 4px 12px rgba(35, 60, 230, 0.15)' : 'none',
                      border: i !== 1 ? '1px solid #e6e6e6' : 'none'
                    }}>
                      {i === 1 && (
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.3rem' }}>Total Applicants</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#233ce6' }}>1,248</div>
                        </div>
                      )}
                      {i === 2 && (
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.3rem' }}>Interviews</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a2b4b' }}>342</div>
                        </div>
                      )}
                      {i === 3 && (
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.3rem' }}>Hired</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a2b4b' }}>87</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="dashboard-chart" style={{ 
                  height: '150px', 
                  background: '#f8fafc',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  border: '1px solid #e6e6e6',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1a2b4b' }}>
                    Monthly Applications
                  </div>
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '0', 
                    left: '0', 
                    width: '100%', 
                    height: '60%', 
                    background: 'linear-gradient(180deg, rgba(35, 60, 230, 0.1) 0%, rgba(35, 60, 230, 0) 100%)'
                  }}></div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-end', 
                    height: '70%', 
                    gap: '8px', 
                    position: 'relative',
                    zIndex: '1',
                    paddingTop: '1rem'
                  }}>
                    {[65, 48, 80, 95, 68, 75, 90, 85, 92, 78, 60, 72].map((height, index) => (
                      <div key={index} style={{ 
                        height: `${height}%`, 
                        flex: '1',
                        background: 'linear-gradient(180deg, #233ce6 0%, #3b5fe9 100%)',
                        borderRadius: '3px 3px 0 0',
                        position: 'relative'
                      }}>
                        {index % 3 === 0 && (
                          <div style={{ 
                            position: 'absolute', 
                            bottom: '-20px', 
                            left: '50%', 
                            transform: 'translateX(-50%)',
                            fontSize: '0.6rem',
                            color: '#666'
                          }}>
                            {['Jan', 'Apr', 'Jul', 'Oct'][index/3]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="dashboard-table" style={{ 
                  height: '100px', 
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e6e6e6',
                  padding: '0.8rem',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#1a2b4b' }}>Recent Applicants</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e6e6e6' }}>
                    <span style={{ color: '#233ce6' }}>Sarah Johnson</span>
                    <span style={{ color: '#666' }}>Software Engineer</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e6e6e6' }}>
                    <span style={{ color: '#233ce6' }}>Michael Chen</span>
                    <span style={{ color: '#666' }}>Product Manager</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="policy-section" id='policy-section' style={{
        background: 'white',
        padding: '8rem 1.5rem 4rem',
        width: '100%',
        minHeight: '100dvh'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ 
            textAlign: 'center', 
            color: '#1a2b4b', 
            marginBottom: '2.5rem', 
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            padding: '0 1rem'
          }}>
            Our Commitment to <span style={{ color: '#233ce6' }}>Privacy & Security</span>
          </h2>
          
          <div className="policy-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            padding: '0 1rem'
          }}>
            {[
              { 
                icon: <FaShieldAlt />, 
                title: 'Data Protection', 
                description: 'Enterprise-grade encryption and security protocols to safeguard your sensitive information. Never share your credentials with others.' 
              },
              { 
                icon: <FaLock />, 
                title: 'Privacy Compliance', 
                description: 'Full compliance with GDPR, CCPA, and other global privacy regulations. Keep your login information confidential at all times.' 
              },
              { 
                icon: <FaWifi />, 
                title: 'Secure Access', 
                description: 'Multi-factor authentication and role-based access controls. Remember to protect your account details and never share passwords.' 
              }
            ].map((policy, index) => (
              <div key={index} className="policy-card" style={{
                padding: '2rem',
                borderRadius: '12px',
                background: 'white',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid #f0f0f0'
              }}
              onMouseEnter={(e) => {
                if (window.matchMedia('(hover: hover)').matches) {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(35, 60, 230, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (window.matchMedia('(hover: hover)').matches) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
                }
              }}>
                <div style={{ fontSize: '2.5rem', color: '#233ce6', marginBottom: '1.5rem' }}>
                  {policy.icon}
                </div>
                <h3 style={{ color: '#1a2b4b', marginBottom: '1rem', fontSize: '1.25rem' }}>
                  {policy.title}
                </h3>
                <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                  {policy.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Add responsive media query styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .landing-nav {
            padding: 0.75rem 1rem;
          }
          
          .landing-logo img {
            height: 40px;
          }
          
          .landing-container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .dashboard-preview {
            transform: perspective(1000px) rotateY(0) rotateX(0) !important;
          }
        }
        
        @media (max-width: 480px) {
          .landing-nav {
            padding: 0.5rem;
          }
          
          .landing-logo img {
            height: 35px;
          }
          
          .landing-login-btn {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
          }
          
          .cta-container {
            flex-direction: column;
            width: 100%;
          }
          
          .cta-container button,
          .cta-container a {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Landing;
