import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../index.css";
import { db, storage } from "../firebase";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

function Admin() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [gallery, setGallery] = useState([]);

  const [newPin, setNewPin] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  // Unified undo state (single undo for events/bookings/gallery/confirm)
  const [undoAction, setUndoAction] = useState(null);

  const [lastDeleted, setLastDeleted] = useState(null); // kept for compatibility if used elsewhere
  const [newEvent, setNewEvent] = useState({ name: "", price: "", image: "" });
  const [newImageFile, setNewImageFile] = useState(null);
  const [galleryFile, setGalleryFile] = useState(null);
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

    const galSnap = await getDocs(collection(db, "gallery"));
    const galList = galSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setGallery(galList);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ============================
        Universal Undo helpers
     ============================ */
  const triggerUndo = (type, data) => {
    // Ensure any previous timeout cleared
    if (undoAction?.timeoutId) clearTimeout(undoAction.timeoutId);

    const timeoutId = setTimeout(() => setUndoAction(null), 10000);

    setUndoAction({
      type, // "event" | "bookingDelete" | "bookingCancel" | "bookingConfirm" | "gallery"
      data,
      timeoutId,
    });

    toast.error("Undo available for 10 seconds.");
  };

  const handleUndo = async () => {
    if (!undoAction) return;

    clearTimeout(undoAction.timeoutId);

    try {
      const { type, data } = undoAction;

      if (type === "event") {
        // restore event document
        await setDoc(doc(db, "events", data.id), {
          ...data,
        });
        toast.success("Event restored ✔");
      } else if (type === "bookingDelete" || type === "bookingCancel") {
        // restore booking document
        await setDoc(doc(db, "bookings", data.id), {
          ...data,
        });
        toast.success("Booking restored ✔");
      } else if (type === "bookingConfirm") {
        // revert confirmed flag
        await updateDoc(doc(db, "bookings", data.id), { confirmed: false });
        toast.info("Booking confirmation undone");
      } else if (type === "gallery") {
        // restore gallery doc (soft delete assumption: storage file kept)
        await setDoc(doc(db, "gallery", data.id), {
          ...data,
        });
        toast.success("Gallery image restored ✔");
      }

      setUndoAction(null);
      // refresh
      loadData();
    } catch (err) {
      console.error("Undo failed:", err);
      toast.error("Undo failed");
    }
  };

  /* ============================
        ADD EVENT
     ============================ */
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
      } catch (err) {
        console.error(err);
        toast.error("Failed to add event");
      }
    };

    if (newImageFile) fileToBase64(newImageFile, submitEvent);
    else submitEvent(newEvent.image);
  };

  /* ============================
        DELETE EVENT (use triggerUndo)
     ============================ */
  const deleteEvent = async (ev) => {
    if (!ev) return;

    try {
      // set undo data
      triggerUndo("event", ev);

      // proceed with delete
      await deleteDoc(doc(db, "events", ev.id));
      toast.error("Event deleted. Undo available.");
      setEvents((prev) => prev.filter((e) => e.id !== ev.id));
    } catch (err) {
      console.error("Delete event failed:", err);
      toast.error("Delete failed");
    }
  };

  /* ============================
        DELETE BOOKING (use triggerUndo)
     ============================ */
  const deleteBooking = async (id) => {
    try {
      const bookingToDelete = bookings.find((b) => b.id === id);
      if (!bookingToDelete) return;

      triggerUndo("bookingDelete", bookingToDelete);

      await deleteDoc(doc(db, "bookings", id));
      toast.info("Booking removed. Undo available.");
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Delete booking failed:", err);
      toast.error("Booking delete failed");
    }
  };

  /* ============================
        UPDATE ADMIN PIN
     ============================ */
  const updatePIN = async () => {
    if (!newPin) {
      toast.warn("Enter new PIN");
      return;
    }

    try {
      await setDoc(doc(db, "settings", "admin"), { pin: newPin });
      toast.success("PIN updated 🔐");
      setNewPin("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update PIN");
    }
  };

  /* ============================
       SAVE EVENT EDIT
     ============================ */
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
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  /* ============================
        LOGOUT
     ============================ */
  const logout = () => {
    localStorage.removeItem("admin-auth");
    toast.info("Logged Out");
    window.location.href = "/";
  };

  /* ============================
       ADD GALLERY IMAGE
     ============================ */
  const uploadGalleryImage = async () => {
    if (!galleryFile) return toast.warn("Select image first");

    try {
      const fileRef = ref(storage, "gallery/" + Date.now());
      await uploadBytes(fileRef, galleryFile);

      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, "gallery"), {
        imageUrl: url,
        createdAt: Date.now(),
      });

      toast.success("Gallery image added ✔");
      setGalleryFile(null);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Gallery upload failed");
    }
  };

  /* ============================
        DELETE GALLERY (soft delete -> triggerUndo)
     ============================ */
  const deleteGallery = async (item) => {
    if (!item) return;
    if (!window.confirm("Delete this image?")) return;

    try {
      // set undo data (soft delete)
      triggerUndo("gallery", item);

      // delete gallery doc (but keep storage file — soft delete)
      await deleteDoc(doc(db, "gallery", item.id));

      setGallery((prev) => prev.filter((g) => g.id !== item.id));
      toast.error("Deleted. Undo available for 10s.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete gallery image");
    }
  };

  /* ============================
        CONFIRM BOOKING (and set undo for confirmation)
     ============================ */
  const confirmBookingNow = async () => {
    if (!confirmData) return;

    try {
      // update booking confirmed flag
      await updateDoc(doc(db, "bookings", confirmData.id), {
        confirmed: true,
      });

      // allow undo for confirmation
      triggerUndo("bookingConfirm", confirmData);

      toast.success("Booking confirmed ✔");

      // send WhatsApp message
      let phone = confirmData.phone.replace(/\D/g, "");
      if (phone.length === 10) phone = "91" + phone;

      const message = encodeURIComponent(
        `Hello ${confirmData.customerName},\n\n` +
          `Your booking is CONFIRMED! 🎉\n\n` +
          `Event: ${confirmData.event}\n` +
          `Date: ${confirmData.date}\n\n` +
          `Thank you for choosing Praba Events ✨`
      );

      const waUrl = `https://wa.me/${phone}?text=${message}`;

      window.open(waUrl, "_blank");

      setConfirmData(null);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to confirm");
    }
  };

  return (
    <div className="page-section reveal admin-wrapper">

      {/* UNIFIED UNDO FAB */}
      {undoAction && (
        <button className="undo-fab" onClick={handleUndo} title="Undo last action">
          ⏪
        </button>
      )}

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

      {/* EVENTS TABLE */}
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
                <td>{b.confirmed ? "✔ Confirmed" : "⏳ Pending"}</td>
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

      {/* GALLERY MANAGEMENT */}
      <div className="glass-card admin-box">
        <h3 className="admin-subtitle">Gallery Management</h3>

        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={(e) => setGalleryFile(e.target.files[0])}
        />

        <button className="confirm-btn add-btn" onClick={uploadGalleryImage}>
          ➕ Add to Gallery
        </button>
      </div>

      {/* SHOW GALLERY IMAGES */}
      <div className="glass-card admin-table-wrap">
        <h3 className="admin-subtitle">Manage Gallery</h3>

        <div className="gallery-admin-grid">
          {gallery.map((g) => (
            <div key={g.id} className="gallery-admin-item">
              <img src={g.imageUrl} className="gallery-admin-thumb" />

              <button className="delete-btn" onClick={() => deleteGallery(g)}>
                🗑
              </button>
            </div>
          ))}
        </div>
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

      {/* CONFIRM & NOTIFY POPUP */}
      {confirmData && (
        <div className="modal-overlay">
          <div className="modal-box glass-box fade-in">
            <button className="close-btn" onClick={() => setConfirmData(null)}>
              ✖
            </button>

            <h3>Confirm Booking</h3>

            <p>
              <b>Event:</b> {confirmData.event} <br />
              <b>Name:</b> {confirmData.customerName} <br />
              <b>Date:</b> {confirmData.date} <br />
              <b>Phone:</b> {confirmData.phone}
            </p>

            <button className="confirm-btn" onClick={confirmBookingNow}>
              ✔ Confirm & Notify User
            </button>

            <button
              className="confirm-btn secondary"
              onClick={() => {
                let phone = confirmData.phone.replace(/\D/g, "");
                if (phone.length === 10) phone = "91" + phone;

                window.location.href = `sms:${phone}?body=Your booking is confirmed!`;
              }}
            >
              📩 Send SMS Instead
            </button>

            {/* Inline undo for quick revert (also handled by unified undo) */}
            <button
              className="confirm-btn"
              style={{ background: "#ff4444", marginTop: 10 }}
              onClick={async () => {
                try {
                  await updateDoc(doc(db, "bookings", confirmData.id), {
                    confirmed: false,
                  });

                  // also set undoAction so FAB appears (bookingCancel)
                  triggerUndo("bookingCancel", confirmData);

                  toast.info("Booking confirmation undone");
                  setConfirmData(null);
                  loadData();
                } catch (err) {
                  console.error(err);
                  toast.error("Undo failed");
                }
              }}
            >
              ⏪ Undo Confirmation
            </button>
          </div>
        </div>
      )}

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

    </div>
  );
}

export default Admin;
