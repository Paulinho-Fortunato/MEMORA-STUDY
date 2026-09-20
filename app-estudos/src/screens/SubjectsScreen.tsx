import React, { useState, useEffect } from 'react';
import { Book, Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { getAll, put, deleteItem } from '../storage/database';
import { Subject } from '../types';
import { generateId } from '../utils/helpers';
import { spacing, borderRadius, subjectColors } from '../design-system/tokens';

interface SubjectsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export const SubjectsScreen: React.FC<SubjectsScreenProps> = ({ onNavigate }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', color: subjectColors[0] });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const allSubjects = await getAll('subjects');
    setSubjects(allSubjects as Subject[]);
  };

  const handleOpenModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({ name: subject.name, description: subject.description, color: subject.color });
    } else {
      setEditingSubject(null);
      setFormData({ name: '', description: '', color: subjectColors[0] });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    setFormData({ name: '', description: '', color: subjectColors[0] });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    const now = Date.now();
    
    if (editingSubject) {
      const updated: Subject = {
        ...editingSubject,
        name: formData.name,
        description: formData.description,
        color: formData.color,
        updatedAt: now,
      };
      await put('subjects', updated);
    } else {
      const newSubject: Subject = {
        id: generateId(),
        name: formData.name,
        description: formData.description,
        color: formData.color,
        icon: 'Book',
        createdAt: now,
        updatedAt: now,
      };
      await put('subjects', newSubject);
    }

    handleCloseModal();
    loadSubjects();
  };

  const handleDelete = async (subject: Subject) => {
    if (!confirm(`Excluir "${subject.name}"? Todos os conteúdos desta disciplina também serão excluídos.`)) {
      return;
    }
    await deleteItem('subjects', subject.id);
    loadSubjects();
  };

  const containerStyle: React.CSSProperties = {
    padding: `${spacing.lg}px`,
    paddingBottom: '100px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: `${spacing.xl}px`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--text-primary, #1D1D1F)',
    margin: 0,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: `${spacing.md}px`,
  };

  const subjectCardStyle: React.CSSProperties = {
    padding: `${spacing.lg}px`,
    backgroundColor: 'var(--surface, #FFFFFF)',
    borderRadius: borderRadius.lg,
    cursor: 'pointer',
    transition: 'transform 150ms ease',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: `${spacing.md}px`,
    color: '#FFFFFF',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: '17px',
    fontWeight: 600,
    color: 'var(--text-primary, #1D1D1F)',
    marginBottom: `${spacing.xs}px`,
  };

  const descStyle: React.CSSProperties = {
    fontSize: '13px',
    color: 'var(--text-secondary, #86868B)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const modalContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${spacing.lg}px`,
  };

  const colorGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: `${spacing.sm}px`,
  };

  const colorOptionStyle = (color: string, selected: boolean): React.CSSProperties => ({
    width: '44px',
    height: '44px',
    borderRadius: borderRadius.md,
    backgroundColor: color,
    border: selected ? '3px solid var(--text-primary)' : '3px solid transparent',
    cursor: 'pointer',
    transition: 'transform 150ms ease',
  });

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Disciplinas</h1>
        <Button onClick={() => handleOpenModal()} icon={<Plus size={20} />}>
          Nova
        </Button>
      </header>

      {subjects.length === 0 ? (
        <EmptyState
          icon={<Book size={40} />}
          title="Nenhuma disciplina"
          description="Crie sua primeira disciplina para começar a organizar seus estudos."
          action={
            <Button onClick={() => handleOpenModal()}>
              Criar disciplina
            </Button>
          }
        />
      ) : (
        <div style={gridStyle}>
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              padding="none"
              onClick={() => onNavigate('subject-detail', { subjectId: subject.id })}
            >
              <div style={subjectCardStyle}>
                <div
                  style={{
                    ...iconContainerStyle,
                    backgroundColor: subject.color,
                  }}
                >
                  <Book size={24} />
                </div>
                <div style={nameStyle}>{subject.name}</div>
                <div style={descStyle}>
                  {subject.description || 'Sem descrição'}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSubject ? 'Editar Disciplina' : 'Nova Disciplina'}
      >
        <div style={modalContentStyle}>
          <Input
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Matemática"
          />
          <Input
            label="Descrição"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ex: Álgebra, cálculo, geometria..."
          />
          
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: `${spacing.sm}px` }}>
              Cor
            </div>
            <div style={colorGridStyle}>
              {subjectColors.map((color) => (
                <div
                  key={color}
                  style={colorOptionStyle(color, formData.color === color)}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: `${spacing.md}px`, marginTop: `${spacing.md}px` }}>
            <Button variant="secondary" onClick={handleCloseModal} fullWidth>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} fullWidth disabled={!formData.name.trim()}>
              {editingSubject ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
