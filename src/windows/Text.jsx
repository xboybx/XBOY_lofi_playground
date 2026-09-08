import React from 'react'
import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import useWindowStore from '#store/window'
import { useSiteStore } from '../store/siteStore'

const Text = () => {
  const { data: siteStoreData } = useSiteStore();
  const { windows } = useWindowStore()
  const data = windows.txtfile?.data;
  const isMaximized = !!windows.txtfile?.isMaximized;

  if (!data) return null

  let { name, image, subtitle, description } = data

  if (name === 'AboutMe.txt') {
    description = [
      siteStoreData?.about?.description,
      siteStoreData?.about?.paragraph1,
      siteStoreData?.about?.paragraph2,
      siteStoreData?.about?.paragraph3
    ].filter(Boolean);
    image = siteStoreData?.about?.avatarUrl;
    subtitle = siteStoreData?.about?.subtitle;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div id='window-header' className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 bg-gray-50 window-drag-handle flex-shrink-0">
        <WindowControls target='txtfile' />
        <h2 className="font-bold text-xs sm:text-sm text-gray-700 truncate max-w-[60vw] text-center flex-1">
          {name}
        </h2>
        <div className="w-12" />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white">
        {image ? (
          <div className="w-full">
            <img
              src={image}
              alt={name}
              loading='lazy'
              className={
                isMaximized
                  ? "w-full h-auto max-h-[45vh] object-contain rounded-xl mx-auto shadow-md"
                  : "w-full max-w-sm h-auto object-contain rounded-xl mx-auto shadow-md"
              }
            />
          </div>
        ) : null}

        {subtitle ? <h3 className="text-base sm:text-lg font-bold text-gray-900">{subtitle}</h3> : null}

        {Array.isArray(description) && description.length > 0 ? (
          <div className="space-y-3 leading-relaxed text-xs sm:text-sm text-gray-800">
            {description.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

const TextWindow = WindowWrapper(Text, 'txtfile')

export default TextWindow
