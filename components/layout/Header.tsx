'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Moon, Sun } from 'lucide-react';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (!mounted) {
    return (
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                {/* Placeholder for logo PNG */}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">DataPeCharcha Recommends</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                  A library of high-quality, personally vetted knowledge base for your next read
                </p>
              </div>
            </div>
            <div className="w-10 h-10" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <Image src="/logo.png" alt="DataPeCharcha Logo" width={48} height={48} className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">DataPeCharcha Recommends</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                A library of high-quality, personally vetted knowledge base for your next read
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Button
              variant="primary"
              size="md"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-3 sm:px-6 py-2 text-xs sm:text-sm whitespace-nowrap"
              onClick={() => window.open('https://datapecharcha.substack.com/', '_blank', 'noopener,noreferrer')}
            >
              <span className="hidden sm:inline">Subscribe to our free newsletter</span>
              <span className="sm:hidden">Subscribe</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="flex-shrink-0">
              {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
