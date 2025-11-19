'use client';

import React, { useState, useEffect } from 'react';
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

  // Update mode when initialMode changes (when modal opens with different mode)
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMessage(null);
      setSubscribeNewsletter(true); // Reset to checked by default
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

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
        setMode('signin');
        setLoading(false);
      } else {
        // Sign in successful
        setEmail('');
        setPassword('');
        setError(null);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === 'signin' 
            ? 'Sign in to access the full content library'
            : 'Create an account to access the full content library'}
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'signin'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'signup'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
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
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
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
            />
            {mode === 'signup' && (
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {/* Newsletter Checkbox for Sign Up */}
          {mode === 'signup' && (
            <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30">
              <input
                type="checkbox"
                id="newsletter"
                checked={subscribeNewsletter}
                onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="newsletter" className="text-sm text-muted-foreground cursor-pointer flex-1">
                I agree to sign up for the{' '}
                <span className="font-semibold text-foreground">free high-value newsletter</span>
                {' '}to receive curated insights and updates
              </label>
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded">
              {successMessage}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
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
};

