import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Form, Dropdown, InputGroup, Button, Offcanvas } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import ContactForm from "../components/ContactForm";

const sampleData = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Looking for a skilled frontend developer to build responsive web applications.",
    category: "Web Development",
    experience_level: "Intermediate",
    education_level: "Bachelor's degree",
    payment_type: "Hourly",
    time_posted: "2025-03-28T10:00:00Z",
    freelancer: {
      name: "Allie P.",
      image: "https://static01.nyt.com/newsgraphics/2020/11/12/fake-people/4b806cf591a8a76adfc88d19e90c8c634345bf3d/fallbacks/mobile-05.jpg"
    }
  },
  {
    id: 2,
    title: "Graphic Designer",
    description: "Seeking a creative graphic designer for logo and brand identity projects.",
    category: "Design",
    experience_level: "Entry level",
    education_level: "Bachelor's degree",
    payment_type: "Fixed-Price",
    time_posted: "2025-03-27T15:30:00Z",
    freelancer: {
      name: "Edlira B.",
      image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D"
    }
  },
  {
    id: 3,
    title: "Backend Developer",
    description: "Backend developer needed for building scalable APIs and services.",
    category: "Web Development",
    experience_level: "Expert",
    education_level: "Master's degree",
    payment_type: "Hourly",
    time_posted: "2025-03-26T08:45:00Z",
    freelancer: {
      name: "Susan H.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D"
    }
  },
  {
    id: 4,
    title: "UI/UX Designer",
    description: "Experienced UI/UX designer required for designing user-friendly interfaces.",
    category: "Design",
    experience_level: "Intermediate",
    education_level: "Master's degree",
    payment_type: "Fixed-Price",
    time_posted: "2025-03-25T12:20:00Z",
    freelancer: {
      name: "Kim F.",
      image: "https://www.mobiles.co.uk/blog/content/images/size/w2000/2017/10/face-1.jpg"
    }
  }
];

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
        .from('your-storage-bucket-name') // Replace with actual bucket name
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