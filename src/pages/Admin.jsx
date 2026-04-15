import { useState, useEffect } from 'react';
import { useSiteStore } from '../store/siteStore';
import { Save, LogIn, ArrowLeft, Plus, Trash2, Image as ImageIcon, Film, Wallpaper } from 'lucide-react';
import { Link } from 'react-router-dom';

const isVideo = (url) => /\.(mp4|webm|mkv|ogg|mov|m4v)(\?.*)?$/i.test(url || '');
const isGif = (url) => /\.gif(\?.*)?$/i.test(url || '');

const extractYoutubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
};

export default function Admin() {
  const { data, loading, updateData } = useSiteStore();
  const [formData, setFormData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize form when data finishes loading from Supabase
  useEffect(() => {
    if (!loading && data) {
      setFormData(data);
    }
  }, [loading, data]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateData(formData);
    setIsSaving(false);
    alert('Changes saved successfully!');
  };

  // Generic Array CRUD helpers
  const handleAddMusic = () => {
    const newId = formData.music.length ? Math.max(...formData.music.map(m => m.id)) + 1 : 1;
    setFormData({
      ...formData,
      music: [...formData.music, { id: newId, title: "New Track", author: "You", youtubeId: "", cover: "" }]
    });
  };

  const handleRemoveMusic = (index) => {
    const newMusic = [...formData.music];
    newMusic.splice(index, 1);
    setFormData({ ...formData, music: newMusic });
  };

  const handleAddGallery = () => {
    const newId = formData.gallery.length ? Math.max(...formData.gallery.map(g => g.id)) + 1 : 1;
    setFormData({
      ...formData,
      gallery: [...formData.gallery, { id: newId, img: "" }]
    });
  };

  const handleRemoveGallery = (index) => {
    const newGallery = [...formData.gallery];
    newGallery.splice(index, 1);
    setFormData({ ...formData, gallery: newGallery });
  };

  if (loading) return <div className="text-white p-10">Loading admin panel...</div>;



  return (
    <div className="h-screen overflow-y-auto bg-slate-950 text-slate-200 p-4 md:p-8 relative z-10">
      <div className="max-w-screen-2xl mx-auto space-y-8 pb-32">
        <div className="flex justify-between items-center bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 sticky top-4 z-50">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <h1 className="text-2xl font-bold">Content Editor</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-sky-600 hover:bg-sky-500 text-white font-medium py-2 px-6 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Global Design Editor */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl space-y-4 max-h-[450px] overflow-y-auto scrollbar-thin">
            <h2 className="text-xl font-bold mb-4 border-b border-slate-800 pb-2">Global Settings</h2>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Background Wallpaper (Image, GIF, or MP4 URL)</label>
              <div className="flex gap-2">
                <input
                  value={formData.wallpaperUrl || ''}
                  onChange={e => setFormData({ ...formData, wallpaperUrl: e.target.value })}
                  className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 text-sm focus:border-sky-500 transition-colors outline-none"
                  placeholder="https://example.com/live-wallpaper.mp4"
                />
                <button
                  onClick={() => updateData({ ...formData, wallpaperUrl: formData.wallpaperUrl })}
                  className="px-4 py-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 border border-sky-500/30 text-xs font-semibold transition-colors"
                >
                  ✓ Apply
                </button>
              </div>
              <p className="text-xs mt-2 text-slate-500">This media will be applied globally to all visitors on the Mac interface.</p>
            </div>
          </div>

          {/* About Editor */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl space-y-4 md:col-span-2 max-h-[600px] overflow-y-auto scrollbar-thin">
            <h2 className="text-xl font-bold mb-4 border-b border-slate-800 pb-2">About Section</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Avatar Image URL</label>
                  <input
                    value={formData.about.avatarUrl}
                    onChange={e => setFormData({ ...formData, about: { ...formData.about, avatarUrl: e.target.value } })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 text-sm focus:border-sky-500 transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Subtitle</label>
                  <input
                    value={formData.about.subtitle}
                    onChange={e => setFormData({ ...formData, about: { ...formData.about, subtitle: e.target.value } })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 text-sm focus:border-sky-500 transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Intro Description</label>
                  <textarea
                    value={formData.about.description}
                    onChange={e => setFormData({ ...formData, about: { ...formData.about, description: e.target.value } })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 h-24 text-sm focus:border-sky-500 transition-colors outline-none"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Paragraph 1</label>
                  <textarea
                    value={formData.about.paragraph1}
                    onChange={e => setFormData({ ...formData, about: { ...formData.about, paragraph1: e.target.value } })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 h-24 text-sm focus:border-sky-500 transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Paragraph 2</label>
                  <textarea
                    value={formData.about.paragraph2}
                    onChange={e => setFormData({ ...formData, about: { ...formData.about, paragraph2: e.target.value } })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 h-24 text-sm focus:border-sky-500 transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Paragraph 3</label>
                  <textarea
                    value={formData.about.paragraph3}
                    onChange={e => setFormData({ ...formData, about: { ...formData.about, paragraph3: e.target.value } })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 h-24 text-sm focus:border-sky-500 transition-colors outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Personal Socials Editor */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold mb-1 border-b border-slate-800 pb-2">🌐 Personal Socials</h2>
            <p className="text-xs text-slate-500 mb-3">These appear as icons in the top-right of the NavBar.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'GitHub', key: 'github', icon: '💻', placeholder: 'https://github.com/username' },
                { label: 'LinkedIn', key: 'linkedin', icon: '👔', placeholder: 'https://linkedin.com/in/username' },
                { label: 'Instagram', key: 'instagram', icon: '📸', placeholder: 'https://instagram.com/username' },
                { label: 'YouTube', key: 'youtube', icon: '🎥', placeholder: 'https://youtube.com/@channel' },
                { label: 'Email', key: 'email', icon: '✉️', placeholder: 'you@example.com' },
              ].map(({ label, key, icon, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-tight">{icon} {label}</label>
                  <input
                    value={formData.socials?.[key] || ''}
                    onChange={e => setFormData({
                      ...formData,
                      socials: { ...formData.socials, [key]: e.target.value }
                    })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:border-sky-500 transition-colors outline-none"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Music Platforms Editor */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold mb-1 border-b border-slate-800 pb-2">🎵 Music Platforms</h2>
            <p className="text-xs text-slate-500 mb-3">These appear as stream icons in the top-left of the NavBar.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Spotify', key: 'spotify', icon: '🟢', placeholder: 'https://open.spotify.com/artist/...' },
                { label: 'Apple Music', key: 'appleMusic', icon: '🍎', placeholder: 'https://music.apple.com/...' },
                { label: 'YouTube Music', key: 'ytMusic', icon: '▶️', placeholder: 'https://music.youtube.com/...' },
                { label: 'SoundCloud', key: 'soundcloud', icon: '🔶', placeholder: 'https://soundcloud.com/username' },
                { label: 'Amazon Music', key: 'amazonMusic', icon: '🎧', placeholder: 'https://music.amazon.com/...' },
              ].map(({ label, key, icon, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-tight">{icon} {label}</label>
                  <input
                    value={formData.socials?.[key] || ''}
                    onChange={e => setFormData({
                      ...formData,
                      socials: { ...formData.socials, [key]: e.target.value }
                    })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:border-sky-500 transition-colors outline-none"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Music CRUD */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h2 className="text-xl font-bold">YouTube Music Embeds</h2>
              <button onClick={handleAddMusic} className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors text-sky-300">
                <Plus size={16} /> Add Track
              </button>
            </div>
            {formData.music.map((track, i) => (
              <div key={track.id} className="flex gap-4 items-start bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex-col lg:flex-row relative">
                <button onClick={() => handleRemoveMusic(i)} className="absolute top-4 right-4 text-red-500/50 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>

                <span className="text-slate-500 mt-2 font-mono">{i + 1}</span>
                <div className="flex-1 space-y-3 w-full pr-8">
                  {/* Track Type Checkbox Toggles */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 mr-1">Flag as:</span>
                    {['Featured', 'Latest'].map(type => {
                      const isNewReleaseType = type === 'Featured';
                      const isSelected = isNewReleaseType ? !!track.isNewRelease : !!track.isLatest;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            const newMusic = [...formData.music];
                            if (isNewReleaseType) {
                              newMusic[i] = { ...newMusic[i], isNewRelease: !track.isNewRelease };
                            } else {
                              newMusic[i] = { ...newMusic[i], isLatest: !track.isLatest };
                            }
                            setFormData({ ...formData, music: newMusic });
                          }}
                          className={`text-xs px-3 py-1 rounded-full border font-medium transition-all ${isSelected
                            ? isNewReleaseType
                              ? 'bg-orange-500/20 border-orange-500/60 text-orange-300'
                              : 'bg-green-500/20 border-green-500/60 text-green-300'
                            : 'bg-transparent border-slate-600 text-slate-400 hover:border-slate-400'
                            }`}
                        >
                          {isNewReleaseType ? '🔥 Featured' : '🎵 Latest'}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    value={track.title}
                    onChange={e => {
                      const newMusic = [...formData.music];
                      newMusic[i].title = e.target.value;
                      setFormData({ ...formData, music: newMusic });
                    }}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 text-sm focus:border-sky-500 transition-colors outline-none"
                    placeholder="Track Title"
                  />
                  <input
                    value={track.author}
                    onChange={e => {
                      const newMusic = [...formData.music];
                      newMusic[i].author = e.target.value;
                      setFormData({ ...formData, music: newMusic });
                    }}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 text-sm focus:border-sky-500 transition-colors outline-none"
                    placeholder="Author"
                  />
                  <input
                    value={track.youtubeId}
                    onChange={async e => {
                      const val = e.target.value;
                      const id = extractYoutubeId(val);
                      const newMusic = [...formData.music];
                      newMusic[i].youtubeId = id;

                      // Auto-generate cover if empty or if it was previously auto-generated
                      if ((!newMusic[i].cover || newMusic[i].cover.includes('img.youtube.com')) && id.length === 11) {
                        newMusic[i].cover = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
                      }

                      // Auto-fetch title from YouTube if title is empty/default
                      if ((!newMusic[i].title || newMusic[i].title === "New Track") && id.length === 11) {
                        try {
                          const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`);
                          const meta = await res.json();
                          if (meta.title) {
                            newMusic[i].title = meta.title;
                            if (meta.author_name) newMusic[i].author = meta.author_name;
                            setFormData({ ...formData, music: newMusic });
                          }
                        } catch (err) {
                          console.error('Title fetch failed:', err);
                        }
                      }

                      setFormData({ ...formData, music: newMusic });
                    }}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 text-sm focus:border-sky-500 transition-colors outline-none"
                    placeholder="YouTube Link or ID"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Gallery CRUD */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin md:col-span-2">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h2 className="text-xl font-bold">🖼️ Wallpaper Gallery</h2>
              <button onClick={handleAddGallery} className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors text-sky-300">
                <Plus size={16} /> Add Image
              </button>
            </div>
            <p className="text-xs text-slate-500">Supports image URLs (.jpg, .png, .gif) and video links (.mp4, .webm). Hover over a preview to play videos.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {formData.gallery.map((item, i) => (
                <div key={item.id || i} className="relative group space-y-2">
                  <button
                    onClick={() => handleRemoveGallery(i)}
                    className="absolute -top-2 -right-2 z-10 text-red-500/50 hover:text-red-500 bg-slate-800 rounded-full p-1 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="aspect-video bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
                    {item.img ? (
                      isVideo(item.img) ? (
                        <div className="relative w-full h-full">
                          <video
                            src={item.img}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Film size={24} className="text-white/50" />
                          </div>
                        </div>
                      ) : (
                        <img src={item.img} className="w-full h-full object-cover" alt="Preview" />
                      )
                    ) : (
                      <span className="text-xs text-slate-500">No URL set</span>
                    )}
                  </div>
                  <input
                    value={item.img}
                    onChange={e => {
                      const newGallery = [...formData.gallery];
                      newGallery[i].img = e.target.value;
                      setFormData({ ...formData, gallery: newGallery });
                    }}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-2 py-1 text-slate-200 text-xs focus:border-sky-500 transition-colors outline-none"
                    placeholder="URL"
                  />
                  {item.img && (
                    <button
                      onClick={async () => {
                        const newWallpaper = item.img;
                        setFormData({ ...formData, wallpaperUrl: newWallpaper });
                        await updateData({ ...formData, wallpaperUrl: newWallpaper });
                      }}
                      className="w-full text-[10px] py-1 rounded-md bg-slate-800 hover:bg-sky-700/40 border border-slate-700 text-slate-400 hover:text-sky-300 transition-colors flex items-center justify-center gap-1"
                    >
                      <Wallpaper size={10} /> Set Wallpaper
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Discover Tab Editor */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl space-y-6 md:col-span-2">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-2">🌐 Discover Tab Editor</h2>

            {/* Images */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-widest">Cover Images</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { key: 'mainImage', label: 'Main Image (Large Left)' },
                  { key: 'subImage1', label: 'Stacked Image 1 (Top Right)' },
                  { key: 'subImage2', label: 'Stacked Image 2 (Bottom Right)' },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-xs text-slate-500">{label}</label>
                    <div className="aspect-video bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
                      {formData.discover?.[key] ? (
                        <img src={formData.discover[key]} alt={label} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No image</div>
                      )}
                    </div>
                    <input
                      value={formData.discover?.[key] || ''}
                      onChange={e => setFormData({
                        ...formData,
                        discover: { ...formData.discover, [key]: e.target.value }
                      })}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 text-sm focus:border-sky-500 transition-colors outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* News Items */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">News Items</h3>
                <button
                  onClick={() => {
                    const news = formData.discover?.news || [];
                    const newId = news.length ? Math.max(...news.map(n => n.id)) + 1 : 1;
                    setFormData({
                      ...formData,
                      discover: {
                        ...formData.discover,
                        news: [...news, { id: newId, title: 'New Update', content: '', date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) }]
                      }
                    });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors text-sky-300"
                >
                  <Plus size={16} /> Add News
                </button>
              </div>
              <div className="space-y-4">
                {(formData.discover?.news || []).map((item, i) => (
                  <div key={item.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3 relative">
                    <button
                      onClick={() => {
                        const newNews = [...(formData.discover?.news || [])];
                        newNews.splice(i, 1);
                        setFormData({ ...formData, discover: { ...formData.discover, news: newNews } });
                      }}
                      className="absolute top-3 right-3 text-red-500/50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid md:grid-cols-2 gap-3 pr-8">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Title</label>
                        <input
                          value={item.title}
                          onChange={e => {
                            const newNews = [...(formData.discover?.news || [])];
                            newNews[i] = { ...newNews[i], title: e.target.value };
                            setFormData({ ...formData, discover: { ...formData.discover, news: newNews } });
                          }}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 text-sm focus:border-sky-500 transition-colors outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Date</label>
                        <input
                          value={item.date}
                          onChange={e => {
                            const newNews = [...(formData.discover?.news || [])];
                            newNews[i] = { ...newNews[i], date: e.target.value };
                            setFormData({ ...formData, discover: { ...formData.discover, news: newNews } });
                          }}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 text-sm focus:border-sky-500 transition-colors outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Content</label>
                      <textarea
                        value={item.content}
                        onChange={e => {
                          const newNews = [...(formData.discover?.news || [])];
                          newNews[i] = { ...newNews[i], content: e.target.value };
                          setFormData({ ...formData, discover: { ...formData.discover, news: newNews } });
                        }}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 h-20 text-sm focus:border-sky-500 transition-colors outline-none"
                      />
                    </div>
                  </div>
                ))}
                {(!formData.discover?.news || formData.discover.news.length === 0) && (
                  <p className="text-xs text-slate-500">No news items yet. Click "Add News" to create one.</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}