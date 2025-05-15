import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase/config';

export default async function handler(req, res) {
  // Force no cache
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  const today = new Date().toISOString().slice(0, 10);
  const logsRef = collection(firestore, 'voteLogs');
  const q = query(logsRef, where('date', '==', today));

  try {
    const snapshot = await getDocs(q);
    const ips = new Set();
    snapshot.forEach(doc => ips.add(doc.data().ip));
    return res.status(200).json({ votersToday: ips.size });
  } catch (err) {
    console.error('Voter count error:', err);
    return res.status(500).json({ error: 'Failed to count voters' });
  }
}

// 👇 Prevent Vercel’s edge/cache logic from interfering
export const config = {
  api: {
    externalResolver: true,
  },
};
