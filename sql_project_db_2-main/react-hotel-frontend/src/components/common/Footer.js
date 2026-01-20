import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Footer.css";

function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-3 mb-4">
            <h5>
              <i className="fa fa-hotel"></i> HotelBook
            </h5>
            <p>Your trusted hotel booking platform.</p>
          </div>
          <div className="col-md-3 mb-4">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-white-50">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-white-50">
                  Rooms
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white-50">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h6>Support</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/contact" className="text-white-50">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-white-50">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-white-50">
                  Terms
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h6>Follow Us</h6>
            <div>
              <a href="#" className="text-white-50 me-3">
                <i className="fa fa-facebook"></i>
              </a>
              <a href="#" className="text-white-50 me-3">
                <i className="fa fa-twitter"></i>
              </a>
              <a href="#" className="text-white-50 me-3">
                <i className="fa fa-instagram"></i>
              </a>
              <a href="#" className="text-white-50">
                <i className="fa fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="text-center text-white-50">
          <p>&copy; 2026 HotelBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
