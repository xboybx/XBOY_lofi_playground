import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import { Download, ExternalLink } from "lucide-react/dist/esm/icons";
import React from "react";

const Resume = () => {
  const resumePath = "https://ik.imagekit.io/mtkm3escy/Jeswanth_Mern_resume_2026_.pdf#view=FitH&toolbar=1&navpanes=0";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div id="window-header">
        <WindowControls target="resume" />
        <h2>Jeswanth_Mern_resume_2026.pdf</h2>
        
        <a
          href={resumePath}
          target="_blank"
          rel="noopener noreferrer"
          title="Open Resume in New Tab"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="icon mr-3" />
        </a>

        <a
          href={resumePath}
          download="Jeswanth_Mern_resume_2026.pdf"
          title="Download Resume"
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="icon" />
        </a>
      </div>

      {/* PDF iframe - simple and works everywhere */}
      <div className="flex-1 overflow-hidden bg-white">
        <iframe
          src={resumePath}
          title="Jeswanth MERN Resume"
          className="w-full h-full border-none"
          loading="lazy"
        />
      </div>
    </div>
  );
};

const ResumeWindow = WindowWrapper(Resume, "resume");
export default ResumeWindow;
