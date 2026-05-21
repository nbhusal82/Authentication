import { createContext, useContext, useState } from "react";

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(false);
  return (
    <DarkModeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      <div className={dark ? "dark" : ""}>{children}</div>
    </DarkModeContext.Provider>
  );
}

export const useDark = () => useContext(DarkModeContext);
