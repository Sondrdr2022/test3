import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from "../supabaseClient";

const ContactForm = ({ show, onHide, freelancer }) => {
  const [formData, setFormData] = useState({
    taskName: "",
    email: "",
    jobDescription: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.api.sendMagicLinkEmail({
        email: formData.email,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            subject: `New message from ${formData.email}`,
            body: `Task Name: ${formData.taskName}\nJob Description: ${formData.jobDescription}`,
          },
        },
      });

      if (error) {
        throw error;
      }

      console.log(`Message to ${freelancer.name}:`, formData);
      onHide();
    } catch (error) {
      console.error("Error sending email:", error.message);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Contact {freelancer.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="taskName">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              name="taskName"
              value={formData.taskName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="jobDescription">
            <Form.Label>Job Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ContactForm;