import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Music,
} from "lucide-react";
import "./styles.css";

const email = "cynthia.liu2004@gmail.com";
const linkedinUrl = "https://www.linkedin.com/in/cynthialiu2004/";
const githubUrl = "https://github.com/cynthiayliu";
const spotifySongUrl = "https://open.spotify.com/user/31rqzev4vdpetupk43dq4vzjjxf4?si=876e584a4bfd4aeb";

const navItems = [
  ["about", "about"],
  ["experience", "experience"],
  ["gallery", "gallery"],
  ["contact", "contact"],
];

const experience = [
  {
    role: "Software Engineering Intern",
    place: "Snapchat",
    time: "2026",
  },
];

// Add pre-uploaded gallery photos here.
const galleryImages = [
  {
    src: new URL("../carouselimages/IMG_0308.jpeg", import.meta.url).href,
    alt: "Gallery photo 1",
  },
  {
    src: new URL("../carouselimages/IMG_0338.jpeg", import.meta.url).href,
    alt: "Gallery photo 2",
  },
  {
    src: new URL("../carouselimages/IMG_0384.jpeg", import.meta.url).href,
    alt: "Gallery photo 3",
  },
  {
    src: new URL("../carouselimages/IMG_0464.jpeg", import.meta.url).href,
    alt: "Gallery photo 4",
  },
  {
    src: new URL("../carouselimages/IMG_0530.jpeg", import.meta.url).href,
    alt: "Gallery photo 5",
  },
  {
    src: new URL("../carouselimages/IMG_0543.jpeg", import.meta.url).href,
    alt: "Gallery photo 6",
  },
  {
    src: new URL("../carouselimages/IMG_0758.jpeg", import.meta.url).href,
    alt: "Gallery photo 7",
  },
  {
    src: new URL("../carouselimages/IMG_0787.jpeg", import.meta.url).href,
    alt: "Gallery photo 8",
  },
  {
    src: new URL("../carouselimages/IMG_0844.jpeg", import.meta.url).href,
    alt: "Gallery photo 9",
  },
  {
    src: new URL("../carouselimages/IMG_0856.jpeg", import.meta.url).href,
    alt: "Gallery photo 10",
  },
  {
    src: new URL("../carouselimages/IMG_0919.jpeg", import.meta.url).href,
    alt: "Gallery photo 11",
  },
  {
    src: new URL("../carouselimages/IMG_1248.jpeg", import.meta.url).href,
    alt: "Gallery photo 12",
  },
  {
    src: new URL("../carouselimages/IMG_1258.jpeg", import.meta.url).href,
    alt: "Gallery photo 13",
  },
  {
    src: new URL("../carouselimages/IMG_1608.jpeg", import.meta.url).href,
    alt: "Gallery photo 14",
  },
  {
    src: new URL("../carouselimages/IMG_1647.jpeg", import.meta.url).href,
    alt: "Gallery photo 15",
  },
  {
    src: new URL("../carouselimages/IMG_1735.jpeg", import.meta.url).href,
    alt: "Gallery photo 16",
  },
  {
    src: new URL("../carouselimages/IMG_1746.jpeg", import.meta.url).href,
    alt: "Gallery photo 17",
  },
  {
    src: new URL("../carouselimages/IMG_1753.jpeg", import.meta.url).href,
    alt: "Gallery photo 18",
  },
  {
    src: new URL("../carouselimages/IMG_1861.jpeg", import.meta.url).href,
    alt: "Gallery photo 19",
  },
  {
    src: new URL("../carouselimages/IMG_1891.jpeg", import.meta.url).href,
    alt: "Gallery photo 20",
  },
];

function App() {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [imageOrientations, setImageOrientations] = useState({});
  const images = galleryImages;
  const activeImage = images[activeGalleryIndex];
  const activeOrientation = imageOrientations[activeGalleryIndex] || "landscape";

  function showPreviousImage() {
    setActiveGalleryIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }

  function showNextImage() {
    setActiveGalleryIndex((current) => (current + 1) % images.length);
  }

  function saveImageOrientation(event) {
    const { naturalHeight, naturalWidth } = event.currentTarget;
    setImageOrientations((current) => ({
      ...current,
      [activeGalleryIndex]: naturalHeight > naturalWidth ? "portrait" : "landscape",
    }));
  }

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
            <h1>Cynthia</h1>
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
        </div>
      </header>

      <section className="section about" id="about">
        <div className="section-label">about</div>
        <div>
          <h2>Hi, I&apos;m Cynthia.</h2>
          <p>
            I&apos;m studying computer science at USC, earned my BS in 2026 and
            will earn my MS in 2027.
          </p>
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

      <section className="section gallery-section" id="gallery">
        <div className="section-label">gallery</div>
        <div className="gallery">
          <div className="gallery-header">
            <h2>Recent travels</h2>
          </div>
          <div className="carousel" aria-label="Photo carousel">
            <button type="button" className="carousel-button" onClick={showPreviousImage} aria-label="Previous image">
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <figure className={`gallery-frame ${activeOrientation}`}>
              <img src={activeImage.src} alt={activeImage.alt} onLoad={saveImageOrientation} />
            </figure>
            <button type="button" className="carousel-button" onClick={showNextImage} aria-label="Next image">
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </div>
          <div className="gallery-dots" aria-label="Gallery image selector">
            {images.map((image, index) => (
              <button
                type="button"
                key={`${image.alt}-${index}`}
                className={index === activeGalleryIndex ? "active" : ""}
                onClick={() => setActiveGalleryIndex(index)}
                aria-label={`Show image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section contact" id="contact">
        <div className="section-label">contact</div>
        <div>
          <h2>Let&apos;s connect.</h2>
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
