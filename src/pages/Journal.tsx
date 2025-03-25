
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatLayout from "@/components/ChatLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Send, Sparkles, Mic, PaperclipIcon, Camera, ArrowLeft, ArrowRight, Calendar as CalendarIcon, FileImage, Palette, Home, StickyNote, Edit, X, Plus, FileVideo, MessageSquare } from "lucide-react";
import { format, addDays, subDays, isToday, parseISO, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import ScrapbookManager from "@/components/ScrapbookManager";
import FileUploadButton from "@/components/FileUploadButton";
import { JournalEntry, getJournalPrompts, getRandomNoteColor } from "@/components/journalUtils";

const Journal = () => {
  const { date } = useParams<{ date: string }>();
  const [message, setMessage] = useState("");
  const [journalEntry, setJournalEntry] = useState<JournalEntry | null>(null);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isScrapbookMode, setIsScrapbookMode] = useState(false);
  const { fontStyle } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const scrapbookRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const currentDate = date ? parseISO(date) : new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const displayDate = format(currentDate, "MMMM d, yyyy");
  
  useEffect(() => {
    const handleStorageChange = () => {
      // Re-render on font style changes
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  
  useEffect(() => {
    const loadJournalEntry = () => {
      const savedEntries = localStorage.getItem("journalEntries");
      if (savedEntries) {
        try {
          const entries: JournalEntry[] = JSON.parse(savedEntries);
          const existingEntry = entries.find(entry => entry.date === formattedDate);
          if (existingEntry) {
            setJournalEntry(existingEntry);
          } else {
            setJournalEntry({
              date: formattedDate,
              content: [],
              lastUpdated: new Date().toISOString()
            });
            
            setTimeout(() => {
              const newEntry = {
                date: formattedDate,
                content: [`Welcome to your journal for ${displayDate}. How are you feeling today?`],
                lastUpdated: new Date().toISOString(),
                scrapbookItems: []
              };
              setJournalEntry(newEntry);
              
              const updatedEntries = savedEntries ? [...JSON.parse(savedEntries), newEntry] : [newEntry];
              localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
            }, 1000);
          }
        } catch (e) {
          console.error("Failed to parse journal entries:", e);
        }
      } else {
        const newEntry = {
          date: formattedDate,
          content: [`Welcome to your journal for ${displayDate}. How are you feeling today?`],
          lastUpdated: new Date().toISOString(),
          scrapbookItems: []
        };
        setJournalEntry(newEntry);
        localStorage.setItem("journalEntries", JSON.stringify([newEntry]));
      }
    };
    
    loadJournalEntry();
    
    setPrompts(getJournalPrompts());
  }, [formattedDate, displayDate]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [journalEntry]);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  const getFontClass = () => {
    switch (fontStyle) {
      case "serif":
        return "font-serif";
      case "mono":
        return "font-mono";
      case "cute":
        return "font-cute";
      case "pacifico":
        return "font-pacifico";
      case "caveat":
        return "font-caveat";
      case "amatic":
        return "font-amatic";
      case "dancing":
        return "font-dancing";
      case "shadows":
        return "font-shadows";
      case "patrick":
        return "font-patrick";
      case "sacramento":
        return "font-sacramento";
      case "architects":
        return "font-architects";
      case "kalam":
        return "font-kalam";
      case "handlee":
        return "font-handlee";
      case "neucha":
        return "font-neucha";
      case "gloria":
        return "font-gloria";
      case "annie":
        return "font-annie";
      case "gochi":
        return "font-gochi";
      case "schoolbell":
        return "font-schoolbell";
      case "poppins":
        return "font-poppins";
      case "nunito":
        return "font-nunito";
      case "comic":
        return "font-comic";
      default:
        return "font-sans";
    }
  };
  
  const saveJournalEntry = (updatedEntry: JournalEntry) => {
    const savedEntries = localStorage.getItem("journalEntries");
    let entries: JournalEntry[] = [];
    
    if (savedEntries) {
      try {
        entries = JSON.parse(savedEntries);
        const existingIndex = entries.findIndex(entry => entry.date === formattedDate);
        if (existingIndex >= 0) {
          entries[existingIndex] = updatedEntry;
        } else {
          entries.push(updatedEntry);
        }
      } catch (e) {
        console.error("Failed to parse journal entries:", e);
        entries = [updatedEntry];
      }
    } else {
      entries = [updatedEntry];
    }
    
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  };
  
  const sendMessage = () => {
    if (!message.trim()) return;
    
    if (!journalEntry) return;
    
    const updatedContent = [...journalEntry.content, message];
    const updatedEntry = {
      ...journalEntry,
      content: updatedContent,
      lastUpdated: new Date().toISOString()
    };
    
    setJournalEntry(updatedEntry);
    saveJournalEntry(updatedEntry);
    setMessage("");
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
    
    toast({
      title: "Journal entry saved",
      description: "Your thoughts have been added to your journal",
    });
  };
  
  const usePrompt = (prompt: string) => {
    setMessage(prompt);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    
    setIsLoadingPrompts(true);
    setTimeout(() => {
      setPrompts(getJournalPrompts());
      setIsLoadingPrompts(false);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const goToPreviousDay = () => {
    const previousDay = subDays(currentDate, 1);
    navigate(`/journal/${format(previousDay, "yyyy-MM-dd")}`);
  };
  
  const goToNextDay = () => {
    const nextDay = addDays(currentDate, 1);
    const today = new Date();
    
    if (isBefore(nextDay, addDays(today, 1))) {
      navigate(`/journal/${format(nextDay, "yyyy-MM-dd")}`);
    } else {
      toast({
        title: "Cannot navigate to future dates",
        description: "You can only journal for past or current days.",
      });
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    const fileUrl = URL.createObjectURL(file);
    
    if (journalEntry) {
      const newAttachment = {
        type: "file" as const,
        url: fileUrl,
        name: file.name
      };
      
      const updatedEntry: JournalEntry = {
        ...journalEntry,
        content: [...journalEntry.content, `[Attached file: ${file.name}]`],
        attachments: [...(journalEntry.attachments || []), newAttachment],
        lastUpdated: new Date().toISOString()
      };
      
      setJournalEntry(updatedEntry);
      saveJournalEntry(updatedEntry);
      
      toast({
        title: "File attached",
        description: `${file.name} has been attached to your journal entry.`
      });
    }
    
    e.target.value = "";
  };
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }
    
    const imageUrl = URL.createObjectURL(file);
    
    if (journalEntry) {
      const newAttachment = {
        type: "image" as const,
        url: imageUrl,
        name: file.name
      };
      
      const updatedEntry: JournalEntry = {
        ...journalEntry,
        content: [...journalEntry.content, `[Image attached: ${file.name}]`],
        attachments: [...(journalEntry.attachments || []), newAttachment],
        lastUpdated: new Date().toISOString()
      };
      
      setJournalEntry(updatedEntry);
      saveJournalEntry(updatedEntry);
      
      toast({
        title: "Image attached",
        description: `${file.name} has been attached to your journal entry.`
      });
    }
    
    e.target.value = "";
  };
  
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file.",
        variant: "destructive"
      });
      return;
    }
    
    const videoUrl = URL.createObjectURL(file);
    
    if (journalEntry) {
      const newAttachment = {
        type: "video" as const,
        url: videoUrl,
        name: file.name
      };
      
      const updatedEntry: JournalEntry = {
        ...journalEntry,
        content: [...journalEntry.content, `[Video attached: ${file.name}]`],
        attachments: [...(journalEntry.attachments || []), newAttachment],
        lastUpdated: new Date().toISOString()
      };
      
      setJournalEntry(updatedEntry);
      saveJournalEntry(updatedEntry);
      
      toast({
        title: "Video attached",
        description: `${file.name} has been attached to your journal entry.`
      });
    }
    
    e.target.value = "";
  };
  
  const goToDate = (date: Date | undefined) => {
    if (date) {
      navigate(`/journal/${format(date, "yyyy-MM-dd")}`);
      setCalendarOpen(false);
    }
  };
  
  const handleScrapbookItemsUpdate = (items: any[]) => {
    if (!journalEntry) return;
    
    const updatedEntry: JournalEntry = {
      ...journalEntry,
      scrapbookItems: items,
      lastUpdated: new Date().toISOString()
    };
    
    setJournalEntry(updatedEntry);
    saveJournalEntry(updatedEntry);
  };
  
  return (
    <ChatLayout title={displayDate} showBackButton>
      <div className={cn("h-full flex flex-col", getFontClass())}>
        <div className="flex justify-between mb-4 items-center">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToPreviousDay}
              className="bg-white/70 dark:bg-background/50 backdrop-blur-sm hover:scale-105 transition-transform"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Day
            </Button>
            
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/70 dark:bg-background/50 backdrop-blur-sm hover:scale-105 transition-transform"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar 
                  mode="single" 
                  selected={currentDate}
                  onSelect={goToDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="bg-white/70 dark:bg-background/50 backdrop-blur-sm hover:scale-105 transition-transform"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            
            <Button 
              variant={isScrapbookMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsScrapbookMode(!isScrapbookMode)}
              className={cn(
                isScrapbookMode 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-white/70 dark:bg-background/50 backdrop-blur-sm",
                "hover:scale-105 transition-transform"
              )}
            >
              {isScrapbookMode ? (
                <MessageSquare className="h-4 w-4 mr-2" />
              ) : (
                <StickyNote className="h-4 w-4 mr-2" />
              )}
              {isScrapbookMode ? "Journal Mode" : "Scrapbook Mode"}
            </Button>
          </div>
          
          {!isToday(currentDate) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNextDay}
              className="bg-white/70 dark:bg-background/50 backdrop-blur-sm hover:scale-105 transition-transform"
            >
              Next Day
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
        
        {isScrapbookMode ? (
          <div 
            className="flex-1 bg-white/80 dark:bg-black/20 backdrop-blur-sm rounded-lg p-4 relative overflow-auto custom-scrollbar mb-4 shadow-md border border-gray-200/50"
            ref={scrapbookRef}
          >
            <div className="absolute top-2 left-2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-md shadow-sm">
              <p className="text-sm text-gray-500 italic">Drag items to move them around</p>
            </div>
            
            {journalEntry && journalEntry.scrapbookItems && (
              <ScrapbookManager 
                items={journalEntry.scrapbookItems}
                onSave={handleScrapbookItemsUpdate}
                containerRef={scrapbookRef}
              />
            )}
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 theme-transition">
              <div className="flex flex-col space-y-1 p-2">
                {journalEntry?.content.map((content, index) => {
                  const isUserMessage = index > 0;
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "chat-bubble",
                        isUserMessage ? "chat-bubble-user" : "chat-bubble-app"
                      )}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {content.startsWith("[Image attached:") ? (
                        <div className="flex flex-col">
                          <span>{content}</span>
                          {journalEntry.attachments && (
                            <img 
                              src={journalEntry.attachments.find(a => 
                                a.type === "image" && content.includes(a.name)
                              )?.url}
                              alt="Journal attachment"
                              className="mt-2 max-w-full max-h-64 rounded-md"
                            />
                          )}
                        </div>
                      ) : content.startsWith("[Video attached:") ? (
                        <div className="flex flex-col">
                          <span>{content}</span>
                          {journalEntry.attachments && (
                            <video 
                              src={journalEntry.attachments.find(a => 
                                a.type === "video" && content.includes(a.name)
                              )?.url}
                              className="mt-2 max-w-full max-h-64 rounded-md"
                              controls
                            />
                          )}
                        </div>
                      ) : content.startsWith("[Attached file:") ? (
                        <div className="flex flex-col">
                          <span>{content}</span>
                          {journalEntry.attachments && (
                            <a 
                              href={journalEntry.attachments.find(a => 
                                a.type === "file" && content.includes(a.name)
                              )?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 flex items-center text-primary hover:underline"
                            >
                              <PaperclipIcon className="h-4 w-4 mr-1" />
                              Download attached file
                            </a>
                          )}
                        </div>
                      ) : (
                        content
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            <div className="mb-4 overflow-x-auto custom-scrollbar">
              <div className="flex space-x-2">
                {prompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap bg-white/70 dark:bg-background/50 backdrop-blur-sm hover:scale-105 transition-transform animate-float"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => usePrompt(prompt)}
                    disabled={isLoadingPrompts}
                  >
                    <Sparkles className="h-3 w-3 mr-2 text-primary" />
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="relative theme-transition">
              <Textarea
                ref={textareaRef}
                placeholder="Write your journal entry..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setIsTyping(e.target.value.trim().length > 0);
                }}
                onKeyDown={handleKeyDown}
                className={cn("message-input bg-white/90 dark:bg-background/70 backdrop-blur-sm shadow-md pr-24", getFontClass())}
                rows={1}
              />
              
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="sr-only"
                  onChange={handleFileSelect}
                />
                
                <input 
                  type="file" 
                  ref={imageInputRef}
                  className="sr-only"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
                
                <input 
                  type="file" 
                  ref={videoInputRef}
                  className="sr-only"
                  accept="video/*"
                  onChange={handleVideoSelect}
                />
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full opacity-70 hover:opacity-100 hover:scale-110 transition-transform"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <PaperclipIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach file</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full opacity-70 hover:opacity-100 hover:scale-110 transition-transform"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <FileImage className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full opacity-70 hover:opacity-100 hover:scale-110 transition-transform"
                        onClick={() => videoInputRef.current?.click()}
                      >
                        <FileVideo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach video</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full opacity-70 hover:opacity-100 hover:scale-110 transition-transform"
                        onClick={() => navigate("/settings")}
                      >
                        <Palette className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Customize appearance</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full opacity-70 hover:opacity-100 hover:scale-110 transition-transform"
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Voice recording (coming soon)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Button 
                  size="icon" 
                  className={cn(
                    "h-8 w-8 rounded-full transition-all duration-300",
                    isTyping 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-110" 
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  )}
                  onClick={sendMessage}
                  disabled={!isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </ChatLayout>
  );
};

export default Journal;
