import { useSiteStore } from '../store/siteStore';
import { Play, Instagram, Youtube, Music, Code, Mail } from 'lucide-react';

export default function Home() {
  const { data, loading } = useSiteStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-t-2 border-purple-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-purple-300 tracking-widest font-light">TUNING IN...</p>
        </div>
      </div>
    );
  }

  const { hero, about, music, socials } = data;

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-purple-500/50">
      {/* Background Image / Video with Overlay */}
      <div className="fixed inset-0 z-[-1] bg-black">
        <img 
          src={hero.backgroundUrl} 
          alt="Lofi Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center transition-all">
        <div className="font-bold text-2xl tracking-tighter text-white drop-shadow-md flex items-center gap-2">
          <Music className="w-6 h-6 text-purple-400" />
          <span>{hero.title}</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-purple-100/80">
          <a href="#about" className="hover:text-white transition-colors">ABOUT</a>
          <a href="#music" className="hover:text-white transition-colors">MUSIC</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto space-y-32">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center justify-center min-h-[60vh] space-y-6 animate-fade-in-up">
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium text-purple-200 tracking-wider mb-4 animate-pulse">
            NOW STREAMING EVERYWHERE
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-100 to-purple-400 drop-shadow-lg">
            {hero.title}
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-purple-100/70 font-light leading-relaxed">
            {hero.subtitle}
          </p>
          <div className="pt-8 flex gap-4">
            <a href="#music" className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 transition-all font-medium text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2">
              <Play className="w-4 h-4" /> Listen Now
            </a>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="scroll-mt-32">
          <div className="glass-panel rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center">
            <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
              <img src={about.avatarUrl} alt="Artist Avatar" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white">The Atmosphere</h2>
              <p className="text-purple-100/70 leading-relaxed text-lg font-light">
                {about.description}
              </p>
            </div>
          </div>
        </section>

        {/* Music Embeds Section */}
        <section id="music" className="scroll-mt-32 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white">Latest Releases</h2>
            <p className="text-purple-100/60 font-light">Immerse yourself in the soundscape.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {music.map((track) => (
              <div key={track.id} className="glass-panel rounded-3xl overflow-hidden p-2 hover:bg-white/10 transition-colors shadow-2xl group">
                <iframe 
                  className="w-full h-[152px] rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity" 
                  src={track.spotifyUrl} 
                  frameBorder="0" 
                  allowFullScreen="" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                ></iframe>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer / Socials */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-purple-300 font-bold tracking-tight">
            <Music className="w-5 h-5" />
            {hero.title}
          </div>
          <div className="flex gap-6">
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" className="text-white/60 hover:text-purple-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            )}
            {socials.youtube && (
              <a href={socials.youtube} target="_blank" rel="noreferrer" className="text-white/60 hover:text-red-400 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            )}
            {socials.spotify && (
              <a href={socials.spotify} target="_blank" rel="noreferrer" className="text-white/60 hover:text-green-400 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.299 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.54-1.02.72-1.56.42z"/>
                </svg>
              </a>
            )}
          </div>
          <div className="text-sm text-white/40 font-light">
            © {new Date().getFullYear()} {hero.title}. All vibes reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
