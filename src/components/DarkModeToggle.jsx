import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function DarkModeToggle({ userId }) {
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize state with localStorage value
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    const initializeDarkMode = async () => {
      // First check localStorage
      const localStorageDarkMode = localStorage.getItem('darkMode') === 'true';
      
      if (userId) {
        // Then check Supabase table if user is logged in
        const { data, error } = await supabase
          .from('modes')
          .select('dark_mode')
          .eq('user_id', userId)
          .single();

        if (data) {
          const shouldEnableDarkMode = data.dark_mode ?? localStorageDarkMode;
          setDarkMode(shouldEnableDarkMode);
          applyDarkMode(shouldEnableDarkMode);
        } else {
          console.error("Theme fetch error:", error);
        }
      } else {
        // For non-logged-in users, use localStorage or system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldEnableDarkMode = localStorageDarkMode || systemPrefersDark;
        setDarkMode(shouldEnableDarkMode);
        applyDarkMode(shouldEnableDarkMode);
      }
    };

    initializeDarkMode();
  }, [userId]);

  useEffect(() => {
    applyDarkMode(darkMode);
  }, [darkMode]);

  const applyDarkMode = (isDark) => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());

    if (userId) {
      const { data, error } = await supabase
        .from('modes')
        .upsert({ user_id: userId, dark_mode: newMode }, { onConflict: 'user_id' });

      if (error) {
        console.error("Theme update failed:", error);
      } else {
        console.log("Theme updated:", data);
      }
    }
  };

  return (
    <button 
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 dark-mode-transition"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}