import { Link } from 'react-router-dom';
import '../assets/Landing.css';

function Landing() {
  return (
    <div className="landing-main">
      <div className="landing-background"></div>
      <header>
        <nav className="landing-nav">
          <div className="landing-logo">FresHire</div>
          <ul className="landing-menu">
            <li><Link to="/login" className="landing-login-btn">Login</Link></li>
          </ul>
        </nav>
      </header>

      <section id="hero" className="landing-hero">
        <div className="landing-hero-content">
          <h1>Find Your Next <br />Freelance Opportunity</h1>
          <p>Empowering to gain experience and earn money through freelance jobs.</p>
          <button className="landing-cta-btn">Get Started</button>
        </div>
      </section>
    </div>
  );
}

export default Landing;
