"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .sora { font-family: 'Sora', sans-serif; }
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
          
          <button
            onClick={() => window.history.back()}
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
            ← Back
          </button>

          <div style={{
            background: "white",
            borderRadius: 20,
            padding: "40px",
            border: "1px solid #E2E8F0",
          }}>
            <h1 className="sora" style={{ fontSize: 32, fontWeight: 700, color: "#1E3A5F", marginBottom: 8 }}>
              Terms of Service
            </h1>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 32 }}>
              Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <h2 className="sora" style={{ fontSize: 20, fontWeight: 700, color: "#1E3A5F", marginBottom: 12 }}>1. Acceptance of Terms</h2>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
                  By using DynaPrizes, you agree to these Terms of Service. If you do not agree, please do not use our services.
                </p>
              </div>

              <div>
                <h2 className="sora" style={{ fontSize: 20, fontWeight: 700, color: "#1E3A5F", marginBottom: 12 }}>2. Description of Service</h2>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
                  DynaPrizes is a price comparison platform that aggregates prices from multiple Indian retailers. We do not sell products directly; we provide price information and affiliate links to partner stores.
                </p>
              </div>

              <div>
                <h2 className="sora" style={{ fontSize: 20, fontWeight: 700, color: "#1E3A5F", marginBottom: 12 }}>3. User Accounts</h2>
                <ul style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, paddingLeft: 24 }}>
                  <li>You must be 18 years or older to create an account</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>You agree to provide accurate information</li>
                  <li>You may delete your account at any time</li>
                </ul>
              </div>

              <div>
                <h2 className="sora" style={{ fontSize: 20, fontWeight: 700, color: "#1E3A5F", marginBottom: 12 }}>4. Price Accuracy</h2>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
                  Prices are sourced from third-party APIs and may not be 100% accurate or up-to-date. Always verify prices on the retailer's website before making a purchase.
                </p>
              </div>

              <div>
                <h2 className="sora" style={{ fontSize: 20, fontWeight: 700, color: "#1E3A5F", marginBottom: 12 }}>5. Affiliate Disclosure</h2>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
                  DynaPrizes participates in affiliate programs. We earn commissions when you click "Buy Now" and make purchases on partner stores. This does not affect the price you pay.
                </p>
              </div>

              <div>
                <h2 className="sora" style={{ fontSize: 20, fontWeight: 700, color: "#1E3A5F", marginBottom: 12 }}>6. Prohibited Activities</h2>
                <ul style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, paddingLeft: 24 }}>
                  <li>Misusing or abusing our services</li>
                  <li>Attempting to hack or disrupt our platform</li>
                  <li>Using bots to scrape data</li>
                  <li>Engaging in fraudulent activities</li>
                </ul>
              </div>

              <div>
                <h2 className="sora" style={{ fontSize: 20, fontWeight: 700, color: "#1E3A5F", marginBottom: 12 }}>7. Termination</h2>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
                  We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful behavior.
                </p>
              </div>

              <div>
                <h2 className="sora" style={{ fontSize: 20, fontWeight: 700, color: "#1E3A5F", marginBottom: 12 }}>8. Contact</h2>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
                  Questions about these Terms? Contact us at:
                </p>
                <p style={{ fontSize: 15, color: "#2563EB", marginTop: 8 }}>
                  📧 support@dynaprizes.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}