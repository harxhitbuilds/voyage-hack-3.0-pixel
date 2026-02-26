import React from "react";
import { Building, MonitorSpeaker } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  total: number;
  vrCount: number;
}

const StatsBadges: React.FC<Props> = ({ total, vrCount }) => {
  return (
    <div className="flex items-center gap-2">
      <Badge className="border-primary/20 rounded-xl bg-white text-black">
        <Building className="mr-1 h-3 w-3" />
        {total} Monuments
      </Badge>
      <Badge className="border-secondary/20 rounded-xl bg-white text-black">
        <MonitorSpeaker className="mr-1 h-3 w-3" />
        {vrCount} VR Ready
      </Badge>
    </div>
  );
};

export default StatsBadges;