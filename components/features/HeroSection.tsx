'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Search, Filter, BookOpen, ArrowRight, Check, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onSignUp: () => void;
  onSignIn: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSignUp, onSignIn }) => {
  const features = [
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Search across titles, authors, topics, and key takeaways',
    },
    {
      icon: Filter,
      title: 'Smart Filtering',
      description: 'Filter by topics, difficulty, content type, and more',
    },
    {
      icon: BookOpen,
      title: '300+ Resources',
      description: 'Access a curated library of high-quality technical content',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* Main Hero Content */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Discover Your Next
            <span className="block text-primary mt-2">Technical Read</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            A curated library of 300+ high-quality, personally vetted resources. 
            Sign in to unlock powerful search and filtering tools.
          </p>
          
          {/* Newsletter Mention */}
          <div className="mb-8 max-w-xl mx-auto">
            <div className="p-4 rounded-lg border bg-card/50 backdrop-blur-sm">
              <p className="text-sm text-center text-muted-foreground">
                <span className="font-semibold text-foreground">Bonus:</span> Sign up and get access to our{' '}
                <a 
                  href="https://datapecharcha.substack.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  free high-value newsletter
                </a>
                {' '}with curated insights and updates
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              variant="primary"
              size="lg"
              onClick={onSignUp}
              className="w-full sm:w-auto px-8 text-base"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onSignIn}
              className="w-full sm:w-auto px-8 text-base"
            >
              Sign In
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="relative p-6 rounded-lg border bg-card/50 backdrop-blur-sm hover:bg-card transition-colors"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 mx-auto">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* New Resources Card */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative p-4 rounded-lg border bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">New resources added everyday</span> to keep your knowledge base up-to-date
                </p>
              </div>
            </div>
          </div>

          {/* Stats or Additional Info */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>300+ Curated Resources</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Advanced Search & Filters</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Free Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

