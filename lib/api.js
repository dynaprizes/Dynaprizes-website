const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dynaprizes-backend.onrender.com/api';

export async function searchProducts(query, limit = 50) {
  const res = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
    next: { revalidate: 600 } // 10 minutes cache
  });
  return res.json();
}

export async function getProductDetail(productId, immersiveToken) {
  const res = await fetch(`${API_BASE}/products/detail?productId=${productId}&immersiveToken=${immersiveToken}`, {
    next: { revalidate: 1800 } // 30 minutes cache
  });
  return res.json();
}