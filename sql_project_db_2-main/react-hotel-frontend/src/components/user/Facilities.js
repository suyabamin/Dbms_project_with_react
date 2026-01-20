import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Facilities.css";

function Facilities() {
  const facilities = [
    {
      icon: "fa-wifi",
      name: "High-Speed WiFi",
      description: "Complimentary WiFi throughout the hotel",
    },
    {
      icon: "fa-tv",
      name: "Smart TV",
      description: "HD smart television with streaming services",
    },
    {
      icon: "fa-snowflake-o",
      name: "Air Conditioning",
      description: "Individual climate control in every room",
    },
    {
      icon: "fa-bath",
      name: "Modern Bathroom",
      description: "Equipped with premium amenities and toiletries",
    },
    {
      icon: "fa-bed",
      name: "Comfortable Bedding",
      description: "Premium quality mattresses and linens",
    },
    {
      icon: "fa-umbrella",
      name: "Minibar",
      description: "Complimentary snacks and beverages",
    },
    {
      icon: "fa-phone",
      name: "24/7 Room Service",
      description: "Round-the-clock room service available",
    },
    {
      icon: "fa-lock",
      name: "Safe Locker",
      description: "Secure safe deposit box in every room",
    },
  ];

  return (
    <div>
      <section className="page-header bg-light py-4">
        <div className="container">
          <h1>Our Facilities</h1>
          <p className="text-muted">
            Experience comfort and luxury in every room
          </p>
        </div>
      </section>

      <div className="container py-5">
        <div className="row">
          {facilities.map((facility, idx) => (
            <div key={idx} className="col-md-3 mb-4">
              <div className="facility-card text-center p-4">
                <i className={`fa ${facility.icon} fa-3x text-primary mb-3`}></i>
                <h5>{facility.name}</h5>
                <p className="text-muted small">{facility.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Facilities;
