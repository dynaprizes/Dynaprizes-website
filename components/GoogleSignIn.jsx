"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = "https://dynaprizes-backend.onrender.com";

export default function GoogleSignIn({ onSuccess, onError, buttonText = "Continue with Google" }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleGoogleSignIn = () => {
    setLoading(true);

    if (window.google) {
      // Use ID Token method (what backend expects)
      window.google.accounts.id.initialize({
        client_id: '908878836327-8a10mp4egkui81s5q7cuf4ca2v591u88.apps.googleusercontent.com',
        callback: async (response) => {
          try {
            const res = await fetch(`${API_BASE}/api/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken: response.credential })
            });
            
            const data = await res.json();
            
            if (data.success) {
              localStorage.setItem('token', data.data.token);
              localStorage.setItem('refreshToken', data.data.refreshToken);
              localStorage.setItem('user', JSON.stringify(data.data.user));
              if (onSuccess) onSuccess(data.data);
              router.refresh();
            } else {
              throw new Error(data.message || 'Login failed');
            }
          } catch (error) {
            console.error('Google sign in error:', error);
            if (onError) onError(error.message);
          } finally {
            setLoading(false);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      
      window.google.accounts.id.prompt();
    } else {
      // Wait for script to load
      setTimeout(() => handleGoogleSignIn(), 500);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        width: "100%",
        padding: "12px 20px",
        background: "white",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#1E293B",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={e => {
        if (!loading) e.currentTarget.style.background = "#F8FAFC";
      }}
      onMouseLeave={e => {
        if (!loading) e.currentTarget.style.background = "white";
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      {loading ? "Signing in..." : buttonText}
    </button>
  );
}