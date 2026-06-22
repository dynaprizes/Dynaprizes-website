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

const INR = (n) => "₹" + (n || 0).toLocaleString("en-IN");

const STATUS_COLORS = {
  Completed: "#10B981",
  Processing: "#F59E0B",
  Cancelled: "#EF4444",
  Delivered: "#10B981",
  Shipped: "#2563EB",
};

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = STATUS_COLORS[order.status] || "#64748B";

  return (
    <div style={{
      background: "white",
      borderRadius: 16,
      border: "1px solid #E2E8F0",
      marginBottom: 16,
      overflow: "hidden",
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: "16px 20px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#F8FAFC")}
        onMouseLeave={e => (e.currentTarget.style.background = "white")}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 32 }}>{order.image || "📦"}</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 4 }}>
              {order.productName || order.name || "Order"}
            </p>
            <p style={{ fontSize: 12, color: "#64748B" }}>Order ID: {order.id || order.orderId}</p>
          </div>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#1E3A5F" }}>{INR(order.price || order.total)}</p>
            {order.savings > 0 && (
              <p style={{ fontSize: 11, color: "#10B981" }}>Saved {INR(order.savings)}</p>
            )}
          </div>
          
          <span style={{
            padding: "4px 10px",
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 600,
            background: `${statusColor}15`,
            color: statusColor,
          }}>
            {order.status || "Processing"}
          </span>
          
          <span style={{ fontSize: 16, color: "#94A3B8", transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
            ▼
          </span>
        </div>
      </div>

      {expanded && (
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid #E2E8F0",
          background: "#F8FAFC",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}>
            <div>
              <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>Order Date</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#1E293B" }}>
                {order.date ? new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "N/A"}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>Retailer</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#1E293B" }}>{order.retailer || "N/A"}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>Quantity</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#1E293B" }}>{order.quantity || 1}</p>
            </div>
            {order.savings > 0 && (
              <div>
                <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>You Saved</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#10B981" }}>{INR(order.savings)}</p>
              </div>
            )}
          </div>
          
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #E2E8F0", display: "flex", gap: 12 }}>
            <button
              onClick={() => window.open(`/product?id=${order.productId}`, "_blank")}
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                background: "#2563EB",
                color: "white",
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Buy Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }

        const res = await fetch(`${API_BASE}/api/orders`, {
          headers: getAuthHeaders()
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setOrders(data.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(o => (o.status || "").toLowerCase() === filter.toLowerCase());

  const totalSaved = orders.reduce((sum, o) => sum + (o.savings || 0), 0);
  const totalOrders = orders.length;

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
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          
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

          <div style={{ marginBottom: 24 }}>
            <h1 className="sora" style={{ fontSize: 28, fontWeight: 700, color: "#1E3A5F", marginBottom: 6 }}>
              My Orders
            </h1>
            <p style={{ fontSize: 14, color: "#64748B" }}>
              {totalOrders} orders • Total saved {INR(totalSaved)}
            </p>
          </div>

          <div style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            borderBottom: "1px solid #E2E8F0",
            paddingBottom: 12,
          }}>
            {["all", "completed", "processing", "shipped", "delivered"].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 99,
                  border: "none",
                  background: filter === tab ? "#2563EB" : "transparent",
                  color: filter === tab ? "white" : "#64748B",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "white",
              borderRadius: 20,
            }}>
              <span style={{ fontSize: 64, display: "block", marginBottom: 16 }}>📦</span>
              <p className="sora" style={{ fontSize: 18, fontWeight: 700, color: "#1E3A5F", marginBottom: 8 }}>
                No orders found
              </p>
              <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>
                {orders.length === 0 ? "You haven't placed any orders yet" : "No orders match this filter"}
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
            filteredOrders.map(order => (
              <OrderCard key={order.id || order.orderId} order={order} />
            ))
          )}
        </div>
      </div>
    </>
  );
}