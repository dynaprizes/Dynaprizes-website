"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = "https://dynaprizes-backend.onrender.com";

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export default function EditProfilePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }

        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: getAuthHeaders()
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setFormData({
              name: data.data.name || "",
              email: data.data.email || "",
              phone: data.data.mobile || "",
            });
          }
        } else {
          throw new Error('Failed to fetch user');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setMessage({ type: "error", text: "Failed to load profile data" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.phone,
        })
      });

      const data = await res.json();

      if (data.success) {
        // Update localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.name = formData.name;
        user.mobile = formData.phone;
        localStorage.setItem('user', JSON.stringify(user));

        setMessage({ type: "success", text: "Profile updated successfully!" });
        setTimeout(() => {
          router.push("/account");
        }, 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile" });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #E2E8F0", borderTopColor: "#1A56DB", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .sora { font-family: 'Sora', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "#1E3A5F",
        boxShadow: "0 2px 24px rgba(15,30,50,0.4)",
      }}>
        <div style={{
          maxWidth: 1080, margin: "0 auto", padding: "0 20px",
          height: 68, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 16,
        }}>
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="DynaPrizes" style={{ width: 44, height: 44, objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>
              <span style={{ color: "#FFFFFF" }}>Dyna</span>
              <span style={{ color: "#F59E0B" }}>Prizes</span>
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
            <Link href="/notifications" className="notif-btn" aria-label="Notifications">
              🔔
              <span className="notif-dot" />
            </Link>
            {[
              { label: "Home", emoji: "🏠", href: "/" },
              { label: "Alerts", emoji: "🔔", href: "/alerts" },
              { label: "Cart", emoji: "🛒", href: "/cart" },
              { label: "Account", emoji: "👤", href: "/account" },
            ].map(tab => (
              <Link key={tab.label} href={tab.href} className="nav-link">
                <span className="nav-emoji">{tab.emoji}</span>
                <span className="nav-label">{tab.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ minHeight: "calc(100vh - 68px)", background: "#F1F5F9", padding: "32px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              fontSize: 14,
              color: "#2563EB",
              cursor: "pointer",
              marginBottom: 20,
              padding: 0,
            }}
          >
            ← Back to Account
          </button>

          {/* Form Card */}
          <div style={{
            background: "white",
            borderRadius: 20,
            padding: "32px",
            border: "1px solid #E2E8F0",
          }}>
            <h1 className="sora" style={{ fontSize: 24, fontWeight: 700, color: "#1E3A5F", marginBottom: 8 }}>
              Edit Profile
            </h1>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 32 }}>
              Update your personal information
            </p>

            {/* Message */}
            {message.text && (
              <div style={{
                padding: "12px 16px",
                borderRadius: 10,
                marginBottom: 24,
                background: message.type === "success" ? "#D1FAE5" : "#FEE2E2",
                color: message.type === "success" ? "#065F46" : "#991B1B",
                fontSize: 14,
              }}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1E293B",
                  marginBottom: 8,
                }}>
                  Full Name
                </label>
                <input
  type="text"
  name="name"
  value={formData.name}
  onChange={handleChange}
  required
  style={{
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid #E2E8F0",
    fontSize: 14,
    outline: "none",
    color: "#0F172A",  // ← Darker text
    transition: "border-color 0.2s",
  }}
  onFocus={e => (e.target.style.borderColor = "#2563EB")}
  onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
/>
              </div>

              {/* Email */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1E293B",
                  marginBottom: 8,
                }}>
                  Email Address
                </label>
                <input
  type="email"
  name="email"
  value={formData.email}
  disabled
  style={{
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid #E2E8F0",
    fontSize: 14,
    outline: "none",
    background: "#F1F5F9",
    color: "#94A3B8",  // ← Keep light for disabled
    cursor: "not-allowed",
  }}
/>
                <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 6 }}>
                  Email cannot be changed. Contact support for assistance.
                </p>
              </div>

              {/* Phone */}
              <div style={{ marginBottom: 28 }}>
                <label style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1E293B",
                  marginBottom: 8,
                }}>
                  Phone Number
                </label>
                <input
  type="tel"
  name="phone"
  value={formData.phone}
  onChange={handleChange}
  placeholder="Enter phone number"
  style={{
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid #E2E8F0",
    fontSize: 14,
    outline: "none",
    color: "#0F172A",  // ← Darker text
    transition: "border-color 0.2s",
  }}
  onFocus={e => (e.target.style.borderColor = "#2563EB")}
  onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
/>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => router.back()}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 10,
                    border: "1px solid #E2E8F0",
                    background: "white",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#1E293B",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F8FAFC")}
                  onMouseLeave={e => (e.currentTarget.style.background = "white")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "10px 28px",
                    borderRadius: 10,
                    border: "none",
                    background: "#2563EB",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.6 : 1,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    if (!saving) e.currentTarget.style.background = "#1D4ED8";
                  }}
                  onMouseLeave={e => {
                    if (!saving) e.currentTarget.style.background = "#2563EB";
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}