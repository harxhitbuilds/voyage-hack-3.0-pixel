import { Building, MonitorSpeaker } from "lucide-react";

import React from "react";

interface Props {
  total: number;
  vrCount: number;
}

const StatsBadges: React.FC<Props> = ({ total, vrCount }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/60 px-3 py-1 text-xs font-medium text-zinc-300">
        <Building className="h-3 w-3 text-zinc-400" />
        {total} Monuments
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/60 px-3 py-1 text-xs font-medium text-zinc-300">
        <MonitorSpeaker className="h-3 w-3 text-zinc-400" />
        {vrCount} VR Ready
      </span>
    </div>
  );
};

export default StatsBadges;
