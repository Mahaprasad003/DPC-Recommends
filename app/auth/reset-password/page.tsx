'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle, Lock } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has a valid session (came from email link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setValidSession(true);
      } else {
        // No valid session, redirect to forgot password
        router.push('/auth/forgot-password');
      }
    };
    
    checkSession();
  }, [router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Password update error:', err);
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!validSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border rounded-lg p-6 sm:p-8 text-center">
          <p className="text-muted-foreground">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border rounded-lg p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold">Password Updated!</h1>
          <p className="text-muted-foreground">
            Your password has been successfully reset. You&apos;ll be redirected to the home page in a moment.
          </p>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => router.push('/')}
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border rounded-lg p-6 sm:p-8">
        <div className="mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Set New Password</h1>
          <p className="text-sm text-muted-foreground">
            Choose a strong password to secure your account.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              New Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={loading}
              minLength={6}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Must be at least 6 characters
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={loading}
              minLength={6}
              className="w-full"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </form>

        {/* Password strength indicator */}
        {password && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Password strength:</p>
            <div className="flex gap-1">
              <div className={`h-1 flex-1 rounded ${password.length >= 6 ? 'bg-yellow-500' : 'bg-muted'}`} />
              <div className={`h-1 flex-1 rounded ${password.length >= 8 ? 'bg-yellow-500' : 'bg-muted'}`} />
              <div className={`h-1 flex-1 rounded ${password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'bg-green-500' : 'bg-muted'}`} />
            </div>
            <p className="text-xs text-muted-foreground">
              {password.length < 6 && 'Weak - Add more characters'}
              {password.length >= 6 && password.length < 8 && 'Fair - Add more characters'}
              {password.length >= 8 && !/[A-Z]/.test(password) && 'Good - Add uppercase letters'}
              {password.length >= 8 && /[A-Z]/.test(password) && !/[0-9]/.test(password) && 'Good - Add numbers'}
              {password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && 'Strong password'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
