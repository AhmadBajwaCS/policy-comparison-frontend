import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <nav>
                    <div className="logo">
                      <img src="/assets/images/logo.png" alt="Logo" className="symbol"/>
                      PolicyCompare
                    </div>
                    <ul>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/about">About</Link></li>
                        <li><button id="theme-toggle">Light/Dark Mode</button></li>
                    </ul>
                </nav>
                {children}
                <footer>
                    <p>© 2025 PolicyCompare. All rights reserved.</p>
                    <p>Data & Sources: Policy data is taken from credible sources including, but not limited to, government databases and official state records.</p>
                </footer>
            </body>
        </html>
    );
}
