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

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{
      background: "white",
      borderRadius: 16,
      padding: "20px 16px",
      border: "1px solid #E2E8F0",
      textAlign: "center",
      flex: 1,
      minWidth: 100,
    }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <p style={{ fontSize: 22, fontWeight: 800, color: color || "#1E3A5F", marginBottom: 4 }}>{value}</p>
      <p style={{ fontSize: 12, color: "#64748B" }}>{label}</p>
    </div>
  );
}

function MenuItem({ icon, label, href, onClick }) {
  if (onClick) {
    return (
      <button onClick={onClick} style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        background: "white",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        width: "100%",
        cursor: "pointer",
        transition: "all 0.2s",
        textAlign: "left",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "#F8FAFC")}
      onMouseLeave={e => (e.currentTarget.style.background = "white")}
      >
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#1E293B" }}>{label}</span>
        <span style={{ fontSize: 16, color: "#94A3B8" }}>→</span>
      </button>
    );
  }
  
  // ✅ ADD THIS - For regular links with href
  return (
    <Link href={href} style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 16px",
      background: "white",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      width: "100%",
      textDecoration: "none",
      transition: "all 0.2s",
    }}
    onMouseEnter={e => (e.currentTarget.style.background = "#F8FAFC")}
    onMouseLeave={e => (e.currentTarget.style.background = "white")}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#1E293B" }}>{label}</span>
      <span style={{ fontSize: 16, color: "#94A3B8" }}>→</span>
    </Link>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalSaved: 0, priceAlerts: 0, ordersCount: 0 });

// Load cached stats from localStorage on client side
useEffect(() => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('dp_stats');
      if (cached) {
        const parsed = JSON.parse(cached);
        setStats(parsed);
      }
    } catch (e) {
      console.log('Error loading cached stats');
    }
  }
}, []);

  // Fetch user data from backend
