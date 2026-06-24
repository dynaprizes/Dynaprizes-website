export function getAffiliateUrl(originalUrl: string): string {
  if (!originalUrl) return "";
  
  const cleanUrl = originalUrl.split('#')[0];
  const PUBLISHER_ID = "298456";
  const encodedUrl = encodeURIComponent(cleanUrl);
  
  // ✅ Remove the slash after .com
  return `https://linksredirect.com?cid=${PUBLISHER_ID}&url=${encodedUrl}`;
}