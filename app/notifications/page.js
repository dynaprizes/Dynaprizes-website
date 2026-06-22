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

const NOTIF_ICONS = {
  price_alert: "🔔",
  order_update: "📦",
  promotion: "🏷️",
  cart_reminder: "🛒",
  custom: "📢",
  default: "📢",
};

const NOTIF_BG = {
  price_alert: "#EFF6FF",
  order_update: "#F0FDF4",
  promotion: "#FFFBEB",
  cart_reminder: "#FEF3C7",
  custom: "#F8FAFC",
  default: "#F8FAFC",
};

const formatTime = (dateString) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

function NotificationCard({ notification, onMarkRead, onMarkUnread, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const icon = NOTIF_ICONS[notification.type] || NOTIF_ICONS.default;
  const bgColor = NOTIF_BG[notification.type] || NOTIF_BG.default;
  
  // Use notification id
  const notifId = notification._id || notification.id;

  return (
    <div
      style={{
        background: notification.read ? "white" : bgColor,
        borderRadius: 16,
        border: `1px solid ${notification.read ? "#E2E8F0" : "#BFDBFE"}`,
        marginBottom: 12,
        transition: "all 0.2s",
        cursor: "pointer",
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", marginBottom: 4 }}>
              {notification.title}
            </p>
            <p style={{ fontSize: 11, color: "#94A3B8" }}>{formatTime(notification.createdAt)}</p>
          </div>
          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, marginBottom: 8 }}>
            {notification.message}
          </p>
          
          {!notification.read && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563EB" }} />
              <span style={{ fontSize: 10, color: "#2563EB", fontWeight: 600 }}>Unread</span>
            </div>
          )}
        </div>

        <span
          style={{
            fontSize: 14,
            color: "#94A3B8",
            transition: "transform 0.2s",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        >
          ▼
        </span>
      </div>

      {expanded && (
        <div
          style={{
            padding: "12px 20px 16px",
            borderTop: "1px solid #E2E8F0",
            background: "#F8FAFC",
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {notification.actionLink && (
            <Link
              href={notification.actionLink}
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                background: "#2563EB",
                color: "white",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              View Details →
            </Link>
          )}
          
          {!notification.read ? (
            <button
              onClick={(e) => {
  e.stopPropagation();
  onMarkRead(notifId);
}}
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                background: "white",
                border: "1px solid #E2E8F0",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Mark as Read
            </button>
          ) : (
            <button
              onClick={(e) => {
  e.stopPropagation();
  onMarkRead(notifId);
}}
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                background: "white",
                border: "1px solid #E2E8F0",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Mark as Unread
            </button>
          )}
          
          <button
            onClick={(e) => {
  e.stopPropagation();
  onMarkRead(notifId);
}}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              background: "#FEF2F2",
              border: "1px solid #FEE2E2",
              fontSize: 12,
              fontWeight: 500,
              color: "#EF4444",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }

        const res = await fetch(`${API_BASE}/api/notifications`, {
          headers: getAuthHeaders()
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setNotifications(data.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [router]);

  const filteredNotifications = filter === "all"
    ? notifications
    : filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications.filter((n) => n.type === filter);

  // Mark as read
  const handleMarkRead = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (data.success) {
      setNotifications(notifications.map((n) =>
        (n._id === id || n.id === id) ? { ...n, read: true } : n
      ));
    }
  } catch (error) {
    console.error('Error marking read:', error);
  }
};

  // Mark as unread
  const handleMarkUnread = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications/${id}/unread`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(notifications.map((n) =>
          n.id === id ? { ...n, read: false } : n
        ));
      }
    } catch (error) {
      console.error('Error marking unread:', error);
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    if (!confirm('Delete this notification?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(notifications.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Mark all as read - change endpoint to /mark-all-read with POST
const handleMarkAllRead = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/notifications/mark-all-read`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (data.success) {
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    }
  } catch (error) {
    console.error('Error marking all read:', error);
  }
};

  // Delete all
  const handleDeleteAll = async () => {
    if (!confirm('Delete all notifications? This cannot be undone.')) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/notifications`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error deleting all:', error);
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
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
            <div>
              <h1 className="sora" style={{ fontSize: 28, fontWeight: 700, color: "#1E3A5F", marginBottom: 6 }}>
                Notifications
              </h1>
              <p style={{ fontSize: 14, color: "#64748B" }}>
                {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
              </p>
            </div>
            
            {notifications.length > 0 && (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: "white",
                    border: "1px solid #E2E8F0",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#1d1717",
                    cursor: "pointer",
                  }}
                >
                  Mark all read
                </button>
                <button
                  onClick={handleDeleteAll}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: "#FEF2F2",
                    border: "1px solid #FEE2E2",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#EF4444",
                    cursor: "pointer",
                  }}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            borderBottom: "1px solid #E2E8F0",
            paddingBottom: 12,
          }}>
            {[
              { key: "all", label: "All", icon: "📢" },
              { key: "unread", label: "Unread", icon: "🔔" },
              { key: "price_alert", label: "Price Alerts", icon: "💰" },
              { key: "order_update", label: "Orders", icon: "📦" },
              { key: "promotion", label: "Offers", icon: "🏷️" },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 99,
                  border: "none",
                  background: filter === tab.key ? "#2563EB" : "transparent",
                  color: filter === tab.key ? "white" : "#64748B",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.key === "unread" && unreadCount > 0 && (
                  <span style={{
                    background: filter === tab.key ? "rgba(255,255,255,0.2)" : "#E2E8F0",
                    padding: "1px 6px",
                    borderRadius: 99,
                    fontSize: 10,
                    fontWeight: 700,
                    marginLeft: 4,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "white",
              borderRadius: 20,
            }}>
              <span style={{ fontSize: 64, display: "block", marginBottom: 16 }}>🔕</span>
              <p className="sora" style={{ fontSize: 18, fontWeight: 700, color: "#1E3A5F", marginBottom: 8 }}>
                No notifications
              </p>
              <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>
                You're all caught up! Check back later for updates.
              </p>
              <Link href="/" style={{
                padding: "10px 24px",
                background: "#2563EB",
                color: "white",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
              }}>
                Start Shopping
              </Link>
            </div>
          ) : (
            filteredNotifications.map(notification => (
  <NotificationCard
    key={notification._id || notification.id}
    notification={notification}
    onMarkRead={handleMarkRead}
    onMarkUnread={handleMarkUnread}
    onDelete={handleDelete}
  />
))
          )}
        </div>
      </div>
    </>
  );
}