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

export default function NotificationPreferencesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState({
    priceAlerts: true,
    orderUpdates: true,
    promotions: false,
    appNotifications: true,
    emailNotifications: true,
  });

  // Fetch preferences from backend
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }

        const res = await fetch(`${API_BASE}/api/user/notifications`, {
          headers: getAuthHeaders()
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setPreferences({
              priceAlerts: data.data.priceAlerts !== undefined ? data.data.priceAlerts : true,
              orderUpdates: data.data.orderUpdates !== undefined ? data.data.orderUpdates : true,
              promotions: data.data.promotions || false,
              appNotifications: data.data.appNotifications !== undefined ? data.data.appNotifications : true,
              emailNotifications: data.data.emailNotifications !== undefined ? data.data.emailNotifications : true,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [router]);

  const togglePreference = (key) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch(`${API_BASE}/api/user/notifications`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          priceAlerts: preferences.priceAlerts,
          orderUpdates: preferences.orderUpdates,
          promotions: preferences.promotions,
          appNotifications: preferences.appNotifications,
          emailNotifications: preferences.emailNotifications,
        })
      });

      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(data.message || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Network error. Please try again.');
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
              Notification Preferences
            </h1>
            <p style={{ fontSize: 14, color: "#64748B" }}>
              Choose which notifications you want to receive
            </p>
          </div>

          {saved && (
            <div style={{
              padding: "12px 16px",
              borderRadius: 10,
              marginBottom: 20,
              background: "#D1FAE5",
              color: "#065F46",
              fontSize: 14,
            }}>
              ✓ Preferences saved successfully!
            </div>
          )}

          {/* Push Notifications Section */}
          <div style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid #E2E8F0",
            marginBottom: 24,
            overflow: "hidden",
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
              <h2 className="sora" style={{ fontSize: 18, fontWeight: 700, color: "#1E3A5F" }}>Push Notifications</h2>
              <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Sent directly to your device</p>
            </div>
            
            <div style={{ padding: "20px 24px" }}>
              {[
                { key: "priceAlerts", label: "Price Alerts", desc: "Get notified when products hit your target price" },
                { key: "orderUpdates", label: "Order Updates", desc: "Track your order status and delivery updates" },
              ].map(item => (
                <div key={item.key} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 16,
                  marginBottom: item.key !== "promotions" ? 24 : 0,
                  paddingBottom: item.key !== "promotions" ? 24 : 0,
                  borderBottom: item.key !== "promotions" ? "1px solid #E2E8F0" : "none",
                }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", marginBottom: 4 }}>{item.label}</p>
                    <p style={{ fontSize: 13, color: "#64748B" }}>{item.desc}</p>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>{preferences[item.key] ? "On" : "Off"}</span>
                    <div
                      onClick={() => togglePreference(item.key)}
                      style={{
                        width: 44,
                        height: 24,
                        borderRadius: 99,
                        background: preferences[item.key] ? "#2563EB" : "#CBD5E1",
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
                        left: preferences[item.key] ? 22 : 2,
                        transition: "left 0.2s",
                      }} />
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Email Preferences */}
          <div style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid #E2E8F0",
            marginBottom: 24,
            overflow: "hidden",
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
              <h2 className="sora" style={{ fontSize: 18, fontWeight: 700, color: "#1E3A5F" }}>Email Notifications</h2>
              <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Sent to your registered email address</p>
            </div>
            
            <div style={{ padding: "20px 24px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
              }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", marginBottom: 4 }}>Email Notifications</p>
                  <p style={{ fontSize: 13, color: "#64748B" }}>Receive notifications via email for all updates</p>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>{preferences.emailNotifications ? "On" : "Off"}</span>
                  <div
                    onClick={() => togglePreference("emailNotifications")}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 99,
                      background: preferences.emailNotifications ? "#2563EB" : "#CBD5E1",
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
                      left: preferences.emailNotifications ? 22 : 2,
                      transition: "left 0.2s",
                    }} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* App Preferences */}
          <div style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid #E2E8F0",
            marginBottom: 32,
            overflow: "hidden",
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
              <h2 className="sora" style={{ fontSize: 18, fontWeight: 700, color: "#1E3A5F" }}>App Preferences</h2>
              <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>In-app notification settings</p>
            </div>
            
            <div style={{ padding: "20px 24px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
              }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", marginBottom: 4 }}>In-App Notifications</p>
                  <p style={{ fontSize: 13, color: "#64748B" }}>Show notifications within the app</p>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>{preferences.appNotifications ? "On" : "Off"}</span>
                  <div
                    onClick={() => togglePreference("appNotifications")}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 99,
                      background: preferences.appNotifications ? "#2563EB" : "#CBD5E1",
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
                      left: preferences.appNotifications ? 22 : 2,
                      transition: "left 0.2s",
                    }} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}