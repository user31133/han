'use client';

import { useState, useEffect } from 'react';
import { quizQuestions, Question } from '../app/quizData';
import WheelOfFortune from './WheelOfFortune';
import styles from './QuizGame.module.css';

interface Team {
  id: number;
  name: string;
  score: number;
}

interface QuizGameProps {
  onClose: () => void;
}

type GameState = 'IDLE' | 'SPINNING_QUESTION' | 'QUESTION' | 'ANSWER' | 'SPINNING_POINTS' | 'POINTS_RESULT';

export default function QuizGame({ onClose }: QuizGameProps) {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: 'Команда 1', score: 0 },
    { id: 2, name: 'Команда 2', score: 0 },
    { id: 3, name: 'Команда 3', score: 0 },
  ]);
  const [answeredIds, setAnsweredIds] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [targetRotation, setTargetRotation] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  
  // Wheel Content Logic
  const questionSegments = Array.from({ length: 12 }, (_, i) => i + 1);
  const pointSegments = [100, 200, 300, 500, 100, 200, 300, 500, 100, 200, 300, 500]; // 12 segments to keep geometry
  
  const currentSegments = (gameState === 'SPINNING_POINTS' || gameState === 'POINTS_RESULT' || (gameState === 'ANSWER' && currentQuestion) ) 
    ? pointSegments 
    : questionSegments;

  // Available questions check
  const availableQuestions = quizQuestions.filter(q => !answeredIds.includes(q.id));
  const isGameOver = availableQuestions.length === 0;

  const handleSpinQuestion = () => {
    if (isGameOver) return;

    setGameState('SPINNING_QUESTION');
    
    // Select random AVAILABLE question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    setCurrentQuestion(selectedQuestion);

    spinWheelToId(selectedQuestion.id);
  };

  const handleSpinPoints = () => {
    setGameState('SPINNING_POINTS');
    
    // Select random points from the array
    // We pick a random INDEX from pointSegments (0-11) so we know where to land
    const randomSegmentIndex = Math.floor(Math.random() * pointSegments.length);
    const points = pointSegments[randomSegmentIndex];
    setCurrentPoints(points);
    
    // Spin to that index (1-based ID for logic consistency)
    spinWheelToId(randomSegmentIndex + 1);
  };

  const spinWheelToId = (targetId: number) => {
    // Logic similar to before, but generic for 12 segments
    const sectorAngle = 360 / 12;
    const sectorIndex = targetId - 1;
    const sectorCenter = sectorIndex * sectorAngle + (sectorAngle / 2); 
    
    const randomSpins = 5 + Math.floor(Math.random() * 3); 
    const baseTarget = -sectorCenter;
    const nextRotation = targetRotation + (360 * randomSpins) + (360 - (targetRotation % 360)) + baseTarget;
    
    setTargetRotation(Math.abs(nextRotation));
  };

  const handleSpinEnd = () => {
    if (gameState === 'SPINNING_QUESTION') {
      setGameState('QUESTION');
    } else if (gameState === 'SPINNING_POINTS') {
      setGameState('POINTS_RESULT');
    }
  };

  const handleRevealAnswer = () => {
    setGameState('ANSWER');
  };

  const handleAddPoints = (teamId: number) => {
    setTeams(teams.map(t => 
      t.id === teamId ? { ...t, score: t.score + currentPoints } : t
    ));
    
    if (currentQuestion) {
      setAnsweredIds([...answeredIds, currentQuestion.id]);
    }
    setGameState('IDLE');
    setCurrentQuestion(null);
    setCurrentPoints(0);
  };

  const updateTeamName = (id: number, newName: string) => {
    setTeams(teams.map(t => t.id === id ? { ...t, name: newName } : t));
  };

  const handleIncorrectAnswer = () => {
    if (currentQuestion) {
      setAnsweredIds([...answeredIds, currentQuestion.id]);
    }
    setGameState('IDLE');
    setCurrentQuestion(null);
    setCurrentPoints(0);
  };

  const updateTeamScore = (id: number, newScoreStr: string) => {
    const newScore = parseInt(newScoreStr, 10);
    if (!isNaN(newScore)) {
      setTeams(teams.map(t => t.id === id ? { ...t, score: newScore } : t));
    } else {
      // If invalid input, force re-render to show original score (react quirk with contentEditable)
      // simplified: just don't update state, but we might need to reset the text content if user typed garbage.
      // For now, let's just accept valid numbers.
      const team = teams.find(t => t.id === id);
      if (team && e.currentTarget) {
          e.currentTarget.textContent = team.score.toString();
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <button className={styles.closeButton} onClick={onClose}>×</button>

      <div className={styles.gameArea}>
        {/* Wheel Section */}
        <div style={{ opacity: (gameState === 'QUESTION' || gameState === 'ANSWER') ? 0.5 : 1, transition: 'opacity 0.5s' }}>
           <WheelOfFortune 
            isSpinning={gameState === 'SPINNING_QUESTION' || gameState === 'SPINNING_POINTS'} 
            targetRotation={targetRotation}
            onSpinEnd={handleSpinEnd}
            segments={currentSegments}
            variant={(gameState === 'SPINNING_POINTS' || gameState === 'POINTS_RESULT' || (gameState === 'ANSWER' && currentQuestion)) ? 'points' : 'question'}
          />
        </div>

        {/* CONTROLS */}
        
        {gameState === 'IDLE' && !isGameOver && (
          <button className={styles.spinButton} onClick={handleSpinQuestion}>
            КРУТИТЬ ВОПРОС
          </button>
        )}

        {isGameOver && (
          <div className={styles.questionCard}>
            <h2>Викторина окончена!</h2>
            <p>Спасибо за участие.</p>
          </div>
        )}

        {/* GAME CARDS */}
        
        {/* Phase 1: Question Reveal */}
        {gameState === 'QUESTION' && currentQuestion && (
           <div className={styles.questionCard}>
            <p className={styles.questionText}>Вопрос #{currentQuestion.id}: {currentQuestion.question}</p>
            <button className={styles.revealButton} onClick={handleRevealAnswer}>
              Показать ответ
            </button>
          </div>
        )}

        {/* Phase 2: Answer Revealed -> Decision: Correct or Incorrect */}
        {gameState === 'ANSWER' && currentQuestion && (
           <div className={styles.questionCard}>
            <p className={styles.questionText}>{currentQuestion.question}</p>
            <div className={styles.answerText}>
              <strong>Ответ:</strong> {currentQuestion.answer}
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
               <button 
                 className={styles.spinButton} 
                 onClick={handleSpinPoints} 
                 style={{ fontSize: '1rem', marginTop: '1rem', background: 'var(--color-accent)' }}
               >
                  ВЕРНО (КРУТИТЬ НА ОЧКИ)
               </button>
               <button 
                 className={styles.spinButton} 
                 onClick={handleIncorrectAnswer} 
                 style={{ fontSize: '1rem', marginTop: '1rem', background: '#333', color: '#fff', boxShadow: 'none' }}
               >
                  НЕВЕРНО (СЛЕДУЮЩИЙ)
               </button>
            </div>
          </div>
        )}

        {/* Phase 3: Points Result -> Award */}
        {(gameState === 'SPINNING_POINTS' || gameState === 'POINTS_RESULT') && (
           <div className={styles.questionCard}>
             <h3>Разыгрываем очки...</h3>
             {gameState === 'POINTS_RESULT' && (
               <div style={{ animation: 'fadeIn 0.5s' }}>
                 <div style={{ fontSize: '3rem', color: 'gold', fontWeight: 'bold', margin: '1rem 0' }}>
                   {currentPoints}
                 </div>
                 <p>Выберите команду для начисления:</p>
               </div>
             )}
           </div>
        )}

        {/* TEAMS */}
        <div className={styles.teamsContainer}>
          {teams.map(team => (
            <div key={team.id} className={styles.teamCard}>
              <div 
                contentEditable 
                suppressContentEditableWarning
                className={styles.teamName}
                onBlur={(e) => updateTeamName(team.id, e.currentTarget.textContent || `Команда ${team.id}`)}
              >
                {team.name}
              </div>
              <div 
                contentEditable
                suppressContentEditableWarning
                className={styles.teamScore}
                onBlur={(e) => updateTeamScore(team.id, e.currentTarget.textContent || '0')}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.currentTarget.blur();
                    }
                }}
              >
                {team.score}
              </div>
              <button 
                className={styles.addScoreButton}
                disabled={gameState !== 'POINTS_RESULT'}
                onClick={() => handleAddPoints(team.id)}
              >
                + {gameState === 'POINTS_RESULT' ? currentPoints : ''}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
