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
    desc: 'A real-time visitor guestbook with likes, built with React and Supabase.',
    tags: ['React', 'Supabase', 'PostgreSQL'],
    href: '#',
  },
  {
    name: 'Portfolio Website',
    desc: 'This site — a clean, minimal developer portfolio.',
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

function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    }, { threshold: 0.12 });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const timelineRef = useScrollReveal();
  const projectsRef = useScrollReveal();
  const guestRef    = useScrollReveal();
  const footerRef   = useScrollReveal();

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

  return (
    <div className="page">

      {/* NAV */}
      <nav className="nav">
        <img src={avatar} alt="Avatar" className="nav-avatar" />
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀' : '☽'}
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <p className="eyebrow">IT Student</p>
        <h1>Welcome to my personal profile</h1>

        <p className="hero-description">
          Hi! I'm Dwight Fernandez from IT242, an IT student by day and a gamer and gym rat by night.
          I’m constantly learning, building, and leveling up in everything I do.
        </p>

        {/* NEW ABOUT SECTION INSIDE HERO */}
        <p className="hero-about">
          I'm a 2nd-year IT student still refining my craft with a strong interest in web development
          and clean UI design. I enjoy solving real-world problems through efficient code and thoughtful
          interfaces. Outside of tech, I bring the same discipline to the gym and the same competitive
          mindset to gaming.
        </p>

      </section>

      {/* TIMELINE */}
      <section ref={timelineRef} className="section reveal">
        <h2 className="section-label">Journey</h2>
        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <div key={i} className="timeline-item">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section ref={projectsRef} className="section reveal">
        <h2 className="section-label">Selected Projects</h2>
        {PROJECTS.map((project, i) => (
          <div key={i} className="project-row">
            <h3>{project.name}</h3>
            <p>{project.desc}</p>
          </div>
        ))}
      </section>

      {/* GUESTBOOK */}
      <section ref={guestRef} className="section reveal">
        <h2 className="section-label">Guestbook</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Leave a message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
          <button type="submit">
            {loading ? 'Signing…' : 'Sign Guestbook'}
          </button>
        </form>

        {entries.map(entry => (
          <div key={entry.id}>
            <strong>{entry.name}</strong>
            <p>{entry.message}</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer ref={footerRef} className="footer reveal">
        <span>Dwight Fernandez</span>
        <span>© 2026 · Built with React & Supabase</span>
      </footer>

    </div>
  );
}

export default App;