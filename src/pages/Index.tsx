
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      // For demo purposes, any login works
      localStorage.setItem("user", JSON.stringify({ username }));
      localStorage.setItem("isAuthenticated", "true");
      
      toast({
        title: "Successfully signed in",
        description: `Welcome back, ${username}!`,
      });
      
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration delay
    setTimeout(() => {
      // For demo purposes, any registration works
      localStorage.setItem("user", JSON.stringify({ username }));
      localStorage.setItem("isAuthenticated", "true");
      
      toast({
        title: "Account created",
        description: `Welcome to ChatJournal, ${username}!`,
      });
      
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4 sm:p-8">
      <div 
        className="w-full max-w-md animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-2 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            ChatJournal
          </h1>
          <p className="text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            Your personal journal with a chat-like experience.
          </p>
        </div>

        <Card className="border-none shadow-lg animate-zoom-in" style={{ animationDelay: "0.4s" }}>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full transition-all duration-300 hover:bg-primary/90 flex items-center gap-2 group"
                    disabled={isLoading}
                  >
                    Sign In
                    <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                    
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs text-muted-foreground">Password strength:</p>
                          <div className="flex gap-1">
                            {[...Array(4)].map((_, i) => (
                              <div 
                                key={i}
                                className={cn(
                                  "h-1 w-6 rounded-full transition-colors duration-300",
                                  i < passwordStrength 
                                    ? passwordStrength <= 1 
                                      ? "bg-red-400" 
                                      : passwordStrength === 2 
                                        ? "bg-orange-400" 
                                        : passwordStrength === 3 
                                          ? "bg-yellow-400" 
                                          : "bg-green-400"
                                    : "bg-gray-200"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300",
                              password.length >= 8 ? "bg-green-400" : "bg-gray-200"
                            )}>
                              {password.length >= 8 && <Check size={12} className="text-white" />}
                            </div>
                            <p className="text-xs text-muted-foreground">At least 8 characters</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300",
                              /[A-Z]/.test(password) ? "bg-green-400" : "bg-gray-200"
                            )}>
                              {/[A-Z]/.test(password) && <Check size={12} className="text-white" />}
                            </div>
                            <p className="text-xs text-muted-foreground">At least one uppercase letter</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300",
                              /[0-9]/.test(password) ? "bg-green-400" : "bg-gray-200"
                            )}>
                              {/[0-9]/.test(password) && <Check size={12} className="text-white" />}
                            </div>
                            <p className="text-xs text-muted-foreground">At least one number</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={cn(
                        "transition-all duration-300 focus:ring-2 focus:ring-primary",
                        password && confirmPassword && password !== confirmPassword ? "border-red-400 focus:ring-red-400" : ""
                      )}
                    />
                    
                    {password && confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-400 mt-1">Passwords don't match</p>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full transition-all duration-300 hover:bg-primary/90 flex items-center gap-2 group"
                    disabled={isLoading || (password !== "" && confirmPassword !== "" && password !== confirmPassword)}
                  >
                    Create Account
                    <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Index;
