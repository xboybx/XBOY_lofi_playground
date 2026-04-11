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
    // When Trash window opens, set the active location to trash
    setActiveLocation(locations.trash)
  }, [setActiveLocation])

  const openItem = (item) => {
    if(item.fileType === 'pdf') return openWindow('resume');
    if(item.fileType === 'txt') return openWindow('txtfile', item);
    if(item.fileType === 'img') return openWindow('imgfile', item);
    if(item.kind === 'folder') return setActiveLocation(item);
    if(['fig', 'url'].includes(item.fileType) && item.href) return window.open(item.href, 'blank');

    openWindow(`${item.fileType} ${item.kind}`, item)
  };

  return (
    <>
      <div id='window-header'>
        <WindowControls target="trash" />
        <Trash2 size={18} className='text-gray-600' />
        <h2 className='flex-1 text-center'>Trash</h2>
      </div>
      <div className='flex bg-white h-full'>
        <div className='sidebar'>
          <h2>Favorites</h2>
          <ul>
            <li className='flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors bg-blue-100 text-blue-700'>
              <img src={locations.trash.icon} className='w-4' alt='Trash' loading='lazy' />
              <p className='text-sm font-medium truncate'>{locations.trash.name}</p>
            </li>
          </ul>
        </div>
        <ul className='content flex-1 p-4 overflow-y-auto flex flex-wrap content-start gap-4 bg-white'>
          {locations.trash.children.map((item) => (
            <li
              key={item.id}
              className='cursor-pointer flex flex-col items-center justify-start w-24 gap-2 py-3 hover:bg-blue-50 focus:bg-blue-100 rounded-md transition-colors group'
              onClick={(e) => {
                e.stopPropagation();
                openItem(item);
              }}
            >
              <img 
                src={item.icon} 
                alt={item.name} 
                loading='lazy' 
                className='w-14 h-14 object-contain group-hover:drop-shadow-md transition-all'
              />
              <p className='text-xs text-center px-1 break-words line-clamp-2 leading-tight w-full'>{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

const TrashWindow = WindowWrapper(Trash, 'trash')

export default TrashWindow
