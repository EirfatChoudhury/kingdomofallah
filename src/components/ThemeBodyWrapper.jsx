'use client';

import { useTheme } from '@/context/ThemeContext';

export default function ThemeBodyWrapper({ children }) {
  const { theme } = useTheme();

  return (
    <body
      className="min-h-screen flex flex-col antialiased transition-colors duration-200"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      {children}
    </body>
  );
}