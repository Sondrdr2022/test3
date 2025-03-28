import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react"; // Hamburger and close icons

const STORAGE_BUCKET_NAME = 'user-page-image-test'; // Replace with your actual storage bucket name

export default function Sidebar({ userData, uploadedImageUrl }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();

  const fetchProfileImage = async () => {
    if (userData?.image) {
      const { data: { publicUrl }, error } = supabase.storage
        .from(STORAGE_BUCKET_NAME)
        .getPublicUrl(userData.image);

      if (publicUrl) {
        return publicUrl;
      } else {
        console.error('Error fetching public URL:', error);
        return "https://via.placeholder.com/60";
      }
    }
    return "https://via.placeholder.com/60";
  };

  async function goToDashboard() {
    if (userData?.id) {
      navigate(`/freelancer-dashboard/${userData.id}`);
    }
  }

  async function goToEditPage() {
    if (userData?.id) {
      navigate(`/freelancer-dashboard/${userData.id}/details`);
    }
  }

  async function goToPortfolio() {
    if (userData?.id) {
      navigate(`/freelancer-dashboard/${userData.id}/portfolio`);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  async function goToSearchPage() {
    if (userData?.id) {
      navigate(`/freelancer-dashboard/${userData.id}/search`);
    }
  };


  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="d-md-none position-fixed top-3 start-3 btn btn-dark rounded-circle p-2"
        style={{ zIndex: 9999 }}
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar for larger screens */}
      <div
        className="bg-dark text-white p-3 d-none d-md-flex flex-column align-items-start"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <SidebarContent
          userData={userData}
          fetchProfileImage={fetchProfileImage}
          uploadedImageUrl={uploadedImageUrl}
          goToDashboard={goToDashboard}
          goToEditPage={goToEditPage}
          goToPortfolio={goToPortfolio}
          goToSearchPage={goToSearchPage}
          handleLogout={handleLogout}
        />
      </div>

      {/* Animated sidebar for mobile */}
      {isOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ duration: 0.3 }}
          className="bg-dark text-white p-3 d-flex flex-column align-items-start position-fixed top-0 start-0"
          style={{ width: "250px", height: "100vh", zIndex: 9999 }}
        >
          <button
            className="btn btn-light mb-3 align-self-end"
            onClick={() => setIsOpen(false)}
          >
            <X />
          </button>
          <SidebarContent
            userData={userData}
            fetchProfileImage={fetchProfileImage}
            uploadedImageUrl={uploadedImageUrl}
            goToDashboard={() => {
              goToDashboard();
              setIsOpen(false);
            }}
            goToEditPage={() => {
              goToEditPage();
              setIsOpen(false);
            }}
            goToPortfolio={() => {
              goToPortfolio();
              setIsOpen(false); // For mobile sidebar close on click
            }}
            goToSearchPage={() => {
              goToPortfolio();
              setIsOpen(false);
            }}
            handleLogout={handleLogout}
          />
        </motion.div>
      )}
    </>
  );
}

function SidebarContent({ userData, fetchProfileImage, uploadedImageUrl, goToDashboard, goToEditPage, goToPortfolio, goToSearchPage, handleLogout }) {
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/60");

  useEffect(() => {
    const loadProfileImage = async () => {
      const imageUrl = uploadedImageUrl || await fetchProfileImage();
      setProfileImage(imageUrl);
    };

    loadProfileImage();
  }, [fetchProfileImage, uploadedImageUrl]);

  return (
    <>
      <div className="d-flex align-items-center mb-4 w-100">
        <img
          src={profileImage}
          alt="Profile"
          className="rounded-circle me-3"
          width="60"
          height="60"
        />
        <div>
          <h5 className="fw-bold mb-0">
            {userData?.first_name} {userData?.last_name}
          </h5>
          <small className="text-muted">{userData?.job}</small>
        </div>
      </div>

      <ul className="list-unstyled w-100">
        <li className="my-3">
          <button
            onClick={goToDashboard}
            className="btn btn-link text-white p-0 text-decoration-none"
          >
            Dashboard
          </button>
        </li>
        <li className="my-3">
          <button
            onClick={goToEditPage}
            className="btn btn-link text-white p-0 text-decoration-none"
          >
            Details
          </button>
        </li>
        <li className="my-3">
          <button
            onClick={goToPortfolio}
            className="btn btn-link text-white p-0 text-decoration-none"
          >
            Portfolio
          </button>
        </li>
        <li className="my-3">
          <button
            onClick={goToSearchPage}
            className="btn btn-link text-white p-0 text-decoration-none"
          >
            Search
          </button>
        </li>
        <li className="my-3">
          <a href="#" className="text-white text-decoration-none">
            Activity
          </a>
        </li>
      </ul>
      
      <button
        className="btn btn-outline-light mt-auto w-100"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </>
  );
}