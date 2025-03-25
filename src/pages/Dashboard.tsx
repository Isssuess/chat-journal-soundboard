
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatLayout from "@/components/ChatLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { PenLine, CalendarDays, ChevronRight, PlusCircle, Sparkles } from "lucide-react";
import { format, isToday, subDays } from "date-fns";
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
  
  // Return a random prompt
  return prompts[Math.floor(Math.random() * prompts.length)];
};

// Custom type for journal entries
interface JournalEntry {
  date: string;
  content: string[];
  lastUpdated: string;
}

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Load journal entries from localStorage
    const loadEntries = () => {
      const savedEntries = localStorage.getItem("journalEntries");
      if (savedEntries) {
        try {
          setJournalEntries(JSON.parse(savedEntries));
        } catch (e) {
          console.error("Failed to parse journal entries:", e);
          toast({
            title: "Error loading entries",
            description: "There was a problem loading your journal entries.",
            variant: "destructive",
          });
        }
      }
      setIsLoading(false);
    };
    
    // Simulate loading delay
    setTimeout(loadEntries, 1000);
  }, [toast]);
  
  // Function to go to journal entry for a specific date
  const goToJournalEntry = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    navigate(`/journal/${formattedDate}`);
  };
  
  // Function to create a new entry for today
  const createTodayEntry = () => {
    goToJournalEntry(new Date());
  };
  
  // Function to determine if a date has a journal entry
  const hasJournalEntry = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return journalEntries.some(entry => entry.date === formattedDate);
  };
  
  // Get recent entries (last 7 days)
  const recentEntries = journalEntries
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 7);
  
  return (
    <ChatLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full animate-fade-in">
        <div className="flex flex-col space-y-6">
          <Card className="bg-white/90 dark:bg-card/90 shadow-sm backdrop-blur-sm animate-fade-in-up">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Welcome back!</h2>
                  <p className="text-muted-foreground">
                    {isToday(date as Date) 
                      ? "How are you feeling today?" 
                      : `Selected date: ${date ? format(date, "MMMM d, yyyy") : "None"}`}
                  </p>
                </div>
                
                <Button 
                  onClick={createTodayEntry}
                  variant="default" 
                  className="flex items-center gap-2 group"
                >
                  <PlusCircle className="h-4 w-4" />
                  Today's Journal
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              
              <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Prompt of the day</h3>
                    <p className="text-muted-foreground">{getJournalPrompts()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 dark:bg-card/90 shadow-sm backdrop-blur-sm flex-1 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardContent className="pt-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Calendar
                </h2>
              </div>
              
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  hasEntry: (date) => hasJournalEntry(date),
                }}
                modifiersClassNames={{
                  hasEntry: "bg-primary/20 text-primary font-bold",
                }}
                components={{
                  DayContent: (props) => (
                    <div 
                      className={cn(
                        "relative w-full h-full p-2 flex items-center justify-center",
                        hasJournalEntry(props.date) && "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                      )}
                      onClick={() => goToJournalEntry(props.date)}
                    >
                      {props.date.getDate()}
                    </div>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col space-y-6">
          <Card className="bg-white/90 dark:bg-card/90 shadow-sm backdrop-blur-sm flex-1 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <PenLine className="h-5 w-5 text-primary" />
                  Recent Entries
                </h2>
              </div>
              
              {isLoading ? (
                <div className="flex flex-col space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-muted rounded-md"></div>
                    </div>
                  ))}
                </div>
              ) : recentEntries.length > 0 ? (
                <div className="flex flex-col space-y-3">
                  {recentEntries.map((entry) => {
                    const entryDate = new Date(entry.date);
                    const formattedDate = format(entryDate, "MMMM d, yyyy");
                    const isTodays = isToday(entryDate);
                    
                    // Get abbreviated content preview
                    const contentPreview = entry.content.length > 0 
                      ? entry.content[0].substring(0, 120) + (entry.content[0].length > 120 ? "..." : "")
                      : "No content";
                    
                    return (
                      <Button 
                        key={entry.date}
                        variant="ghost"
                        className="p-3 h-auto flex flex-col items-start justify-start border border-border hover:bg-muted/50 transition-all group"
                        onClick={() => goToJournalEntry(entryDate)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              isTodays ? "bg-primary" : "bg-muted-foreground"
                            )} />
                            <p className="font-medium">
                              {isTodays ? "Today" : formattedDate}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </div>
                        <p className="text-muted-foreground text-sm text-left mt-1 line-clamp-2">{contentPreview}</p>
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No journal entries yet</p>
                  <Button 
                    onClick={createTodayEntry}
                    variant="default" 
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create Your First Entry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 dark:bg-card/90 shadow-sm backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-3">Quick Tips</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Write regularly to build a journaling habit.</p>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Use prompts for inspiration when you're not sure what to write.</p>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Customize your theme in the Settings section.</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </ChatLayout>
  );
};

export default Dashboard;
