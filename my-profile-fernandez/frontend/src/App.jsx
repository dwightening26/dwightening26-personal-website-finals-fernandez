import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// ... (projects array stays the same)

function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });
    setEntries(data || []);
  };

  useEffect(() => {
    fetchEntries();
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'guestbook' }, 
        () => fetchEntries()
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('guestbook')
      .insert([{ name: form.name, message: form.message }]);
    if (!error) setForm({ name: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="app-wrapper">
      {/* TOGGLE POSITIONED HERE */}
      <button className="dark-toggle-fixed" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className="page">
        <div className="system-bar fade-in">
          <span>Dwight Portfolio v2.0</span>
          <span className="status-dot">Online</span>
        </div>

        <header className="hero slide-up">
          <h1>Dwight Fernandez</h1>
          <p className="hero-subtitle">Information Technology Student</p>
          <p className="hero-description">
            Building modern web applications with React, NestJS, and Supabase.
          </p>
        </header>

        {/* ... (Projects and Guestbook sections stay the same as previous) */}
        
        <section className="section-container slide-up" style={{ animationDelay: '0.1s' }}>
          <h2>Featured Projects</h2>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <div key={i} className="project-card">
                <div className="project-tags">
                  {p.tech.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <a href={p.link} className="project-link">View Repo →</a>
              </div>
            ))}
          </div>
        </section>

        <section className="section-container slide-up" style={{ animationDelay: '0.2s' }}>
          <h2>Guestbook</h2>
          <div className="card">
            <form onSubmit={handleSubmit}>
              <input 
                placeholder="Name" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
              />
              <textarea 
                placeholder="Leave a message..." 
                value={form.message} 
                onChange={e => setForm({...form, message: e.target.value})} 
                required 
                rows={3}
              />
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Sending...' : 'Sign Guestbook'}
              </button>
            </form>
          </div>

          <div className="entries">
            {entries.map((entry, i) => (
              <div key={entry.id} className="entry-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="entry-header">
                  <strong>{entry.name}</strong>
                  <span className="date">{new Date(entry.created_at).toLocaleDateString()}</span>
                </div>
                <p>{entry.message}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          © 2026 Dwight Fernandez | Built with React & Supabase
        </footer>
      </div>
    </div>
  );
}

export default App;