import { useEffect, useState, useRef } from 'react';
import { supabase } from './supabaseClient';
import avatar from './profile.png';
import blondeCover       from './blonde.png';
import gnxCover          from './gnx.png';
import freudianCover     from './freudian.png';
import jesusisskingCover from './Jesusisking.png';
import apricotCover      from './apricotprincess.png';
import './App.css';

const TIMELINE = [
  {
    date: 'Aug 2024',
    title: 'Started BSIT',
    desc: 'Enrolled at Asia Pacific College, beginning my journey in Information Technology.',
  },
  {
    date: 'Day 0',
    title: 'The enjoyment has not been found every since (cope)',
    desc: 'Search continues. Compiler still running. No results yet.',
    highlight: true,
  },
  {
    date: 'Feb of 2026',
    title: 'Built this portfolio',
    desc: 'Put real time and effort into crafting something that represents who I am as a developer.',
  },
];

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

const ALBUMS = [
  { title: 'Blonde',           artist: 'Frank Ocean',       cover: blondeCover },
  { title: 'GNX',              artist: 'Kendrick Lamar',    cover: gnxCover },
  { title: 'Freudian',         artist: 'Daniel Caesar',     cover: freudianCover },
  { title: 'JESUS IS KING',    artist: 'Kanye West',        cover: jesusisskingCover },
  { title: 'Apricot Princess', artist: 'Rex Orange County', cover: apricotCover },
];

function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    }, { threshold: 0.12, ...options });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function App() {
  const [entries, setEntries]       = useState([]);
  const [form, setForm]             = useState({ name: '', message: '' });
  const [darkMode, setDarkMode]     = useState(true);
  const [loading, setLoading]       = useState(false);
  const [visitorCount, setVisitorCount] = useState(null);

  const timelineRef = useScrollReveal();
  const projectsRef = useScrollReveal();
  const aboutRef    = useScrollReveal();
  const albumsRef   = useScrollReveal();
  const guestRef    = useScrollReveal();
  const footerRef   = useScrollReveal();

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });
    setEntries(data || []);
  };

  // Increment visitor count on load
  useEffect(() => {
    const incrementVisitor = async () => {
      const { data } = await supabase
        .from('visitor_count')
        .select('count')
        .eq('id', 1)
        .single();

      if (data) {
        const newCount = data.count + 1;
        await supabase
          .from('visitor_count')
          .update({ count: newCount })
          .eq('id', 1);
        setVisitorCount(newCount);
      }
    };
    incrementVisitor();
  }, []);

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
        <img src={avatar} alt="Dwight Fernandez" className="nav-avatar" />
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
        <p className="eyebrow">IT Student</p>
        <h1>Welcome to my personal profile</h1>
        <p className="hero-description">
          Welcome. I'm Dwight. By day an IT student, by night a gamer and gym rat.
        </p>
        <div className="hero-actions">
          <a className="btn-primary" href="https://github.com/dwightening26?tab=repositories" target="_blank" rel="noreferrer">
            View GitHub ↗
          </a>
          <a className="btn-ghost" href="mailto:ddfernandez@student.apc.edu.ph">
            Get in touch
          </a>
        </div>
      </section>

      {/* TIMELINE */}
      <section ref={timelineRef} className="section reveal">
        <p className="section-label">Journey</p>
        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <div
              key={i}
              className={`timeline-item${item.highlight ? ' timeline-highlight' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="timeline-left">
                <span className="timeline-date">{item.date}</span>
                <div className="timeline-line" />
              </div>
              <div className="timeline-right">
                <p className="timeline-title">{item.title}</p>
                <p className="timeline-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section ref={projectsRef} className="section reveal">
        <p className="section-label">Selected Projects</p>
        <div className="projects-list">
          {PROJECTS.map((project, i) => (
            <a
              key={project.name}
              className="project-row"
              href={project.href}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
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
      <section ref={aboutRef} className="section about reveal">
        <p className="section-label">About</p>
        <p className="about-text">
          I'm an IT student focused on building maintainable, performant web applications.
          I enjoy solving real-world problems through clean code and thoughtful UI. Outside
          of tech, you'll find me playing sports or pushing my limits at the gym — the same
          discipline carries into everything I build.
        </p>
      </section>

      {/* ALBUMS */}
      <section ref={albumsRef} className="section reveal">
        <p className="section-label">Favorite Albums</p>
        <div className="albums-grid">
          {ALBUMS.map((album, i) => (
            <div
              key={album.title}
              className="vinyl-card"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="vinyl-wrap">
                <div className="vinyl-record">
                  <img src={album.cover} alt={album.title} className="vinyl-cover" />
                  <div className="vinyl-hole" />
                </div>
              </div>
              <div className="vinyl-info">
                <p className="vinyl-album">{album.title}</p>
                <p className="vinyl-artist">{album.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GUESTBOOK */}
      <section ref={guestRef} className="section reveal">
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
            {entries.map((entry, i) => (
              <div
                key={entry.id}
                className="entry-item"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
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
      <footer ref={footerRef} className="footer reveal">
        <span className="footer-name">Dwight Fernandez</span>
        {visitorCount && (
          <span className="footer-visitor">You are visitor #{visitorCount.toLocaleString()}</span>
        )}
        <span className="footer-copy">© 2026 · Built with React & Supabase</span>
      </footer>

      {/* NOW PLAYING */}
      <div className="now-playing">
        <img src={blondeCover} alt="Blonde" className="now-playing-cover" />
        <div className="now-playing-info">
          <span className="now-playing-label">Now Playing</span>
          <span className="now-playing-track">Self Control</span>
          <span className="now-playing-artist">Frank Ocean</span>
        </div>
        <div className="now-playing-bars">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </div>
      </div>

    </div>
  );
}

export default App;