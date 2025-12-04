'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  onSignUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  initialMode?: 'signin' | 'signup' | 'forgot-password' | 'reset-password';
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSignIn, onSignUp, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot-password' | 'reset-password'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Ensure we're mounted (client-side only) for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update mode when initialMode changes (when modal opens with different mode)
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      // Only reset on initial open, not when state updates
      setMode(initialMode);
      setError(null);
      setSuccessMessage(null);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSubscribeNewsletter(true);
      setLoading(false);
      setHasInitialized(true);
    } else if (!isOpen) {
      // Clear any pending timeout when modal closes
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      setHasInitialized(false);
    }
  }, [isOpen, initialMode, timeoutId, hasInitialized]);

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

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        setError(error.message);
        setLoading(false);
      }
      // Note: User will be redirected to Google, so we don't set loading to false here
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleModeSwitch = (newMode: 'signin' | 'signup' | 'forgot-password') => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage(`Password reset link sent to ${email}. Check your inbox!`);
        setEmail('');
        // Auto switch to signin after 5 seconds
        const id = setTimeout(() => {
          setMode('signin');
          setSuccessMessage(null);
          setTimeoutId(null);
        }, 5000);
        setTimeoutId(id);
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
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
          // Show success message for signup (email confirmation required)
          setSuccessMessage(`Account created! We've sent a verification email to ${email}. Please check your inbox and click the verification link to activate your account, then sign in here.`);
          setEmail('');
          setPassword('');
          setLoading(false);
          // Switch to signin mode after user has time to read the message
          const id = setTimeout(() => {
            setMode('signin');
            setSuccessMessage(null);
            setTimeoutId(null);
          }, 5000);
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
          {mode === 'signin' && 'Sign In'}
          {mode === 'signup' && 'Sign Up'}
          {mode === 'forgot-password' && 'Reset Password'}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 md:mb-6">
          {mode === 'signin' && 'Sign in to access the full content library'}
          {mode === 'signup' && 'Create an account to access the full content library'}
          {mode === 'forgot-password' && 'Enter your email and we\'ll send you a reset link'}
        </p>

        {/* Tabs - Only show for signin/signup */}
        {(mode === 'signin' || mode === 'signup') && (
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
        )}

        {/* Back to Sign In link for forgot password */}
        {mode === 'forgot-password' && (
          <button
            onClick={() => handleModeSwitch('signin')}
            className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
          >
            <span>←</span> Back to Sign In
          </button>
        )}

        <form onSubmit={mode === 'forgot-password' ? handleForgotPassword : handleSubmit} className="space-y-2.5 sm:space-y-3 md:space-y-4">
          {/* Google Sign In Button - Only for signin/signup */}
          {(mode === 'signin' || mode === 'signup') && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full text-sm sm:text-base h-10 sm:h-11 touch-manipulation"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>
            </>
          )}

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

          {/* Password field - Only for signin/signup */}
          {(mode === 'signin' || mode === 'signup') && (
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
          )}

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
                ? (mode === 'signin' ? 'Signing in...' : mode === 'signup' ? 'Signing up...' : 'Sending...')
                : (mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link')
              }
            </Button>
          </div>

          {/* Forgot Password Link - Only show in sign in mode */}
          {mode === 'signin' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleModeSwitch('forgot-password')}
                className="text-xs sm:text-sm text-primary hover:underline"
              >
                Forgot your password?
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

