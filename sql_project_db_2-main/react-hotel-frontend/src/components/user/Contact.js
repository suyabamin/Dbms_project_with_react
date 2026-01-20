import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the message to a backend
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div>
      <section className="page-header bg-light py-4">
        <div className="container">
          <h1>Contact Us</h1>
          <p className="text-muted">
            Have questions? We'd love to hear from you
          </p>
        </div>
      </section>

      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-md-4 mb-4">
            <div className="contact-card text-center p-4">
              <i className="fa fa-map-marker fa-3x text-primary mb-3"></i>
              <h5>Address</h5>
              <p>123 Hotel Street, City Center</p>
              <p>Country, PIN - 000000</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="contact-card text-center p-4">
              <i className="fa fa-phone fa-3x text-primary mb-3"></i>
              <h5>Phone</h5>
              <p>+1 (800) 123-4567</p>
              <p>Available 24/7</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="contact-card text-center p-4">
              <i className="fa fa-envelope fa-3x text-primary mb-3"></i>
              <h5>Email</h5>
              <p>support@hotelbook.com</p>
              <p>Response within 24 hours</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div className="card-body p-5">
                <h4 className="card-title mb-4">Send us a Message</h4>

                {submitted && (
                  <div className="alert alert-success alert-dismissible fade show">
                    Thank you! We'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
