import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import { Download, ExternalLink } from "lucide-react/dist/esm/icons";
import React from "react";

const Resume = () => {
  const resumePath = "https://ik.imagekit.io/mtkm3escy/Jeswanth_Mern_resume_2026_.pdf#view=FitH&toolbar=1&navpanes=0";

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div id="window-header" className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 bg-gray-50 window-drag-handle flex-shrink-0">
        <WindowControls target="resume" />
        <h2 className="font-bold text-xs sm:text-sm text-gray-700 truncate max-w-[45vw] text-center flex-1">
          Resume.pdf
        </h2>
        
        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href={resumePath}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Resume in New Tab"
            onClick={(e) => e.stopPropagation()}
            className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <a
            href={resumePath}
            download="Jeswanth_Mern_resume_2026.pdf"
            title="Download Resume"
            onClick={(e) => e.stopPropagation()}
            className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* PDF iframe */}
      <div className="flex-1 overflow-hidden bg-white min-h-0">
        <iframe
          src={resumePath}
          title="Jeswanth MERN Resume"
          className="w-full h-full border-none block"
          loading="lazy"
        />
      </div>
    </div>
  );
};

const ResumeWindow = WindowWrapper(Resume, "resume");
export default ResumeWindow;
