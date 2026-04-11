import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import YouTubePlayer from 'youtube-player'

const useAudioStore = create(immer((set, get) => ({
  player: null,
  playlist: [],
  currentIndex: 0,
  initialized: false,
  pollInterval: null,

  isPlaying: false,
  isLoading: true, // initial state before player is ready
  currentTime: 0,
  duration: 0,
  volume: 1,
  muted: false,
  ended: false,

  repeatMode: 'none',
  shuffle: false,
  playedIndices: [],

  init: (songs) => set((state) => {
    if (state.initialized) return;

    let container = document.getElementById('youtube-player-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'youtube-player-container';
      container.style.display = 'none';
      document.body.appendChild(container);
    }

    const player = YouTubePlayer('youtube-player-container', {
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        origin: window.location.origin
      }
    });

    state.player = player;
    state.playlist = Array.isArray(songs) ? songs : [];
    state.currentIndex = 0;
    state.initialized = true;

    if (state.playlist.length > 0 && state.playlist[0].youtubeId) {
      state.isLoading = true;
      player.cueVideoById(state.playlist[0].youtubeId).catch(() => {});
    } else {
      state.isLoading = false;
    }

    player.setVolume(state.volume * 100);

    // YouTube state: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 video cued
    player.on('stateChange', (event) => {
      // Manage loading state
      if (event.data === -1 || event.data === 3) {
        set((s) => { s.isLoading = true; });
      } else {
        set((s) => { s.isLoading = false; });
      }

      if (event.data === 1) { // Playing
        set((s) => { s.isPlaying = true; s.ended = false; });
        player.getDuration().then(dur => set(s => { s.duration = dur; }));

        let interval = get().pollInterval;
        if (!interval) {
          interval = setInterval(async () => {
            const time = await player.getCurrentTime();
            set(s => { s.currentTime = time || 0; });
          }, 250);
          set(s => { s.pollInterval = interval; });
        }
      } else {
        set((s) => { s.isPlaying = false; });
        const interval = get().pollInterval;
        if (interval) {
          clearInterval(interval);
          set(s => { s.pollInterval = null; });
        }

        if (event.data === 0) { // Ended
          set((s) => { s.ended = true; });
          const { repeatMode, next } = get();
          if (repeatMode === 'repeat-one') {
            player.seekTo(0);
            player.playVideo();
          } else if (repeatMode === 'autoplay') {
            next();
          }
        }
      }
    });
  }),

  play: async () => {
    const { player } = get();
    if (!player) return;
    try { await player.playVideo(); } catch (_) {}
  },
  pause: () => {
    const { player } = get();
    if (!player) return;
    player.pauseVideo();
  },
  togglePlay: async () => {
    const { player, isPlaying } = get();
    if (!player) return;
    if (isPlaying) {
      await player.pauseVideo();
    } else {
      await player.playVideo();
    }
  },
  seek: async (time) => {
    const { player, duration } = get();
    if (!player || Number.isNaN(time)) return;
    const target = Math.max(0, Math.min(time, duration || Number.MAX_SAFE_INTEGER));
    await player.seekTo(target, true);
    set(s => { s.currentTime = target; });
  },
  setVolume: (v) => set((state) => {
    const volume = Math.max(0, Math.min(1, Number(v)));
    state.volume = Number.isNaN(volume) ? state.volume : volume;
    if (state.player) {
      state.player.setVolume(state.volume * 100);
    }
    if (state.volume > 0 && state.muted) {
      state.muted = false;
      if (state.player) state.player.unMute();
    }
  }),
  toggleMute: () => set((state) => {
    state.muted = !state.muted;
    if (state.player) {
      if (state.muted) {
        state.player.mute();
      } else {
        state.player.unMute();
      }
    }
  }),
  setMuted: (m) => set((state) => {
    state.muted = Boolean(m);
    if (state.player) {
      if (state.muted) {
        state.player.mute();
      } else {
        state.player.unMute();
      }
    }
  }),

  toggleRepeatMode: () => set((state) => {
    if (state.repeatMode === 'none') {
      state.repeatMode = 'autoplay';
    } else if (state.repeatMode === 'autoplay') {
      state.repeatMode = 'repeat-one';
    } else {
      state.repeatMode = 'none';
    }
  }),

  toggleShuffle: () => set((state) => {
    state.shuffle = !state.shuffle;
    if (state.shuffle) {
      state.playedIndices = [state.currentIndex];
    } else {
      state.playedIndices = [];
    }
  }),

  getNextShuffleIndex: () => {
    const { playlist, playedIndices, currentIndex } = get();
    const unplayedIndices = [];
    for (let i = 0; i < playlist.length; i++) {
      if (!playedIndices.includes(i)) {
        unplayedIndices.push(i);
      }
    }
    if (unplayedIndices.length === 0) {
      set((state) => { state.playedIndices = [currentIndex]; });
      for (let i = 0; i < playlist.length; i++) {
        if (i !== currentIndex) {
          unplayedIndices.push(i);
        }
      }
    }
    if (unplayedIndices.length > 0) {
      const randomIdx = Math.floor(Math.random() * unplayedIndices.length);
      return unplayedIndices[randomIdx];
    }
    return (currentIndex + 1) % playlist.length;
  },

  setIndex: async (idx, { autoplay } = {}) => {
    const wasPlaying = get().isPlaying;
    
    let loadedNewVideo = false;
    set((state) => {
      const next = ((idx % state.playlist.length) + state.playlist.length) % state.playlist.length;
      state.currentIndex = next;
      
      if (state.shuffle && !state.playedIndices.includes(next)) {
        state.playedIndices.push(next);
      }
      
      const targetSong = state.playlist[next];
      if (state.player && targetSong && targetSong.youtubeId) {
        state.isLoading = true;
        if (wasPlaying || autoplay) {
          state.player.loadVideoById(targetSong.youtubeId);
        } else {
          state.player.cueVideoById(targetSong.youtubeId);
        }
        loadedNewVideo = true;
        state.currentTime = 0;
        state.duration = 0;
        state.ended = false;
      }
    });

    const shouldAutoplay = autoplay !== undefined ? autoplay : wasPlaying;
    if (shouldAutoplay && !loadedNewVideo) {
      setTimeout(async () => {
        await get().play();
      }, 50);
    }
  },
  
  next: () => {
    const { currentIndex, playlist, shuffle, repeatMode } = get();
    if (!playlist.length) return;
    let nextIdx = shuffle ? get().getNextShuffleIndex() : (currentIndex + 1) % playlist.length;
    const shouldAutoplay = repeatMode === 'autoplay' || get().isPlaying;
    return get().setIndex(nextIdx, { autoplay: shouldAutoplay });
  },
  
  prev: () => {
    const { currentIndex, playlist, shuffle, playedIndices, repeatMode } = get();
    if (!playlist.length) return;
    
    let prevIdx;
    if (shuffle && playedIndices.length > 1) {
      const currentPos = playedIndices.indexOf(currentIndex);
      if (currentPos > 0) {
        prevIdx = playedIndices[currentPos - 1];
        set((state) => {
          state.playedIndices = state.playedIndices.slice(0, currentPos);
        });
      } else {
        prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
      }
    } else {
      prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    }
    
    const shouldAutoplay = repeatMode === 'autoplay' || get().isPlaying;
    return get().setIndex(prevIdx, { autoplay: shouldAutoplay });
  },
})));

export default useAudioStore;
