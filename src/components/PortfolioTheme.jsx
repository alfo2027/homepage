import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const PortfolioThemeContext = createContext(null);
const THEME_STORAGE_KEY = "portfolio-theme";

function readSavedTheme() {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark";
  } catch {
    return false;
  }
}

export function PortfolioThemeProvider({ children }) {
  const [dark, setDark] = useState(readSavedTheme);
  const toggleTheme = useCallback(() => setDark((value) => !value), []);
  const value = useMemo(() => ({ dark, toggleTheme }), [dark, toggleTheme]);

  useEffect(() => {
    document.body.classList.toggle("is-portfolio-dark", dark);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
    } catch {
      // Theme switching still works when browser storage is unavailable.
    }
    return () => document.body.classList.remove("is-portfolio-dark");
  }, [dark]);

  return (
    <PortfolioThemeContext.Provider value={value}>
      <div className={`portfolio-app${dark ? " is-dark" : ""}`}>{children}</div>
    </PortfolioThemeContext.Provider>
  );
}

export function usePortfolioTheme() {
  const context = useContext(PortfolioThemeContext);
  if (!context) throw new Error("usePortfolioTheme must be used within PortfolioThemeProvider");
  return context;
}
