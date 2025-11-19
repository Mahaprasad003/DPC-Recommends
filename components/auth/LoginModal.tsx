'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  onSignUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  initialMode?: 'signin' | 'signup';
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSignIn, onSignUp, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure we're mounted (client-side only) for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update mode when initialMode changes (when modal opens with different mode)
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMessage(null);
      setEmail('');
      setPassword('');
      setSubscribeNewsletter(true); // Reset to checked by default
      setLoading(false); // Reset loading state
    } else {
      // Clear any pending timeout when modal closes
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  }, [isOpen, initialMode, timeoutId]);

  // Debug: Log when modal should be visible
  useEffect(() => {
    if (isOpen) {
      console.log('LoginModal is open, mode:', mode);
    }
  }, [isOpen, mode]);

  if (!isOpen || !mounted) return null;

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleModeSwitch = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const result = mode === 'signin' 
        ? await onSignIn(email, password)
        : await onSignUp(email, password);
      
      if (result.error) {
        setError(result.error.message || `Failed to ${mode === 'signin' ? 'sign in' : 'sign up'}. Please check your credentials.`);
        setLoading(false);
      } else {
        if (mode === 'signup') {
          // Show success message for signup (email confirmation might be required)
          setSuccessMessage('Account created successfully! Please check your email to confirm your account, then sign in.');
          setEmail('');
          setPassword('');
          setLoading(false);
          // Switch to signin mode after a brief delay to let user see the message
          const id = setTimeout(() => {
            setMode('signin');
            setSuccessMessage(null);
            setTimeoutId(null);
          }, 3000);
          setTimeoutId(id);
        } else {
          // Sign in successful
          setLoading(false);
          setEmail('');
          setPassword('');
          setError(null);
          setSuccessMessage(null);
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || `An unexpected error occurred during ${mode === 'signin' ? 'sign in' : 'sign up'}.`);
      setLoading(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div 
        className="bg-background border rounded-lg shadow-lg w-full max-w-[95vw] sm:max-w-md my-auto p-3 sm:p-6 relative max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1 text-muted-foreground hover:text-foreground transition-colors z-10 touch-manipulation"
          aria-label="Close"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 pr-8">
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 md:mb-6">
          {mode === 'signin' 
            ? 'Sign in to access the full content library'
            : 'Create an account to access the full content library'}
        </p>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4 md:mb-6 border-b">
          <button
            type="button"
            onClick={() => handleModeSwitch('signin')}
            disabled={loading}
            className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-2 text-sm font-medium transition-colors disabled:opacity-50 touch-manipulation ${
              mode === 'signin'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('signup')}
            disabled={loading}
            className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-2 text-sm font-medium transition-colors disabled:opacity-50 touch-manipulation ${
              mode === 'signup'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3 md:space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 md:mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              disabled={loading}
              className="text-sm sm:text-base h-10 sm:h-11"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 md:mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
              minLength={6}
              className="text-sm sm:text-base h-10 sm:h-11"
            />
            {mode === 'signup' && (
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {/* Newsletter Checkbox for Sign Up */}
          {mode === 'signup' && (
            <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 rounded-lg border bg-muted/30">
              <input
                type="checkbox"
                id="newsletter"
                checked={subscribeNewsletter}
                onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded border-input text-primary focus:ring-2 focus:ring-primary flex-shrink-0 touch-manipulation"
              />
              <label htmlFor="newsletter" className="text-xs sm:text-sm text-muted-foreground cursor-pointer flex-1 leading-relaxed touch-manipulation">
                I agree to sign up for the{' '}
                <span className="font-semibold text-foreground">free high-value newsletter</span>
                {' '}to receive curated insights and updates
              </label>
            </div>
          )}

          {error && (
            <div className="text-xs sm:text-sm text-destructive bg-destructive/10 p-2.5 sm:p-3 rounded">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2.5 sm:p-3 rounded">
              {successMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 text-sm sm:text-base h-10 sm:h-11 touch-manipulation"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1 text-sm sm:text-base h-10 sm:h-11 touch-manipulation"
            >
              {loading 
                ? (mode === 'signin' ? 'Signing in...' : 'Signing up...')
                : (mode === 'signin' ? 'Sign In' : 'Sign Up')
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

