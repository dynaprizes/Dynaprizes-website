"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "https://dynaprizes-backend.onrender.com";
const INR = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN");

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

function AlertCard({ alert, onToggle, onDelete, onEdit, toggling, onProductClick }) {
  const [imgErr, setImgErr] = useState(false);
  const progress = alert.targetPrice ? Math.min(100, ((alert.currentPrice - alert.targetPrice) / alert.currentPrice) * 100) : 0;
  const savings = alert.currentPrice - alert.targetPrice;
  
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1px solid #E2E8F0", marginBottom: 14, transition: "all .2s", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ width: 100, height: 100, background: "#F8FAFC", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }} onClick={() => onProductClick(alert)}>
          {alert.productImage && !imgErr
            ? <img src={alert.productImage} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }} />
            : <span style={{ fontSize: 42 }}>🎯</span>
          }
        </div>
        
        <div style={{ flex: 1, minWidth: 200 }}>
          <p 
            style={{ fontSize: 16, fontWeight: 700, color: "#1E293B", marginBottom: 6, cursor: "pointer" }}
            onClick={() => onProductClick(alert)}
          >
            {alert.productName}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "baseline", gap: 20, flexWrap: "wrap", marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 11, color: "#94A3B8", display: "block" }}>Current</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#EF4444" }}>{INR(alert.currentPrice)}</span>
            </div>
            <div>
              <span style={{ fontSize: 11, color: "#94A3B8", display: "block" }}>Target</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#10B981" }}>{INR(alert.targetPrice)}</span>
            </div>
            {savings > 0 && (
              <div>
                <span style={{ fontSize: 11, color: "#94A3B8", display: "block" }}>You save</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#1A56DB" }}>{INR(savings)}</span>
              </div>
            )}
          </div>
          
          {alert.alertActive && savings > 0 && (
            <div style={{ width: "100%", height: 6, background: "#E2E8F0", borderRadius: 3, overflow: "hidden", marginTop: 6 }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "#10B981", borderRadius: 3 }} />
              <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 4 }}>{progress.toFixed(0)}% to target</p>
            </div>
          )}
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center", flexShrink: 0 }}>
          <button 
            onClick={() => onEdit(alert)} 
            style={{ 
              padding: "8px 20px", 
              background: "#EFF6FF", 
              border: "1px solid #DBEAFE", 
              borderRadius: 10, 
              fontSize: 12, 
              fontWeight: 600, 
              color: "#1A56DB", 
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#DBEAFE")}
            onMouseLeave={e => (e.currentTarget.style.background = "#EFF6FF")}
          >
            ✏️ Edit Target
          </button>
          <button 
            onClick={() => onToggle(alert._id)} 
            disabled={toggling}
            style={{ 
              padding: "8px 20px", 
              background: alert.alertActive ? "#FEF3C7" : "#EFF6FF", 
              border: "1px solid", 
              borderColor: alert.alertActive ? "#FDE68A" : "#DBEAFE", 
              borderRadius: 10, 
              fontSize: 12, 
              fontWeight: 600, 
              color: alert.alertActive ? "#D97706" : "#1A56DB", 
              cursor: toggling ? "not-allowed" : "pointer",
              opacity: toggling ? 0.6 : 1,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => {
              if (!toggling) {
                e.currentTarget.style.background = alert.alertActive ? "#FDE68A" : "#DBEAFE";
              }
            }}
            onMouseLeave={e => {
              if (!toggling) {
                e.currentTarget.style.background = alert.alertActive ? "#FEF3C7" : "#EFF6FF";
              }
            }}
          >
            {toggling ? "⏳" : (alert.alertActive ? "⏸ Pause" : "▶ Resume")}
          </button>
          <button 
            onClick={() => onDelete(alert._id)} 
            style={{ 
              padding: "8px 20px", 
              background: "#FEF2F2", 
              border: "1px solid #FEE2E2", 
              borderRadius: 10, 
              fontSize: 12, 
              fontWeight: 600, 
              color: "#EF4444", 
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#FEE2E2")}
            onMouseLeave={e => (e.currentTarget.style.background = "#FEF2F2")}
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryCard({ item }) {
  const [imgErr, setImgErr] = useState(false);
  const isReached = item.status === "reached" || item.completed;
  
  return (
    <div style={{ background: "white", borderRadius: 12, padding: 14, border: "1px solid #E2E8F0", marginBottom: 10, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      {/* Image - FIXED */}
      <div style={{ width: 50, height: 50, background: "#F8FAFC", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {item.productImage && !imgErr ? (
          <img 
            src={item.productImage} 
            onError={() => setImgErr(true)} 
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }} 
          />
        ) : (
          <span style={{ fontSize: 24 }}>{isReached ? "✅" : "❌"}</span>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>{item.productName}</p>
        <p style={{ fontSize: 11, color: "#94A3B8" }}>{new Date(item.completedAt || item.updatedAt).toLocaleDateString()}</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: isReached ? "#10B981" : "#EF4444" }}>
          {isReached ? `Reached at ${INR(item.finalPrice || item.currentPrice)}` : "Cancelled"}
        </p>
        <p style={{ fontSize: 11, color: "#94A3B8" }}>Target: {INR(item.targetPrice)}</p>
      </div>
    </div>
  );
}
function EditTargetModal({ alert, onClose, onSave }) {
  const [target, setTarget] = useState(alert?.targetPrice || "");
  const current = alert?.currentPrice || 0;
  const targetNum = parseInt(target);
  const isValid = targetNum > 0 && targetNum < current;
  const savings = isValid ? current - targetNum : 0;
  
  const handleSave = () => {
    if (isValid) {
      onSave(alert._id, targetNum);
      onClose();
    }
  };
  
  if (!alert) {
    console.log('EditTargetModal: No alert data');
    return null;
  }
  
  console.log('EditTargetModal: alert data', alert);
  
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: 20, padding: 24, width: "90%", maxWidth: 400, borderTop: "4px solid #1A56DB" }} onClick={e => e.stopPropagation()}>
        <p style={{ fontSize: 20, fontWeight: 700, color: "#1E3A5F", marginBottom: 8 }}>Edit Target Price</p>
        <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20 }}>Current price: <strong style={{ color: "#EF4444" }}>{INR(current)}</strong></p>
        
        <input
          type="number"
          value={target}
          onChange={e => setTarget(e.target.value)}
          placeholder="Enter target price"
          style={{ 
            width: "100%", 
            padding: 14, 
            border: "1.5px solid #E2E8F0", 
            borderRadius: 12, 
            fontSize: 18, 
            fontWeight: 700, 
            marginBottom: 12, 
            textAlign: "center",
            color: "#1E293B",
            background: "white",
          }}
        />
        
        {target && !isValid && (
          <p style={{ fontSize: 12, color: "#EF4444", textAlign: "center", marginBottom: 16 }}>Target must be less than current price</p>
        )}
        
        {isValid && (
          <div style={{ background: "#EFF6FF", padding: 12, borderRadius: 10, textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "#1A56DB" }}>You'll save {INR(savings)} when price drops to {INR(targetNum)}</p>
          </div>
        )}
        
        <div style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={onClose} 
            style={{ 
              flex: 1, 
              padding: "12px 0", 
              background: "#F1F5F9", 
              border: "1px solid #E2E8F0", 
              borderRadius: 12, 
              cursor: "pointer", 
              fontWeight: 600, 
              fontSize: 14,
              color: "#1c1e20"
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={!isValid} 
            style={{ 
              flex: 1, 
              padding: "12px 0", 
              background: isValid ? "#1A56DB" : "#CBD5E1", 
              color: "white", 
              border: "none", 
              borderRadius: 12, 
              cursor: isValid ? "pointer" : "not-allowed", 
              fontWeight: 600, 
              fontSize: 14 
            }}
          >
            Save Target
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [filter, setFilter] = useState("all");
  const [editingAlert, setEditingAlert] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Check if logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError(true);
      setLoading(false);
    }
  }, []);

  // Fetch alerts and history
useEffect(() => {
  const fetchAlerts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching alerts from backend...');
      
      // Fetch active alerts
      const res = await fetch(`${API_BASE}/api/alerts`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      
      console.log('Alerts response:', data);
      
      if (data.success) {
        setAlerts(data.data || []);
        console.log('Alerts loaded:', data.data.length);
      } else {
        console.log('No alerts or error:', data.message);
      }

      // Fetch history (completed alerts)
      try {
        const historyRes = await fetch(`${API_BASE}/api/alerts/history`, {
          headers: getAuthHeaders()
        });
        const historyData = await historyRes.json();
        
        if (historyData.success) {
          setHistory(historyData.data?.total || []);
          console.log('History loaded:', historyData.data?.total?.length || 0);
        }
      } catch (historyErr) {
        console.log('History fetch error:', historyErr);
      }
    } catch (error) {
      console.error('Fetch alerts error:', error);
      // Try localStorage fallback
      const localAlerts = JSON.parse(localStorage.getItem('dp_alerts') || '[]');
      if (localAlerts.length > 0) {
        setAlerts(localAlerts);
        console.log('Using localStorage alerts:', localAlerts.length);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchAlerts();
}, []);

  // Handle product click - searches fresh to get immersiveToken
  const handleProductClick = async (alert) => {
  try {
    // First search to get immersiveToken
    const res = await fetch(`${API_BASE}/api/products/search?q=${encodeURIComponent(alert.productName)}&limit=1`);
    const data = await res.json();
    
    if (data.success && data.data && data.data.length > 0) {
      const product = data.data[0];
      router.push(`/product?id=${product.id}&token=${encodeURIComponent(product.immersiveToken || '')}`);
    } else {
      // Fallback: use alert data
      router.push(`/product?id=${alert.productId}`);
    }
  } catch (error) {
    // Fallback: use alert data
    router.push(`/product?id=${alert.productId}`);
  }
};

  // Toggle alert (pause/resume)
  const toggleAlert = async (id) => {
    if (togglingId) return;
    setTogglingId(id);
    
    try {
      const res = await fetch(`${API_BASE}/api/alerts/${id}/toggle`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      
      if (data.success) {
        setAlerts(prev => prev.map(a => 
          a._id === id ? { ...a, alertActive: !a.alertActive } : a
        ));
      }
    } catch (error) {
      console.error('Toggle error:', error);
    } finally {
      setTogglingId(null);
    }
  };

  // Delete alert
  const deleteAlert = async (id) => {
    const alertToDelete = alerts.find(a => a._id === id);
    if (!confirm(`Delete alert for "${alertToDelete?.productName}"?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/alerts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      
      if (data.success) {
        setAlerts(prev => prev.filter(a => a._id !== id));
        // Move to history if it was active
        if (alertToDelete) {
          setHistory(prev => [{
            ...alertToDelete,
            completed: true,
            completedAt: new Date().toISOString(),
            status: 'cancelled'
          }, ...prev]);
        }
      }
    } catch (error) {
      console.error('Delete alert error:', error);
    }
  };

  // Update target price
  const updateTarget = async (id, newTarget) => {
    try {
      const res = await fetch(`${API_BASE}/api/alerts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ targetPrice: newTarget })
      });
      const data = await res.json();
      
      if (data.success) {
        setAlerts(prev => prev.map(a => 
          a._id === id ? { ...a, targetPrice: newTarget } : a
        ));
      }
    } catch (error) {
      console.error('Update target error:', error);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === "active") return a.alertActive;
    if (filter === "paused") return !a.alertActive;
    return true;
  }).filter(a => a.productName.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredHistory = history.filter(h => 
    h.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = alerts.filter(a => a.alertActive).length;

  // Show login prompt if not authenticated
  if (authError) {
    return (
      <div style={{ minHeight: "100vh", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "white", borderRadius: 20, padding: 40, textAlign: "center", maxWidth: 400 }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>🔒</span>
          <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 700, color: "#1E3A5F" }}>Sign in to view alerts</p>
          <p style={{ fontSize: 14, color: "#64748B", marginTop: 8, marginBottom: 24 }}>Price alerts are saved to your account</p>
          <button onClick={() => router.push('/')} style={{ padding: "10px 24px", background: "#1A56DB", color: "white", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .sora { font-family: 'Sora', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "#1E3A5F", boxShadow: "0 2px 20px rgba(15,30,50,.45)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px", height: 68, display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <img src="/logo.png" alt="DynaPrizes" style={{ height: 40, width: "auto", objectFit: "contain" }} />
          </a>
          
          <div style={{ flex: 1, display: "flex", background: "white", borderRadius: 11, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.15)" }}>
            <span style={{ paddingLeft: 14, display: "flex", alignItems: "center", color: "#94A3B8", fontSize: 16, flexShrink: 0 }}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search your alerts…"
              style={{ flex: 1, padding: "10px 12px", border: "none", outline: "none", fontSize: 14, color: "#1E293B", fontFamily: "'DM Sans',sans-serif" }}
            />
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
            {[
              { label: "Home", emoji: "🏠", href: "/" },
              { label: "Cart", emoji: "🛒", href: "/cart" },
              { label: "Alerts", emoji: "🔔", href: "/alerts" },
              { label: "Account", emoji: "👤", href: "/account" },
            ].map(t => (
              <a key={t.label} href={t.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 12px", borderRadius: 10, textDecoration: "none", color: "rgba(255,255,255,0.75)" }}>
                <span style={{ fontSize: 18 }}>{t.emoji}</span>
                <span style={{ fontSize: 9, fontWeight: 600 }}>{t.label}</span>
              </a>
            ))}
          </div>
        </div>
      </header>
      
      {/* Main */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 20px" }}>
        <h1 className="sora" style={{ fontSize: 28, fontWeight: 700, color: "#1E3A5F", marginBottom: 20 }}>Price Alerts</h1>
        
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #E2E8F0" }}>
          <button onClick={() => setActiveTab("active")} style={{ padding: "12px 20px", background: "none", border: "none", borderBottom: activeTab === "active" ? "2px solid #1A56DB" : "none", color: activeTab === "active" ? "#1A56DB" : "#64748B", fontWeight: 600, cursor: "pointer" }}>Active Alerts ({alerts.length})</button>
          <button onClick={() => setActiveTab("history")} style={{ padding: "12px 20px", background: "none", border: "none", borderBottom: activeTab === "history" ? "2px solid #1A56DB" : "none", color: activeTab === "history" ? "#1A56DB" : "#64748B", fontWeight: 600, cursor: "pointer" }}>History ({history.length})</button>
        </div>
        
        {activeTab === "active" && alerts.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <button onClick={() => setFilter("all")} style={{ padding: "6px 14px", borderRadius: 99, border: "1px solid", borderColor: filter === "all" ? "#1A56DB" : "#E2E8F0", background: filter === "all" ? "#1A56DB" : "white", color: filter === "all" ? "white" : "#64748B", fontSize: 12, cursor: "pointer" }}>All</button>
            <button onClick={() => setFilter("active")} style={{ padding: "6px 14px", borderRadius: 99, border: "1px solid", borderColor: filter === "active" ? "#1A56DB" : "#E2E8F0", background: filter === "active" ? "#1A56DB" : "white", color: filter === "active" ? "white" : "#64748B", fontSize: 12, cursor: "pointer" }}>Active ({activeCount})</button>
            <button onClick={() => setFilter("paused")} style={{ padding: "6px 14px", borderRadius: 99, border: "1px solid", borderColor: filter === "paused" ? "#1A56DB" : "#E2E8F0", background: filter === "paused" ? "#1A56DB" : "white", color: filter === "paused" ? "white" : "#64748B", fontSize: 12, cursor: "pointer" }}>Paused ({alerts.length - activeCount})</button>
          </div>
        )}
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ width: 40, height: 40, margin: "0 auto", border: "3px solid #E2E8F0", borderTopColor: "#1A56DB", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : activeTab === "active" ? (
          filteredAlerts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 20 }}>
              <span style={{ fontSize: 64, display: "block", marginBottom: 16 }}>🔕</span>
              <p className="sora" style={{ fontSize: 18, fontWeight: 700, color: "#1E3A5F", marginBottom: 8 }}>No price alerts yet</p>
              <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>Set alerts on product pages to get notified when prices drop</p>
              <button onClick={() => router.push("/")} style={{ padding: "10px 24px", background: "#1A56DB", color: "white", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>Start Shopping</button>
            </div>
          ) : (
            filteredAlerts.map(alert => (
  <AlertCard
    key={alert._id || alert.id}
    alert={alert}
    onToggle={toggleAlert}
    onDelete={() => deleteAlert(alert._id || alert.id)}
    onEdit={() => {
      console.log('Editing alert:', alert);
      setEditingAlert(alert);
    }}
    toggling={togglingId === (alert._id || alert.id)}
    onProductClick={handleProductClick}
  />
))
          )
        ) : (
          filteredHistory.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 20 }}>
              <span style={{ fontSize: 64, display: "block", marginBottom: 16 }}>📜</span>
              <p className="sora" style={{ fontSize: 18, fontWeight: 700, color: "#1E3A5F", marginBottom: 8 }}>No alert history</p>
              <p style={{ fontSize: 14, color: "#64748B" }}>Completed and removed alerts will appear here</p>
            </div>
          ) : (
            filteredHistory.map(item => <HistoryCard key={item._id || item.id} item={item} />)
          )
        )}
      </div>
      
      {editingAlert && (
  <EditTargetModal
    alert={editingAlert}
    onClose={() => {
      console.log('Closing edit modal');
      setEditingAlert(null);
    }}
    onSave={updateTarget}
  />
)}
    </div>
  );
}