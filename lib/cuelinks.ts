export function getAffiliateUrl(originalUrl: string): string {
  if (!originalUrl) return "";
  
  // Return the raw, clean store link. 
  // Your fixed layout.tsx Cuelinks JS script will auto-convert this on click!
  return originalUrl.split('#')[0].trim();
}
