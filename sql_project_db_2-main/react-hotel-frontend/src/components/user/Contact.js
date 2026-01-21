import React, { useState, useEffect, useCallback } from "react";
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
  const [contactInfo, setContactInfo] = useState({
    address_line1: "Sayed Nagar B-Block Society",
    address_line2: "Panir Pump Road",
    phone: "01302616903",
    email: "khorsedalam0472@gmail.com"
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchContactInfo = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/settings");
      const settings = await response.json();

      // Convert settings array to object
      const settingsObj = {};
      settings.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });

      setContactInfo({
        address_line1: settingsObj.contact_address_line1 || contactInfo.address_line1,
        address_line2: settingsObj.contact_address_line2 || contactInfo.address_line2,
        phone: settingsObj.contact_phone || contactInfo.phone,
        email: settingsObj.contact_email || contactInfo.email
      });
    } catch (err) {
      console.error("Error fetching contact info:", err);
    } finally {
      setLoading(false);
    }
  }, [contactInfo]);

  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    }
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
              <p>{contactInfo.address_line1}</p>
              <p>{contactInfo.address_line2}</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="contact-card text-center p-4">
              <i className="fa fa-phone fa-3x text-primary mb-3"></i>
              <h5>Phone</h5>
              <p>{contactInfo.phone}</p>
              <p>Available 24/7</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="contact-card text-center p-4">
              <i className="fa fa-envelope fa-3x text-primary mb-3"></i>
              <h5>Email</h5>
              <p>{contactInfo.email}</p>
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
