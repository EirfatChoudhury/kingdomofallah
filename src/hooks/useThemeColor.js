'use client';

import { useTheme } from '@/context/ThemeContext';

export function useThemeColor(props = {}, colorName) {
  const { theme } = useTheme();
  const colorFromProps = props[colorName];

  if (colorFromProps) {
    return colorFromProps;
  }

  return theme[colorName];
}