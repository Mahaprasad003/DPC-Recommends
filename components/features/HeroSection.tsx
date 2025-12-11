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
      description: 'Search titles, authors, topics, and key takeaways',
    },
    {
      icon: Filter,
      title: 'Smart Filtering',
      description: 'Filter by topic, difficulty, content type, and more',
    },
    {
      icon: BookOpen,
      title: '300+ Resources',
      description: 'A curated library of high-quality technical content',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />

      {/* Aesthetic mesh grid with gradient */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(120, 119, 198, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(120, 119, 198, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)'
        }}
      />

      {/* Gradient overlay on mesh */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(120, 119, 198, 0.15), rgba(147, 51, 234, 0.1), transparent)'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        {/* Main Hero Content */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            Discover Your Next
            <span className="block text-primary mt-1 sm:mt-2">Technical Read</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3 sm:mb-4 px-2">
            Explore 300+ ML, AI, and engineering resources. Personally vetted, beautifully organized, completely free.
          </p>

          {/* Newsletter Mention */}
          <div className="mb-6 sm:mb-8 max-w-xl mx-auto px-2">
            <div className="p-3 sm:p-4 rounded-lg border bg-card/50 backdrop-blur-sm">
              <p className="text-xs sm:text-sm text-center text-muted-foreground">
                <span className="font-semibold text-foreground">Bonus:</span> Get our{' '}
                <a
                  href="https://datapecharcha.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  weekly newsletter
                </a>
                {' '}with curated insights, new resources, and updates
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 sm:mb-12 px-2">
            <Button
              variant="primary"
              size="lg"
              onClick={onSignUp}
              className="w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base h-11 sm:h-12 touch-manipulation"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onSignIn}
              className="w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base h-11 sm:h-12 touch-manipulation"
            >
              Sign In
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 px-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="relative p-4 sm:p-6 rounded-lg border bg-card/50 backdrop-blur-sm hover:bg-card transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 text-primary mb-3 sm:mb-4 mx-auto">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* New Resources Card */}
          <div className="mt-6 sm:mt-8 max-w-xl mx-auto px-2">
            <div className="relative p-3 sm:p-4 rounded-lg border bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">New resources added everyday</span> to keep your knowledge base up-to-date
                </p>
              </div>
            </div>
          </div>

          {/* Stats or Additional Info */}
          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t px-2">
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
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

