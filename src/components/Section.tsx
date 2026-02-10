'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './Section.module.css';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  image?: string;
  isReversed?: boolean; // Prop to control zigzag alignment
  className?: string;
}

export default function Section({ id, title, children, image, isReversed = false, className = '' }: SectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 } // Increased threshold slightly for better trigger point
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`
        ${styles.section} 
        ${isVisible ? styles.visible : ''} 
        ${isReversed ? styles.reversed : ''} 
        ${className}
      `}
    >
      <div className="container">
        <h2 className={styles.sectionTitle}>{title}</h2>
        
        <div className={styles.contentWrapper}>
          <div className={styles.textContent}>
            {children}
          </div>
          
          {image && (
            <div className={styles.imageWrapper}>
              <div className={styles.imageFrame}>
                <Image 
                  src={image} 
                  alt={title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
