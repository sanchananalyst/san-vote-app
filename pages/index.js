import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [stats, setStats] = useState({
    totalVotes: 0,
    totalDesigns: 0,
    votersToday: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [designsRes, votersRes] = await Promise.all([
          axios.get('/api/designs'),
          axios.get('/api/voters-today')
        ]);

        const designs = designsRes.data.designs || [];
        const totalVotes = designs.reduce((sum, d) => sum + (d.votes || 0), 0);
        const totalDesigns = designs.length;
        const votersToday = votersRes.data.votersToday || 0;
        console.log('[LIVE] Voters Today:', votersRes.data.votersToday); // ← add this
        setStats({ totalVotes, totalDesigns, votersToday });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-pink-100 flex flex-col text-center px-4 py-8">
      <nav className="w-full flex justify-center space-x-6 py-4 mb-6 text-sm font-semibold text-gray-700">
        <Link href="/top" className="hover:underline">🔝 Top Designs</Link>
        <Link href="/all" className="hover:underline">🖼 All Designs</Link>
        <a href="https://sanchankantaro.myshopify.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">
          🛍️ Merch Store
        </a>
      </nav>

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="mb-8 animate-fadeIn">
          <Image
            src="/sanchan-hero.png"
            alt="SanChan Hero"
            width={220}
            height={220}
            className="rounded-full shadow-lg border-4 border-white"
          />
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-4 drop-shadow-lg">🎨 Welcome to the SanChan Design Vote</h1>
        <p className="text-lg text-gray-700 mb-10 max-w-xl">Vote your favorite SanChan designs to the top! The most loved designs may become official merch. 🐾</p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/top">
            <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition text-lg font-semibold">
              🔝 View Top Designs
            </button>
          </Link>
          <Link href="/all">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition text-lg font-semibold">
              🖼️ View All Designs
            </button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-600">
          🗳 Total Votes Cast: <span className="font-bold">{stats.totalVotes}</span> &nbsp;•&nbsp;
          🎨 Designs Submitted: <span className="font-bold">{stats.totalDesigns}</span> &nbsp;•&nbsp;
          👥 Voters Today: <span className="font-bold">{stats.votersToday}</span>
        </div>
      </div>
    </div>
  );
}
