import styles from './Hero.module.css';

interface HeroProps {
  title: string;
  subtitle: string;
  years: string;
  description: string;
}

export default function Hero({ title, subtitle, years, description }: HeroProps) {
  return (
    <div className={styles.hero}>
      <div className={styles.overlay} />
      <div className={`container ${styles.content}`}>
        <span className={styles.years}>{years}</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.separator} />
        <p className={styles.description}>{description}</p>
        <a href="#origins" className={styles.scrollIndicator}>
          <span className={styles.arrow}>↓</span>
          <span>Читать биографию</span>
        </a>
      </div>
    </div>
  );
}
