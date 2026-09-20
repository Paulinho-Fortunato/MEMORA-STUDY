// Utils helpers

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp));
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) {
    return `${h}h ${m}min`;
  }
  return `${m}min`;
}

export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = timestamp - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days <= 0) return 'Hoje';
  if (days === 1) return 'Amanhã';
  if (days < 7) return `Em ${days} dias`;
  if (days < 30) return `Em ${Math.ceil(days / 7)} semanas`;
  return `Em ${Math.ceil(days / 30)} meses`;
}

export function calculateSM2Interval(
  difficulty: 'easy' | 'medium' | 'hard',
  currentInterval: number,
  easeFactor: number
): { interval: number; easeFactor: number } {
  let newEaseFactor = easeFactor;
  
  if (difficulty === 'easy') {
    newEaseFactor = Math.min(2.5, easeFactor + 0.15);
  } else if (difficulty === 'medium') {
    newEaseFactor = Math.max(1.3, easeFactor - 0.15);
  } else {
    newEaseFactor = Math.max(1.3, easeFactor - 0.3);
  }
  
  let newInterval: number;
  if (difficulty === 'hard') {
    newInterval = 1;
  } else if (currentInterval === 0) {
    newInterval = 1;
  } else if (currentInterval === 1) {
    newInterval = 3;
  } else {
    newInterval = Math.round(currentInterval * newEaseFactor);
  }
  
  return { interval: newInterval, easeFactor: newEaseFactor };
}

export function downloadFile(filename: string, content: string, type: string = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
