import { locations } from "#constants"
import useLocationStore from "#store/location";
import useWindowStore from "#store/window";
import clsx from "clsx";
import React, { useCallback, useEffect } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

const projects = []; // Removed projects from locations.work?.children by user request

const Home = React.memo(() => {
  const isMobile = useIsMobile(640);
  const setActiveLocation = useLocationStore(state => state.setActiveLocation);
  const openWindow = useWindowStore(state => state.openWindow);

  const handleOpenProjectFinder = useCallback((project) => {
    setActiveLocation(project);
    openWindow("finder");
  }, [setActiveLocation, openWindow]);

  useEffect(() => {
    if (isMobile || projects.length === 0) return;

    let isMounted = true;
    Promise.all([
      import('gsap'),
      import('gsap/Draggable')
    ]).then(([{ gsap }, { Draggable }]) => {
      if (!isMounted) return;
      gsap.registerPlugin(Draggable);
      Draggable.create('.folder');
    });

    return () => { isMounted = false; };
  }, [isMobile]);

  if (projects.length === 0) return null;

  return (
    <section id="home">
      <ul>
        {projects.map((project) => (
          <li 
            key={project.id} 
            className={clsx("group folder", project.windowPosition)}
            onClick={() => handleOpenProjectFinder(project)}
          >
            <img 
              src="/images/folder.webp"
              alt={project.name}
              loading='lazy'
            />
            <p>{project.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
});

Home.displayName = 'Home';

export default Home;