"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://dynaprizes-backend.onrender.com";
const MAX_RETRIES = 3;
const BASE_TIMEOUT = 8000;

// Exponential backoff: 1s, 2s, 4s between retries
const backoffDelay = (attempt) => Math.min(1000 * 2 ** attempt, 8000);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function useProductDetail(id, token) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [usedMock, setUsedMock] = useState(false);
  const abortRef = useRef(null);

  const fetchOnce = useCallback(async () => {
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), BASE_TIMEOUT);

    try {
      const res = await fetch(
        `${API_BASE}/api/products/detail?productId=${id}&immersiveToken=${encodeURIComponent(token || "")}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success || !data.data) throw new Error("Empty response");
      return data.data;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }, [id, token]);

  const run = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    setUsedMock(false);
    setRetrying(false);

    for (let i = 0; i < MAX_RETRIES; i++) {
      setAttempt(i + 1);
      if (i > 0) {
        setRetrying(true);
        await sleep(backoffDelay(i - 1));
      }
      try {
        const data = await fetchOnce();
        setProduct(data);
        setLoading(false);
        setRetrying(false);
        return;
      } catch (err) {
        if (i === MAX_RETRIES - 1) {
          setLoading(false);
          setRetrying(false);
          setFailed(true);
          return;
        }
      }
    }
  }, [fetchOnce]);

  const retry = useCallback(() => { run(); }, [run]);

  const loadMockAnyway = useCallback((mockData) => {
    setProduct(mockData);
    setUsedMock(true);
    setFailed(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (id || token) run();
    return () => abortRef.current?.abort();
  }, [id, token, run]);

  return { product, loading, retrying, attempt, failed, usedMock, retry, loadMockAnyway };
}