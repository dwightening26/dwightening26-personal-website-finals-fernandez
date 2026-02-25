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
  const [likedIds, setLikedIds]         = useState(() => {
    const stored = localStorage.getItem('guestbook_likes');
    return stored ? JSON.parse(stored) : [];
  });

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
        <div className="hero-actions">
          <a className="btn-primary" href="https://github.com" target="_blank" rel="noreferrer">
            View GitHub ↗
          </a>
          <a className="btn-ghost" href="mailto:dwight@student.apc.edu.ph">
            Get in touch
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

      {/* ABOUT */}
      <section ref={aboutRef} className="section reveal">
        <h2 className="section-label">About Me</h2>
        <p className="about-text">
          I'm a 2nd-year IT student who's still finding his craft in his course, but I'm passionate about learning and
          experimenting with web technologies. I enjoy tackling real-world problems through clean, efficient code and
          thoughtful UI design. Outside of tech, you'll usually find me at the gym or immersed in gaming bringing
          the same focus and dedication to every challenge I take on.
        </p>
      </section>

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