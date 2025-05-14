import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [designs, setDesigns] = useState([]);
  const [votedId, setVotedId] = useState(null);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const res = await axios.get('/api/designs');
        setDesigns(res.data.designs);
      } catch (err) {
        console.error('Failed to fetch designs:', err);
      }
    };
    fetchDesigns();
  }, []);

  const vote = async (designId) => {
    try {
      setVotedId(designId);
      await axios.post('/api/vote', { designId });

      // Locally update vote count
      setDesigns(prev =>
        prev.map(d =>
          d.id === designId ? { ...d, votes: (d.votes || 0) + 1 } : d
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Vote failed');
    } finally {
      setTimeout(() => setVotedId(null), 1000);
    }
  };


  const filteredDesigns = designs.filter((d) => d.imageUrl && d.title);
  const sortedDesigns = [...filteredDesigns]
    .map((d) => ({ ...d, votes: typeof d.votes === 'number' ? d.votes : 0 }))
    .sort((a, b) => b.votes - a.votes);

  const top5 = sortedDesigns.filter(d => d.votes > 0).slice(0, 5);
  const rest = sortedDesigns;

  return (
    <div className="bg-gray-50 min-h-screen px-4 sm:px-6 md:px-12 py-8 max-w-screen-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">🔥 Top 5 Designs</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {top5.map((d, i) => (
          <div
            key={d.id}
            className={`relative bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden ${
              votedId === d.id ? 'ring-2 ring-blue-400 scale-[1.02]' : ''
            }`}
          >
            <img src={d.imageUrl} alt={d.title} className="w-full object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">#{i + 1} {d.title}</h2>
              <p className="text-sm text-gray-600">{d.votes} votes</p>
              <button
                onClick={() => vote(d.id)}
                className={`mt-3 bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded text-sm font-medium transition ${
                  votedId === d.id ? 'scale-105' : ''
                }`}
              >
                {votedId === d.id ? 'Voted! ✅' : 'Vote'}
              </button>
              {votedId === d.id && (
                <div className="absolute top-2 left-2 text-green-600 font-bold animate-bounce">+1</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <h1 className="text-3xl font-bold mb-6">🖼 All Designs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rest.map((d) => (
          <div
            key={d.id}
            className={`relative bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden flex flex-col ${
              votedId === d.id ? 'ring-2 ring-blue-400 scale-[1.02]' : ''
            }`}
          >
            <img
              src={d.imageUrl}
              alt={d.title}
              className="w-full h-auto object-cover"
            />
            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <h2 className="text-base font-semibold">{d.title}</h2>
                <p className="text-sm text-gray-600">{d.votes} votes</p>
              </div>
              <button
                onClick={() => vote(d.id)}
                className={`mt-4 bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded text-sm font-medium transition ${
                  votedId === d.id ? 'scale-105' : ''
                }`}
              >
                {votedId === d.id ? 'Voted! ✅' : 'Vote'}
              </button>
              {votedId === d.id && (
                <div className="absolute top-2 left-2 text-green-600 font-bold animate-bounce">+1</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
