"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const API_BASE = "https://dynaprizes-backend.onrender.com";
const INR = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN");

const PRICE_RANGES = [
  { label: "Under ₹5,000",      min: 0,     max: 5000    },
  { label: "₹5,000 – ₹10,000", min: 5000,  max: 10000   },
  { label: "₹10,000 – ₹20,000",min: 10000, max: 20000   },
  { label: "₹20,000 – ₹50,000",min: 20000, max: 50000   },
  { label: "Above ₹50,000",     min: 50000, max: Infinity },
];

const SORT_OPTIONS = [
  { value: "relevance",   label: "Relevance"          },
  { value: "price_asc",   label: "Price: Low to High" },
  { value: "price_desc",  label: "Price: High to Low" },
  { value: "rating",      label: "Highest Rated"      },
  { value: "discount",    label: "Best Discount"      },
];

const STORE_COLORS = {
  Amazon:"#FF9900", Flipkart:"#1A56DB", Myntra:"#FF3F6C",
  AJIO:"#111827", Meesho:"#9B2335", Nykaa:"#FC2779",
  Croma:"#0075C9", "Tata CLiQ":"#571C8D",
};

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ p, grid, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  const storeColor = STORE_COLORS[p.source] || "#1A56DB";

  if (!grid) {
    // List view
    return (
      <div
        onClick={onClick}
        style={{
  background: "white",
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,.06)",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  transition: "all .2s",
  border: "1px solid #E2E8F0",
}}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(30,58,95,.1)"; e.currentTarget.style.transform = "translateX(2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.06)"; e.currentTarget.style.transform = "none"; }}
      >
        <div style={{
  aspectRatio: "1/1",
  background: "#F8FAFC",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  flexShrink: 0,
  overflow: "hidden",
}}>
 {p.image && !imgErr
  ? <img src={p.image} alt={p.title} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
  : <span style={{ fontSize: 52 }}>🛍️</span>}
  {p.discount > 0 && (
    <div style={{ position: "absolute", top: 10, left: 10, background: "#EF4444", color: "white", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 99, lineHeight: 1.4 }}>
      {p.discount}% OFF
    </div>
  )}
</div>
        <div style={{ flex: 1, padding: "14px 16px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", lineHeight: 1.4, marginBottom: 6 }}>{p.title}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: `${storeColor}18`, color: storeColor }}>{p.source}</span>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#F59E0B" }}>{"★".repeat(Math.round(p.rating || 4))}</span>
              <span style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>{Number(p.rating || 4).toFixed(1)}</span>
              {p.reviewCount > 0 && <span style={{ fontSize: 11, color: "#94A3B8" }}>({p.reviewCount.toLocaleString()})</span>}
            </div>
            <p style={{ fontSize: 20, fontWeight: 800, color: "#1A56DB", fontFamily: "'Sora',sans-serif", lineHeight: 1 }}>{INR(p.price)}</p>
            {p.originalPrice > p.price && (
              <p style={{ fontSize: 12, color: "#94A3B8", textDecoration: "line-through", marginTop: 2 }}>{INR(p.originalPrice)}</p>
            )}
            <button
              onClick={e => { e.stopPropagation(); onClick(); }}
              style={{ marginTop: 10, padding: "8px 20px", background: "#1A56DB", color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}
            >View Details</button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={onClick}
      style={{
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,.06)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        transition: "all .2s",
        border: "1px solid #E2E8F0",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(30,58,95,.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.06)"; }}
    >
      <div style={{
  height: 160,
  background: "#F8FAFC",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  flexShrink: 0,
  overflow: "hidden",
}}>
  {p.image && !imgErr
    ? <img src={p.image} alt={p.title} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    : <span style={{ fontSize: 52 }}>🛍️</span>}
  {p.discount > 0 && (
    <div style={{ position: "absolute", top: 10, left: 10, background: "#EF4444", color: "white", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 99, lineHeight: 1.4 }}>
      {p.discount}% OFF
    </div>
  )}
</div>
      <div style={{ padding: "12px 14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "#1E293B", lineHeight: 1.45, marginBottom: 8, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.title}</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#1A56DB", fontFamily: "'Sora',sans-serif" }}>{INR(p.price)}</span>
          {p.originalPrice > p.price && <span style={{ fontSize: 12, color: "#94A3B8", textDecoration: "line-through" }}>{INR(p.originalPrice)}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "#F59E0B" }}>★</span>
          <span style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>{Number(p.rating || 4).toFixed(1)}</span>
          {p.reviewCount > 0 && <span style={{ fontSize: 11, color: "#94A3B8" }}>({p.reviewCount > 999 ? (p.reviewCount/1000).toFixed(1)+"k" : p.reviewCount})</span>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: `${storeColor}18`, color: storeColor, flexShrink: 0 }}>{p.source}</span>
          <button
            onClick={e => { e.stopPropagation(); onClick(); }}
            style={{ flex: 1, maxWidth: 110, padding: "8px 0", background: "#1A56DB", color: "white", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}
          >View Details</button>
        </div>
      </div>
    </div>
  );
}

// ─── FILTER PANEL ─────────────────────────────────────────────────────────────
// Now applies directly to filters state (live filtering), no local "Apply" buffer.
function FilterPanel({ filters, setFilters, onClose }) {

  const togglePriceRange = (range) => {
    if (filters.priceRange?.label === range.label) {
      setFilters({ ...filters, priceRange: null });
    } else {
      setFilters({ ...filters, priceRange: range });
    }
  };

  const toggleRating = (rating) => {
    if (filters.rating === rating) {
      setFilters({ ...filters, rating: null });
    } else {
      setFilters({ ...filters, rating: rating });
    }
  };

  const toggleDiscount = (discount) => {
    if (filters.discount === discount) {
      setFilters({ ...filters, discount: null });
    } else {
      setFilters({ ...filters, discount: discount });
    }
  };

  const clearAll = () => {
    setFilters({ priceRange: null, rating: null, discount: null });
    if (onClose) onClose();
  };

  const activeCount = (filters.priceRange ? 1 : 0) + (filters.rating ? 1 : 0) + (filters.discount ? 1 : 0);

  const Chip = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      style={{
        padding: "7px 14px",
        borderRadius: 99,
        fontSize: 13,
        fontWeight: 500,
        border: `1.5px solid ${active ? "#1A56DB" : "#E2E8F0"}`,
        background: active ? "#1A56DB" : "white",
        color: active ? "white" : "#334155",
        cursor: "pointer",
        transition: "all .15s",
        whiteSpace: "nowrap",
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 17, color: "#1E3A5F" }}>
          Filters {activeCount > 0 && <span style={{ background: "#1A56DB", color: "white", fontSize: 11, padding: "1px 7px", borderRadius: 99, marginLeft: 6 }}>{activeCount}</span>}
        </p>
        {activeCount > 0 && (
          <button onClick={clearAll} style={{ background: "none", border: "none", color: "#EF4444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Clear all
          </button>
        )}
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Price Range</p>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {PRICE_RANGES.map(r => (
            <Chip key={r.label} label={r.label} active={filters.priceRange?.label === r.label} onClick={() => togglePriceRange(r)} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Minimum Rating</p>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {[4, 3, 2, 1].map(r => (
            <Chip key={r} label={`${r}★ & above`} active={filters.rating === r} onClick={() => toggleRating(r)} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Minimum Discount</p>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {[10, 20, 30, 40, 50].map(d => (
            <Chip key={d} label={`${d}% & above`} active={filters.discount === d} onClick={() => toggleDiscount(d)} />
          ))}
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          style={{ width: "100%", padding: "13px 0", background: "#1A56DB", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif", marginTop: 8 }}
        >
          Done
        </button>
      )}
    </div>
  );
}

// ─── SKELETON CARD ────────────────────────────────────────────────────────────
function SkeletonCard({ grid }) {
  return (
    <div style={{
      background: "white",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,.06)",
      border: "1px solid #E2E8F0",
    }}>
      <div style={{ height: grid ? 160 : 120, background: "#F1F5F9", animation: "shimmer .8s ease-in-out infinite" }} />
      <div style={{ padding: 14, display: "flex", flexDirection: grid ? "column" : "row", gap: 8 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ height: 12, background: "#F1F5F9", borderRadius: 6, animation: "shimmer .8s infinite" }} />
          <div style={{ height: 12, background: "#F1F5F9", borderRadius: 6, width: "70%", animation: "shimmer .8s infinite" }} />
          <div style={{ height: 16, background: "#F1F5F9", borderRadius: 6, width: "50%", animation: "shimmer .8s infinite" }} />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
function SearchContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const initQ        = searchParams.get("q") || "";

  const [query,      setQuery]      = useState(initQ);
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [sort,       setSort]       = useState("relevance");
  const [gridView,   setGridView]   = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filters,    setFilters]    = useState({ priceRange: null, rating: null, discount: null });

  // Fetch products
  const fetchProducts = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setProducts([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/products/search?q=${encodeURIComponent(searchQuery.trim())}&limit=50`);
      
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      
      const data = await res.json();
      console.log('Search response:', data);
      
      if (data.success && data.data) {
        setProducts(data.data);
        setError(null);
      } else {
        setProducts([]);
        setError(data.message || 'No results found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initQ) fetchProducts(initQ);
  }, [initQ, fetchProducts]);

  const doSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
    fetchProducts(query.trim());
  };

  // Filter and sort products
  const filtered = products.filter(p => {
    if (filters.priceRange) {
      const r = filters.priceRange;
      if (p.price < r.min || p.price > r.max) return false;
    }
    if (filters.rating && (p.rating || 0) < filters.rating) return false;
    if (filters.discount && (p.discount || 0) < filters.discount) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sort === "discount") return (b.discount || 0) - (a.discount || 0);
    return 0;
  });

  const activeFilters = (filters.priceRange ? 1 : 0) + (filters.rating ? 1 : 0) + (filters.discount ? 1 : 0);

  const goToProduct = (p) => {
    router.push(`/product?id=${p.id}&token=${encodeURIComponent(p.immersiveToken || "")}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .sora { font-family:'Sora',sans-serif; }
        .filter-backdrop { position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:998;display:flex;align-items:flex-end;justify-content:center; }
        .filter-sheet { background:white;border-radius:20px 20px 0 0;padding:24px;width:100%;max-width:520px;max-height:85vh;overflow-y:auto;animation:slideUp .25s ease; }
        .nav-link { display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 12px;border-radius:10px;text-decoration:none;color:rgba(255,255,255,.72);transition:all .15s; }
        .nav-link:hover { background:rgba(255,255,255,.12);color:white; }
        .nav-link .em { font-size:20px;line-height:1; }
        .nav-link .lb { font-size:10px;font-weight:600; }
        @media(max-width:640px) { .nav-link .lb { display:none; } .nav-link { padding:7px 9px; } }
        @media(min-width:1024px) { .show-desktop { display:block!important; } }
        .hide-desktop { display:flex!important; }
        @media(min-width:1024px) { .hide-desktop { display:none!important; } }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "#1E3A5F", boxShadow: "0 2px 20px rgba(15,30,50,.45)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px", height: 68, display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <img src="/logo.png" alt="DynaPrizes" style={{ height: 40, width: "auto", objectFit: "contain" }} />
          </a>
          <div style={{ flex: 1, display: "flex", background: "white", borderRadius: 11, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.15)" }}>
            <span style={{ paddingLeft: 14, display: "flex", alignItems: "center", color: "#94A3B8", fontSize: 16, flexShrink: 0 }}>🔍</span>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && doSearch()} placeholder="Search products, brands…" style={{ flex: 1, padding: "10px 12px", border: "none", outline: "none", fontSize: 14, color: "#1E293B", fontFamily: "'DM Sans',sans-serif" }} />
            <button onClick={doSearch} style={{ margin: 5, padding: "9px 18px", background: "#2563EB", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif", whiteSpace: "nowrap" }}>Search</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
            <Link href="/notifications" style={{ position: "relative", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)", textDecoration: "none", marginRight: 4 }}>
              <span style={{ fontSize: 18 }}>🔔</span>
              <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, background: "#F59E0B", borderRadius: "50%", border: "1.5px solid #1E3A5F" }} />
            </Link>
            {[
              { label: "Home", emoji: "🏠", href: "/" },
              { label: "Cart", emoji: "🛒", href: "/cart" },
              { label: "Alerts", emoji: "🔔", href: "/alerts" },
              { label: "Account", emoji: "👤", href: "/account" },
            ].map(t => (
              <Link key={t.label} href={t.href} className="nav-link">
                <span className="em">{t.emoji}</span>
                <span className="lb">{t.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* BODY */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          {/* SIDEBAR FILTERS (DESKTOP) - live filtering, applies instantly */}
          <aside style={{ width: 260, flexShrink: 0, background: "white", borderRadius: 20, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,.06)", position: "sticky", top: 88 }}>
            <FilterPanel filters={filters} setFilters={setFilters} />
          </aside>

          {/* MAIN RESULTS */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setShowFilter(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "white", border: `1.5px solid ${activeFilters ? "#1A56DB" : "#E2E8F0"}`, borderRadius: 10, fontSize: 13, fontWeight: 600, color: activeFilters ? "#1A56DB" : "#334155", cursor: "pointer" }}>
                  🎚️ Filters {activeFilters > 0 && <span style={{ background: "#1A56DB", color: "white", fontSize: 10, padding: "1px 6px", borderRadius: 99 }}>{activeFilters}</span>}
                </button>
                <p style={{ fontSize: 14, color: "#64748B" }}>
                  {loading ? "Searching…" : <><strong style={{ color: "#1E3A5F" }}>{sorted.length}</strong> result{sorted.length !== 1 ? "s" : ""}{query ? ` for "${query}"` : ""}</>}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 13, color: "#1E293B", background: "white", cursor: "pointer", outline: "none" }}>
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div style={{ display: "flex", background: "white", border: "1.5px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
                  {[{ icon: "⊞", val: true }, { icon: "☰", val: false }].map(({ icon, val }) => (
                    <button key={String(val)} onClick={() => setGridView(val)} style={{ width: 38, height: 38, border: "none", background: gridView === val ? "#1A56DB" : "transparent", color: gridView === val ? "white" : "#94A3B8", cursor: "pointer", fontSize: 16 }}>{icon}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile filter button */}
            <button onClick={() => setShowFilter(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "white", border: `1.5px solid ${activeFilters ? "#1A56DB" : "#E2E8F0"}`, borderRadius: 10, fontSize: 13, fontWeight: 600, color: activeFilters ? "#1A56DB" : "#334155", cursor: "pointer", marginBottom: 16, width: "100%" }} className="hide-desktop">
              🎚️ Filters {activeFilters > 0 && <span style={{ background: "#1A56DB", color: "white", fontSize: 10, padding: "1px 6px", borderRadius: 99 }}>{activeFilters}</span>}
              <span style={{ marginLeft: "auto", color: "#94A3B8", fontSize: 12 }}>Tap to filter ›</span>
            </button>

            {/* Error State */}
            {error && (
              <div style={{ textAlign: "center", padding: "40px 20px", background: "white", borderRadius: 16 }}>
                <span style={{ fontSize: 40, display: "block", marginBottom: 16 }}>⚠️</span>
                <p style={{ fontSize: 16, color: "#EF4444", fontWeight: 600 }}>{error}</p>
                <button 
                  onClick={() => fetchProducts(query)}
                  style={{ marginTop: 16, padding: "10px 24px", background: "#1A56DB", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Results grid */}
            {!error && loading ? (
              <div style={{ display: "grid", gridTemplateColumns: gridView ? "repeat(auto-fill,minmax(190px,1fr))" : "1fr", gap: 16 }}>
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} grid={gridView} />)}
              </div>
            ) : !error && sorted.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#64748B" }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🔍</div>
                <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 700, color: "#1E3A5F", marginBottom: 10 }}>No results for "{query}"</p>
                <p style={{ fontSize: 14, marginBottom: 24 }}>Try different keywords or remove some filters</p>
                {activeFilters > 0 && <button onClick={() => setFilters({ priceRange: null, rating: null, discount: null })} style={{ padding: "10px 24px", background: "#1A56DB", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Clear Filters</button>}
              </div>
            ) : !error && (
              <div style={{ display: "grid", gridTemplateColumns: gridView ? "repeat(auto-fill,minmax(190px,1fr))" : "1fr", gap: 16 }}>
                {sorted.map(p => (
                  <ProductCard key={p.id} p={p} grid={gridView} onClick={() => goToProduct(p)} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER SHEET */}
      {showFilter && (
        <div className="filter-backdrop" onClick={() => setShowFilter(false)}>
          <div className="filter-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, background: "#CBD5E1", borderRadius: 99, margin: "0 auto 20px" }} />
            <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setShowFilter(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F1F5F9" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #DBEAFE", borderTopColor: "#1A56DB", animation: "shimmer .8s linear infinite" }} />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}