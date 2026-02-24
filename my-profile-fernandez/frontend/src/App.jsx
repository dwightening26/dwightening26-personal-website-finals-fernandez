import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

const SKILLS = ['React', 'NestJS', 'Supabase', 'PostgreSQL', 'JavaScript', 'TypeScript', 'HTML & CSS', 'Git'];

const PROJECTS = [
  {
    name: 'Guestbook App',
    desc: 'A real-time visitor guestbook with likes, built with React and Supabase. Features dark mode and live database sync.',
    tags: ['React', 'Supabase', 'PostgreSQL'],
    href: '#',
  },
  {
    name: 'Portfolio Website',
    desc: 'This site — a clean, minimal developer portfolio designed for clarity and personality.',
    tags: ['React', 'CSS'],
    href: '#',
  },
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

  useEffect(() => { fetchEntries(); }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    document.getElementById('root')?.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

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
    <div className="page">

      {/* NAV */}
      <nav className="nav">
        <span className="nav-brand">DF</span>
        <div className="nav-right">
          <span className="nav-status">
            <span className="status-dot" />
            Available for work
          </span>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? '☀' : '☽'}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <p className="eyebrow">Frontend Developer · IT Student</p>
        <h1>
          Hi, I'm Dwight.<br />
          <span className="hero-italic">I build for the web.</span>
        </h1>
        <p className="hero-description">
          Information Technology student crafting clean, scalable web experiences
          with React, NestJS, and Supabase. Driven by curiosity, fitness, and
          getting 1% better every day.
        </p>
        <div className="hero-actions">
          <a className="btn-primary" href="https://github.com" target="_blank" rel="noreferrer">
            View GitHub ↗
          </a>
          <a className="btn-ghost" href="mailto:dwight@email.com">
            Get in touch
          </a>
        </div>
      </section>

      {/* SKILLS */}
      <section className="section">
        <p className="section-label">Tech Stack</p>
        <div className="skills-wrap">
          {SKILLS.map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section">
        <p className="section-label">Selected Projects</p>
        <div className="projects-list">
          {PROJECTS.map((project, i) => (
            <a key={project.name} className="project-row" href={project.href}>
              <div className="project-left">
                <span className="project-num">0{i + 1}</span>
                <div>
                  <p className="project-name">{project.name}</p>
                  <p className="project-desc">{project.desc}</p>
                  <div className="project-tags">
                    {project.tags.map(tag => (
                      <span key={tag} className="project-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <span className="project-arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="section about">
        <p className="section-label">About</p>
        <p className="about-text">
          I'm an IT student focused on building maintainable, performant web applications.
          I enjoy solving real-world problems through clean code and thoughtful UI. Outside
          of tech, you'll find me playing sports or pushing my limits at the gym — the same
          discipline carries into everything I build.
        </p>
      </section>

      {/* GUESTBOOK */}
      <section className="section">
        <p className="section-label">Guestbook</p>

        <div className="guestbook-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="field"
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <textarea
              className="field"
              placeholder="Leave a message..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              required
              rows={3}
            />
            <div className="form-footer">
              <span className="guest-count">
                {entries.length} {entries.length === 1 ? 'message' : 'messages'}
              </span>
              <button className="btn-primary" type="submit">
                {loading ? 'Signing…' : 'Sign Guestbook'}
              </button>
            </div>
          </form>
        </div>

        {entries.length > 0 && (
          <div className="entries-list">
            {entries.map(entry => (
              <div key={entry.id} className="entry-item">
                <div className="entry-top">
                  <strong className="entry-name">{entry.name}</strong>
                  <span className="entry-date">
                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>
                <p className="entry-msg">{entry.message}</p>
                <button
                  className="like-btn"
                  onClick={() => handleLike(entry.id, entry.likes || 0)}
                >
                  ♥ {entry.likes || 0}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer-name">Dwight Fernandez</span>
        <span className="footer-copy">© 2026 · Built with React & Supabase</span>
      </footer>

    </div>
  );
}

export default App;