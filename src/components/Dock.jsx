import { dockApps, locations } from '#constants';
import React, { useRef, useCallback, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import useWindowStore from '#store/window';
import useLocationStore from '#store/location';
import { useIsMobile } from '../hooks/useIsMobile';

const Dock = React.memo(() => {
  const isMobile = useIsMobile(768);

  // Optimized selectors
  const openWindow = useWindowStore(state => state.openWindow);
  const closeWindow = useWindowStore(state => state.closeWindow);
  const windows = useWindowStore(state => state.windows);
  const setActiveLocation = useLocationStore(state => state.setActiveLocation);

  const dockRef = useRef(null);

  // Reset any GSAP transforms when switching to mobile
  useEffect(() => {
    if (isMobile && dockRef.current) {
      const icons = dockRef.current.querySelectorAll('.dock-icon');
      icons.forEach(icon => {
        icon.style.transform = '';
      });
    }
  }, [isMobile]);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return () => {};
    
    // Skip hover animations on mobile for better performance
    if (isMobile) return () => {};
    
    // Dynamically import GSAP only on desktop
    let isMounted = true;
    Promise.all([
      import('gsap'),
      import('@gsap/react')
    ]).then(([{ gsap }]) => {
      if (!isMounted) return;
      const icons = dock.querySelectorAll('.dock-icon');

      const animateIcons = (mouseX) => {
        const { left } = dock.getBoundingClientRect();

        icons.forEach((icon) => {
          const { left: iconLeft, width } = icon.getBoundingClientRect();
          const center = iconLeft - left + width / 2;
          const distance = Math.abs(mouseX - center);

          const intensity = Math.exp(-(distance ** 2.5) / 150000);

          gsap.to(icon, {
            scale: 1 + 0.25 * intensity,
            y: -20 * intensity,
            duration: 0.2,
            ease: 'power1.out'
          });
        });
      };

      const handleMouseMove = (e) => {
        const { left } = dock.getBoundingClientRect();
        animateIcons(e.clientX - left);
      };

      const resetIcons = () => icons.forEach((icon) => gsap.to(icon, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power1.out'
      }));

      dock.addEventListener('mousemove', handleMouseMove);
      dock.addEventListener('mouseleave', resetIcons);

      return () => {
        dock.removeEventListener('mousemove', handleMouseMove);
        dock.removeEventListener('mouseleave', resetIcons);
      };
    });

    return () => { isMounted = false; };
  }, [isMobile]);

  const toggleApp = useCallback((app) => {
    if (!app.canOpen) return;

    // Special case: Trash icon should open Finder focused on Trash
    if (app.action === 'trash') {
      openWindow('finder');
      setActiveLocation(locations.trash);
      return;
    }

    // Special case: Finder icon should open Finder focused on Work
    if (app.id === 'finder') {
      if (windows.finder?.isOpen) {
        closeWindow('finder');
      } else {
        openWindow('finder');
        setActiveLocation(locations.work);
      }
      return;
    }

    const win = windows[app.id];

    if (!win) {
      console.log(`Window not found for app: ${app.id}`);
      return;
    }

    if (win.isOpen && !win.isMinimized) {
      closeWindow(app.id);
    } else {
      openWindow(app.id);
    }
  }, [openWindow, closeWindow, windows, setActiveLocation]);

  return (
    <section id='dock' aria-label="Application Dock">
      <div ref={dockRef} className='dock-container'>
        {dockApps
          .filter(app => !isMobile || app.id !== 'game') // Hide heavy desktop game on mobile dock
          .map(({ id, name, icon, canOpen, action }) => {
            const isActive = windows[id]?.isOpen && !windows[id]?.isMinimized;
            const isMinimized = windows[id]?.isMinimized;
            return (
              <div key={id} className='relative flex flex-col justify-center items-center flex-shrink-0'>
                <button 
                  type='button' 
                  className={`dock-icon ${isMinimized ? 'opacity-80' : ''}`}
                  aria-label={name}
                  data-tooltip-id={!isMobile ? "dock-tooltip" : undefined}
                  data-tooltip-content={name}
                  data-tooltip-delay-show={150}
                  disabled={!canOpen}
                  onClick={() => toggleApp({ id, canOpen, action })}
                >
                  <img 
                    src={`/images/${icon}`}
                    alt={name}
                    loading='lazy'
                    className={`w-full h-full object-contain ${canOpen ? '' : 'opacity-60'}`}
                  />
                </button>
                {/* Active indicator dot */}
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-white/90 absolute -bottom-1 left-1/2 -translate-x-1/2 flex-shrink-0 shadow-sm" />
                )}
              </div>
            );
          })}
        {!isMobile && <Tooltip id='dock-tooltip' place='top' className='tooltip' />}
      </div>
    </section>
  );
});

Dock.displayName = 'Dock';

export default Dock;