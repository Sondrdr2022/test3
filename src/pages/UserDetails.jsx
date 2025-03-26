import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/Sidebar';
import { Eye, EyeOff } from 'lucide-react'; // For password viewer icon
import { uploadImage } from '../components/uploadimagefunction'; // Import the uploadImage function

export default function UserDetails() {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: '',
    country: '',
    description: '',
    image: '',
    job: ''
  });

  const [showPassword, setShowPassword] = useState(false); // 👈 Password toggle state
  const { id } = useParams();
  const imageInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      if (data) {
        console.log("Fetched data:", data);
        setUserData(data);
      } else {
        console.error("Fetch error:", error);
      }
    };
    fetchUserData();

    // Check if there is an existing image URL in local storage
    const existingImageUrl = localStorage.getItem('uploadedImageUrl');
    if (existingImageUrl) {
      setUploadedImageUrl(existingImageUrl);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updates = {
      description: userData.description,
    };
  
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select();
  
    if (error) {
      console.error("Update failed:", error);
      alert('Failed to save description');
    } else {
      console.log("Description updated:", data);
      alert('Description updated successfully!');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Display the selected image preview
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = () => {
    if (!selectedImage || !imageInputRef.current?.files[0]) return;
    const file = imageInputRef.current.files[0];
    uploadImage(file, setUploadedImageUrl, setIsUploading);
  };

  return (
    <div className="d-flex">
      {userData.id ? (
        <Sidebar userData={userData} uploadedImageUrl={uploadedImageUrl} />
      ) : (
        <div>Loading sidebar...</div>
      )}

      <div className="p-4 w-100 bg-light">
        <h3 className="mb-4">User Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label>Firstname</label>
              <input type="text" className="form-control" name="first_name" value={userData.first_name} onChange={handleChange} disabled />
            </div>
            <div className="col">
              <label>Lastname</label>
              <input type="text" className="form-control" name="last_name" value={userData.last_name} onChange={handleChange} disabled />
            </div>
            <div className="col">
              <label>Role</label>
              <input type="text" className="form-control" name="role" value={userData.role} disabled />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label>Email</label>
              <input type="email" className="form-control" name="email" value={userData.email} onChange={handleChange} disabled />
            </div>
            <div className="col position-relative">
            <label>Password</label>
            <div className="position-relative">
                <input
                type={showPassword ? 'text' : 'password'}
                className="form-control pe-5" // Add pe-5 for right-side padding
                name="password"
                value={userData.password}
                onChange={handleChange}
                disabled
                />
                <span
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '12px',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#6c757d',
                }}
                onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
            </div>
            </div>
            <div className="col">
              <label>Country</label>
              <input type="text" className="form-control" name="country" value={userData.country} onChange={handleChange} disabled />
            </div>
          </div>

          <div className="mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="4"
              value={userData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>

        <div className="upload-controls mt-4">
          <input 
            type="file" 
            accept="image/*" 
            ref={imageInputRef} 
            onChange={handleImageSelect}
            className="hidden-input"
          />
          <button 
            className="edit-photo-btn"
            onClick={() => imageInputRef.current?.click()}
          >
            Edit Photo
          </button>
          <button 
            className="upload-button" 
            onClick={handleImageUpload}
            disabled={!selectedImage || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
          {uploadedImageUrl && (
            <div className="image-preview mt-3">
              <img 
                src={uploadedImageUrl} 
                alt="Uploaded avatar" 
                className="user-avatar"
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .freelancer-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .page-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .user-avatar-container {
          position: relative;
          width: 100px;
          height: 100px;
        }
        
        .user-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .avatar-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }
        
        .hidden-input {
          display: none;
        }
        
        .edit-photo-btn {
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 5px 10px;
          font-size: 12px;
          cursor: pointer;
          margin-right: 10px;
        }
        
        .edit-photo-btn:hover {
          background-color: #0056b3;
        }
        
        .upload-controls {
          margin-top: 20px;
          text-align: center;
        }
        
        .upload-button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .upload-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .upload-button:hover:not(:disabled) {
          background-color: #45a049;
        }

        .image-preview img {
          max-width: 100px;
          max-height: 100px;
          border-radius: 50%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}