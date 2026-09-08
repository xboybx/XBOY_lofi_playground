import { WindowControls } from '#components'
import { useSiteStore } from '../store/siteStore'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'
import useAudioStore from '#store/audio'
import React, { useEffect, useState, useMemo } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Repeat1, Loader, ListMusic, Clock, Flame, Disc3 } from 'lucide-react/dist/esm/icons'
import { useIsMobile } from '../hooks/useIsMobile'

const formatTime = (s) => {
  if (!s || Number.isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const Music = () => {
  const isMobile = useIsMobile(640);
  const isOpen = useWindowStore(state => state.windows.music?.isOpen);
  const { data } = useSiteStore();
  const songs = data?.music || [];
  const newReleaseIds = data?.discover?.newReleaseIds || [];
  const latestIds = data?.discover?.latestIds || [];

  const [activeTab, setActiveTab] = useState('all');
  const [mobileView, setMobileView] = useState('player'); // 'player' | 'playlist'

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

  useEffect(() => {
    init(songs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      const musicWindow = useWindowStore.getState().windows['music'];
      if (!musicWindow?.isMinimized) {
        useAudioStore.getState().pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
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
    if (idx !== -1) {
      setIndex(idx, { autoplay: true });
      if (isMobile) {
        setMobileView('player');
      }
    }
  };

  const current = playlist?.[currentIndex] || songs[currentIndex] || null;

  const getRepeatIcon = () => {
    if (repeatMode === 'repeat-one') {
      return <Repeat1 size={20} className='text-red-500' />;
    } else if (repeatMode === 'autoplay') {
      return <Repeat size={20} className='text-red-500' />;
    }
    return <Repeat size={20} className='text-gray-700' />;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Window Header */}
      <div id='window-header' className='window-drag-handle flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0'>
        <WindowControls target="music" />
        <h2 className='flex-1 text-center font-bold text-xs sm:text-sm truncate max-w-[50vw]'>Music</h2>
        {isMobile ? (
          <div className="flex items-center gap-1 bg-gray-200/70 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setMobileView('player')}
              className={`p-1 px-2 rounded-md text-[11px] font-medium transition-all ${mobileView === 'player' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
              aria-label="Now Playing View"
            >
              <Disc3 size={14} className="inline mr-1" /> Player
            </button>
            <button
              type="button"
              onClick={() => setMobileView('playlist')}
              className={`p-1 px-2 rounded-md text-[11px] font-medium transition-all ${mobileView === 'playlist' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
              aria-label="Playlist View"
            >
              <ListMusic size={14} className="inline mr-1" /> Songs
            </button>
          </div>
        ) : (
          <div className="w-12" />
        )}
      </div>

      <div className='flex w-full flex-1 min-h-0 overflow-hidden'>
        {/* Sidebar / Playlist view */}
        <div className={`sidebar flex-col border-r border-gray-200 p-3 sm:p-4 bg-gray-50 flex-shrink-0 ${
          isMobile ? (mobileView === 'playlist' ? 'flex w-full flex-1' : 'hidden') : 'flex w-4/12 max-w-[280px]'
        }`}>
          <div className="flex gap-1 mb-2 border-b border-gray-200 pb-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex-1 flex flex-col items-center p-1 rounded-md transition-colors ${activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-500'}`}
              title="All Songs"
            >
              <ListMusic size={16} />
              <span className="text-[10px] mt-0.5 font-medium">All</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('latest')}
              className={`flex-1 flex flex-col items-center p-1 rounded-md transition-colors ${activeTab === 'latest' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-500'}`}
              title="Latest"
            >
              <Clock size={16} />
              <span className="text-[10px] mt-0.5 font-medium">Latest</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('featured')}
              className={`flex-1 flex flex-col items-center p-1 rounded-md transition-colors ${activeTab === 'featured' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-500'}`}
              title="Featured"
            >
              <Flame size={16} />
              <span className="text-[10px] mt-0.5 font-medium">Featured</span>
            </button>
          </div>
          <ul className="overflow-y-auto pr-1 pb-2 space-y-1 flex-1">
            {filteredSongs.map((song) => {
              const globalIdx = songs.findIndex(s => s.id === song.id);
              const isSelected = globalIdx === currentIndex;
              return (
                <li
                  key={song.id}
                  onClick={() => selectSong(song.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-xs sm:text-sm ${
                    isSelected ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-200 text-gray-700'
                  }`}
                  title={song.title}
                >
                  <img src={song.cover || '/images/music.webp'} alt="cover" className='w-7 h-7 object-cover rounded shadow-sm shrink-0' loading='lazy' />
                  <div className="flex-1 min-w-0">
                    <p className='truncate'>{song.title}</p>
                    <p className='text-[10px] text-gray-500 truncate'>{song.author}</p>
                  </div>
                  {isSelected && isPlaying && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Player View */}
        <div className={`player flex-1 flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto min-h-0 bg-white ${
          isMobile && mobileView === 'playlist' ? 'hidden' : 'flex'
        }`}>
          <div className='cover relative w-full flex justify-center my-auto max-h-[35vh]'>
            <img
              src={current?.cover || '/images/music.webp'}
              alt={current?.title || 'Cover'}
              loading='lazy'
              className={`max-h-[30vh] w-auto aspect-square rounded-2xl shadow-xl object-cover transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
            />
          </div>

          <div className='w-full max-w-md flex flex-col items-center my-auto'>
            <div className='text-center w-full px-2 mb-2'>
              <h3 className='text-base sm:text-2xl font-bold truncate text-gray-900'>{current?.title || 'Select a song'}</h3>
              <p className='text-xs sm:text-sm text-gray-500 mt-0.5 truncate'>{current?.author || 'XBOY Lofi'}</p>
            </div>

            {/* Seek Bar */}
            <div className='w-full mt-2'>
              <div className='relative w-full'>
                <input
                  type='range'
                  min={0}
                  max={Math.max(duration, 0)}
                  step={0.01}
                  value={Math.min(currentTime, duration || 0)}
                  onChange={seekHandler}
                  disabled={isLoading}
                  className='w-full accent-red-500 disabled:opacity-50 py-1'
                  aria-label="Seek position"
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                />
              </div>
              <div className='flex justify-between text-[10px] sm:text-xs text-gray-500 mt-1 px-1'>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className='flex items-center justify-center gap-3 sm:gap-6 mt-3'>
              <button
                type="button"
                aria-label='Shuffle'
                onClick={toggleShuffle}
                className={`p-1.5 sm:p-2 rounded-full ${shuffle ? 'bg-red-100' : 'bg-gray-100'} hover:bg-gray-200 transition-colors cursor-pointer`}
                title={shuffle ? 'Shuffle: On' : 'Shuffle: Off'}
              >
                <Shuffle size={18} className={shuffle ? 'text-red-500' : 'text-gray-700'} />
              </button>
              <button
                type="button"
                aria-label='Previous'
                onClick={prev}
                className='p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer'
              >
                <SkipBack size={18} className='text-gray-700' />
              </button>
              <button
                type="button"
                aria-label='Play/Pause'
                onClick={togglePlay}
                disabled={isLoading}
                className='w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-red-500 flex items-center justify-center shadow-md hover:bg-red-600 active:scale-95 transition-all disabled:opacity-75 cursor-pointer text-white'
              >
                {isLoading ? (
                  <Loader size={22} className='text-white animate-spin' />
                ) : isPlaying ? (
                  <Pause size={22} className='text-white' />
                ) : (
                  <Play size={22} className='text-white ml-0.5' />
                )}
              </button>
              <button
                type="button"
                aria-label='Next'
                onClick={next}
                className='p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer'
              >
                <SkipForward size={18} className='text-gray-700' />
              </button>
              <button
                type="button"
                aria-label='Repeat Mode'
                onClick={toggleRepeatMode}
                className={`p-1.5 sm:p-2 rounded-full ${repeatMode !== 'none' ? 'bg-red-100' : 'bg-gray-100'} hover:bg-gray-200 transition-colors cursor-pointer`}
                title={
                  repeatMode === 'none' ? 'Repeat: Off' :
                    repeatMode === 'autoplay' ? 'Autoplay: On' :
                      'Repeat One: On'
                }
              >
                {getRepeatIcon()}
              </button>
            </div>

            {/* Volume */}
            <div className='flex items-center justify-center gap-2 mt-3 w-full max-w-xs px-4'>
              <button
                type="button"
                aria-label='Mute'
                onClick={toggleMute}
                className='p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer'
              >
                {muted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <input
                type='range'
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={changeVolume}
                className='accent-gray-600 flex-1 py-1'
                aria-label="Volume"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MusicWindow = WindowWrapper(Music, 'music');

export default MusicWindow;
