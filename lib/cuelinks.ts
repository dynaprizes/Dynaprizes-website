export function getAffiliateUrl(originalUrl: string): string {
  if (!originalUrl) return "";
  
  const PUBLISHER_ID = "226073";
  const encodedUrl = encodeURIComponent(originalUrl);
  
  // Cuelinks official redirect format
  return `https://linksredirect.com?cid=${PUBLISHER_ID}&url=${encodedUrl}`;
}