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
  const [gallery, setGallery] = useState([]);
  const [slides, setSlides] = useState([]);
  const [highlights, setHighlights] = useState([]);

  const [newPin, setNewPin] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  // unified undo
  const [undoAction, setUndoAction] = useState(null);

  const [newEvent, setNewEvent] = useState({ name: "", price: "", image: "" });
  const [newImageFile, setNewImageFile] = useState(null);

  // files for other sections
  const [slideFiles, setSlideFiles] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [highlightFile, setHighlightFile] = useState(null);

  // highlight form
  const [highlightForm, setHighlightForm] = useState({
    title: "",
    price: "",
    description: "",
    buttonText: "Book Now",
  });

  // edit states
  const [editingSlide, setEditingSlide] = useState(null);
  const [editingSlideFile, setEditingSlideFile] = useState(null);

  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [editingGalleryFile, setEditingGalleryFile] = useState(null);

  const [editingHighlight, setEditingHighlight] = useState(null);
  const [editingHighlightFile, setEditingHighlightFile] = useState(null);

  const [confirmData, setConfirmData] = useState(null);

  // simple uploading flags
  const [slideUploading, setSlideUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [highlightUploading, setHighlightUploading] = useState(false);

  const fileToBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.onloadend = () => cb(reader.result);
    reader.readAsDataURL(file);
  };

  const loadData = async () => {
    const eventSnap = await getDocs(collection(db, "events"));
    setEvents(eventSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

    const bookSnap = await getDocs(collection(db, "bookings"));
    setBookings(bookSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

    const galSnap = await getDocs(collection(db, "gallery"));
    setGallery(galSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

    const slideSnap = await getDocs(collection(db, "slides"));
    setSlides(slideSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

    const highlightSnap = await getDocs(collection(db, "highlights"));
    setHighlights(highlightSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ============== UNDO ============== */
  const triggerUndo = (type, data) => {
    if (undoAction?.timeoutId) clearTimeout(undoAction.timeoutId);
    const timeoutId = setTimeout(() => setUndoAction(null), 10000);
    setUndoAction({ type, data, timeoutId });
    toast.error("Undo available for 10 seconds.");
  };

  const handleUndo = async () => {
    if (!undoAction) return;
    clearTimeout(undoAction.timeoutId);

    try {
      const { type, data } = undoAction;

      if (type === "event") {
        await setDoc(doc(db, "events", data.id), { ...data });
        toast.success("Event restored ✔");
      } else if (type === "bookingDelete" || type === "bookingCancel") {
        await setDoc(doc(db, "bookings", data.id), { ...data });
        toast.success("Booking restored ✔");
      } else if (type === "bookingConfirm") {
        await updateDoc(doc(db, "bookings", data.id), { confirmed: false });
        toast.info("Booking confirmation undone");
      } else if (type === "gallery") {
        await setDoc(doc(db, "gallery", data.id), { ...data });
        toast.success("Gallery item restored ✔");
      } else if (type === "slide") {
        await setDoc(doc(db, "slides", data.id), { ...data });
        toast.success("Slide restored ✔");
      } else if (type === "highlight") {
        await setDoc(doc(db, "highlights", data.id), { ...data });
        toast.success("Highlight restored ✔");
      }

      setUndoAction(null);
      loadData();
    } catch (err) {
      console.error("Undo failed:", err);
      toast.error("Undo failed");
    }
  };

  /* ============== EVENTS ============== */
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

  const deleteEvent = async (ev) => {
    if (!ev) return;
    try {
      triggerUndo("event", ev);
      await deleteDoc(doc(db, "events", ev.id));
      setEvents((prev) => prev.filter((e) => e.id !== ev.id));
      toast.error("Event deleted. Undo available.");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const deleteBooking = async (id) => {
    try {
      const bookingToDelete = bookings.find((b) => b.id === id);
      if (!bookingToDelete) return;
      triggerUndo("bookingDelete", bookingToDelete);
      await deleteDoc(doc(db, "bookings", id));
      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast.info("Booking removed. Undo available.");
    } catch (err) {
      console.error(err);
      toast.error("Booking delete failed");
    }
  };

  const updatePIN = async () => {
    if (!newPin) return toast.warn("Enter new PIN");
    try {
      await setDoc(doc(db, "settings", "admin"), { pin: newPin });
      toast.success("PIN updated 🔐");
      setNewPin("");
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin-auth");
    toast.info("Logged Out");
    window.location.href = "/";
  };

  /* ============== SLIDES (BASE64, MULTI) ============== */
  const uploadSlideImages = () => {
    if (!slideFiles || slideFiles.length === 0) {
      toast.warn("Select slide images first");
      return;
    }

    setSlideUploading(true);
    let done = 0;
    const total = slideFiles.length;

    slideFiles.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        done++;
        return;
      }

      fileToBase64(file, async (base64) => {
        try {
          await addDoc(collection(db, "slides"), {
            imageUrl: base64,
            createdAt: Date.now(),
          });
        } catch (err) {
          console.error("Slide upload failed:", err);
        } finally {
          done++;
          if (done === total) {
            setSlideUploading(false);
            setSlideFiles([]);
            loadData();
            toast.success("Slides added ✔");
          }
        }
      });
    });
  };

  const deleteSlide = async (item) => {
    if (!item) return;
    if (!window.confirm("Delete this slide?")) return;
    try {
      triggerUndo("slide", item);
      await deleteDoc(doc(db, "slides", item.id));
      setSlides((prev) => prev.filter((s) => s.id !== item.id));
      toast.error("Slide deleted. Undo available for 10s.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete slide");
    }
  };

  const saveSlideEdit = () => {
    if (!editingSlide) return;

    const updateData = {};
    const finish = async () => {
      try {
        if (Object.keys(updateData).length > 0) {
          await updateDoc(doc(db, "slides", editingSlide.id), updateData);
          toast.success("Slide updated ✔");
          loadData();
        } else {
          toast.info("No changes to save");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to update slide");
      } finally {
        setEditingSlide(null);
        setEditingSlideFile(null);
      }
    };

    if (editingSlideFile) {
      fileToBase64(editingSlideFile, (base64) => {
        updateData.imageUrl = base64;
        finish();
      });
    } else {
      finish();
    }
  };

  /* ============== HIGHLIGHTS (ONE IMAGE + FORM) ============== */
  const uploadHighlight = () => {
    if (!highlightFile) return toast.warn("Select highlight image");
    if (!highlightForm.title) return toast.warn("Enter highlight title");

    setHighlightUploading(true);

    fileToBase64(highlightFile, async (base64) => {
      try {
        await addDoc(collection(db, "highlights"), {
          imageUrl: base64,
          title: highlightForm.title,
          price: highlightForm.price,
          description: highlightForm.description,
          buttonText: highlightForm.buttonText || "Book Now",
          createdAt: Date.now(),
        });

        toast.success("Highlight added ✔");
        setHighlightForm({
          title: "",
          price: "",
          description: "",
          buttonText: "Book Now",
        });
        setHighlightFile(null);
        loadData();
      } catch (err) {
        console.error(err);
        toast.error("Failed to upload highlight");
      } finally {
        setHighlightUploading(false);
      }
    });
  };

  const deleteHighlight = async (item) => {
    if (!item) return;
    if (!window.confirm("Delete this highlight?")) return;

    try {
      triggerUndo("highlight", item);
      await deleteDoc(doc(db, "highlights", item.id));
      setHighlights((prev) => prev.filter((h) => h.id !== item.id));
      toast.error("Highlight deleted. Undo available for 10s.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete highlight");
    }
  };

  const saveHighlightEdit = () => {
    if (!editingHighlight) return;

    const updateData = {
      title: editingHighlight.title || "",
      price: editingHighlight.price || "",
      description: editingHighlight.description || "",
      buttonText: editingHighlight.buttonText || "Book Now",
    };

    const finish = async () => {
      try {
        await updateDoc(doc(db, "highlights", editingHighlight.id), updateData);
        toast.success("Highlight updated ✔");
        loadData();
      } catch (err) {
        console.error(err);
        toast.error("Failed to update highlight");
      } finally {
        setEditingHighlight(null);
        setEditingHighlightFile(null);
      }
    };

    if (editingHighlightFile) {
      fileToBase64(editingHighlightFile, (base64) => {
        updateData.imageUrl = base64;
        finish();
      });
    } else {
      finish();
    }
  };

  /* ============== GALLERY (MULTI, IMAGE/VIDEO) ============== */
  const uploadGalleryImage = () => {
    if (!galleryFiles || galleryFiles.length === 0) {
      toast.warn("Select image or video first");
      return;
    }

    setGalleryUploading(true);
    let done = 0;
    const total = galleryFiles.length;

    galleryFiles.forEach((file) => {
      const type = file.type.startsWith("video/") ? "video" : "image";

      fileToBase64(file, async (base64) => {
        try {
          await addDoc(collection(db, "gallery"), {
            imageUrl: base64,
            type,
            createdAt: Date.now(),
          });
        } catch (err) {
          console.error("Gallery upload failed:", err);
        } finally {
          done++;
          if (done === total) {
            setGalleryUploading(false);
            setGalleryFiles([]);
            loadData();
            toast.success("Gallery updated ✔");
          }
        }
      });
    });
  };

  const deleteGallery = async (item) => {
    if (!item) return;
    if (!window.confirm("Delete this item?")) return;

    try {
      triggerUndo("gallery", item);
      await deleteDoc(doc(db, "gallery", item.id));
      setGallery((prev) => prev.filter((g) => g.id !== item.id));
      toast.error("Deleted. Undo available for 10s.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete gallery item");
    }
  };

  const saveGalleryEdit = () => {
    if (!editingGalleryItem) return;

    const updateData = {};

    const finish = async () => {
      try {
        if (Object.keys(updateData).length > 0) {
          await updateDoc(doc(db, "gallery", editingGalleryItem.id), updateData);
          toast.success("Gallery item updated ✔");
          loadData();
        } else {
          toast.info("No changes to save");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to update gallery item");
      } finally {
        setEditingGalleryItem(null);
        setEditingGalleryFile(null);
      }
    };

    if (editingGalleryFile) {
      const type = editingGalleryFile.type.startsWith("video/") ? "video" : "image";
      fileToBase64(editingGalleryFile, (base64) => {
        updateData.imageUrl = base64;
        updateData.type = type;
        finish();
      });
    } else {
      finish();
    }
  };

  const getGalleryType = (item) => {
    if (item.type) return item.type;
    return "image";
  };

  /* ============== CONFIRM BOOKING ============== */
  const confirmBookingNow = async () => {
    if (!confirmData) return;

    try {
      await updateDoc(doc(db, "bookings", confirmData.id), { confirmed: true });
      triggerUndo("bookingConfirm", confirmData);
      toast.success("Booking confirmed ✔");

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

  /* ============== JSX ============== */
  return (
    <div className="page-section reveal admin-wrapper">
      {undoAction && (
        <button className="undo-fab" onClick={handleUndo} title="Undo last action">
          ⏪
        </button>
      )}

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
                  <button
                    className="icon-btn"
                    onClick={() => setEditingEvent({ ...ev })}
                  >
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

      {/* BOOKINGS TABLE */}
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
      </div>

      {/* SLIDE MANAGEMENT */}
      <div className="glass-card admin-box">
        <h3 className="admin-subtitle">Slide Management</h3>
        <input
          type="file"
          accept="image/*"
          multiple
          className="form-control"
          onChange={(e) => setSlideFiles(Array.from(e.target.files || []))}
        />
        <button className="confirm-btn add-btn" onClick={uploadSlideImages}>
          ➕ Add Slide Images
        </button>
        {slideUploading && (
          <p className="upload-progress">Uploading slides...</p>
        )}
      </div>

      <div className="glass-card admin-table-wrap">
        <h3 className="admin-subtitle">Manage Slides</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Added</th>
              <th>Edit</th>
              <th>Del</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((s) => (
              <tr key={s.id}>
                <td>
                  <img src={s.imageUrl} className="table-img" />
                </td>
                <td>{s.createdAt ? new Date(s.createdAt).toLocaleString() : "-"}</td>
                <td>
                  <button className="icon-btn" onClick={() => setEditingSlide(s)}>
                    🛠
                  </button>
                </td>
                <td>
                  <button className="delete-btn" onClick={() => deleteSlide(s)}>
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* HIGHLIGHTS MANAGEMENT */}
      <div className="glass-card admin-box">
        <h3 className="admin-subtitle">Highlights Management</h3>

        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={(e) => setHighlightFile(e.target.files[0])}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Title (e.g. Premium Event #1)"
          value={highlightForm.title}
          onChange={(e) =>
            setHighlightForm({ ...highlightForm, title: e.target.value })
          }
        />
        <input
          type="number"
          className="form-control"
          placeholder="Price (e.g. 9999)"
          value={highlightForm.price}
          onChange={(e) =>
            setHighlightForm({ ...highlightForm, price: e.target.value })
          }
        />
        <textarea
          className="form-control"
          placeholder="Short description"
          value={highlightForm.description}
          onChange={(e) =>
            setHighlightForm({ ...highlightForm, description: e.target.value })
          }
        />
        <input
          type="text"
          className="form-control"
          placeholder="Button Text (Book Now)"
          value={highlightForm.buttonText}
          onChange={(e) =>
            setHighlightForm({ ...highlightForm, buttonText: e.target.value })
          }
        />

        <button className="confirm-btn add-btn" onClick={uploadHighlight}>
          ➕ Add Highlight
        </button>

        {highlightUploading && (
          <p className="upload-progress">Uploading highlight...</p>
        )}
      </div>

      <div className="glass-card admin-table-wrap">
        <h3 className="admin-subtitle">Manage Highlights</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Added</th>
              <th>Edit</th>
              <th>Del</th>
            </tr>
          </thead>
          <tbody>
            {highlights.map((h) => (
              <tr key={h.id}>
                <td>
                  <img src={h.imageUrl} className="table-img" />
                </td>
                <td>{h.title || "-"}</td>
                <td>{h.price ? `₹${h.price}` : "-"}</td>
                <td>
                  {h.createdAt ? new Date(h.createdAt).toLocaleString() : "-"}
                </td>
                <td>
                  <button
                    className="icon-btn"
                    onClick={() => setEditingHighlight({ ...h })}
                  >
                    🛠
                  </button>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteHighlight(h)}
                  >
                    🗑
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
          accept="image/*,video/*"
          multiple
          className="form-control"
          onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
        />
        <button className="confirm-btn add-btn" onClick={uploadGalleryImage}>
          ➕ Add to Gallery
        </button>
        {galleryUploading && (
          <p className="upload-progress">Uploading gallery...</p>
        )}
      </div>

      <div className="glass-card admin-table-wrap">
        <h3 className="admin-subtitle">Manage Gallery</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Type</th>
              <th>Added</th>
              <th>Edit</th>
              <th>Del</th>
            </tr>
          </thead>
          <tbody>
            {gallery.map((g) => {
              const type = getGalleryType(g);
              return (
                <tr key={g.id}>
                  <td>
                    {type === "video" ? (
                      <video src={g.imageUrl} className="table-img" controls muted />
                    ) : (
                      <img src={g.imageUrl} className="table-img" />
                    )}
                  </td>
                  <td>{type}</td>
                  <td>
                    {g.createdAt ? new Date(g.createdAt).toLocaleString() : "-"}
                  </td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => setEditingGalleryItem(g)}
                    >
                      🛠
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteGallery(g)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              );
            })}
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

      {/* CONFIRM BOOKING MODAL */}
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
          </div>
        </div>
      )}

      {/* EDIT EVENT MODAL */}
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

      {/* EDIT SLIDE MODAL */}
      {editingSlide && (
        <div className="modal-overlay">
          <div className="modal-box glass-box fade-in">
            <button
              className="close-btn"
              onClick={() => {
                setEditingSlide(null);
                setEditingSlideFile(null);
              }}
            >
              ✖
            </button>
            <h3>Edit Slide Image</h3>
            <img src={editingSlide.imageUrl} className="table-img" />
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setEditingSlideFile(e.target.files[0])}
            />
            <button className="confirm-btn" onClick={saveSlideEdit}>
              Save ✔
            </button>
          </div>
        </div>
      )}

      {/* EDIT HIGHLIGHT MODAL */}
      {editingHighlight && (
        <div className="modal-overlay">
          <div className="modal-box glass-box fade-in">
            <button
              className="close-btn"
              onClick={() => {
                setEditingHighlight(null);
                setEditingHighlightFile(null);
              }}
            >
              ✖
            </button>
            <h3>Edit Highlight</h3>
            <img src={editingHighlight.imageUrl} className="table-img" />
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setEditingHighlightFile(e.target.files[0])}
            />
            <input
              type="text"
              className="form-control"
              value={editingHighlight.title || ""}
              placeholder="Title"
              onChange={(e) =>
                setEditingHighlight({
                  ...editingHighlight,
                  title: e.target.value,
                })
              }
            />
            <input
              type="number"
              className="form-control"
              value={editingHighlight.price || ""}
              placeholder="Price"
              onChange={(e) =>
                setEditingHighlight({
                  ...editingHighlight,
                  price: e.target.value,
                })
              }
            />
            <textarea
              className="form-control"
              value={editingHighlight.description || ""}
              placeholder="Description"
              onChange={(e) =>
                setEditingHighlight({
                  ...editingHighlight,
                  description: e.target.value,
                })
              }
            />
            <input
              type="text"
              className="form-control"
              value={editingHighlight.buttonText || ""}
              placeholder="Button Text"
              onChange={(e) =>
                setEditingHighlight({
                  ...editingHighlight,
                  buttonText: e.target.value,
                })
              }
            />
            <button className="confirm-btn" onClick={saveHighlightEdit}>
              Save ✔
            </button>
          </div>
        </div>
      )}

      {/* EDIT GALLERY MODAL */}
      {editingGalleryItem && (
        <div className="modal-overlay">
          <div className="modal-box glass-box fade-in">
            <button
              className="close-btn"
              onClick={() => {
                setEditingGalleryItem(null);
                setEditingGalleryFile(null);
              }}
            >
              ✖
            </button>
            <h3>Edit Gallery Item</h3>
            {getGalleryType(editingGalleryItem) === "video" ? (
              <video
                src={editingGalleryItem.imageUrl}
                className="table-img"
                controls
                muted
              />
            ) : (
              <img src={editingGalleryItem.imageUrl} className="table-img" />
            )}
            <input
              type="file"
              className="form-control"
              accept="image/*,video/*"
              onChange={(e) => setEditingGalleryFile(e.target.files[0])}
            />
            <button className="confirm-btn" onClick={saveGalleryEdit}>
              Save ✔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
