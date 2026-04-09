import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({ theme: "light", setTheme: () => null });

export function ThemeProvider({ children, defaultTheme = "light" }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
