import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

const projects = [
  { title: "E-Commerce API", tech: ["NestJS", "PostgreSQL"], description: "High-performance REST API with JWT auth." },
  { title: "Fitness Tracker", tech: ["React", "Supabase"], description: "Real-time dashboard with social features." },
  { title: "Task Manager", tech: ["TypeScript", "NestJS"], description: "Background job processing system." }
];

function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    const { data } = await supabase.from('guestbook').select('*').order('created_at', { ascending: false });
    setEntries(data || []);
  };

  useEffect(() => {
    fetchEntries();
    const channel = supabase.channel('gb').on('postgres_changes', { event: '*', schema: 'public', table: 'guestbook' }, () => fetchEntries()).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  // Use document.body for the most reliable fullscreen theme toggle
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('guestbook').insert([{ name: form.name, message: form.message }]);
    setForm({ name: '', message: '' });
    setLoading(false);
    fetchEntries();
  };

  return (
    <div className="container">
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className="content-fade-in">
        <header className="hero-box">
          <h1>Dwight Fernandez</h1>
          <p className="subtitle">Information Technology Student</p>
        </header>

        <section className="section">
          <h2>Projects</h2>
          <div className="grid">
            {projects.map((p, i) => (
              <div key={i} className="card project">
                <h3>{p.title}</h3>
                <div className="tags">{p.tech.map(t => <span key={t} className="tag">{t}</span>)}</div>
                <p>{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Guestbook</h2>
          <div className="card">
            <form onSubmit={handleSubmit}>
              <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <textarea placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required rows={3} />
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Sign Guestbook'}
              </button>
            </form>
          </div>

          <div className="message-list">
            {entries.map(entry => (
              <div key={entry.id} className="entry">
                <div className="entry-head">
                  <strong>{entry.name}</strong>
                  <span className="date">{new Date(entry.created_at).toLocaleDateString()}</span>
                </div>
                <p>{entry.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;