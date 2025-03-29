import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Form, Dropdown, InputGroup, Button, Offcanvas } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import ContactForm from "../components/ContactForm";
import sampleData from "../components/sampleData"; // Import sample data

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Select Categories");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredData, setFilteredData] = useState(sampleData);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [modes, setModes] = useState([]);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchModes = async () => {
      const { data, error } = await supabase
        .from('modes')
        .select('*');
      if (data) {
        setModes(data);
      } else {
        console.error("Error fetching modes:", error);
      }
    };

    const fetchProfileImage = async () => {
      const { data: { publicUrl }, error } = supabase.storage
        .from(STORAGE_BUCKET_NAME)
        .getPublicUrl('path/to/profile/image'); // Replace with actual path
      if (publicUrl) {
        setProfileImage(publicUrl);
      } else {
        console.error("Error fetching profile image:", error);
        setProfileImage("https://via.placeholder.com/60");
      }
    };

    fetchModes();
    fetchProfileImage();
  }, []);

  const handleShowFilters = () => setShowFilters(true);
  const handleCloseFilters = () => setShowFilters(false);

  const handleSearch = () => {
    const filtered = sampleData.filter(job => {
      return (
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (category === "Select Categories" || job.category === category)
      );
    });
    setFilteredData(filtered);
  };

  const handleContactClick = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setShowContactForm(true);
  };

  const handleCloseContactForm = () => {
    setSelectedFreelancer(null);
    setShowContactForm(false);
  };

  return (
    <div className="d-flex">
      <Sidebar userData={{ profileImage }} uploadedImageUrl={profileImage} /> {/* Pass userData and uploadedImageUrl as needed */}
      <div className="container mt-4">
        {/* Search Bar */}
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <InputGroup className="w-100">
                <Form.Control
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="primary" onClick={handleSearch}>Search</Button>
              </InputGroup>
            </div>
          </div>
        </div>

        {/* Advanced Search Button */}
        <div className="text-center mb-3 mt-3">
          <Button variant="outline-primary" onClick={handleShowFilters}>
            Advanced Search
          </Button>
        </div>

        {/* Offcanvas (Sidebar) for Advanced Search Filters */}
        <Offcanvas show={showFilters} onHide={handleCloseFilters} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Advanced Search</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <h5>Category</h5>
            <Dropdown onSelect={(eventKey) => setCategory(eventKey)}>
              <Dropdown.Toggle variant="light">{category}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="Web Development">Web Development</Dropdown.Item>
                <Dropdown.Item eventKey="Design">Design</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <h5 className="mt-3">Experience Level</h5>
            <Form.Check type="checkbox" label="Entry level" />
            <Form.Check type="checkbox" label="Intermediate" />
            <Form.Check type="checkbox" label="Expert" />

            <h5 className="mt-3">Education Level</h5>
            <Form.Check type="checkbox" label="Bachelor's degree" />
            <Form.Check type="checkbox" label="Master's degree" />
            <Form.Check type="checkbox" label="Doctoral degree" />

            <h5 className="mt-3">Payment</h5>
            <Form.Check type="radio" label="Hourly" name="payment" />
            <Form.Check type="radio" label="Fixed-Price" name="payment" />

            <Button variant="success" className="mt-3 w-100" onClick={handleCloseFilters}>
              Apply Filters
            </Button>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Job Listings */}
        <div className="row">
          <div className="col-md-9 mx-auto">
            {filteredData.map((job) => (
              <div key={job.id} className="p-3 mb-3 border rounded">
                <p className="text-muted">{new Date(job.time_posted).toLocaleString()}</p>
                <h5><a href="#">{job.title}</a></h5>
                <p>
                  {job.description}
                </p>
                <div className="d-flex gap-2">
                  <span className="badge bg-secondary">{job.category}</span>
                  <span className="badge bg-secondary">{job.experience_level}</span>
                  <span className="badge bg-secondary">{job.education_level}</span>
                </div>
                <p className="fw-bold mt-2">{job.payment_type}</p>
                <div className="d-flex align-items-center">
                  <img
                    src={job.freelancer.image}
                    alt={job.freelancer.name}
                    className="rounded-circle"
                    style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }}
                  />
                  <div>
                    <p className="mb-0">{job.freelancer.name}</p>
                    <Button variant="outline-primary" onClick={() => handleContactClick(job.freelancer)}>Contact Me</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm
          show={showContactForm}
          onHide={handleCloseContactForm}
          freelancer={selectedFreelancer}
        />
      )}
    </div>
  );
}