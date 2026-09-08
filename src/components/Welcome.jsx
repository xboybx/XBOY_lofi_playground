import React, { useRef, useEffect } from "react";
import MusicPopup from "./MusicPopup";
import { useSiteStore } from "../store/siteStore";
import useAudioStore from "#store/audio";
import { useIsMobile } from "../hooks/useIsMobile";

const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 900, default: 400 },
};

// Memoized character span component
const CharSpan = React.memo(({ char, className, baseWeight }) => (
  <span
    className={className}
    style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
  >
    {char === "" ? "\u00A0" : char}
  </span>
));

CharSpan.displayName = 'CharSpan';

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <CharSpan
      key={i}
      char={char}
      className={className}
      baseWeight={baseWeight}
    />
  ));
};

const setupTextHover = (container, type, gsap) => {
  if (!container || !gsap) return () => {};

  const letters = container.querySelectorAll("span");
  const { min, max, default: base } = FONT_WEIGHTS[type];

  const animateLetter = (letter, weight, duration = 0.25) => {
    return gsap.to(letter, {
      duration,
      ease: 'power2.out',
      fontVariationSettings: `'wght' ${weight}`,
    });
  };

  const handleMouseMove = (e) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = e.clientX - left;

    letters.forEach((letter) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      const distance = Math.abs(mouseX - (l - left + w / 2));
      const intensity = Math.exp(-(distance ** 2) / 20000);

      animateLetter(letter, min + (max - min) * intensity); 
    });
  };

  const handleMouseLeave = () => letters.forEach((letter) => animateLetter(letter, base, 0.3));

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
};

const Welcome = React.memo(() => {
  const isMobile = useIsMobile(768);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const welcomeContainerRef = useRef(null);
  const welcomePlaceholderRef = useRef(null);

  // Unconditionally initialize the global audio controller with the site's playlist
  const { data } = useSiteStore();
  const initAudio = useAudioStore(state => state.init);
  useEffect(() => {
    if (data?.music?.length) {
      initAudio(data.music);
    }
  }, [data?.music, initAudio]);

  // Clean up any GSAP transforms when switching to/from mobile
  useEffect(() => {
    if (isMobile && welcomeContainerRef.current) {
      welcomeContainerRef.current.style.transform = '';
      welcomeContainerRef.current.style.left = '';
      welcomeContainerRef.current.style.top = '';
    }
  }, [isMobile]);

  useEffect(() => {
    // Skip hover effects and Draggable on mobile
    if (isMobile) return () => {};
    
    let isMounted = true;
    Promise.all([
      import('gsap'),
      import('gsap/Draggable')
    ]).then(([{ gsap }, { Draggable }]) => {
      if (!isMounted) return;
      gsap.registerPlugin(Draggable);
      const titleCleanup = setupTextHover(titleRef.current, 'title', gsap);
      const subtitleCleanup = setupTextHover(subtitleRef.current, 'subtitle', gsap);

      const welcomeContainer = welcomeContainerRef.current;
      const welcomePlaceholder = welcomePlaceholderRef.current;

      if (welcomeContainer && welcomePlaceholder) {
        gsap.set(welcomePlaceholder, { opacity: 0 });

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const snapThreshold = Math.max(screenWidth, screenHeight);

        Draggable.create(welcomeContainer, {
          type: "x,y",
          bounds: "body",
          cursor: "grab",
          activeCursor: "grabbing",
          zIndexBoost: false,
          onDragStart: function () {
            gsap.to(welcomePlaceholder, { opacity: 1, duration: 0.2 });
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
            
            gsap.to(welcomePlaceholder, { opacity: 0, duration: 0.2 });
          }
        });
      }

      return () => {
        subtitleCleanup();
        titleCleanup();
      };
    });

    return () => { isMounted = false; };
  }, [isMobile]);

  return (
    <>
      <section id="welcome" ref={welcomeContainerRef} className="w-full flex flex-col items-center justify-center text-center px-4 select-none">
        <p ref={subtitleRef} className="w-full text-center">
          {renderText(
            "welcome to my lofi space",
            "text-[11px] min-[340px]:text-xs sm:text-base md:text-2xl font-georama text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] tracking-wider inline-block",
            100
          )}
        </p>
        <h1 ref={titleRef} className="mt-1 sm:mt-4 w-full text-center">
          {renderText(
            "XBOY",
            "text-4xl min-[340px]:text-5xl sm:text-7xl md:text-8xl 3xl:text-9xl italic font-georama text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] tracking-normal sm:tracking-wide inline-block" 
          )}
        </h1>
      </section>
      
      <MusicPopup />
      
      {/* Placeholder for welcome text */}
      {!isMobile && <div className="welcome-placeholder" ref={welcomePlaceholderRef}></div>}
    </>
  );
});

Welcome.displayName = 'Welcome';

export default Welcome;