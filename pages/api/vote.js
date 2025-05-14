// vote.js – API route for voting with IP rate limit (1 vote per design per IP per day)

import { firestore } from '../../firebase/config';
import { getClientIp } from 'request-ip';
import { format } from 'date-fns';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { designId } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const voteId = `${designId}_${ip}_${today}`;

  try {
    const voteRef = doc(firestore, 'votes', voteId);
    const voteSnap = await getDoc(voteRef);

    if (voteSnap.exists()) {
      return res.status(429).json({ error: 'You have already voted today.' });
    }

    await setDoc(voteRef, {
      ip,
      designId,
      date: today,
      timestamp: new Date().toISOString()
    });

    const designRef = doc(firestore, 'designs', designId);
    await updateDoc(designRef, {
      votes: increment(1)
    });

    return res.status(200).json({ message: 'Vote recorded successfully.' });
  } catch (error) {
    console.error("🔥 Vote Error:", error);
    return res.status(500).json({ error: 'Failed to record vote.' });
  }
}

