export function getAffiliateUrl(originalUrl: string): string {
  if (!originalUrl) return "";
  
  // ✅ Clean URL before encoding
  const cleanUrl = originalUrl.split('#')[0];
  const PUBLISHER_ID = "226073";
  const encodedUrl = encodeURIComponent(cleanUrl);
  
  return `https://linksredirect.com?cid=${PUBLISHER_ID}&url=${encodedUrl}`;
}