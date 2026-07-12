"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  mounted: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  mounted: false,
  toggleTheme: () => {},
});

let currentTheme: Theme = "light";
let themeListeners: Array<() => void> = [];

function emitThemeChange() {
  for (const l of themeListeners) l();
}

function subscribeTheme(callback: () => void) {
  themeListeners.push(callback);
  return () => {
    themeListeners = themeListeners.filter((l) => l !== callback);
  };
}

function getThemeSnapshot(): Theme {
  return currentTheme;
}

function getThemeServerSnapshot(): Theme {
  return "light";
}

let isMounted = false;
let mountedListeners: Array<() => void> = [];

function emitMountedChange() {
  for (const l of mountedListeners) l();
}

function subscribeMounted(callback: () => void) {
  mountedListeners.push(callback);
  return () => {
    mountedListeners = mountedListeners.filter((l) => l !== callback);
  };
}

function getMountedSnapshot(): boolean {
  return isMounted;
}

function getMountedServerSnapshot(): boolean {
  return false;
}

function resolveInitialTheme(): Theme {
  const stored = localStorage.getItem("inventraai_theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );
  const mounted = useSyncExternalStore(
    subscribeMounted,
    getMountedSnapshot,
    getMountedServerSnapshot
  );

  useEffect(() => {
    const resolved = resolveInitialTheme();
    if (resolved !== currentTheme) {
      currentTheme = resolved;
      document.documentElement.classList.toggle("dark", resolved === "dark");
      emitThemeChange();
    }
    isMounted = true;
    emitMountedChange();
  }, []);

  const toggleTheme = useCallback(() => {
    const next = currentTheme === "light" ? "dark" : "light";
    currentTheme = next;
    localStorage.setItem("inventraai_theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    emitThemeChange();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, mounted, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
