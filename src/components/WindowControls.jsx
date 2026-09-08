import useWindowStore from '#store/window'
import React from 'react'
import { X, Minus, Plus } from 'lucide-react/dist/esm/icons'

const WindowControls = ({ target }) => {
  const { closeWindow, minimizeWindow, toggleMaximizeWindow } = useWindowStore();
  const isMaximized = useWindowStore(state => state.windows[target]?.isMaximized);

  const handleMinimize = (e) => {
    e.stopPropagation();
    if (isMaximized) {
      // When maximized, clicking minimize restores the window back to normal size
      toggleMaximizeWindow(target);
    } else {
      minimizeWindow(target);
    }
  };

  const handleMaximize = (e) => {
    e.stopPropagation();
    toggleMaximizeWindow(target);
  };

  return (
    <div id='window-controls' className='group flex items-center gap-2 select-none flex-shrink-0'>
      {/* Close */}
      <button 
        type="button"
        className='p-1 -m-1 rounded-full cursor-pointer flex items-center justify-center focus:outline-none' 
        onClick={(e) => { e.stopPropagation(); closeWindow(target); }}
        title="Close"
        aria-label="Close window"
      >
        <div className='w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center shadow-xs active:brightness-90 transition-all pointer-events-none'>
          <X className='w-2 h-2 text-[#4c0000] opacity-0 group-hover:opacity-100 max-sm:opacity-80 transition-opacity' strokeWidth={2.5} />
        </div>
      </button>

      {/* Minimize / Restore */}
      <button 
        type="button"
        className='p-1 -m-1 rounded-full cursor-pointer flex items-center justify-center focus:outline-none' 
        onClick={handleMinimize}
        title={isMaximized ? "Restore Window" : "Minimize"}
        aria-label={isMaximized ? "Restore window" : "Minimize window"}
      >
        <div className='w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] flex items-center justify-center shadow-xs active:brightness-90 transition-all pointer-events-none'>
          <Minus className='w-2 h-2 text-[#5c3c00] opacity-0 group-hover:opacity-100 max-sm:opacity-80 transition-opacity' strokeWidth={2.5} />
        </div>
      </button>

      {/* Maximize / Restore */}
      <button 
        type="button"
        className='p-1 -m-1 rounded-full cursor-pointer flex items-center justify-center focus:outline-none' 
        onClick={handleMaximize}
        title={isMaximized ? "Restore Window" : "Maximize"}
        aria-label={isMaximized ? "Restore window" : "Maximize window"}
      >
        <div className='w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] flex items-center justify-center shadow-xs active:brightness-90 transition-all pointer-events-none'>
          <Plus className='w-2 h-2 text-[#004d11] opacity-0 group-hover:opacity-100 max-sm:opacity-80 transition-opacity' strokeWidth={2.5} />
        </div>
      </button>
    </div>
  )
}

export default WindowControls;