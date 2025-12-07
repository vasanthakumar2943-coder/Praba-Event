import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";

function Admin() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pin, setPin] = useState("");

  const [newEvent, setNewEvent] = useState({
    title: "",
    price: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editEventData, setEditEventData] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  // ----------------------------
  // FETCH EVENTS & BOOKINGS
  // ----------------------------
  useEffect(() => {
    fetchEvents();
    fetchBookings();
  }, []);

  const fetchEvents = async () => {
    try {
      // Replace with your API
      let data = []; 
      setEvents(data);
    } catch (e) {
      console.error("Fetch events error:", e);
    }
  };

  const fetchBookings = async () => {
    try {
      let data = []; // Replace with your API
      setBookings(data);
    } catch (e) {
      console.error("Fetch bookings error:", e);
    }
  };

  // ----------------------------
  // ADD EVENT
  // ----------------------------
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.price || !newEvent.image) {
      alert("Fill all fields");
      return;
    }

    try {
      // Upload logic here
      alert("Event added!");
      fetchEvents();
      setNewEvent({ title: "", price: "", image: null });
      setPreview(null);
    } catch (e) {
      console.error("Add event error:", e);
    }
  };

  // ----------------------------
  // DELETE EVENT
  // ----------------------------
  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      // API logic here
      alert("Event deleted");
      fetchEvents();
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  // ----------------------------
  // OPEN EDIT MODAL
  // ----------------------------
  const openEditEvent = (event) => {
    setEditEventData(event);
    setEditMode(true);
    setModalOpen(true);
  };

  // ----------------------------
  // UPDATE EVENT
  // ----------------------------
  const saveEditEvent = async () => {
    try {
      // API request here
      alert("Event updated!");
      setModalOpen(false);
      fetchEvents();
    } catch (e) {
      console.error("Update error:", e);
    }
  };

  return (
    <div className="admin-wrapper fade-in">

      {/* PAGE TITLE */}
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* LOGOUT */}
      <div style={{ textAlign: "center" }}>
        <button className="book-btn glow" onClick={() => alert("Logout")}>
          Logout
        </button>
      </div>

      {/* ADD EVENT CARD */}
      <div className="glass-card slide-up">

        <h3 style={{ textAlign: "center", marginBottom: "12px", color: "#00eaff" }}>
          Add Event
        </h3>

        {/* TITLE INPUT */}
        <input
          type="text"
          placeholder="Event Title"
          className="form-input"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />

        {/* PRICE INPUT */}
        <input
          type="number"
          placeholder="Price"
          className="form-input"
          value={newEvent.price}
          onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
        />

        {/* IMAGE INPUT */}
        <input
          type="file"
          className="form-input"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setNewEvent({ ...newEvent, image: file });
              setPreview(URL.createObjectURL(file));
            }
          }}
        />

        {preview && <img src={preview} alt="preview" className="preview-img" />}

        <button className="add-btn glow" onClick={handleAddEvent}>
          + Add Event
        </button>
      </div>

      {/* ============================
          EVENTS TABLE
      ============================ */}
      <h3 className="admin-title" style={{ fontSize: "26px" }}>Events</h3>

      <div className="admin-table-wrap fade-in">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Event</th>
              <th>Price</th>
              <th>Edit</th>
              <th>Del</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: "20px" }}>No events found</td>
              </tr>
            ) : (
              events.map((ev) => (
                <tr key={ev.id}>
                  <td>
                    <img src={ev.image} alt="" className="table-img" />
                  </td>
                  <td>{ev.title}</td>
                  <td>₹ {ev.price}</td>

                  <td>
                    <button className="icon-btn edit" onClick={() => openEditEvent(ev)}>
                      <FaEdit />
                    </button>
                  </td>

                  <td>
                    <button className="delete-btn" onClick={() => deleteEvent(ev.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ============================
          BOOKINGS TABLE
      ============================ */}
      <h3 className="admin-title" style={{ fontSize: "26px" }}>Bookings</h3>

      <div className="admin-table-wrap fade-in">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "20px" }}>No bookings yet</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.event}</td>
                  <td>{b.date}</td>
                  <td>{b.name}</td>
                  <td>{b.phone}</td>
                  <td className={
                    b.status === "Confirmed" ? "status-confirmed"
                    : b.status === "Pending" ? "status-pending"
                    : "status-expired"
                  }>
                    {b.status}
                  </td>

                  <td>
                    <button className="icon-btn confirm">
                      <FaCheck />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ============================
          EDIT EVENT MODAL
      ============================ */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>

          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setModalOpen(false)}>
              <FaTimes />
            </button>

            <h3 className="section-title">Edit Event</h3>

            <input
              className="form-input"
              type="text"
              value={editEventData.title}
              onChange={(e) =>
                setEditEventData({ ...editEventData, title: e.target.value })
              }
            />

            <input
              className="form-input"
              type="number"
              value={editEventData.price}
              onChange={(e) =>
                setEditEventData({ ...editEventData, price: e.target.value })
              }
            />

            <button className="book-btn glow" onClick={saveEditEvent}>
              Save Changes
            </button>

          </div>
        </div>
      )}

      {/* ============================
          SECURITY PIN UPDATE
      ============================ */}

      <h3 className="admin-title" style={{ fontSize: "26px" }}>Security Settings</h3>

      <div className="glass-card slide-up">
        <input
          className="form-input"
          type="password"
          placeholder="Update PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <button className="book-btn glow" onClick={() => alert("PIN Updated")}>
          Update PIN 🔐
        </button>
      </div>

    </div>
  );
}

export default Admin;
