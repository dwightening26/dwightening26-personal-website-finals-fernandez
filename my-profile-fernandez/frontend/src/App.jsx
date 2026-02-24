import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('guestbook')
      .insert([{ name: form.name, message: form.message }]);
    if (!error) {
      setForm({ name: '', message: '' });
      fetchEntries();
    }
    setLoading(false);
  };

  const handleLike = async (id, currentLikes) => {
    await supabase
      .from('guestbook')
      .update({ likes: currentLikes + 1 })
      .eq('id', id);
    fetchEntries();
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="page">

        {/* HERO */}
        <section className="hero">
          <h1>Dwight Fernandez</h1>
          <p className="hero-subtitle">Information Technology Student</p>
          <p className="hero-description">
            Passionate about building modern web applications using React, NestJS, and Supabase. 
            I love exploring technology trends, coding challenges, and staying active in sports and fitness.
          </p>

          <button 
            className="dark-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </section>

        {/* ABOUT ME */}
        <section className="about-me">
          <h2>About Me</h2>
          <p>
            I am an aspiring full-stack developer with a keen interest in creating intuitive and efficient web applications. 
            Aside from coding, I enjoy fitness, sports, and continuous self-improvement. I value discipline, curiosity, 
            and problem-solving, which drive me in both personal and professional life.
          </p>
        </section>

        {/* SKILLS */}
        <section className="skills">
          <h2>Tech Stack</h2>
          <div className="skills-grid">
            <div className="skill-card">React</div>
            <div className="skill-card">NestJS</div>
            <div className="skill-card">Supabase</div>
            <div className="skill-card">PostgreSQL</div>
          </div>
        </section>

        {/* GUESTBOOK */}
        <section className="guestbook-section">
          <h2 className="section-title">Guestbook</h2>
          <p className="guest-count">{entries.length} people signed the guestbook</p>

          <div className="card">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Leave a message..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
                rows={3}
              />
              <div className="actions">
                <button type="submit">
                  {loading ? 'Signing...' : 'Sign Guestbook'}
                </button>
              </div>
            </form>
          </div>

          <div className="entries">
            {entries.map(entry => (
              <div key={entry.id} className="entry-card fade-in">
                <div className="entry-header">
                  <strong>{entry.name}</strong>
                  <span className="date">{new Date(entry.created_at).toLocaleDateString()}</span>
                </div>
                <p>{entry.message}</p>
                <button
                  className="like-btn"
                  onClick={() => handleLike(entry.id, entry.likes || 0)}
                >
                  ❤️ {entry.likes || 0}
                </button>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          © 2026 Dwight Fernandez | Personal Profile Website
        </footer>

      </div>
    </div>
  );
}

export default App;