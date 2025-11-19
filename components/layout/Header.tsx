'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Moon, Sun, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { LoginModal } from '@/components/auth/LoginModal';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<'signin' | 'signup'>('signin');
  const { user, signOut, signIn, signUp, isAuthenticated } = useAuth();

  const openLoginModal = React.useCallback((mode: 'signin' | 'signup') => {
    setLoginMode(mode);
    setLoginModalOpen(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    setMounted(true);
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');

    // Listen for custom event to open login modal from hero section
    const handleOpenLoginModal = (event: CustomEvent) => {
      const mode = event.detail?.mode || 'signin';
      openLoginModal(mode as 'signin' | 'signup');
    };

    window.addEventListener('openLoginModal', handleOpenLoginModal as EventListener);

    return () => {
      window.removeEventListener('openLoginModal', handleOpenLoginModal as EventListener);
    };
  }, [openLoginModal]);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                {/* Placeholder for logo PNG */}
              </div>
              <h1 className="text-lg font-semibold">DataPeCharcha Recommends</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image 
                src="/logo.png" 
                alt="DataPeCharcha Logo" 
                width={32} 
                height={32} 
                className="w-full h-full object-contain" 
              />
            </div>
            <h1 className="text-lg font-semibold">DataPeCharcha Recommends</h1>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="truncate max-w-[150px]">{user?.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openLoginModal('signin')}
                  className="whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Sign In</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openLoginModal('signup')}
                  className="whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Sign Up</span>
                  <span className="sm:hidden">Sign Up</span>
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme} 
              className="flex-shrink-0"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => {
          setLoginModalOpen(false);
          setLoginMode('signin');
        }}
        onSignIn={signIn}
        onSignUp={signUp}
        initialMode={loginMode}
      />
    </header>
  );
}
