import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import { ExternalLink } from 'lucide-react/dist/esm/icons'
import useWindowStore from '#store/window'
import { useEffect } from 'react'

const VSCode = () => {
  const { focusWindow, windows } = useWindowStore();
  const isFocused = (() => {
    const openWindows = Object.values(windows).filter(w => w.isOpen);
    const maxZ = openWindows.reduce((m, w) => Math.max(m, w.zIndex), 0);
    const self = windows['vscode'];
    return !!self?.isOpen && self?.zIndex === maxZ;
  })();

  useEffect(() => {
    const handler = (e) => {
      if (e?.data === 'focus-vscode' || e?.data?.type === 'focus-vscode') {
        focusWindow('vscode');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [focusWindow]);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div 
        id='window-header' 
        className='window-drag-handle flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0'
      >
        <WindowControls target="vscode" />
        <h2 className="font-bold text-xs sm:text-sm text-gray-700 truncate max-w-[50vw] text-center flex-1">
          Tounge Web Compiler
        </h2>
        <a
          href="https://tounge-webcompiler.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          title="Open Tounge in New Tab"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-600"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      <div className="relative flex-1 w-full min-h-0 overflow-hidden bg-white">
        {!isFocused && (
          <button
            type="button"
            aria-label="Activate Tounge IDE"
            onClick={(e) => {
              e.stopPropagation();
              focusWindow('vscode');
            }}
            className="absolute inset-0 bg-transparent cursor-pointer z-10"
          />
        )}
        <iframe
          src="https://tounge-webcompiler.vercel.app/"
          className="w-full h-full border-none block"
          style={{
            pointerEvents: isFocused ? 'auto' : 'none',
          }}
          title="Tounge Web Compiler"
        />
      </div>
    </div>
  )
}

export default WindowWrapper(VSCode, 'vscode', 'Tounge IDE')
