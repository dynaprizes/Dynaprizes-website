"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "https://dynaprizes-backend.onrender.com";
const INR = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN");

// ─── CART ITEM COMPONENT ──────────────────────────────────────────────────────
function CartItem({ item, isSelected, onToggleSelect, onUpdateQuantity, onRemove, onBuy }) {
  const [imgErr, setImgErr] = useState(false);
  const savings = item.originalPrice - item.price;
  
  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) {
      return;
    }
    onBuy(item);
  };
  
  return (
    <div 
      style={{ background: "white", borderRadius: 16, padding: 16, border: "1px solid #E2E8F0", marginBottom: 12, transition: "all .2s", cursor: "pointer" }}
      onClick={handleCardClick}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        
        <div style={{ flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={() => onToggleSelect(item.id)}
            style={{ width: 20, height: 20, cursor: "pointer" }}
          />
        </div>
        
        <div 
          style={{ width: 80, height: 80, background: "#F8FAFC", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}
          onClick={() => onBuy(item)}
        >
          {item.image && !imgErr
            ? <img src={item.image} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }} />
            : <span style={{ fontSize: 36 }}>🛍️</span>
          }
        </div>
        
        <div 
          style={{ flex: 1, minWidth: 180, cursor: "pointer" }}
          onClick={() => onBuy(item)}
        >
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", marginBottom: 4 }}>{item.name}</p>
          {!item.inStock && <span style={{ fontSize: 11, padding: "2px 8px", background: "#FEF2F2", borderRadius: 99, color: "#EF4444", display: "inline-block", marginBottom: 8 }}>Out of Stock</span>}
          
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
            <div>
              <span style={{ fontSize: 11, color: "#94A3B8", display: "block" }}>Price</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#1A56DB" }}>{INR(item.price)}</span>
            </div>
            {savings > 0 && (
              <div>
                <span style={{ fontSize: 11, color: "#94A3B8", display: "block" }}>MRP</span>
                <span style={{ fontSize: 14, color: "#94A3B8", textDecoration: "line-through" }}>{INR(item.originalPrice)}</span>
              </div>
            )}
            <div>
              <span style={{ fontSize: 11, color: "#94A3B8", display: "block" }}>You save</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#10B981" }}>{INR(savings)}</span>
            </div>
          </div>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, justifyContent: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F8FAFC", padding: "6px 12px", borderRadius: 30 }}>
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateQuantity(item.id, item.quantity - 1); }} 
              disabled={item.quantity <= 1} 
              style={{ width: 36, height: 36, borderRadius: 20, background: "#334e72", border: "none", cursor: "pointer", fontSize: 20, fontWeight: "bold" }}
            >-</button>
            <span style={{ minWidth: 40, textAlign: "center", fontSize: 18, fontWeight: 700, color: "#1E293B" }}>{item.quantity}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateQuantity(item.id, item.quantity + 1); }} 
              style={{ width: 36, height: 36, borderRadius: 20, background: "#334e72", border: "none", cursor: "pointer", fontSize: 20, fontWeight: "bold" }}
            >+</button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button 
              onClick={(e) => { e.stopPropagation(); onBuy(item); }} 
              style={{ padding: "8px 20px", background: "#1A56DB", color: "white", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >Buy Now</button>
            <button 
              onClick={(e) => { e.stopPropagation(); onRemove(item.id); }} 
              style={{ padding: "8px 16px", background: "#FEF2F2", border: "none", borderRadius: 10, fontSize: 12, color: "#EF4444", fontWeight: 600, cursor: "pointer" }}
            >Remove</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CART PAGE ────────────────────────────────────────────────────────────────
export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  
  // ─── FETCH CART ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const localCart = JSON.parse(localStorage.getItem('dp_cart') || '[]');
        console.log('Local cart items:', localCart);
        
        const token = localStorage.getItem('token');
        
        if (!token) {
          setCart(localCart);
          setLoading(false);
          return;
        }
        
        const res = await fetch(`${API_BASE}/api/cart`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && data.data.items && data.data.items.length > 0) {
            setCart(data.data.items);
            localStorage.setItem('dp_cart', JSON.stringify(data.data.items));
          } else {
            setCart(localCart);
          }
        } else {
          setCart(localCart);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        const localCart = JSON.parse(localStorage.getItem('dp_cart') || '[]');
        setCart(localCart);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);
  
  // ─── UPDATE QUANTITY ────────────────────────────────────────────────────────
  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
        return;
      }
      
      const res = await fetch(`${API_BASE}/api/cart/item/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQty })
      });
      
      if (res.ok) {
        setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
        localStorage.setItem('dp_cart', JSON.stringify(cart.map(item => item.id === id ? { ...item, quantity: newQty } : item)));
      }
    } catch (error) {
      setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    }
  };
  
  // ─── REMOVE ITEM ────────────────────────────────────────────────────────────
  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_BASE}/api/cart/item/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      setCart(prev => prev.filter(item => item.id !== id));
      localStorage.setItem('dp_cart', JSON.stringify(cart.filter(item => item.id !== id)));
      
      setSelectedItems(prev => {
        const newSelected = { ...prev };
        delete newSelected[id];
        return newSelected;
      });
    } catch (error) {
      setCart(prev => prev.filter(item => item.id !== id));
      localStorage.setItem('dp_cart', JSON.stringify(cart.filter(item => item.id !== id)));
    }
  };
  
  // ─── TOGGLE SELECT ──────────────────────────────────────────────────────────
  const toggleSelect = (id) => {
    setSelectedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  // ─── TOGGLE SELECT ALL ──────────────────────────────────────────────────────
  const toggleSelectAll = () => {
    const allSelected = cart.length > 0 && cart.every(item => selectedItems[item.id]);
    if (allSelected) {
      setSelectedItems({});
    } else {
      const newSelected = {};
      cart.forEach(item => { newSelected[item.id] = true; });
      setSelectedItems(newSelected);
    }
  };
  
  // ─── BUY SELECTED ──────────────────────────────────────────────────────────
  const handleBuySelected = () => {
    const selectedIds = Object.keys(selectedItems).filter(id => selectedItems[id]);
    const selectedProducts = cart.filter(item => selectedIds.includes(item.id));
    
    if (selectedProducts.length === 0) {
      alert("Please select items to buy");
      return;
    }
    
    const firstItem = selectedProducts[0];
    router.push(`/product?id=${firstItem.productId || firstItem.id}`);
  };
  
  // ─── PRODUCT CLICK ──────────────────────────────────────────────────────────
  const handleProductClick = async (item) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/search?q=${encodeURIComponent(item.name)}&limit=1`);
      const data = await res.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const product = data.data[0];
        router.push(`/product?id=${product.id}&token=${encodeURIComponent(product.immersiveToken || '')}`);
      } else {
        router.push(`/product?id=${item.productId || item.id}`);
      }
    } catch (error) {
      router.push(`/product?id=${item.productId || item.id}`);
    }
  };
  
  const filteredCart = cart.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedCount = Object.values(selectedItems).filter(Boolean).length;
  const selectedTotal = cart
    .filter(item => selectedItems[item.id])
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .sora { font-family: 'Sora', sans-serif; }
        .nav-link { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 12px; border-radius: 10px; text-decoration: none; color: rgba(255,255,255,0.75); transition: all 0.15s; }
        .nav-link:hover { background: rgba(255,255,255,0.12); color: white; }
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
              placeholder="Search in cart…"
              style={{ flex: 1, padding: "10px 12px", border: "none", outline: "none", fontSize: 14, color: "#1E293B", fontFamily: "'DM Sans',sans-serif" }}
            />
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
            <a href="#" style={{ position: "relative", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)", textDecoration: "none", marginRight: 4 }}>
              <span style={{ fontSize: 18 }}>🔔</span>
              <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, background: "#F59E0B", borderRadius: "50%", border: "1.5px solid #1E3A5F" }} />
            </a>
            {[
              { label: "Home", emoji: "🏠", href: "/" },
              { label: "Cart", emoji: "🛒", href: "/cart" },
              { label: "Alerts", emoji: "🔔", href: "/alerts" },
              { label: "Account", emoji: "👤", href: "/account" },
            ].map(t => (
              <a key={t.label} href={t.href} className="nav-link">
                <span style={{ fontSize: 18 }}>{t.emoji}</span>
                <span style={{ fontSize: 9, fontWeight: 600 }}>{t.label}</span>
              </a>
            ))}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 20px" }}>
        <h1 className="sora" style={{ fontSize: 28, fontWeight: 700, color: "#1E3A5F", marginBottom: 8 }}>My Cart</h1>
        <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20 }}>{totalItems} {totalItems === 1 ? "item" : "items"}</p>
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ width: 40, height: 40, margin: "0 auto", border: "3px solid #E2E8F0", borderTopColor: "#1A56DB", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : cart.length === 0 || filteredCart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 20 }}>
            <span style={{ fontSize: 64, display: "block", marginBottom: 16 }}>🛒</span>
            <p className="sora" style={{ fontSize: 18, fontWeight: 700, color: "#1E3A5F", marginBottom: 8 }}>Your cart is empty</p>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>Add items from the home screen to get started</p>
            <button onClick={() => router.push("/")} style={{ padding: "10px 24px", background: "#1A56DB", color: "white", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>Start Shopping</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, background: "white", padding: "12px 16px", borderRadius: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={cart.length > 0 && cart.every(item => selectedItems[item.id])} onChange={toggleSelectAll} style={{ width: 18, height: 18, cursor: "pointer" }} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>Select All Items</span>
              </label>
              <span style={{ fontSize: 13, color: "#64748B" }}>{selectedCount} selected</span>
            </div>
            
            {/* Cart Items */}
{filteredCart.map((item, index) => (
  <CartItem
    key={item.id || `cart-${index}`}
    item={item}
    isSelected={selectedItems[item.id] || false}
    onToggleSelect={toggleSelect}
    onUpdateQuantity={updateQuantity}
    onRemove={removeItem}
    onBuy={() => handleProductClick(item)}
  />
))}
            
            {selectedCount > 0 && (
              <div style={{ position: "sticky", bottom: 20, marginTop: 20, background: "white", borderRadius: 16, padding: "16px 20px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 12, color: "#64748B" }}>Total for {selectedCount} selected {selectedCount === 1 ? "item" : "items"}</p>
                  <p className="sora" style={{ fontSize: 22, fontWeight: 800, color: "#1A56DB" }}>{INR(selectedTotal)}</p>
                </div>
                <button onClick={handleBuySelected} style={{ padding: "12px 32px", background: "#1A56DB", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  Buy Selected ({selectedCount})
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}