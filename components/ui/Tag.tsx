import React from 'react';
import { Badge } from './Badge';
import { cn } from '@/lib/utils/cn';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'topic' | 'difficulty';
}

export const Tag: React.FC<TagProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-muted text-muted-foreground',
    topic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    difficulty: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };
  
  return (
    <Badge
      variant="outline"
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Badge>
  );
};

