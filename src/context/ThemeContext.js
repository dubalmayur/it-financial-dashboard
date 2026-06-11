import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode,  setDarkMode]  = useState(true);
  const [currency,  setCurrency]  = useState('both'); // 'inr' | 'usd' | 'both'
  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, currency, setCurrency }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
