import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Props {
  searchTerm: string;
  onSearch: (v: string) => void;
  locations: string[];
  selectedLocation: string;
  onSelectLocation: (v: string) => void;
  architectures: string[];
  selectedArchitecture: string;
  onSelectArchitecture: (v: string) => void;
  periods: string[];
  selectedPeriod: string;
  onSelectPeriod: (v: string) => void;
  onClear: () => void;
}

const FiltersBar: React.FC<Props> = ({
  searchTerm,
  onSearch,
  locations,
  selectedLocation,
  onSelectLocation,
  architectures,
  selectedArchitecture,
  onSelectArchitecture,
  periods,
  selectedPeriod,
  onSelectPeriod,
  onClear,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="relative w-full">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
        <Input
          placeholder="Search monuments..."
          value={searchTerm}
          onChange={(e) => onSearch(e.currentTarget.value)}
          className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary w-full pl-10"
        />
      </div>

      <div className="w-full">
        <Select value={selectedLocation} onValueChange={onSelectLocation}>
          <SelectTrigger className="bg-background border-input text-foreground w-full">
            <SelectValue placeholder="Select Location" className="truncate" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border w-full">
            <SelectItem value="all" className="text-foreground">All Locations</SelectItem>
            {locations.map((l) => (
              <SelectItem key={l} value={l} className="text-foreground" title={l}>
                <span className="truncate">{l}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        <Select value={selectedArchitecture} onValueChange={onSelectArchitecture}>
          <SelectTrigger className="bg-background border-input text-foreground w-full">
            <SelectValue placeholder="Architecture Style" className="truncate" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border w-full">
            <SelectItem value="all" className="text-foreground">All Styles</SelectItem>
            {architectures.map((a) => (
              <SelectItem key={a} value={a} className="text-foreground" title={a}>
                <span className="truncate">{a}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full flex items-center gap-2">
        <Select value={selectedPeriod} onValueChange={onSelectPeriod}>
          <SelectTrigger className="bg-background border-input text-foreground w-full">
            <SelectValue placeholder="Time Period" className="truncate" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border w-full">
            <SelectItem value="all" className="text-foreground">All Periods</SelectItem>
            {periods.map((p) => (
              <SelectItem key={p} value={p} className="text-foreground" title={p}>
                <span className="truncate">{p}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={onClear} variant="outline" size="sm" className="border-border text-muted-foreground hover:bg-accent/10">
          Clear
        </Button>
      </div>
    </div>
  );
};

export default FiltersBar;