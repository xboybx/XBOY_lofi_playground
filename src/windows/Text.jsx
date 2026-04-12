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
  // Hooks must be declared unconditionally at the top level



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
    <div className="flex flex-col h-full">
      {/* Header: three-column grid keeps title perfectly centered regardless of controls width */}
      <div id='window-header' >
          <WindowControls target='txtfile' />
        <h2>
          {name}
        </h2>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-6 bg-white">
        {image ? (
  <div className="w-full">
    <img
      src={image}
      alt={name}
      loading='lazy'
      className={
        isMaximized
          ? "w-full h-auto max-h-[45vh] object-contain rounded-xl mx-auto"
          : "w-full h-auto object-contain rounded"
      }
    />
  </div>
) : null}

        {subtitle ? <h3 className="text-lg font-semibold">{subtitle}</h3> : null}

        {Array.isArray(description) && description.length > 0 ? (
          <div className="space-y-3 leading-relaxed text-base text-gray-800">
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
