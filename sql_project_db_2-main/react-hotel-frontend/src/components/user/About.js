import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/About.css";

function About() {
  return (
    <div>
      <section className="page-header bg-light py-4">
        <div className="container">
          <h1>About HotelBook</h1>
        </div>
      </section>

      <div className="container py-5">
        <div className="row align-items-center mb-5">
          <div className="col-md-6">
            <h2>Welcome to HotelBook</h2>
            <p>
              HotelBook is your trusted online hotel booking platform, dedicated
              to providing seamless travel experiences to guests worldwide. Since
              our inception, we have been committed to offering the best selection
              of hotels, competitive pricing, and exceptional customer service.
            </p>
            <p>
              Our mission is to make hotel booking simple, affordable, and
              accessible to everyone. Whether you're planning a business trip, a
              vacation, or a special getaway, HotelBook has the perfect room for
              you.
            </p>
          </div>
          <div className="col-md-6 text-center">
            <i className="fa fa-building fa-10x text-primary opacity-25"></i>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-md-4 mb-4">
            <div className="about-card text-center p-4">
              <i className="fa fa-check-circle fa-3x text-success mb-3"></i>
              <h5>Quality Assurance</h5>
              <p>All our partner hotels meet strict quality standards</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="about-card text-center p-4">
              <i className="fa fa-handshake-o fa-3x text-info mb-3"></i>
              <h5>Best Prices</h5>
              <p>Guaranteed lowest rates for all our hotel partners</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="about-card text-center p-4">
              <i className="fa fa-heart fa-3x text-danger mb-3"></i>
              <h5>Customer First</h5>
              <p>Your satisfaction is our top priority</p>
            </div>
          </div>
        </div>

        <section className="bg-light p-5 rounded">
          <h3 className="mb-4">Why Choose Us?</h3>
          <ul className="list-unstyled">
            <li className="mb-3">
              <i className="fa fa-check text-success me-2"></i>
              Largest selection of premium hotels worldwide
            </li>
            <li className="mb-3">
              <i className="fa fa-check text-success me-2"></i>
              Best price guarantee or we'll match it
            </li>
            <li className="mb-3">
              <i className="fa fa-check text-success me-2"></i>
              Secure and easy booking process
            </li>
            <li className="mb-3">
              <i className="fa fa-check text-success me-2"></i>
              24/7 customer support in multiple languages
            </li>
            <li className="mb-3">
              <i className="fa fa-check text-success me-2"></i>
              Exclusive deals and discounts for members
            </li>
            <li className="mb-3">
              <i className="fa fa-check text-success me-2"></i>
              Flexible cancellation policies
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default About;
