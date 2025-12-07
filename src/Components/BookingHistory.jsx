import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import "../index.css";

function BookingHistory() {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const fetchHistory = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      alert("Enter valid 10-digit phone number!");
      return;
    }

    setLoading(true);

    try {
      const snap = await getDocs(collection(db, "bookings"));
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((b) => b.phone === cleanPhone);

      // Separate Upcoming vs Past
      const today = new Date().toISOString().split("T")[0];

      const upcoming = list.filter((b) => b.date >= today);
      const past = list.filter((b) => b.date < today);

      setBookings({ upcoming, past });
      setShowResults(true);
    } catch (e) {
      console.error(e);
      alert("Failed to load booking history");
    }

    setLoading(false);
  };

  // DELETE BOOKING
  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await deleteDoc(doc(db, "bookings", id));
      alert("Booking canceled");
      fetchHistory(); // refresh
    } catch (e) {
      console.error(e);
      alert("Failed to cancel booking");
    }
  };

  return (
    <div className="page-section fade-in" style={{ textAlign: "center" }}>
      <h2 className="section-title">Your Booking History</h2>

      {/* PHONE INPUT */}
      <div style={{ maxWidth: "350px", margin: "20px auto" }}>
        <input
          type="tel"
          className="form-control"
          placeholder="Enter your WhatsApp number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          className="confirm-btn glow"
          style={{ marginTop: "10px" }}
          onClick={fetchHistory}
        >
          Show My Booking History
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {/* RESULTS */}
      {showResults && bookings.upcoming?.length === 0 &&
        bookings.past?.length === 0 && (
          <p>No bookings found for this number.</p>
        )}

      {/* UPCOMING BOOKINGS */}
      {bookings.upcoming?.length > 0 && (
        <>
          <h3 className="section-title">Upcoming Bookings</h3>
          <table className="admin-table fade-in">
            <thead>
              <tr>
                <th>Image</th>
                <th>Event</th>
                <th>Date</th>
                <th>Status</th>
                <th>Cancel</th>
              </tr>
            </thead>
            <tbody>
              {bookings.upcoming.map((b) => (
                <tr key={b.id}>
                  <td>
                    <img
                      src={b.image || "/placeholder.jpg"}
                      alt={b.event}
                      width="60"
                      height="40"
                      style={{ borderRadius: "6px" }}
                    />
                  </td>
                  <td>{b.event}</td>
                  <td>{b.date}</td>
                  <td>
                    {b.confirmed ? (
                      <span style={{ color: "green" }}>Confirmed ✔</span>
                    ) : (
                      <span style={{ color: "orange" }}>Pending ⏳</span>
                    )}
                  </td>
                  <td>
                    {!b.confirmed && (
                      <button
                        className="delete-btn"
                        onClick={() => cancelBooking(b.id)}
                      >
                        Cancel ✖
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* PAST BOOKINGS */}
      {bookings.past?.length > 0 && (
        <>
          <h3 className="section-title" style={{ marginTop: "30px" }}>
            Past Bookings
          </h3>
          <table className="admin-table fade-in">
            <thead>
              <tr>
                <th>Image</th>
                <th>Event</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.past.map((b) => (
                <tr key={b.id}>
                  <td>
                    <img
                      src={b.image || "/placeholder.jpg"}
                      alt={b.event}
                      width="60"
                      height="40"
                      style={{ borderRadius: "6px" }}
                    />
                  </td>
                  <td>{b.event}</td>
                  <td>{b.date}</td>
                  <td>
                    {b.confirmed ? (
                      <span style={{ color: "green" }}>Completed ✔</span>
                    ) : (
                      <span style={{ color: "gray" }}>Expired</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default BookingHistory;
