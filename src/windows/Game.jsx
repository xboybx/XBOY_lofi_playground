import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import { ExternalLink, ArrowLeft, Gamepad2 } from 'lucide-react/dist/esm/icons'
import useWindowStore from '#store/window'
import useAudioStore from '#store/audio'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useIsMobile } from '../hooks/useIsMobile'

const games = [
  {
    id: 'kirka',
    name: 'Kirka.io (FPS)',
    icon: 'https://imgs.crazygames.com/kirka-io_16x9/20260116015838/kirka-io_16x9-cover?metadata=none&quality=60&height=4017',
    url: 'https://kirka.io/',
    description: 'Voxel-style CoD shooter',
    category: 'arcade'
  },
  {
    id: 'townscaper',
    name: 'Townscaper',
    icon: 'https://design-milk.com/images/2020/07/Townscaper-4.jpg',
    url: 'https://oskarstalberg.com/Townscaper/',
    description: 'Relaxing city builder toy',
    category: 'simulation'
  },
  {
    id: 'slowroads',
    name: 'Slow Roads',
    icon: 'https://imgs.crazygames.com/games/drift-hunters/cover-1656950639575.png?metadata=none&quality=100&width=1200&height=630&fit=crop',
    url: 'https://slowroads.io/',
    description: '3D Driving & Exploration',
    category: 'simulation'
  },
  {
    id: 'chess',
    name: 'Chess',
    icon: '/images/chess.jpg',
    url: 'https://chessnubot.vercel.app/',
    description: 'Play chess online',
    category: 'strategy'
  }
]

const categories = [
  { id: 'all', name: 'All Games', count: games.length },
  { id: 'arcade', name: 'Arcade', count: games.filter(g => g.category === 'arcade').length },
  { id: 'strategy', name: 'Strategy', count: games.filter(g => g.category === 'strategy').length },
  { id: 'simulation', name: 'Simulation', count: games.filter(g => g.category === 'simulation').length }
]

const Game = () => {
  const isMobile = useIsMobile(640);
  const focusWindow = useWindowStore(state => state.focusWindow);
  const windows = useWindowStore(state => state.windows);
  const pause = useAudioStore(state => state.pause);
  const iframeRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const isOpen = windows['game']?.isOpen;

  const filteredGames = selectedCategory === 'all'
    ? games
    : games.filter(g => g.category === selectedCategory);

  const isFocused = (() => {
    const openWindows = Object.values(windows).filter(w => w.isOpen);
    const maxZ = openWindows.reduce((m, w) => Math.max(m, w.zIndex), 0);
    const self = windows['game'];
    return !!self?.isOpen && self?.zIndex === maxZ;
  })();

  useEffect(() => {
    const handler = (e) => {
      if (e?.data === 'focus-game' || e?.data?.type === 'focus-game') {
        focusWindow('game');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [focusWindow]);

  useEffect(() => {
    if (!isOpen && iframeRef.current) {
      pause();
      try {
        iframeRef.current.contentWindow?.postMessage({
          type: 'pause-all-audio'
        }, '*');
      } catch (e) {
        // Ignore
      }

      const timeoutId = setTimeout(() => {
        if (iframeRef.current && !isOpen) {
          const src = iframeRef.current.src;
          iframeRef.current.src = 'about:blank';
          iframeRef.current.dataset.originalSrc = src;
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    } else if (isOpen && iframeRef.current?.dataset.originalSrc) {
      const src = iframeRef.current.dataset.originalSrc;
      iframeRef.current.src = src;
      delete iframeRef.current.dataset.originalSrc;
    }
  }, [isOpen, pause]);

  useEffect(() => {
    return () => {
      pause();
      if (iframeRef.current) {
        try {
          iframeRef.current.contentWindow?.postMessage({
            type: 'pause-all-audio',
            action: 'stop-audio'
          }, '*');
        } catch (error) {
          // Ignore
        }
      }
    };
  }, [pause]);

  const handleBackClick = () => {
    setSelectedGame(null);
  };

  return (
    <div className='flex flex-col h-full w-full overflow-hidden bg-white'>
      <div
        id='window-header'
        className='window-drag-handle flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0'
      >
        <WindowControls target="game" />
        <h2 className="font-bold text-xs sm:text-sm text-gray-700 truncate max-w-[45vw] text-center flex-1">
          {selectedGame ? selectedGame.name : 'Games'}
        </h2>
        <div className="flex items-center gap-1 sm:gap-2">
          {selectedGame && (
            <button
              type="button"
              onClick={handleBackClick}
              className="p-1 hover:bg-gray-200 rounded cursor-pointer transition-colors text-gray-700"
              title="Back to Games"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          {selectedGame && (
            <a
              href={selectedGame.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open ${selectedGame.name} in New Tab`}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-700"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Mobile Category Bar */}
      {!selectedGame && isMobile && (
        <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 border-b border-gray-200 overflow-x-auto scrollbar-none flex-shrink-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 cursor-pointer",
                selectedCategory === cat.id ? "bg-blue-500 text-white shadow-sm" : "bg-white text-gray-700 border border-gray-200"
              )}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      )}

      {!selectedGame ? (
        <div className="flex bg-white flex-1 overflow-hidden min-h-0">
          {/* Desktop Sidebar */}
          <div className="sidebar w-48 bg-gray-50 border-r border-gray-200 flex flex-col p-4 space-y-3 shrink-0 max-sm:hidden">
            <div>
              <h3 className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5" /> Games
              </h3>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(category.id);
                      if (isFocused) focusWindow('game');
                    }}
                    className={clsx(
                      'flex items-center justify-between px-3 py-1.5 rounded-md cursor-pointer transition-colors text-sm',
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500">{category.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Games Content Grid */}
          <div className="content flex-1 p-4 sm:p-6 bg-white overflow-y-auto min-h-0">
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-4 auto-rows-max">
              {filteredGames.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => {
                    setSelectedGame(game);
                  }}
                  className="group flex flex-col items-center gap-2.5 p-3 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer text-center"
                >
                  <div className="rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow w-full h-32 sm:h-36 bg-gray-200">
                    <img
                      src={game.icon}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {game.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                      {game.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 w-full overflow-hidden bg-white min-h-0">
          <iframe
            ref={iframeRef}
            src={selectedGame.url}
            className="w-full h-full border-none block"
            title={selectedGame.name}
            allow="fullscreen; gamepad; autoplay"
          />
        </div>
      )}
    </div>
  )
}

export default WindowWrapper(Game, 'game', 'Games')
