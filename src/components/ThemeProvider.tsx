
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
  dashboardBackground: string | null;
  dashboardTheme: string;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
  setChatBackground: (background: string) => void;
  setCustomBackground: (imageUrl: string | null) => void;
  setFontStyle: (font: string) => void;
  setDashboardBackground: (imageUrl: string | null) => void;
  setDashboardTheme: (theme: string) => void;
};

// Background template options (20 options)
export const backgroundTemplates = [
  { id: 'default', name: 'Default', value: 'default' },
  { id: 'blue', name: 'Blue Sky', value: 'blue' },
  { id: 'purple', name: 'Lavender', value: 'purple' },
  { id: 'pink', name: 'Cotton Candy', value: 'pink' },
  { id: 'green', name: 'Mint', value: 'green' },
  { id: 'yellow', name: 'Sunshine', value: 'yellow' },
  { id: 'orange', name: 'Sunset', value: 'orange' },
  { id: 'red', name: 'Ruby', value: 'red' },
  { id: 'teal', name: 'Teal Ocean', value: 'teal' },
  { id: 'indigo', name: 'Night Sky', value: 'indigo' },
  { id: 'brown', name: 'Coffee', value: 'brown' },
  { id: 'gray', name: 'Slate', value: 'gray' },
  { id: 'pastel', name: 'Pastel Dream', value: 'pastel' },
  { id: 'gradient1', name: 'Gradient Sunrise', value: 'gradient1' },
  { id: 'gradient2', name: 'Gradient Ocean', value: 'gradient2' },
  { id: 'gradient3', name: 'Gradient Forest', value: 'gradient3' },
  { id: 'gradient4', name: 'Gradient Candy', value: 'gradient4' },
  { id: 'pattern1', name: 'Dotted Pattern', value: 'pattern1' },
  { id: 'pattern2', name: 'Lines Pattern', value: 'pattern2' },
  { id: 'pattern3', name: 'Grid Pattern', value: 'pattern3' },
];

// Font style options (20 options)
export const fontOptions = [
  { id: 'default', name: 'Default (Inter)', value: 'font-sans' },
  { id: 'cute', name: 'Indie Flower', value: 'font-cute' },
  { id: 'pacifico', name: 'Pacifico', value: 'font-pacifico' },
  { id: 'caveat', name: 'Caveat', value: 'font-caveat' },
  { id: 'amatic', name: 'Amatic SC', value: 'font-amatic' },
  { id: 'dancing', name: 'Dancing Script', value: 'font-dancing' },
  { id: 'shadows', name: 'Shadows Into Light', value: 'font-shadows' },
  { id: 'patrick', name: 'Patrick Hand', value: 'font-patrick' },
  { id: 'sacramento', name: 'Sacramento', value: 'font-sacramento' },
  { id: 'architects', name: 'Architects Daughter', value: 'font-architects' },
  { id: 'kalam', name: 'Kalam', value: 'font-kalam' },
  { id: 'handlee', name: 'Handlee', value: 'font-handlee' },
  { id: 'neucha', name: 'Neucha', value: 'font-neucha' },
  { id: 'gloria', name: 'Gloria Hallelujah', value: 'font-gloria' },
  { id: 'annie', name: 'Annie Use Your Telescope', value: 'font-annie' },
  { id: 'gochi', name: 'Gochi Hand', value: 'font-gochi' },
  { id: 'schoolbell', name: 'Schoolbell', value: 'font-schoolbell' },
  { id: 'poppins', name: 'Poppins', value: 'font-poppins' },
  { id: 'nunito', name: 'Nunito', value: 'font-nunito' },
  { id: 'comic', name: 'Comic Neue', value: 'font-comic' },
];

// Theme options (20 options)
export const themeOptions = [
  { id: 'default', name: 'Default Green', value: '#128C7E' },
  { id: 'blue', name: 'Blue', value: '#3498db' },
  { id: 'purple', name: 'Purple', value: '#9b59b6' },
  { id: 'pink', name: 'Pink', value: '#E91E63' },
  { id: 'red', name: 'Red', value: '#e74c3c' },
  { id: 'orange', name: 'Orange', value: '#e67e22' },
  { id: 'yellow', name: 'Yellow', value: '#f1c40f' },
  { id: 'green', name: 'Green', value: '#2ecc71' },
  { id: 'teal', name: 'Teal', value: '#1abc9c' },
  { id: 'cyan', name: 'Cyan', value: '#00BCD4' },
  { id: 'indigo', name: 'Indigo', value: '#3F51B5' },
  { id: 'deepPurple', name: 'Deep Purple', value: '#673AB7' },
  { id: 'amber', name: 'Amber', value: '#FFC107' },
  { id: 'deepOrange', name: 'Deep Orange', value: '#FF5722' },
  { id: 'brown', name: 'Brown', value: '#795548' },
  { id: 'blueGray', name: 'Blue Gray', value: '#607D8B' },
  { id: 'lime', name: 'Lime', value: '#CDDC39' },
  { id: 'lightBlue', name: 'Light Blue', value: '#03A9F4' },
  { id: 'lightGreen', name: 'Light Green', value: '#8BC34A' },
  { id: 'deepPink', name: 'Deep Pink', value: '#FF1493' },
];

const initialState: ThemeProviderState = {
  theme: "system",
  accentColor: "#128C7E", // Default WhatsApp green
  chatBackground: "default",
  customBackground: null,
  fontStyle: "default",
  dashboardBackground: null,
  dashboardTheme: "default",
  setTheme: () => null,
  setAccentColor: () => null,
  setChatBackground: () => null,
  setCustomBackground: () => null,
  setFontStyle: () => null,
  setDashboardBackground: () => null,
  setDashboardTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "thelastday-theme",
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
  
  const [dashboardBackground, setDashboardBackground] = useState<string | null>(
    () => localStorage.getItem(`${storageKey}-dashboard-bg`) || initialState.dashboardBackground
  );
  
  const [dashboardTheme, setDashboardTheme] = useState<string>(
    () => localStorage.getItem(`${storageKey}-dashboard-theme`) || initialState.dashboardTheme
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
  
  useEffect(() => {
    if (dashboardBackground) {
      localStorage.setItem(`${storageKey}-dashboard-bg`, dashboardBackground);
    } else {
      localStorage.removeItem(`${storageKey}-dashboard-bg`);
    }
  }, [dashboardBackground, storageKey]);
  
  useEffect(() => {
    localStorage.setItem(`${storageKey}-dashboard-theme`, dashboardTheme);
  }, [dashboardTheme, storageKey]);

  const value = {
    theme,
    accentColor,
    chatBackground,
    customBackground,
    fontStyle,
    dashboardBackground,
    dashboardTheme,
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
    setDashboardBackground: (imageUrl: string | null) => {
      setDashboardBackground(imageUrl);
    },
    setDashboardTheme: (theme: string) => {
      setDashboardTheme(theme);
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