useEffect(() => {
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token) {
      router.push('/');
      return;
    }

    // ✅ LOAD CACHED STATS FIRST (INSTANT)
    const cachedStats = localStorage.getItem('dp_stats');
    if (cachedStats) {
      try {
        const parsed = JSON.parse(cachedStats);
        setStats(parsed);
      } catch (e) {
        console.log('Error loading cached stats');
      }
    }

    try {
      // ✅ PARALLEL API CALLS (FASTER)
      const [userRes, alertsRes, cartRes] = await Promise.all([
        fetch(`${API_BASE}/api/auth/me`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/api/alerts`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/api/cart`, { headers: getAuthHeaders() })
      ]);

      // Process user data
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.success) {
          setUser(userData.data);
          localStorage.setItem('user', JSON.stringify(userData.data));
        }
      }

      // Process alerts
      let totalAlerts = 0;
      let totalSaved = 0;
      
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        if (alertsData.success) {
          const alerts = alertsData.data || [];
          totalAlerts = alerts.length;
          
          alerts.forEach(alert => {
            if (alert.currentPrice && alert.targetPrice && alert.currentPrice > alert.targetPrice) {
              totalSaved += (alert.currentPrice - alert.targetPrice);
            }
          });
        }
      }

      // Process cart
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        if (cartData.success && cartData.data) {
          const items = cartData.data.items || [];
          items.forEach(item => {
            if (item.originalPrice && item.price && item.originalPrice > item.price) {
              totalSaved += (item.originalPrice - item.price) * (item.quantity || 1);
            }
          });
        }
      }

      // Get orders count
      const orders = JSON.parse(localStorage.getItem('dp_orders') || '[]');
      const totalOrders = orders.length;

      // ✅ UPDATE STATS
      const newStats = {
        totalSaved: Math.round(totalSaved),
        priceAlerts: totalAlerts,
        ordersCount: totalOrders || 0
      };
      
      setStats(newStats);
      
      // ✅ CACHE STATS FOR NEXT TIME
      localStorage.setItem('dp_stats', JSON.stringify(newStats));

    } catch (error) {
      console.error('Fetch user error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, [router]);

  const handleLogout = () => {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/');
  }
};
  // Format member since date
  const getMemberSince = () => {
    if (!user?.createdAt) return 'Recently';
    const date = new Date(user.createdAt);
    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  };

  if (loading) {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#F1F5F9", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      gap: 16,
    }}>
      {/* Skeleton loading for account page */}
      <div style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: "#E2E8F0",
        animation: "pulse 1.5s ease-in-out infinite",
      }} />
      <div style={{
        width: 200,
        height: 20,
        borderRadius: 8,
        background: "#E2E8F0",
        animation: "pulse 1.5s ease-in-out infinite 0.2s",
      }} />
      <div style={{
        width: 150,
        height: 14,
        borderRadius: 8,
        background: "#E2E8F0",
        animation: "pulse 1.5s ease-in-out infinite 0.4s",
      }} />
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        marginTop: 16,
        width: "100%",
        maxWidth: 400,
      }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            height: 80,
            borderRadius: 12,
            background: "#E2E8F0",
            animation: `pulse 1.5s ease-in-out infinite ${i * 0.15}s`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

  if (!user) {
    return null; // Will redirect
  }

  

  return (
    <>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
  .sora { font-family: 'Sora', sans-serif; }
  
  /* ✅ ADD THIS */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
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
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          
          {/* Welcome Section */}
          <div style={{ marginBottom: 28 }}>
            <h1 className="sora" style={{ fontSize: 28, fontWeight: 700, color: "#1E3A5F", marginBottom: 6 }}>
              My Account
            </h1>
            <p style={{ fontSize: 14, color: "#64748B" }}>Manage your profile, orders, and preferences</p>
          </div>

          {/* Profile Card */}
          <div style={{
            background: "white",
            borderRadius: 20,
            padding: "24px",
            border: "1px solid #E2E8F0",
            marginBottom: 24,
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "center",
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, #1E3A5F, #F59E0B)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36, fontWeight: 600, color: "white",
            }}>
              {user.name?.charAt(0) || 'U'}
            </div>

            <div style={{ flex: 1 }}>
              <h2 className="sora" style={{ fontSize: 22, fontWeight: 700, color: "#1E293B", marginBottom: 8 }}>{user.name}</h2>
              <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}>{user.email}</p>
              <p style={{ fontSize: 13, color: "#94A3B8" }}>Member since {getMemberSince()}</p>
            </div>

            <Link href="/account/edit" style={{
              padding: "8px 20px", borderRadius: 10,
              background: "#EFF6FF", border: "1px solid #DBEAFE",
              fontSize: 13, fontWeight: 600, color: "#2563EB",
              textDecoration: "none", transition: "all 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#DBEAFE")}
            onMouseLeave={e => (e.currentTarget.style.background = "#EFF6FF")}
            >
              Edit Profile
            </Link>
          </div>

          {/* Stats Row */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 16,
            marginBottom: 32,
          }}>
            <StatCard label="Total Saved" value={`₹${stats.totalSaved.toLocaleString("en-IN")}`} icon="💰" color="#10B981" />
            <StatCard label="Price Alerts" value={stats.priceAlerts} icon="🔔" color="#F59E0B" />
            <StatCard label="Orders" value={stats.ordersCount} icon="📦" color="#1A56DB" />
          </div>

          {/* Two Column Layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}>
            
            {/* Left Column - Account Settings */}
            <div>
              <h3 className="sora" style={{ fontSize: 16, fontWeight: 700, color: "#1E3A5F", marginBottom: 16 }}>
                Account Settings
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <MenuItem icon="👤" label="Edit Profile" href="/account/edit" />
                <MenuItem icon="🔒" label="Privacy & Security" href="/account/privacy" />
              </div>
            </div>

            {/* Right Column - Shopping & Support */}
            <div>
              <h3 className="sora" style={{ fontSize: 16, fontWeight: 700, color: "#1E3A5F", marginBottom: 16 }}>
                Shopping & Support
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <MenuItem icon="🔔" label="Price Alerts" href="/alerts" />
                <MenuItem icon="❓" label="Help & Support" href="/account/support" />
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #E2E8F0" }}>
            <button
              onClick={handleLogout}
              style={{
                padding: "12px 24px",
                background: "#FEF2F2",
                border: "1px solid #FEE2E2",
                borderRadius: 12,
                color: "#EF4444",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                width: "100%",
                maxWidth: 200,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#FEE2E2")}
              onMouseLeave={e => (e.currentTarget.style.background = "#FEF2F2")}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}