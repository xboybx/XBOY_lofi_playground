import { WindowControls } from '#components'
import { useSiteStore } from '../store/siteStore'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'
import useAudioStore from '#store/audio'
import React, { useEffect, useState, useMemo } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Repeat1, Loader, ListMusic, Clock, Flame } from 'lucide-react/dist/esm/icons'

const formatTime = (s) => {
  if (!s || Number.isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const Music = () => {
  const isOpen = useWindowStore(state => state.windows.music?.isOpen);
  const { data } = useSiteStore();
  const songs = data?.music || [];
  const newReleaseIds = data?.discover?.newReleaseIds || [];
  const latestIds = data?.discover?.latestIds || [];

  const [activeTab, setActiveTab] = useState('all');

  const filteredSongs = useMemo(() => {
    if (activeTab === 'featured') {
      return songs.filter(s => newReleaseIds.includes(s.id));
    }
    if (activeTab === 'latest') {
      return songs.filter(s => latestIds.includes(s.id));
    }
    return songs;
  }, [songs, activeTab, newReleaseIds, latestIds]);

  const {
    init,
    playlist,
    currentIndex,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    muted,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    next,
    prev,
    setIndex,
    repeatMode,
    toggleRepeatMode,
    shuffle,
    toggleShuffle,
  } = useAudioStore();

  // Initialize the shared audio controller once
  useEffect(() => {
    init(songs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pause playback when the Music window fully closes (not minimized)
  useEffect(() => {
    return () => {
      const musicWindow = useWindowStore.getState().windows['music'];
      // If the window is minimized, it unmounts from DOM but shouldn't stop playing
      if (!musicWindow?.isMinimized) {
        useAudioStore.getState().pause();
      }
    };
  }, []);

  // Add spacebar support for play/pause
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e) => {
      // Only trigger if Music window is open and spacebar is pressed
      if (e.code === 'Space' || e.key === ' ') {
        // Prevent default scrolling behavior
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, togglePlay]);

  const seekHandler = (e) => {
    const val = Number(e.target.value);
    seek(val);
  };

  const changeVolume = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
  };

  const selectSong = (songId) => {
    const idx = songs.findIndex(s => s.id === songId);
    if (idx !== -1) setIndex(idx, { autoplay: true });
  };

  const current = playlist?.[currentIndex] || songs[currentIndex] || null;

  // Get repeat icon based on mode
  const getRepeatIcon = () => {
    if (repeatMode === 'repeat-one') {
      return <Repeat1 size={22} className='text-red-500' />;
    } else if (repeatMode === 'autoplay') {
      return <Repeat size={22} className='text-red-500' />;
    }
    return <Repeat size={22} className='text-gray-700' />;
  };

  return (
    <div className="flex flex-col h-full">
      <div id='window-header' className='window-drag-handle'>
        <WindowControls target="music" />
        <h2 className='flex-1 text-center font-bold'>Music</h2>
      </div>
      <div className='flex w-full flex-1 min-h-0'>
        <div className='sidebar pr-0 max-sm:hidden flex flex-col'>
          <div className="flex gap-1 mb-2 pr-2 border-b border-gray-200 pb-2">
            <button
               onClick={() => setActiveTab('all')}
               className={`flex-1 flex flex-col items-center p-1 rounded-md transition-colors ${activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-500'}`}
               title="All Songs"
            >
               <ListMusic size={18} />
               <span className="text-[10px] mt-1 font-medium">All</span>
            </button>
            <button
               onClick={() => setActiveTab('latest')}
               className={`flex-1 flex flex-col items-center p-1 rounded-md transition-colors ${activeTab === 'latest' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-500'}`}
               title="Latest"
            >
               <Clock size={18} />
               <span className="text-[10px] mt-1 font-medium">Latest</span>
            </button>
            <button
               onClick={() => setActiveTab('featured')}
               className={`flex-1 flex flex-col items-center p-1 rounded-md transition-colors ${activeTab === 'featured' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-500'}`}
               title="Featured"
            >
               <Flame size={18} />
               <span className="text-[10px] mt-1 font-medium">Featured</span>
            </button>
          </div>
          <ul className="overflow-y-auto pr-2 pb-2">
            {filteredSongs.map((song) => {
              const globalIdx = songs.findIndex(s => s.id === song.id);
              return (
                <li
                  key={song.id}
                  onClick={() => selectSong(song.id)}
                  className={globalIdx === currentIndex ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}
                  title={song.title}
                >
                  <img src={song.cover} alt="cover" className='w-5 h-5 object-cover rounded' loading='lazy' />
                  <p className='truncate'>{song.title}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <div className='player'>
          <div className='cover relative'>
            <img
              src={current?.cover || '/images/music.webp'}
              alt={current?.title || 'Cover'}
              loading='lazy'
              className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
            />
          </div>
          <div className='mt-4 sm:mt-6 text-center'>
            <h3 className='text-xl sm:text-3xl font-bold truncate px-2'>{current?.title || 'Unknown'}</h3>
            <p className='text-xs sm:text-sm text-gray-500 mt-1 truncate px-2'>{current?.author || 'Unknown'}</p>
          </div>
          <div className='sliders mt-3'>
            <div className='flex-1'>
              <input
                type='range'
                min={0}
                max={Math.max(duration, 0)}
                step={0.01}
                value={Math.min(currentTime, duration || 0)}
                onChange={seekHandler}
                disabled={isLoading}
                className='w-full accent-red-500 disabled:opacity-50 py-2'
                onMouseDown={(e) => e.stopPropagation()}
                onMouseDownCapture={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className='flex justify-between text-xs text-gray-500 mt-1'>
            <span>{formatTime(currentTime)}</span> &nbsp; - &nbsp;
            <span>{formatTime(duration)}</span>
          </div>
          <div className='flex items-center justify-center gap-3 sm:gap-6 mt-4'>
            <button
              aria-label='Shuffle'
              onClick={toggleShuffle}
              className={`p-2 rounded-full ${shuffle ? 'bg-red-100' : 'bg-gray-100'} hover:bg-gray-200`}
              title={shuffle ? 'Shuffle: On' : 'Shuffle: Off'}
            >
              <Shuffle size={22} className={shuffle ? 'text-red-500' : 'text-gray-700'} />
            </button>
            <button aria-label='Previous' onClick={prev} className='p-2 rounded-full bg-gray-100 hover:bg-gray-200'>
              <SkipBack size={22} className='text-gray-700' />
            </button>
            <button
              aria-label='Play/Pause'
              onClick={togglePlay}
              disabled={isLoading}
              className='w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-md hover:bg-red-600 disabled:opacity-75'
            >
              {isLoading ? (
                <Loader size={28} className='text-white animate-spin' />
              ) : isPlaying ? (
                <Pause size={28} className='text-white' />
              ) : (
                <Play size={28} className='text-white ml-1' />
              )}
            </button>
            <button aria-label='Next' onClick={next} className='p-2 rounded-full bg-gray-100 hover:bg-gray-200'>
              <SkipForward size={22} className='text-gray-700' />
            </button>
            <button
              aria-label='Repeat Mode'
              onClick={toggleRepeatMode}
              className={`p-2 rounded-full ${repeatMode !== 'none' ? 'bg-red-100' : 'bg-gray-100'} hover:bg-gray-200`}
              title={
                repeatMode === 'none' ? 'Repeat: Off' :
                  repeatMode === 'autoplay' ? 'Autoplay: On' :
                    'Repeat One: On'
              }
            >
              {getRepeatIcon()}
            </button>
          </div>
          <div className='sliders mt-4 flex-center mr-2 scale-75'>
            <button aria-label='Mute' onClick={toggleMute} className='p-2 rounded bg-gray-100 hover:bg-gray-200'>
              {muted || volume === 0 ? <VolumeX size={18} className='text-gray-600' /> : <Volume2 size={18} className='text-gray-600' />}
            </button>
            <input
              type='range'
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={changeVolume}
              className='accent-gray-600 w-1/2 mx-auto py-2'
              onMouseDown={(e) => e.stopPropagation()}
              onMouseDownCapture={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            />
          </div>
          {/* Centralized audio: no <audio> element needed; store manages a single Audio instance */}
        </div>
      </div>
    </div>
  )
}

const MusicWindow = WindowWrapper(Music, 'music')

export default MusicWindow
