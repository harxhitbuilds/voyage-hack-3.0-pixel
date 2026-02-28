import {
  Bell,
  CreditCard,
  Database,
  Download,
  Eye,
  FileText,
  Languages,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Palette,
  Plane,
  Settings,
  Shield,
  Smartphone,
  Sun,
  Trash2,
  Upload,
  User,
  Volume2,
  Wifi,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import SettingItem from "./setting-item";
import ToggleSwitch from "./toggle-switch";

const SettingsSections = ({
  settings,
  handleToggle,
  handleSelectChange,
  handleLogout,
  handleDeleteAccount,
  handleExportData,
}) => (
  <div className="space-y-6 lg:col-span-2">
    <div className="bg-card border-border rounded-xl border">
      <div className="border-border border-b p-6">
        <h3 className="font-inter-semibold text-foreground flex items-center gap-2 text-xl">
          <User className="h-5 w-5 text-blue-500" />
          Account Settings
        </h3>
      </div>
      <div className="p-0">
        <SettingItem
          icon={Eye}
          title="Profile Visibility"
          description="Control who can see your profile"
        >
          <Select
            value={settings.profileVisibility}
            onValueChange={(value) =>
              handleSelectChange("profileVisibility", value)
            }
          >
            <SelectTrigger className="w-32 border-blue-800/30 bg-blue-950/50 text-blue-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-zinc-700 bg-zinc-900">
              <SelectItem value="public" className="text-blue-500">
                Public
              </SelectItem>
              <SelectItem value="friends" className="text-foreground">
                Friends
              </SelectItem>
              <SelectItem value="private" className="text-foreground">
                Private
              </SelectItem>
            </SelectContent>
          </Select>
        </SettingItem>
        <SettingItem
          icon={Mail}
          title="Show Email"
          description="Display email on your public profile"
        >
          <ToggleSwitch
            enabled={settings.showEmail}
            onToggle={() => handleToggle("showEmail")}
          />
        </SettingItem>
        <SettingItem
          icon={MapPin}
          title="Show Location"
          description="Display your hometown on profile"
        >
          <ToggleSwitch
            enabled={settings.showLocation}
            onToggle={() => handleToggle("showLocation")}
          />
        </SettingItem>
      </div>
    </div>

    <div className="bg-card border-border rounded-xl border">
      <div className="border-border border-b p-6">
        <h3 className="font-inter-semibold text-foreground flex items-center gap-2 text-xl">
          <Bell className="h-5 w-5 text-blue-500" />
          Notifications
        </h3>
      </div>
      <div className="p-0">
        <SettingItem
          icon={Mail}
          title="Email Notifications"
          description="Receive notifications via email"
        >
          <ToggleSwitch
            enabled={settings.emailNotifications}
            onToggle={() => handleToggle("emailNotifications")}
          />
        </SettingItem>
        <SettingItem
          icon={Smartphone}
          title="Push Notifications"
          description="Receive push notifications on your device"
        >
          <ToggleSwitch
            enabled={settings.pushNotifications}
            onToggle={() => handleToggle("pushNotifications")}
          />
        </SettingItem>
        <SettingItem
          icon={Plane}
          title="Travel Alerts"
          description="Get notified about travel updates"
        >
          <ToggleSwitch
            enabled={settings.travelAlerts}
            onToggle={() => handleToggle("travelAlerts")}
          />
        </SettingItem>
        <SettingItem
          icon={FileText}
          title="Weekly Digest"
          description="Receive weekly summary emails"
        >
          <ToggleSwitch
            enabled={settings.weeklyDigest}
            onToggle={() => handleToggle("weeklyDigest")}
          />
        </SettingItem>
        <SettingItem
          icon={Volume2}
          title="Sound Effects"
          description="Play sounds for app interactions"
        >
          <ToggleSwitch
            enabled={settings.soundEffects}
            onToggle={() => handleToggle("soundEffects")}
          />
        </SettingItem>
      </div>
    </div>

    <div className="bg-card border-border rounded-xl border">
      <div className="border-border border-b p-6">
        <h3 className="font-inter-semibold text-foreground flex items-center gap-2 text-xl">
          <Shield className="h-5 w-5 text-blue-500" />
          Privacy & Security
        </h3>
      </div>
      <div className="p-0">
        <SettingItem
          icon={Database}
          title="Data Collection"
          description="Allow data collection for better experience"
        >
          <ToggleSwitch
            enabled={settings.dataCollection}
            onToggle={() => handleToggle("dataCollection")}
          />
        </SettingItem>
        <SettingItem
          icon={MapPin}
          title="Location Tracking"
          description="Track location for personalized recommendations"
        >
          <ToggleSwitch
            enabled={settings.locationTracking}
            onToggle={() => handleToggle("locationTracking")}
          />
        </SettingItem>
        <SettingItem
          icon={Lock}
          title="Change Password"
          description="Update your account password"
        >
          <Button
            variant="outline"
            size="sm"
            className="border-border text-foreground hover:bg-muted font-inter-medium"
          >
            Change
          </Button>
        </SettingItem>
      </div>
    </div>

    <div className="bg-card border-border rounded-xl border">
      <div className="border-border border-b p-6">
        <h3 className="font-inter-semibold text-foreground flex items-center gap-2 text-xl">
          <Palette className="h-5 w-5 text-blue-500" />
          Appearance
        </h3>
      </div>
      <div className="p-0">
        <SettingItem
          icon={settings.theme === "dark" ? Moon : Sun}
          title="Theme"
          description="Choose your preferred theme"
        >
          <Select
            value={settings.theme}
            onValueChange={(value) => handleSelectChange("theme", value)}
          >
            <SelectTrigger className="bg-muted border-border text-foreground w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="dark" className="text-foreground">
                Dark
              </SelectItem>
              <SelectItem value="light" className="text-foreground">
                Light
              </SelectItem>
              <SelectItem value="auto" className="text-foreground">
                Auto
              </SelectItem>
            </SelectContent>
          </Select>
        </SettingItem>
        <SettingItem
          icon={Languages}
          title="Language"
          description="Select your preferred language"
        >
          <Select
            value={settings.language}
            onValueChange={(value) => handleSelectChange("language", value)}
          >
            <SelectTrigger className="bg-muted border-border text-foreground w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="english" className="text-foreground">
                English
              </SelectItem>
              <SelectItem value="spanish" className="text-foreground">
                Spanish
              </SelectItem>
              <SelectItem value="french" className="text-foreground">
                French
              </SelectItem>
              <SelectItem value="hindi" className="text-foreground">
                Hindi
              </SelectItem>
            </SelectContent>
          </Select>
        </SettingItem>
        <SettingItem
          icon={CreditCard}
          title="Currency"
          description="Default currency for pricing"
        >
          <Select
            value={settings.currency}
            onValueChange={(value) => handleSelectChange("currency", value)}
          >
            <SelectTrigger className="bg-muted border-border text-foreground w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="inr" className="text-foreground">
                INR
              </SelectItem>
              <SelectItem value="usd" className="text-foreground">
                USD
              </SelectItem>
              <SelectItem value="eur" className="text-foreground">
                EUR
              </SelectItem>
              <SelectItem value="gbp" className="text-foreground">
                GBP
              </SelectItem>
            </SelectContent>
          </Select>
        </SettingItem>
        <SettingItem
          icon={Wifi}
          title="Auto Sync"
          description="Automatically sync data across devices"
        >
          <ToggleSwitch
            enabled={settings.autoSync}
            onToggle={() => handleToggle("autoSync")}
          />
        </SettingItem>
      </div>
    </div>
    <div className="bg-card border-border rounded-xl border">
      <div className="border-border border-b p-6">
        <h3 className="font-inter-semibold text-foreground flex items-center gap-2 text-xl">
          <Database className="h-5 w-5 text-blue-500" />
          Data Management
        </h3>
      </div>
      <div className="p-0">
        <SettingItem
          icon={Download}
          title="Export Data"
          description="Download a copy of your data"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="border-border text-foreground hover:bg-muted font-inter-medium"
          >
            Export
          </Button>
        </SettingItem>
        <SettingItem
          icon={Upload}
          title="Import Data"
          description="Import data from another account"
        >
          <Button
            variant="outline"
            size="sm"
            className="border-border text-foreground hover:bg-muted font-inter-medium"
          >
            Import
          </Button>
        </SettingItem>
      </div>
    </div>

    <div className="bg-card border-border rounded-xl border">
      <div className="border-border border-b p-6">
        <h3 className="font-inter-semibold text-foreground flex items-center gap-2 text-xl">
          <Settings className="h-5 w-5 text-blue-500" />
          Account Actions
        </h3>
      </div>
      <div className="p-0">
        <SettingItem
          icon={LogOut}
          title="Logout"
          description="Sign out of your account"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-border text-foreground hover:bg-muted font-inter-medium"
          >
            Logout
          </Button>
        </SettingItem>
        <SettingItem
          icon={Trash2}
          title="Delete Account"
          description="Permanently delete your account"
          danger={true}
        >
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteAccount}
            className="bg-destructive hover:bg-destructive/80 text-destructive-foreground font-inter-medium"
          >
            Delete
          </Button>
        </SettingItem>
      </div>
    </div>
  </div>
);

export default SettingsSections;
