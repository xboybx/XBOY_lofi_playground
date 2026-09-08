import React, { useState } from 'react';
import useAudioStore from '../store/audio';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

const formatTime = (s) => {
  if (!s || Number.isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const MusicPopup = () => {
  const isMobile = useIsMobile(768);
  const {
    playlist,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    next,
    prev,
    seek,
    volume,
    muted,
    setVolume,
    toggleMute
  } = useAudioStore();

  const currentTrack = playlist[currentIndex] || {};
  const [isExpanded, setIsExpanded] = useState(false);
  const popupRef = React.useRef(null);

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  React.useEffect(() => {
    if (isMobile) return;
    let instance = null;
    let isMounted = true;
    Promise.all([
      import('gsap'),
      import('gsap/Draggable')
    ]).then(([{ gsap }, { Draggable }]) => {
      if (!isMounted || !popupRef.current) return;
      gsap.registerPlugin(Draggable);
      
      instance = Draggable.create(popupRef.current, {
        type: 'x',
        bounds: window,
        cursor: 'grab',
        activeCursor: 'grabbing',
        ignore: 'button, input'
      })[0];
    });
    return () => {
      isMounted = false;
      instance?.kill();
    };
  }, [isMobile]);

  if (!playlist.length) return null;

  return (
    <div
      ref={popupRef}
      className="fixed left-0 right-0 mx-auto w-[320px] max-w-[94vw] bg-black/30 backdrop-blur-md backdrop-saturate-150 border border-white/20 border-t-0 shadow-[inset_0_-1px_1px_rgba(255,255,255,0.15),0_20px_40px_rgba(0,0,0,0.5)] rounded-b-[24px] p-3 sm:p-4 flex flex-col select-none hover:bg-black/40 hover:border-white/30 z-[60]"
      style={{ top: 'var(--navbar-height, 44px)' }}
    >
      {/* Top Section: Art + Title + Toggle */}
      <div className="flex gap-3 items-center">
        <div className="size-[42px] sm:size-[48px] rounded-[10px] overflow-hidden shadow-xl flex-shrink-0 bg-white/5 pointer-events-none">
          <img
            src={currentTrack.cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80'}
            className="w-full h-full object-cover"
            alt="Album Art"
          />
        </div>
        <div className="flex-1 overflow-hidden pointer-events-none min-w-0">
          <h4 className="text-xs sm:text-[14px] text-white font-bold leading-tight truncate mb-0.5">
            {currentTrack.title || 'Music'}
          </h4>
          <p className="text-[#a1a1a1] text-[11px] sm:text-[12px] font-medium truncate">
            {currentTrack.author || 'YouTube Music'}
          </p>
        </div>
        <button
          type="button"
          onMouseDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer flex-shrink-0"
          aria-label={isExpanded ? 'Collapse player' : 'Expand player'}
        >
          {isExpanded ? <ChevronUp size={20} strokeWidth={2.5} /> : <ChevronDown size={20} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Expandable Section */}
      <div className={`overflow-hidden transition-all duration-300 flex flex-col justify-center ${isExpanded ? 'max-h-[250px] mt-4 opacity-100' : 'max-h-0 mt-0 opacity-0'}`}>

        {/* Progress Section */}
        <div className="w-full space-y-1.5 mb-3 relative z-10" onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
          <div className="relative group/progress h-[4px] sm:h-[5px] w-full bg-white/10 rounded-full cursor-pointer">
            <div
              className="absolute top-0 left-0 h-full bg-[#f5f5f7] rounded-full transition-all duration-200"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
            {/* Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 size-2.5 bg-white rounded-full shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - 5px)` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime || 0}
              onChange={handleSeek}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label="Seek track"
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#86868b] font-medium px-0.5 pointer-events-none">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex items-center justify-between px-4 sm:px-8 relative z-10">
          <button
            type="button"
            onMouseDown={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="text-white/80 hover:text-white transition-transform active:scale-90 cursor-pointer p-1"
            aria-label="Previous track"
          >
            <SkipBack size={22} fill="currentColor" strokeWidth={0} />
          </button>
          <button
            type="button"
            onMouseDown={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer p-1"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={30} fill="currentColor" strokeWidth={0} />
            ) : (
              <Play size={30} fill="currentColor" strokeWidth={0} className="ml-1" />
            )}
          </button>
          <button
            type="button"
            onMouseDown={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="text-white/80 hover:text-white transition-transform active:scale-90 cursor-pointer p-1"
            aria-label="Next track"
          >
            <SkipForward size={22} fill="currentColor" strokeWidth={0} />
          </button>
        </div>

        {/* Volume Section */}
        <div className="flex items-center gap-2 sm:gap-3 mt-3 px-1 group/volume relative z-10" onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
            className="text-[#86868b] hover:text-white transition-colors cursor-pointer"
            aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}
          >
            {muted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <div className="relative flex-1 h-[4px] bg-white/10 rounded-full cursor-pointer">
            <div
              className="absolute top-0 left-0 h-full bg-[#86868b] group-hover/volume:bg-white rounded-full transition-all duration-200"
              style={{ width: `${(volume || 0) * 100}%` }}
            />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume || 0}
              onChange={handleVolume}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label="Volume slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPopup;