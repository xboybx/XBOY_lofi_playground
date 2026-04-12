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
    <div className="flex flex-col h-full">
      <div id='window-header' className='window-drag-handle'>
        <WindowControls target="photos" />
        <h2 className='flex-1 text-center font-bold'>Gallery</h2>
        <div className='flex justify-end items-center gap-3'>
          <a
            href={`mailto:${email}`}
            title={`Email: ${email}`}
            className='p-2 hover:bg-gray-200 rounded-md transition-colors'
          >
            <Mail size={18} />
          </a>
          <Search className='icon' />
        </div>
      </div>
      <div className='flex w-full flex-1 min-h-0'>
        <div className='sidebar'>
          <h2>
            Photos
          </h2>
          <ul>
            {photosLinks.map(({ id, icon, title }) => (
              <li
                key={id}
                onClick={(e) => {
                  e.stopPropagation();
                  focusWindow('photos');
                }}
              >
                <img src={icon} alt={title} />
                <p>{title}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className='gallery'>
          <ul>
            {gallery.map(({ id, img }) => (
              <li
                key={id}
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
                  <div className="relative group/video w-full">
                    <video
                      src={img}
                      className="w-full rounded-lg bg-black/10"
                      muted
                      preload="metadata"
                      playsInline
                    />
                    {/* Visual indicator that it's a video */}
                    <div className="absolute top-2 right-2 bg-black/60 rounded-md p-1 backdrop-blur-sm shadow-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                  </div>
                ) : (
                  <img
                    src={img}
                    alt={`Gallery image ${id}`}
                    loading='lazy'
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
