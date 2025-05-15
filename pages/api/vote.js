import { firestore } from '../../firebase/config';
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { designId } = req.body;
  if (!designId) {
    return res.status(400).json({ error: 'Missing designId' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const today = new Date().toISOString().slice(0, 10);

  try {
    const designRef = doc(firestore, 'designs', designId);
    const designSnap = await getDoc(designRef);

    if (!designSnap.exists()) {
      return res.status(404).json({ error: 'Design not found' });
    }

    // 1 vote per IP per day (enforced manually for now)
    const voteLogsRef = collection(firestore, 'voteLogs');
    const q = await getDoc(doc(firestore, 'voteLogs', `${ip}_${today}`));
    if (q.exists()) {
      return res.status(400).json({ error: "SanChan says you've already cast your daily paw of approval! 🐾 Come back tomorrow!" });
    }

    // Increment vote
    await updateDoc(designRef, { votes: increment(1) });

    // Log this IP+date in voteLogs
    await addDoc(voteLogsRef, {
      ip,
      date: today,
      timestamp: serverTimestamp()
    });

    return res.status(200).json({ message: 'Vote recorded' });
  } catch (error) {
    console.error('🔥 Vote error:', error);
    return res.status(500).json({ error: 'Failed to vote' });
  }
}
