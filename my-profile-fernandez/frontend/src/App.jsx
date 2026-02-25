import { useEffect, useState, useRef } from 'react';
import { supabase } from './supabaseClient';
import avatar            from './profile.png';
import blondeCover       from './blonde.png';
import gnxCover          from './gnx.png';
import freudianCover     from './freudian.png';
import jesusisskingCover from './Jesusisking.png';
import apricotCover      from './apricotprincess.png';
import friends1 from './Friends_1.png';
import friends2 from './Friends_2.png';
import friends3 from './Friends_3.png';
import friends4 from './Friends_4.png';
import friends5 from './Friends_5.png';
import friends6 from './Friends_6.png';
import friends7 from './Friends_7.png';
import family1  from './Family Picture 1.png';
import family2  from './Family Picture 2.png';
import family3  from './Family Picture 3.png';
import song1Audio from './Dear April (Side A - Acoustic).mp3';
import song2Audio from './Dulo Ng Hangganan.mp3';
import song3Audio from './Lovers Rock.mp3';
import song4Audio from './Happiness.mp3';
import song5Audio from './SUPERPOSITION (feat. John Mayer).mp3';
import song6Audio from './Who Knows.mp3';
import song7Audio from './Lover, You Should Have Come Over.mp3';
import song8Audio from './Last Night on Earth.mp3';
import song9Audio from './About You.mp3';
import song1Cover from './Dear April (Side A - Acoustic)_cover.png';
import song2Cover from './Dulo Ng Hangganan_cover.png';
import song3Cover from './Lovers Rock_cover.png';
import song4Cover from './Happiness_cover.png';
import song5Cover from './SUPERPOSITION (feat. John Mayer)_cover.png';
import song6Cover from './Who Knows_cover.png';
import song7Cover from './Lover, You Should Have Come Over_cover.png';
import song8Cover from './Last Night on Earth_cover.png';
import song9Cover from './About You_cover.png';
import './App.css';

const TRACKS = [
  { title: 'Dear April (Side A - Acoustic)',    artist: 'Frank Ocean',       cover: song1Cover, audio: song1Audio },
  { title: 'Dulo Ng Hangganan',                 artist: 'IV OF SPADES',      cover: song2Cover, audio: song2Audio },
  { title: 'Lovers Rock',                       artist: 'TV Girl',           cover: song3Cover, audio: song3Audio },
  { title: 'Happiness',                         artist: 'Rex Orange County', cover: song4Cover, audio: song4Audio },
  { title: 'SUPERPOSITION (feat. John Mayer)',  artist: 'Daniel Caesar',     cover: song5Cover, audio: song5Audio },
  { title: 'Who Knows',                         artist: 'Daniel Caesar',     cover: song6Cover, audio: song6Audio },
  { title: 'Lover, You Should Have Come Over',  artist: 'Jeff Buckley',     cover: song7Cover, audio: song7Audio },
  { title: 'Last Night on Earth',               artist: 'Green Day',      cover: song8Cover, audio: song8Audio },
  { title: 'About You',                         artist: 'The 1975',      cover: song9Cover, audio: song9Audio },
  
];

const TIMELINE = [
  { date: 'Aug 2024', title: 'Started BSIT', desc: 'Enrolled at Asia Pacific College, beginning my journey in Information Technology.' },
  { date: 'Day 0', title: 'The enjoyment has not been found every since (cope)', desc: 'Search continues. Compiler still running. No results yet.', highlight: true },
  { date: 'Feb of 2026', title: 'Built this portfolio', desc: 'Put real time and effort into crafting something that represents who I am as a developer.' },
];

