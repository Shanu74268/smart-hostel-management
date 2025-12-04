import React, { useState, useEffect, useContext } from "react";
import GooglePayQR from "../../assets/GooglePay_QR.png";
import "../../styles/HostelFeePayment.css";
import { ProfileContext } from "../common/ProfileContext";

const HostelFeePayment = () => {
  // ✅ Use ProfileContext
  const { profilePic, profileData } = useContext(ProfileContext);

  const [showQR, setShowQR] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paid, setPaid] = useState(false);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (showQR && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && showQR) {
      alert("⏰ Payment time expired. Please try again.");
      setShowQR(false);
      setTimeLeft(300);
    }
    return () => clearInterval(timer);
  }, [showQR, timeLeft]);

  const handlePayNow = () => {
    setShowQR(true);
    setTimeLeft(300);
  };

  const handleConfirmPayment = () => {
    setPaid(true);
    setShowQR(false);
    setTimeLeft(300);

    const newPayment = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      amount: 15000,
      status: "Paid",
    };
    setPaymentHistory([newPayment, ...paymentHistory]);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ✅ Use profileData if available, else fallback
  const student = {
    profilePic: profilePic || "https://randomuser.me/api/portraits/men/45.jpg",
    name: profileData?.fullName || "John Doe",
    rollNumber: profileData?.rollNumber || "23CSE45",
    branch: profileData?.branch || "Computer Science",
    room: profileData?.roomNumber || "A-203",
    contact: profileData?.contactNumber || "+91 9876543210",
    email: profileData?.email || "john@example.com",
  };

  return (
    <div className="payment-wrapper">
      {/* Left Column */}
      <div className="payment-left">
        <div className="payment-card">
          <h2 className="dashboard-title">🏠 Hostel Fee Payment</h2>

          <div className="student-info horizontal">
            <div className="student-image-wrapper">
              <img
                src={student.profilePic}
                alt="Profile"
                className="student-avatar-square"
              />
            </div>
            <div className="student-details-horizontal">
              <div className="student-row">
                <p>
                  <strong>Name:</strong> {student.name}
                </p>
                <p>
                  <strong>Roll No:</strong> {student.rollNumber}
                </p>
              </div>
              <div className="student-row">
                <p>
                  <strong>Branch:</strong> {student.branch}
                </p>
                <p>
                  <strong>Room:</strong> {student.room}
                </p>
              </div>
              <div className="student-row">
                <p>
                  <strong>Contact:</strong> {student.contact}
                </p>
                <p>
                  <strong>Email:</strong> {student.email}
                </p>
              </div>
              <div className="student-row">
                <p>
                  <strong>Amount Due:</strong> ₹15,000
                </p>
                <p>
                  <strong>Status:</strong> {paid ? "Paid ✅" : "Pending ⚠️"}
                </p>
              </div>
            </div>
          </div>

          {!paid && !showQR && (
            <button className="pay-now-btn" onClick={handlePayNow}>
              💳 Pay Now
            </button>
          )}

          {showQR && (
            <>
              <div className="qr-section">
                <h3>Scan this QR to Pay via UPI</h3>
                <img src={GooglePayQR} alt="QR" className="qr-image" />
                <p className="upi-id">UPI ID: smarthostel@upi</p>
                <div className="timer">
                  ⏱ Time Left: <strong>{formatTime(timeLeft)}</strong>
                </div>
              </div>
              <div className="after-payment">
                <p>Once payment is done, click below to confirm your payment.</p>
                <button className="confirm-btn" onClick={handleConfirmPayment}>
                  ✅ I Have Paid
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="payment-right">
        <div className="payment-card">
          <h2 className="dashboard-title">📜 Payment History</h2>
          {paymentHistory.length === 0 ? (
            <p className="no-requests">No payments yet.</p>
          ) : (
            <div className="requests-table-wrapper">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((pay) => (
                    <tr key={pay.id}>
                      <td>{pay.date}</td>
                      <td>₹{pay.amount}</td>
                      <td>
                        <span className={`status-badge ${pay.status.toLowerCase()}`}>
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostelFeePayment;
