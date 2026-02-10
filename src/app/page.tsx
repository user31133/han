'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import QuizGame from '@/components/QuizGame';
import { biographyData } from './data';
import styles from './page.module.css';

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <main className={styles.main}>
      <Hero
        title={biographyData.hero.title}
        subtitle={biographyData.hero.subtitle}
        years={biographyData.hero.years}
        description={biographyData.hero.description}
      />
      
      {biographyData.sections.map((section, index) => (
        <Section 
          key={section.id} 
          id={section.id} 
          title={section.title}
          image={section.image}
          // Reverse layout for odd indices (0 = normal, 1 = reversed, 2 = normal...)
          isReversed={index % 2 !== 0} 
        >
          {section.content.map((paragraph, pIndex) => (
            <p key={pIndex} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </Section>
      ))}

      <footer className={styles.footer}>
        <div className="container">
          <p>© {new Date().getFullYear()} Кыргызское историческое наследие. Памяти Ормон Хана.</p>
        </div>
      </footer>

      <button className={styles.quizButton} onClick={() => setShowQuiz(true)}>
        ✦ ВИКТОРИНА
      </button>

      {showQuiz && <QuizGame onClose={() => setShowQuiz(false)} />}
    </main>
  );
}
