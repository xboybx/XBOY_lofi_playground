import { WindowControls } from '#components';
import { photosLinks } from '#constants';
import { useSiteStore } from '../store/siteStore';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import { Mail, Search } from 'lucide-react/dist/esm/icons';

const isVideo = (url) => url && /\.(mp4|webm|mkv|ogg|mov|m4v)(\?.*)?$/i.test(url);

const Photos = () => {
  const { data } = useSiteStore();
  const gallery = data?.gallery || [];
  const { openWindow, focusWindow } = useWindowStore();
  const email = 'j.jaswanth@icloud.com';

  return (
    <div className="flex flex-col h-full bg-white">
      <div id='window-header' className='window-drag-handle flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0'>
        <WindowControls target="photos" />
        <h2 className='flex-1 text-center font-bold text-xs sm:text-sm truncate max-w-[50vw]'>Gallery</h2>
        <div className='flex justify-end items-center gap-2'>
          <a
            href={`mailto:${email}`}
            title={`Email: ${email}`}
            className='p-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-600'
          >
            <Mail size={16} />
          </a>
          <Search className='icon size-4 text-gray-500' />
        </div>
      </div>
      <div className='flex w-full flex-1 min-h-0 overflow-hidden'>
        <div className='sidebar w-44 bg-gray-50 border-r border-gray-200 flex flex-col p-4 max-sm:hidden shrink-0'>
          <h2 className="text-xs font-medium text-gray-400 mb-2">Photos</h2>
          <ul className="space-y-1">
            {photosLinks.map(({ id, icon, title }) => (
              <li
                key={id}
                onClick={(e) => {
                  e.stopPropagation();
                  focusWindow('photos');
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors text-sm bg-blue-100 text-blue-700"
              >
                <img src={icon} alt={title} className="w-4 h-4 object-contain" />
                <p className="font-medium truncate">{title}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className='gallery flex-1 p-3 sm:p-4 overflow-y-auto min-h-0'>
          <ul className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
            {gallery.map(({ id, img }) => (
              <li
                key={id}
                className="break-inside-avoid cursor-pointer overflow-hidden rounded-xl group relative shadow-sm hover:shadow-md transition-shadow"
                onClick={(e) => {
                  e.stopPropagation();
                  openWindow('imgfile', {
                    id,
                    name: "Gallery Image",
                    icon: "/images/image.png",
                    kind: "file",
                    fileType: "img",
                    imageUrl: img,
                  });
                }}
              >
                {isVideo(img) ? (
                  <div className="relative w-full">
                    <video
                      src={img}
                      className="w-full rounded-xl bg-black/10 block object-cover"
                      muted
                      preload="metadata"
                      playsInline
                    />
                    <div className="absolute top-2 right-2 bg-black/60 rounded-md p-1 backdrop-blur-sm shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                  </div>
                ) : (
                  <img
                    src={img}
                    alt={`Gallery image ${id}`}
                    loading='lazy'
                    className="w-full h-auto rounded-xl block object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const PhotosWindow = WindowWrapper(Photos, "photos")

export default PhotosWindow;
