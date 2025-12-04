'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Moon, Sun, LogIn, LogOut, User, Bookmark } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { LoginModal } from '@/components/auth/LoginModal';

export function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<'signin' | 'signup' | 'forgot-password'>('signin');
  const { user, signOut, signIn, signUp, isAuthenticated } = useAuth();

  const openLoginModal = React.useCallback((mode: 'signin' | 'signup' | 'forgot-password') => {
    console.log('Opening login modal with mode:', mode);
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
      openLoginModal(mode as 'signin' | 'signup' | 'forgot-password');
    };

    window.addEventListener('openLoginModal', handleOpenLoginModal as EventListener);

    return () => {
      window.removeEventListener('openLoginModal', handleOpenLoginModal as EventListener);
    };
  }, [openLoginModal]);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                {/* Placeholder for logo PNG */}
              </div>
              <h1 className="text-sm sm:text-base md:text-lg font-semibold">DataPeCharcha Recommends</h1>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-8 sm:w-9 h-8 sm:h-9" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image 
                src="/logo.png" 
                alt="DataPeCharcha Logo" 
                width={32} 
                height={32} 
                className="w-full h-full object-contain" 
              />
            </div>
            <h1 className="text-sm sm:text-base md:text-lg font-semibold truncate">DataPeCharcha Recommends</h1>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="truncate max-w-[150px]">{user?.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/bookmarks')}
                  className="whitespace-nowrap text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 touch-manipulation"
                  aria-label="View bookmarks"
                >
                  <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Bookmarks</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="whitespace-nowrap text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 touch-manipulation"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openLoginModal('signin')}
                  className="whitespace-nowrap text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 touch-manipulation"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openLoginModal('signup')}
                  className="whitespace-nowrap text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 touch-manipulation"
                >
                  Sign Up
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme} 
              className="flex-shrink-0 h-8 sm:h-9 w-8 sm:w-9 p-0 touch-manipulation"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
