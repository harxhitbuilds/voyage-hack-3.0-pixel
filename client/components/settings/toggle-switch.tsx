import { ToggleLeft, ToggleRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

const ToggleSwitch = ({ enabled, onToggle }: ToggleSwitchProps) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onToggle}
    className="h-auto p-0 hover:bg-transparent"
  >
    {enabled ? (
      <ToggleRight className="h-6 w-6 text-blue-500" />
    ) : (
      <ToggleLeft className="text-muted h-6 w-6" />
    )}
  </Button>
);

export default ToggleSwitch;
