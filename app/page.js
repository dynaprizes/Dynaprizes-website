"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthModal from '../components/AuthModal';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SCREENSHOTS = [
  { src: "/screenshots/home_screen.png",           emoji: "🏠", caption: "Home",    sub: "Smart Search",    bg: "#DBEAFE" },
  { src: "/screenshots/search_results.png",        emoji: "🔍", caption: "Search",  sub: "Find products",   bg: "#FEF3C7" },
  { src: "/screenshots/product_detail_screen.png", emoji: "🏷️", caption: "Product", sub: "Compare prices",  bg: "#D1FAE5" },
  { src: "/screenshots/alert_screen.png",          emoji: "🔔", caption: "Alerts",  sub: "Price drops",     bg: "#EDE9FE" },
  { src: "/screenshots/cart_screen.png",           emoji: "🛒", caption: "Cart",    sub: "Smart cart",      bg: "#FCE7F3" },
  { src: "/screenshots/account_screen.png",        emoji: "👤", caption: "Account", sub: "Your profile",    bg: "#FFEDD5" },
];

const FEATURES = [
  {
    emoji: "🏷️",
    title: "Price Comparison",
    desc: "Compare across 100+ stores instantly",
    detail: "See prices from Amazon, Meesho, Nykaa & more — side by side, updated in real time.",
    accent: "#2563EB", bg: "#EFF6FF", tagColor: "#1D4ED8",
  },
  {
    emoji: "🔔",
    title: "Price Alerts",
    desc: "Get notified on every price drop",
    detail: "Set your target price. We ping you the moment it drops — never miss a deal again.",
    accent: "#D97706", bg: "#FFFBEB", tagColor: "#B45309",
  },
  {
    emoji: "🛒",
    title: "Smart Cart",
    desc: "Save items, buy from the best store",
    detail: "Add once. We split across stores to get you the absolute lowest total bill.",
    accent: "#059669", bg: "#ECFDF5", tagColor: "#047857",
  },
];

const STORES = [
  { name: "Amazon",          emoji: "🛍️" },
  { name: "Meesho",          emoji: "🛒" },
  { name: "Nykaa",           emoji: "🍊" },
  { name: "Snapdeal",        emoji: "🔵" },
  { name: "JioMart",         emoji: "📦" },
  { name: "Croma",           emoji: "🏪" },
  { name: "Tata CLiQ",       emoji: "⚡" },
  { name: "Vijay Sales",     emoji: "🏬" },
  { name: "Reliance Digital",emoji: "💡" },
  { name: "BigBasket",       emoji: "🟢" },
  { name: "AJIO",            emoji: "👟" },
  { name: "Purplle",         emoji: "💜" },
  { name: "Decathlon",       emoji: "🏋️" },
  { name: "Boat Lifestyle",  emoji: "🎧" },
];

const HOW_IT_WORKS = [
  { emoji: "🔍", title: "Search Any Product",  desc: "Type the product name. We pull live prices from 10+ stores in seconds." },
  { emoji: "📊", title: "Compare & Decide",    desc: "See all prices side-by-side with ratings, offers, and delivery info." },
  { emoji: "💰", title: "Buy at Best Price",   desc: "Tap Buy Now on the cheapest store. Save money on every single purchase." },
];

const STATS = [
  { val: "100+",  label: "Stores compared" },
  { val: "₹0",   label: "Cost to use" },
  { val: "24/7", label: "Price monitoring" },
  { val: "∞",    label: "Savings possible" },
];

// ─── API Base ─────────────────────────────────────────────────────────────────
const API_BASE = "https://dynaprizes-backend.onrender.com";

const INR = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN");

// ─── Components ───────────────────────────────────────────────────────────────

