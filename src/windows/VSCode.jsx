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
    <>
      <div 
        id='window-header' 
        className='window-drag-handle'
        style={{ backgroundColor: '#f3f4f6' }}
      >
        <WindowControls target="vscode" />
        <h2>Tounge Web Compiler</h2>
        <a
          href="https://tounge-webcompiler.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          title="Open Tounge in New Tab"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ExternalLink className="icon mr-3" />
        </a>
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'calc(100% - 48px)',
        }}
      >
        {!isFocused && (
          <button
            type="button"
            aria-label="Activate Tounge IDE"
            onClick={(e) => {
              e.stopPropagation();
              focusWindow('vscode');
            }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'transparent',
              cursor: 'pointer',
            }}
          />
        )}
        <iframe
          src="https://tounge-webcompiler.vercel.app/"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            pointerEvents: isFocused ? 'auto' : 'none',
          }}
          title="Tounge Web Compiler"
        />
      </div>
    </>
  )
}

export default WindowWrapper(VSCode, 'vscode', 'Tounge IDE')
