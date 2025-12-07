import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../index.css";

import { db } from "../firebase";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";


function Admin() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newPin, setNewPin] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [newEvent, setNewEvent] = useState({ name: "", price: "", image: "" });
  const [newImageFile, setNewImageFile] = useState(null);

  // Convert file to base64
  const fileToBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.onloadend = () => cb(reader.result);
    reader.readAsDataURL(file);
  };

  // Load Events + Bookings from Firestore
  const loadData = async () => {
    // Load events
    const eventSnap = await getDocs(collection(db, "events"));
    const eventList = eventSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setEvents(eventList);

    // Load bookings
    const bookSnap = await getDocs(collection(db, "bookings"));
    const bookList = bookSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setBookings(bookList);
  };

  useEffect(() => {
    loadData();
  }, []);

  // -------------------------
  // ADD EVENT
  // -------------------------
  const handleAddEvent = () => {
    if (!newEvent.name || !newEvent.price) {
      toast.warn("Enter event name & price");
      return;
    }

    const submitEvent = async (imageBase64) => {
      try {
        await addDoc(collection(db, "events"), {
          name: newEvent.name,
          price: newEvent.price,
          image: imageBase64 || newEvent.image,
        });

        toast.success("Event added ✔");
        setNewEvent({ name: "", price: "", image: "" });
        setNewImageFile(null);
        loadData();
      } catch (error) {
        toast.error("Failed to add event");
      }
    };

    if (newImageFile) {
      fileToBase64(newImageFile, submitEvent);
    } else {
      submitEvent(newEvent.image);
    }
  };

  // -------------------------
  // DELETE EVENT (with Undo)
  // -------------------------
  const deleteEvent = async (ev) => {
    const timeoutId = setTimeout(() => {
      setLastDeleted(null);
    }, 10000);

    setLastDeleted({ data: ev, timeoutId });

    try {
      await deleteDoc(doc(db, "events", ev.id));
      toast.error("Event deleted. Undo for 10s.");
      setEvents((prev) => prev.filter((e) => e.id !== ev.id));
    } catch {
      toast.error("Delete failed");
    }
  };

  // UNDO DELETE
  const undoDelete = async () => {
    if (!lastDeleted) return;
    clearTimeout(lastDeleted.timeoutId);

    try {
      await setDoc(doc(db, "events", lastDeleted.data.id), {
        name: lastDeleted.data.name,
        price: lastDeleted.data.price,
        image: lastDeleted.data.image,
      });

      toast.success("Delete undone ✔");
      setLastDeleted(null);
      loadData();
    } catch {
      toast.error("Restore failed");
    }
  };

  // -------------------------
  // DELETE BOOKING
  // -------------------------
  const deleteBooking = async (id) => {
    try {
      await deleteDoc(doc(db, "bookings", id));
      toast.info("Booking removed");
      loadData();
    } catch {
      toast.error("Booking delete failed");
    }
  };

  // -------------------------
  // UPDATE ADMIN PIN
  // Firestore: collection "settings" → document "admin"
  // -------------------------
  const updatePIN = async () => {
    if (!newPin) {
      toast.warn("Enter new PIN");
      return;
    }

    try {
      await setDoc(doc(db, "settings", "admin"), { pin: newPin });
      toast.success("PIN updated 🔐");
      setNewPin("");
    } catch {
      toast.error("Failed to update PIN");
    }
  };

  // -------------------------
  // SAVE EDITED EVENT
  // -------------------------
  const saveEventEdit = async () => {
    if (!editingEvent) return;

    try {
      await updateDoc(doc(db, "events", editingEvent.id), {
        name: editingEvent.name,
        price: editingEvent.price,
        image: editingEvent.image,
      });

      toast.success("Event updated ✔");
      setEditingEvent(null);
      loadData();
    } catch {
      toast.error("Update failed");
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("admin-auth");
    toast.info("Logged Out");
    window.location.href = "/";
  };

  return (
    <div className="page-section fade-in">
      <h2 className="section-title">Admin Dashboard</h2>

      {/* Logout */}
      <button
        className="confirm-btn"
        style={{ maxWidth: "160px", margin: "0 auto 20px" }}
        onClick={logout}
      >
        Logout 🔓
      </button>

      {/* ADD EVENT */}
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
          onChange={(e) => setNewImageFile(e.target.files[0])}
        />

        <button
          className="confirm-btn"
          style={{ marginTop: "10px" }}
          onClick={handleAddEvent}
        >
          ➕ Add Event
        </button>
      </div>

      {/* UNDO DELETE */}
      {lastDeleted && (
        <button
          className="confirm-btn"
          style={{ maxWidth: "200px", margin: "0 auto 20px", background: "orange" }}
          onClick={undoDelete}
        >
          ⏪ Undo Delete (10s)
        </button>
      )}

      {/* EVENTS LIST */}
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

      {/* BOOKINGS TABLE */}
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

      {/* SECURITY SETTINGS */}
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

      {/* EDIT EVENT MODAL */}
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
