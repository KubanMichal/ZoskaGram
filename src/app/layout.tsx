'use client'
import "./globals.css";
import Navbar from "@/components/NavBar";
import AuthProvider from "../components/AuthProvider";
import { createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useMemo } from 'react';
import { PaletteMode } from '@mui/material';
import { getDesignTokens } from '../app/theme/themeConfig'
import { ThemeProvider } from "@/components/ThemeProvider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [mode, setMode] = useState<PaletteMode>('light');
  
  const theme = useMemo(() => 
    createTheme(getDesignTokens(mode)), 
    [mode]
  );

  return (
    <html lang="sk">
      <body>
        <ThemeProvider>
          <CssBaseline />
          <AuthProvider>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <main style={{ flexGrow: 1 }}>
                {children}
              </main>
            </div>
            <Navbar/>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}