
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CalendarIcon, Settings, LogOut, Menu, X, Mic, Send, ChevronLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

const ChatLayout = ({ children, title, showBackButton = false }: ChatLayoutProps) => {
  const { theme, chatBackground, customBackground } = useTheme();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Get current date in YYYY-MM-DD format
  const currentDate = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
    
    navigate("/");
  };

  // Calculate avatar initials from username
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Function to determine if a navigation item is active
  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    if (path.startsWith("/journal") && location.pathname.startsWith("/journal")) {
      return true;
    }
    if (path === "/settings" && location.pathname === "/settings") {
      return true;
    }
    return false;
  };

  // Get background based on theme and selected background
  const getBackground = () => {
    if (customBackground) {
      return `bg-[url('${customBackground}')] bg-cover bg-center`;
    }
    
    if (chatBackground === "default") {
      return theme === "dark" ? "bg-chat-pattern-dark" : "bg-chat-pattern";
    }
    return `bg-${chatBackground}-100 dark:bg-${chatBackground}-900/30`;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden theme-transition">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md z-10 flex items-center justify-between p-3 h-16 theme-transition">
        <div className="flex items-center">
          {showBackButton ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/dashboard")}
              className="mr-2 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-2 text-primary-foreground hover:bg-primary-foreground/10 lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 max-w-[280px]">
                <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {user ? getInitials(user.username) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.username}</p>
                    <p className="text-xs opacity-80">Your Journal</p>
                  </div>
                </div>
                <nav className="p-4 space-y-2">
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-md transition-colors",
                      isActive("/dashboard") 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Home</p>
                        <p className="text-xs text-muted-foreground">Dashboard</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-md transition-colors",
                      isActive("/dashboard") 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Journal</p>
                        <p className="text-xs text-muted-foreground">Recent entries</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link 
                    to={`/journal/${currentDate}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-md transition-colors",
                      isActive("/journal") 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mic className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Today's Entry</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(), "MMM d, yyyy")}</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/settings"
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-md transition-colors",
                      isActive("/settings") 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Settings</p>
                        <p className="text-xs text-muted-foreground">Customize your app</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Button 
                    onClick={handleLogout}
                    variant="ghost" 
                    className="w-full justify-start p-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Log Out
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          )}
          
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary-foreground/30 text-primary-foreground">
                {user ? getInitials(user.username) : "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-medium">{title || "ChatJournal"}</h1>
              {!title && <p className="text-xs opacity-80">Your personal journal</p>}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/dashboard")}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
          
          {!isMobile && !showBackButton && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className={cn(
                  "text-primary-foreground hover:bg-primary-foreground/10",
                  isActive("/dashboard") && "bg-primary-foreground/10"
                )}
              >
                Journal
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(`/journal/${currentDate}`)}
                className={cn(
                  "text-primary-foreground hover:bg-primary-foreground/10",
                  isActive("/journal") && "bg-primary-foreground/10"
                )}
              >
                Today's Entry
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/settings")}
                className={cn(
                  "text-primary-foreground hover:bg-primary-foreground/10",
                  isActive("/settings") && "bg-primary-foreground/10"
                )}
              >
                Settings
              </Button>
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className={cn(
        "flex-1 overflow-auto theme-transition",
        getBackground(),
        "bg-cover bg-fixed"
      )}>
        <div className="container h-full mx-auto py-4 px-4 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ChatLayout;
