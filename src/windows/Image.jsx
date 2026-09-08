import React from 'react'
import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'
import { useSiteStore } from '../store/siteStore'

const isVideo = (url) => url && /\.(mp4|webm|mkv|ogg|mov|m4v)(\?.*)?$/i.test(url);

const ImageFile = () => {
  const { windows } = useWindowStore()
  const { updateData, data } = useSiteStore()
  const winData = windows.imgfile?.data

  if (!winData) return null

  const { name, imageUrl } = winData

  const setAsWallpaper = async () => {
    if (!imageUrl) return;

    if (!isVideo(imageUrl)) {
      document.documentElement.style.setProperty(
        '--wallpaper-url', `url('${encodeURI(imageUrl).replace(/'/g, "%27")}')`
      );
    } else {
      const gradient = 'linear-gradient(135deg, #0f0c29 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)';
      document.documentElement.style.setProperty('--wallpaper-url', gradient);
    }

    await updateData({ ...data, wallpaperUrl: imageUrl });
  }

  return (
    <div className="flex flex-col h-full bg-[#1c1c1e] text-white">
      <div id='window-header' className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-800 bg-[#2d2d2d] window-drag-handle flex-shrink-0">
        <WindowControls target="imgfile" />
        <h2 className="font-bold text-xs sm:text-sm text-gray-200 truncate max-w-[40vw] text-center flex-1">{name}</h2>
        <button
          type="button"
          onClick={setAsWallpaper}
          className="px-2 py-1 text-[11px] sm:text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors whitespace-nowrap cursor-pointer flex-shrink-0"
          title="Set as Desktop Wallpaper"
        >
          Set Wallpaper
        </button>
      </div>
      <div className='flex-1 overflow-auto w-full h-full p-3 sm:p-6 flex items-center justify-center bg-black/90 min-h-0'>
        {imageUrl ? (
          isVideo(imageUrl) ? (
            <video
              src={imageUrl}
              autoPlay
              loop
              muted
              playsInline
              controls
              className='max-w-full max-h-full rounded-xl shadow-2xl object-contain'
            />
          ) : (
            <img
              src={imageUrl}
              alt={name}
              loading='lazy'
              className='max-w-full max-h-full object-contain rounded-xl shadow-2xl'
            />
          )
        ) : null}
      </div>
    </div>
  )
}

const ImageWindow = WindowWrapper(ImageFile, 'imgfile')

export default ImageWindow
