import { WindowControls } from "#components";
import { locations } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper";
import useLocationStore from "#store/location";
import useWindowStore from "#store/window";
import clsx from "clsx";
import { Search } from "lucide-react/dist/esm/icons";
import React from "react";
import { useIsMobile } from "../hooks/useIsMobile";

const Finder = () => {
  const isMobile = useIsMobile(768);
  const { openWindow, focusWindow } = useWindowStore();
  const { activeLocation, setActiveLocation } = useLocationStore();

  const openItem = (item) => {
    if (item.fileType === 'txt') return openWindow('txtfile', item);
    if (item.fileType === 'img') return openWindow('imgfile', item);
    if (item.kind === 'folder') return setActiveLocation(item);
    if (['fig', 'url'].includes(item.fileType) && item.href) return window.open(item.href, 'blank');

    openWindow(`${item.fileType} ${item.kind}`, item);
  };

  const renderList = (name, items) => (
    <div>
      <h3 className="text-xs font-medium text-gray-400 mb-2">{name}</h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            className={clsx(
              "flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors text-sm font-medium",
              item.id === activeLocation.id ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-200"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setActiveLocation(item);
              focusWindow('finder');
            }}
          >
            <img src={item.icon} className="w-4 h-4 object-contain" alt={item.name} loading='lazy' />
            <p className="truncate">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  const locationList = Object.values(locations);

  return (
    <div className="flex flex-col h-full bg-white">
      <div id="window-header" className="window-drag-handle flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 bg-gray-50">
        <WindowControls target="finder" />
        <h2 className="font-bold text-xs sm:text-sm text-gray-700 truncate max-w-[50vw]">
          {activeLocation?.name || 'XBOY Portfolio'}
        </h2>
        <Search className="icon size-4 text-gray-500" />
      </div>

      {/* Mobile Location Selector Tabs */}
      {isMobile && (
        <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100/80 border-b border-gray-200 overflow-x-auto scrollbar-none flex-shrink-0">
          {locationList.map((loc) => {
            const isSelected = loc.id === activeLocation.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => setActiveLocation(loc)}
                className={clsx(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap flex-shrink-0",
                  isSelected
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                )}
              >
                <img src={loc.icon} className="w-3.5 h-3.5 object-contain" alt="" />
                <span>{loc.name}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex bg-white flex-1 min-h-0 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="sidebar w-48 bg-gray-50 border-r border-gray-200 flex flex-col p-4 space-y-3 max-sm:hidden shrink-0">
          {renderList("Favorites", locationList)}
        </div>

        {/* Content Folder Items */}
        <ul className="content flex-1 p-4 sm:p-6 overflow-y-auto grid grid-cols-2 min-[360px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4 auto-rows-max items-start">
          {activeLocation?.children?.map((item) => (
            <li
              key={item.id}
              className="cursor-pointer flex flex-col items-center gap-2 p-2 hover:bg-blue-50/60 rounded-xl transition-all group text-center"
              onClick={(e) => {
                e.stopPropagation();
                openItem(item);
              }}
            >
              <img
                src={item.icon}
                alt={item.name}
                loading='lazy'
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain group-hover:scale-105 transition-transform"
              />
              <p className="text-xs sm:text-sm font-medium text-gray-800 break-words line-clamp-2 leading-tight max-w-full">
                {item.name}
              </p>
            </li>
          ))}
          {(!activeLocation?.children || activeLocation.children.length === 0) && (
            <div className="col-span-full py-12 text-center text-gray-400 text-sm">
              Folder is empty
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;