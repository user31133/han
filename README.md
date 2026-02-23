# Ормон Хан — Биографический сайт / Ormon Khan — Biographical Website

An interactive biographical web application dedicated to **Ormon Khan (1791–1855)**, the first Khan of the Kyrgyz Khanate, unifier of the northern Kyrgyz tribes, and creator of the legal code «Ormon Okuu».

> Интерактивный биографический сайт, посвящённый **Ормон Хану (1791–1855)** — первому хану Кыргызского ханства, объединителю северных племён и создателю свода законов «Ормон Окуу».

---

## Features / Возможности

- **Biography sections** — illustrated sections covering Origins, Historical Context, Rise to Power, Reforms & Laws, Wars & Diplomacy, and Legacy.
- **Interactive Quiz (Викторина)** — a Wheel-of-Fortune-style team quiz with 12 questions about Ormon Khan's life and legacy, supporting up to 3 teams with editable names and scores.
- Fully responsive layout built with CSS Modules.

---

## Tech Stack

| Technology | Version |
|---|---|
| [Next.js](https://nextjs.org) | 16 |
| [React](https://react.dev) | 19 |
| TypeScript | 5 |

---

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other commands

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

---

## Project Structure

```
src/
├── app/
│   ├── data.ts        # Biography content (sections, hero text)
│   ├── quizData.ts    # Quiz questions and answers
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main page
└── components/
    ├── Hero.tsx           # Hero banner component
    ├── Section.tsx        # Biography section component
    ├── QuizGame.tsx       # Quiz game logic and UI
    └── WheelOfFortune.tsx # Animated spin wheel
```

---

## Deploy on Vercel

The easiest way to deploy this app is via the [Vercel Platform](https://vercel.com/new).

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
