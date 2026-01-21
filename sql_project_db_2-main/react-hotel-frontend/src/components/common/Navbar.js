import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.getUser());
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Listen for storage changes (login/logout from other tabs or this tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = auth.getUser();
      setUser(updatedUser);
    };

    // Listen for storage events
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom auth change event
    window.addEventListener("authChange", handleStorageChange);

    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (dropdownOpen && !e.target.closest('.dropdown')) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleStorageChange);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    try {
      console.log("🚪 Logout started...");
      
      // Close the dropdown
      setIsOpen(false);
      
      // Clear everything
      auth.logout();
      sessionStorage.clear();
      localStorage.clear();
      
      console.log("✅ Auth cleared, user data:", auth.getUser());
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("authChange"));
      
      // Update state immediately
      setUser(null);
      
      console.log("🚪 Navigating to login...");
      
      // Navigate to login page
      setTimeout(() => {
        navigate("/login");
      }, 100);
    } catch (error) {
      console.error("❌ Logout error:", error);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img 
            src="https://selective-gray-xhab2ktkpn.edgeone.app/6-01-removebg-preview.png" 
            alt="Hotel Logo" 
            style={{ width: '40px', height: '40px', marginRight: '10px' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span>HotelBook</span>
        </Link>
        <button
          className="navbar-toggler"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/rooms" className="nav-link">
                Rooms
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/facilities" className="nav-link">
                Facilities
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </li>
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link"
                    onClick={() => {
                      console.log("🔽 Dropdown clicked, opening:", !dropdownOpen);
                      setDropdownOpen(!dropdownOpen);
                    }}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'none' }}
                  >
                    <i className="fa fa-user"></i> {user.name}
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""}`} style={{ display: dropdownOpen ? "block" : "none" }}>
                    <li>
                      <Link 
                        to="/profile" 
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <i className="fa fa-user-circle me-2"></i>Profile
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/my-bookings" 
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <i className="fa fa-calendar me-2"></i>My Bookings
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/my-reviews" 
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <i className="fa fa-star me-2"></i>My Reviews
                      </Link>
                    </li>
                    {user.role === "admin" && (
                      <>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <Link 
                            to="/admin/dashboard" 
                            className="dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <i className="fa fa-tachometer me-2"></i>Admin Panel
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger fw-bold"
                        onClick={() => {
                          console.log("🔴 Logout button clicked");
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        style={{ cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                      >
                        <i className="fa fa-sign-out me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link btn btn-primary text-white ms-2">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
