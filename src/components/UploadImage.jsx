import { useState, useRef, useEffect } from "react";
import { supabase } from "../supabaseClient";

function UploadImage() {
  const imageInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Check if there is an existing image URL in local storage
    const existingImageUrl = localStorage.getItem('uploadedImageUrl');
    if (existingImageUrl) {
      setUploadedImageUrl(existingImageUrl);
    }
  }, []);

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

  const handleImageUpload = async () => {
    if (!selectedImage || !imageInputRef.current?.files[0]) return;
    
    setIsUploading(true);
    const file = imageInputRef.current.files[0];
    
    try {
      // Generate a unique filename
      const fileName = `user-avatar-${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('user-page-image-test')
        .upload(`uploads/${fileName}`, file);

      if (error) throw error;

      console.log("File uploaded successfully:", data);
      
      // Get the public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('user-page-image-test')
        .getPublicUrl(`uploads/${fileName}`);
      
      setUploadedImageUrl(publicUrl);
      localStorage.setItem('uploadedImageUrl', publicUrl); // Store the URL in local storage
      alert("Image uploaded successfully!");
      
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading image: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="freelancer-page">
      <header className="page-header">
        <div className="user-avatar-container">
          {uploadedImageUrl ? (
            <img 
              src={uploadedImageUrl} 
              alt="User avatar" 
              className="user-avatar"
            />
          ) : selectedImage ? (
            <img 
              src={selectedImage} 
              alt="Selected preview" 
              className="user-avatar"
            />
          ) : (
            <div className="avatar-placeholder">
              {selectedImage ? '' : 'No image selected'}
            </div>
          )}
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
        </div>
        <h1>Susan H.</h1>
      </header>

      {/* Rest of your freelancer page components */}
      <div className="upload-controls">
        <button 
          className="upload-button" 
          onClick={handleImageUpload}
          disabled={!selectedImage || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
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
          position: absolute;
          bottom: -10px;
          right: -10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 5px 10px;
          font-size: 12px;
          cursor: pointer;
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
      `}</style>
    </div>
  );
}

export default UploadImage;