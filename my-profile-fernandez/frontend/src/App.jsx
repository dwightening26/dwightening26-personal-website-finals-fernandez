import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

const projects = [
  { title: "E-Commerce API", tech: ["NestJS", "PostgreSQL"], description: "High-performance REST API.", link: "#" },
  { title: "Fitness Tracker", tech: ["React", "Supabase"], description: "Real-time dashboard.", link: "#" }
];

function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error("Supabase Error:", err.message);
    }
  };

  useEffect(() => {
    if (!supabase) return; // Prevent crash if client is missing
    fetchEntries();

    const channel = supabase
      .channel('guestbook_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guestbook' }, () => fetchEntries())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
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
    <div className="app-wrapper">
      <button className="dark-toggle-fixed" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className="page">
        <header className="hero slide-up">
          <h1>Dwight Fernandez</h1>
          <p className="hero-subtitle">IT Student & Developer</p>
        </header>

        <section className="section-container slide-up">
          <h2>Projects</h2>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <div key={i} className="project-card">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-container slide-up">
          <h2>Guestbook</h2>
          <div className="card">
            <form onSubmit={handleSubmit}>
              <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <textarea placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
              <button type="submit" className="submit-btn">{loading ? '...' : 'Sign'}</button>
            </form>
          </div>
          <div className="entries">
            {entries.map(entry => (
              <div key={entry.id} className="entry-card">
                <strong>{entry.name}</strong>: {entry.message}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;