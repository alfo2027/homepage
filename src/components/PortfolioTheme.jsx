import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const PortfolioThemeContext = createContext(null);

export function PortfolioThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  const toggleTheme = useCallback(() => setDark((value) => !value), []);
  const value = useMemo(() => ({ dark, toggleTheme }), [dark, toggleTheme]);

  useEffect(() => {
    document.body.classList.toggle("is-portfolio-dark", dark);
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
