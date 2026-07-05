import React from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Music,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import "./styles.css";

const email = "cynthia.liu2004@gmail.com";
const linkedinUrl = "https://www.linkedin.com/in/cynthialiu2004/";
const githubUrl = "https://github.com/";
const spotifySongUrl = "https://open.spotify.com/";
const spotifySong = {
  title: "Currently playing",
  artist: "Add your Spotify song link",
};

const navItems = [
  ["about", "about"],
  ["music", "music"],
  ["projects", "projects"],
  ["experience", "experience"],
  ["notes", "notes"],
  ["contact", "contact"],
];

const projects = [
  {
    title: "Personal Operating Notes",
    description: "A small writing system for decisions, reflections, and patterns I want to remember.",
  },
  {
    title: "Small Useful Tools",
    description: "Focused prototypes for planning, learning, and everyday creative work.",
  },
  {
    title: "Thoughtful Interfaces",
    description: "Interface studies around calm defaults, honest language, and attention-respecting flows.",
  },
];

const experience = [
  {
    role: "Creative technologist",
    place: "Personal projects",
    time: "Now",
  },
  {
    role: "Product-minded builder",
    place: "Tools, writing, systems",
    time: "Ongoing",
  },
];

const notes = [
  "Designing tools that make people feel more capable.",
  "Writing to turn vague instincts into something clearer.",
  "Building smaller things before naming the bigger pattern.",
];

function App() {
  return (
    <main className="page">
      <header className="hero" id="top">
        <div className="socials" aria-label="Social links">
          <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin size={21} aria-hidden="true" />
          </a>
          <a href={`mailto:${email}`} aria-label="Email">
            <Mail size={21} aria-hidden="true" />
          </a>
          <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github size={21} aria-hidden="true" />
          </a>
          <a href={spotifySongUrl} target="_blank" rel="noreferrer" aria-label="Spotify song">
            <Music size={21} aria-hidden="true" />
          </a>
        </div>

        <section className="profile-card" aria-label="Profile introduction">
          <div className="avatar">
            <span>C</span>
          </div>
          <div className="profile-copy">
            <p className="eyebrow">
              <Sparkles size={15} aria-hidden="true" />
              personal website
            </p>
            <h1>Cynthia</h1>
            <p>
              I make thoughtful software, systems, and notes. I&apos;m drawn to
              the overlap between design, language, and tools that make real
              life feel a little clearer.
            </p>
            <div className="location">
              <MapPin size={17} aria-hidden="true" />
              California + Washington
            </div>
          </div>
        </section>

        <div className="hero-side">
          <nav className="side-nav" aria-label="Page sections">
            <a className="name-link" href="#top">cynthia</a>
            {navItems.map(([href, label]) => (
              <a key={href} href={`#${href}`}>{label}</a>
            ))}
          </nav>
          <a className="now-playing" href={spotifySongUrl} target="_blank" rel="noreferrer">
            <span>
              <Music size={16} aria-hidden="true" />
              now playing
            </span>
            <strong>{spotifySong.title}</strong>
            <small>{spotifySong.artist}</small>
          </a>
        </div>
      </header>

      <section className="section about" id="about">
        <div className="section-label">about</div>
        <div>
          <h2>Hi, I&apos;m Cynthia.</h2>
          <p>
            This is a small home base for my work, experiments, and writing. I
            like building useful things with a clear point of view, especially
            when the details make people feel more capable.
          </p>
        </div>
      </section>

      <section className="section music-section" id="music">
        <div className="section-label">music</div>
        <div>
          <h2>Currently playing</h2>
          <a className="music-card" href={spotifySongUrl} target="_blank" rel="noreferrer">
            <div className="album-art">
              <Music size={30} aria-hidden="true" />
            </div>
            <div>
              <p>Spotify</p>
              <h3>{spotifySong.title}</h3>
              <span>{spotifySong.artist}</span>
            </div>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="section-label">projects</div>
        <div className="card-list">
          {projects.map((project) => (
            <article className="item-card" key={project.title}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <a href="#contact">
                details
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="experience">
        <div className="section-label">experience</div>
        <div className="timeline">
          {experience.map((item) => (
            <article className="timeline-row" key={`${item.role}-${item.place}`}>
              <div>
                <h3>{item.role}</h3>
                <p>{item.place}</p>
              </div>
              <time>{item.time}</time>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="notes">
        <div className="section-label">notes</div>
        <ul className="notes-list">
          {notes.map((note) => (
            <li key={note}>
              <NotebookPen size={17} aria-hidden="true" />
              {note}
            </li>
          ))}
        </ul>
      </section>

      <section className="section contact" id="contact">
        <div className="section-label">contact</div>
        <div>
          <h2>Let&apos;s connect.</h2>
          <p>
            Open to thoughtful conversations, collaborations, and notes from
            people making careful things.
          </p>
          <a className="email-link" href={`mailto:${email}`}>
            {email}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
