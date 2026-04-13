import useWindowStore from '#store/window'
import React from 'react'
import { X, Minus, Plus } from 'lucide-react/dist/esm/icons'

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

const WindowControls = ({target}) => {

  const { closeWindow, minimizeWindow, toggleMaximizeWindow } = useWindowStore();

  // Mobile: single large "Done" button (iOS-style)
  if (isMobile) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); closeWindow(target); }}
        className="text-blue-500 font-semibold text-sm px-2 py-1 active:opacity-60 transition-opacity"
      >
        Done
      </button>
    );
  }

  // Desktop: macOS traffic light dots
  return (
    <div id='window-controls' className='group flex items-center'>
      <div 
        className='p-1.5 -m-1.5 cursor-pointer flex-shrink-0' 
        onClick={(e) => { e.stopPropagation(); closeWindow(target); }}
        title="Close"
      >
        <div className='close flex items-center justify-center pointer-events-none'>
          <X className='size-2.5 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out' strokeWidth={3} />
        </div>
      </div>
      <div 
        className='p-1.5 -m-1.5 cursor-pointer flex-shrink-0' 
        onClick={(e) => { e.stopPropagation(); minimizeWindow(target); }}
        title="Minimize"
      >
        <div className='minimize flex items-center justify-center pointer-events-none'>
          <Minus className='size-2.5 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out' strokeWidth={3} />
        </div>
      </div>
      <div 
        className='p-1.5 -m-1.5 cursor-pointer flex-shrink-0' 
        onClick={(e) => { e.stopPropagation(); toggleMaximizeWindow(target); }}
        title="Maximize"
      >
        <div className='maximize flex items-center justify-center pointer-events-none'>
          <Plus className='size-2.5 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out' strokeWidth={3} />
        </div>
      </div>
    </div>
  )
}

export default WindowControls