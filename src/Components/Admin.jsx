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
} from "firebase/firestore";

function Admin() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newPin, setNewPin] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [newEvent, setNewEvent] = useState({ name: "", price: "", image: "" });
  const [newImageFile, setNewImageFile] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const fileToBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.onloadend = () => cb(reader.result);
    reader.readAsDataURL(file);
  };

  const loadData = async () => {
    const eventSnap = await getDocs(collection(db, "events"));
    const eventList = eventSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setEvents(eventList);

    const bookSnap = await getDocs(collection(db, "bookings"));
    const bookList = bookSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setBookings(bookList);
  };

  useEffect(() => {
    loadData();
  }, []);

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
      } catch {
        toast.error("Failed to add event");
      }
    };

    if (newImageFile) fileToBase64(newImageFile, submitEvent);
    else submitEvent(newEvent.image);
  };

  const deleteEvent = async (ev) => {
    const timeoutId = setTimeout(() => setLastDeleted(null), 10000);
    setLastDeleted({ data: ev, timeoutId });

    try {
      await deleteDoc(doc(db, "events", ev.id));
      toast.error("Event deleted. Undo available.");
      setEvents((prev) => prev.filter((e) => e.id !== ev.id));
    } catch {
      toast.error("Delete failed");
    }
  };

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

  const deleteBooking = async (id) => {
    try {
      await deleteDoc(doc(db, "bookings", id));
      toast.info("Booking removed");
      loadData();
    } catch {
      toast.error("Booking delete failed");
    }
  };

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

  const logout = () => {
    localStorage.removeItem("admin-auth");
    toast.info("Logged Out");
    window.location.href = "/";
  };

  return (
    <div className="page-section reveal admin-wrapper">

      {/* HEADER */}
      <h2 className="section-title">Admin Dashboard</h2>

      <button className="confirm-btn logout-btn" onClick={logout}>
        <i className="fi fi-rr-sign-out"></i> Logout
      </button>

      {/* ADD EVENT */}
      <div className="glass-card admin-box">
        <h3 className="admin-subtitle">Add Event</h3>

        <input
          type="text"
          className="form-control"
          placeholder="Event Name"
          value={newEvent.name}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Price ₹"
          value={newEvent.price}
          onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={(e) => setNewImageFile(e.target.files[0])}
        />

        <button className="confirm-btn add-btn" onClick={handleAddEvent}>
          ➕ Add Event
        </button>
      </div>

      {/* FLOATING UNDO BUTTON (Right Side) */}
      {lastDeleted && (
        <button className="undo-btn" onClick={undoDelete}>
          ⏪ Undo Delete
        </button>
      )}

      {/* EVENT LIST */}
      <div className="glass-card admin-table-wrap">
        <h3 className="admin-subtitle">Events</h3>

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
            {events.map((ev) => (
              <tr key={ev.id}>
                <td>
                  <img src={ev.image} width="60" height="40" className="table-img" />
                </td>
                <td>{ev.name}</td>
                <td>₹{ev.price}</td>

                <td>
                  <button className="icon-btn" onClick={() => setEditingEvent({ ...ev })}>
                    🛠
                  </button>
                </td>

                <td>
                  <button className="delete-btn" onClick={() => deleteEvent(ev)}>
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BOOKINGS */}
      <div className="glass-card admin-table-wrap">
        <h3 className="admin-subtitle">Bookings</h3>

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
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.event}</td>
                <td>{b.date}</td>
                <td>{b.customerName}</td>
                <td>{b.phone}</td>
                <td>
                  {b.confirmed ? "✔ Confirmed" : "⏳ Pending"}
                </td>
                <td className="action-buttons">
                  {!b.confirmed && (
                    <button
                      className="icon-btn confirm"
                      onClick={() => setConfirmData(b)}
                    >
                      ✔
                    </button>
                  )}

                  <button className="delete-btn" onClick={() => deleteBooking(b.id)}>
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SECURITY SETTINGS */}
      <div className="glass-card admin-box">
        <h3 className="admin-subtitle">Security Settings</h3>

        <input
          type="password"
          className="form-control"
          placeholder="New Admin PIN"
          value={newPin}
          onChange={(e) => setNewPin(e.target.value)}
        />

        <button className="confirm-btn" onClick={updatePIN}>
          Update PIN 🔐
        </button>
      </div>

      {/* EDIT & CONFIRM POPUPS REMAIN SAME (just styled by CSS) */}
      {editingEvent && (
        <div className="modal-overlay">
          <div className="modal-box glass-box fade-in">
            <button className="close-btn" onClick={() => setEditingEvent(null)}>
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
            />

            <input
              type="number"
              className="form-control"
              value={editingEvent.price}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, price: e.target.value })
              }
            />

            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  fileToBase64(file, (base64) =>
                    setEditingEvent({ ...editingEvent, image: base64 })
                  );
                }
              }}
            />

            <button className="confirm-btn" onClick={saveEventEdit}>
              Save ✔
            </button>
          </div>
        </div>
      )}

      {confirmData && (
        <div className="modal-overlay">
          <div className="modal-box glass-box fade-in">
            <button className="close-btn" onClick={() => setConfirmData(null)}>
              ✖
            </button>

            <h3>Confirm Booking</h3>

            <p>
              <b>Event:</b> {confirmData.event}<br />
              <b>Name:</b> {confirmData.customerName}<br />
              <b>Date:</b> {confirmData.date}<br />
              <b>Phone:</b> {confirmData.phone}
            </p>

            <button
              className="confirm-btn"
              onClick={() => {
                let phone = confirmData.phone.replace(/\D/g, "");
                if (phone.length === 10) phone = "91" + phone;
                window.location.href = `tel:${phone}`;
              }}
            >
              📞 Call User
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Admin;
