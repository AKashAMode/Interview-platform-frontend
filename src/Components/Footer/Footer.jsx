import { Brain } from "lucide-react";
import "./Footer.css"

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-icon-box">
                <Brain className="footer-brand-icon" />
                <h2 className="footer-brand-title">PrepPath Pro</h2>
              </div>
              <p className="footer-brand-description">
                AI-powered interview preparation platform for career success. 
                Master your skills and land your dream job.
              </p>
            </div>

            <div className="footer-links-grid">
              <div className="footer-column">
                <h3 className="footer-heading">Features</h3>
                <ul className="footer-menu-list">
                  <li>
                    <a href="#" className="footer-link">AI Interviews</a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">Resume Analyzer</a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">Analytics</a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">Scheduling</a>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <h3 className="footer-heading">Company</h3>
                <ul className="footer-menu-list">
                  <li>
                    <a href="#" className="footer-link">About</a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">Careers</a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">Blog</a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">Contact</a>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <h3 className="footer-heading">Support</h3>
                <ul className="footer-menu-list">
                  <li>
                    <a href="#" className="footer-link">Help Center</a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">Terms of Service</a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">Documentation</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="copyright-container">
              <p className="copyright-text">
                © 2024 PrepPath Pro. All rights reserved.
              </p>
              <div className="footer-social-links">
                <span className="footer-divider">•</span>
                <span className="footer-location">Made with ❤️ for your success</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;