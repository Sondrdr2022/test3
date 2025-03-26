import { supabase } from "../supabaseClient";

export async function uploadImage(file, setUploadedImageUrl, setIsUploading) {
  if (!file) return;

  setIsUploading(true);
  
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
}