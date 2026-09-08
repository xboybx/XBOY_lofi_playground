import React, { Suspense, lazy, useEffect, useState, useMemo } from 'react';
import useWindowStore from '#store/window';
import { useSiteStore } from './store/siteStore';
import { useIsMobile } from './hooks/useIsMobile';

// Lazy load components
const NavBar = lazy(() => import('./components/NavBar.jsx'));
const Welcome = lazy(() => import('./components/Welcome.jsx'));
const Dock = lazy(() => import('./components/Dock.jsx'));
const Home = lazy(() => import('./components/Home.jsx'));
const NewReleaseNotification = lazy(() => import('./components/NewReleaseNotification.jsx'));

const Finder = lazy(() => import('./windows/Finder.jsx'));
const Resume = lazy(() => import('./windows/Resume.jsx'));
const Safari = lazy(() => import('./windows/Safari.jsx'));
const Terminal = lazy(() => import('./windows/Terminal.jsx'));
const Text = lazy(() => import('./windows/Text.jsx'));
const Image = lazy(() => import('./windows/Image.jsx'));
const Contact = lazy(() => import('./windows/Contact.jsx'));
const Photos = lazy(() => import('./windows/Photos.jsx'));
const Music = lazy(() => import('./windows/Music.jsx'));
const Game = lazy(() => import('./windows/Game.jsx'));
const Trash = lazy(() => import('./windows/Trash.jsx'));
const VSCode = lazy(() => import('./windows/VSCode.jsx'));

// Lazy load analytics only on desktop
const Analytics = typeof window !== 'undefined' && window.innerWidth > 768
  ? lazy(() => import('@vercel/analytics/react').then(m => ({ default: m.Analytics })))
  : null;
const SpeedInsights = typeof window !== 'undefined' && window.innerWidth > 768
  ? lazy(() => import('@vercel/speed-insights/react').then(m => ({ default: m.SpeedInsights })))
  : null;

// Matches known video extensions
const isVideoUrl = (url) => url && /\.(mp4|webm|mkv|ogg|mov|m4v)(\?.*)?$/i.test(url);

