import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Sidebar from "../components/Sidebar";
import SearchForm from "../components/SearchForm";
import { useParams } from 'react-router-dom';

export default function SearchPage() {
  const [userData, setUserData] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const { id } = useParams();

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
  
      // Fetch dark mode preference from Supabase
      const fetchDarkMode = async () => {
        const { data, error } = await supabase
          .from('modes')
          .select('dark_mode')
          .eq('user_id', id)
          .single();
        if (data) {
          setDarkMode(data.dark_mode);
        } else {
          console.error("Fetch dark mode error:", error);
        }
      };
      fetchDarkMode();
    }, [id]);

  return (
    <div className="d-flex">
      <Sidebar userData={userData} uploadedImageUrl={uploadedImageUrl}/>
      <div className="container mt-4">
        <SearchForm />
      </div>
    </div>
  );
}