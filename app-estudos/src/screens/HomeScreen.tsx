import React, { useState, useEffect } from 'react';
import { Book, Clock, Calendar, TrendingUp, ChevronRight, Plus } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { getAll, getDB } from '../storage/database';
import { Subject, Review, StudySession } from '../types';
import { formatDate, formatTime } from '../utils/helpers';
import { spacing, borderRadius } from '../design-system/tokens';

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { settings, statistics } = useApp();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [pendingReviews, setPendingReviews] = useState<number>(0);
  const [todaySessions, setTodaySessions] = useState<StudySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allSubjects = await getAll('subjects');
      const allReviews = await getAll('reviews');
      const allSessions = await getAll('sessions');
      
      const now = Date.now();
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const pending = (allReviews as Review[]).filter(r => 
        r.status === 'pending' && r.scheduledDate <= endOfDay.getTime()
      );
      
      const today = (allSessions as StudySession[]).filter(s => 
        s.startTime >= startOfDay.getTime() && s.startTime <= endOfDay.getTime()
      );
      
      setSubjects(allSubjects as Subject[]);
      setPendingReviews(pending.length);
      setTodaySessions(today as StudySession[]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalStudyTimeToday = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const containerStyle: React.CSSProperties = {
    padding: `${spacing.lg}px`,
    paddingBottom: '100px',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: `${spacing.xl}px`,
  };

  const greetingStyle: React.CSSProperties = {
    fontSize: '15px',
    color: 'var(--text-secondary, #86868B)',
    marginBottom: `${spacing.xs}px`,
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: `${spacing.md}px`,
    marginBottom: `${spacing.xl}px`,
  };

  const statCardStyle: React.CSSProperties = {
    padding: `${spacing.lg}px`,
    backgroundColor: 'var(--surface, #FFFFFF)',
    borderRadius: borderRadius.lg,
  };

  const statIconStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: borderRadius.md,
    backgroundColor: 'var(--surface-secondary, #F5F5F7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: `${spacing.sm}px`,
    color: 'var(--accent-color, #007AFF)',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-primary, #1D1D1F)',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: 'var(--text-secondary, #86868B)',
  };

  const subjectListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${spacing.sm}px`,
  };

  const subjectItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: `${spacing.md}px`,
    backgroundColor: 'var(--surface, #FFFFFF)',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    transition: 'background-color 150ms ease',
  };

  const subjectIconStyle: React.CSSProperties = {
    width: '44px',
    height: '44px',
    borderRadius: borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: `${spacing.md}px`,
    color: '#FFFFFF',
  };

  const subjectInfoStyle: React.CSSProperties = {
    flex: 1,
  };

  const subjectNameStyle: React.CSSProperties = {
    fontSize: '17px',
    fontWeight: 600,
    color: 'var(--text-primary, #1D1D1F)',
  };

  const subjectDescStyle: React.CSSProperties = {
    fontSize: '13px',
    color: 'var(--text-secondary, #86868B)',
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <p style={greetingStyle}>{greeting()}, {settings.name || 'Estudante'}</p>
        <h1 style={titleStyle}>Visão Geral</h1>
      </header>

      {/* Estatísticas do Dia */}
      <section style={sectionStyle}>
        <div style={statsGridStyle}>
          <Card padding="none">
            <div style={statCardStyle}>
              <div style={statIconStyle}>
                <Clock size={20} />
              </div>
              <div style={statValueStyle}>{formatTime(totalStudyTimeToday)}</div>
              <div style={statLabelStyle}>Estudado hoje</div>
            </div>
          </Card>
          
          <Card padding="none">
            <div style={statCardStyle}>
              <div style={statIconStyle}>
                <Calendar size={20} />
              </div>
              <div style={statValueStyle}>{pendingReviews}</div>
              <div style={statLabelStyle}>Revisões pendentes</div>
            </div>
          </Card>
          
          <Card padding="none">
            <div style={statCardStyle}>
              <div style={statIconStyle}>
                <Book size={20} />
              </div>
              <div style={statValueStyle}>{subjects.length}</div>
              <div style={statLabelStyle}>Disciplinas</div>
            </div>
          </Card>
          
          <Card padding="none">
            <div style={statCardStyle}>
              <div style={statIconStyle}>
                <TrendingUp size={20} />
              </div>
              <div style={statValueStyle}>{statistics.streak}</div>
              <div style={statLabelStyle}>Dias seguidos</div>
            </div>
          </Card>
        </div>
      </section>

      {/* Disciplinas */}
      <section style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <span>Disciplinas</span>
          <Button
            variant="tertiary"
            size="small"
            icon={<Plus size={18} />}
            onClick={() => onNavigate('subjects')}
          >
            Nova
          </Button>
        </div>
        
        {subjects.length === 0 ? (
          <EmptyState
            icon={<Book size={40} />}
            title="Nenhuma disciplina"
            description="Comece criando sua primeira disciplina para organizar seus estudos."
            action={
              <Button onClick={() => onNavigate('subjects')}>
                Criar disciplina
              </Button>
            }
          />
        ) : (
          <div style={subjectListStyle}>
            {subjects.slice(0, 5).map((subject) => (
              <div
                key={subject.id}
                style={subjectItemStyle}
                onClick={() => onNavigate('subject-detail', { subjectId: subject.id })}
                role="button"
                tabIndex={0}
              >
                <div
                  style={{
                    ...subjectIconStyle,
                    backgroundColor: subject.color,
                  }}
                >
                  <Book size={20} />
                </div>
                <div style={subjectInfoStyle}>
                  <div style={subjectNameStyle}>{subject.name}</div>
                  <div style={subjectDescStyle}>
                    {subject.description || 'Sem descrição'}
                  </div>
                </div>
                <ChevronRight size={20} color="var(--text-secondary)" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Próxima Revisão */}
      {pendingReviews > 0 && (
        <section style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <span>Revisões</span>
          </div>
          <Card
            padding="medium"
            onClick={() => onNavigate('reviews')}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: `${spacing.md}px` }}>
              <div
                style={{
                  ...statIconStyle,
                  backgroundColor: 'var(--warning, #FF9500)',
                  color: '#FFFFFF',
                  marginBottom: 0,
                }}
              >
                <Calendar size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '17px', fontWeight: 600 }}>
                  Você tem {pendingReviews} revisão{pendingReviews > 1 ? 'ões' : ''} para hoje
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Toque para revisar
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-secondary)" />
            </div>
          </Card>
        </section>
      )}
    </div>
  );
};
