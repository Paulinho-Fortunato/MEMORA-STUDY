import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, BookOpen, Target } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { put } from '../storage/database';
import { Subject, StudySession } from '../types';
import { generateId } from '../utils/helpers';
import { spacing, borderRadius } from '../design-system/tokens';

interface StudyScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export const StudyScreen: React.FC<StudyScreenProps> = ({ onNavigate }) => {
  const { settings, updateStatistics } = useApp();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(settings.sessionDuration * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(settings.sessionDuration * 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [concentration, setConcentration] = useState<number>(3);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isTimerRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (remainingSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setIsCompleted(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, remainingSeconds]);

  const loadSubjects = async () => {
    const db = await import('../storage/database');
    const allSubjects = await db.getAll('subjects');
    setSubjects(allSubjects as Subject[]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  const handleStart = () => {
    if (isCompleted) {
      setRemainingSeconds(totalSeconds);
      setIsCompleted(false);
    }
    setIsTimerRunning(true);
  };

  const handlePause = () => {
    setIsTimerRunning(false);
  };

  const handleReset = () => {
    setIsTimerRunning(false);
    setIsCompleted(false);
    setRemainingSeconds(totalSeconds);
  };

  const handleComplete = async () => {
    const session: StudySession = {
      id: generateId(),
      subjectId: selectedSubject,
      startTime: Date.now() - (totalSeconds * 1000),
      endTime: Date.now(),
      duration: totalSeconds / 60,
      concentration: concentration as 1 | 2 | 3 | 4 | 5,
      notes: notes || undefined,
      createdAt: Date.now(),
    };

    await put('sessions', session);
    
    const stats = await import('../storage/database').then(m => m.getStatistics());
    await updateStatistics({
      sessionsCompleted: stats.sessionsCompleted + 1,
      totalStudyTime: stats.totalStudyTime + (totalSeconds / 60),
    });

    setShowCompletionModal(false);
    setIsCompleted(false);
    setRemainingSeconds(totalSeconds);
    setNotes('');
    setConcentration(3);
  };

  const circleSize = 280;
  const strokeWidth = 8;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const containerStyle: React.CSSProperties = {
    padding: `${spacing.lg}px`,
    paddingBottom: '100px',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: `${spacing.xl}px`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--text-primary, #1D1D1F)',
    margin: 0,
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: `${spacing.xl}px`,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: 'var(--text-primary, #1D1D1F)',
    marginBottom: `${spacing.md}px`,
  };

  const subjectGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: `${spacing.md}px`,
    marginBottom: `${spacing.xl}px`,
  };

  const subjectChipStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: `${spacing.md}px ${spacing.lg}px`,
    backgroundColor: isSelected ? 'var(--accent-color, #007AFF)' : 'var(--surface-secondary, #F5F5F7)',
    color: isSelected ? '#FFFFFF' : 'var(--text-primary, #1D1D1F)',
    borderRadius: borderRadius.full,
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 500,
    transition: 'all 150ms ease',
    textAlign: 'center',
  });

  const timerDisplayStyle: React.CSSProperties = {
    position: 'relative',
    width: `${circleSize}px`,
    height: `${circleSize}px`,
    margin: `${spacing.xxl}px auto`,
  };

  const timeTextStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '56px',
    fontWeight: 700,
    color: 'var(--text-primary, #1D1D1F)',
    fontVariantNumeric: 'tabular-nums',
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${spacing.md}px`,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: `${spacing.xl}px`,
  };

  const concentrationStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${spacing.sm}px`,
    justifyContent: 'center',
    marginTop: `${spacing.lg}px`,
  };

  const concentrationButtonStyle = (level: number): React.CSSProperties => ({
    width: '44px',
    height: '44px',
    borderRadius: borderRadius.md,
    backgroundColor: concentration >= level ? 'var(--accent-color, #007AFF)' : 'var(--surface-secondary, #F5F5F7)',
    color: concentration >= level ? '#FFFFFF' : 'var(--text-secondary, #86868B)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 600,
    transition: 'all 150ms ease',
  });

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Estudar</h1>
      </header>

      {/* Seleção de Disciplina */}
      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>Disciplina (opcional)</div>
        {subjects.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={32} />}
            title="Nenhuma disciplina"
            description="Crie disciplinas para organizar suas sessões de estudo."
            action={
              <Button onClick={() => onNavigate('subjects')} variant="tertiary">
                Criar disciplina
              </Button>
            }
          />
        ) : (
          <div style={subjectGridStyle}>
            <button
              style={subjectChipStyle(!selectedSubject)}
              onClick={() => setSelectedSubject(undefined)}
            >
              Geral
            </button>
            {subjects.map((subject) => (
              <button
                key={subject.id}
                style={subjectChipStyle(selectedSubject === subject.id)}
                onClick={() => setSelectedSubject(subject.id)}
              >
                {subject.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Timer */}
      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>Sessão de Estudo</div>
        <Card padding="large">
          <div style={timerDisplayStyle}>
            <svg
              width={circleSize}
              height={circleSize}
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                fill="none"
                stroke="var(--surface-secondary, #F5F5F7)"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                fill="none"
                stroke="var(--accent-color, #007AFF)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div style={timeTextStyle}>{formatTime(remainingSeconds)}</div>
          </div>

          <div style={controlsStyle}>
            {!isTimerRunning ? (
              <Button
                onClick={handleStart}
                icon={<Play size={24} />}
                size="large"
              >
                {isCompleted ? 'Reiniciar' : remainingSeconds < totalSeconds ? 'Continuar' : 'Iniciar'}
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                variant="secondary"
                icon={<Pause size={24} />}
                size="large"
              >
                Pausar
              </Button>
            )}

            {remainingSeconds < totalSeconds && !isCompleted && (
              <Button
                onClick={handleReset}
                variant="tertiary"
                icon={<RotateCcw size={20} />}
                size="large"
              />
            )}

            {isCompleted && (
              <Button
                onClick={() => setShowCompletionModal(true)}
                variant="primary"
                icon={<Check size={24} />}
                size="large"
              >
                Concluir
              </Button>
            )}
          </div>
        </Card>
      </section>

      {/* Modal de Conclusão */}
      <Modal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        title="Sessão Concluída!"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.lg}px` }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: `${spacing.sm}px` }}>
              Como foi sua concentração?
            </div>
            <div style={concentrationStyle}>
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  style={concentrationButtonStyle(level)}
                  onClick={() => setConcentration(level as 1 | 2 | 3 | 4 | 5)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing.sm}px` }}>
            <label style={{ fontSize: '15px', fontWeight: 500 }}>Notas (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="O que você estudou?"
              rows={4}
              style={{
                width: '100%',
                padding: `${spacing.md}px`,
                borderRadius: borderRadius.md,
                border: '1px solid var(--border, #E5E5EA)',
                backgroundColor: 'var(--surface, #FFFFFF)',
                color: 'var(--text-primary, #1D1D1F)',
                fontSize: '17px',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: `${spacing.md}px` }}>
            <Button variant="secondary" onClick={() => setShowCompletionModal(false)} fullWidth>
              Cancelar
            </Button>
            <Button onClick={handleComplete} fullWidth>
              Salvar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
