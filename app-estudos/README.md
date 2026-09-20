# 📚 App de Estudos - Sistema de Aprendizagem e Memória

Um aplicativo web completo, moderno e funcional para ajudar estudantes a aprender e memorizar conteúdos utilizando métodos de aprendizagem cientificamente fundamentados.

## ✨ Funcionalidades Implementadas

### 🎯 Principais
- **Disciplinas**: Crie e gerencie suas disciplinas com cores personalizáveis
- **Timer de Estudo**: Sessões Pomodoro com registro automático
- **Revisões Espaçadas**: Sistema SRS (em desenvolvimento)
- **Estatísticas**: Acompanhe seu progresso de estudo
- **Offline-First**: Funciona 100% sem internet após carregamento inicial

### 🧠 Métodos Pedagógicos
- Recuperação Ativa (estrutura pronta)
- Espaçamento (algoritmo SM-2 implementado)
- Intercalação (suporte a múltiplas disciplinas)
- Método Feynman (modelo de dados pronto)
- Elaboração e Conexões (modelo de dados pronto)

### 🎨 Design
- Interface inspirada no design da Apple
- Light/Dark mode automático
- Cor de destaque personalizável
- Tipografia moderna (SF Pro/Inter)
- Ícones profissionais (Lucide React)
- Animações suaves e microinterações

## 🛠️ Tecnologias

- **React 19** + TypeScript
- **Vite** (build tool ultra-rápido)
- **IndexedDB** (armazenamento local via `idb`)
- **Lucide React** (ícones vetoriais)
- **CSS-in-JS** com design system

## 📦 Instalação e Desenvolvimento

```bash
# Instalar dependências
npm install

# Modo de desenvolvimento
npm run dev

# Build production
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## 📱 Estrutura do Projeto

```
app-estudos/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── TabBar.tsx
│   │   └── Timer.tsx
│   ├── context/          # Contexto global
│   │   └── AppContext.tsx
│   ├── design-system/    # Tokens de design
│   │   └── tokens.ts
│   ├── screens/          # Telas principais
│   │   ├── HomeScreen.tsx
│   │   ├── SubjectsScreen.tsx
│   │   └── StudyScreen.tsx
│   ├── storage/          # Camada de dados
│   │   └── database.ts
│   ├── types/            # Tipos TypeScript
│   │   └── index.ts
│   └── utils/            # Helpers
│       └── helpers.ts
├── .github/workflows/    # GitHub Actions
│   └── build.yml
└── dist/                 # Build production-ready
```

## 💾 Armazenamento Local

Todos os dados são armazenados localmente no dispositivo usando IndexedDB:

- `subjects`: Disciplinas
- `topics`: Matérias/conceitos
- `flashcards`: Cartões de revisão
- `sessions`: Histórico de sessões
- `reviews`: Revisões agendadas
- `feynmanNotes`: Notas do método Feynman
- `connections`: Conexões entre conceitos
- `settings`: Preferências do usuário
- `statistics`: Estatísticas

### Backup e Restauração
- Exportação de dados em JSON
- Importação de backup
- Dados persistem após fechar app/reiniciar dispositivo

## 🚀 Deploy com GitHub Actions

O projeto inclui workflow configurado para:

1. Build automático no push para `main`/`master`
2. Upload de artifacts
3. Deploy para GitHub Pages

### Configurar GitHub Pages

1. Acesse Settings > Pages no seu repositório
2. Em "Source", selecione "GitHub Actions"
3. O deploy será automático a cada push

## 📊 Dados Persistidos

O aplicativo salva automaticamente:

- ✅ Disciplinas criadas
- ✅ Sessões de estudo completadas
- ✅ Configurações do usuário
- ✅ Estatísticas de progresso
- ✅ Revisões agendadas

## ⚙️ Personalização

O usuário pode personalizar:

- Tema (claro/escuro/automático)
- Cor de destaque (10 opções)
- Tamanho da fonte (P/M/G)
- Duração das sessões
- Intervalos de revisão
- Notificações
- Horário de estudo

## 🔒 Privacidade

- **Local-First**: Dados ficam no seu dispositivo
- **Zero Analytics**: Nenhum tracker ou coleta de dados
- **Zero Servidor**: Não requer conta ou internet
- **Zero Publicidade**: Experiência limpa e focada

## 📈 Status das Funcionalidades

| Funcionalidade | Status |
|---------------|--------|
| Disciplinas | ✅ Completo |
| Timer de Estudo | ✅ Completo |
| Registro de Sessões | ✅ Completo |
| Estatísticas Básicas | ✅ Completo |
| Design System | ✅ Completo |
| Offline | ✅ Completo |
| Revisões Espaçadas | 🚧 Em desenvolvimento |
| Flashcards UI | 🚧 Em desenvolvimento |
| Método Feynman UI | 🚧 Em desenvolvimento |
| Perfil/Configurações UI | 🚧 Em desenvolvimento |
| Onboarding | 📋 Planejado |
| Notificações Locais | 📋 Planejado |

## 🎯 Como Usar

1. **Criar Disciplinas**: Vá em "Início" ou "Disciplinas" e adicione suas matérias
2. **Estudar**: Use o timer na aba "Estudar" para sessões focadas
3. **Acompanhar**: Veja seu progresso na tela inicial
4. **Revisar**: (em breve) Sistema de revisões espaçadas

## 🧪 Testes

Teste as seguintes funcionalidades:

- [ ] Criar disciplina → fechar app → abrir → disciplina continua
- [ ] Iniciar timer → pausar → continuar → finalizar → sessão registrada
- [ ] Mudar tema claro/escuro
- [ ] Exportar/importar backup
- [ ] Usar sem internet (todas funções principais)
- [ ] Responsividade em diferentes tamanhos de tela

## 📄 Licença

MIT

---

**Desenvolvido com foco em:**
- Simplicidade
- Qualidade
- Consistência
- Velocidade
- Privacidade
