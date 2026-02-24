'use client';

import { useEffect, useRef, useState, CSSProperties, ReactNode } from 'react';

interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

const ScrambledText = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '!#@$%&*()_+-=[]{}|;:,.<>?',
  className = '',
  style = {},
  children
}: ScrambledTextProps) => {
  const [displayText, setDisplayText] = useState<string>(children?.toString() || '');
  const originalText = children?.toString() || '';
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(prev => 
        originalText
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join("")
      );

      if (iteration >= originalText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / speed;
    }, 30);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Only trigger if we aren't already scrambling
    if (!intervalRef.current) {
        scramble();
    }
  };

  useEffect(() => {
    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      className={className}
      style={style}
      onPointerMove={handlePointerMove}
    >
      <p>{displayText}</p>
    </div>
  );
};

export default ScrambledText;
