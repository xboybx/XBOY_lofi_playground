import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
    const videoUrl = "https://xyrcekgvtrhdaiaedclk.supabase.co/storage/v1/object/sign/assest_max_os_loofi_site/Videos%20visulaizers/Night_time_cruise%20(1).webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hZWE2NjAwMy04NDg1LTQxODEtODQ0OC1lOTg5ZmU3YzhhZTUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3Nlc3RfbWF4X29zX2xvb2ZpX3NpdGUvVmlkZW9zIHZpc3VsYWl6ZXJzL05pZ2h0X3RpbWVfY3J1aXNlICgxKS53ZWJtIiwiaWF0IjoxNzc2MTA0MDQyLCJleHAiOjQ5Mjk3MDQwNDJ9.-PB3Qkxax3rP3SGw6DvykkCB2bPhqKQ_62S6sMCRYD8";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={videoUrl}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />

      <Link
        to="/"
        className="absolute top-6 left-6 z-30 group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg"
      >
        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
        Go Home
      </Link>

      <div className="relative z-20 flex items-center justify-center h-screen text-center">
        <div className="space-y-8 max-w-2xl mx-auto">
            <h1 className="text-9xl md:text-[12rem] font-black text-white/80">
              404
            </h1>
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white/90">
                Page Not Found
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Oops! The page you're looking for seems to have wandered off into the digital void.
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}