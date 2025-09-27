import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AvatarEmoteProps {
  emotion: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animationDuration?: number;
  onAnimationComplete?: () => void;
}

export default function AvatarEmote({
  emotion,
  size = 'md',
  className,
  animationDuration = 2000,
  onAnimationComplete
}: AvatarEmoteProps) {
  const [currentEmotion, setCurrentEmotion] = useState(emotion);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (emotion !== currentEmotion) {
      setIsAnimating(true);
      setCurrentEmotion(emotion);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onAnimationComplete?.();
      }, animationDuration);

      return () => clearTimeout(timer);
    }
  }, [emotion, animationDuration, onAnimationComplete]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div 
      className={cn(
        'relative rounded-full overflow-hidden bg-secondary',
        sizeClasses[size],
        isAnimating && 'animate-bounce',
        className
      )}
    >
      <img
        src="/placeholder.svg"
        alt={`Avatar ${emotion}`}
        className={cn(
          'w-full h-full object-cover',
          isAnimating && 'transition-transform duration-300'
        )}
      />
      <div 
        className={cn(
          'absolute inset-0 flex items-center justify-center text-xs font-medium',
          isAnimating && 'animate-fade-in'
        )}
      >
        {currentEmotion}
      </div>
    </div>
  );
}