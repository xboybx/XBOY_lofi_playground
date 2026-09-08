import React, { useState, useEffect } from 'react';
import { useSiteStore } from '../store/siteStore';
import { Play, Music, ChevronDown } from 'lucide-react';
import useAudioStore from '../store/audio';

const NewReleaseNotification = () => {
    const { data } = useSiteStore();
    const { songs, latestIds } = React.useMemo(() => {
        const s = data?.music || [];
        const ids = data?.discover?.latestIds || [];
        return { songs: s, latestIds: ids };
    }, [data]);

    const latestTracks = React.useMemo(() => {
        return songs.filter(track => latestIds.includes(track.id));
    }, [songs, latestIds]);

    const [visibleTracks, setVisibleTracks] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [hasRendered, setHasRendered] = useState(false);
    const [hasSeen, setHasSeen] = useState(false);
    const { setIndex } = useAudioStore();

    useEffect(() => {
        if (latestTracks.length > 0) {
            // Trigger the smooth slide-up from bottom
            const timer1 = setTimeout(() => {
                setIsCollapsed(false);
                setHasRendered(true);
                setHasSeen(true);
            }, 500);

            // Sequential Reveal Logic
            let delay = 1200; 
            const timers = latestTracks.slice(0, 3).map((track, index) => {
                return setTimeout(() => {
                    setVisibleTracks(prev => {
                        if (prev.find(t => t.id === track.id)) return prev;
                        return [...prev, track];
                    });
                }, delay + index * 600); 
            });

            return () => {
                clearTimeout(timer1);
                timers.forEach(t => clearTimeout(t));
            };
        }
    }, [latestTracks]);

    const handlePlay = (track) => {
        const idx = songs.findIndex(s => s.id === track.id);
        if (idx !== -1) {
            setIndex(idx, { autoplay: true });
        }
    };

    if (visibleTracks.length === 0) return null;

    return (
        <>
            <div className={`fixed bottom-20 sm:bottom-24 left-4 sm:left-6 z-[80] flex flex-col pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] new-release-notification ${isCollapsed ? 'translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'}`}>
                <div className="mb-3 sm:mb-5 ml-1 sm:ml-2 flex items-center justify-between w-60 sm:w-64 max-w-[90vw] pr-2 pointer-events-auto">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                        <div className="h-[1px] w-4 bg-white/20" />
                        <span>New Releases</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsCollapsed(true)}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/50 transition-all hover:bg-white/10 hover:text-white active:scale-90 cursor-pointer"
                        aria-label="Collapse new releases"
                    >
                        <ChevronDown size={12} />
                    </button>
                </div>
                
                <div className="flex flex-col-reverse gap-2">
                    {visibleTracks.map((track, index) => (
                        <div
                            key={track.id}
                            className="group pointer-events-auto relative w-60 sm:w-64 max-w-[90vw] animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out"
                            style={{
                                transform: `translateY(${index * -6}px) scale(${1 - index * 0.04})`,
                                zIndex: 100 - index,
                                opacity: 1 - index * 0.15
                            }}
                        >
                            {/* Compact Liquid Glass Box */}
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-2 px-3 shadow-lg backdrop-blur-md transition-all hover:bg-black/60 hover:border-white/20">
                                <div className="flex items-center gap-2.5 sm:gap-3">
                                    {/* Small Art */}
                                    <img
                                        src={track.cover || '/images/music.webp'}
                                        alt=""
                                        className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 rounded-lg object-cover shadow-sm"
                                    />

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="truncate text-xs sm:text-[13px] font-medium text-white/90">
                                            {track.title}
                                        </h4>
                                        <p className="truncate text-[10px] sm:text-[11px] text-white/50">
                                            {track.author}
                                        </p>
                                    </div>

                                    {/* Direct Play Button */}
                                    <button
                                        type="button"
                                        onClick={() => handlePlay(track)}
                                        className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-red-500 hover:scale-110 active:scale-95 shadow-sm cursor-pointer"
                                        aria-label="Play release"
                                    >
                                        <Play size={12} fill="currentColor" className="ml-0.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Restore Button (Side Tab) */}
            <div className={`fixed bottom-20 sm:bottom-24 left-0 z-[80] transition-all duration-500 delay-300 ${isCollapsed && hasRendered ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}>
                <button
                    type="button"
                    onClick={() => {
                        setIsCollapsed(false);
                        setHasSeen(true);
                    }}
                    className="flex h-10 w-9 sm:h-12 sm:w-10 items-center justify-center rounded-r-2xl border border-l-0 border-white/20 bg-black/40 backdrop-blur-md text-white shadow-xl transition-all hover:bg-black/60 hover:w-11 active:scale-95 group pl-1 cursor-pointer"
                    aria-label="Show new releases"
                >
                    <Music size={16} className="translate-y-0.5" />
                    {!hasSeen && (
                        <div className="absolute top-2 right-2 flex h-2 w-2 items-center justify-center rounded-full bg-red-500 shadow-sm" />
                    )}
                </button>
            </div>
        </>
    );
};

export default NewReleaseNotification;