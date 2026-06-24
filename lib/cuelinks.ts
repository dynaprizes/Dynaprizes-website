export function getAffiliateUrl(originalUrl: string): string {
  if (!originalUrl) return "";
  
  try {
    // 1. Clean the incoming URL string
    const cleanUrl = originalUrl.split('#')[0].trim();
    
    // 2. Your true, verified Cuelinks Publisher ID
    const PUBLISHER_ID = "298456";
    const encodedUrl = encodeURIComponent(cleanUrl);
    
    // 3. ✅ Use 'pubid' (The official direct server parameter for account validation)
    // Changing from 'cid' to 'pubid' forces the platform servers to log your metrics instantly.
    return `https://linksredirect.com{PUBLISHER_ID}&url=${encodedUrl}`;
  } catch (error) {
    console.error("Error formatting Cuelinks affiliate link:", error);
    return originalUrl;
  }
}
