import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import { ExternalLink } from 'lucide-react/dist/esm/icons'
import useWindowStore from '#store/window'
import useAudioStore from '#store/audio'
import { useEffect, useRef } from 'react'

const Ner = () => {
  const { focusWindow, windows } = useWindowStore();
  const { pause } = useAudioStore();
  const iframeRef = useRef(null);
  const isOpen = windows['ner']?.isOpen;
  
  const isFocused = (() => {
    const openWindows = Object.values(windows).filter(w => w.isOpen);
    const maxZ = openWindows.reduce((m, w) => Math.max(m, w.zIndex), 0);
    const self = windows['ner'];
    return !!self?.isOpen && self?.zIndex === maxZ;
  })();

  useEffect(() => {
    const handler = (e) => {
      if (e?.data === 'focus-ner' || e?.data?.type === 'focus-ner') {
        focusWindow('ner');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [focusWindow]);

  // Handle audio cleanup when window is closed
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

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div 
        id='window-header' 
        className='window-drag-handle flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0'
      >
        <WindowControls target="ner" />
        <h2 className="font-bold text-xs sm:text-sm text-gray-700 truncate max-w-[50vw] text-center flex-1">
          SlapNer
        </h2>
        <a
          href="https://slapner.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          title="Open SlapNer in New Tab"
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
            aria-label="Activate SlapNer"
            onClick={(e) => {
              e.stopPropagation();
              focusWindow('ner');
            }}
            className="absolute inset-0 bg-transparent cursor-pointer z-10"
          />
        )}
        <iframe
          ref={iframeRef}
          src="https://slapner.vercel.app"
          className="w-full h-full border-none block"
          style={{
            pointerEvents: isFocused ? 'auto' : 'none',
          }}
          title="SlapNer"
        />
      </div>
    </div>
  )
}

export default WindowWrapper(Ner, 'ner', 'SlapNer')