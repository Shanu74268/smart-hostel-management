import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail, resendVerificationLink } from "../../api/authApi";
import "../../styles/VerifyEmail.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const [message, setMessage] = useState("⏳ Verifying your email...");
  const [loading, setLoading] = useState(true);
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");
    console.log("🔍 Starting verification with token:", token);

    if (!token) {
      setMessage("❌ No token provided.");
      setLoading(false);
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyEmail(token);
        const msg = typeof res?.data === "string" ? res.data.trim() : "";
        console.log("✅ Server response:", msg);

        const isVerifiedTrue = /verified:\s*true/i.test(msg);
        const isVerifiedFalse = /verified:\s*false/i.test(msg);

        console.log("🧠 Flags → Verified:true:", isVerifiedTrue, "Verified:false:", isVerifiedFalse);

        if (msg === "User is already verified.") {
          setMessage("ℹ️ Email is already verified. Redirecting to login...");
          setLoading(false);
          setTimeout(() => navigate("/login"), 2000);
        } else if (msg === "Email verified successfully! Now you can log in.") {
          setMessage("✅ Verification complete! Redirecting...");
          setLoading(false);
          setTimeout(() => navigate("/login"), 2000);
        } else if (isVerifiedTrue) {
          setMessage("❌ Link has expired. Your email is already verified.");
          setLoading(false);
          setTimeout(() => navigate("/login"), 2000);
        } else if (isVerifiedFalse && !isVerifiedTrue) {
          const extractedEmail = extractEmailFromToken(token);
          setEmail(extractedEmail);
          setMessage("❌ Link has expired. You can request a new one.");
          setShowResend(true);
          setLoading(false);
        } else {
          setMessage("❌ Verification failed. Redirecting to login...");
          setLoading(false);
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (err) {
        const errMsg = typeof err?.response?.data === "string"
          ? err.response.data.trim()
          : JSON.stringify(err.response?.data);
        console.log("❌ Error response:", errMsg);

        const isVerifiedTrue = /verified:\s*true/i.test(errMsg);
        const isVerifiedFalse = /verified:\s*false/i.test(errMsg);

        console.log("🧠 Flags (error) → Verified:true:", isVerifiedTrue, "Verified:false:", isVerifiedFalse);

        if (isVerifiedTrue) {
          setMessage("❌ Link has expired. Your email is already verified.");
          setLoading(false);
          setTimeout(() => navigate("/login"), 2000);
        } else if (isVerifiedFalse && !isVerifiedTrue) {
          const extractedEmail = extractEmailFromToken(token);
          setEmail(extractedEmail);
          setMessage("❌ Link has expired. You can request a new one.");
          setShowResend(true);
          setLoading(false);
        } else {
          setMessage("❌ Verification failed. Redirecting to login...");
          setLoading(false);
          setTimeout(() => navigate("/login"), 2000);
        }
      }
    };

    verify();
  }, [searchParams, navigate]);

  const extractEmailFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("📬 Extracted email from token:", payload.sub);
      return payload.sub || "";
    } catch (err) {
      console.log("⚠️ Failed to extract email:", err);
      return "";
    }
  };

  const handleResend = async () => {
    console.log("🔁 Resend requested for:", email);
    setResending(true);
    try {
      const res = await resendVerificationLink(email);
      console.log("📨 Resend response:", res?.data);
      setMessage("📧 A new verification link has been sent to your email.");
      setShowResend(false);
    } catch (err) {
      const errMsg = typeof err?.response?.data === "string"
        ? err.response.data.trim()
        : JSON.stringify(err.response?.data);
      console.log("⚠️ Resend failed:", errMsg);

      if (errMsg === "User is already verified.") {
        setMessage("ℹ️ Your email is already verified. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage("⚠️ Failed to resend verification link. Try again later.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-wrapper pending-bg">
      <div className="verify-card">
        <h2>Email Verification</h2>
        <p>{message}</p>
        {loading && (
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
        {showResend && (
          <button className="resend-btn" onClick={handleResend} disabled={resending}>
            🔁 {resending ? "Resending..." : "Resend Verification Link"}
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;