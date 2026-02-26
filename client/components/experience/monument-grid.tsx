import React from "react";

import type { Monument } from "@/app/home/experience/page";
import { useModelStore } from "@/store/model.store";

import MonumentCard from "./monument-card";

interface Props {
  models: Monument[];
  onOpenAr: (uid: string, monumentId?: string) => void;
}

const MonumentsGrid: React.FC<Props> = ({ models, onOpenAr }) => {
  const { trackVisit } = useModelStore();

  const openVr = (monument: Monument) => {
    trackVisit(monument._id);
    if (monument.vrHTMLPath) {
      const vrUrl = `/VR/${monument.vrHTMLPath}`;
      const vrWindow = window.open(
        vrUrl,
        "vrExperience",
        "width=1400,height=900,fullscreen=yes,toolbar=no,menubar=no,scrollbars=no,location=no,status=no",
      );
      if (vrWindow) {
        vrWindow.focus();
        setTimeout(() => {
          if (
            vrWindow.document &&
            vrWindow.document.documentElement.requestFullscreen
          ) {
            vrWindow.document.documentElement
              .requestFullscreen()
              .catch(() => void 0);
          }
        }, 800);
      }
    } else {
      alert("VR experience coming soon!");
    }
  };

  const openArlink = (arlink?: string | null, monumentId?: string) => {
    if (monumentId) trackVisit(monumentId);
    if (arlink) {
      window.open(
        arlink,
        "_blank",
        "width=800,height=600,toolbar=no,menubar=no",
      );
    } else {
      alert("AR view not available for this monument.");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {models.map((m) => (
        <MonumentCard
          key={m._id}
          monument={m}
          onOpenAr={(uid) => onOpenAr(uid, m._id)}
          onOpenVr={openVr}
          onOpenArlink={(arlink) => openArlink(arlink, m._id)}
        />
      ))}
    </div>
  );
};

export default MonumentsGrid;
