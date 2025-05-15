import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DesignGallery({ section }) {
  const [designs, setDesigns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [votedId, setVotedId] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

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
      setDesigns(prev =>
        prev.map(d =>
          d.id === designId ? { ...d, votes: (d.votes || 0) + 1 } : d
        )
      );
    } catch (err) {
      const rawMsg = err.response?.data?.error || 'Vote failed';
      const cuteMsg =
        rawMsg.includes('already') || rawMsg.includes('limit')
          ? "SanChan says you've already cast your daily paw of approval! 🐾 Come back tomorrow for more wag-worthy votes!"
          : rawMsg;
      setErrorMessage(cuteMsg);
    } finally {
      setTimeout(() => setVotedId(null), 1000);
    }
  };

  const filtered = designs.filter((d) => d.imageUrl && d.title);
  const sortedByVotes = [...filtered].map(d => ({
    ...d,
    votes: typeof d.votes === 'number' ? d.votes : 0
  })).sort((a, b) => b.votes - a.votes);

  const sortedByDate = [...filtered].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.timestamp || 0);
    const dateB = new Date(b.createdAt || b.timestamp || 0);
    return dateB - dateA;
  });

  const maxVotes = sortedByVotes.length > 0 ? sortedByVotes[0].votes : 1;

  const visible =
    section === 'top' ? sortedByVotes.slice(0, 5) :
    section === 'top-all' ? sortedByVotes :
    section === 'all' ? sortedByDate :
    sortedByVotes;

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 max-w-screen-xl mx-auto">
      <nav className="flex justify-center mb-6 space-x-4">
        <a href="/" className="text-blue-600 hover:underline">🏠 Home</a>
        <a href="/top" className={section.includes('top') ? 'font-bold underline' : ''}>🔝 Top Designs</a>
        <a href="/all" className={section === 'all' ? 'font-bold underline' : ''}>🖼 All Designs</a>
      </nav>
      <h1 className="text-4xl font-bold mb-6 text-center">
        {section === 'all' ? '🖼 All Designs' : '🔥 Top Designs'}
      </h1>
      <div className="grid grid-cols-2 gap-4">
        {visible.map((d, i) => (
          <div
            key={d.id}
            className="bg-white rounded-lg shadow p-2 hover:shadow-md transition cursor-pointer"
            onClick={() => setSelected(d)}
          >
            {(section.includes('top') && !section.includes('all')) && (
              <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full z-10">
                #{i + 1}
              </div>
            )}
            <img
              src={d.imageUrl}
              alt={d.title}
              className="w-full object-contain max-h-[300px] sm:max-h-[400px] md:max-h-[500px] rounded mb-2"
              style={{ margin: '0 auto' }}
            />
            <h2 className="text-base font-semibold">{d.title}</h2>
            <p className="text-sm text-gray-600">{d.votes} votes</p>
            <p className="text-xs text-gray-400">{Math.round((d.votes / maxVotes) * 100)}% of top</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                vote(d.id);
              }}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded text-sm font-medium"
            >
              {votedId === d.id ? 'Voted! ✅' : 'Vote'}
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onTouchStart={(e) => setTouchStartY(e.touches[0].clientY)}
          onTouchEnd={(e) => {
            const endY = e.changedTouches[0].clientY;
            if (touchStartY && touchStartY - endY > 50) setSelected(null);
          }}
          onClick={() => setSelected(null)}
        >
          <div className="max-w-full max-h-full p-4 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <img
              src={selected.imageUrl}
              alt={selected.title}
              className="max-h-[90vh] max-w-[90vw] rounded-lg"
            />
            {navigator.share && (
              <button
                onClick={() => navigator.share({
                  title: selected.title,
                  url: selected.imageUrl
                })}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Share
              </button>
            )}
          </div>
        </div>
      )}

      {errorMessage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setErrorMessage('')}
        >
          <div
            className="bg-white rounded-lg p-6 shadow-xl max-w-sm text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-semibold text-red-600 mb-4">⚠️ Vote Error</p>
            <p className="text-gray-700 mb-6">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage('')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
