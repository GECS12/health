'use strict';
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';

export function ThemeProvider({ children, ...props }: { children: React.ReactNode }) {
  return <NextThemesProvider attribute="data-theme" defaultTheme="light" enableSystem={false} {...props}>{children}</NextThemesProvider>;
}
