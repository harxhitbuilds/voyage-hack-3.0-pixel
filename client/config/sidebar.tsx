import { Home, Map, Settings, User, CuboidIcon } from "lucide-react";

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
            icon: <CuboidIcon className="h-4 w-4" />,
            requiresAuth: false,
          },
          {
            label: "Trips",
            link: "/trips",
            icon: <Map className="h-4 w-4" />,
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
            link: "/settings",
            icon: <Settings className="h-4 w-4" />,
            requiresAuth: true,
          },
        ],
      },
    ],
  };
};
