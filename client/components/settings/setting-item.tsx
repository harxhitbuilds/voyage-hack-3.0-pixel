import { LucideIcon } from "lucide-react";

import { ReactNode } from "react";

interface SettingItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
  danger?: boolean;
}

const SettingItem = ({
  icon: Icon,
  title,
  description,
  children,
  danger = false,
}: SettingItemProps) => (
  <div className="border-border hover:bg-accent/5 flex items-center justify-between border-b p-4 transition-colors last:border-b-0">
    <div className="flex items-center gap-3">
      <Icon
        className={`h-5 w-5 ${danger ? "text-destructive" : "text-blue-500"}`}
      />
      <div>
        <h3
          className={`font-inter-medium ${
            danger ? "text-destructive" : "text-foreground"
          }`}
        >
          {title}
        </h3>
        <p className="text-muted-foreground font-inter-regular text-sm">
          {description}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">{children}</div>
  </div>
);

export default SettingItem;
