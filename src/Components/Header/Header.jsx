// import "./Header.css";
// import { NavLink } from "react-router-dom";
// import { useState } from "react";
// import { Menu, X, Brain } from "lucide-react";

// function Header() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const closeMobileMenu = () => {
//     setIsMobileMenuOpen(false);
//   };

//   return (
//     <header className="main-header">
//       <div className="main-header-container">
//         {/* Brand Section */}
//         <div className="brand-container">
//           <NavLink to="/" className="brand-link" onClick={closeMobileMenu}>
//             <div className="brand-icon">
//               <Brain className="brand-icon-svg" />
//             </div>
//             <span className="brand-name">PrepPath Pro</span>
//           </NavLink>
//         </div>
        
   
//         <nav className="desktop-nav">
//           <ul className="nav-list">
//             <li className="nav-item">
//               <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
//             </li>
//             <li className="nav-item">
//               <NavLink to="/interview" className="nav-link">AI Interview</NavLink>
//             </li>
//             <li className="nav-item">
//               <NavLink to="/schedule" className="nav-link">Schedule</NavLink>
//             </li>
//             <li className="nav-item">
//               <NavLink to="/profile" className="nav-link">Profile</NavLink>
//             </li>
//           </ul>
//         </nav>
        
//         {/* Desktop Auth Section */}
//         <div className="desktop-auth">
//           <a href="#" className="sign-in-link">Sign In</a>
//           <NavLink to="/register">
//             <button className="get-started-btn">Get Started</button>
//           </NavLink>
//         </div>

//         {/* Mobile Menu Button */}
//         <button 
//           className="mobile-menu-btn"
//           onClick={toggleMobileMenu}
//           aria-label="Toggle mobile menu"
//           aria-expanded={isMobileMenuOpen}
//         >
//           {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Navigation Overlay */}
//       <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
//         <nav className="mobile-nav">
//           <ul className="mobile-nav-list">
//             <li className="mobile-nav-item">
//               <NavLink 
//                 to="/dashboard" 
//                 className="mobile-nav-link"
//                 onClick={closeMobileMenu}
//               >
//                 Dashboard
//               </NavLink>
//             </li>
//             <li className="mobile-nav-item">
//               <NavLink 
//                 to="/interview" 
//                 className="mobile-nav-link"
//                 onClick={closeMobileMenu}
//               >
//                 AI Interview
//               </NavLink>
//             </li>
  
//             <li className="mobile-nav-item">
//               <NavLink 
//                 to="/schedule" 
//                 className="mobile-nav-link"
//                 onClick={closeMobileMenu}
//               >
//                 Schedule
//               </NavLink>
//             </li>
//             <li className="mobile-nav-item">
//               <NavLink 
//                 to="/profile" 
//                 className="mobile-nav-link"
//                 onClick={closeMobileMenu}
//               >
//                 Profile
//               </NavLink>
//             </li>
//           </ul>
          
//           {/* Mobile Auth Section */}
//           <div className="mobile-auth">
//             <a href="#" className="mobile-sign-in-link" onClick={closeMobileMenu}>
//               Sign In
//             </a>
//             <NavLink to="/register" onClick={closeMobileMenu}>
//               <button className="mobile-get-started-btn">Get Started</button>
//             </NavLink>
//           </div>
//         </nav>
//       </div>

//       {/* Backdrop for mobile menu */}
//       {isMobileMenuOpen && (
//         <div className="mobile-backdrop" onClick={closeMobileMenu}></div>
//       )}
//     </header>
//   );
// }

// export default Header;










import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Brain } from "lucide-react";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleProtectedNavigation = (path, e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
    closeMobileMenu();
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
            <li className="nav-item">
              <NavLink 
                to="/profile" 
                className="nav-link"
                onClick={(e) => handleProtectedNavigation('/profile', e)}
              >
                Profile
              </NavLink>
            </li>
          </ul>
        </nav>
        
        {/* Desktop Auth Section */}
        <div className="desktop-auth">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="sign-in-link">
              Sign Out
            </button>
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
          </ul>
          
          {/* Mobile Auth Section */}
          <div className="mobile-auth">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="mobile-sign-in-link">
                Sign Out
              </button>
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