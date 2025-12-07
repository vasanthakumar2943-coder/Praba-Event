import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Components/Navbar.jsx";
import Home from "./Components/Home.jsx";
import About from "./Components/About.jsx";
import Contact from "./Components/Contact.jsx";
import Services from "./Components/Services.jsx";
import Projects from "./Components/Projects.jsx";
import Events from "./Components/Events.jsx";  
import Admin from "./Components/Admin.jsx";
import Footer from "./Components/Footer.jsx";

// ⭐ NEW IMPORT
import BookingHistory from "./Components/BookingHistory.jsx";

function ProtectedRoute({ children }) {
  const auth = localStorage.getItem("admin-auth") === "true";
  return auth ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      {/* Navbar Always Visible */}
      <Navbar />

      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      {/* ROUTES */}
      <div style={{ minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />

          {/* ⭐ NEW Booking History Route */}
          <Route path="/history" element={<BookingHistory />} />

          {/* Admin Protected Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* ⭐ FOOTER visible on ALL pages */}
      <Footer />
    </Router>
  );
}

export default App;
