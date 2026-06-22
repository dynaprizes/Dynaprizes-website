"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE = "https://dynaprizes-backend.onrender.com";
const AMZ_TAG = "dynaprizesind-21";
const INR = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN");

const STORE_CFG = {
  Amazon: { color: "#FF9900", bg: "#FFF8EE" },
  Flipkart: { color: "#1A56DB", bg: "#EBF0FF" },
  Myntra: { color: "#FF3F6C", bg: "#FFF0F4" },
  AJIO: { color: "#111827", bg: "#F3F4F6" },
  Meesho: { color: "#9B2335", bg: "#FFF1F2" },
  Nykaa: { color: "#FC2779", bg: "#FFF0F6" },
  Croma: { color: "#0075C9", bg: "#EEF7FF" },
  "Tata CLiQ": { color: "#571C8D", bg: "#F5EEFF" },
  "Vijay Sales": { color: "#E31E24", bg: "#FFF0F0" },
  "Reliance Digital": { color: "#1D3D87", bg: "#EEF1FF" },
  Snapdeal: { color: "#FF6C2F", bg: "#FFF2EB" },
  JioMart: { color: "#008000", bg: "#EEF5EE" },
  Decathlon: { color: "#0055A2", bg: "#EAF3FF" },
  Boat: { color: "#00B4D8", bg: "#E6F7FB" },
  FirstCry: { color: "#E84C88", bg: "#FFF0F5" },
  Purplle: { color: "#9B59B6", bg: "#F4ECF9" },
  BigBasket: { color: "#6AB04C", bg: "#F0F9E8" },
};

const storeStyle = (name) => STORE_CFG[name] || { color: "#1E3A5F", bg: "#EBF0FF" };

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK = {
  id: "mock-001",
  title: "Apple iPhone 15 (128GB) — Black | 6.1-inch Super Retina XDR, Dynamic Island, 48MP Camera",
  rating: 4.2,
  reviewCount: 1234,
  discount: 12,
  images: [
    "https://images.unsplash.com/photo-1696446701796-da61c5c69e26?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
  ],
  highlights: [
    "6.1-inch Super Retina XDR display with Dynamic Island",
    "A16 Bionic chip — fastest smartphone chip",
    "48MP Main camera with next-generation portraits",
    "USB-C connector for universal connectivity",
    "Emergency SOS via satellite",
    "Crash Detection technology",
  ],
  retailers: [
    { name: "Amazon", price: 69999, delivery: 0, deliveryLabel: "Free delivery", url: `https://www.amazon.in/dp/B0CHX1W1XY?tag=${AMZ_TAG}`, inStock: true },
    { name: "Flipkart", price: 71499, delivery: 0, deliveryLabel: "Free delivery", url: "https://www.flipkart.com/apple-iphone-15", inStock: true },
    { name: "Croma", price: 72990, delivery: 99, deliveryLabel: "₹99 delivery", url: "https://www.croma.com/apple-iphone-15", inStock: true },
    { name: "Vijay Sales", price: 73500, delivery: 0, deliveryLabel: "Free delivery", url: "https://www.vijaysales.com/apple-iphone-15", inStock: false },
    { name: "Tata CLiQ", price: 70999, delivery: 49, deliveryLabel: "₹49 delivery", url: "https://www.tatacliq.com/apple-iphone-15", inStock: true },
    { name: "Reliance Digital", price: 74999, delivery: 0, deliveryLabel: "Free delivery", url: "https://www.reliancedigital.in/apple-iphone-15", inStock: true },
  ],
  specifications: {
    Brand: "Apple",
    Model: "iPhone 15",
    Storage: "128 GB",
    RAM: "6 GB",
    Display: "6.1-inch OLED",
    Processor: "A16 Bionic",
    Camera: "48MP + 12MP dual",
    Battery: "3279 mAh",
    OS: "iOS 17",
    SIM: "Dual SIM (nano + eSIM)",
    Warranty: "1 Year (manufacturer)",
    Color: "Black",
    Weight: "171 g",
    Charging: "USB-C 20W",
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function totalPrice(r) {
  if (!r) return 0;
  return (r.price || 0) + (r.delivery || 0);
}

function sortedRetailers(retailers) {
  if (!retailers || retailers.length === 0) return [];
  return [...retailers].sort((a, b) => totalPrice(a) - totalPrice(b));
}

function buildUrl(r) {
  if (r.name === "Amazon" && !r.url.includes("tag=")) {
    return r.url + (r.url.includes("?") ? "&" : "?") + "tag=" + AMZ_TAG;
  }
  return r.url;
}

// ─── SKELETON ────────────────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 16, r = 8, style = {} }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: "#F1F5F9", animation: "shimmer 1.5s ease-in-out infinite", ...style }} />;
}

function PageSkeleton() {
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 20px" }}>
      <Skeleton h={36} r={10} style={{ marginBottom: 12 }} />
      <Skeleton w="60%" h={20} r={8} style={{ marginBottom: 24 }} />
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <Skeleton w={360} h={360} r={16} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 240 }}>
          {[1, 2, 3, 4].map(i => <Skeleton key={i} h={60} r={12} style={{ marginBottom: 12 }} />)}
        </div>
      </div>
    </div>
  );
}

