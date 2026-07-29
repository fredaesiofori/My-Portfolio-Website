import React, { useState, useEffect } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate dynamic hue based on scroll percentage (15 = warm red, 45 = gold, 160 = teal, 280 = royal purple)
  const dynamicHue = Math.round(15 + (scrollProgress / 100) * 265);
  const strokeColor = `hsl(${dynamicHue}, 85%, 55%)`;
  const glowColor = `hsl(${dynamicHue}, 85%, 50%)`;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none h-1 sm:h-[5px] bg-black/30 backdrop-blur-xs">
      <div
        className="h-full transition-all duration-150 ease-out relative"
        style={{
          width: `${scrollProgress}%`,
          backgroundColor: strokeColor,
          boxShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`
        }}
      >
        {/* Leading edge glow bead */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transform translate-x-1/2 shadow-lg"
          style={{
            backgroundColor: strokeColor,
            boxShadow: `0 0 8px 2px ${glowColor}`
          }}
        />
      </div>
    </div>
  );
};
