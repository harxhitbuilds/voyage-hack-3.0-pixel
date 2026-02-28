import {
  CuboidIcon,
  Eye,
  Home,
  Map,
  MessageCircle,
  Settings,
  User,
} from "lucide-react";

export const getSidebarConfig = (user: any) => {
  return {
    sections: [
      {
        label: "Main",
        links: [
          {
            label: "Home",
            link: "/home",
            icon: <Home className="h-4 w-4" />,
            requiresAuth: false,
          },
          {
            label: "Experience",
            link: "/home/experience",
            icon: <Eye className="h-4 w-4" />,
            requiresAuth: false,
          },
          {
            label: "Trips",
            link: "/home/trips",
            icon: <Map className="h-4 w-4" />,
            requiresAuth: true,
          },
          {
            label: "3D Studio",
            link: "/home/ar-studio",
            icon: <CuboidIcon className="h-4 w-4" />,
            requiresAuth: false,
          },
          {
            label: "Group Plan",
            link: "/home/chat",
            icon: <MessageCircle className="h-4 w-4" />,
            requiresAuth: true,
          },
        ],
      },
      {
        label: "Account",
        links: [
          {
            label: "Profile",
            link: "/home/profile",
            icon: <User className="h-4 w-4" />,
            requiresAuth: true,
          },
          {
            label: "Settings",
            link: "/home/settings",
            icon: <Settings className="h-4 w-4" />,
            requiresAuth: true,
          },
        ],
      },
    ],
  };
};
