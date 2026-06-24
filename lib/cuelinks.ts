export function getAffiliateUrl(originalUrl: string): string {
  if (!originalUrl) return "";
  
  try {
    const cleanUrl = originalUrl.split('#')[0].trim();
    const PUBLISHER_ID = "298456";
    const encodedUrl = encodeURIComponent(cleanUrl);
    
    // ✅ Use 'cid' instead of 'pubid' for the redirect
    return `https://linksredirect.com?cid=${PUBLISHER_ID}&url=${encodedUrl}`;
  } catch (error) {
    console.error("Error formatting Cuelinks affiliate link:", error);
    return originalUrl;
  }
}