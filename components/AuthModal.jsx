"use client";

import { useState } from 'react';
import GoogleSignIn from './GoogleSignIn';
import Link from 'next/link';

const API_BASE = "https://dynaprizes-backend.onrender.com";

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('signin'); // 'signin', 'email'

  const handleSendOTP = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
      } else {
        alert(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        if (onSuccess) onSuccess(data.data);
        onClose();
      } else {
        alert(data.message || 'Invalid OTP');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img src="/logo.png" alt="DynaPrizes" style={{ height: "48px", margin: "0 auto" }} />
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1E3A5F", marginTop: "12px" }}>
            {mode === 'signin' ? 'Welcome Back' : 'Sign in with Email'}
          </h2>
          <p style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>
            {mode === 'signin' 
              ? 'Continue with Google or use email' 
              : otpSent ? 'Enter the OTP sent to your email' : 'Enter your email address'}
          </p>
        </div>

        {mode === 'signin' ? (
          <>
            {/* Google Sign-In Button */}
            <GoogleSignIn 
              onSuccess={onSuccess} 
              onError={(err) => alert(err)}
              onClose={onClose}
            />

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }} />
              <span style={{ fontSize: "12px", color: "#94A3B8" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }} />
            </div>

            {/* Email Option */}
            <button
              onClick={() => setMode('email')}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 20px",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1E293B",
                cursor: "pointer",
              }}
            >
              📧 Continue with Email
            </button>
          </>
        ) : (
          <>
            {!otpSent ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    fontSize: "14px",
                    marginBottom: "16px",
                    outline: "none",
                  }}
                  onFocus={e => e.target.style.borderColor = "#1A56DB"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                />
                <button
                  onClick={handleSendOTP}
                  disabled={!email || loading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: (!email || loading) ? "#CBD5E1" : "#1A56DB",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: (!email || loading) ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Sending..." : "Continue"}
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    fontSize: "14px",
                    marginBottom: "16px",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleVerifyOTP}
                  disabled={!otp || loading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: (!otp || loading) ? "#CBD5E1" : "#1A56DB",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: (!otp || loading) ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </button>
                <button
                  onClick={() => { setOtpSent(false); setOtp(''); }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "none",
                    border: "none",
                    fontSize: "13px",
                    color: "#1A56DB",
                    cursor: "pointer",
                    marginTop: "12px",
                  }}
                >
                  ← Back to email
                </button>
              </>
            )}
            <button
              onClick={() => { setMode('signin'); setOtpSent(false); setEmail(''); setOtp(''); }}
              style={{
                width: "100%",
                padding: "10px",
                background: "none",
                border: "none",
                fontSize: "13px",
                color: "#64748B",
                cursor: "pointer",
                marginTop: "12px",
              }}
            >
              ← Back to all sign in options
            </button>
          </>
        )}

        {/* Terms and Privacy */}
        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "11px", color: "#94A3B8" }}>
          By continuing, you agree to our{" "}
          <Link href="/terms" style={{ color: "#1A56DB", textDecoration: "none" }}>Terms</Link>{" "}
          and{" "}
          <Link href="/privacy" style={{ color: "#1A56DB", textDecoration: "none" }}>Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}