
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  accentColor: string;
  chatBackground: string;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
  setChatBackground: (background: string) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  accentColor: "#128C7E", // Default WhatsApp green
  chatBackground: "default",
  setTheme: () => null,
  setAccentColor: () => null,
  setChatBackground: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const [accentColor, setAccentColor] = useState<string>(
    () => localStorage.getItem(`${storageKey}-accent`) || initialState.accentColor
  );
  
  const [chatBackground, setChatBackground] = useState<string>(
    () => localStorage.getItem(`${storageKey}-chat-bg`) || initialState.chatBackground
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    // Apply accent color to CSS variables
    document.documentElement.style.setProperty('--primary', accentColor);
    localStorage.setItem(`${storageKey}-accent`, accentColor);
  }, [accentColor, storageKey]);

  useEffect(() => {
    localStorage.setItem(`${storageKey}-chat-bg`, chatBackground);
  }, [chatBackground, storageKey]);

  const value = {
    theme,
    accentColor,
    chatBackground,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    setAccentColor: (color: string) => {
      setAccentColor(color);
    },
    setChatBackground: (background: string) => {
      setChatBackground(background);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