function PlayStoreBadge({ size = "md" }) {
  const styles = {
    sm: { padding: "8px 16px",  gap: 8,  fontSize: 14 },
    md: { padding: "10px 20px", gap: 10, fontSize: 15 },
    lg: { padding: "12px 24px", gap: 12, fontSize: 17 },
  };
  const iconW = size === "sm" ? 22 : size === "lg" ? 30 : 26;
  const topSz = size === "sm" ? 8 : 9;

  return (
    <a
      href="#"
      style={{
        display: "inline-flex", alignItems: "center",
        background: "#0a0a0a", color: "white",
        borderRadius: 12, border: "1px solid #2a2a2a",
        textDecoration: "none", transition: "background 0.2s",
        ...styles[size],
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "#1a1a1a")}
      onMouseLeave={e => (e.currentTarget.style.background = "#0a0a0a")}
    >
      <svg width={iconW} height={iconW} viewBox="0 0 24 24" fill="none">
        <path d="M3.18 23.76a2.1 2.1 0 0 1-1.06-1.87V2.1C2.12 1.4 2.5.84 3.18.24L13.6 12 3.18 23.76z" fill="#4FC3F7" />
        <path d="M17.35 15.85 5.3 22.7l-.04.02 8.28-10.72 3.81 3.85z" fill="#4CAF50" />
        <path d="M21.13 10.22c.56.32.87.86.87 1.78s-.31 1.46-.87 1.78l-3.78 2.07-4.1-4.14 4.1-4.14 3.78 2.65z" fill="#FFD54F" />
        <path d="M5.26 1.28 17.35 8.15l-3.81 3.85L5.26 1.3z" fill="#F44336" />
      </svg>
      <div>
        <p style={{ fontSize: topSz, color: "#888", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>GET IT ON</p>
        <p style={{ fontSize: styles[size].fontSize, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>Google Play</p>
      </div>
    </a>
  );
}

// ─── Screenshot card — raw image, no phone frame ──────────────────────────────
function ScreenshotCard({ item, index }) {
  return (
    <div style={{ flexShrink: 0, scrollSnapAlign: "center" }}>
      <div
        style={{
          width: 200,
          height: 'auto',
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 12px 36px rgba(0,0,0,0.15)",
        }}
      >
        <img
          src={item.src}
          alt={item.caption}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={(e) => {
            const el = e.currentTarget;
            el.style.display = "none";
            const parent = el.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                  gap:14px;padding:24px;text-align:center;height:100%;width:100%;background:${item.bg}">
                  <div style="font-size:52px;line-height:1">${item.emoji}</div>
                  <div>
                    <p style="font-size:13px;font-weight:700;color:#1E3A5F;margin:0 0 4px;font-family:'Sora',sans-serif">${item.caption}</p>
                    <p style="font-size:11px;color:#64748B;margin:0">${item.sub}</p>
                  </div>
                  <div style="width:36px;height:3px;background:#2563EB;border-radius:99px;opacity:0.4"></div>
                </div>`;
            }
          }}
        />
      </div>
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: "#1E3A5F", margin: "0 0 2px" }}>
          {item.caption}
        </p>
        <p style={{ fontSize: 11, color: "#64748B", margin: 0 }}>{item.sub}</p>
      </div>
    </div>
  );
}

// ─── Recently Viewed Product Card ─────────────────────────────────────────────
// ─── Recently Viewed Product Card ─────────────────────────────────────────────
function RecentlyViewedCard({ product, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  
  const productId = product?.productId || product?.id || '';
  const productTitle = product?.title || product?.name || 'Product';
  const productPrice = product?.price || 0;
  const productOriginalPrice = product?.originalPrice || 0;
  const productImage = product?.image || '';
  const productToken = product?.immersiveToken || '';
  
  const discount = productOriginalPrice > productPrice && productPrice > 0
    ? Math.round((1 - productPrice / productOriginalPrice) * 100) 
    : 0;

  const handleClick = () => {
    // Pass all product data to parent
    onClick({
      id: productId,
      productId: productId,
      immersiveToken: productToken,
      title: productTitle,
      price: productPrice,
      originalPrice: productOriginalPrice,
      image: productImage
    });
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        cursor: "pointer",
        transition: "all 0.2s",
        border: "1px solid #F1F5F9",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(30,58,95,0.12)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
    >
      <div style={{
        height: 140,
        background: "#F8FAFC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexShrink: 0,
      }}>
        {productImage && !imgErr ? (
          <img
            src={productImage}
            alt={productTitle}
            onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12 }}
          />
        ) : (
          <span style={{ fontSize: 44 }}>🛍️</span>
        )}
        {discount > 0 && (
          <div style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "#EF4444",
            color: "white",
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 99,
          }}>
            {discount}% OFF
          </div>
        )}
      </div>
      <div style={{ padding: "10px 12px 14px" }}>
        <p style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#1E293B",
          lineHeight: 1.4,
          marginBottom: 6,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: 34,
        }}>
          {productTitle}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#1A56DB", fontFamily: "'Sora',sans-serif" }}>
            {INR(productPrice)}
          </span>
          {productOriginalPrice > productPrice && (
            <span style={{ fontSize: 11, color: "#94A3B8", textDecoration: "line-through" }}>
              {INR(productOriginalPrice)}
            </span>
          )}
        </div>
        <div style={{
          padding: "6px 0",
          textAlign: "center",
          background: "#EFF6FF",
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 600,
          color: "#1A56DB",
          fontFamily: "'Sora', sans-serif",
        }}>
          View Details →
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const router   = useRouter();
  const [query, setQuery] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);
  
  // Recently viewed state
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [recentlyViewedLoading, setRecentlyViewedLoading] = useState(true);

  // ========== ADD THESE 3 LINES BELOW ==========
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [hasEverLoggedIn, setHasEverLoggedIn] = useState(false);
  // =============================================

  // ─── FETCH RECENTLY VIEWED ──────────────────────────────────────────────────
const fetchRecentlyViewed = useCallback(async () => {
  try {
    console.log('🟢 Fetching recently viewed...');
    
    // ✅ First check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    // ✅ If token exists but user not restored yet, wait
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // ✅ Set user first
        setUser(prevUser => {
          if (prevUser?.email !== parsedUser?.email) {
            console.log('🟢 User restored from localStorage:', parsedUser.name);
            return parsedUser;
          }
          return prevUser;
        });
      } catch (e) {
        console.log('Error parsing user data');
      }
    }
    
    // If NOT logged in - use localStorage only
    if (!token) {
      const cached = localStorage.getItem('recentlyViewed');
      if (cached) {
        try {
          const localData = JSON.parse(cached);
          if (Array.isArray(localData) && localData.length > 0) {
            setRecentlyViewed(localData.slice(0, 30));
          }
        } catch (e) {
          console.log('Error parsing localStorage:', e);
        }
      }
      setRecentlyViewedLoading(false);
      return;
    }

    // LOGGED IN - fetch from backend
    try {
      const res = await fetch(`${API_BASE}/api/user/recently-viewed`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('🟢 Backend response:', data);
        
        if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
          setRecentlyViewed(data.data.slice(0, 30));
          localStorage.setItem('recentlyViewed', JSON.stringify(data.data));
          setRecentlyViewedLoading(false);
          return;
        }
      }
    } catch (apiError) {
      console.log('Backend fetch failed:', apiError);
    }
    
    // ✅ Show empty for logged-in users with no backend data
    setRecentlyViewed([]);
    setRecentlyViewedLoading(false);
    
  } catch (error) {
    console.error('Error loading recently viewed:', error);
    setRecentlyViewed([]);
  } finally {
    setRecentlyViewedLoading(false);
  }
}, []);

// ─── FETCH ON MOUNT ─────────────────────────────────────────────────────────
useEffect(() => {
  fetchRecentlyViewed();
}, [fetchRecentlyViewed]);

  useEffect(() => {
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const everLoggedIn = localStorage.getItem('hasEverLoggedIn') === 'true';
    
    setHasEverLoggedIn(everLoggedIn);
    
    // ✅ Only set user if token AND userData exist
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // ✅ Only update if user is different
        setUser(prevUser => {
          if (prevUser?.email !== parsedUser?.email) {
            console.log('🟢 User restored from localStorage:', parsedUser.name);
            return parsedUser;
          }
          return prevUser;
        });
      } catch (e) {
        console.log('Error parsing user data');
        // ✅ Don't set to null - keep previous user
      }
    }
    // ✅ REMOVED: else { setUser(null) } - this was causing the logout issue
  };
  
  checkAuth();
  
  // Also check when page becomes visible again
  const handleVisibilityChange = () => {
    checkAuth();
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, []);

  const handleSearch = () => {
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleProductClick = async (product) => {
  const productId = product?.id || product?.productId || '';
  const token = product?.immersiveToken || '';
  
  console.log('Product clicked:', { productId, token, title: product?.title });
  
  if (!productId) {
    console.warn('No product ID found');
    return;
  }
  
  // If we have token, use it directly
  if (token) {
    router.push(`/product?id=${productId}&token=${encodeURIComponent(token)}`);
    return;
  }
  
  // Otherwise search to get token
  try {
    const searchQuery = product?.title || product?.name || '';
    if (!searchQuery) {
      router.push(`/product?id=${productId}`);
      return;
    }
    
    const res = await fetch(`${API_BASE}/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=1`);
    const data = await res.json();
    if (data.success && data.data && data.data.length > 0) {
      const p = data.data[0];
      router.push(`/product?id=${p.id}&token=${encodeURIComponent(p.immersiveToken || '')}`);
    } else {
      router.push(`/product?id=${productId}`);
    }
  } catch (error) {
    console.error('Search error:', error);
    router.push(`/product?id=${productId}`);
  }
};

// ─── SCROLL TO SLIDE ──────────────────────────────────────────────────────────
const scrollTo = (idx) => {
  const el = scrollRef.current;
  if (!el) return;
  const CARD_W = 200;
  const CARD_GAP = 20;
  const clamped = Math.max(0, Math.min(idx, SCREENSHOTS.length - 1));
  el.scrollTo({ left: clamped * (CARD_W + CARD_GAP), behavior: "smooth" });
  setActiveSlide(clamped);
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: #F1F5F9; color: #1E293B; }

        .sora { font-family: 'Sora', sans-serif; }

        /* ── Scrollbar hide ── */
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* ── Animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .a1 { animation: fadeUp 0.5s ease 0.05s both; }
        .a2 { animation: fadeUp 0.5s ease 0.18s both; }
        .a3 { animation: fadeUp 0.5s ease 0.30s both; }
        .a4 { animation: fadeUp 0.5s ease 0.42s both; }

        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .pulse { animation: pulse 2s ease-in-out infinite; }

        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float { animation: float 3s ease-in-out infinite; }

        /* ── Dot texture ── */
        .dot-pattern {
          background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        /* ── Shared section layout ── */
        .section-inner { max-width: 1080px; margin: 0 auto; padding: 0 20px; }

        .section-label {
          display: inline-block; font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 99px;
          background: #EFF6FF; color: #2563EB; border: 1px solid #DBEAFE;
          margin-bottom: 14px;
        }

        .section-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(1.55rem, 3.5vw, 2.2rem);
          font-weight: 700; color: #1E3A5F; line-height: 1.15; margin-bottom: 10px;
        }

        .section-sub { font-size: 15px; color: #64748B; line-height: 1.65; max-width: 440px; }

        /* ── Wave divider ── */
        .wave { display: block; width: 100%; margin-bottom: -2px; }

        /* ── Search bar ── */
        .input-bar {
          display: flex; align-items: center; background: white;
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 16px 48px rgba(0,0,0,0.22);
          outline: 2px solid rgba(245,158,11,0.45);
        }
        input[type="text"] {
          flex: 1; padding: 15px 12px; font-size: 15px; color: #1E293B;
          outline: none; border: none; background: transparent;
          font-family: 'DM Sans', sans-serif; min-width: 0;
        }
        input[type="text"]::placeholder { color: #94A3B8; }
        .search-btn {
          margin: 6px; padding: 11px 20px; background: #2563EB; color: white;
          border: none; border-radius: 11px; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: 'Sora', sans-serif; white-space: nowrap;
          transition: background 0.2s;
        }
        .search-btn:hover { background: #1D4ED8; }
        .search-btn:active { transform: scale(0.97); }

        /* ── Carousel arrow buttons ── */
        .arrow-btn {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1.5px solid #CBD5E1; background: white;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 18px; transition: all 0.2s; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .arrow-btn:hover { background: #1E3A5F; border-color: #1E3A5F; color: white; }
        .arrow-btn:disabled { opacity: 0.3; cursor: not-allowed; pointer-events: none; }

        /* ── Feature cards ── */
        .feature-card {
          border-radius: 20px; padding: 28px; border: 1px solid transparent;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); }

        /* ── Store pills ── */
        .store-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 15px; border-radius: 99px; background: white;
          border: 1px solid #E2E8F0; font-size: 13px; font-weight: 500; color: #334155;
          transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .store-pill:hover {
          border-color: rgba(37,99,235,0.4); color: #1E3A5F;
          box-shadow: 0 4px 12px rgba(37,99,235,0.1); transform: translateY(-1px);
        }

        /* ── Nav link ── */
        .nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 14px; border-radius: 12px;
          font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.8);
          text-decoration: none; transition: all 0.15s; white-space: nowrap;
        }
        .nav-link:hover { background: rgba(255,255,255,0.13); color: white; }
        .nav-link .nav-emoji { font-size: 20px; }

        /* ── Notification bell ── */
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

        /* ── Responsive: mobile nav collapses to icons only ── */
        @media (max-width: 600px) {
          .nav-label { display: none; }
          .nav-link  { padding: 10px 10px; }
          .header-inner { gap: 8px; }
        }

        /* ── Hero responsive ── */
        @media (max-width: 640px) {
          .stats-row { flex-wrap: wrap; }
          .stat-item { min-width: 50%; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); }
        }

        /* ── Download banner responsive ── */
        @media (max-width: 700px) {
          .banner-inner { flex-direction: column; align-items: flex-start; gap: 32px; }
          .banner-right { width: 100%; justify-content: center; }
        }

        /* ── Feature grid responsive ── */
        @media (max-width: 700px) {
          .feature-grid { grid-template-columns: 1fr !important; }
        }

        /* ── How-it-works responsive ── */
        @media (max-width: 700px) {
          .hiw-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .hiw-connector { display: none !important; }
        }

        /* ── Footer grid responsive ── */
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }

        /* ── General section padding ── */
        @media (max-width: 640px) {
          .section-pad { padding: 48px 0 !important; }
        }

        /* ── Recently Viewed Grid ── */
        .recently-viewed-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .recently-viewed-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        @media (max-width: 480px) {
          .recently-viewed-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F1F5F9" }}>

        {/* ════════════════════════════════════════════════
            HEADER
        ════════════════════════════════════════════════ */}
        <header style={{
  position: "sticky", top: 0, zIndex: 50,
  background: "#1E3A5F",
  boxShadow: "0 2px 24px rgba(15,30,50,0.4)",
}}>
  <div
    className="header-inner"
    style={{
      maxWidth: 1080, margin: "0 auto", padding: "0 20px",
      height: 68, display: "flex", alignItems: "center",
      justifyContent: "space-between", gap: 16,
    }}
  >
    {/* ── Logo (left) ── */}
    <a href="/" style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
      <img 
        src="/logo.png" 
        alt="DynaPrizes" 
        style={{ width: 44, height: 44, objectFit: 'contain' }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) {
            const div = document.createElement('div');
            div.innerHTML = 'D';
            div.style.cssText = 'width:44px;height:44px;background:#F59E0B;border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:Sora,sans-serif;font-weight:800;font-size:22px;color:#1E3A5F';
            parent.insertBefore(div, e.currentTarget);
          }
        }}
      />
      <span style={{
        fontFamily: "'Sora',sans-serif", fontWeight: 800,
        fontSize: 22, letterSpacing: "-0.02em",
      }}>
        <span style={{ color: "#FFFFFF" }}>Dyna</span>
        <span style={{ color: "#F59E0B" }}>Prizes</span>
      </span>
    </a>

    {/* ── Right side: notification bell + nav tabs + SIGN IN ── */}
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>

      {/* Notification bell */}
      <Link href="/notifications" className="notif-btn" aria-label="Notifications">
        🔔
        <span className="notif-dot pulse" />
      </Link>

      {/* Nav tabs */}
      {[
        { label: "Home",    emoji: "🏠", href: "/" },
        { label: "Alerts",  emoji: "🔔", href: "/alerts" },
        { label: "Cart",    emoji: "🛒", href: "/cart" },
      ].map(tab => (
        <Link key={tab.label} href={tab.href} className="nav-link">
          <span className="nav-emoji">{tab.emoji}</span>
          <span className="nav-label">{tab.label}</span>
        </Link>
      ))}

      {/* SIGN IN / ACCOUNT BUTTON */}
      {user ? (
        <Link href="/account" className="nav-link">
          <span className="nav-emoji">👤</span>
          <span className="nav-label">Account</span>
        </Link>
      ) : (
        <button
          onClick={() => setShowAuthModal(true)}
          style={{
            padding: "8px 16px",
            background: "#F59E0B",
            borderRadius: "8px",
            color: "#1E3A5F",
            border: "none",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
            fontFamily: "'Sora', sans-serif",
          }}
        >
          Sign In
        </button>
      )}
    </div>
  </div>
</header>

{/* AUTH MODAL */}
<AuthModal 
  isOpen={showAuthModal} 
  onClose={() => setShowAuthModal(false)} 
  onSuccess={(userData) => {
    setUser(userData.user);
    setShowAuthModal(false);
    localStorage.setItem('hasEverLoggedIn', 'true');
    setHasEverLoggedIn(true);
    
    // ✅ Force refresh recently viewed after login
    setTimeout(() => {
      fetchRecentlyViewed();
    }, 500);
  }} 
/>

        {/* ════════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════════ */}
        <section style={{
          background: "linear-gradient(145deg, #1E3A5F 0%, #162d4e 60%, #0f1f36 100%)",
          padding: "72px 0 0", position: "relative", overflow: "hidden",
        }}>
          <div className="dot-pattern" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: -100, right: -100, width: 450, height: 450, background: "radial-gradient(circle, rgba(37,99,235,0.22), transparent 65%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -40, width: 320, height: 320, background: "radial-gradient(circle, rgba(245,158,11,0.1), transparent 65%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px", position: "relative" }}>
            {/* Eyebrow */}
            <div className="a1" style={{ textAlign: "center", marginBottom: 20 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 18px", borderRadius: 99,
                background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.4)",
                color: "#93C5FD", fontSize: 12, fontWeight: 600,
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                🇮🇳 India's First Shopping Super-App
              </span>
            </div>

            {/* Headline */}
            <h1
              className="sora a2"
              style={{
                textAlign: "center", color: "white",
                fontSize: "clamp(2rem, 5.5vw, 4rem)",
                fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em",
                marginBottom: 20,
              }}
            >
              Compare Prices.<br />
              <span style={{ color: "#F59E0B" }}>Save Every Time.</span>
            </h1>

            {/* Subtext */}
            <p className="a3" style={{
              textAlign: "center", color: "rgba(186,213,255,0.82)",
              fontSize: 16, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 32px",
            }}>
              Search once. See prices from Amazon, Meesho, Nykaa & 100+ more stores.
              Buy at the lowest price — always.
            </p>

            {/* Search bar */}
            <div className="a4" style={{ maxWidth: 680, margin: "0 auto 28px" }}>
              <div className="input-bar">
                <span style={{ paddingLeft: 16, fontSize: 18, color: "#94A3B8", flexShrink: 0 }}>🔍</span>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  placeholder='Try "boAt Airdopes 141", "Samsung S25 Ultra"…'
                />
                <button className="search-btn" onClick={handleSearch}>Compare Prices</button>
              </div>

              {/* Trust pills */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 16 }}>
                {["🛍️ 100+ Stores", "⚡ Real-time prices", "🔔 Price Alerts", "🔒 Free forever"].map(b => (
                  <span key={b} style={{
                    fontSize: 12, padding: "4px 12px", borderRadius: 99,
                    color: "rgba(186,213,255,0.7)", background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div
              className="stats-row"
              style={{
                display: "flex", justifyContent: "center",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                maxWidth: 680, margin: "0 auto",
              }}
            >
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="stat-item"
                  style={{
                    flex: 1, textAlign: "center", padding: "20px 0",
                    borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  }}
                >
                  <p className="sora" style={{ fontSize: 24, fontWeight: 800, color: "#F59E0B", lineHeight: 1 }}>{s.val}</p>
                  <p style={{ fontSize: 11, color: "rgba(186,213,255,0.5)", marginTop: 4 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <svg className="wave" viewBox="0 0 1440 52" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,26 C360,52 720,0 1080,26 C1260,39 1380,20 1440,26 L1440,52 L0,52 Z" fill="#F1F5F9" />
          </svg>
        </section>

        {/* ════════════════════════════════════════════════
            RECENTLY VIEWED - Updated with real API data
        ════════════════════════════════════════════════ */}
        <section className="section-pad" style={{ padding: "56px 0 52px", background: "#F1F5F9" }}>
  <div className="section-inner">
    {/* Section header */}
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🕐</span>
        <h2 className="section-title" style={{ margin: 0 }}>Recently Viewed</h2>
      </div>
      <p className="section-sub" style={{ margin: 0 }}>Pick up where you left off</p>
    </div>

    {/* If user is NOT logged in - Show login prompt */}
    {!user && !hasEverLoggedIn ? (
  <div style={{ 
    textAlign: "center", 
    padding: "60px 20px", 
    background: "white", 
    borderRadius: 20,
    border: "1px solid #E2E8F0"
  }}>
    <span style={{ fontSize: 48 }}>🔒</span>
    <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 600, color: "#1E3A5F", marginTop: 16, marginBottom: 8 }}>
      Sign in to see your recently viewed products
    </p>
    <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>
      Track products you've viewed and get price alerts
    </p>
    <button
      onClick={() => setShowAuthModal(true)}
      style={{
        padding: "10px 24px",
        background: "#1A56DB",
        color: "white",
        border: "none",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Sign In
    </button>
  </div>
) : !user && hasEverLoggedIn ? (
  <div style={{ 
    textAlign: "center", 
    padding: "40px 20px", 
    background: "white", 
    borderRadius: 20,
    border: "1px solid #E2E8F0"
  }}>
    <span style={{ fontSize: 40 }}>👋</span>
    <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 600, color: "#1E3A5F", marginTop: 12, marginBottom: 6 }}>
      You're signed out
    </p>
    <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>
      Sign in to see your recently viewed products
    </p>
    <button
      onClick={() => setShowAuthModal(true)}
      style={{
        padding: "8px 20px",
        background: "#1A56DB",
        color: "white",
        border: "none",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Sign In
    </button>
  </div>
) : recentlyViewedLoading ? (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ width: 40, height: 40, margin: "0 auto", border: "3px solid #E2E8F0", borderTopColor: "#1A56DB", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ marginTop: 12, fontSize: 13, color: "#64748B" }}>Loading your history...</p>
      </div>
    ) : recentlyViewed.length === 0 ? (
      <div style={{ textAlign: "center", padding: "40px 20px", background: "white", borderRadius: 20 }}>
        <span style={{ fontSize: 48 }}>👀</span>
        <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 600, color: "#1E3A5F", marginTop: 12, marginBottom: 6 }}>
          No recently viewed products
        </p>
        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>
          Start exploring products and they'll appear here
        </p>
        <button
          onClick={() => router.push('/search')}
          style={{
            padding: "8px 20px",
            background: "#1A56DB",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Start Shopping →
        </button>
      </div>
    ) : (
      <div className="recently-viewed-grid">
        {recentlyViewed.slice(0, 30).map((product, idx) => (
  <RecentlyViewedCard 
    key={product.id || product.productId || idx} 
    product={product} 
    onClick={handleProductClick}
  />
))}
      </div>
    )}
  </div>
</section>

        {/* ════════════════════════════════════════════════
            APP PREVIEW — 6 raw screenshots, no phone frame
        ════════════════════════════════════════════════ */}
        <section className="section-pad" style={{ padding: "56px 0 52px", background: "#F1F5F9" }}>
          <div className="section-inner">
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <span className="section-label">App Preview</span>
              <h2 className="section-title">See DynaPrizes in Action</h2>
              <p className="section-sub" style={{ margin: "8px auto 0" }}>
                Real screens from the Android app — launching on Play Store soon.
              </p>
            </div>

            {/* Carousel row: arrows + scrollable strip */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button
                className="arrow-btn"
                onClick={() => scrollTo(activeSlide - 1)}
                disabled={activeSlide === 0}
                aria-label="Previous"
              >←</button>

              <div
  ref={scrollRef}
  className="hide-scroll"
  style={{
    display: "flex",
    gap: 20,
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    flex: 1,
    padding: "8px 0 16px",
  }}
  onScroll={e => {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollLeft / (200 + 20));
    setActiveSlide(idx);
  }}
>
                {SCREENSHOTS.map((s, i) => (
                  <ScreenshotCard key={s.src} item={s} index={i} />
                ))}
              </div>

              <button
                className="arrow-btn"
                onClick={() => scrollTo(activeSlide + 1)}
                disabled={activeSlide === SCREENSHOTS.length - 1}
                aria-label="Next"
              >→</button>
            </div>

            {/* Dot indicators */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 18 }}>
              {SCREENSHOTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  style={{
                    width: i === activeSlide ? 28 : 8, height: 8, borderRadius: 99,
                    background: i === activeSlide ? "#1E3A5F" : "#CBD5E1",
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "all 0.3s",
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
        

        {/* ════════════════════════════════════════════════
            DOWNLOAD BANNER
        ════════════════════════════════════════════════ */}
        <section style={{ padding: 0, background: "#F1F5F9" }}>
          <div style={{
            background: "linear-gradient(135deg, #1E3A5F 0%, #162d4e 100%)",
            position: "relative", overflow: "hidden",
          }}>
            <div className="dot-pattern" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, background: "radial-gradient(circle, rgba(37,99,235,0.15), transparent 65%)", pointerEvents: "none" }} />

            <div className="section-inner" style={{ padding: "52px 20px" }}>
              <div
                className="banner-inner"
                style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 40, justifyContent: "space-between" }}
              >
                {/* Text side */}
                <div style={{ flex: "1 1 320px" }}>
                  <span style={{
                    display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
                    textTransform: "uppercase", padding: "4px 12px", borderRadius: 99,
                    background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
                    color: "#FCD34D", marginBottom: 14,
                  }}>📱 Android App</span>

                  <h2 className="sora" style={{
                    fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)", fontWeight: 700,
                    color: "white", lineHeight: 1.2, marginBottom: 14,
                  }}>
                    Download from{" "}
                    <span style={{ color: "#F59E0B" }}>Play Store</span>
                  </h2>

                  <p style={{ color: "rgba(186,213,255,0.75)", fontSize: 15, lineHeight: 1.65, marginBottom: 28, maxWidth: 440 }}>
                    DynaPrizes is built, tested, and ready. Play Store submission is in progress.
                    Tap the badge to download the moment we go live.
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
                    <PlayStoreBadge size="lg" />
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(148,187,255,0.6)", fontSize: 13 }}>
                      <span
                        className="pulse"
                        style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", display: "inline-block", flexShrink: 0 }}
                      />
                      Submission in progress
                    </div>
                  </div>
                </div>

                {/* Right: floating phone + stats */}
                <div
                  className="banner-right"
                  style={{ display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}
                >
                  <div className="float" style={{ position: "relative" }}>
                    <img 
                      src="/phone-mockup.png" 
                      alt="DynaPrizes App"
                      style={{ 
                        width: 110, 
                        height: 200, 
                        objectFit: 'contain',
                        filter: 'brightness(1.2) contrast(1.1)'
                      }}
                    />
                    <div className="pulse" style={{
                      position: "absolute", top: -10, right: -14,
                      background: "#F59E0B", color: "#1E3A5F",
                      fontSize: 8, fontWeight: 800, padding: "4px 9px", borderRadius: 99,
                      fontFamily: "'Sora',sans-serif", letterSpacing: "0.05em",
                      boxShadow: "0 4px 12px rgba(245,158,11,0.4)",
                    }}>SOON</div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[{ val: "10+", label: "Stores" }, { val: "₹0", label: "Cost" }, { val: "∞", label: "Savings" }].map(s => (
                      <div key={s.label} style={{
                        background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 14, padding: "12px 20px", textAlign: "center",
                      }}>
                        <p className="sora" style={{ fontSize: 22, fontWeight: 800, color: "#F59E0B", lineHeight: 1 }}>{s.val}</p>
                        <p style={{ fontSize: 10, color: "rgba(186,213,255,0.5)", marginTop: 3 }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <svg className="wave" viewBox="0 0 1440 52" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,26 C360,52 720,0 1080,26 C1260,39 1380,20 1440,26 L1440,52 L0,52 Z" fill="#F1F5F9" />
            </svg>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            FEATURES
        ════════════════════════════════════════════════ */}
        <section className="section-pad" style={{ padding: "56px 0", background: "#F1F5F9" }}>
          <div className="section-inner">
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <span className="section-label">Why DynaPrizes?</span>
              <h2 className="section-title">Shop Smarter, Not Harder</h2>
              <p className="section-sub" style={{ margin: "0 auto" }}>
                Three powerful features that put you in control of every purchase.
              </p>
            </div>

            <div
              className="feature-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}
            >
              {FEATURES.map(f => (
                <div key={f.title} className="feature-card" style={{ background: f.bg }}>
                  <div style={{
                    width: 52, height: 52, background: "white", borderRadius: 14,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, marginBottom: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  }}>{f.emoji}</div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em",
                    color: f.tagColor, background: "rgba(255,255,255,0.6)", padding: "3px 10px", borderRadius: 99,
                  }}>{f.desc}</span>
                  <h3 className="sora" style={{ fontSize: 18, fontWeight: 700, color: "#1E3A5F", margin: "12px 0 8px" }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65 }}>{f.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            HOW IT WORKS
        ════════════════════════════════════════════════ */}
        <section className="section-pad" style={{ padding: "56px 0", background: "white", borderTop: "1px solid #E2E8F0" }}>
          <div className="section-inner">
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span className="section-label" style={{ background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0" }}>
                Simple as 1-2-3
              </span>
              <h2 className="section-title">How It Works</h2>
            </div>

            <div
              className="hiw-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, position: "relative" }}
            >
              {/* Connector line */}
              <div
                className="hiw-connector"
                style={{
                  position: "absolute", top: 38,
                  left: "calc(16.67% + 20px)", right: "calc(16.67% + 20px)",
                  height: 1,
                  background: "linear-gradient(to right, #DBEAFE, rgba(37,99,235,0.4), #DBEAFE)",
                }}
              />

              {HOW_IT_WORKS.map((item, i) => (
                <div key={item.title} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <div style={{ position: "relative", marginBottom: 20, zIndex: 1 }}>
                    <div style={{
                      width: 76, height: 76, borderRadius: "50%", background: "#1E3A5F",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 30, boxShadow: "0 8px 24px rgba(30,58,95,0.22)",
                    }}>{item.emoji}</div>
                    <div style={{
                      position: "absolute", top: -4, right: -4,
                      width: 24, height: 24, borderRadius: "50%", background: "#F59E0B",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800, color: "#1E3A5F",
                      fontFamily: "'Sora',sans-serif", boxShadow: "0 2px 8px rgba(245,158,11,0.4)",
                    }}>{i + 1}</div>
                  </div>
                  <h3 className="sora" style={{ fontSize: 16, fontWeight: 700, color: "#1E3A5F", marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65, maxWidth: 210 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            SUPPORTED STORES
        ════════════════════════════════════════════════ */}
        <section className="section-pad" style={{ padding: "48px 0", background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
          <div className="section-inner">
            <p style={{
              textAlign: "center", fontSize: 11, fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.1em",
              color: "#94A3B8", marginBottom: 24,
            }}>We compare prices across all major Indian stores</p>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
              {STORES.map(store => (
                <span key={store.name} className="store-pill">
                  <span style={{ fontSize: 15 }}>{store.emoji}</span>
                  {store.name}
                </span>
              ))}
              <span className="store-pill" style={{ fontStyle: "italic", color: "#94A3B8", background: "#F8FAFC" }}>
                + more added regularly
              </span>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            CTA STRIP
        ════════════════════════════════════════════════ */}
        <section style={{ padding: "44px 0", background: "#1E3A5F" }}>
          <div className="section-inner" style={{ textAlign: "center" }}>
            <h2 className="sora" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "white", marginBottom: 8 }}>
              Ready to stop overpaying?
            </h2>
            <p style={{ color: "rgba(186,213,255,0.7)", fontSize: 15, marginBottom: 24 }}>
              DynaPrizes launches soon. Download from Play Store.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
              <PlayStoreBadge size="md" />
              <div style={{
                display: "flex", alignItems: "center",
                padding: "10px 20px", background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12,
                color: "rgba(186,213,255,0.7)", fontSize: 14, gap: 8,
              }}>
                <span>📧</span> support@dynaprizes.com
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════ */}
        <footer style={{ background: "#0f1e35", color: "white", padding: "48px 0 24px" }}>
          <div className="section-inner">
            <div
              className="footer-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 40 }}
            >
              {/* Brand */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <img 
                    src="/logo.png" 
                    alt="DynaPrizes" 
                    style={{ width: 44, height: 44, objectFit: 'contain' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const div = document.createElement('div');
                        div.innerHTML = 'D';
                        div.style.cssText = 'width:44px;height:44px;background:#F59E0B;border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:Sora,sans-serif;font-weight:800;font-size:22px;color:#1E3A5F';
                        parent.insertBefore(div, e.currentTarget);
                      }
                    }}
                  />
                  <span className="sora" style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>
                    <span style={{ color: "#fff" }}>Dyna</span>
                    <span style={{ color: "#F59E0B" }}>Prizes</span>
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(186,213,255,0.55)", lineHeight: 1.65, marginBottom: 18, maxWidth: 220 }}>
                  India's First Shopping Super-App. Compare prices across 100+ stores.
                </p>
                <PlayStoreBadge size="sm" />
              </div>

              {/* Company */}
              <div>
  <h4 className="sora" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(186,213,255,0.4)", marginBottom: 14 }}>
    Company
  </h4>
  <ul style={{ listStyle: "none" }}>
    <li style={{ marginBottom: 10 }}>
      <Link href="/privacy-policy" style={{ fontSize: 13, color: "rgba(186,213,255,0.65)", textDecoration: "none", transition: "color 0.15s" }}>
        Privacy Policy
      </Link>
    </li>
    <li style={{ marginBottom: 10 }}>
      <Link href="/terms" style={{ fontSize: 13, color: "rgba(186,213,255,0.65)", textDecoration: "none", transition: "color 0.15s" }}>
        Terms of Service
      </Link>
    </li>
    <li style={{ marginBottom: 10 }}>
      <Link href="/cookies" style={{ fontSize: 13, color: "rgba(186,213,255,0.65)", textDecoration: "none", transition: "color 0.15s" }}>
        Cookie Policy
      </Link>
    </li>
  </ul>
</div>

              {/* Contact */}
              <div>
                <h4 className="sora" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(186,213,255,0.4)", marginBottom: 14 }}>
                  Contact
                </h4>
                <a
                  href="mailto:support@dynaprizes.com"
                  style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(186,213,255,0.65)", textDecoration: "none", marginBottom: 6, transition: "color 0.15s" }}
                  onMouseEnter={e => ((e.currentTarget).style.color = "#F59E0B")}
                  onMouseLeave={e => ((e.currentTarget).style.color = "rgba(186,213,255,0.65)")}
                >
                  📧 support@dynaprizes.com
                </a>
                <p style={{ fontSize: 11, color: "rgba(186,213,255,0.35)", marginBottom: 18 }}>
                  Response within 24 hours
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ l: "𝕏", t: "Twitter" }, { l: "f", t: "Facebook" }, { l: "▶", t: "YouTube" }].map(s => (
                    <a
                      key={s.t}
                      href="#"
                      title={s.t}
                      style={{
                        width: 32, height: 32, borderRadius: 9,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 700,
                        background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(186,213,255,0.6)", textDecoration: "none", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget).style.background = "rgba(37,99,235,0.4)";
                        (e.currentTarget).style.color = "white";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget).style.background = "rgba(255,255,255,0.07)";
                        (e.currentTarget).style.color = "rgba(186,213,255,0.6)";
                      }}
                    >{s.l}</a>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              display: "flex", flexWrap: "wrap", justifyContent: "space-between",
              alignItems: "center", gap: 8, paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,0.07)",
              fontSize: 12, color: "rgba(186,213,255,0.3)",
            }}>
              <span>© {new Date().getFullYear()} DynaPrizes. All rights reserved.</span>
              <span>Made with ❤️ in India 🇮🇳</span>
            </div>
          </div>
        </footer>

      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}