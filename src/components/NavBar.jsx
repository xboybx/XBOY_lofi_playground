import { navIcons, navLinks, locations } from "#constants";
import useWindowStore from '#store/window';
import useLocationStore from '#store/location';
import { useSiteStore } from '../store/siteStore';
import { useEffect, useRef, useCallback, useMemo } from "react";
import React from "react";
import Clock from './Clock';
import NavLink from "./NavLink";
import {
  Instagram,
  Youtube,
  Github,
  Linkedin,
  Mail,
  Music as MusicIcon // Renamed to avoid confusion with window types
} from 'lucide-react';

// Only import heavy dependencies on desktop
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

const NavBar = React.memo(() => {

  const openWindow = useWindowStore(state => state.openWindow);
  const setActiveLocation = useLocationStore(state => state.setActiveLocation);
  const { data: siteData } = useSiteStore();

  const activeSocials = useMemo(() => {
    if (!siteData?.socials) return [];

    const platforms = [
      { key: 'github', icon: <Github size={18} />, label: 'GitHub' },
      { key: 'linkedin', icon: <Linkedin size={18} />, label: 'LinkedIn' },
      { key: 'instagram', icon: <Instagram size={18} />, label: 'Instagram' },
      { key: 'youtube', icon: <Youtube size={18} />, label: 'YouTube' },
      { key: 'email', icon: <Mail size={18} />, label: 'Email', isMail: true },
    ];

    return platforms
      .filter(p => siteData.socials[p.key])
      .map(p => ({
        ...p,
        url: p.isMail ? `mailto:${siteData.socials[p.key]}` : siteData.socials[p.key]
      }));
  }, [siteData?.socials]);

  const activeMusicPlatforms = useMemo(() => {
    if (!siteData?.socials) return [];

    const platforms = [
      { key: 'spotify', label: 'Spotify', icon: 'https://cdn.simpleicons.org/spotify/1c1c1c' },
      { key: 'appleMusic', label: 'Apple Music', icon: 'https://cdn.simpleicons.org/apple/1c1c1c' },
      { key: 'ytMusic', label: 'YouTube Music', icon: 'https://cdn.simpleicons.org/youtubemusic/1c1c1c' },
      { key: 'soundcloud', label: 'SoundCloud', icon: 'https://cdn.simpleicons.org/soundcloud/1c1c1c' },
      { key: 'amazonMusic', label: 'Amazon Music', icon: 'https://img.icons8.com/?size=100&id=xdR2e86qm3ed&format=png&color=000000' },
    ];

    return platforms
      .filter(p => siteData.socials[p.key])
      .map(p => ({ ...p, url: siteData.socials[p.key] }));
  }, [siteData?.socials]);

  const wrapperRef = useRef(null);
  const gifRef = useRef(null);
  const logoPortfolioRef = useRef(null);
  const logoPortfolioPlaceholderRef = useRef(null);

  useEffect(() => {
    // Skip animations on mobile for better performance
    if (isMobile) return;

    // Dynamically import GSAP only on desktop
    Promise.all([
      import('gsap'),
      import('gsap/Draggable')
    ]).then(([{ gsap }, { Draggable }]) => {
      const wrapper = wrapperRef.current;
      const logoPortfolio = logoPortfolioRef.current;
      const logoPortfolioPlaceholder = logoPortfolioPlaceholderRef.current;

      if (!wrapper) return;

      // Hide placeholders initially
      if (logoPortfolioPlaceholder) {
        gsap.set(logoPortfolioPlaceholder, { opacity: 0 });
      }

      // Implement drag functionality for logo + portfolio text
      if (logoPortfolio && logoPortfolioPlaceholder) {
        const snapThreshold = 500;

        Draggable.create(logoPortfolio, {
          type: "x,y",
          bounds: "body",
          cursor: "grab",
          activeCursor: "grabbing",
          zIndexBoost: false,
          onDragStart: function () {
            gsap.to(logoPortfolioPlaceholder, { opacity: 1, duration: 0.2 });
          },
          onDragEnd: function () {
            const isWithinSnapZone =
              Math.abs(this.x) < snapThreshold &&
              Math.abs(this.y) < snapThreshold;

            if (isWithinSnapZone) {
              gsap.to(this.target, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            }

            gsap.to(logoPortfolioPlaceholder, { opacity: 0, duration: 0.2 });
          }
        });
      }
    });
  }, []);

  const handleNavLinkClick = useCallback((type) => {
    if (!type) return;

    if (type === 'finder') {
      setActiveLocation(locations.work);
    }

    openWindow(type);
  }, [openWindow, setActiveLocation]);

  const handleIconClick = useCallback(({ type, action }) => {
    if (!type) return;

    openWindow(type);

    if (action === 'about') {
      setActiveLocation(locations.about);
    }
  }, [openWindow, setActiveLocation]);

  return (
    <nav>
      <div>
        {/* Draggable logo + portfolio section */}
        <div className="logo-portfolio-container" ref={logoPortfolioRef}>
          <img src="/images/logo.svg" alt="logo" />
          <div className="portfolio-wrapper" ref={wrapperRef}>
            <p className="font-bold portfolio-text">XBOY Portfolio</p>
          </div>
        </div>

        {/* Placeholder for logo + portfolio */}
        {!isMobile && (
          <div className="logo-portfolio-placeholder" ref={logoPortfolioPlaceholderRef}>
          </div>
        )}

        <ul>
          {activeMusicPlatforms.length > 0
            ? activeMusicPlatforms.map(platform => (
              <NavLink
                key={platform.key}
                name={platform.label}
                icon={platform.icon}
                link={platform.url}
              />
            ))
            : navLinks.map(link => (
              <NavLink key={link.id} {...link} onClick={() => handleNavLinkClick(link.type)} />
            ))
          }
        </ul>
      </div>
      <div>
        <ul className="flex items-center gap-4 border-r border-[#1c1c1c]/10 pr-4 mr-1">
          {activeSocials.map(social => (
            <li key={social.key}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1c1c1c]/60 hover:text-[#1c1c1c] transition-all hover:scale-110 flex items-center justify-center p-0.5"
                title={social.label}
              >
                {social.icon}
              </a>
            </li>
          ))}
        </ul>

        <ul className="flex items-center">
          {navIcons.map(({ id, img, type, action }) => (
            <li key={id} onClick={() => handleIconClick({ type, action })}>
              <img
                src={img}
                className={`icon-hover ${type ? 'cursor-pointer' : ''}`}
                alt={`icon-${id}`}
              />
            </li>
          ))}
        </ul>

        {/* Clock component with 60s updates */}
        <Clock />
      </div>
    </nav>
  );
});

NavBar.displayName = 'NavBar';

export default NavBar;
