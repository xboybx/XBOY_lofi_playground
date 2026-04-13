import useWindowStore from '#store/window'
import React, { useLayoutEffect, useRef } from 'react'

// Detect mobile once at module level
const isMobileDevice = typeof window !== 'undefined' && window.innerWidth <= 768;

const WindowWrapper = (Component, windowKey) => {

  // ─── MOBILE VERSION ───────────────────────────────────────────────
  if (isMobileDevice) {
    const MobileWrapped = React.memo((props) => {
      const closeWindow = useWindowStore(state => state.closeWindow);
      const windowState = useWindowStore(state => state.windows[windowKey]);
      const { isOpen } = windowState || {};

      if (!isOpen) return null;

      return (
        <section
          id={windowKey}
          className="fixed inset-0 z-[9999] flex flex-col bg-white animate-slide-up"
          style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <Component {...props} />
        </section>
      );
    });

    MobileWrapped.displayName = `MobileWindowWrapper(${Component.displayName || Component.name || "Component"})`;
    return MobileWrapped;
  }

  // ─── DESKTOP VERSION (unchanged) ──────────────────────────────────
  const Wrapped = React.memo((props) => {
    const focusWindow = useWindowStore(state => state.focusWindow);
    const windowState = useWindowStore(state => state.windows[windowKey]);
    const { isOpen, isMaximized, zIndex } = windowState || {};
    const ref = useRef(null);
    const [gsapApi, setGsapApi] = React.useState(null);

    // Lazy-load GSAP only once on desktop
    useLayoutEffect(() => {
      if (gsapApi) return;
      let isMounted = true;
      Promise.all([
        import('gsap'),
        import('gsap/Draggable')
      ]).then(([{ gsap }, { Draggable }]) => {
        if (isMounted) {
          gsap.registerPlugin(Draggable);
          setGsapApi({ gsap, Draggable });
        }
      });
      return () => { isMounted = false; };
    }, [gsapApi]);

    // open animation + draggable setup
    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;

      // visibility based on open state
      el.style.display = isOpen ? 'block' : 'none';

      if (!isOpen || !gsapApi) return;

      const { gsap, Draggable } = gsapApi;

        gsap.fromTo(el, {
          scale: 0.8, opacity: 0, y: 40,
        }, {
          scale: 1, opacity: 1, y: 0,
          duration: 0.4, ease: 'power3.out'
        });

        // Draggable (skip when maximized)
        if (!isMaximized) {
          Draggable.get(el)?.kill();
          const [instance] = Draggable.create(el, {
            onPress: () => focusWindow(windowKey),
            trigger: el.querySelector('.window-drag-handle'),
            ignore: "input[type='range'], button, .sliders",
            cursor: "grab",
            activeCursor: "grabbing"
          });
          return () => instance.kill();
        } else {
          Draggable.get(el)?.kill();
        }
    }, [isOpen, isMaximized, focusWindow, gsapApi]);

    // maximize / restore logic
    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;

      if (isMaximized) {
        if (!el.dataset.prevTop) {
          const cs = window.getComputedStyle(el);
          el.dataset.prevTop = cs.top;
          el.dataset.prevLeft = cs.left;
          el.dataset.prevWidth = cs.width;
          el.dataset.prevHeight = cs.height;
          el.dataset.prevPosition = cs.position;
          el.dataset.prevTransform = cs.transform;
          el.dataset.prevMaxWidth = cs.maxWidth;
          el.dataset.prevRight = cs.right;
          el.dataset.prevBottom = cs.bottom;
        }
        el.style.position = 'fixed';
        el.style.top = '0';
        el.style.left = '0';
        el.style.right = '0';
        el.style.bottom = '0';
        el.style.width = '100dvw';
        el.style.height = '100dvh';
        el.style.maxWidth = 'none';
        el.style.transform = 'none';
      } else {
        if (el.dataset.prevTop) {
          el.style.top = el.dataset.prevTop;
          el.style.left = el.dataset.prevLeft;
          el.style.width = el.dataset.prevWidth;
          if (windowKey === 'contact') {
            el.style.height = '';
          } else if (el.dataset.prevHeight !== 'auto') {
            el.style.height = el.dataset.prevHeight;
          } else {
            el.style.height = '';
          }
          if (el.dataset.prevPosition) el.style.position = el.dataset.prevPosition;
          if (el.dataset.prevMaxWidth) el.style.maxWidth = el.dataset.prevMaxWidth;
          if (el.dataset.prevTransform) el.style.transform = el.dataset.prevTransform;
          el.style.right = '';
          el.style.bottom = '';
          delete el.dataset.prevTop;
          delete el.dataset.prevLeft;
          delete el.dataset.prevWidth;
          delete el.dataset.prevHeight;
          delete el.dataset.prevPosition;
          delete el.dataset.prevTransform;
          delete el.dataset.prevMaxWidth;
          delete el.dataset.prevRight;
          delete el.dataset.prevBottom;
        } else {
          el.style.right = '';
          el.style.bottom = '';
          el.style.width = '';
          el.style.height = '';
          el.style.maxWidth = '';
          el.style.transform = '';
        }
      }
    }, [isOpen, isMaximized]);

    return (
      <section
        id={windowKey}
        ref={ref}
        style={{ zIndex }}
        className='absolute window-root'
        onClick={() => focusWindow(windowKey)}>
        <Component {...props} />
      </section>
    );
  });

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}

export default WindowWrapper