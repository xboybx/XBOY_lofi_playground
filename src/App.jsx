import React, { Suspense, lazy, useEffect } from 'react'
import useWindowStore from '#store/window'
import { useSiteStore } from './store/siteStore'

// Detect mobile once
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

// Lazy load components
const NavBar = lazy(() => import('./components/NavBar.jsx'))
const Welcome = lazy(() => import('./components/Welcome.jsx'))
const Dock = lazy(() => import('./components/Dock.jsx'))
const Home = lazy(() => import('./components/Home.jsx'))

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

const isVideoUrl = (url) => url && /\.(mp4|webm|mkv|ogg)$/i.test(url);

const App = () => {
  const { windows } = useWindowStore();

  // Read wallpaper directly from store — empty string = show CSS gradient
  const wallpaperUrl = useSiteStore(state => state.data.wallpaperUrl);
  const hasWallpaper = Boolean(wallpaperUrl);
  const isVideoWallpaper = isVideoUrl(wallpaperUrl);

  // Apply image wallpaper via CSS variable whenever URL changes
  useEffect(() => {
    if (isMobile) return;
    if (hasWallpaper && !isVideoWallpaper) {
      // Image/GIF wallpaper
      document.documentElement.style.setProperty('--wallpaper-url', `url("${wallpaperUrl}")`);
    } else {
      // Video wallpaper OR no wallpaper — clear the CSS variable so gradient shows
      document.documentElement.style.setProperty('--wallpaper-url', 'none');
    }
  }, [wallpaperUrl, hasWallpaper, isVideoWallpaper]);

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
        <div className="fixed inset-0 w-[100dvw] h-[100dvh] -z-[60] skeleton-bg" />
      )}

      {/* Video wallpaper — only rendered when a video URL is saved */}
      {isVideoWallpaper && !isMobile && (
        <video
          key={wallpaperUrl}
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-[100dvw] h-[100dvh] object-cover -z-50 pointer-events-none"
          src={wallpaperUrl}
        />
      )}
      <main>
        <Suspense fallback={<div />}>
          <NavBar />
          <Welcome />
          <Dock />
        </Suspense>
        {!isMobile && (
          <>
            {windows['terminal']?.isOpen && <Suspense fallback={null}><Terminal /></Suspense>}
            {windows['safari']?.isOpen && <Suspense fallback={null}><Safari /></Suspense>}
            {windows['resume']?.isOpen && <Suspense fallback={null}><Resume /></Suspense>}
            {windows['imgfile']?.isOpen && <Suspense fallback={null}><Image /></Suspense>}
            {windows['txtfile']?.isOpen && <Suspense fallback={null}><Text /></Suspense>}
            {windows['finder']?.isOpen && <Suspense fallback={null}><Finder /></Suspense>}
            {windows['contact']?.isOpen && <Suspense fallback={null}><Contact /></Suspense>}
            {windows['photos']?.isOpen && <Suspense fallback={null}><Photos /></Suspense>}
            {windows['music']?.isOpen && <Suspense fallback={null}><Music /></Suspense>}
            {windows['game']?.isOpen && <Suspense fallback={null}><Game /></Suspense>}
            {windows['vscode']?.isOpen && <Suspense fallback={null}><VSCode /></Suspense>}
            {windows['trash']?.isOpen && <Suspense fallback={null}><Trash /></Suspense>}
          </>
        )}
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
