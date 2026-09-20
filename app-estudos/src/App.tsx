import React, { useState } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { SubjectsScreen } from './screens/SubjectsScreen';
import { StudyScreen } from './screens/StudyScreen';
import { TabBar } from './components/TabBar';
import { AppProvider } from './context/AppContext';

type Screen = 'home' | 'study' | 'reviews' | 'profile' | 'subjects' | 'subject-detail';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Screen>('home');

  const handleNavigate = (screen: string, data?: any) => {
    setActiveTab(screen as Screen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as Screen);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'subjects':
        return <SubjectsScreen onNavigate={handleNavigate} />;
      case 'study':
        return <StudyScreen onNavigate={handleNavigate} />;
      case 'reviews':
        return (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Revisões</p>
            <p>Sistema de revisão espaçada em desenvolvimento.</p>
          </div>
        );
      case 'profile':
        return (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Perfil</p>
            <p>Configurações e estatísticas em desenvolvimento.</p>
          </div>
        );
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--background, #FAFAFA)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
        }}
      >
        <main>{renderScreen()}</main>
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </AppProvider>
  );
};

export default App;
