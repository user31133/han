'use client';

import { useState, useEffect } from 'react';
import styles from './QuizGame.module.css';

interface WheelProps {
  onSpinEnd: () => void;
  isSpinning: boolean;
  targetRotation: number;
  segments: (string | number)[]; 
  variant?: 'question' | 'points'; // New prop
}

export default function WheelOfFortune({ onSpinEnd, isSpinning, targetRotation, segments, variant = 'question' }: WheelProps) {
  const [currentRotation, setCurrentRotation] = useState(0);

  useEffect(() => {
    if (isSpinning) {
      setCurrentRotation(targetRotation);
    }
  }, [isSpinning, targetRotation]);

  const sectorAngle = 360 / segments.length;

  // Handler for transition end to notify parent
  const handleTransitionEnd = () => {
    if (isSpinning) {
      onSpinEnd();
    }
  };

  return (
    <div className={styles.wheelContainer}>
      <div className={styles.pointer}>▼</div>
      <div 
        className={styles.wheel}
        style={{ 
          transform: `rotate(${currentRotation}deg)`,
          transition: isSpinning ? 'transform 10s cubic-bezier(0.1, 0.9, 0.1, 1)' : 'none'
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {segments.map((segment, index) => (
          <div 
            key={index} 
            className={styles.sector}
            style={{ 
              transform: `rotate(${index * sectorAngle + (sectorAngle / 2)}deg)`,
            }}
          >
            <span 
              className={styles.sectorNumber} 
              style={{ 
                // Context-sensitive styling
                transform: variant === 'question' 
                  ? `translateX(-50%) rotate(-${index * sectorAngle + (sectorAngle / 2)}deg)` // Upright for 1-12
                  : `translateX(-50%)`, // Tangential for 100-500
                width: '60px', 
                textAlign: 'center',
                paddingTop: variant === 'question' ? '10px' : '0' // Adjust spacing
              }}
            >
              {segment}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
