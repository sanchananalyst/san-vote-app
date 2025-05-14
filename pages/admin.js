import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [admin, setAdmin] = useState(false);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (admin) fetchDesigns();
  }, [admin]);

  const fetchDesigns = async () => {
    const res = await axios.get('/api/designs');
    setDesigns(res.data.designs);
  };

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      setAdmin(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleUpload = async () => {
    if (!title || !image) return alert('Title and image are required.');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'sancloud');
      const uploadRes = await axios.post('https://api.cloudinary.com/v1_1/divfhh9kz/image/upload', formData);
      const imageUrl = uploadRes.data.secure_url;
      await axios.post('/api/designs', { title, imageUrl });
      fetchDesigns();
      setTitle('');
      setImage(null);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleEditField = (id, field, value) => {
    setDesigns(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleUpdate = async (design) => {
    try {
      await axios.put(
        '/api/designs',
        {
          id: design.id,
          title: design.title,
          imageUrl: design.imageUrl,
          votes: design.votes
        },
        {
          headers: {
            'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_PASS
          }
        }
      );
      alert('Updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this design?')) return;
    try {
      await axios.delete(`/api/designs?id=${id}`, {
        headers: {
          'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_PASS
        }
      });
      setDesigns(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (!admin) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-2">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter admin password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 sm:px-6 md:px-12 py-8 max-w-screen-2xl mx-auto">
      {!admin ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-xl font-bold mb-4">Admin Login</h1>
          <input
            type="password"
            placeholder="Enter admin password"
            className="border p-2 w-full mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">📤 Upload New Design</h1>
          <div className="bg-white p-6 rounded shadow mb-10 flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Design Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded w-full md:w-1/3"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full md:w-1/3"
            />
            <button
              onClick={handleUpload}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-4">🖼 All Designs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {designs.map((d) => (
              <div key={d.id} className="bg-white rounded-lg shadow p-4">
                <img src={d.imageUrl} alt={d.title} className="w-full rounded object-cover mb-3" />
                <input
                  value={d.title}
                  onChange={(e) => handleEditField(d.id, 'title', e.target.value)}
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="number"
                  value={d.votes}
                  onChange={(e) => handleEditField(d.id, 'votes', parseInt(e.target.value))}
                  className="border p-2 rounded w-full mb-2"
                />
                <div className="flex justify-between gap-2 mt-2">
                  <button
                    onClick={() => handleUpdate(d)}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

}
