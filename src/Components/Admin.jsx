import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../index.css";

function Admin() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newPin, setNewPin] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [newEvent, setNewEvent] = useState({ name: "", price: "", image: "" });
  const [newImageFile, setNewImageFile] = useState(null);

  const loadData = () => {
    fetch("http://localhost:8080/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));

    fetch("http://localhost:8080/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data));
  };

  useEffect(() => {
    loadData();
  }, []);

  // Convert image file to base64
  const fileToBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.onloadend = () => cb(reader.result);
    reader.readAsDataURL(file);
  };

  // Add new event
  const handleAddEvent = () => {
    if (!newEvent.name || !newEvent.price) {
      toast.warn("Enter event name & price");
      return;
    }

    const submitEvent = (imageBase64) => {
      const payload = {
        ...newEvent,
        image: imageBase64 || newEvent.image,
      };

      fetch("http://localhost:8080/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(() => {
        toast.success("Event added ✔");
        setNewEvent({ name: "", price: "", image: "" });
        setNewImageFile(null);
        loadData();
      });
    };

    if (newImageFile) {
      fileToBase64(newImageFile, submitEvent);
    } else {
      submitEvent(newEvent.image);
    }
  };

  // Delete event with undo
  const deleteEvent = (ev) => {
    const timeoutId = setTimeout(() => {
      setLastDeleted(null);
    }, 10000);

    setLastDeleted({ data: ev, timeoutId });

    fetch(`http://localhost:8080/events/${ev.id}`, {
      method: "DELETE",
    }).then(() => {
      toast.error("Event deleted. Undo for 10s.");
      setEvents((prev) => prev.filter((e) => e.id !== ev.id));
    });
  };

  const undoDelete = () => {
    if (!lastDeleted) return;
    clearTimeout(lastDeleted.timeoutId);

    fetch("http://localhost:8080/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lastDeleted.data),
    }).then(() => {
      toast.success("Delete undone ✔");
      setLastDeleted(null);
      loadData();
    });
  };

  // Delete booking
  const deleteBooking = (id) => {
    fetch(`http://localhost:8080/bookings/${id}`, {
      method: "DELETE",
    }).then(() => {
      toast.info("Booking removed");
      loadData();
    });
  };

  // Update PIN
  const updatePIN = () => {
    if (!newPin) {
      toast.warn("Enter new PIN");
      return;
    }

    fetch("http://localhost:8080/admin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: newPin }),
    }).then(() => {
      toast.success("PIN updated 🔐");
      setNewPin("");
    });
  };

  // Save event edit
  const saveEventEdit = () => {
    if (!editingEvent) return;

    fetch(`http://localhost:8080/events/${editingEvent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingEvent),
    }).then(() => {
      toast.success("Event updated ✔");
      setEditingEvent(null);
      loadData();
    });
  };

  // Logout inside admin
  const logout = () => {
    localStorage.removeItem("admin-auth");
    toast.info("Logged Out");
    window.location.href = "/";
  };

  return (
    <div className="page-section fade-in">
      <h2 className="section-title">Admin Dashboard</h2>

      <button
        className="confirm-btn"
        style={{ maxWidth: "160px", margin: "0 auto 20px" }}
        onClick={logout}
      >
        Logout 🔓
      </button>

      {/* Add Event */}
      <h3 className="section-title" style={{ marginTop: "10px" }}>Add Event</h3>
      <div style={{ maxWidth: "400px", margin: "0 auto 20px auto" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Event Name"
          value={newEvent.name}
          onChange={(e) =>
            setNewEvent({ ...newEvent, name: e.target.value })
          }
        />

        <input
          type="number"
          className="form-control"
          placeholder="Price ₹"
          value={newEvent.price}
          onChange={(e) =>
            setNewEvent({ ...newEvent, price: e.target.value })
          }
          style={{ marginTop: "8px" }}
        />

        <input
          type="file"
          accept="image/*"
          className="form-control"
          style={{ marginTop: "8px" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) setNewImageFile(file);
          }}
        />

        <button
          className="confirm-btn"
          style={{ marginTop: "10px" }}
          onClick={handleAddEvent}
        >
          ➕ Add Event
        </button>
      </div>

      {lastDeleted && (
        <button
          className="confirm-btn"
          style={{ maxWidth: "200px", margin: "0 auto 20px", background: "orange" }}
          onClick={undoDelete}
        >
          ⏪ Undo Delete (10s)
        </button>
      )}

      {/* Events Table */}
      <h3 className="section-title" style={{ marginTop: "20px" }}>Events</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Event</th>
            <th>Price (₹)</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev.id}>
              <td>
                <img src={ev.image} alt={ev.name} width="70" height="45" />
              </td>
              <td>{ev.name}</td>
              <td>{ev.price}</td>
              <td>
                <button
                  className="confirm-btn"
                  style={{ padding: "4px 10px" }}
                  onClick={() => setEditingEvent({ ...ev })}
                >
                  🛠
                </button>
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteEvent(ev)}
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bookings Table */}
      <h3 className="section-title" style={{ marginTop: "30px" }}>Bookings</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Date</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.event}</td>
              <td>{b.date}</td>
              <td>{b.customerName}</td>
              <td>{b.phone}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteBooking(b.id)}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Security Settings */}
      <h3 className="section-title" style={{ marginTop: "30px" }}>
        Security Settings
      </h3>

      <div style={{ maxWidth: "350px", margin: "0 auto" }}>
        <input
          type="password"
          className="form-control"
          placeholder="New Admin PIN"
          value={newPin}
          onChange={(e) => setNewPin(e.target.value)}
        />

        <button
          className="confirm-btn"
          style={{ marginTop: "10px" }}
          onClick={updatePIN}
        >
          Update PIN 🔐
        </button>
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="modal-overlay">
          <div className="modal-box fade-in">
            <button
              className="close-btn"
              onClick={() => setEditingEvent(null)}
            >
              ✖
            </button>

            <h3>Edit Event</h3>

            <input
              type="text"
              className="form-control"
              value={editingEvent.name}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, name: e.target.value })
              }
              style={{ marginTop: "10px" }}
            />

            <input
              type="number"
              className="form-control"
              value={editingEvent.price}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, price: e.target.value })
              }
              style={{ marginTop: "10px" }}
            />

            <input
              type="file"
              accept="image/*"
              className="form-control"
              style={{ marginTop: "10px" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  fileToBase64(file, (base64) =>
                    setEditingEvent({ ...editingEvent, image: base64 })
                  );
                }
              }}
            />

            <button
              className="confirm-btn"
              style={{ marginTop: "10px" }}
              onClick={saveEventEdit}
            >
              Save ✔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
