import {
  Bell,
  ChevronRight,
  Database,
  Globe,
  HelpCircle,
  Palette,
  Shield,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const categories = [
  { icon: User, label: "Account", count: 3 },
  { icon: Bell, label: "Notifications", count: 5 },
  { icon: Shield, label: "Privacy", count: 3 },
  { icon: Palette, label: "Appearance", count: 4 },
  { icon: Globe, label: "Language & Region", count: 2 },
  { icon: Database, label: "Data Management", count: 2 },
  { icon: HelpCircle, label: "Help & Support", count: 0 },
];

const SettingsSidebar = () => (
  <div className="bg-card border-border sticky top-6 rounded-xl border">
    <div className="border-border border-b p-6">
      <h2 className="font-inter-semibold text-foreground text-xl">
        Categories
      </h2>
    </div>
    <div className="p-0">
      <div className="space-y-1 p-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="hover:bg-muted flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <category.icon className="h-4 w-4 text-blue-500" />
              <span className="text-foreground font-inter-medium text-sm">
                {category.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {category.count > 0 && (
                <Badge className="border-lime-500/20 bg-blue-950/50 text-xs text-blue-500">
                  {category.count}
                </Badge>
              )}
              <ChevronRight className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SettingsSidebar;