// ─── STAR RATING ─────────────────────────────────────────────────────────────
function Stars({ rating, size = 16 }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= Math.round(rating) ? "#F59E0B" : "#E2E8F0", lineHeight: 1 }}>★</span>
      ))}
    </span>
  );
}

// ─── FULLSCREEN IMAGE MODAL ───────────────────────────────────────────────
function FullscreenImageModal({ images, activeIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const [imgErr, setImgErr] = useState({});

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.95)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          border: "none",
          color: "white",
          fontSize: 24,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1001,
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
      >
        ✕
      </button>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prevImage(); }}
          style={{
            position: "absolute",
            left: 20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "white",
            fontSize: 28,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
        >
          ←
        </button>
      )}

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); nextImage(); }}
          style={{
            position: "absolute",
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "white",
            fontSize: 28,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
        >
          →
        </button>
      )}

      <div
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {images[currentIndex] && !imgErr[currentIndex] ? (
          <img
            src={images[currentIndex]}
            alt="Fullscreen view"
            onError={() => setImgErr(prev => ({ ...prev, [currentIndex]: true }))}
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
          />
        ) : (
          <span style={{ fontSize: 100 }}>🛍️</span>
        )}
      </div>

      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.6)",
            color: "white",
            padding: "6px 12px",
            borderRadius: 20,
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 10,
            padding: "10px",
            overflowX: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: 60,
                height: 60,
                flexShrink: 0,
                border: `2px solid ${currentIndex === idx ? "#F59E0B" : "rgba(255,255,255,0.3)"}`,
                borderRadius: 8,
                background: "#1E293B",
                overflow: "hidden",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <img
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── IMAGE CAROUSEL ───────────────────────────────────────────────────────────
function ImageCarousel({ images, title }) {
  const [active, setActive] = useState(0);
  const [imgErr, setImgErr] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          width: "100%",
          aspectRatio: "5/5",
          height: 380,
          background: "#F8FAFC",
          borderRadius: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          border: "1px solid #F1F5F9",
          boxShadow: "0 4px 20px rgba(0,0,0,.07)",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => setModalOpen(true)}
      >
        {images[active] && !imgErr[active] ? (
          <img
            src={images[active]}
            alt={title}
            onError={() => setImgErr(p => ({ ...p, [active]: true }))}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <span style={{ fontSize: 72 }}>🛍️</span>
        )}
      </div>

      {images.length > 1 && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto", justifyContent: "center" }}>
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: 72,
                height: 72,
                flexShrink: 0,
                border: `2px solid ${active === i ? "#1A56DB" : "#E2E8F0"}`,
                borderRadius: 10,
                background: "#F8FAFC",
                overflow: "hidden",
                cursor: "pointer",
                padding: 0,
                transition: "border-color .15s",
              }}
            >
              {src && !imgErr[i] ? (
                <img
                  src={src}
                  alt={`View ${i + 1}`}
                  onError={() => setImgErr(p => ({ ...p, [i]: true }))}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  style={{
                    fontSize: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  🛍️
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {modalOpen && (
        <FullscreenImageModal
          images={images}
          activeIndex={active}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

// ─── RETAILER CARD ───────────────────────────────────────────────────────────
function RetailerCard({ r, isBest, isSelected, onSelect }) {
  const cfg = storeStyle(r.name);
  const total = totalPrice(r);

  return (
    <div
      onClick={() => onSelect(r)}
      style={{
        border: `2px solid ${isSelected ? cfg.color : isBest ? "#10B981" : "#E2E8F0"}`,
        borderRadius: 16, overflow: "hidden", cursor: r.inStock ? "pointer" : "default",
        transition: "all .2s", opacity: r.inStock ? 1 : 0.6,
        background: isSelected ? cfg.bg : "white",
        boxShadow: isSelected ? `0 4px 16px ${cfg.color}22` : "0 1px 4px rgba(0,0,0,.05)",
      }}
    >
      {isBest && (
        <div style={{ background: "#10B981", padding: "5px 14px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12 }}>🏷️</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: "white", fontFamily: "'Sora',sans-serif" }}>Best Price — Lowest Total</span>
        </div>
      )}

      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 44, height: 44, background: cfg.color, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 800, fontSize: 19, flexShrink: 0,
          fontFamily: "'Sora',sans-serif",
        }}>{r.name[0]}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: "#1E293B", marginBottom: 3 }}>{r.name}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: r.inStock ? "#10B981" : "#EF4444", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: r.inStock ? "#10B981" : "#EF4444", fontWeight: 600 }}>{r.inStock ? "In Stock" : "Out of Stock"}</span>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>·</span>
            <span style={{ fontSize: 12, color: "#64748B" }}>{r.deliveryLabel}</span>
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: cfg.color, fontFamily: "'Sora',sans-serif", lineHeight: 1 }}>{INR(r.price)}</p>
          {r.delivery > 0 && (
            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>+{INR(r.delivery)} delivery</p>
          )}
          <p style={{ fontSize: 12, fontWeight: 700, color: "#10B981", marginTop: 2 }}>Total {INR(total)}</p>
        </div>
      </div>

      {isSelected && r.inStock && (
        <div style={{ padding: "0 16px 14px" }}>
          <a
            href={buildUrl(r)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "12px 0", background: cfg.color, color: "white",
              borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none",
              fontFamily: "'Sora',sans-serif", transition: "opacity .2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = ".88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            🛒 Buy on {r.name} — {INR(total)}
          </a>
        </div>
      )}
    </div>
  );
}

// ─── PRICE ALERT MODAL ────────────────────────────────────────────────────────
function AlertModal({ product, bestPrice, onClose }) {
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // FIX: Ensure bestPrice is a valid number
  const displayPrice = typeof bestPrice === 'number' && !isNaN(bestPrice) && bestPrice > 0 
    ? bestPrice 
    : (product?.retailers?.[0]?.price || 0);
  
  const targetNum = parseInt(target) || 0;
  const isValid = targetNum > 0 && targetNum < displayPrice;
  const potentialSavings = isValid ? displayPrice - targetNum : 0;
  const discountPercent = isValid && displayPrice > 0 ? Math.round((potentialSavings / displayPrice) * 100) : 0;

  const save = async () => {
    if (!target || !isValid) {
      setError('Target must be less than current price');
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please sign in to set price alerts');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/api/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product?.id || product?._id || 'unknown',
          productName: product?.title || 'Product',
          productImage: product?.images?.[0] || '',
          currentPrice: displayPrice,
          targetPrice: targetNum,
          retailer: product?.retailers?.[0]?.name || 'Unknown'
        })
      });

      const data = await res.json();
      if (data.success) {
        setSaved(true);
        const alerts = JSON.parse(localStorage.getItem('dp_alerts') || '[]');
        alerts.push({
          id: data.data?._id || Date.now(),
          productName: product?.title || 'Product',
          productImage: product?.images?.[0] || '',
          currentPrice: displayPrice,
          targetPrice: targetNum,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('dp_alerts', JSON.stringify(alerts));
        setTimeout(() => onClose(), 2000);
      } else {
        setError(data.message || 'Failed to set alert');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "32px 28px",
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#F1F5F9",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748B",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#E2E8F0")}
          onMouseLeave={e => (e.currentTarget.style.background = "#F1F5F9")}
        >
          ✕
        </button>

        {saved ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#D1FAE5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 36,
            }}>
              ✅
            </div>
            <h3 style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#065F46",
              marginBottom: 8,
            }}>
              Alert Set!
            </h3>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}>
              We'll notify you when price drops to
            </p>
            <p style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: "#10B981",
            }}>
              {INR(targetNum)}
            </p>
            {potentialSavings > 0 && (
              <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 12 }}>
                You'll save {INR(potentialSavings)} ({discountPercent}% off current price)
              </p>
            )}
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔔</div>
              <h3 style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#1E3A5F",
                marginBottom: 4,
              }}>
                Set Price Alert
              </h3>
              <p style={{ fontSize: 13, color: "#64748B" }}>
                Get notified when price drops to your target
              </p>
            </div>

            {/* Current Price Display - FIXED */}
            <div style={{
              background: "#F1F5F9",
              borderRadius: 12,
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}>
              <span style={{ fontSize: 13, color: "#64748B" }}>Current Best Price</span>
              <span style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "#EF4444",
              }}>
                {displayPrice > 0 ? INR(displayPrice) : "₹0"}
              </span>
            </div>

            <p style={{
              fontSize: 12,
              color: "#94A3B8",
              marginBottom: 16,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {product?.title || 'Product'}
            </p>

            <div style={{ marginBottom: 8 }}>
              <label style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1E293B",
                display: "block",
                marginBottom: 6,
              }}>
                Your Target Price (₹)
              </label>
              <input
                type="number"
                placeholder={displayPrice > 0 ? `e.g. ${Math.round(displayPrice * 0.85)}` : "Enter target price"}
                value={target}
                onChange={e => {
                  setTarget(e.target.value);
                  setError("");
                }}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: `2px solid ${error ? "#EF4444" : "#E2E8F0"}`,
                  borderRadius: 12,
                  fontSize: 18,
                  fontWeight: 700,
                  outline: "none",
                  color: "#1E293B",
                  fontFamily: "'DM Sans',sans-serif",
                  textAlign: "center",
                }}
                onFocus={e => (e.target.style.borderColor = "#1A56DB")}
                onBlur={e => (e.target.style.borderColor = error ? "#EF4444" : "#E2E8F0")}
              />
            </div>

            {error && (
              <p style={{ fontSize: 12, color: "#EF4444", marginBottom: 12 }}>
                ⚠️ {error}
              </p>
            )}

            {isValid && displayPrice > 0 && (
              <div style={{
                background: "#ECFDF5",
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 20,
                border: "1px solid #A7F3D0",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#065F46" }}>💰 You'll save</span>
                  <span style={{
                    fontFamily: "'Sora',sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#10B981",
                  }}>
                    {INR(potentialSavings)}
                  </span>
                </div>
                <div style={{
                  width: "100%",
                  height: 6,
                  background: "#D1FAE5",
                  borderRadius: 3,
                  overflow: "hidden",
                  marginBottom: 4,
                }}>
                  <div style={{
                    width: `${Math.min(100, (potentialSavings / displayPrice) * 100)}%`,
                    height: "100%",
                    background: "#10B981",
                    borderRadius: 3,
                    transition: "width 0.3s ease",
                  }} />
                </div>
                <p style={{ fontSize: 11, color: "#047857", textAlign: "right" }}>
                  {discountPercent}% off current price
                </p>
              </div>
            )}

            {!target && displayPrice > 0 && (
              <div style={{
                background: "#FFFBEB",
                borderRadius: 12,
                padding: "10px 14px",
                marginBottom: 20,
                border: "1px solid #FDE68A",
              }}>
                <p style={{ fontSize: 12, color: "#92400E" }}>
                  💡 Enter a price lower than {INR(displayPrice)} to get notified
                </p>
              </div>
            )}

            {/* FIX: Show message when no price */}
            {displayPrice === 0 && (
              <div style={{
                background: "#FEF2F2",
                borderRadius: 12,
                padding: "10px 14px",
                marginBottom: 20,
                border: "1px solid #FEE2E2",
              }}>
                <p style={{ fontSize: 12, color: "#DC2626" }}>
                  ⚠️ Price information not available. Please refresh and try again.
                </p>
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "14px 0",
                  background: "#F1F5F9",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1E293B",
                  cursor: "pointer",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#E2E8F0")}
                onMouseLeave={e => (e.currentTarget.style.background = "#F1F5F9")}
              >
                Cancel
              </button>
              {/* FIX: Enable button when isValid and displayPrice > 0 */}
              <button
                onClick={save}
                disabled={!isValid || loading || displayPrice === 0}
                style={{
                  flex: 2,
                  padding: "14px 0",
                  background: isValid && !loading && displayPrice > 0 ? "#1A56DB" : "#CBD5E1",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isValid && !loading && displayPrice > 0 ? "pointer" : "not-allowed",
                  fontFamily: "'Sora',sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      display: "inline-block",
                      width: 16,
                      height: 16,
                      border: "2px solid white",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.6s linear infinite"
                    }} />
                    Setting...
                  </>
                ) : (
                  "🔔 Set Alert"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── PRICE HISTORY CHART ──────────────────────────────────────────────────────
function PriceChart({ retailers, currentBest }) {
  const bars = retailers.filter(r => r.inStock).sort((a, b) => a.price - b.price);
  const max = Math.max(...bars.map(r => r.price));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {bars.map((r, i) => {
        const cfg = storeStyle(r.name);
        const pct = (r.price / max) * 100;
        const isBest = i === 0;
        return (
          <div key={r.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{r.name}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: isBest ? "#10B981" : "#1E293B" }}>{INR(r.price)} {isBest && "✓ Best"}</span>
            </div>
            <div style={{ height: 8, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: isBest ? "#10B981" : cfg.color, borderRadius: 99, transition: "width .6s ease" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header() {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "#1E3A5F", boxShadow: "0 2px 20px rgba(15,30,50,.45)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px", height: 68, display: "flex", alignItems: "center", gap: 12 }}>
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
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#FFFFFF" }}>Dyna</span>
            <span style={{ color: "#F59E0B" }}>Prizes</span>
          </span>
        </a>

        <div style={{ flex: 1, display: "flex", background: "white", borderRadius: 11, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.15)" }}>
          <span style={{ paddingLeft: 14, display: "flex", alignItems: "center", color: "#94A3B8", fontSize: 16, flexShrink: 0 }}>🔍</span>
          <input type="text" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && router.push(`/search?q=${encodeURIComponent(q)}`)}
            placeholder="Search products…"
            style={{ flex: 1, padding: "10px 12px", border: "none", outline: "none", fontSize: 14, color: "#1E293B", fontFamily: "'DM Sans',sans-serif" }} />
          <button onClick={() => router.push(`/search?q=${encodeURIComponent(q)}`)}
            style={{ margin: 5, padding: "9px 18px", background: "#2563EB", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>Search</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
          <Link href="/notifications" style={{ position: "relative", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)", textDecoration: "none", marginRight: 4 }}>
            <span style={{ fontSize: 18 }}>🔔</span>
            <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, background: "#F59E0B", borderRadius: "50%", border: "1.5px solid #1E3A5F" }} />
          </Link>
          {[
            { e: "🏠", l: "Home", h: "/" },
            { e: "🛒", l: "Cart", h: "/cart" },
            { e: "🔔", l: "Alerts", h: "/alerts" },
            { e: "👤", l: "Account", h: "/account" }
          ].map(t => (
            <Link key={t.l} href={t.h} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 10px", borderRadius: 10, textDecoration: "none", color: "rgba(255,255,255,.72)", transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.12)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,.72)"; }}
            >
              <span style={{ fontSize: 20 }}>{t.e}</span>
              <span style={{ fontSize: 10, fontWeight: 600 }}>{t.l}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
function ProductContent() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id") || "";
  const token = params.get("token") || "";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(true);
  const [addedCart, setAddedCart] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [allFailed, setAllFailed] = useState(false);
  const [usedMock, setUsedMock] = useState(false);

  // ─── CACHE HELPERS ─────────────────────────────────────────────────────────
  const getCachedProduct = (productId) => {
    const cacheKey = `product_${productId}`;
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;
    try {
      const data = JSON.parse(cached);
      if (data.timestamp && (Date.now() - data.timestamp) < 60 * 60 * 1000) {
        return data.product;
      }
      return null;
    } catch {
      return null;
    }
  };

  const setCachedProduct = (productId, productData) => {
    const cacheKey = `product_${productId}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      product: productData,
      timestamp: Date.now()
    }));
  };

  // ─── SAVE TO RECENTLY VIEWED ──────────────────────────────────────────────
  const saveToRecentlyViewed = async (productData) => {
  try {
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

    const newItem = {
      id: productData.id || productData._id,
      productId: productData.id || productData._id,
      title: productData.title || 'Product',
      name: productData.title || 'Product',
      price: productData.price || productData.retailers?.[0]?.price || 0,
      originalPrice: productData.originalPrice || 0,
      image: productData.images?.[0] || productData.thumbnail || '',
      rating: productData.rating || 0,
      discount: productData.discount || 0,
      immersiveToken: token || '',
      timestamp: Date.now()
    };

    // Remove duplicate
    recentlyViewed = recentlyViewed.filter(p => {
      const id1 = p.id || p.productId;
      const id2 = newItem.id || newItem.productId;
      return id1 !== id2;
    });

    // Add to front
    recentlyViewed.unshift(newItem);
    recentlyViewed = recentlyViewed.slice(0, 30);

    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));

    // ✅ ADD THIS LOG - Check token
    const userToken = localStorage.getItem('token');
    console.log('🟢 userToken exists?', !!userToken);
    console.log('🟢 userToken value:', userToken ? userToken.substring(0, 20) + '...' : 'null');
    
    if (userToken) {
      // ✅ ADD THIS LOG - Check what's being sent
      console.log('🟢 Sending to backend:', JSON.stringify({
        product: {
          id: newItem.id,
          productId: newItem.id,
          name: newItem.title,
          title: newItem.title,
          price: newItem.price,
          originalPrice: newItem.originalPrice,
          image: newItem.image,
          rating: newItem.rating,
          discount: newItem.discount,
          category: productData.category || 'General'
        }
      }));
      
      const response = await fetch(`${API_BASE}/api/user/recently-viewed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          product: {
            id: newItem.id,
            productId: newItem.id,
            name: newItem.title,
            title: newItem.title,
            price: newItem.price,
            originalPrice: newItem.originalPrice,
            image: newItem.image,
            rating: newItem.rating,
            discount: newItem.discount,
            category: productData.category || 'General'
          }
        })
      });
      const data = await response.json();
      console.log('🟢 Backend save response:', data);
    } else {
      console.log('🟢 No token - skipping backend sync');
    }
  } catch (e) {
    console.log('🟢 Save to recently viewed error:', e);
  }
};
  // ─── LOAD FUNCTION WITH RETRY ─────────────────────────────────────────────
  const load = useCallback(async (attempt = 0) => {
    if (!id && !token) {
      const sorted = sortedRetailers(MOCK.retailers);
      setProduct({ ...MOCK, retailers: sorted });
      setSelected(sorted[0]);
      setLoading(false);
      return;
    }

    // Check cache first
    const cachedProduct = getCachedProduct(id);
    if (cachedProduct) {
      const sorted = sortedRetailers((cachedProduct.retailers || []).map(r => ({ ...r, inStock: true })));
      const productWithData = {
        ...cachedProduct,
        images: cachedProduct.thumbnails || cachedProduct.images || [],
        retailers: sorted
      };
      setProduct(productWithData);
      setSelected(sorted[0]);
      setLoading(false);
      return;
    }

    try {
      if (attempt > 0) {
        setIsRetrying(true);
        setRetryCount(attempt);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${API_BASE}/api/products/detail?productId=${id}&immersiveToken=${encodeURIComponent(token)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      if (data.success && data.data) {
        const sorted = sortedRetailers((data.data.retailers || []).map(r => ({ ...r, inStock: true })));
        const productWithData = {
          ...data.data,
          images: data.data.thumbnails || data.data.images || [],
          retailers: sorted
        };
        setProduct(productWithData);
        setSelected(sorted[0]);
        setCachedProduct(id, productWithData);
        await saveToRecentlyViewed(productWithData);
        setIsRetrying(false);
        setAllFailed(false);
        setUsedMock(false);
        setLoading(false);
        return;
      } else throw new Error("No data");
    } catch (err) {
      // Retry logic: max 3 attempts
      if (attempt < 2) {
        const delay = (attempt + 1) * 2000;
        console.log(`Retry ${attempt + 1}/3 after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return load(attempt + 1);
      }

      // All retries failed
      console.log('All retries failed');
      setIsRetrying(false);
      setAllFailed(true);
      setLoading(false);
    }
  }, [id, token]);

  // ─── EFFECT ────────────────────────────────────────────────────────────────
  useEffect(() => {
    load();
  }, [load]);

  // ─── RETRY FUNCTION ────────────────────────────────────────────────────────
  const handleRetry = () => {
    setAllFailed(false);
    setLoading(true);
    setUsedMock(false);
    load(0);
  };

  // ─── ADD TO CART ────────────────────────────────────────────────────────────
const addToCart = async () => {
  if (!product) return;
  
  const cart = JSON.parse(localStorage.getItem("dp_cart") || "[]");
  
  const idx = cart.findIndex(i => i.productId === product.id || i.id === product.id);
  
  if (idx >= 0) {
    cart[idx].quantity = (cart[idx].quantity || 1) + 1;
  } else {
    cart.push({ 
      id: product.id,
      productId: product.id,
      name: product.title,
      price: product.retailers[0]?.price || 0, 
      originalPrice: product.originalPrice || 0,
      image: product.images?.[0] || "", 
      quantity: 1,
      store: product.retailers?.[0]?.name || 'Unknown',
      inStock: true
    });
  }
  
  localStorage.setItem("dp_cart", JSON.stringify(cart));
  console.log('Cart saved:', JSON.parse(localStorage.getItem('dp_cart')));
  
  // Sync with backend
  const token = localStorage.getItem('token');
  if (token) {
    try {
      // ✅ FIX: Send product object properly
      const response = await fetch(`${API_BASE}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          product: {
            _id: product.id,
            name: product.title,
            price: product.retailers[0]?.price || 0,
            originalPrice: product.originalPrice || 0,
            image: product.images?.[0] || '',
            category: product.category || 'General'
          }
        })
      });
      
      const data = await response.json();
      console.log('Backend add to cart response:', data);
      
      if (!response.ok) {
        console.error('Failed to sync cart:', data.message);
      }
    } catch (e) {
      console.log('Backend sync error:', e);
    }
  }
  
  setAddedCart(true);
  setTimeout(() => setAddedCart(false), 2000);
};

  // ─── LOADING / RETRYING STATE ────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            border: "3px solid #DBEAFE", borderTopColor: "#1A56DB",
            animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ fontSize: 14, color: "#64748B", fontWeight: 500 }}>
            {isRetrying
              ? `Fetching latest prices… retry ${retryCount}/3`
              : "Fetching latest prices…"}
          </p>
          {isRetrying && (
            <p style={{ fontSize: 12, color: "#94A3B8" }}>
              SerpApi can be slow — hang tight
            </p>
          )}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </>
    );
  }

  // ─── ALL RETRIES EXHAUSTED ─────────────────────────────────────────────────
  if (allFailed) {
    return (
      <>
        <Header />
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center" }}>
          <span style={{ fontSize: 40 }}>⚠️</span>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1E293B" }}>
            Couldn't load live prices
          </p>
          <p style={{ fontSize: 13, color: "#64748B", maxWidth: 320 }}>
            We tried 3 times but the price server didn't respond. Your connection or the server may be slow right now.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={handleRetry}
              style={{ padding: "10px 20px", background: "#1A56DB", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              🔄 Retry
            </button>
            <button
              onClick={handleLoadMock}
              style={{ padding: "10px 20px", background: "white", color: "#64748B", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              View Sample Data
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!product) return null;

  // ─── MOCK BANNER ──────────────────────────────────────────────────────────
  if (usedMock) {
    return (
      <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'DM Sans',sans-serif" }}>
        <Header />
        <div style={{ background: "#FFFBEB", borderBottom: "1px solid #FCD34D", padding: "10px 20px", textAlign: "center", fontSize: 13, color: "#92400E" }}>
          ⚠️ Showing sample data — live prices unavailable right now.{" "}
          <button
            onClick={handleRetry}
            style={{ background: "none", border: "none", color: "#1A56DB", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
          >
            Try again
          </button>
        </div>
        {renderProductUI(product, selected, setSelected, showAlert, setShowAlert, specsOpen, setSpecsOpen, chartOpen, setChartOpen, addedCart, addToCart)}
      </div>
    );
  }

  // ─── NORMAL PRODUCT VIEW ──────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'DM Sans',sans-serif" }}>
      <Header />
      {renderProductUI(product, selected, setSelected, showAlert, setShowAlert, specsOpen, setSpecsOpen, chartOpen, setChartOpen, addedCart, addToCart)}
    </div>
  );
}

// ─── RENDER PRODUCT UI ──────────────────────────────────────────────────────
function renderProductUI(product, selected, setSelected, showAlert, setShowAlert, specsOpen, setSpecsOpen, chartOpen, setChartOpen, addedCart, addToCart) {
  const bestRetailer = product.retailers && product.retailers.length > 0 ? product.retailers[0] : null;
  const bestPrice = bestRetailer ? totalPrice(bestRetailer) : 0;
  const specs = product.specifications || [];
  const inStockRetailers = product.retailers && product.retailers.length > 0 ? product.retailers.filter(r => r.inStock) : [];

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ background: "white", borderBottom: "1px solid #F1F5F9" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "10px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
            <a href="/" style={{ color: "#1A56DB", textDecoration: "none" }}>Home</a>
            <span>›</span>
            <a href="/search" style={{ color: "#1A56DB", textDecoration: "none" }}>Search</a>
            <span>›</span>
            <span style={{ color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>{product.title}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 20px 100px" }}>

        {/* ── TOP SECTION ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 20 }}>

          {/* Image carousel */}
          <div style={{ width: "100%", maxWidth: 380, margin: "0 auto" }}>
            <ImageCarousel images={product.images || []} title={product.title} />
          </div>

          {/* Product info */}
          <div style={{ flex: "1 1 280px" }}>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.05rem,2.5vw,1.35rem)", fontWeight: 700, color: "#1E293B", lineHeight: 1.35, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {product.title}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Stars rating={product.rating || 4} />
              <span style={{ fontWeight: 700, color: "#1A56DB", fontSize: 14 }}>{Number(product.rating || 4).toFixed(1)}</span>
              {product.reviewCount > 0 && (
                <span style={{ fontSize: 13, color: "#64748B" }}>({product.reviewCount.toLocaleString()} reviews)</span>
              )}
            </div>

            {/* Best price callout */}
            {bestRetailer ? (
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#15803D", fontWeight: 600, marginBottom: 4 }}>🏷️ Best Price Available</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 800, color: "#10B981" }}>{INR(bestRetailer.price)}</span>
                  {product.discount > 0 && <span style={{ fontSize: 14, background: "#DCFCE7", color: "#15803D", padding: "2px 10px", borderRadius: 99, fontWeight: 700 }}>{product.discount}% off</span>}
                </div>
                <p style={{ fontSize: 13, color: "#15803D", marginTop: 4 }}>
                  on <strong>{bestRetailer.name}</strong> · {bestRetailer.deliveryLabel}
                </p>
                {inStockRetailers.length > 1 && (
                  <p style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                    Also available on {inStockRetailers.length - 1} more store{inStockRetailers.length > 2 ? "s" : ""}
                  </p>
                )}
              </div>
            ) : (
              <div style={{ background: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: "#DC2626" }}>No retailers available for this product</p>
              </div>
            )}

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              <button
                onClick={async () => await addToCart()}
                style={{ flex: "1 1 130px", padding: "13px 0", background: addedCart ? "#10B981" : "#EFF6FF", color: addedCart ? "white" : "#1A56DB", border: `1.5px solid ${addedCart ? "#10B981" : "#1A56DB"}`, borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif", transition: "all .2s" }}
              >{addedCart ? "✓ Added!" : "🛒 Add to Cart"}</button>
              <button
                onClick={() => setShowAlert(true)}
                style={{ flex: "1 1 130px", padding: "13px 0", background: "#FFFBEB", color: "#B45309", border: "1.5px solid #FCD34D", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}
              >🔔 Set Price Alert</button>
            </div>

            {/* Highlights */}
            {product.highlights?.length > 0 && (
              <div style={{ background: "white", borderRadius: 14, padding: "16px 18px", boxShadow: "0 1px 6px rgba(0,0,0,.06)" }}>
                <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: "#1E3A5F", fontSize: 14, marginBottom: 10 }}>✨ Highlights</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                  {product.highlights.slice(0, 5).map((h, i) => (
                    <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
                      <span style={{ color: "#10B981", flexShrink: 0, marginTop: 1 }}>✓</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ── PRICE COMPARISON ────────────────────────────────────────── */}
        <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,.06)", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: "#1E3A5F" }}>📊 Compare Prices</p>
            <span style={{ fontSize: 13, color: "#64748B" }}>{product.retailers.length} stores · Tap to select</span>
          </div>
          <p style={{ fontSize: 13, color: "#64748B", marginBottom: 18 }}>Sorted by total price including delivery</p>

          {/* Desktop table */}
          <div style={{ overflowX: "auto", display: "none" }} className="desk-table">
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
              <thead>
                <tr>
                  {["Store", "Price", "Delivery", "Total", "Stock", ""].map(h => (
                    <th key={h} style={{ textAlign: h === "" ? "center" : "left", padding: "8px 14px", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {product.retailers.map((r, i) => {
                  const cfg = storeStyle(r.name);
                  const isBest = i === 0;
                  return (
                    <tr
                      key={r.name}
                      onClick={() => r.inStock && setSelected(r)}
                      style={{ background: selected?.name === r.name ? cfg.bg : "white", cursor: r.inStock ? "pointer" : "default", opacity: r.inStock ? 1 : 0.55, transition: "background .2s" }}
                    >
                      <td style={{ padding: "14px 14px", borderTop: `1px solid #F1F5F9`, borderBottom: "1px solid #F1F5F9", borderLeft: `4px solid ${isBest ? "#10B981" : "transparent"}`, borderRadius: "12px 0 0 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, background: cfg.color, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 16, fontFamily: "'Sora',sans-serif", flexShrink: 0 }}>{r.name[0]}</div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 14, color: "#1E293B" }}>{r.name}</p>
                            {isBest && <span style={{ fontSize: 10, background: "#DCFCE7", color: "#15803D", padding: "1px 7px", borderRadius: 99, fontWeight: 700 }}>BEST PRICE</span>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px", borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9" }}>
                        <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 17, color: isBest ? "#10B981" : "#1E293B" }}>{INR(r.price)}</span>
                      </td>
                      <td style={{ padding: "14px", borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9", fontSize: 13, color: r.delivery === 0 ? "#10B981" : "#64748B", fontWeight: r.delivery === 0 ? 700 : 400 }}>
                        {r.deliveryLabel}
                      </td>
                      <td style={{ padding: "14px", borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9" }}>
                        <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 15, color: isBest ? "#10B981" : "#334155" }}>{INR(totalPrice(r))}</span>
                      </td>
                      <td style={{ padding: "14px", borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: r.inStock ? "#DCFCE7" : "#FEE2E2", color: r.inStock ? "#15803D" : "#DC2626" }}>
                          {r.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td style={{ padding: "14px", borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9", borderRadius: "0 12px 12px 0", textAlign: "center" }}>
                        {r.inStock && (
                          <a
                            href={buildUrl(r)} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ display: "inline-block", padding: "9px 18px", background: cfg.color, color: "white", borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", fontFamily: "'Sora',sans-serif" }}
                          >Buy Now ↗</a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mob-cards" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {product.retailers.map((r, i) => (
              <RetailerCard key={r.name} r={r} isBest={i === 0} isSelected={selected?.name === r.name} onSelect={setSelected} />
            ))}
          </div>
        </div>

        {/* ── PRICE CHART ─────────────────────────────────────────────── */}
        <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,.06)", marginBottom: 16 }}>
          <button
            onClick={() => setChartOpen(o => !o)}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: "#1E3A5F" }}>📈 Price Comparison Chart</p>
            <span style={{ color: "#64748B", fontSize: 18 }}>{chartOpen ? "▲" : "▼"}</span>
          </button>
          {chartOpen && (
            <div style={{ marginTop: 20 }}>
              <PriceChart retailers={product.retailers} currentBest={bestPrice} />
            </div>
          )}
        </div>

        {/* ── PRICE ALERT CTA ──────────────────────────────────────────── */}
        <div style={{ background: "linear-gradient(135deg,#1E3A5F,#1A56DB)", borderRadius: 20, padding: 24, marginBottom: 16, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, boxShadow: "0 4px 20px rgba(30,58,95,.25)" }}>
          <div style={{ flex: "1 1 220px" }}>
            <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 6 }}>🔔 Never Miss a Deal</p>
            <p style={{ fontSize: 14, color: "rgba(186,213,255,.8)", lineHeight: 1.55 }}>
              Set a target price and we'll notify you the moment this product drops. Free, always.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => setShowAlert(true)}
              style={{ padding: "12px 24px", background: "#F59E0B", color: "#1E3A5F", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}
            >Set Price Alert</button>
            <a
              href="/alerts"
              style={{ padding: "12px 20px", background: "rgba(255,255,255,.12)", color: "white", border: "1px solid rgba(255,255,255,.25)", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: "'Sora',sans-serif" }}
            >Manage Alerts →</a>
          </div>
        </div>

        {/* ── SPECIFICATIONS ── */}
        <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,.06)", marginBottom: 16 }}>
          <button
            onClick={() => setSpecsOpen(o => !o)}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: specsOpen ? 20 : 0 }}
          >
            <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: "#1E3A5F" }}>📋 Specifications</p>
            <span style={{ color: "#64748B", fontSize: 18 }}>{specsOpen ? "▲" : "▼"}</span>
          </button>

          {specsOpen && (
            specs.length > 0 ? (
              <div style={{
                background: "#F8FAFC",
                borderRadius: 12,
                padding: "16px",
                border: "1px solid #E2E8F0",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px 24px",
              }}>
                {specs.map((spec, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: i % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
                      transition: "background 0.2s",
                      gap: 12,
                      alignItems: "center",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#EFF6FF"}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#FFFFFF" : "#F8FAFC"}
                  >
                    <span style={{
                      fontSize: 12,
                      color: "#64748B",
                      fontWeight: 500,
                      minWidth: 80,
                      flexShrink: 0,
                    }}>
                      {spec.title}
                    </span>
                    <span style={{
                      fontSize: 13,
                      color: "#1E293B",
                      fontWeight: 600,
                      flex: 1,
                      wordBreak: "break-word",
                    }}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#94A3B8", fontSize: 14 }}>
                📭 Specifications not available. Please check the retailer site for full details.
              </div>
            )
          )}
        </div>

        {/* ── DISCLAIMER ───────────────────────────────────────────────── */}
        <p style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", lineHeight: 1.6 }}>
          Prices and availability are updated periodically. Final price may vary at retailer checkout.
          DynaPrizes earns affiliate commissions on purchases — this does not affect the price you pay.
        </p>
      </div>

      {/* ── STICKY BUY BAR ─────────────────────────────────────────────── */}
      {bestRetailer && bestRetailer.inStock && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #E2E8F0", padding: "12px 20px", boxShadow: "0 -4px 24px rgba(0,0,0,.1)", zIndex: 40 }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, color: "#64748B", marginBottom: 2 }}>Best price on {bestRetailer.name}</p>
              <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: "#10B981", lineHeight: 1 }}>{INR(bestRetailer.price)}</p>
            </div>
            <button
              onClick={() => setShowAlert(true)}
              style={{ padding: "12px 16px", background: "#FFFBEB", color: "#B45309", border: "1.5px solid #FCD34D", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif", flexShrink: 0 }}
            >🔔</button>
            <a
              href={buildUrl(bestRetailer)}
              target="_blank" rel="noopener noreferrer"
              style={{
                flex: 2, maxWidth: 280, padding: "13px 0", background: storeStyle(bestRetailer.name).color,
                color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800,
                cursor: "pointer", fontFamily: "'Sora',sans-serif", textDecoration: "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >🛒 Buy on {bestRetailer.name}</a>
          </div>
        </div>
      )}

      {/* Alert modal */}
      {showAlert && <AlertModal product={product} bestPrice={bestPrice} onClose={() => setShowAlert(false)} />}

      <style>{`
        @media(min-width:768px) {
          .desk-table { display:block!important; }
          .mob-cards  { display:none!important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export default function ProductPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:.45} }
      `}</style>
      <Suspense fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F1F5F9" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #DBEAFE", borderTopColor: "#1A56DB", animation: "spin 0.8s linear infinite" }} />
        </div>
      }>
        <ProductContent />
      </Suspense>
    </>
  );
}
