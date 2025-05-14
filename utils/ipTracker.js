// ipTracker.js – helper to extract IP from request in Next.js API routes

import requestIp from 'request-ip';

export function getIp(req) {
  // This will return client IP behind proxies (Vercel, etc.)
  return requestIp.getClientIp(req) || 'unknown';
}
