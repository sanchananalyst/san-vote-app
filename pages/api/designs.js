import { firestore } from '../../firebase/config';
import { collection, getDocs, addDoc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import {
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

const isAdmin = (req) => {
  const key = req.headers['x-admin-key'];
  return key === process.env.NEXT_PUBLIC_ADMIN_PASS;
};

export default async function handler(req, res) {
  const designsRef = collection(firestore, 'designs');

  if (req.method === 'GET') {
    try {
      const q = query(designsRef, orderBy('votes', 'desc'));
      const snapshot = await getDocs(q);
      const designs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return res.status(200).json({ designs });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch designs' });
    }
  }
  
 if (req.method === 'POST') {
  const { title, imageUrl } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ error: 'Missing title or imageUrl' });
  }

  try {
    console.log("📥 Adding design:", title, imageUrl); // ✅ ADD THIS LINE

    await addDoc(designsRef, {
      title,
      imageUrl,
      votes: 0,
      createdAt: serverTimestamp()
    });

    return res.status(200).json({ message: 'Design added' });
  } catch (error) {
    console.error("🔥 Firestore insert error:", error); // ✅ SEE REAL ERROR HERE
    return res.status(500).json({ error: 'Failed to add design' });
  }
}
  // PUT: Edit a design
if (req.method === 'PUT') {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { id, title, imageUrl, votes } = req.body;
  if (!id || !title || !imageUrl || votes === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const designRef = doc(firestore, 'designs', id);
    await updateDoc(designRef, { title, imageUrl, votes });
    return res.status(200).json({ message: 'Design updated' });
  } catch (error) {
    console.error("🔥 Update error:", error);
    return res.status(500).json({ error: 'Failed to update design' });
  }
}

// DELETE: Delete a design
if (req.method === 'DELETE') {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing design id' });
  }

  try {
    const designRef = doc(firestore, 'designs', id);
    await deleteDoc(designRef);
    return res.status(200).json({ message: 'Design deleted' });
  } catch (error) {
    console.error("🔥 Delete error:", error);
    return res.status(500).json({ error: 'Failed to delete design' });
  }
}



  // Anything else
  return res.status(405).end();
}
