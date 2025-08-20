import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Brain, ChevronDown, User, Settings, LogOut } from "lucide-react";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', email: '' });
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    

    if (token) {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      } else {
        setUserInfo({
          firstName: 'John', 
          lastName: 'Doe',
          email: 'john.doe@example.com'
        });
      }
    }
  }, []);


  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleProtectedNavigation = (path, e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setIsProfileMenuOpen(false);
    navigate('/');
    closeMobileMenu();
  };

  const getInitials = () => {
    const first = userInfo.firstName || '';
    const last = userInfo.lastName || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="main-header">
      <div className="main-header-container">
        {/* Brand Section */}
        <div className="brand-container">
          <NavLink to="/" className="brand-link" onClick={closeMobileMenu}>
            <div className="brand-icon">
              <Brain className="brand-icon-svg" />
            </div>
            <span className="brand-name">PrepPath Pro</span>
          </NavLink>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink 
                to="/dashboard" 
                className="nav-link"
                onClick={(e) => handleProtectedNavigation('/dashboard', e)}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/interview" 
                className="nav-link"
                onClick={(e) => handleProtectedNavigation('/interview', e)}
              >
                AI Interview
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/schedule" 
                className="nav-link"
                onClick={(e) => handleProtectedNavigation('/schedule', e)}
              >
                Schedule
              </NavLink>
            </li>
          </ul>
        </nav>
        
        {/* Desktop Auth Section */}
        <div className="desktop-auth">
          {isAuthenticated ? (
            <div className="profile-section">
              <div className="profile-menu-container" ref={profileMenuRef}>
                <button 
                  className="profile-button" 
                  onClick={toggleProfileMenu}
                  aria-expanded={isProfileMenuOpen}
                >
                  <div className="profile-avatar">
                    {getInitials()}
                  </div>
                  <ChevronDown 
                    className={`profile-chevron ${isProfileMenuOpen ? 'rotated' : ''}`} 
                    size={16} 
                  />
                </button>
                
                {isProfileMenuOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-info">
                      <div className="profile-avatar-large">
                        {getInitials()}
                      </div>
                      <div className="profile-details">
                        <div className="profile-name">
                          {userInfo.firstName} {userInfo.lastName}
                        </div>
                        <div className="profile-email">{userInfo.email}</div>
                      </div>
                    </div>
                    
                    <div className="profile-menu-divider"></div>
                    
                    <div className="profile-menu-items">
                      <NavLink 
                        to="/profile" 
                        className="profile-menu-item"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User size={16} />
                        Profile
                      </NavLink>
                      <NavLink 
                        to="/settings" 
                        className="profile-menu-item"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings size={16} />
                        Settings
                      </NavLink>
                      <button 
                        onClick={handleLogout} 
                        className="profile-menu-item logout-item"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="sign-in-link">Sign In</NavLink>
              <NavLink to="/register">
                <button className="get-started-btn">Get Started</button>
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <nav className="mobile-nav">
          <ul className="mobile-nav-list">
            <li className="mobile-nav-item">
              <NavLink 
                to="/dashboard" 
                className="mobile-nav-link"
                onClick={(e) => {
                  handleProtectedNavigation('/dashboard', e);
                  closeMobileMenu();
                }}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="mobile-nav-item">
              <NavLink 
                to="/interview" 
                className="mobile-nav-link"
                onClick={(e) => {
                  handleProtectedNavigation('/interview', e);
                  closeMobileMenu();
                }}
              >
                AI Interview
              </NavLink>
            </li>
            <li className="mobile-nav-item">
              <NavLink 
                to="/resumeanalyzer" 
                className="mobile-nav-link"
                onClick={(e) => {
                  handleProtectedNavigation('/resumeanalyzer', e);
                  closeMobileMenu();
                }}
              >
                Resume Analyzer
              </NavLink>
            </li>
            <li className="mobile-nav-item">
              <NavLink 
                to="/schedule" 
                className="mobile-nav-link"
                onClick={(e) => {
                  handleProtectedNavigation('/schedule', e);
                  closeMobileMenu();
                }}
              >
                Schedule
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="mobile-nav-item">
                <NavLink 
                  to="/profile" 
                  className="mobile-nav-link"
                  onClick={(e) => {
                    handleProtectedNavigation('/profile', e);
                    closeMobileMenu();
                  }}
                >
                  Profile
                </NavLink>
              </li>
            )}
          </ul>
          
          {/* Mobile Auth Section */}
          <div className="mobile-auth">
            {isAuthenticated ? (
              <div className="mobile-profile-section">
                <div className="mobile-profile-info">
                  <div className="profile-avatar-large">
                    {getInitials()}
                  </div>
                  <div className="profile-details">
                    <div className="profile-name">
                      {userInfo.firstName} {userInfo.lastName}
                    </div>
                    <div className="profile-email">{userInfo.email}</div>
                  </div>
                </div>
                <button onClick={handleLogout} className="mobile-sign-out-btn">
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <NavLink to="/login" className="mobile-sign-in-link" onClick={closeMobileMenu}>
                  Sign In
                </NavLink>
                <NavLink to="/register" onClick={closeMobileMenu}>
                  <button className="mobile-get-started-btn">Get Started</button>
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div className="mobile-backdrop" onClick={closeMobileMenu}></div>
      )}
    </header>
  );
}

export default Header;