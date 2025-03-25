
import { useState, useEffect } from "react";
import ChatLayout from "@/components/ChatLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Check, Lock, Paintbrush, ShieldCheck, UserCircle, Image, Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { theme, setTheme, accentColor, setAccentColor, chatBackground, setChatBackground } = useTheme();
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [journalReminders, setJournalReminders] = useState(false);
  const [reminderTime, setReminderTime] = useState("20:00");
  const { toast } = useToast();
  
  // Color options for theme customization
  const colorOptions = [
    { name: "Green (Default)", value: "#128C7E", class: "bg-whatsapp-teal" },
    { name: "Blue", value: "#34B7F1", class: "bg-whatsapp-blue" },
    { name: "Purple", value: "#9C27B0", class: "bg-purple-600" },
    { name: "Pink", value: "#E91E63", class: "bg-pink-600" },
    { name: "Orange", value: "#FF9800", class: "bg-orange-500" },
    { name: "Red", value: "#F44336", class: "bg-red-500" },
  ];
  
  // Background options
  const backgroundOptions = [
    { name: "Default Pattern", value: "default", class: "bg-chat-pattern" },
    { name: "Light Blue", value: "blue", class: "bg-blue-100" },
    { name: "Light Purple", value: "purple", class: "bg-purple-100" },
    { name: "Light Pink", value: "pink", class: "bg-pink-100" },
    { name: "Light Orange", value: "orange", class: "bg-orange-100" },
    { name: "Light Green", value: "green", class: "bg-green-100" },
  ];
  
  useEffect(() => {
    // Load user data
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUsername(user.username || "");
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
    
    // Load settings
    const loadSettings = () => {
      const settings = localStorage.getItem("userSettings");
      if (settings) {
        try {
          const parsedSettings = JSON.parse(settings);
          setNotifications(parsedSettings.notifications ?? true);
          setJournalReminders(parsedSettings.journalReminders ?? false);
          setReminderTime(parsedSettings.reminderTime ?? "20:00");
        } catch (e) {
          console.error("Failed to parse settings:", e);
        }
      }
    };
    
    loadSettings();
  }, []);
  
  // Save account settings
  const saveAccountSettings = () => {
    if (username.trim() === "") {
      toast({
        title: "Username required",
        description: "Please enter a valid username.",
        variant: "destructive",
      });
      return;
    }
    
    // Update username in localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        user.username = username;
        localStorage.setItem("user", JSON.stringify(user));
        
        toast({
          title: "Account updated",
          description: "Your account information has been updated.",
        });
      } catch (e) {
        console.error("Failed to update user data:", e);
        toast({
          title: "Update failed",
          description: "There was a problem updating your account information.",
          variant: "destructive",
        });
      }
    }
  };
  
  // Change password
  const changePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "All fields required",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    // For demo purposes, allow any password change
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully.",
    });
    
    // Clear password fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  // Save appearance settings
  const saveAppearanceSettings = () => {
    toast({
      title: "Appearance updated",
      description: "Your appearance settings have been saved.",
    });
  };
  
  // Save notification settings
  const saveNotificationSettings = () => {
    // Save notification settings to localStorage
    const settings = {
      notifications,
      journalReminders,
      reminderTime,
    };
    
    localStorage.setItem("userSettings", JSON.stringify(settings));
    
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };
  
  return (
    <ChatLayout title="Settings">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <div className="grid gap-6">
              <Card className="bg-white/90 dark:bg-card/90 shadow-sm backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-primary" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your account details and personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      className="max-w-md"
                    />
                  </div>
                  
                  <Button onClick={saveAccountSettings}>
                    Save Profile Changes
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 dark:bg-card/90 shadow-sm backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)} 
                      className="max-w-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      className="max-w-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className="max-w-md"
                    />
                  </div>
                  
                  <Button 
                    onClick={changePassword}
                    disabled={!currentPassword || !newPassword || !confirmPassword}
                  >
                    Update Password
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 dark:bg-card/90 shadow-sm backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>
                    Manage your data and privacy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Export</Label>
                      <p className="text-sm text-muted-foreground">Export all your journal entries as a JSON file</p>
                    </div>
                    <Button variant="outline">
                      Export Data
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Delete Account</Label>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance">
            <div className="grid gap-6">
              <Card className="bg-white/90 dark:bg-card/90 shadow-sm backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paintbrush className="h-5 w-5 text-primary" />
                    Theme
                  </CardTitle>
                  <CardDescription>
                    Customize the app appearance to your preference
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <Label>Color Mode</Label>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "flex items-center gap-2",
                          theme === "light" && "border-primary"
                        )}
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-4 w-4" />
                        Light
                        {theme === "light" && <Check className="h-3 w-3 ml-1 text-primary" />}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "flex items-center gap-2",
                          theme === "dark" && "border-primary"
                        )}
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-4 w-4" />
                        Dark
                        {theme === "dark" && <Check className="h-3 w-3 ml-1 text-primary" />}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "flex items-center gap-2",
                          theme === "system" && "border-primary"
                        )}
                        onClick={() => setTheme("system")}
                      >
                        <Monitor className="h-4 w-4" />
                        System
                        {theme === "system" && <Check className="h-3 w-3 ml-1 text-primary" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 dark:bg-card/90 shadow-sm backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paintbrush className="h-5 w-5 text-primary" />
                    Accent Color
                  </CardTitle>
                  <CardDescription>
                    Choose the primary color for the application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue={accentColor} onValueChange={setAccentColor}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {colorOptions.map((color) => (
                        <div 
                          key={color.value} 
                          className={cn(
                            "flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                            accentColor === color.value && "border-primary bg-primary/5"
                          )}
                          onClick={() => setAccentColor(color.value)}
                        >
                          <RadioGroupItem 
                            value={color.value} 
                            id={`color-${color.value}`}
                          />
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-5 h-5 rounded-full"
                              style={{ backgroundColor: color.value }}
                            />
                            <Label 
                              htmlFor={`color-${color.value}`}
                              className="cursor-pointer font-normal"
                            >
                              {color.name}
                            </Label>
                          </div>
                          {accentColor === color.value && (
                            <Check className="h-4 w-4 ml-auto text-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 dark:bg-card/90 shadow-sm backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-primary" />
                    Chat Background
                  </CardTitle>
                  <CardDescription>
                    Select a background pattern for your journal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue={chatBackground} onValueChange={setChatBackground}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {backgroundOptions.map((bg) => (
                        <div 
                          key={bg.value} 
                          className={cn(
                            "flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                            chatBackground === bg.value && "border-primary bg-primary/5"
                          )}
                          onClick={() => setChatBackground(bg.value)}
                        >
                          <RadioGroupItem 
                            value={bg.value} 
                            id={`bg-${bg.value}`}
                          />
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-5 h-5 rounded-full border",
                              bg.class
                            )} />
                            <Label 
                              htmlFor={`bg-${bg.value}`}
                              className="cursor-pointer font-normal"
                            >
                              {bg.name}
                            </Label>
                          </div>
                          {chatBackground === bg.value && (
                            <Check className="h-4 w-4 ml-auto text-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 dark:bg-card/90 shadow-sm backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paintbrush className="h-5 w-5 text-primary" />
                    Font Style
                  </CardTitle>
                  <CardDescription>
                    Choose a font style for your journal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    defaultValue={localStorage.getItem("journal-font") || "default"}
                    onValueChange={(value) => localStorage.setItem("journal-font", value)}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { name: "Default", value: "default", class: "font-sans" },
                        { name: "Serif", value: "serif", class: "font-serif" },
                        { name: "Monospace", value: "mono", class: "font-mono" }
                      ].map((font) => (
                        <div 
                          key={font.value} 
                          className={cn(
                            "flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                            localStorage.getItem("journal-font") === font.value && "border-primary bg-primary/5"
                          )}
                        >
                          <RadioGroupItem 
                            value={font.value} 
                            id={`font-${font.value}`}
                          />
                          <div className="flex items-center gap-3">
                            <Label 
                              htmlFor={`font-${font.value}`}
                              className={cn("cursor-pointer font-normal", font.class)}
                            >
                              {font.name}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              
              <Button 
                onClick={saveAppearanceSettings}
                className="max-w-[200px]"
              >
                Save Appearance Settings
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="bg-white/90 dark:bg-card/90 shadow-sm backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">App Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications from the app</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="journal-reminders">Journal Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get daily reminders to write in your journal</p>
                  </div>
                  <Switch
                    id="journal-reminders"
                    checked={journalReminders}
                    onCheckedChange={setJournalReminders}
                  />
                </div>
                
                {journalReminders && (
                  <div className="space-y-2 pl-6 border-l-2 border-muted animate-fade-in">
                    <Label htmlFor="reminder-time">Reminder Time</Label>
                    <Input
                      id="reminder-time"
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="max-w-[200px]"
                    />
                    <p className="text-sm text-muted-foreground">Choose when to receive your daily reminder</p>
                  </div>
                )}
                
                <Button 
                  onClick={saveNotificationSettings}
                  className="mt-6"
                >
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ChatLayout>
  );
};

export default Settings;
