"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = "https://dynaprizes-backend.onrender.com";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export default function PrivacySecurityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch privacy settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }

        const res = await fetch(`${API_BASE}/api/user/privacy`, {
          headers: getAuthHeaders()
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setSettings({
              emailNotifications: data.data.emailNotifications ?? true,
              pushNotifications: data.data.pushNotifications ?? true,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [router]);

  const toggleSetting = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch(`${API_BASE}/api/user/privacy`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings)
      });

      const data = await res.json();
      if (data.success) {
        alert('Privacy settings updated successfully!');
      } else {
        alert(data.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch(`${API_BASE}/api/user/delete`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await res.json();
      if (data.success) {
        localStorage.clear();
        router.push('/');
      } else {
        alert(data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Network error. Please try again.');
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
        .nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 14px; border-radius: 12px;
          font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.8);
          text-decoration: none; transition: all 0.15s; white-space: nowrap;
        }
        .nav-link:hover { background: rgba(255,255,255,0.13); color: white; }
        .nav-link .nav-emoji { font-size: 20px; }
        .notif-btn {
          position: relative; display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 12px; cursor: pointer;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
          font-size: 22px; transition: background 0.15s; text-decoration: none; flex-shrink: 0;
        }
        .notif-btn:hover { background: rgba(255,255,255,0.18); }
        .notif-dot {
          position: absolute; top: 8px; right: 8px;
          width: 8px; height: 8px; border-radius: 50%; background: #F59E0B;
          border: 2px solid #1E3A5F;
        }
        @media (max-width: 600px) {
          .nav-label { display: none; }
          .nav-link { padding: 10px 10px; }
        }
      `}</style>

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

      <div style={{ minHeight: "calc(100vh - 68px)", background: "#F1F5F9", padding: "32px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          
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

          <div style={{ marginBottom: 28 }}>
            <h1 className="sora" style={{ fontSize: 28, fontWeight: 700, color: "#1E3A5F", marginBottom: 6 }}>
              Privacy & Security
            </h1>
            <p style={{ fontSize: 14, color: "#64748B" }}>
              Manage your privacy settings and security preferences
            </p>
          </div>

          {/* Privacy Section - Only Email & Push Notifications */}
          <div style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid #E2E8F0",
            marginBottom: 24,
            overflow: "hidden",
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
              <h2 className="sora" style={{ fontSize: 18, fontWeight: 700, color: "#1E3A5F" }}>Notification Preferences</h2>
              <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Manage how you receive notifications</p>
            </div>
            
            <div style={{ padding: "20px 24px" }}>
              {/* Email Notifications */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
                marginBottom: 24,
                paddingBottom: 24,
                borderBottom: "1px solid #E2E8F0",
              }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", marginBottom: 4 }}>Email Notifications</p>
                  <p style={{ fontSize: 13, color: "#64748B" }}>Receive order updates and price alert notifications via email</p>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>{settings.emailNotifications ? "On" : "Off"}</span>
                  <div
                    onClick={() => toggleSetting("emailNotifications")}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 99,
                      background: settings.emailNotifications ? "#2563EB" : "#CBD5E1",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      position: "relative",
                    }}
                  >
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "white",
                      position: "absolute",
                      top: 2,
                      left: settings.emailNotifications ? 22 : 2,
                      transition: "left 0.2s",
                    }} />
                  </div>
                </label>
              </div>

              {/* Push Notifications */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
              }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", marginBottom: 4 }}>Push Notifications</p>
                  <p style={{ fontSize: 13, color: "#64748B" }}>Receive notifications directly on your device</p>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>{settings.pushNotifications ? "On" : "Off"}</span>
                  <div
                    onClick={() => toggleSetting("pushNotifications")}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 99,
                      background: settings.pushNotifications ? "#2563EB" : "#CBD5E1",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      position: "relative",
                    }}
                  >
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "white",
                      position: "absolute",
                      top: 2,
                      left: settings.pushNotifications ? 22 : 2,
                      transition: "left 0.2s",
                    }} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Delete Account Section */}
          <div style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid #E2E8F0",
            marginBottom: 24,
            overflow: "hidden",
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
              <h2 className="sora" style={{ fontSize: 18, fontWeight: 700, color: "#1E3A5F" }}>Account Management</h2>
            </div>
            
            <div style={{ padding: "20px 24px" }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#EF4444", marginBottom: 4 }}>Delete Account</p>
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 12 }}>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{
                      padding: "8px 20px",
                      borderRadius: 10,
                      background: "#FEF2F2",
                      border: "1px solid #FEE2E2",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#EF4444",
                      cursor: "pointer",
                    }}
                  >
                    Delete Account
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>Are you sure?</span>
                    <button
                      onClick={handleDeleteAccount}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        background: "#EF4444",
                        border: "none",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#1E293B",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "12px 32px",
                borderRadius: 12,
                background: "#2563EB",
                color: "white",
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
                transition: "background 0.2s",
              }}
              onMouseEnter={e => {
                if (!saving) e.currentTarget.style.background = "#1D4ED8";
              }}
              onMouseLeave={e => {
                if (!saving) e.currentTarget.style.background = "#2563EB";
              }}
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>

          {/* Legal Links */}
          <div style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid #E2E8F0",
            overflow: "hidden",
          }}>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link href="/privacy-policy" style={{ fontSize: 14, color: "#2563EB", textDecoration: "none" }}>
                  Privacy Policy →
                </Link>
                <Link href="/terms" style={{ fontSize: 14, color: "#2563EB", textDecoration: "none" }}>
                  Terms of Service →
                </Link>
                <Link href="/cookies" style={{ fontSize: 14, color: "#2563EB", textDecoration: "none" }}>
                  Cookie Policy →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}