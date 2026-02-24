import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// Project Data
const projects = [
  {
    title: "E-Commerce API",
    tech: ["NestJS", "PostgreSQL", "Redis"],
    description: "A high-performance REST API with JWT auth and role-based access control.",
    link: "#"
  },
  {
    title: "Fitness Tracker",
    tech: ["React", "Supabase", "Chart.js"],
    description: "Real-time dashboard tracking workout consistency and PRs with live social leaderboards.",
    link: "#"
  },
  {
    title: "Task Orchestrator",
    tech: ["TypeScript", "NestJS", "BullMQ"],
    description: "Background job processing system for handling heavy data migrations.",
    link: "#"
  }
];

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

    // REAL-TIME SUBSCRIPTION
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
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('guestbook')
      .insert([{ name: form.name, message: form.message }]);

    if (!error) {
      setForm({ name: '', message: '' });
      // Real-time will handle the refresh!
    }
    setLoading(false);
  };

  const handleLike = async (id, currentLikes) => {
    // Optimistic UI Update (Update locally first)
    setEntries(prev => prev.map(en => en.id === id ? {...en, likes: (en.likes || 0) + 1} : en));
    
    await supabase
      .from('guestbook')
      .update({ likes: (currentLikes || 0) + 1 })
      .eq('id', id);
  };

  return (
    <div className="page">
      <div className="system-bar">
        <span>Dwight Portfolio v2.0</span>
        <span className="status-dot">Online</span>
      </div>

      <header className="hero">
        <h1>Dwight Fernandez</h1>
        <p className="hero-subtitle">Information Technology Student</p>
        <p className="hero-description">
          Building modern web applications with React, NestJS, and Supabase.
          Focused on performance, scalability, and clean code.
        </p>
        <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <section className="about">
        <h2>About Me</h2>
        <p>
          I'm an IT student focused on the full-stack ecosystem. I enjoy solving 
          complex backend problems with NestJS and creating smooth user experiences with React.
        </p>
      </section>

      <section className="projects-section">
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div key={i} className="project-card">
              <div className="project-content">
                <div className="project-tags">
                  {p.tech.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <a href={p.link} className="project-link">View Repository →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="skills">
        <h2>Tech Stack</h2>
        <div className="skills-grid">
          {["React", "NestJS", "Supabase", "PostgreSQL", "TypeScript", "Docker"].map(skill => (
            <div key={skill} className="skill-card">{skill}</div>
          ))}
        </div>
      </section>

      <section className="guestbook-section">
        <h2 className="section-title">Guestbook</h2>
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
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Signing...' : 'Sign Guestbook'}
            </button>
          </form>
        </div>

        <div className="entries">
          {entries.map(entry => (
            <div key={entry.id} className="entry-card">
              <div className="entry-header">
                <strong>{entry.name}</strong>
                <span className="date">{new Date(entry.created_at).toLocaleDateString()}</span>
              </div>
              <p>{entry.message}</p>
              <button className="like-btn" onClick={() => handleLike(entry.id, entry.likes)}>
                ❤️ {entry.likes || 0}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        © 2026 Dwight Fernandez | Built with React & Supabase
      </footer>
    </div>
  );
}

export default App;