const SKILLS = [
  {
    category: 'Languages',
    items: [
      { name: 'JavaScript', icon: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="3" fill="#F7DF1E"/><path d="M6.5 17.5C6.9 18.2 7.5 18.7 8.5 18.7C9.5 18.7 10.1 18.2 10.1 17.3C10.1 16.3 9.5 15.9 8.4 15.4L7.8 15.1C6.2 14.4 5.1 13.6 5.1 11.7C5.1 10 6.4 8.7 8.4 8.7C9.8 8.7 10.8 9.2 11.5 10.4L9.9 11.4C9.5 10.7 9.1 10.4 8.4 10.4C7.7 10.4 7.2 10.9 7.2 11.6C7.2 12.5 7.7 12.9 8.8 13.4L9.4 13.7C11.2 14.5 12.3 15.2 12.3 17.2C12.3 19.3 10.7 20.4 8.6 20.4C6.5 20.4 5.2 19.4 4.6 18.1L6.5 17.5ZM13.5 17.3C14 18.2 14.8 18.7 15.9 18.7C17 18.7 17.5 18.1 17.5 17.4V8.9H19.6V17.4C19.6 19.3 18.4 20.4 16 20.4C13.8 20.4 12.5 19.3 11.9 17.9L13.5 17.3Z" fill="#222"/></svg>) },
      { name: 'HTML', icon: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 2l1.5 17L12 21l7.5-2L21 2H3z" fill="#E44D26"/><path d="M12 19.5l6.1-1.7 1.3-14.8H12v16.5z" fill="#F16529"/><path d="M12 11H8.5l-.2-2.5H12V6H5.8l.6 6.5H12V11zm0 5.5l-.1.1-3.2-.9-.2-2.2H6l.4 4.4 5.6 1.6V16.5z" fill="#EBEBEB"/><path d="M12 11v2.5h3.3l-.3 3.1-3 .9v2.5l5.6-1.6.4-4.9H12zm0-5v2.5h6.4l-.2-2.5H12z" fill="#fff"/></svg>) },
      { name: 'CSS', icon: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 2l1.5 17L12 21l7.5-2L21 2H3z" fill="#264DE4"/><path d="M12 19.5l6.1-1.7 1.3-14.8H12v16.5z" fill="#2965F1"/><path d="M12 11H8.3l-.2-2.5H12V6H5.8l.6 6.5H12V11zm0 5.5-.1.1-3.1-.9-.2-2.2H6.3l.4 4.4 5.3 1.6V16.5z" fill="#EBEBEB"/><path d="M12 11v2.5h3l-.3 3.1-2.7.8v2.6l5.3-1.6.4-4.9H12zm0-5v2.5h6.1l-.2-2.5H12z" fill="#fff"/></svg>) },
      { name: 'SQL', icon: (<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="3" fill="#00758F"/><ellipse cx="12" cy="7" rx="7" ry="3" fill="#F29111"/><path d="M5 7v4c0 1.66 3.13 3 7 3s7-1.34 7-3V7" stroke="#F29111" strokeWidth="1.2" fill="none"/><path d="M5 11v4c0 1.66 3.13 3 7 3s7-1.34 7-3v-4" stroke="#F29111" strokeWidth="1.2" fill="none"/></svg>) },
      { name: 'Python', icon: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.9 2C7.9 2 8.1 3.8 8.1 3.8V5.9h3.9v.6H5.8S3 6.2 3 10.2s2.5 3.9 2.5 3.9H7V12s-.1-2.5 2.5-2.5h4.3s2.4.1 2.4-2.3V4.3C16.2 2 11.9 2 11.9 2zm-1.4 1.4c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z" fill="#366A96"/><path d="M12.1 22c4 0 3.8-1.8 3.8-1.8v-2.1h-3.9v-.6h6.2S21 17.8 21 13.8s-2.5-3.9-2.5-3.9H17v2.1s.1 2.5-2.5 2.5H10.2s-2.4-.1-2.4 2.3v3.9c0 2.3 4.3 2.3 4.3 2.3zm1.4-1.4c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z" fill="#FFC331"/></svg>) },
    ],
  },
  {
    category: 'Frontend',
    items: [
      { name: 'React', icon: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="2.1" fill="#61DAFB"/><ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#61DAFB" strokeWidth="1.2" fill="none"/><ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)"/></svg>) },
      { name: 'Tailwind CSS', icon: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C9.6 6 8.1 7.2 7.5 9.6c.9-1.2 1.95-1.65 3.15-1.35.685.171 1.174.668 1.715 1.218C13.28 10.47 14.22 11.4 16.5 11.4c2.4 0 3.9-1.2 4.5-3.6-.9 1.2-1.95 1.65-3.15 1.35-.685-.171-1.174-.668-1.715-1.218C15.22 6.932 14.28 6 12 6zM7.5 11.4C5.1 11.4 3.6 12.6 3 15c.9-1.2 1.95-1.65 3.15-1.35.685.171 1.174.668 1.715 1.218C8.78 15.87 9.72 16.8 12 16.8c2.4 0 3.9-1.2 4.5-3.6-.9 1.2-1.95 1.65-3.15 1.35-.685-.171-1.174-.668-1.715-1.218C10.72 12.332 9.78 11.4 7.5 11.4z" fill="#38BDF8"/></svg>) },
      { name: 'Responsive Design', icon: (<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="14" height="10" rx="1.5" stroke="#A78BFA" strokeWidth="1.5"/><rect x="16" y="8" width="6" height="7" rx="1" stroke="#A78BFA" strokeWidth="1.5"/><path d="M6 18h6" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 15v3" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round"/></svg>) },
    ],
  },
  {
    category: 'Tools & Platforms',
    items: [
      { name: 'Supabase', icon: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sb" x1="3" y1="2.5" x2="21.5" y2="21.5" gradientUnits="userSpaceOnUse"><stop stopColor="#3ECF8E"/><stop offset="1" stopColor="#1a9e6a"/></linearGradient></defs><path d="M13.5 2.5L3 14.5h8V21.5l10.5-12H13.5V2.5z" fill="url(#sb)" stroke="#3ECF8E" strokeWidth="0.5"/></svg>) },
      { name: 'PostgreSQL', icon: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.1 3.4c-.9-.3-2-.4-3.1-.2-.6-1.1-1.6-1.8-2.8-2C9 .9 6.9 2.4 6 4.7c-1.2.2-2.2.8-2.8 1.8C2.1 8 2.4 10.2 3.7 11.9c-.2.8-.2 1.6.1 2.4.6 1.5 2 2.4 3.6 2.4.3 0 .7 0 1-.1l.1.4c.3 1.2 1 2.1 2 2.6.6.3 1.3.4 2 .3.6-.1 1.2-.4 1.7-.8.4.3.9.5 1.4.5h.3c1.1-.1 2-.9 2.3-2l.1-.4c1.3.4 2.7 0 3.5-1.1.9-1.2.9-2.9.1-4.3.5-.7.7-1.5.7-2.4 0-2.2-1.2-4.1-3.2-5.1-.6-.2-.6-.2-.5-.2z" fill="#336791"/></svg>) },
      { name: 'Git', icon: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.3 11.3L12.7 1.7a1 1 0 00-1.4 0L9.1 3.9l2.5 2.5a1.2 1.2 0 011.5 1.5l2.4 2.4a1.2 1.2 0 011.1 2 1.2 1.2 0 01-1.2 1.2 1.2 1.2 0 01-1.2-1.2c0-.2 0-.3.1-.5L11.9 9v6.3a1.2 1.2 0 01.3 2.3 1.2 1.2 0 01-1.2-1.2 1.2 1.2 0 011-1.2V8.8a1.2 1.2 0 01-.7-1.6L8.8 4.7 1.7 11.8a1 1 0 000 1.4l9.6 9.6a1 1 0 001.4 0l9.6-9.6a1 1 0 000-1.4v.1z" fill="#F05032"/></svg>) },
      { name: 'GitHub', icon: (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>) },
      { name: 'VS Code', icon: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 1.5l-8.9 8.2L3.4 6 1.5 7l4 5-4 5 1.9 1 4.7-3.7L17 22.5l5.5-2.7V4.2L17 1.5z" fill="#007ACC"/><path d="M17 6.1L9.8 12 17 17.9V6.1z" fill="#fff" opacity=".5"/></svg>) },
      { name: 'Figma', icon: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 2h4a4 4 0 010 8H8V2z" fill="#F24E1E"/><path d="M8 10h4a4 4 0 010 8H8v-8z" fill="#FF7262"/><path d="M8 18a4 4 0 100 0z" fill="#1ABCFE"/><path d="M16 6a4 4 0 110 0z" fill="#0ACF83"/><path d="M8 2H4a4 4 0 000 8h4V2z" fill="#A259FF"/></svg>) },
    ],
  },
];

const PROJECTS = [
  { name: 'Guestbook App', desc: 'A real-time visitor guestbook with likes, built with React and Supabase. Features dark mode and live database sync.', tags: ['React', 'Supabase', 'PostgreSQL'], href: '#' },
  { name: 'Portfolio Website', desc: 'This site — a clean, minimal developer portfolio designed for clarity and personality.', tags: ['React', 'CSS'], href: '#' },
];

const ALBUMS = [
  { title: 'Blonde',           artist: 'Frank Ocean',       cover: blondeCover,       spotify: 'https://open.spotify.com/album/3mH6qwIy9crq0I9YQbOuDf?si=59b3e2e34c804261' },
  { title: 'GNX',              artist: 'Kendrick Lamar',    cover: gnxCover,          spotify: 'https://open.spotify.com/album/0hvT3yIEysuuvkK73vgdcW?si=453acc8451ad4246' },
  { title: 'Freudian',         artist: 'Daniel Caesar',     cover: freudianCover,     spotify: 'https://open.spotify.com/album/4E1XUBMTpLO7GpBzUo65Jp?si=KjqMCwFZSr6mRE5NYTp0Eg' },
  { title: 'JESUS IS KING',    artist: 'Kanye West',        cover: jesusisskingCover, spotify: 'https://open.spotify.com/album/0FgZKfoU2Br5sHOfvZKTI9?si=45cbe3b5671c45bc' },
  { title: 'Apricot Princess', artist: 'Rex Orange County', cover: apricotCover,      spotify: 'https://open.spotify.com/album/4DxNdQzm6cBYuSn4dCimmT?si=e4d9882065e843d7' },
];

const GALLERY = [
  { category: 'Friends', photos: [friends1, friends2, friends3, friends4, friends5, friends6, friends7] },
  { category: 'Family',  photos: [family1, family2, family3] },
];

const RESOURCES = [
  { category: 'Fonts', items: [
    { name: 'DM Serif Display & DM Sans', source: 'Google Fonts', url: 'https://fonts.google.com/specimen/DM+Serif+Display' },
  ]},
  { category: 'Backend & Database', items: [
    { name: 'Supabase (BaaS — database, auth, realtime)', source: 'Supabase Inc.', url: 'https://supabase.com' },
  ]},
  { category: 'Libraries & Frameworks', items: [
    { name: 'React 18', source: 'Meta Open Source', url: 'https://react.dev' },
    { name: 'React DOM', source: 'Meta Open Source', url: 'https://react.dev' },
    { name: '@supabase/supabase-js', source: 'Supabase Inc.', url: 'https://github.com/supabase/supabase-js' },
  ]},
  { category: 'Deployment', items: [
    { name: 'Vercel (hosting & CI/CD)', source: 'Vercel Inc.', url: 'https://vercel.com' },
  ]},
  { category: 'Design Inspiration', items: [
    { name: 'Vinyl record UI concept', source: 'Personal design — CSS animation by Dwight Fernandez', url: null },
    { name: 'Cursor glow effect', source: 'CSS radial-gradient technique — self-implemented', url: null },
  ]},
  { category: 'AI Assistance', items: [
    { name: 'ChatGPT (OpenAI) — component structure, layout, CSS, Supabase integration, debugging', source: 'OpenAI', url: 'https://chatgpt.com/share/699dae18-15ec-8012-af5f-0f858686f5bb' },
    { name: 'Claude (Anthropic) — scroll-reveal, CSS animations, Resources section', source: 'Anthropic', url: 'https://claude.ai' },
  ]},
];

function useScrollReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('visible'); observer.unobserve(el); }
    }, { threshold: 0.12, ...options });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function App() {
  const [entries, setEntries]               = useState([]);
  const [form, setForm]                     = useState({ name: '', message: '' });
  const [darkMode, setDarkMode]             = useState(true);
  const [loading, setLoading]               = useState(false);
  const [visitorCount, setVisitorCount]     = useState(null);
  const [aboutOpen, setAboutOpen]           = useState(false);
  const [activeCategory, setActiveCategory] = useState('Friends');
  const [lightbox, setLightbox]             = useState(null);
  const [toast, setToast]                   = useState(null);
  const [likedIds, setLikedIds]             = useState(() => {
    const stored = localStorage.getItem('guestbook_likes');
    return stored ? JSON.parse(stored) : [];
  });

  
  const [playerIndex, setPlayerIndex] = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [progress, setProgress]       = useState(0);
  const [duration, setDuration]       = useState(0);
  const [isExpanded, setIsExpanded]   = useState(false);
  const [volume, setVolume]           = useState(1);
  const [muted, setMuted]             = useState(false);
  const [shuffle, setShuffle]         = useState(false);
  const audioRef                      = useRef(null);

  const currentTrack = TRACKS[playerIndex];

  const getNextIndex = (current) => {
    if (!shuffle || TRACKS.length <= 1) return (current + 1) % TRACKS.length;
    let next;
    do { next = Math.floor(Math.random() * TRACKS.length); } while (next === current);
    return next;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = currentTrack.audio;
    audio.load();
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
  }, [playerIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.play().catch(() => setIsPlaying(false)); }
    else { audio.pause(); }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(p => !p);
  const prevTrack  = () => { setPlayerIndex(i => (i - 1 + TRACKS.length) % TRACKS.length); setProgress(0); };
  const nextTrack  = () => { setPlayerIndex(i => getNextIndex(i)); setProgress(0); };

  const handleTimeUpdate     = () => { const a = audioRef.current; if (!a || !a.duration) return; setProgress((a.currentTime / a.duration) * 100); };
  const handleLoadedMetadata = () => setDuration(audioRef.current?.duration || 0);
  const handleSeek = (e) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    a.currentTime = pct * a.duration;
    setProgress(pct * 100);
  };
  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val); setMuted(val === 0);
    if (audioRef.current) audioRef.current.volume = val;
  };
  const toggleMute = () => {
    const next = !muted; setMuted(next);
    if (audioRef.current) audioRef.current.volume = next ? 0 : volume;
  };
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    return `${Math.floor(secs / 60)}:${Math.floor(secs % 60).toString().padStart(2, '0')}`;
  };
  const currentTime = audioRef.current ? audioRef.current.currentTime : 0;
  
  const [cursor, setCursor] = useState({ x: -999, y: -999 });

  useEffect(() => { const m = (e) => setCursor({ x: e.clientX, y: e.clientY }); window.addEventListener('mousemove', m); return () => window.removeEventListener('mousemove', m); }, []);
  useEffect(() => { const k = (e) => { if (e.key === 'Escape') setLightbox(null); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }, [toast]);

  const timelineRef  = useScrollReveal();
  const skillsRef    = useScrollReveal();
  const projectsRef  = useScrollReveal();
  const aboutRef     = useScrollReveal();
  const albumsRef    = useScrollReveal();
  const galleryRef   = useScrollReveal();
  const guestRef     = useScrollReveal();
  const resourcesRef = useScrollReveal();
  const footerRef    = useScrollReveal();

  const fetchEntries = async () => {
    const { data } = await supabase.from('guestbook').select('*').order('created_at', { ascending: false });
    setEntries(data || []);
  };

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.from('visitor_count').select('count').eq('id', 1).single();
      if (data) { const n = data.count + 1; await supabase.from('visitor_count').update({ count: n }).eq('id', 1); setVisitorCount(n); }
    };
    run();
  }, []);

  useEffect(() => { fetchEntries(); }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    document.getElementById('root')?.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.from('guestbook').insert([{ name: form.name, message: form.message }]);
    if (!error) { setForm({ name: '', message: '' }); fetchEntries(); setToast('success'); }
    else { setToast('error'); }
    setLoading(false);
  };

  const handleLike = async (id, currentLikes) => {
    if (likedIds.includes(id)) return;
    await supabase.from('guestbook').update({ likes: currentLikes + 1 }).eq('id', id);
    const updated = [...likedIds, id];
    setLikedIds(updated);
    localStorage.setItem('guestbook_likes', JSON.stringify(updated));
    fetchEntries();
  };

  const activePhotos = GALLERY.find(g => g.category === activeCategory)?.photos || [];

  return (
    <div className="page">

      <div className="cursor-glow" style={{ left: cursor.x, top: cursor.y }} />

      {toast && (
        <div className={`toast toast-${toast}`}>
          {toast === 'success' ? '✓ Message sent! Thanks for signing the guestbook.' : '✗ Something went wrong. Please try again.'}
        </div>
      )}

      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={activePhotos[lightbox]} alt="Gallery" className="lightbox-img" onClick={e => e.stopPropagation()} />
          {lightbox > 0 && <button className="lightbox-nav lightbox-prev" onClick={e => { e.stopPropagation(); setLightbox(lightbox - 1); }}>‹</button>}
          {lightbox < activePhotos.length - 1 && <button className="lightbox-nav lightbox-next" onClick={e => { e.stopPropagation(); setLightbox(lightbox + 1); }}>›</button>}
        </div>
      )}

      <nav className="nav">
        <img src={avatar} alt="Avatar" className="nav-avatar" />
        <div className="nav-right">
          <span className="nav-status"><span className="status-dot" />Online</span>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">{darkMode ? '☀' : '☽'}</button>
        </div>
      </nav>

      <section className="hero">
        <p className="eyebrow">IT Student</p>
        <h1>Welcome to my personal profile</h1>
        <p className="hero-description">Hi! I'm Dwight Fernandez from IT242, an IT student by day, and a gamer and gym rat by night, always looking to learn, build, and level up in everything I do.</p>
        <div className="social-links">
          <a className="social-link" href="https://github.com/dwightening26" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg><span>GitHub</span></a>
          <a className="social-link" href="https://www.linkedin.com/in/dwight-fernandez-172978322/" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg><span>LinkedIn</span></a>
          <a className="social-link" href="https://instagram.com/dwightening_" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg><span>Instagram</span></a>
          <a className="social-link" href="mailto:ddfernandez@student.apc.edu.ph"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg><span>Email</span></a>
        </div>
      </section>

      <section ref={aboutRef} className="section reveal">
        <button className="about-toggle" onClick={() => setAboutOpen(!aboutOpen)} aria-expanded={aboutOpen}>
          <span className="section-label about-label">About Me</span>
          <span className={`about-chevron ${aboutOpen ? 'open' : ''}`}>↓</span>
        </button>
        <div className={`about-body ${aboutOpen ? 'expanded' : ''}`}>
          <p className="about-text">I'm a 2nd-year IT student who's still finding his craft in his course, but I'm passionate about learning and experimenting with web technologies. I enjoy tackling real-world problems through clean, efficient code and thoughtful UI design. Outside of tech, you'll usually find me at the gym or immersed in gaming bringing the same focus and dedication to every challenge I take on.</p>
        </div>
      </section>

      <section ref={timelineRef} className="section reveal">
        <h2 className="section-label">Journey</h2>
        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <div key={i} className={`timeline-item ${item.highlight ? 'timeline-highlight' : ''}`}>
              <div className="timeline-left"><span className="timeline-date">{item.date}</span><div className="timeline-line" /></div>
              <div className="timeline-right"><h3 className="timeline-title">{item.title}</h3><p className="timeline-desc">{item.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider"><span className="section-divider-dot" /></div>

      <section ref={skillsRef} className="section reveal">
        <h2 className="section-label">Tech Stack</h2>
        <div className="skills-section">
          {SKILLS.map((group, i) => (
            <div key={i} className="skills-group">
              <span className="skills-category">{group.category}</span>
              <div className="skills-wrap">{group.items.map((skill) => (<div key={skill.name} className="skill-icon" data-tooltip={skill.name}>{skill.icon}</div>))}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider"><span className="section-divider-dot" /></div>

      <section ref={projectsRef} className="section reveal">
        <h2 className="section-label">Selected Projects</h2>
        <div className="projects-list">
          {PROJECTS.map((project, i) => (
            <a key={i} className="project-row" href={project.href}>
              <div className="project-left">
                <span className="project-num">0{i + 1}</span>
                <div><h3 className="project-name">{project.name}</h3><p className="project-desc">{project.desc}</p><div className="project-tags">{project.tags.map(tag => (<span key={tag} className="project-tag">{tag}</span>))}</div></div>
              </div>
              <span className="project-arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      <div className="section-divider"><span className="section-divider-dot" /></div>

      <section ref={albumsRef} className="section reveal">
        <h2 className="section-label">Favorite Albums</h2>
        <div className="albums-grid">
          {ALBUMS.map((album, i) => (
            <a key={i} className="vinyl-card" href={album.spotify} target="_blank" rel="noreferrer" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="vinyl-wrap"><div className="vinyl-record"><img src={album.cover} alt={album.title} className="vinyl-cover" /><div className="vinyl-hole" /></div></div>
              <div className="vinyl-info"><p className="vinyl-album">{album.title}</p><p className="vinyl-artist">{album.artist}</p></div>
            </a>
          ))}
        </div>
      </section>

      <div className="section-divider"><span className="section-divider-dot" /></div>

      <section ref={galleryRef} className="section reveal">
        <h2 className="section-label">Gallery</h2>
        <div className="gallery-tabs">
          {GALLERY.map(g => (<button key={g.category} className={`gallery-tab ${activeCategory === g.category ? 'active' : ''}`} onClick={() => setActiveCategory(g.category)}>{g.category}</button>))}
        </div>
        <div className="masonry-grid">
          {activePhotos.map((photo, i) => (
            <div key={i} className="masonry-item" onClick={() => setLightbox(i)}>
              <img src={photo} alt={`${activeCategory} ${i + 1}`} className="masonry-img" />
              <div className="masonry-overlay"><span className="masonry-zoom">⤢</span></div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider"><span className="section-divider-dot" /></div>

      <section ref={guestRef} className="section reveal">
        <h2 className="section-label">Guestbook</h2>
        <div className="guestbook-form">
          <form onSubmit={handleSubmit}>
            <input className="field" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <textarea className="field" placeholder="Leave a message…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={3} />
            <div className="form-footer">
              <span className="guest-count">{entries.length} {entries.length === 1 ? 'message' : 'messages'}</span>
              <button className="btn-primary" type="submit">{loading ? 'Signing…' : 'Sign Guestbook'}</button>
            </div>
          </form>
        </div>
        {entries.length > 0 && (
          <div className="entries-list">
            {entries.map((entry, i) => (
              <div key={entry.id} className="entry-item" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="entry-top"><strong className="entry-name">{entry.name}</strong><span className="entry-date">{new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                <p className="entry-msg">{entry.message}</p>
                <button className={`like-btn ${likedIds.includes(entry.id) ? 'liked' : ''}`} onClick={() => handleLike(entry.id, entry.likes || 0)} disabled={likedIds.includes(entry.id)}>♥ {entry.likes || 0}</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="section-divider"><span className="section-divider-dot" /></div>

      <section ref={resourcesRef} className="section reveal">
        <h2 className="section-label">Resources & Credits</h2>
        <div className="resources-list">
          {RESOURCES.map((group, i) => (
            <div key={i} className="resource-group">
              <span className="resource-category">{group.category}</span>
              <ul className="resource-items">
                {group.items.map((item, j) => (
                  <li key={j} className="resource-item">
                    <span className="resource-name">{item.name}</span>
                    <span className="resource-sep">·</span>
                    {item.url ? <a className="resource-source resource-link" href={item.url} target="_blank" rel="noreferrer">{item.source} ↗</a> : <span className="resource-source">{item.source}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer ref={footerRef} className="footer reveal">
        <span className="footer-name">Dwight Fernandez</span>
        {visitorCount && <span className="footer-visitor">You are visitor #{visitorCount.toLocaleString()}</span>}
        <span className="footer-copy">© 2026 · Built with React & Supabase</span>
      </footer>

      {/* MUSIC PLAYER */}
      <audio ref={audioRef} src={currentTrack.audio} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={nextTrack} />

      <div className={`music-player ${isExpanded ? 'expanded' : ''}`}>

        <div className="player-collapsed" onClick={() => setIsExpanded(e => !e)}>
          <img src={currentTrack.cover} alt={currentTrack.title} className={`player-cover ${isPlaying ? 'spinning' : ''}`} />
          <div className="player-info">
            <span className="player-label">{isPlaying ? 'Now Playing' : 'Paused'}</span>
            <span className="player-track">{currentTrack.title}</span>
            <span className="player-artist">{currentTrack.artist}</span>
          </div>
          {isPlaying ? (<div className="now-playing-bars"><span className="bar" /><span className="bar" /><span className="bar" /><span className="bar" /></div>) : (<span className="player-expand-icon">▲</span>)}
        </div>

        {isExpanded && (
          <div className="player-expanded">

            <img src={currentTrack.cover} alt={currentTrack.title} className={`player-big-cover ${isPlaying ? 'spinning' : ''}`} />

            <div className="player-expanded-info">
              <p className="player-expanded-track">{currentTrack.title}</p>
              <p className="player-expanded-artist">{currentTrack.artist}</p>
            </div>

            <div className="player-progress-wrap" onClick={handleSeek}>
              <div className="player-progress-bg"><div className="player-progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>
            <div className="player-timestamps"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>

            <div className="player-controls">
              <button className={`player-btn player-btn-shuffle ${shuffle ? 'active' : ''}`} onClick={() => setShuffle(s => !s)} title={shuffle ? 'Shuffle On' : 'Shuffle Off'}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
              </button>
              <button className="player-btn" onClick={prevTrack} title="Previous">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
              </button>
              <button className="player-btn player-btn-main" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
              </button>
              <button className="player-btn" onClick={nextTrack} title="Next">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2-8.14 5.5 3.89L8 15.64V9.86zM16 6h2v12h-2z"/></svg>
              </button>
            </div>

            <div className="player-volume">
              <button className="player-vol-icon" onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'}>
                {muted || volume === 0
                  ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-3-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18l1.73 1.73L21 18.46 5.54 3 4.27 3zM12 4 9.91 6.09 12 8.18V4z"/></svg>
                  : volume < 0.5
                  ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>
                  : <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                }
              </button>
              <input className="player-vol-slider" type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={handleVolume} />
              <span className="player-vol-pct">{muted ? 0 : Math.round(volume * 100)}%</span>
            </div>

            <div className="player-tracklist">
              {TRACKS.map((track, i) => (
                <button key={i} className={`player-track-row ${i === playerIndex ? 'active' : ''}`} onClick={() => { setPlayerIndex(i); setProgress(0); setIsPlaying(true); }}>
                  <img src={track.cover} alt={track.title} className="player-track-thumb" />
                  <div className="player-track-meta">
                    <span className="player-track-name">{track.title}</span>
                    <span className="player-track-sub">{track.artist}</span>
                  </div>
                  {i === playerIndex && isPlaying && (<div className="now-playing-bars mini"><span className="bar" /><span className="bar" /><span className="bar" /><span className="bar" /></div>)}
                </button>
              ))}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}

export default App;