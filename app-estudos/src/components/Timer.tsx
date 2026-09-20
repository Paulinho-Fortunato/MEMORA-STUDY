import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { spacing, borderRadius } from '../design-system/tokens';

interface TimerProps {
  initialMinutes: number;
  onComplete?: () => void;
  onElapsed?: (elapsedSeconds: number) => void;
}

export const Timer: React.FC<TimerProps> = ({
  initialMinutes,
  onComplete,
  onElapsed,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setTotalSeconds(initialMinutes * 60);
    setRemainingSeconds(initialMinutes * 60);
  }, [initialMinutes]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          const newTime = prev - 1;
          onElapsed?.(totalSeconds - newTime);
          return newTime;
        });
      }, 1000);
    } else if (remainingSeconds === 0 && isRunning) {
      setIsRunning(false);
      setIsCompleted(true);
      onComplete?.();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds, totalSeconds, onComplete, onElapsed]);

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
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setRemainingSeconds(totalSeconds);
  };

  const circleSize = 280;
  const strokeWidth = 8;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const timerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${spacing.xl}px`,
  };

  const timerDisplayStyle: React.CSSProperties = {
    position: 'relative',
    width: `${circleSize}px`,
    height: `${circleSize}px`,
    marginBottom: `${spacing.xl}px`,
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
  };

  return (
    <div style={timerStyle}>
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
        {!isRunning ? (
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

        {remainingSeconds < totalSeconds && (
          <Button
            onClick={handleReset}
            variant="tertiary"
            icon={<RotateCcw size={20} />}
            size="large"
          />
        )}

        {isCompleted && (
          <Button
            onClick={() => {
              setIsCompleted(false);
              setRemainingSeconds(totalSeconds);
            }}
            variant="primary"
            icon={<Check size={24} />}
            size="large"
          >
            Concluir
          </Button>
        )}
      </div>
    </div>
  );
};
