import React from 'react'
import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'
import { useSiteStore } from '../store/siteStore'

const isVideo = (url) => url && /\.(mp4|webm|mkv|ogg|mov|m4v)(\?.*)?$/i.test(url);
const isGif = (url) => url && /\.gif(\?.*)?$/i.test(url);

const ImageFile = () => {
  const { windows } = useWindowStore()
  const { updateData, data } = useSiteStore()
  const winData = windows.imgfile?.data

  if (!winData) return null

  const { name, imageUrl } = winData

  const setAsWallpaper = async () => {
    if (!imageUrl) return;

    if (!isVideo(imageUrl)) {
      // For images/GIFs use CSS variable
      document.documentElement.style.setProperty(
        '--wallpaper-url', `url('${encodeURI(imageUrl).replace(/'/g, "%27")}')`
      );
    } else {
      // For videos, clear CSS image and use the lofi gradient fallback
      const gradient = 'linear-gradient(135deg, #0f0c29 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)';
      document.documentElement.style.setProperty('--wallpaper-url', gradient);
    }

    // Persist globally to Supabase via siteStore
    await updateData({ ...data, wallpaperUrl: imageUrl });
  }

  return (
    <div className="flex flex-col h-full">
      <div id='window-header'>
        <WindowControls target="imgfile" />
        <h2 className="flex items-center justify-center font-bold">{name}</h2>
        <button
          onClick={setAsWallpaper}
          className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 whitespace-nowrap"
          title="Set as Desktop Wallpaper"
        >
          Set as Wallpaper
        </button>
      </div>
      <div className='flex-1 overflow-auto w-full h-full p-5 flex items-center justify-center bg-gray-100'>
        {imageUrl ? (
          isVideo(imageUrl) ? (
            <video
              src={imageUrl}
              autoPlay
              loop
              muted
              playsInline
              controls
              className='max-w-full max-h-full rounded drop-shadow-2xl'
            />
          ) : (
            <img
              src={imageUrl}
              alt={name}
              loading='lazy'
              className='max-w-full max-h-full object-contain rounded drop-shadow-2xl'
            />
          )
        ) : null}
      </div>
    </div>
  )
}

const ImageWindow = WindowWrapper(ImageFile, 'imgfile')

export default ImageWindow