const App = () => {
  const { windows } = useWindowStore();
  const isMobile = useIsMobile(768);

  // Read wallpaper data from store
  const { data } = useSiteStore();
  const [bgIndex, setBgIndex] = useState(() => {
    const saved = localStorage.getItem('macos_theme_bgIndex');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Combine global wallpaper and gallery items for cycling themes
  const allWallpapers = useMemo(() => {
    if (!data) return [];
    const globalBg = data.wallpaperUrl;
    const galleryBgs = data.gallery?.map(g => g.img).filter(Boolean) || [];
    return [globalBg, ...galleryBgs].filter((v, i, a) => v && v.trim() !== '' && a.indexOf(v) === i);
  }, [data]);

  // Keep saved index within valid bounds
  useEffect(() => {
    if (allWallpapers.length > 0 && bgIndex >= allWallpapers.length) {
      setBgIndex(0);
    }
  }, [allWallpapers, bgIndex]);

  // Handle Cycling & Saving
  const nextBg = () => setBgIndex((prev) => {
    const val = (prev + 1) % allWallpapers.length;
    localStorage.setItem('macos_theme_bgIndex', val);
    return val;
  });
  const prevBg = () => setBgIndex((prev) => {
    const val = (prev - 1 + allWallpapers.length) % allWallpapers.length;
    localStorage.setItem('macos_theme_bgIndex', val);
    return val;
  });

  // Read the active locally cycled wallpaper target
  const rawTargetUrl = allWallpapers[bgIndex] || allWallpapers[0] || '';

  const targetUrl = useMemo(() => {
    if (!rawTargetUrl) return '';
    if (rawTargetUrl.includes('cloudinary.com') && rawTargetUrl.includes('/upload/')) {
      if (isVideoUrl(rawTargetUrl)) {
        return rawTargetUrl;
      } else if (!rawTargetUrl.includes('f_auto') && !rawTargetUrl.includes('q_auto')) {
        return rawTargetUrl.replace('/upload/', '/upload/f_auto,q_auto/');
      }
    }
    return rawTargetUrl;
  }, [rawTargetUrl]);

  // Buffer state
  const [activeUrl, setActiveUrl] = useState(targetUrl);
  const [prevUrl, setPrevUrl] = useState(null);
  const [bufferingUrl, setBufferingUrl] = useState(null);

  useEffect(() => {
    if (targetUrl && targetUrl !== activeUrl && targetUrl !== bufferingUrl) {
      if (isVideoUrl(targetUrl)) {
        setBufferingUrl(targetUrl);
      } else {
        setPrevUrl(activeUrl);
        setActiveUrl(targetUrl);
        setBufferingUrl(null);
      }
    }
  }, [targetUrl, activeUrl, bufferingUrl]);

  useEffect(() => {
    if (prevUrl) {
      const timer = setTimeout(() => setPrevUrl(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [prevUrl]);

  const handleVideoBuffered = (url) => {
    if (url === bufferingUrl) {
      setPrevUrl(activeUrl);
      setActiveUrl(url);
      setBufferingUrl(null);
    }
  };

  useEffect(() => {
    const gradient = 'linear-gradient(135deg, #000000 0%, #2a2a2a 100%)';
    document.documentElement.style.setProperty('--wallpaper-url', gradient);
  }, []);

  const renderWallpaperLayer = (url, layerType) => {
    if (!url) return null;
    const isVid = isVideoUrl(url);

    let zIndex = 'z-0';
    let animation = '';
    let styles = {};

    if (layerType === 'prev') {
      zIndex = 'z-[-5]';
    } else if (layerType === 'buffer') {
      zIndex = 'z-[-10]';
      styles = { opacity: 0.01, transform: 'translateZ(0)' };
    } else if (layerType === 'active') {
      zIndex = 'z-0';
      animation = 'animate-crossfade';
      styles = { transform: 'translateZ(0)' };
    }

    const classNames = `fixed inset-0 w-full h-full object-cover pointer-events-none ${zIndex} ${animation}`;

    if (isVid) {
      return (
        <video
          key={url}
          autoPlay loop muted playsInline preload="auto" disablePictureInPicture
          className={classNames}
          style={styles}
          src={url}
          onCanPlayThrough={() => {
            if (layerType === 'buffer') handleVideoBuffered(url);
          }}
        />
      );
    }

    return <img key={url} src={url} alt="Wallpaper" className={classNames} style={styles} />;
  };

  useEffect(() => {
    if (isMobile) return;

    const preloadModules = () => {
      import('./windows/Finder.jsx');
      import('./windows/Safari.jsx');
      import('./windows/Terminal.jsx');
      import('./windows/Text.jsx');
      import('./windows/Image.jsx');
      import('./windows/Contact.jsx');
      import('./windows/Photos.jsx');
      import('./windows/Music.jsx');
      import('./windows/Game.jsx');
      import('./windows/Trash.jsx');
      import('./windows/VSCode.jsx');
    };
    if ('requestIdleCallback' in window) {
      // @ts-ignore
      requestIdleCallback(preloadModules);
    } else {
      setTimeout(preloadModules, 100);
    }
  }, [isMobile]);

  return (
    <>
      {/* Permanent Skeleton Base Layer on desktop */}
      {!isMobile && (
        <div className="fixed inset-0 w-[100dvw] h-[100dvh] z-[-60] skeleton-bg" />
      )}

      {/* Desktop Background Layer */}
      {[
        prevUrl && { url: prevUrl, type: 'prev' },
        activeUrl && { url: activeUrl, type: 'active' },
        bufferingUrl && { url: bufferingUrl, type: 'buffer' },
      ].filter(Boolean).map(layer => renderWallpaperLayer(layer.url, layer.type))}

      {/* Background Theme Circle Button */}
      {allWallpapers.length > 1 && (
        <button
          type="button"
          onClick={nextBg}
          aria-label="Change Wallpaper Theme"
          title="Change Wallpaper Theme"
          className="theme-circle-btn group fixed z-40 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 active:scale-90 transition-all duration-300 backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:text-white group-hover:rotate-180 transition-transform duration-500 ease-out"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" fillOpacity="0.45" />
          </svg>
        </button>
      )}

      <main className="relative z-10 flex flex-col h-[100dvh] w-[100dvw] overflow-hidden">
        <Suspense fallback={<div />}>
          <NavBar />
          <Welcome />
          <Dock />
          <NewReleaseNotification />
        </Suspense>

        {(windows['terminal']?.isOpen || windows['terminal']?.isMinimized) && <Suspense fallback={null}><Terminal /></Suspense>}
        {(windows['safari']?.isOpen || windows['safari']?.isMinimized) && <Suspense fallback={null}><Safari /></Suspense>}
        {(windows['imgfile']?.isOpen || windows['imgfile']?.isMinimized) && <Suspense fallback={null}><Image /></Suspense>}
        {(windows['txtfile']?.isOpen || windows['txtfile']?.isMinimized) && <Suspense fallback={null}><Text /></Suspense>}
        {(windows['finder']?.isOpen || windows['finder']?.isMinimized) && <Suspense fallback={null}><Finder /></Suspense>}
        {(windows['contact']?.isOpen || windows['contact']?.isMinimized) && <Suspense fallback={null}><Contact /></Suspense>}
        {(windows['photos']?.isOpen || windows['photos']?.isMinimized) && <Suspense fallback={null}><Photos /></Suspense>}
        {(windows['music']?.isOpen || windows['music']?.isMinimized) && <Suspense fallback={null}><Music /></Suspense>}
        {(windows['game']?.isOpen || windows['game']?.isMinimized) && <Suspense fallback={null}><Game /></Suspense>}
        {(windows['vscode']?.isOpen || windows['vscode']?.isMinimized) && <Suspense fallback={null}><VSCode /></Suspense>}
        {(windows['trash']?.isOpen || windows['trash']?.isMinimized) && <Suspense fallback={null}><Trash /></Suspense>}
        {!isMobile && <Suspense fallback={null}><Home /></Suspense>}
      </main>

      {!isMobile && Analytics && SpeedInsights && (
        <Suspense fallback={null}>
          <Analytics />
          <SpeedInsights />
        </Suspense>
      )}
    </>
  );
};

export default App;