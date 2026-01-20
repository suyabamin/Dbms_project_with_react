import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Sidebar.css";

function Sidebar() {
  return (
    <nav className="sidebar bg-light p-3">
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/admin/dashboard" className="nav-link">
            <i className="fa fa-dashboard"></i> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/rooms" className="nav-link">
            <i className="fa fa-bed"></i> Rooms
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/users" className="nav-link">
            <i className="fa fa-users"></i> Users
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/bookings" className="nav-link">
            <i className="fa fa-calendar"></i> Bookings
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/reviews" className="nav-link">
            <i className="fa fa-star"></i> Reviews
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/features" className="nav-link">
            <i className="fa fa-cog"></i> Features
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/services" className="nav-link">
            <i className="fa fa-concierge-bell"></i> Services
          </Link>
        </li>
        <li className="nav-item mt-4 border-top">
          <Link to="/admin/settings" className="nav-link">
            <i className="fa fa-sliders"></i> Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
