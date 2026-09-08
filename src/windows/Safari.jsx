import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import { ChevronLeft, ChevronRight, Copy, PanelLeft, Plus, Search, Share, ShieldHalf, LayoutGrid, Play, Calendar } from 'lucide-react/dist/esm/icons'
import React, { useState } from 'react'
import useWindowStore from '#store/window';
import { useSiteStore } from '../store/siteStore';

const ArtistKnowledgePanel = () => {
  const [activeTab, setActiveTab] = useState('newReleases');
  const openWindow = useWindowStore(state => state.openWindow);

  const { data } = useSiteStore();

  const discoverData = data?.discover || {
    mainImage: "https://ik.imagekit.io/t8nfvprzb/Mac_os_lofi_site/Scene%20in%20xboy.png",
    subImage1: "https://ik.imagekit.io/mtkm3escy/Portfolio%20assets/midnight-drive.png?updatedAt=1764096599955",
    subImage2: "https://ik.imagekit.io/mtkm3escy/protfolio%20pic.JPG?updatedAt=1763837489716",
    newReleaseIds: [],
    latestIds: [],
    news: [
      { id: 1, title: "Lofi Radio Relaunch - Beats to Relax/Study to", content: "Our continuous chill beats stream has been updated with 300+ new tracks. Tune in to study, relax, and chill.", date: "Sep 15, 2025" }
    ]
  };

  const allTracks = data?.music || [];
  const newReleaseIds = discoverData.newReleaseIds || [];
  const latestIds = discoverData.latestIds || [];

  const newReleaseTracks = newReleaseIds.length > 0
    ? allTracks.filter(t => newReleaseIds.includes(t.id))
    : allTracks.slice(0, 6);

  const latestTracks = latestIds.length > 0
    ? allTracks.filter(t => latestIds.includes(t.id))
    : allTracks.slice(0, 6);

  const handleTabClick = (tabId) => {
    if (tabId === 'songs') {
      openWindow('music');
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#202124] text-[#e8eaed] overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 md:px-10 text-sm custom-scrollbar">
      {/* Search Header */}
      <div className="w-full flex items-center bg-[#303134] rounded-full px-3 py-1.5 sm:px-5 sm:py-2.5 shadow-sm max-w-3xl mb-4 sm:mb-6 border border-[#3c4043] hover:bg-[#3c4043] transition-colors">
        <span className="text-[#e8eaed] font-medium tracking-wide text-xs sm:text-sm truncate">{(data?.about?.subtitle) || 'Artist'} | Lofi</span>
        <div className="ml-auto flex items-center gap-2 sm:gap-3 border-l border-[#5f6368] pl-2 sm:pl-3 flex-shrink-0">
          <Search size={14} className="text-[#9aa0a6] cursor-pointer hover:text-white" />
        </div>
      </div>

      <div className="flex flex-col max-w-6xl w-full h-full">
        {/* Title Area */}
        <div className="flex flex-col pb-3 sm:pb-4">
          <div className="flex flex-col mb-1">
            <h1 className="text-2xl sm:text-4xl text-[#e8eaed] font-normal mb-0.5">X.BOY</h1>
            <div className="flex items-center text-[#9aa0a6] text-xs sm:text-sm mt-0.5 gap-1">
              Musician <span className="ml-1 px-1 cursor-pointer hover:text-white leading-none">⋮</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 pb-2 border-b border-[#3c4043] overflow-x-auto scrollbar-none flex-nowrap">
          <button
            type="button"
            onClick={() => handleTabClick('newReleases')}
            className={`px-3 sm:px-4 py-1.5 rounded-full border text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer ${activeTab === 'newReleases' ? 'bg-[#3b4358] border-[#3b4358] text-[#8ab4f8]' : 'bg-[#303134] border-[#3c4043] text-[#e8eaed] hover:bg-[#3c4043]'}`}
          >
            New Releases
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('songs')}
            className="px-3 sm:px-4 py-1.5 rounded-full border text-xs sm:text-sm font-medium bg-[#303134] border-[#3c4043] text-[#e8eaed] hover:bg-[#3c4043] transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer"
          >
            Songs
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('news')}
            className={`px-3 sm:px-4 py-1.5 rounded-full border text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer ${activeTab === 'news' ? 'bg-[#3b4358] border-[#3b4358] text-[#8ab4f8]' : 'bg-[#303134] border-[#3c4043] text-[#e8eaed] hover:bg-[#3c4043]'}`}
          >
            News
          </button>
        </div>

        {/* Content Section */}
        {activeTab === 'newReleases' && (
          <div className="flex flex-col flex-1 pb-4">
            {/* Mobile View: Vertical list */}
            <div className="sm:hidden flex flex-col bg-[#303134] rounded-2xl border border-[#3c4043] shadow-md overflow-hidden">
              <div className="px-3 py-2.5 border-b border-[#3c4043] bg-[#292a2d] flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-medium text-[#e8eaed]">Latest Releases</h3>
                <span className="text-[11px] text-[#9aa0a6] cursor-pointer hover:text-white" onClick={() => openWindow('music')}>View All</span>
              </div>
              <div className="overflow-y-auto p-2 flex flex-col gap-1 max-h-[60vh]">
                {latestTracks.slice(0, 6).map((release) => (
                  <div key={release.id} onClick={() => openWindow('music')} className="flex gap-2.5 p-2 rounded-xl hover:bg-[#3c4043] transition-colors cursor-pointer group items-center">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative bg-black/20">
                      <img src={release.cover} alt={release.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play fill="white" size={14} className="text-white relative left-[1px]" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-[#e8eaed] truncate group-hover:text-[#8ab4f8] transition-colors">{release.title}</h4>
                      <span className="text-[10px] text-[#bdc1c6] truncate block">{release.author}</span>
                    </div>
                  </div>
                ))}
                {latestTracks.length === 0 && (
                  <div className="py-6 flex items-center justify-center text-[#9aa0a6] text-center px-4 text-xs">
                    <span>No latest releases flagged yet.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:flex gap-4 h-[340px] min-w-max overflow-x-auto custom-scrollbar">
              <div className="flex-1 flex flex-col bg-[#303134] rounded-2xl border border-[#3c4043] shadow-md overflow-hidden shrink-0 min-w-[320px]">
                <div className="px-5 py-3 border-b border-[#3c4043] bg-[#292a2d] flex items-center justify-between">
                  <h3 className="text-base font-medium text-[#e8eaed]">Latest Releases</h3>
                  <span className="text-xs text-[#9aa0a6] cursor-pointer hover:text-white" onClick={() => openWindow('music')}>View All</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
                  {latestTracks.slice(0, 6).map((release) => (
                    <div key={release.id} onClick={() => openWindow('music')} className="flex gap-4 p-3 rounded-xl hover:bg-[#3c4043] transition-colors cursor-pointer group items-center">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 relative bg-black/20">
                        <img src={release.cover} alt={release.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play fill="white" size={18} className="text-white relative left-[2px]" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#e8eaed] truncate group-hover:text-[#8ab4f8] transition-colors">{release.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[#bdc1c6] truncate">{release.author}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {latestTracks.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-[#9aa0a6] text-center px-4 text-xs">
                      <span>No latest releases flagged yet.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover columns */}
              <div className="relative w-[320px] h-full rounded-2xl overflow-hidden group cursor-pointer bg-[#303134] shadow-md shrink-0">
                <img src={discoverData.mainImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Main cover" />
                <div className="absolute bottom-3 left-3 text-[11px] text-white/90 z-10 px-1 py-0.5 rounded drop-shadow-md font-medium">Source: Official Release</div>
              </div>

              <div className="flex flex-col gap-4 w-48 h-full shrink-0">
                <div className="flex-1 rounded-2xl overflow-hidden cursor-pointer bg-[#303134] group shadow-md">
                  <img src={discoverData.subImage1} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Flower album" onError={(e) => { e.target.src = "/newImages/Last-Light.png" }} />
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden cursor-pointer bg-[#303134] group relative shadow-md">
                  <img src={discoverData.subImage2} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Artist profile" onError={(e) => { e.target.src = "/newImages/Terminal.webp" }} />
                  <div className="absolute bottom-3 right-3 bg-black/50 p-1.5 rounded-full backdrop-blur-sm"><LayoutGrid size={14} className="text-white" /></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="flex flex-col gap-4 py-2 max-w-3xl">
            {discoverData.news.map((item) => (
              <div key={item.id} className="group cursor-pointer bg-[#303134]/50 p-3 sm:p-4 rounded-xl border border-[#3c4043]">
                <h3 className="text-sm sm:text-base text-[#8ab4f8] group-hover:underline decoration-[#8ab4f8] mb-1 font-medium">{item.title}</h3>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#9aa0a6] mb-1.5">
                  <Calendar size={12} /> {item.date}
                </div>
                <p className="text-[#bdc1c6] text-xs sm:text-sm leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
            {discoverData.news.length === 0 && (
              <div className="text-[#9aa0a6] text-xs sm:text-sm">No recent news available at this time.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Safari = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#202124] rounded-xl shadow-2xl ring-1 ring-[#3c4043]">
      <div id='window-header' className='window-drag-handle bg-[#202124] border-b border-[#3c4043] text-[#9aa0a6] flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 flex-shrink-0'>
        <WindowControls target="safari" />
        <PanelLeft className='ml-4 p-1 hover:bg-[#303134] hover:text-white rounded cursor-default transition-colors max-sm:hidden' size={22} />
        <div className='flex items-center gap-1 ml-2 max-sm:hidden'>
          <ChevronLeft className='p-1 hover:bg-[#303134] hover:text-white rounded cursor-default transition-colors' size={22} />
          <ChevronRight className='p-1 hover:bg-[#303134] hover:text-white rounded cursor-default transition-colors' size={22} />
        </div>
        <div className='flex-1 flex justify-center items-center px-2'>
          <div className='bg-[#303134] border border-[#3c4043] shadow-inner px-3 py-1 rounded-full flex items-center justify-center w-full max-w-[220px] sm:max-w-[360px]'>
            <span className="text-[11px] sm:text-xs font-medium tracking-wide text-[#e8eaed] truncate">google.com/search?q=Discover</span>
          </div>
        </div>
        <div className='flex items-center gap-2 text-[#9aa0a6] max-sm:hidden'>
          <Share className='p-1 hover:bg-[#303134] hover:text-white rounded cursor-default transition-colors' size={20} />
          <Plus className='p-1 hover:bg-[#303134] hover:text-white rounded cursor-default transition-colors' size={20} />
          <Copy className='p-1 hover:bg-[#303134] hover:text-white rounded cursor-default transition-colors' size={20} />
        </div>
      </div>
      <div className='flex-1 relative min-h-0 overflow-hidden'>
        <ArtistKnowledgePanel />
      </div>
    </div>
  );
};

const SafariWindow = WindowWrapper(Safari, 'safari');

export default SafariWindow;
