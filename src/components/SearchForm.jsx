import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Form, Dropdown, InputGroup, Button, Offcanvas } from "react-bootstrap";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Select Categories");
  const [showFilters, setShowFilters] = useState(false);
  
  const handleShowFilters = () => setShowFilters(true);
  const handleCloseFilters = () => setShowFilters(false);

  return (
    <>
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
                <Button variant="primary">Search</Button>
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
            {[1, 2, 3, 4].map((job, index) => (
              <div key={index} className="p-3 mb-3 border rounded">
                <p className="text-muted">Time posted</p>
                <h5><a href="#">Job title</a></h5>
                <p>
                  Job description: This is where the recruiter writes the job description. The
                  writing will not be displayed fully but will have a short description.
                </p>
                <div className="d-flex gap-2">
                  <span className="badge bg-secondary">Feature</span>
                  <span className="badge bg-secondary">Feature</span>
                  <span className="badge bg-secondary">Feature</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
