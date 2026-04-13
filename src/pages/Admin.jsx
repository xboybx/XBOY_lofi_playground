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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const [formData, setFormData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize form when data finishes loading from Supabase
  useEffect(() => {
    if (!loading && data) {
      setFormData(data);
    }
  }, [loading, data]);

  const handleLogin = (e) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'lofi2024';
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setFormData(data);
    } else {
      alert('Incorrect password.');
    }
  };

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="glass-panel p-8 rounded-3xl w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
          </div>
          <input
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
          />
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" /> Log In
          </button>
          <Link to="/" className="block text-center text-sm text-white/40 hover:text-white transition-colors">Return to Site</Link>
        </form>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-zinc-900/90 backdrop-blur-3xl text-white p-4 md:p-8 relative z-10">
      <div className="max-w-screen-2xl mx-auto space-y-8 pb-32">
        <div className="flex justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/5 sticky top-4 z-50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </Link>
            <h1 className="text-2xl font-bold">Content Editor</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-6 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pb-32">
          {/* Global Design Editor */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 max-h-[450px] overflow-y-auto scrollbar-thin">
            <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Global Settings</h2>
            <div>
              <label className="block text-xs text-purple-200/60 mb-1">Background Wallpaper (Image, GIF, or MP4 URL)</label>
              <div className="flex gap-2">
                <input
                  value={formData.wallpaperUrl || ''}
                  onChange={e => setFormData({ ...formData, wallpaperUrl: e.target.value })}
                  className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-purple-500 transition-colors"
                  placeholder="https://example.com/live-wallpaper.mp4"
                />
                <button
                  onClick={() => updateData({ ...formData, wallpaperUrl: formData.wallpaperUrl })}
                  className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 text-xs font-semibold"
                >
                  ✓ Apply
                </button>
              </div>
              <p className="text-xs mt-2 text-purple-200/40">This media will be applied globally to all visitors on the Mac interface.</p>
            </div>
          </div>

          {/* About Editor */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 md:col-span-2 max-h-[600px] overflow-y-auto scrollbar-thin">
            <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">About Section</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-purple-200/60 mb-1">Avatar Image URL</label>
                  <input
                    value={formData.about.avatarUrl}
                    onChange={e => setFormData({ ...formData, about: { ...formData.about, avatarUrl: e.target.value } })}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-200/60 mb-1">Subtitle</label>
                  <input
                    value={formData.about.subtitle}
                    onChange={e => setFormData({ ...formData, about: { ...formData.about, subtitle: e.target.value } })}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-200/60 mb-1">Intro Description</label>
                  <textarea
                    value={formData.about.description}
                    onChange={e => setFormData({ ...formData, about: { ...formData.about, description: e.target.value } })}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white h-24 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-purple-200/60 mb-1">Paragraph 1</label>
                  <textarea
                    value={formData.about.paragraph1}
                    onChange={e => setFormData({ ...formData, about: { ...formData.about, paragraph1: e.target.value } })}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white h-24 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-200/60 mb-1">Paragraph 2</label>
                  <textarea
                    value={formData.about.paragraph2}
                    onChange={e => setFormData({ ...formData, about: { ...formData.about, paragraph2: e.target.value } })}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white h-24 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-200/60 mb-1">Paragraph 3</label>
                  <textarea
                    value={formData.about.paragraph3}
                    onChange={e => setFormData({ ...formData, about: { ...formData.about, paragraph3: e.target.value } })}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white h-24 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Personal Socials Editor */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold mb-1 border-b border-white/10 pb-2">🌐 Personal Socials</h2>
            <p className="text-xs text-purple-200/40 mb-3">These appear as icons in the top-right of the NavBar.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'GitHub', key: 'github', icon: '💻', placeholder: 'https://github.com/username' },
                { label: 'LinkedIn', key: 'linkedin', icon: '👔', placeholder: 'https://linkedin.com/in/username' },
                { label: 'Instagram', key: 'instagram', icon: '📸', placeholder: 'https://instagram.com/username' },
                { label: 'YouTube', key: 'youtube', icon: '🎥', placeholder: 'https://youtube.com/@channel' },
                { label: 'Email', key: 'email', icon: '✉️', placeholder: 'you@example.com' },
              ].map(({ label, key, icon, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-purple-200/50 mb-2 uppercase tracking-tight">{icon} {label}</label>
                  <input
                    value={formData.socials?.[key] || ''}
                    onChange={e => setFormData({
                      ...formData,
                      socials: { ...formData.socials, [key]: e.target.value }
                    })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500/50 transition-colors outline-none"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Music Platforms Editor */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold mb-1 border-b border-white/10 pb-2">🎵 Music Platforms</h2>
            <p className="text-xs text-purple-200/40 mb-3">These appear as stream icons in the top-left of the NavBar.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Spotify', key: 'spotify', icon: '🟢', placeholder: 'https://open.spotify.com/artist/...' },
                { label: 'Apple Music', key: 'appleMusic', icon: '🍎', placeholder: 'https://music.apple.com/...' },
                { label: 'YouTube Music', key: 'ytMusic', icon: '▶️', placeholder: 'https://music.youtube.com/...' },
                { label: 'SoundCloud', key: 'soundcloud', icon: '🔶', placeholder: 'https://soundcloud.com/username' },
                { label: 'Amazon Music', key: 'amazonMusic', icon: '🎧', placeholder: 'https://music.amazon.com/...' },
              ].map(({ label, key, icon, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-purple-200/50 mb-2 uppercase tracking-tight">{icon} {label}</label>
                  <input
                    value={formData.socials?.[key] || ''}
                    onChange={e => setFormData({
                      ...formData,
                      socials: { ...formData.socials, [key]: e.target.value }
                    })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500/50 transition-colors outline-none"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Music CRUD */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h2 className="text-xl font-bold">YouTube Music Embeds</h2>
              <button onClick={handleAddMusic} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors text-purple-200">
                <Plus size={16} /> Add Track
              </button>
            </div>
            {formData.music.map((track, i) => (
              <div key={track.id} className="flex gap-4 items-start bg-black/20 p-4 rounded-xl border border-white/5 flex-col lg:flex-row relative">
                <button onClick={() => handleRemoveMusic(i)} className="absolute top-4 right-4 text-red-500/50 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>

                <span className="text-white/40 mt-2 font-mono">{i + 1}</span>
                <div className="flex-1 space-y-3 w-full pr-8">
                  {/* Track Type Checkbox Toggles */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-purple-200/50 mr-1">Flag as:</span>
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
                            : 'bg-transparent border-white/10 text-white/30 hover:border-white/30'
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
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                    placeholder="Track Title"
                  />
                  <input
                    value={track.author}
                    onChange={e => {
                      const newMusic = [...formData.music];
                      newMusic[i].author = e.target.value;
                      setFormData({ ...formData, music: newMusic });
                    }}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
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
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                    placeholder="YouTube Link or ID"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Gallery CRUD */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin md:col-span-2">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h2 className="text-xl font-bold">Gallery Media</h2>
              <button onClick={handleAddGallery} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors text-purple-200">
                <Plus size={16} /> Add Media
              </button>
            </div>
            <p className="text-xs text-purple-200/40">Supports image URLs (.jpg, .png, .gif) and video links (.mp4, .webm). Hover over a preview to play videos.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {formData.gallery.map((item, i) => (
                <div key={item.id || i} className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-2 relative group">
                  <button onClick={() => handleRemoveGallery(i)} className="absolute top-2 right-2 bg-black/80 p-1 rounded-md text-red-500/50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 z-10">
                    <Trash2 size={16} />
                  </button>
                  <div className="aspect-square bg-black/50 rounded-lg overflow-hidden border border-white/5 flex items-center justify-center">
                    {item.img ? (
                      isVideo(item.img) ? (
                        <div className="relative w-full h-full">
                          <video
                            src={item.img}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Film size={20} className="text-white/70 drop-shadow-lg" />
                          </div>
                        </div>
                      ) : (
                        <img src={item.img} className="w-full h-full object-cover" alt="Preview" />
                      )
                    ) : (
                      <span className="text-xs text-white/30">No URL set</span>
                    )}
                  </div>
                  <input
                    value={item.img}
                    onChange={e => {
                      const newGallery = [...formData.gallery];
                      newGallery[i].img = e.target.value;
                      setFormData({ ...formData, gallery: newGallery });
                    }}
                    className="w-full bg-black/30 border border-white/10 rounded-md px-2 py-1 text-white text-xs"
                    placeholder="URL"
                  />
                  {item.img && (
                    <button
                      onClick={async () => {
                        const newWallpaper = item.img;
                        setFormData({ ...formData, wallpaperUrl: newWallpaper });
                        await updateData({ ...formData, wallpaperUrl: newWallpaper });
                      }}
                      className="w-full text-[10px] py-1 rounded bg-white/5 hover:bg-purple-700/40 border border-white/10 text-white/60 transition-colors flex items-center justify-center gap-1"
                    >
                      <Wallpaper size={10} /> Set Wallpaper
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Discover Tab Editor */}
          <div className="glass-panel p-6 rounded-3xl space-y-6 md:col-span-2">
            <h2 className="text-xl font-bold border-b border-white/10 pb-2">🌐 Discover Tab Editor</h2>

            {/* Images */}
            <div>
              <h3 className="text-sm font-semibold text-purple-200/70 mb-3 uppercase tracking-widest">Cover Images</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { key: 'mainImage', label: 'Main Image (Large Left)' },
                  { key: 'subImage1', label: 'Stacked Image 1 (Top Right)' },
                  { key: 'subImage2', label: 'Stacked Image 2 (Bottom Right)' },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-xs text-purple-200/60">{label}</label>
                    <div className="aspect-video bg-black/30 rounded-xl overflow-hidden border border-white/10">
                      {formData.discover?.[key] ? (
                        <img src={formData.discover[key]} alt={label} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No image</div>
                      )}
                    </div>
                    <input
                      value={formData.discover?.[key] || ''}
                      onChange={e => setFormData({
                        ...formData,
                        discover: { ...formData.discover, [key]: e.target.value }
                      })}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* News Items */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-purple-200/70 uppercase tracking-widest">News Items</h3>
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
                  className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors text-purple-200"
                >
                  <Plus size={16} /> Add News
                </button>
              </div>
              <div className="space-y-4">
                {(formData.discover?.news || []).map((item, i) => (
                  <div key={item.id} className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3 relative">
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
                        <label className="block text-xs text-purple-200/60 mb-1">Title</label>
                        <input
                          value={item.title}
                          onChange={e => {
                            const newNews = [...(formData.discover?.news || [])];
                            newNews[i] = { ...newNews[i], title: e.target.value };
                            setFormData({ ...formData, discover: { ...formData.discover, news: newNews } });
                          }}
                          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-purple-200/60 mb-1">Date</label>
                        <input
                          value={item.date}
                          onChange={e => {
                            const newNews = [...(formData.discover?.news || [])];
                            newNews[i] = { ...newNews[i], date: e.target.value };
                            setFormData({ ...formData, discover: { ...formData.discover, news: newNews } });
                          }}
                          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-purple-200/60 mb-1">Content</label>
                      <textarea
                        value={item.content}
                        onChange={e => {
                          const newNews = [...(formData.discover?.news || [])];
                          newNews[i] = { ...newNews[i], content: e.target.value };
                          setFormData({ ...formData, discover: { ...formData.discover, news: newNews } });
                        }}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white h-20 text-sm"
                      />
                    </div>
                  </div>
                ))}
                {(!formData.discover?.news || formData.discover.news.length === 0) && (
                  <p className="text-xs text-purple-200/30">No news items yet. Click "Add News" to create one.</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
