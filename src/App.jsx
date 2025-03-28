import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { SignupClient } from "./pages/SignupClient";
import { SignupFreelancer } from "./pages/SignupFreelancer";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import UserDetails from "./pages/UserDetails";
import PortfolioPage from "./pages/PortfolioPage";
import UploadImage from "./components/UploadImage";
import SearchPage from "./pages/SearchPage";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/freelancer-dashboard/:id" element={<FreelancerDashboard />} />
        <Route path="/freelancer-dashboard/:id/details" element={<UserDetails />} />
        <Route path='/freelancer-dashboard/:id/portfolio' element={<PortfolioPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup-client" element={<SignupClient />} />
        <Route path="/signup-freelancer" element={<SignupFreelancer />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={< Home />} />
        <Route path="/upload" element={<UploadImage />} /> 
        <Route path="/freelancer-dashboard/:id/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}
