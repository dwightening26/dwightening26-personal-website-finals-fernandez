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

const SKILLS = [
  {
    category: 'Languages',
    tags: ['JavaScript', 'HTML', 'CSS', 'SQL', 'Python'],
  },
  {
    category: 'Frontend',
    tags: ['React', 'Tailwind CSS', 'Responsive Design'],
  },
  {
    category: 'Tools & Platforms',
    tags: ['Supabase', 'PostgreSQL', 'Git', 'GitHub', 'VS Code', 'Figma'],
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
  { title: 'Blonde',           artist: 'Frank Ocean',       cover: blondeCover,       spotify: 'https://open.spotify.com/album/3mH6qwIy9crq0I9YQbOuDf?si=59b3e2e34c804261' },
  { title: 'GNX',              artist: 'Kendrick Lamar',    cover: gnxCover,          spotify: 'https://open.spotify.com/album/0hvT3yIEysuuvkK73vgdcW?si=453acc8451ad4246' },
  { title: 'Freudian',         artist: 'Daniel Caesar',     cover: freudianCover,     spotify: 'https://open.spotify.com/album/4E1XUBMTpLO7GpBzUo65Jp?si=KjqMCwFZSr6mRE5NYTp0Eg' },
  { title: 'JESUS IS KING',    artist: 'Kanye West',        cover: jesusisskingCover, spotify: 'https://open.spotify.com/album/0FgZKfoU2Br5sHOfvZKTI9?si=45cbe3b5671c45bc' },
  { title: 'Apricot Princess', artist: 'Rex Orange County', cover: apricotCover,      spotify: 'https://open.spotify.com/album/4DxNdQzm6cBYuSn4dCimmT?si=e4d9882065e843d7' },
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
  const [entries, setEntries]           = useState([]);
  const [form, setForm]                 = useState({ name: '', message: '' });
  const [darkMode, setDarkMode]         = useState(true);
  const [loading, setLoading]           = useState(false);
  const [visitorCount, setVisitorCount] = useState(null);
  const [aboutOpen, setAboutOpen]       = useState(false);
  const [likedIds, setLikedIds]         = useState(() => {
    const stored = localStorage.getItem('guestbook_likes');
    return stored ? JSON.parse(stored) : [];
  });

  const [cursor, setCursor] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const move = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const timelineRef = useScrollReveal();
  const skillsRef   = useScrollReveal();
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
    if (likedIds.includes(id)) return;
    await supabase
      .from('guestbook')
      .update({ likes: currentLikes + 1 })
      .eq('id', id);
    const updatedLikes = [...likedIds, id];
    setLikedIds(updatedLikes);
    localStorage.setItem('guestbook_likes', JSON.stringify(updatedLikes));
    fetchEntries();
  };

  return (
    <div className="page">

      {/* CURSOR GLOW */}
      <div className="cursor-glow" style={{ left: cursor.x, top: cursor.y }} />

      {/* NAV */}
      <nav className="nav">
        <img src={avatar} alt="Avatar" className="nav-avatar" />
        <div className="nav-right">
          <span className="nav-status">
            <span className="status-dot" />
            Online
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
          Hi! I'm Dwight Fernandez from IT242, an IT student by day, and a gamer and gym rat by night, always looking to learn, build, and level up in everything I do.
        </p>
        <div className="social-links">
          <a className="social-link" href="https://github.com/dwightening26" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
            <span>GitHub</span>
          </a>
          <a className="social-link" href="https://www.linkedin.com/in/dwight-fernandez-172978322/" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            <span>LinkedIn</span>
          </a>
          <a className="social-link" href="https://instagram.com/dwightening_" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            <span>Instagram</span>
          </a>
          <a className="social-link" href="mailto:ddfernandez@student.apc.edu.ph">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
            <span>Email</span>
          </a>
        </div>
      </section>

      {/* TIMELINE */}
      <section ref={timelineRef} className="section reveal">
        <h2 className="section-label">Journey</h2>
        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <div
              key={i}
              className={`timeline-item ${item.highlight ? 'timeline-highlight' : ''}`}
            >
              <div className="timeline-left">
                <span className="timeline-date">{item.date}</span>
                <div className="timeline-line" />
              </div>
              <div className="timeline-right">
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="section-divider"><span className="section-divider-dot" /></div>

      {/* SKILLS */}
      <section ref={skillsRef} className="section reveal">
        <h2 className="section-label">Tech Stack</h2>
        <div className="skills-section">
          {SKILLS.map((group, i) => (
            <div key={i} className="skills-group">
              <span className="skills-category">{group.category}</span>
              <div className="skills-wrap">
                {group.tags.map(tag => (
                  <span key={tag} className="skill-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="section-divider"><span className="section-divider-dot" /></div>

      {/* PROJECTS */}
      <section ref={projectsRef} className="section reveal">
        <h2 className="section-label">Selected Projects</h2>
        <div className="projects-list">
          {PROJECTS.map((project, i) => (
            <a key={i} className="project-row" href={project.href}>
              <div className="project-left">
                <span className="project-num">0{i + 1}</span>
                <div>
                  <h3 className="project-name">{project.name}</h3>
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

      {/* DIVIDER */}
      <div className="section-divider"><span className="section-divider-dot" /></div>

      {/* ABOUT */}
      <section ref={aboutRef} className="section reveal">
        <button
          className="about-toggle"
          onClick={() => setAboutOpen(!aboutOpen)}
          aria-expanded={aboutOpen}
        >
          <span className="section-label about-label">About Me</span>
          <span className={`about-chevron ${aboutOpen ? 'open' : ''}`}>↓</span>
        </button>

        <div className={`about-body ${aboutOpen ? 'expanded' : ''}`}>
          <p className="about-text">
            I'm a 2nd-year IT student who's still finding his craft in his course, but I'm passionate about learning and
            experimenting with web technologies. I enjoy tackling real-world problems through clean, efficient code and
            thoughtful UI design. Outside of tech, you'll usually find me at the gym or immersed in gaming bringing
            the same focus and dedication to every challenge I take on.
          </p>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="section-divider"><span className="section-divider-dot" /></div>

      {/* ALBUMS */}
      <section ref={albumsRef} className="section reveal">
        <h2 className="section-label">Favorite Albums</h2>
        <div className="albums-grid">
          {ALBUMS.map((album, i) => (
            <a
              key={i}
              className="vinyl-card"
              href={album.spotify}
              target="_blank"
              rel="noreferrer"
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
            </a>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="section-divider"><span className="section-divider-dot" /></div>

      {/* GUESTBOOK */}
      <section ref={guestRef} className="section reveal">
        <h2 className="section-label">Guestbook</h2>

        <div className="guestbook-form">
          <form onSubmit={handleSubmit}>
            <input
              className="field"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <textarea
              className="field"
              placeholder="Leave a message…"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
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
                  className={`like-btn ${likedIds.includes(entry.id) ? 'liked' : ''}`}
                  onClick={() => handleLike(entry.id, entry.likes || 0)}
                  disabled={likedIds.includes(entry.id)}
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