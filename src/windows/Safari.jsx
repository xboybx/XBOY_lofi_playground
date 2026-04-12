import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import { ChevronLeft, ChevronRight, Copy, PanelLeft, Plus, Search, Share, ShieldHalf, LayoutGrid, Play, Calendar } from 'lucide-react/dist/esm/icons'
import React, { useState } from 'react'
import useWindowStore from '#store/window';
import { useSiteStore } from '../store/siteStore';

const ArtistKnowledgePanel = () => {
  const [activeTab, setActiveTab] = useState('newReleases');
  const openWindow = useWindowStore(state => state.openWindow);

  // Use global store so Admin panel CRUD updates are reflected
  const { data } = useSiteStore();

  // Destructure with fallbacks if no data exists
  const discoverData = data?.discover || {
    mainImage: "https://ik.imagekit.io/t8nfvprzb/Mac_os_lofi_site/Scene%20in%20xboy.png",
    subImage1: "https://ik.imagekit.io/mtkm3escy/Portfolio%20assets/midnight-drive.png?updatedAt=1764096599955",
    subImage2: "https://ik.imagekit.io/mtkm3escy/protfolio%20pic.JPG?updatedAt=1763837489716",
    newReleaseIds: [],
    news: [
      { id: 1, title: "Lofi Radio Relaunch - Beats to Relax/Study to", content: "Our continuous chill beats stream has been updated with 300+ new tracks. Tune in to study, relax, and chill.", date: "Sep 15, 2025" }
    ]
  };

  // Filter to only tracks flagged as New Release from Admin panel
  const newReleaseIds = discoverData.newReleaseIds || [];
  const allTracks = data?.music || [];
  const newReleaseTracks = newReleaseIds.length > 0
    ? allTracks.filter(t => newReleaseIds.includes(t.id))
    : allTracks; // Fallback: show all if no flags set yet

  const handleTabClick = (tabId) => {
    if (tabId === 'songs') {
      openWindow('music');
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#202124] text-[#e8eaed] overflow-y-auto px-6 py-8 md:px-10 text-sm custom-scrollbar">
      {/* Search Header */}
      <div className="w-full flex items-center bg-[#303134] rounded-full px-5 py-2.5 shadow-sm max-w-3xl mb-8 border border-[#3c4043] hover:bg-[#3c4043] transition-colors">
        <span className="text-[#e8eaed] font-medium tracking-wide">{(data?.about?.subtitle) || 'Artist'} | Lofi </span>
        <div className="ml-auto flex items-center gap-3 border-l border-[#5f6368] pl-3">
          <Search size={18} className="text-[#9aa0a6] cursor-pointer hover:text-white" />
        </div>
      </div>

      <div className="flex flex-col max-w-6xl w-full h-full">
        {/* Title Area */}
        <div className="flex flex-col pb-4">
          <div className="flex flex-col mb-1">
            <h1 className="text-4xl text-[#e8eaed] font-normal mb-1">X.BOY</h1>
            <div className="flex items-center text-[#9aa0a6] text-sm mt-1 gap-1">
              Musician <span className="ml-1 px-1 cursor-pointer hover:text-white text-lg leading-none mb-1">⋮</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 pb-2 border-b border-[#3c4043]">
          <button
            onClick={() => handleTabClick('newReleases')}
            className={`px-5 py-1.5 rounded-full border text-sm font-medium transition-colors ${activeTab === 'newReleases' ? 'bg-[#3b4358] border-[#3b4358] text-[#8ab4f8]' : 'bg-[#303134] border-[#3c4043] text-[#e8eaed] hover:bg-[#3c4043]'}`}
          >
            New Releases
          </button>
          <button
            onClick={() => handleTabClick('songs')}
            className={`px-5 py-1.5 rounded-full border text-sm font-medium bg-[#303134] border-[#3c4043] text-[#e8eaed] hover:bg-[#3c4043] transition-colors`}
          >
            Songs
          </button>
          <button
            onClick={() => handleTabClick('news')}
            className={`px-5 py-1.5 rounded-full border text-sm font-medium transition-colors ${activeTab === 'news' ? 'bg-[#3b4358] border-[#3b4358] text-[#8ab4f8]' : 'bg-[#303134] border-[#3c4043] text-[#e8eaed] hover:bg-[#3c4043]'}`}
          >
            News
          </button>
        </div>

        {/* Content Section based on Tab */}
        {activeTab === 'newReleases' && (
          <div className="flex flex-col flex-1 overflow-x-auto custom-scrollbar pb-4">
            <div className="flex gap-4 h-[340px] min-w-max">

              {/* Column 1: Image 1 (Large) */}
              <div className="relative w-[340px] h-full rounded-2xl overflow-hidden group cursor-pointer bg-[#303134] shadow-md shrink-0">
                <img src={discoverData.mainImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Main cover" />
                <div className="absolute bottom-3 left-3 text-[11px] text-white/90 z-10 px-1 py-0.5 rounded drop-shadow-md font-medium">Source: Official Release</div>
              </div>

              {/* Column 2: Vertical Stack Images */}
              <div className="flex flex-col gap-4 w-52 h-full shrink-0">
                <div className="flex-1 rounded-2xl overflow-hidden cursor-pointer bg-[#303134] group shadow-md">
                  <img src={discoverData.subImage1} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Flower album" onError={(e) => { e.target.src = "/newImages/Last-Light.png" }} />
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden cursor-pointer bg-[#303134] group relative shadow-md">
                  <img src={discoverData.subImage2} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Artist profile" onError={(e) => { e.target.src = "/newImages/Terminal.webp" }} />
                  <div className="absolute bottom-3 right-3 bg-black/50 p-2 rounded-full backdrop-blur-sm"><LayoutGrid size={16} className="text-white" /></div>
                </div>
              </div>

              {/* Column 3: The New Releases List (Stretches to end) */}
              <div className="flex-1 flex flex-col bg-[#303134] rounded-2xl border border-[#3c4043] shadow-md overflow-hidden shrink-0 min-w-[350px]">
                <div className="px-5 py-3 border-b border-[#3c4043] bg-[#292a2d] flex items-center justify-between">
                  <h3 className="text-base font-medium text-[#e8eaed]">Latest Releases</h3>
                  <span className="text-xs text-[#9aa0a6] cursor-pointer hover:text-white" onClick={() => openWindow('music')}>View All</span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
                  {newReleaseTracks.slice(0, 6).map((release) => (
                    <div key={release.id} onClick={() => openWindow('music')} className="flex gap-4 p-3 rounded-xl hover:bg-[#3c4043] transition-colors cursor-pointer group items-center">
                      {/* Cover */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative bg-black/20">
                        <img src={release.cover} alt={release.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play fill="white" size={20} className="text-white relative left-[2px]" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-medium text-[#e8eaed] truncate group-hover:text-[#8ab4f8] transition-colors">{release.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[13px] text-[#bdc1c6] truncate">{release.author}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {newReleaseTracks.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-[#9aa0a6] text-center px-4">
                      <span>No new releases flagged yet.<br />Mark tracks in Admin panel.</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="flex flex-col gap-6 py-4 max-w-3xl">
            {discoverData.news.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <h3 className="text-[18px] text-[#8ab4f8] group-hover:underline decoration-[#8ab4f8] mb-1">{item.title}</h3>
                <div className="flex items-center gap-2 text-[13px] text-[#9aa0a6] mb-1.5">
                  <Calendar size={13} /> {item.date}
                </div>
                <p className="text-[#bdc1c6] text-[14px] leading-relaxed line-clamp-3">
                  {item.content}
                </p>
              </div>
            ))}
            {discoverData.news.length === 0 && (
              <div className="text-[#9aa0a6]">No recent news available at this time.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const Safari = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#202124] rounded-xl shadow-2xl ring-1 ring-[#3c4043]">
      <div id='window-header' className='window-drag-handle bg-[#202124] border-b border-[#3c4043] text-[#9aa0a6] selection:bg-transparent'>
        <WindowControls target="safari" />
        <PanelLeft className='ml-10 p-1.5 hover:bg-[#303134] hover:text-white rounded cursor-default transition-colors' size={26} />
        <div className='flex items-center gap-1 ml-5'>
          <ChevronLeft className='p-1.5 hover:bg-[#303134] hover:text-white rounded cursor-default transition-colors' size={26} />
          <ChevronRight className='p-1.5 hover:bg-[#303134] hover:text-white rounded cursor-default transition-colors' size={26} />
        </div>
        <div className='flex-1 flex-center gap-3'>
          <ShieldHalf className='p-1.5 rounded text-[#9aa0a6]' size={22} />
          <div className='bg-[#303134] border border-[#3c4043] shadow-inner px-4 py-1.5 rounded-full flex items-center justify-center w-1/2 max-w-[400px]'>
            <span className="text-[12px] font-medium tracking-wide text-[#e8eaed]">google.com/search?q=Discover</span>
          </div>
        </div>
        <div className='flex items-center gap-3 text-[#9aa0a6]'>
          <Share className='p-1.5 hover:bg-[#303134] hover:text-white rounded cursor-default transition-colors' size={24} />
          <Plus className='p-1.5 hover:bg-[#303134] hover:text-white rounded cursor-default transition-colors' size={24} />
          <Copy className='p-1.5 hover:bg-[#303134] hover:text-white rounded cursor-default transition-colors' size={24} />
        </div>
      </div>
      <div className='flex-1 relative'>
        <ArtistKnowledgePanel />
      </div>
    </div>
  )
}

const SafariWindow = WindowWrapper(Safari, 'safari')

export default SafariWindow;
