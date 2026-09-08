import { WindowControls } from '#components'
import { locations } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import useLocationStore from '#store/location'
import useWindowStore from '#store/window'
import React, { useEffect } from 'react'
import { Trash2 } from 'lucide-react/dist/esm/icons'

const Trash = () => {
  const { setActiveLocation } = useLocationStore()
  const { openWindow } = useWindowStore()

  useEffect(() => {
    setActiveLocation(locations.trash)
  }, [setActiveLocation])

  const openItem = (item) => {
    if (item.fileType === 'txt') return openWindow('txtfile', item);
    if (item.fileType === 'img') return openWindow('imgfile', item);
    if (item.kind === 'folder') return setActiveLocation(item);
    if (['fig', 'url'].includes(item.fileType) && item.href) return window.open(item.href, 'blank');

    openWindow(`${item.fileType} ${item.kind}`, item)
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div id='window-header' className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 bg-gray-50 window-drag-handle flex-shrink-0">
        <WindowControls target="trash" />
        <h2 className='flex-1 text-center font-bold text-xs sm:text-sm truncate max-w-[50vw]'>Trash</h2>
        <Trash2 size={16} className='text-gray-500' />
      </div>
      <div className='flex bg-white flex-1 min-h-0 overflow-hidden'>
        <div className='sidebar w-44 bg-gray-50 border-r border-gray-200 flex flex-col p-4 space-y-3 max-sm:hidden shrink-0'>
          <h2 className="text-xs font-medium text-gray-400 mb-1">Favorites</h2>
          <ul>
            <li className='flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors bg-blue-100 text-blue-700 text-sm font-medium'>
              <img src={locations.trash.icon} className='w-4 h-4 object-contain' alt='Trash' loading='lazy' />
              <p className='truncate'>{locations.trash.name}</p>
            </li>
          </ul>
        </div>
        <ul className='content flex-1 p-3 sm:p-5 overflow-y-auto grid grid-cols-2 min-[360px]:grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 auto-rows-max items-start bg-white'>
          {locations.trash.children.map((item) => (
            <li
              key={item.id}
              className='cursor-pointer flex flex-col items-center gap-1.5 sm:gap-2 p-2 hover:bg-blue-50/60 rounded-xl transition-all group text-center'
              onClick={(e) => {
                e.stopPropagation();
                openItem(item);
              }}
            >
              <img 
                src={item.icon} 
                alt={item.name} 
                loading='lazy' 
                className='w-11 h-11 sm:w-14 sm:h-14 object-contain group-hover:scale-105 transition-transform'
              />
              <p className='text-xs text-center break-words line-clamp-2 leading-tight w-full text-gray-700 font-medium'>{item.name}</p>
            </li>
          ))}
          {locations.trash.children.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 text-sm">
              Trash is empty
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}

const TrashWindow = WindowWrapper(Trash, 'trash')

export default TrashWindow