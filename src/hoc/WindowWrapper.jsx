import useWindowStore from '#store/window'
import { useIsMobile } from '../hooks/useIsMobile'
import React, { useLayoutEffect, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

const WindowWrapper = (Component, windowKey, title) => {
  const Wrapped = React.memo((props) => {
    const isMobile = useIsMobile(768);
    const focusWindow = useWindowStore(state => state.focusWindow);
    const windowState = useWindowStore(state => state.windows[windowKey]);
    const { isOpen, isMaximized, zIndex } = windowState || {};
    const ref = useRef(null);
    const draggableRef = useRef(null);

    // Sync z-index directly to DOM without rebuilding Draggable
    useEffect(() => {
      if (ref.current && zIndex && !isMaximized) {
        ref.current.style.zIndex = `${zIndex}`;
      }
    }, [zIndex, isMaximized]);

    // Setup Draggable & Open Animation
    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;

      // Mobile setup
      if (isMobile) {
        if (draggableRef.current) {
          draggableRef.current.kill();
          draggableRef.current = null;
        }
        el.style.top = '';
        el.style.left = '';
        el.style.right = '';
        el.style.bottom = '';
        el.style.width = '';
        el.style.height = '';
        el.style.maxWidth = '';
        el.style.transform = '';
        el.classList.remove('window-maximized');
        return;
      }

      // Desktop setup
      el.style.display = isOpen ? 'block' : 'none';
      if (!isOpen) {
        if (draggableRef.current) {
          draggableRef.current.kill();
          draggableRef.current = null;
        }
        return;
      }

      // Animate on open
      if (!isMaximized && !draggableRef.current) {
        gsap.fromTo(el, {
          scale: 0.92, opacity: 0, y: 25,
        }, {
          scale: 1, opacity: 1, y: 0,
          duration: 0.3, ease: 'power3.out'
        });
      }

      // Initialize Draggable
      if (!draggableRef.current && !isMaximized) {
        const handle = el.querySelector('.window-drag-handle') || el.querySelector('#window-header') || el;
        const [instance] = Draggable.create(el, {
          trigger: handle,
          ignore: "input, button, a, select, textarea, .sliders, #window-controls, [data-no-drag]",
          cursor: "grab",
          activeCursor: "grabbing",
          edgeResistance: 0.65,
          onPress: () => {
            focusWindow(windowKey);
          }
        });
        draggableRef.current = instance;
      }

      return () => {
        if (draggableRef.current) {
          draggableRef.current.kill();
          draggableRef.current = null;
        }
      };
    }, [isOpen, isMobile, windowKey, focusWindow]);

    // Maximize / restore logic
    useLayoutEffect(() => {
      if (isMobile) return;
      const el = ref.current;
      if (!el || !isOpen) return;

      if (isMaximized) {
        // Save previous styling before maximizing
        if (!el.dataset.prevTop) {
          const cs = window.getComputedStyle(el);
          el.dataset.prevTop = cs.top;
          el.dataset.prevLeft = cs.left;
          el.dataset.prevWidth = cs.width;
          el.dataset.prevHeight = cs.height;
          el.dataset.prevPosition = cs.position;
          el.dataset.prevTransform = cs.transform;
          el.dataset.prevMaxWidth = cs.maxWidth;
          el.dataset.prevBorderRadius = cs.borderRadius;
        }

        // Disable draggable and clear GSAP's transform matrix so window docks cleanly
        if (draggableRef.current) {
          draggableRef.current.disable();
        }
        gsap.set(el, { clearProps: 'transform,x,y' });

        // Apply full desktop screen bounds below top navbar
        el.style.position = 'fixed';
        el.style.top = '30px';
        el.style.left = '0px';
        el.style.right = '0px';
        el.style.bottom = '0px';
        el.style.width = '100vw';
        el.style.height = 'calc(100dvh - 30px)';
        el.style.maxWidth = '100vw';
        el.style.maxHeight = 'calc(100dvh - 30px)';
        el.style.transform = 'none';
        el.style.borderRadius = '0px';
        el.style.margin = '0px';
        el.style.zIndex = '9990';
        el.classList.add('window-maximized');
      } else {
        el.classList.remove('window-maximized');
        if (el.dataset.prevTop) {
          el.style.position = el.dataset.prevPosition || 'absolute';
          el.style.top = el.dataset.prevTop;
          el.style.left = el.dataset.prevLeft;
          el.style.width = el.dataset.prevWidth;
          if (windowKey === 'contact') {
            el.style.height = '';
          } else if (el.dataset.prevHeight && el.dataset.prevHeight !== 'auto') {
            el.style.height = el.dataset.prevHeight;
          } else {
            el.style.height = '';
          }
          el.style.maxWidth = el.dataset.prevMaxWidth || '';
          el.style.maxHeight = '';
          el.style.borderRadius = el.dataset.prevBorderRadius || '';
          el.style.right = '';
          el.style.bottom = '';
          el.style.margin = '';
          el.style.transform = '';
          el.style.zIndex = zIndex ? `${zIndex}` : '';

          if (el.dataset.prevTransform && el.dataset.prevTransform !== 'none') {
            el.style.transform = el.dataset.prevTransform;
          }

          delete el.dataset.prevTop;
          delete el.dataset.prevLeft;
          delete el.dataset.prevWidth;
          delete el.dataset.prevHeight;
          delete el.dataset.prevPosition;
          delete el.dataset.prevTransform;
          delete el.dataset.prevMaxWidth;
          delete el.dataset.prevBorderRadius;
        } else {
          el.style.right = '';
          el.style.bottom = '';
          el.style.width = '';
          el.style.height = '';
          el.style.maxWidth = '';
          el.style.maxHeight = '';
          el.style.transform = '';
          el.style.margin = '';
          el.style.borderRadius = '';
          el.style.zIndex = zIndex ? `${zIndex}` : '';
        }

        // Re-enable draggable and update its position tracking
        if (draggableRef.current) {
          draggableRef.current.enable();
          draggableRef.current.update();
        } else if (isOpen) {
          const handle = el.querySelector('.window-drag-handle') || el.querySelector('#window-header') || el;
          const [instance] = Draggable.create(el, {
            trigger: handle,
            ignore: "input, button, a, select, textarea, .sliders, #window-controls, [data-no-drag]",
            cursor: "grab",
            activeCursor: "grabbing",
            edgeResistance: 0.65,
            onPress: () => {
              focusWindow(windowKey);
            }
          });
          draggableRef.current = instance;
        }
      }
    }, [isMaximized, isMobile, isOpen, windowKey, zIndex, focusWindow]);

    if (!isOpen) return null;

    if (isMobile) {
      return (
        <section
          id={windowKey}
          ref={ref}
          className="fixed inset-0 z-[9999] flex flex-col bg-white animate-slide-up window-root-mobile w-full h-[100dvh] overflow-hidden"
          style={{
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
          onClick={() => focusWindow(windowKey)}
        >
          <Component {...props} />
        </section>
      );
    }

    return (
      <section
        id={windowKey}
        ref={ref}
        style={{ zIndex: zIndex || 10 }}
        className="absolute window-root"
        onClick={() => focusWindow(windowKey)}
      >
        <Component {...props} />
      </section>
    );
  });

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;
  return Wrapped;
};

export default WindowWrapper;