
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatLayout from "@/components/ChatLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Send, Sparkles, Mic, PaperclipIcon, Camera, ArrowLeft, ArrowRight } from "lucide-react";
import { format, addDays, subDays, isToday, parseISO, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Function to generate journal prompts
const getJournalPrompts = () => {
  const prompts = [
    "What made you smile today?",
    "What's one thing you learned recently?",
    "Describe your current mood in detail.",
    "What's something you're looking forward to?",
    "What's a challenge you're facing right now?",
    "What are you grateful for today?",
    "Describe a recent interaction that affected you.",
    "What's something you'd like to improve about yourself?",
    "What's a goal you're working towards?",
    "Reflect on a decision you made recently.",
    "What's something that surprised you lately?",
    "What's a memory that made you happy today?",
    "What's something you're proud of?",
    "What's a worry you can let go of?",
    "What's giving you hope right now?",
  ];
  
  // Return 3 random prompts
  const shuffled = [...prompts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

interface JournalEntry {
  date: string;
  content: string[];
  lastUpdated: string;
}

const Journal = () => {
  const { date } = useParams<{ date: string }>();
  const [message, setMessage] = useState("");
  const [journalEntry, setJournalEntry] = useState<JournalEntry | null>(null);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Parse the date from URL
  const currentDate = date ? parseISO(date) : new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const displayDate = format(currentDate, "MMMM d, yyyy");
  
  useEffect(() => {
    // Load journal entry for the current date
    const loadJournalEntry = () => {
      const savedEntries = localStorage.getItem("journalEntries");
      if (savedEntries) {
        try {
          const entries: JournalEntry[] = JSON.parse(savedEntries);
          const existingEntry = entries.find(entry => entry.date === formattedDate);
          if (existingEntry) {
            setJournalEntry(existingEntry);
          } else {
            // Create new entry
            setJournalEntry({
              date: formattedDate,
              content: [],
              lastUpdated: new Date().toISOString()
            });
            
            // Generate welcome message for new entries
            setTimeout(() => {
              const newEntry = {
                date: formattedDate,
                content: [`Welcome to your journal for ${displayDate}. How are you feeling today?`],
                lastUpdated: new Date().toISOString()
              };
              setJournalEntry(newEntry);
              
              // Save the new entry
              const updatedEntries = savedEntries ? [...JSON.parse(savedEntries), newEntry] : [newEntry];
              localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
            }, 1000);
          }
        } catch (e) {
          console.error("Failed to parse journal entries:", e);
        }
      } else {
        // No entries exist yet, create first entry
        const newEntry = {
          date: formattedDate,
          content: [`Welcome to your journal for ${displayDate}. How are you feeling today?`],
          lastUpdated: new Date().toISOString()
        };
        setJournalEntry(newEntry);
        localStorage.setItem("journalEntries", JSON.stringify([newEntry]));
      }
    };
    
    loadJournalEntry();
    
    // Load prompts
    setPrompts(getJournalPrompts());
  }, [formattedDate, displayDate]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [journalEntry]);
  
  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  // Function to save journal entry
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
  
  // Function to send a message
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
    
    // Auto focus textarea after sending
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };
  
  // Function to use a prompt
  const usePrompt = (prompt: string) => {
    setMessage(prompt);
    
    // Focus textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    
    // Generate new prompts
    setIsLoadingPrompts(true);
    setTimeout(() => {
      setPrompts(getJournalPrompts());
      setIsLoadingPrompts(false);
    }, 1000);
  };
  
  // Handle key press (Ctrl+Enter or Cmd+Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Handle navigation to previous day
  const goToPreviousDay = () => {
    const previousDay = subDays(currentDate, 1);
    navigate(`/journal/${format(previousDay, "yyyy-MM-dd")}`);
  };
  
  // Handle navigation to next day
  const goToNextDay = () => {
    const nextDay = addDays(currentDate, 1);
    const today = new Date();
    
    // Don't allow navigating to future dates
    if (isBefore(nextDay, addDays(today, 1))) {
      navigate(`/journal/${format(nextDay, "yyyy-MM-dd")}`);
    } else {
      toast({
        title: "Cannot navigate to future dates",
        description: "You can only journal for past or current days.",
      });
    }
  };
  
  return (
    <ChatLayout title={displayDate} showBackButton>
      <div className="h-full flex flex-col">
        {/* Navigation buttons */}
        <div className="flex justify-between mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToPreviousDay}
            className="bg-white/70 dark:bg-background/50 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous Day
          </Button>
          
          {!isToday(currentDate) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNextDay}
              className="bg-white/70 dark:bg-background/50 backdrop-blur-sm"
            >
              Next Day
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 theme-transition">
          <div className="flex flex-col space-y-1 p-2">
            {journalEntry?.content.map((content, index) => {
              // First message is from the app, rest are from user
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
                  {content}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Prompts */}
        <div className="mb-4 overflow-x-auto custom-scrollbar">
          <div className="flex space-x-2">
            {prompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="whitespace-nowrap bg-white/70 dark:bg-background/50 backdrop-blur-sm"
                onClick={() => usePrompt(prompt)}
                disabled={isLoadingPrompts}
              >
                <Sparkles className="h-3 w-3 mr-2 text-primary" />
                {prompt}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Message input */}
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
            className="message-input bg-white/90 dark:bg-background/70 backdrop-blur-sm shadow-md pr-12"
            rows={1}
          />
          
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
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
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              )}
              onClick={sendMessage}
              disabled={!isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </ChatLayout>
  );
};

export default Journal;
