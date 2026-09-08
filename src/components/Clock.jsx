import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const Clock = React.memo(() => {
  const isMobile = useIsMobile(640);
  const [time, setTime] = useState(() => getTimeString());
  const dateTimeRef = useRef(null);
  const dateTimePlaceholderRef = useRef(null);

  function getTimeString() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()} • ${hours}:${minutes} ${ampm}`;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getTimeString());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let isMounted = true;
    Promise.all([
      import('gsap'),
      import('gsap/Draggable')
    ]).then(([{ gsap }, { Draggable }]) => {
      if (!isMounted) return;
      gsap.registerPlugin(Draggable);

      const dateTime = dateTimeRef.current;
      const dateTimePlaceholder = dateTimePlaceholderRef.current;

      if (!dateTime || !dateTimePlaceholder) return;

      gsap.set(dateTimePlaceholder, { opacity: 0 });

      const snapThreshold = 500;

      Draggable.create(dateTime, {
        type: "x,y",
        bounds: "body",
        cursor: "grab",
        activeCursor: "grabbing",
        zIndexBoost: false,
        onDragStart: function () {
          gsap.to(dateTimePlaceholder, { opacity: 1, duration: 0.2 });
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
          
          gsap.to(dateTimePlaceholder, { opacity: 0, duration: 0.2 });
        }
      });
    });

    return () => { isMounted = false; };
  }, [isMobile]);

  return (
    <>
      <time ref={dateTimeRef} className="text-xs sm:text-sm font-medium text-black select-none whitespace-nowrap">
        {time}
      </time>
      
      {!isMobile && (
        <div className="datetime-placeholder" ref={dateTimePlaceholderRef}>
        </div>
      )}
    </>
  );
});

Clock.displayName = 'Clock';

export default Clock;
