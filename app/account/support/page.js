"use client";

import { useState } from "react";
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

const FAQS = [
  {
    question: "How does DynaPrizes make money?",
    answer: "DynaPrizes is completely free for users. We earn affiliate commissions when you click 'Buy Now' and make a purchase on partner stores like Amazon, Flipkart, Myntra, etc."
  },
  {
    question: "How accurate are the prices?",
    answer: "Prices are fetched in real-time using API'S and updated real time. However, prices on retailer websites may change rapidly. Always check the final price on the retailer's site before purchasing."
  },
  {
    question: "How do I set a price alert?",
    answer: "Search for any product, go to its detail page, and click 'Set Alert' button. Enter your target price and we'll notify you when the price drops below that amount."
  },
  {
    question: "Is my personal data secure?",
    answer: "Yes. We use industry-standard encryption (JWT tokens, bcrypt hashing) and never share your data with third parties. Read our Privacy Policy for more details."
  },
  {
    question: "How do I cancel my account?",
    answer: "Go to Account → Privacy & Security → Delete Account. This will permanently remove all your data including price alerts, cart items, and order history."
  },
  {
    question: "Which stores do you compare?",
    answer: "We currently compare prices from Amazon, Flipkart, Myntra, Ajio, Nykaa, Meesho, Croma, JioMart, Tata CLiQ, Decathlon, and 100+ more Indian retailers."
  },
];

function FAQItem({ question, answer }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      borderBottom: "1px solid #E2E8F0",
      padding: "16px 0",
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", margin: 0 }}>
          {question}
        </p>
        <span style={{ fontSize: 18, color: "#94A3B8", transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
          ▼
        </span>
      </div>
      {expanded && (
        <p style={{ fontSize: 14, color: "#64748B", marginTop: 12, lineHeight: 1.6 }}>
          {answer}
        </p>
      )}
    </div>
  );
}

export default function SupportPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please sign in to send a message');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/api/user/support`, {
  method: 'POST',
  headers: getAuthHeaders(),
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,
  })
});

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending support message:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

          <div style={{ marginBottom: 28 }}>
            <h1 className="sora" style={{ fontSize: 28, fontWeight: 700, color: "#1E3A5F", marginBottom: 6 }}>
              Help & Support
            </h1>
            <p style={{ fontSize: 14, color: "#64748B" }}>
              Find answers to common questions or contact our support team
            </p>
          </div>

          {/* Contact Info Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}>
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: "20px",
              textAlign: "center",
              border: "1px solid #E2E8F0",
            }}>
              <span style={{ fontSize: 28 }}>📧</span>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", marginTop: 8, marginBottom: 4 }}>Email Us</p>
              <a href="mailto:support@dynaprizes.com" style={{ fontSize: 13, color: "#2563EB", textDecoration: "none" }}>
                support@dynaprizes.com
              </a>
            </div>
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: "20px",
              textAlign: "center",
              border: "1px solid #E2E8F0",
            }}>
              <span style={{ fontSize: 28 }}>⏱️</span>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", marginTop: 8, marginBottom: 4 }}>Response Time</p>
              <p style={{ fontSize: 13, color: "#64748B" }}>Within 24 hours</p>
            </div>
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: "20px",
              textAlign: "center",
              border: "1px solid #E2E8F0",
            }}>
              <span style={{ fontSize: 28 }}>🇮🇳</span>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", marginTop: 8, marginBottom: 4 }}>Made in India</p>
              <p style={{ fontSize: 13, color: "#64748B" }}>Based in Delhi</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid #E2E8F0",
            marginBottom: 32,
            overflow: "hidden",
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
              <h2 className="sora" style={{ fontSize: 18, fontWeight: 700, color: "#1E3A5F" }}>Frequently Asked Questions</h2>
            </div>
            <div style={{ padding: "0 24px" }}>
              {FAQS.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid #E2E8F0",
            overflow: "hidden",
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
              <h2 className="sora" style={{ fontSize: 18, fontWeight: 700, color: "#1E3A5F" }}>Still need help?</h2>
              <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Send us a message and we'll get back to you within 24 hours</p>
            </div>
            <div style={{ padding: "24px" }}>
              {submitted && (
                <div style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  marginBottom: 20,
                  background: "#D1FAE5",
                  color: "#065F46",
                  fontSize: 14,
                }}>
                  ✓ Message sent successfully! We'll respond within 24 hours.
                </div>
              )}
              {error && (
                <div style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  marginBottom: 20,
                  background: "#FEE2E2",
                  color: "#991B1B",
                  fontSize: 14,
                }}>
                  ⚠️ {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 6 }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid #E2E8F0",
                        fontSize: 14,
                        outline: "none",
                      }}
                      onFocus={e => (e.target.style.borderColor = "#2563EB")}
                      onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 6 }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid #E2E8F0",
                        fontSize: 14,
                        outline: "none",
                      }}
                      onFocus={e => (e.target.style.borderColor = "#2563EB")}
                      onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 6 }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid #E2E8F0",
                      fontSize: 14,
                      outline: "none",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#2563EB")}
                    onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 6 }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid #E2E8F0",
                      fontSize: 14,
                      outline: "none",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#2563EB")}
                    onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 10,
                    background: "#2563EB",
                    color: "white",
                    border: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => {
                    if (!loading) e.currentTarget.style.background = "#1D4ED8";
                  }}
                  onMouseLeave={e => {
                    if (!loading) e.currentTarget.style.background = "#2563EB";
                  }}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}