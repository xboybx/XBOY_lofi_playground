import React, { Suspense, lazy, useEffect, useState, useMemo } from 'react'
import useWindowStore from '#store/window'
import { useSiteStore } from './store/siteStore'

// Detect mobile once
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

// Lazy load components
const NavBar = lazy(() => import('./components/NavBar.jsx'))
const Welcome = lazy(() => import('./components/Welcome.jsx'))
const Dock = lazy(() => import('./components/Dock.jsx'))
const Home = lazy(() => import('./components/Home.jsx'))
const NewReleaseNotification = lazy(() => import('./components/NewReleaseNotification.jsx'))

const Finder = lazy(() => import('./windows/Finder.jsx'))
const Resume = lazy(() => import('./windows/Resume.jsx'))
const Safari = lazy(() => import('./windows/Safari.jsx'))
const Terminal = lazy(() => import('./windows/Terminal.jsx'))
const Text = lazy(() => import('./windows/Text.jsx'))
const Image = lazy(() => import('./windows/Image.jsx'))
const Contact = lazy(() => import('./windows/Contact.jsx'))
const Photos = lazy(() => import('./windows/Photos.jsx'))
const Music = lazy(() => import('./windows/Music.jsx'))
const Game = lazy(() => import('./windows/Game.jsx'))
const Trash = lazy(() => import('./windows/Trash.jsx'))
const VSCode = lazy(() => import('./windows/VSCode.jsx'))

// Lazy load analytics only on desktop
const Analytics = !isMobile ? lazy(() => import('@vercel/analytics/react').then(m => ({ default: m.Analytics }))) : null;
const SpeedInsights = !isMobile ? lazy(() => import('@vercel/speed-insights/react').then(m => ({ default: m.SpeedInsights }))) : null;

// Only register GSAP plugins on desktop for better mobile performance
if (!isMobile) {
  import('gsap').then(({ gsap }) => {
    import('gsap/Draggable').then(({ Draggable }) => {
      gsap.registerPlugin(Draggable);
    });
  });
}

// Matches known video extensions, ignoring query parameters at the end
const isVideoUrl = (url) => url && /\.(mp4|webm|mkv|ogg|mov|m4v)(\?.*)?$/i.test(url);

const App = () => {
  const { windows } = useWindowStore();
  const isMobile = window.innerWidth <= 640;

  // Read wallpaper data from store
  const { data } = useSiteStore();
  const [bgIndex, setBgIndex] = useState(() => {
    const saved = localStorage.getItem('macos_theme_bgIndex');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Combine global wallpaper and gallery items for locally cycling themes on the desktop
  const allWallpapers = useMemo(() => {
    if (!data) return [];
    const globalBg = data.wallpaperUrl;
    const galleryBgs = data.gallery?.map(g => g.img).filter(Boolean) || [];
    return [globalBg, ...galleryBgs].filter((v, i, a) => v && v.trim() !== '' && a.indexOf(v) === i);
  }, [data]);

  // Keep saved index within valid bounds if data changes
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
  const targetUrl = allWallpapers[bgIndex] || allWallpapers[0] || '';

  // Crossfade State Context
  const [activeUrl, setActiveUrl] = useState(targetUrl);
  const [prevUrl, setPrevUrl] = useState(null);

  // Trigger crossfade sequence when target changes
  useEffect(() => {
    if (targetUrl !== activeUrl && targetUrl) {
      setPrevUrl(activeUrl);
      setActiveUrl(targetUrl);

      const timer = setTimeout(() => {
        setPrevUrl(null);
      }, 1500); // Detach previous video layer precisely after complete CSS fade-in

      return () => clearTimeout(timer);
    }
  }, [targetUrl, activeUrl]);

  // Set definitive global CSS gradient underneath ALL layers
  useEffect(() => {
    const gradient = 'linear-gradient(135deg, #000000 0%, #2a2a2a 100%)';
    document.documentElement.style.setProperty('--wallpaper-url', gradient);
  }, []);

  // Universal Render Function for both fading and static wallpaper asset layers
  const renderWallpaperLayer = (url, isPrevLayer) => {
    if (!url) return null;
    const isVid = isVideoUrl(url);
    const zIndex = isPrevLayer ? 'z-[-5]' : 'z-0'; // Previous stays underneath at z-[5], new slides in over it at z-0
    const animation = isPrevLayer ? '' : 'animate-crossfade';

    const classNames = `fixed inset-0 w-full h-full object-cover pointer-events-none ${zIndex} ${animation}`;
    const advancedStyles = {
      transform: 'translate3d(0, 0, 0)',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      perspective: 1000,
      WebkitPerspective: 1000,
      willChange: isPrevLayer ? 'transform' : 'opacity, transform'
    };

    if (isVid) {
      return (
        <video
          key={`vid-${isPrevLayer ? 'prev' : 'active'}-${url}`}
          autoPlay loop muted playsInline preload="auto" disablePictureInPicture
          className={classNames}
          style={advancedStyles}
          src={url}
          onCanPlay={() => !isPrevLayer && console.log('Wallpaper video cross-fading gracefully!', url)}
        />
      );
    }

    return <img key={`img-${isPrevLayer ? 'prev' : 'active'}-${url}`} src={url} alt="Wallpaper" className={classNames} style={advancedStyles} />;
  };

  useEffect(() => {
    // Skip preloading on mobile to improve initial load
    if (isMobile) return;

    const preloadModules = () => {
      // Preload modules during idle time for faster window opens
      // but don't render until user actually opens them
      import('./windows/Finder.jsx');
      import('./windows/Resume.jsx');
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
  }, []);

  return (
    <>
      {/* Permanent Skeleton Loader Base Layer */}
      {!isMobile && (
        <div className="fixed inset-0 w-[100dvw] h-[100dvh] z-[-60] skeleton-bg" />
      )}

      {/* Desktop Background Stacking Engine */}
      {renderWallpaperLayer(prevUrl, true)}
      {renderWallpaperLayer(activeUrl, false)}
      {/* Desktop Background Controls (Fixed to bottom right) */}
      {!isMobile && allWallpapers.length > 1 && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full p-2 border border-white/10 shadow-2xl animate-fade-in-up transition-opacity hover:opacity-100 opacity-60">
          <button onClick={prevBg} aria-label="Previous Wallpaper" className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <div className="px-1 text-[10px] uppercase tracking-widest font-bold text-white/70">Theme</div>
          <button onClick={nextBg} aria-label="Next Wallpaper" className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      )}
      <main className="relative z-10 flex-col h-[100dvh] w-[100dvw]">
        <Suspense fallback={<div />}>
          <NavBar />
          <Welcome />
          <Dock />
          <NewReleaseNotification />
        </Suspense>
        {(windows['terminal']?.isOpen || windows['terminal']?.isMinimized) && <Suspense fallback={null}><Terminal /></Suspense>}
        {(windows['safari']?.isOpen || windows['safari']?.isMinimized) && <Suspense fallback={null}><Safari /></Suspense>}
        {(windows['resume']?.isOpen || windows['resume']?.isMinimized) && <Suspense fallback={null}><Resume /></Suspense>}
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
      {/* Defer analytics on mobile for better performance */}
      {!isMobile && Analytics && SpeedInsights && (
        <Suspense fallback={null}>
          <Analytics />
          <SpeedInsights />
        </Suspense>
      )}
    </>
  )
}

export default App