import React, { useState, useEffect } from 'react';
import { useSiteStore } from '../store/siteStore';
import { X, Play, Music, ChevronDown, ChevronUp } from 'lucide-react';
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
            setTimeout(() => {
                setIsCollapsed(false);
                setHasRendered(true);
                setHasSeen(true); // Mark as seen since they appear on load
            }, 500);

            // Sequential Reveal Logic for individual cards
            let delay = 1200; 
            latestTracks.slice(0, 3).forEach((track, index) => {
                setTimeout(() => {
                    setVisibleTracks(prev => {
                        if (prev.find(t => t.id === track.id)) return prev;
                        return [...prev, track];
                    });
                }, delay + index * 600); 
            });
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
            <div className={`fixed bottom-24 left-6 z-[100] flex flex-col pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isCollapsed ? 'translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'}`}>
                <div className="mb-5 ml-2 flex items-center justify-between w-64 pr-2 pointer-events-auto">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                        <div className="h-[1px] w-4 bg-white/20" />
                        <span>New Releases</span>
                    </div>
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/40 transition-all hover:bg-white/10 hover:text-white active:scale-90"
                    >
                        <ChevronDown size={12} />
                    </button>
                </div>
                
                <div className="flex flex-col-reverse gap-2">
                    {visibleTracks.map((track, index) => (
                        <div
                            key={track.id}
                            className="group pointer-events-auto relative w-64 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out"
                            style={{
                                transform: `translateY(${index * -6}px) scale(${1 - index * 0.04})`,
                                zIndex: 100 - index,
                                opacity: 1 - index * 0.15
                            }}
                        >
                            {/* Compact Liquid Glass Box */}
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 px-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20">
                                <div className="flex items-center gap-3">
                                    {/* Small Art */}
                                    <img
                                        src={track.cover || '/images/music.webp'}
                                        alt=""
                                        className="h-10 w-10 flex-shrink-0 rounded-lg object-cover shadow-sm"
                                    />

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="truncate text-[13px] font-medium text-white/90">
                                            {track.title}
                                        </h4>
                                        <p className="truncate text-[11px] text-white/40">
                                            {track.author}
                                        </p>
                                    </div>

                                    {/* Direct Play Button */}
                                    <button
                                        onClick={() => handlePlay(track)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-red-500 hover:scale-110 active:scale-95 shadow-sm"
                                    >
                                        <Play size={14} fill="currentColor" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Restore Button (Side Tab) */}
            <div className={`fixed bottom-24 left-0 z-[110] transition-all duration-500 delay-300 ${isCollapsed && hasRendered ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}>
                <button
                    onClick={() => {
                        setIsCollapsed(false);
                        setHasSeen(true);
                    }}
                    className="flex h-12 w-10 items-center justify-center rounded-r-2xl border border-l-0 border-white/20 bg-white/10 backdrop-blur-md text-white shadow-xl transition-all hover:bg-white/20 hover:w-12 active:scale-95 group pl-1"
                >
                    <Music size={18} className="translate-y-0.5" />
                    {!hasSeen && (
                        <div className="absolute top-2 right-2 flex h-2 w-2 items-center justify-center rounded-full bg-red-500 shadow-sm" />
                    )}
                </button>
            </div>
        </>
    );
};

export default NewReleaseNotification;
