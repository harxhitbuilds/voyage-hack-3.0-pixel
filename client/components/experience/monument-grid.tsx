import React from "react";
import MonumentCard from "./monument-card";
import type { Monument } from "@/app/home/experience/page";

interface Props {
  models: Monument[];
  onOpenAr: (uid: string) => void;
}

const MonumentsGrid: React.FC<Props> = ({ models, onOpenAr }) => {
  const openVr = (monument: Monument) => {
    if (monument.vrHTMLPath) {
      const vrUrl = `/VR/${monument.vrHTMLPath}`;
      const vrWindow = window.open(vrUrl, "vrExperience", "width=1400,height=900,fullscreen=yes,toolbar=no,menubar=no,scrollbars=no,location=no,status=no");
      if (vrWindow) {
        vrWindow.focus();
        setTimeout(() => {
          if (vrWindow.document && vrWindow.document.documentElement.requestFullscreen) {
            vrWindow.document.documentElement.requestFullscreen().catch(() => void 0);
          }
        }, 800);
      }
    } else {
      alert("VR experience coming soon!");
    }
  };

  const openArlink = (arlink?: string | null) => {
    if (arlink) {
      window.open(arlink, "_blank", "width=800,height=600,toolbar=no,menubar=no");
    } else {
      alert("AR view not available for this monument.");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {models.map((m) => (
        <MonumentCard key={m._id} monument={m} onOpenAr={onOpenAr} onOpenVr={openVr} onOpenArlink={openArlink} />
      ))}
    </div>
  );
};

export default MonumentsGrid;