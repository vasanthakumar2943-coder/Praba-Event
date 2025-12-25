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
import Gallery from "./Components/Gallery.jsx"
import Admin from "./Components/Admin.jsx";
import Footer from "./Components/Footer.jsx";
import BookingHistory from "./Components/BookingHistory.jsx";
import ScrollToTop from "./Components/ScrollToTop";

function ProtectedRoute({ children }) {
  const auth = localStorage.getItem("admin-auth") === "true";
  return auth ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bookinghistory" element={<BookingHistory />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
