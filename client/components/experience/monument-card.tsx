import React from "react";
import { Box, Calendar, ExternalLink, Eye, MonitorSpeaker } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Monument } from "@/app/home/experience/page";

interface Props {
  monument: Monument;
  onOpenAr: (uid: string) => void;
  onOpenVr: (monument: Monument) => void;
  onOpenArlink: (arlink?: string | null) => void;
}

const MonumentCard: React.FC<Props> = ({ monument, onOpenAr, onOpenVr, onOpenArlink }) => {
  return (
    <article
      key={monument._id}
      className="group rounded-xl bg-linear-to-br from-[#370389] via-transparent to-transparent p-0.5 shadow-sm transition-all duration-300"
    >
      <div className="bg-background hover:bg-card/80 h-full rounded-xl p-4 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
              <img src={monument.imageUrl} alt={monument.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <h3 className="font-inter-semibold text-foreground group-hover:text-primary mb-1 truncate text-lg" title={monument.name}>
                {monument.name}
              </h3>
              <div className="mb-2 flex items-center gap-1">
                <span className="text-muted-foreground font-inter-regular truncate text-sm" title={monument.location}>
                  {monument.location}
                </span>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground font-inter-regular line-clamp-3 text-sm leading-relaxed">
            {monument.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge className="border-accent/30 shrink-0 rounded-xl bg-lime-500/20 text-lime-500">
              <Calendar className="mr-1 h-3 w-3" />
              {monument.yearBuilt}
            </Badge>
            <Badge className="border-secondary/30 max-w-[120px] truncate rounded-xl bg-purple-500/20 text-purple-500" title={monument.architecture}>
              {monument.architecture}
            </Badge>
          </div>

          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => onOpenAr(String(monument.sketchfabUid))}
                className={`font-inter-medium text-sm transition-all duration-200 ${monument.sketchfabUid ? "bg-success/20 border-success/30 text-success hover:bg-success/30 border hover:scale-105" : "bg-muted border-border text-muted-foreground cursor-not-allowed"}`}
              >
                <Box className="mr-2 h-3 w-3" />
                3D Model
              </Button>

              <Button
                onClick={() => onOpenArlink(monument.arlink)}
                className={`font-inter-medium text-sm transition-all duration-200 ${monument.arlink ? "bg-success/20 border-success/30 text-success hover:bg-success/30 border hover:scale-105" : "bg-muted border-border text-muted-foreground cursor-not-allowed"}`}
              >
                <Eye className="mr-1 h-3 w-3" />
                AR View
              </Button>

              <Button
                onClick={() => onOpenVr(monument)}
                disabled={!monument.vrHTMLPath}
                className={`font-inter-medium text-sm transition-all duration-200 ${monument.vrHTMLPath ? "bg-success/20 border-success/30 text-success hover:bg-success/30 border hover:scale-105" : "bg-muted border-border text-muted-foreground cursor-not-allowed"}`}
              >
                <MonitorSpeaker className="mr-1 h-3 w-3" />
                {monument.vrHTMLPath ? (
                  <>
                    VR Tour
                    <ExternalLink className="ml-1 h-2 w-2" />
                  </>
                ) : (
                  "VR Soon"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MonumentCard;