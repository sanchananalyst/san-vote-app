import { firestore } from '../../firebase/config';
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
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
  const voteLogsRef = collection(firestore, 'voteLogs');

  try {
    // Prevent multiple votes for same design by same IP on same day
    const existingVoteQuery = query(
      voteLogsRef,
      where('ip', '==', ip),
      where('date', '==', today),
      where('designId', '==', designId)
    );
    const snapshot = await getDocs(existingVoteQuery);
    if (!snapshot.empty) {
      return res.status(400).json({
        error: "SanChan says you've already voted for this design today! 🐾 Try a new one tomorrow!"
      });
    }

    // Confirm the design exists
    const designRef = doc(firestore, 'designs', designId);
    const designSnap = await getDoc(designRef);
    if (!designSnap.exists()) {
      return res.status(404).json({ error: 'Design not found' });
    }

    // Increment vote
    await updateDoc(designRef, { votes: increment(1) });

    // Log vote with IP, date, and designId
    await addDoc(voteLogsRef, {
      ip,
      date: today,
      designId,
      timestamp: serverTimestamp()
    });

    return res.status(200).json({ message: 'Vote recorded' });
  } catch (error) {
    console.error('🔥 Vote error:', error);
    return res.status(500).json({ error: 'Failed to vote' });
  }
}
