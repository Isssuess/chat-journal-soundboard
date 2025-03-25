
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
  customBackground: string | null;
  fontStyle: string;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
  setChatBackground: (background: string) => void;
  setCustomBackground: (imageUrl: string | null) => void;
  setFontStyle: (font: string) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  accentColor: "#128C7E", // Default WhatsApp green
  chatBackground: "default",
  customBackground: null,
  fontStyle: "default",
  setTheme: () => null,
  setAccentColor: () => null,
  setChatBackground: () => null,
  setCustomBackground: () => null,
  setFontStyle: () => null,
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
  
  const [customBackground, setCustomBackground] = useState<string | null>(
    () => localStorage.getItem(`${storageKey}-custom-bg`) || initialState.customBackground
  );
  
  const [fontStyle, setFontStyle] = useState<string>(
    () => localStorage.getItem("journal-font") || initialState.fontStyle
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
  
  useEffect(() => {
    if (customBackground) {
      localStorage.setItem(`${storageKey}-custom-bg`, customBackground);
    } else {
      localStorage.removeItem(`${storageKey}-custom-bg`);
    }
  }, [customBackground, storageKey]);
  
  useEffect(() => {
    localStorage.setItem("journal-font", fontStyle);
    
    // Create a custom event to notify when font style changes
    const event = new Event("storage");
    window.dispatchEvent(event);
  }, [fontStyle]);

  const value = {
    theme,
    accentColor,
    chatBackground,
    customBackground,
    fontStyle,
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
    setCustomBackground: (imageUrl: string | null) => {
      setCustomBackground(imageUrl);
    },
    setFontStyle: (font: string) => {
      setFontStyle(font);
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
