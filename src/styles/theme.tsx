import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ThemeProvider } from "styled-components";

import { GlobalStyle } from "./global";

interface ThemeProviderData {
  setCurrentTheme: Dispatch<SetStateAction<"light" | "dark">>;
  getOppositTheme: () => ThemeName;
}

export const ThemeContext = createContext({} as ThemeProviderData);

export type Theme = {
  colors: {
    bg: string;
    bgAlpha: string;
    text: string;
    secondaryText: string;
    highlight: string;
    accent: string;
    primary: string;
    secondary: string;
    success: string;
    error: string;
  };
};

const lightTheme: Theme = {
  colors: {
    bg: "#fff6f9",
    bgAlpha: "#fff6f970",
    text: "#cdb4db",
    secondaryText: "#231942",
    highlight: "#ff6ad5",
    accent: "#ccddbb",
    primary: "#b4a5ff",
    secondary: "#ffafcc",
    success: "#50fa50",
    error: "#fa5050",
  },
};

const darkTheme: Theme = {
  colors: {
    bg: "#231942",
    bgAlpha: "#23194270",
    text: "#e0c3fc",
    secondaryText: "",
    highlight: "#7209b7",
    accent: "#f72585",
    primary: "#bbadff",
    secondary: "#757bc8",
    success: "#0091ad",
    error: "#b7094c",
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

type ThemeName = keyof typeof themes;

interface Props {
  children: ReactNode;
}

export default function AppTheme({ children }: Props) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("@BCPlanner:theme") || "light";
    setCurrentTheme(savedTheme as ThemeName);
  }, []);

  const getOppositTheme = useCallback(() => {
    if (currentTheme === "light") {
      localStorage.setItem("@BCPlanner:theme", "light");
      return "dark" as ThemeName;
    } else {
      localStorage.setItem("@BCPlanner:theme", "dark");
      return "light" as ThemeName;
    }
  }, [currentTheme]);

  return (
    <ThemeProvider theme={themes[currentTheme]}>
      <ThemeContext.Provider value={{ setCurrentTheme, getOppositTheme }}>
        <GlobalStyle />
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}
