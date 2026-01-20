import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Home.css";

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold">
                Welcome to HotelBook
              </h1>
              <p className="lead">
                Find and book your perfect hotel room with ease. Explore our
                collection of premium rooms and exceptional services.
              </p>
              <div>
                <Link to="/rooms" className="btn btn-primary btn-lg me-3">
                  <i className="fa fa-bed"></i> Browse Rooms
                </Link>
                <a href="#features" className="btn btn-outline-primary btn-lg">
                  Learn More
                </a>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <i className="fa fa-building fa-10x text-primary opacity-25"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose HotelBook?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-card p-4 text-center">
                <i className="fa fa-search fa-3x text-primary mb-3"></i>
                <h5>Easy Search</h5>
                <p>Find your perfect room with our advanced search filters.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card p-4 text-center">
                <i className="fa fa-lock fa-3x text-primary mb-3"></i>
                <h5>Secure Booking</h5>
                <p>Safe and secure payment processing with Paytm integration.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card p-4 text-center">
                <i className="fa fa-headphones fa-3x text-primary mb-3"></i>
                <h5>24/7 Support</h5>
                <p>Get help anytime with our dedicated customer support team.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section bg-primary text-white py-5">
        <div className="container text-center">
          <h2 className="mb-4">Ready to Book Your Perfect Stay?</h2>
          <p className="lead mb-4">
            Browse our collection of premium rooms and book your next vacation
            today.
          </p>
          <Link to="/rooms" className="btn btn-light btn-lg">
            Start Browsing
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
