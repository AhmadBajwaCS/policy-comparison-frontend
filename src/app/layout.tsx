"use client";

import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

function Navbar() {
    const { theme, toggleTheme } = useTheme(); // Get theme and toggle function
  
    return (
      <nav>
        <Link href="/" className="logo">
          <img 
            src={`/assets/images/${theme === "light" ? "logo" : "logo-white"}.png`}
            alt="Logo" className="symbol"
          />
          PolicyCompare
        </Link>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li>
              <img
                  src={`/assets/images/${theme === 'light' ? 'moon-empty' : 'moon-filled'}.png`}
                  alt="Theme Toggle"
                  className="theme-toggle"
                  onClick={toggleTheme}
              />
          </li>
        </ul>
      </nav>
    );
  }
  
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          {children}
          <footer>
            <div className="footer-left">
                <h4>About </h4>
                <p>PolicyCompare helps users easily compare public policies across states to make informed decisions.</p>
                <h4>Data & Sources </h4>
                <p>Policy data is taken from credible sources including, but not limited to, government databases and official state records. Please verify with official sources.</p>
            </div>
            <div className="footer-right">
                <p>© 2025 PolicyCompare.</p>
            </div>
        </footer>
        </body>
      </html>
    </ThemeProvider>
  );
}
