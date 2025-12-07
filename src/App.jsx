import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./Components/Navbar.jsx";
import Home from "./Components/Home.jsx";
import About from "./Components/About.jsx";
import Contact from "./Components/Contact.jsx";
import Services from "./Components/Services.jsx";
import Projects from "./Components/Projects.jsx";
import Events from "./Components/Events.jsx";  
import Admin from "./Components/Admin.jsx";
import Footer from "./Components/Footer.jsx";
import BookingHistory from "./Components/BookingHistory.jsx";

// ⭐ Optional Upgrades (Use only if added)
// import FloatingContact from "./Components/FloatingContact.jsx";
// import ScrollTop from "./Components/ScrollTop.jsx";

function ProtectedRoute({ children }) {
  const auth = localStorage.getItem("admin-auth") === "true";
  return auth ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      {/* NAVBAR */}
      <Navbar />

      {/* TOAST SYSTEM */}
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
          <Route path="/history" element={<BookingHistory />} />

          {/* PROTECTED ADMIN PAGE */}
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

      {/* FOOTER */}
      <Footer />

      {/* ⭐ OPTIONAL — Uncomment if you added these components */}
      {/* <FloatingContact /> */}
      {/* <ScrollTop /> */}
    </Router>
  );
}

export default App;
