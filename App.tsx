
import React, { useState, useEffect } from 'react';
import { House, ClipboardList, Plus, Scale, User, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ViewState, Recipe, CustomCategory } from './types.ts';
import { TabButton } from './components/TabButton.tsx';
import { AddRecipeModal } from './components/AddRecipeModal.tsx';
import { HomeView } from './views/HomeView.tsx';
import { RecipeBookView } from './views/RecipeBookView.tsx';
import { ConverterView } from './views/ConverterView.tsx';
import { RecipeDetailView } from './views/RecipeDetailView.tsx';
import { ManualRecipeView } from './views/ManualRecipeView.tsx';
import { ProfileView } from './views/ProfileView.tsx';
import { AccountDetailsView } from './views/AccountDetailsView.tsx';
import { AppearanceView, ThemeMode } from './views/AppearanceView.tsx';
import { SettingsView } from './views/SettingsView.tsx';
import { AddUrlView } from './views/AddUrlView.tsx';
import { ScanView } from './views/ScanView.tsx';
import { ScanPreviewView } from './views/ScanPreviewView.tsx';
import { AuthView } from './views/AuthView.tsx';
import { Logo } from './components/Logo.tsx';
import { DoodleLogo } from './components/DoodleLogo.tsx';
import { supabase, fetchUserRecipes, updateFavoriteStatus, getUserProfile, saveRecipe, updateUserProfile, signInWithGoogle } from './services/supabaseService.ts';
import { parseRecipeFromUrl, scanRecipeFromImage } from './services/geminiService.ts';

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'sample-carrot-cake',
    title: 'BOLO DE CENOURA COM CHOCOLATE',
    category: 'DOCE',
    prepTime: '20',
    cookTime: '40',
    servings: '12',
    ingredients: [
      '3 cenouras médias picadas',
      '3 ovos',
      '1 xícara de óleo',
      '2 xícaras de açúcar',
      '2 xícaras de farinha de trigo',
      '1 colher (sopa) de fermento químico',
      'Cobertura: 1 xícara de chocolate em pó',
      'Cobertura: 1 xícara de açúcar',
      'Cobertura: 1 colher (sopa) de manteiga'
    ],
    instructions: [
      'Bata no liquidificador as cenouras, os ovos e o óleo até ficar homogêneo.',
      'Em uma tigela, misture o açúcar e a farinha de trigo peneirada.',
      'Despeje a mistura do liquidificador na tigela e mexa bem.',
      'Adicione o fermento e misture delicadamente.',
      'Asse em forno preaquecido a 180°C por aproximadamente 40 minutos.',
      'Para a calda: misture os ingredientes da cobertura no fogo até engrossar e despeje sobre o bolo quente.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800',
    isFavorite: true
  },
  {
    id: 'sample-quiche',
    title: 'QUICHE DE ALHO PORÓ',
    category: 'SALGADO',
    prepTime: '30',
    cookTime: '45',
    servings: '8',
    ingredients: [
      '2 xícaras de farinha de trigo',
      '150g de manteiga gelada',
      '1 ovo',
      'Sal a gosto',
      '3 talos de alho poró fatiados',
      '3 ovos (recheio)',
      '1 caixa de creme de leite',
      '150g de queijo gruyère ou muçarela ralado'
    ],
    instructions: [
      'Misture a farinha, a manteiga, o ovo e o sal até formar uma massa homogênea.',
      'Forre o fundo e as laterais de uma forma e leve à geladeira por 15 minutos.',
      'Refogue o alho poró na manteiga até murchar.',
      'Em uma tigela, bata os ovos com o creme de leite e o queijo.',
      'Coloque o alho poró sobre a massa e cubra com a mistura líquida.',
      'Asse em forno médio (180°C) por cerca de 40 minutos ou até dourar.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=800',
    isFavorite: false
  },
  {
    id: 'sample-pao-queijo',
    title: 'PÃO DE QUEIJO TRADICIONAL',
    category: 'PANIFICACAO',
    prepTime: '15',
    cookTime: '25',
    servings: '20 unidades',
    ingredients: [
      '500g de polvilho doce',
      '300ml de leite',
      '100ml de óleo',
      '2 ovos',
      '200g de queijo canastra ou parmesão ralado',
      '1 colher (sopa) rasa de sal'
    ],
    instructions: [
      'Ferva o leite, o óleo e o sal.',
      'Escalde o polvilho com a mistura fervente e mexa bem.',
      'Espere esfriar um pouco e adicione os ovos e o queijo.',
      'Sove a massa até ficar lisa e não grudar nas mãos.',
      'Faça bolinhas e coloque em uma assadeira.',
      'Leve ao forno preaquecido a 200°C por cerca de 25 minutos.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1598142919323-0133973685e1?auto=format&fit=crop&q=80&w=800',
    isFavorite: false
  },
  {
    id: 'sample-pink-lemonade',
    title: 'PINK LEMONADE REFRESCANTE',
    category: 'BEBIDA',
    prepTime: '10',
    cookTime: '0',
    servings: '2 copos',
    ingredients: [
      'Suco de 2 limões sicilianos',
      '500ml de água com gás ou natural',
      '2 colheres (sopa) de calda de frutas vermelhas ou grenadine',
      'Gelo a gosto',
      'Folhas de hortelã para decorar',
      'Açúcar ou adoçante a gosto'
    ],
    instructions: [
      'Esprema os limões e misture o suco com a água.',
      'Adicione a calda de frutas vermelhas para dar a cor rosa.',
      'Adoce a gosto e misture bem.',
      'Encha os copos com gelo e despeje a limonada.',
      'Decore com rodelas de limão e hortelã.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    isFavorite: false
  },
  {
    id: 'sample-overnight-oats',
    title: 'OVERNIGHT OATS DE CHIA',
    category: 'FIT',
    prepTime: '5',
    cookTime: '0 (esperar pernoite)',
    servings: '1 porção',
    ingredients: [
      '1/2 xícara de aveia em flocos',
      '1 colher (sopa) de sementes de chia',
      '170g de iogurte natural desnatado',
      '1/2 xícara de leite de amêndoas ou desnatado',
      'Frutas vermelhas (morango, mirtilo) para o topo',
      '1 colher (chá) de mel ou agave'
    ],
    instructions: [
      'Em um pote de vidro, misture a aveia, a chia, o iogurte e o leite.',
      'Adicione o mel e misture bem até ficar homogêneo.',
      'Tampe o pote e leve à geladeira por pelo menos 4 horas (idealmente durante a noite).',
      'Na hora de servir, adicione as frutas frescas por cima.',
      'Consuma gelado.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1506084868730-342b1f852e0d?auto=format&fit=crop&q=80&w=800',
    isFavorite: true
  }
];

const MagicLoading = ({ message }: { message: string }) => (
  <div className="fixed inset-0 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md z-[200] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-full animate-ping scale-150 opacity-20" />
      <div className="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center relative shadow-2xl">
        <Sparkles className="text-white dark:text-black animate-pulse" size={32} />
      </div>
    </div>
    <h3 className="font-amatic text-[32px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">
      Criando Mágica...
    </h3>
    <p className="text-gray-400 font-sans text-[14px] text-center max-w-[240px] leading-relaxed">
      {message}
    </p>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [session, setSession] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(true); // Default to guest/local for personal use
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const [importedRecipe, setImportedRecipe] = useState<Recipe | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [hiddenCategories, setHiddenCategories] = useState<string[]>([]);

  // App Settings State
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem('app_theme') as ThemeMode) || 'light');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('app_accent') || '#bd715d');
  const [language, setLanguage] = useState(() => localStorage.getItem('app_lang') || 'pt-BR');
  const [country, setCountry] = useState(() => localStorage.getItem('app_country') || 'BR');
  const [units, setUnits] = useState(() => localStorage.getItem('app_units') || 'metric');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Meu Caderno',
    email: '',
    username: 'receitas',
    birthDate: '',
    gender: '',
    location: '',
    photo: ''
  });

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Apply Accent Color
  useEffect(() => {
    document.documentElement.style.setProperty('--brand-secondary', accentColor);
    localStorage.setItem('app_accent', accentColor);
  }, [accentColor]);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setIsGuest(false);
        loadUserData(session);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setIsGuest(false);
        loadUserData(session);
      } else {
        setIsGuest(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (currentSession: any) => {
    if (!currentSession?.user) return;
    const userId = currentSession.user.id;
    
    setIsSyncing(true);
    try {
      const [profile, userRecipes] = await Promise.all([
        getUserProfile(userId),
        fetchUserRecipes(userId)
      ]);
      
      if (profile) {
        setUserProfile({
          name: profile.name || 'Meu Caderno',
          email: currentSession.user.email || '',
          username: profile.username || 'receitas',
          birthDate: profile.birth_date || '',
          gender: profile.gender || '',
          location: profile.location || '',
          photo: profile.photo_url || ''
        });
      } else {
        // Fallback for new users
        setUserProfile(prev => ({
          ...prev,
          email: currentSession.user.email || ''
        }));
      }
      
      if (userRecipes && userRecipes.length > 0) {
        setRecipes(userRecipes);
      }
    } catch (err) {
      console.error("Error loading user data:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync Data (Local fallback)
  useEffect(() => {
    if (isGuest) {
      const loadData = async () => {
        setIsSyncing(true);
        const savedRecipes = localStorage.getItem('local_recipes');
        setRecipes(savedRecipes ? JSON.parse(savedRecipes) : SAMPLE_RECIPES);
        const savedProfile = localStorage.getItem('local_profile');
        if (savedProfile) setUserProfile(JSON.parse(savedProfile));
        const savedCategories = localStorage.getItem('custom_categories');
        if (savedCategories) setCustomCategories(JSON.parse(savedCategories));
        const savedHidden = localStorage.getItem('hidden_categories');
        if (savedHidden) setHiddenCategories(JSON.parse(savedHidden));
        setIsSyncing(false);
      };
      loadData();
    }
  }, [isGuest]);

  // Splash Screen Timer
  useEffect(() => {
    if (view === 'landing') {
      const timer = setTimeout(() => {
        setView('home');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleToggleFavorite = async (recipeId: string) => {
    const r = recipes.find(r => r.id === recipeId);
    if (!r) return;
    const newStatus = !r.isFavorite;
    
    const updatedRecipes = recipes.map(recipe => recipe.id === recipeId ? { ...recipe, isFavorite: newStatus } : recipe);
    setRecipes(updatedRecipes);
    
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe({ ...selectedRecipe, isFavorite: newStatus });
    }
    
    // Save locally
    localStorage.setItem('local_recipes', JSON.stringify(updatedRecipes));
  };

  const handleImportUrl = async (url: string) => {
    setIsImporting(true);
    setImportMessage(t('Analisando o link e extraindo ingredientes...'));
    try {
      const recipe = await parseRecipeFromUrl(url);
      if (recipe) {
        setImportedRecipe(recipe);
        setView('preview-url');
      } else {
        alert(t("Não conseguimos extrair a receita. Tente colar o texto manualmente."));
      }
    } catch (err) {
      console.error(err);
      alert(t("Erro ao importar. Verifique o link."));
    } finally {
      setIsImporting(false);
    }
  };

  const handleProcessImage = async (rotatedImageUrl?: string) => {
    const imgToProcess = rotatedImageUrl || capturedImage;
    if (!imgToProcess) return;
    setIsImporting(true);
    setImportMessage(t('Digitalizando a foto com inteligência artificial...'));
    try {
      const base64Data = imgToProcess.split(',')[1];
      const recipe = await scanRecipeFromImage(base64Data);
      if (recipe) {
        setImportedRecipe({ ...recipe, imageUrl: imgToProcess });
        setView('preview-url');
      } else {
        alert(t("Não conseguimos ler a imagem. Tente uma foto mais nítida."));
      }
    } catch (err) {
      console.error(err);
      alert(t("Erro ao processar imagem."));
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveRecipe = async (recipeData: Omit<Recipe, 'id'>) => {
    setIsSyncing(true);
    try {
      const isEditing = selectedRecipe && (view === 'edit-manual');
      let updatedList: Recipe[];

      if (isEditing) {
        const editedRecipe = { ...recipeData, id: selectedRecipe!.id };
        updatedList = recipes.map(r => r.id === editedRecipe.id ? editedRecipe : r);
      } else {
        const newRecipe = { ...recipeData, id: crypto.randomUUID() };
        updatedList = [newRecipe, ...recipes.filter(r => r.id.startsWith('sample-') === false || r.id === 'sample-carrot-cake')];
        // Note: filtered logic adjusted to maintain one main sample if list was empty
      }
      
      setRecipes(updatedList);
      localStorage.setItem('local_recipes', JSON.stringify(updatedList));
      
      setToastMessage(t('Receita salva com sucesso!'));
      setTimeout(() => {
        setToastMessage(null);
        setView('book');
        setSelectedRecipe(null);
      }, 1500);
    } catch (err) { 
      console.error(err);
      alert(t("Erro ao salvar a receita."));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveProfile = async (data: any) => {
    setUserProfile(data);
    localStorage.setItem('local_profile', JSON.stringify(data));
  };

  const handleDeleteRecipe = (recipeId: string) => {
    const updatedList = recipes.filter(r => r.id !== recipeId);
    setRecipes(updatedList);
    localStorage.setItem('local_recipes', JSON.stringify(updatedList));
    setSelectedRecipe(null);
    setView('book');
  };

  const handleAddCustomCategory = (label: string) => {
    const newCategory: CustomCategory = {
      id: label.toUpperCase().replace(/\s+/g, '_'),
      label
    };
    const updatedCategories = [...customCategories, newCategory];
    setCustomCategories(updatedCategories);
    localStorage.setItem('custom_categories', JSON.stringify(updatedCategories));
  };

  const handleDeleteCategory = (id: string) => {
    if (customCategories.some(c => c.id === id)) {
      const updated = customCategories.filter(c => c.id !== id);
      setCustomCategories(updated);
      localStorage.setItem('custom_categories', JSON.stringify(updated));
    } else {
      const updated = [...hiddenCategories, id];
      setHiddenCategories(updated);
      localStorage.setItem('hidden_categories', JSON.stringify(updated));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      alert(t("Erro ao entrar com Google."));
    }
  };

  const renderContent = () => {
    if (selectedRecipe && !['edit-manual'].includes(view)) {
      return (
        <RecipeDetailView 
          recipe={selectedRecipe} 
          onBack={() => setSelectedRecipe(null)} 
          onToggleFavorite={() => handleToggleFavorite(selectedRecipe.id)} 
          onEdit={() => setView('edit-manual')} 
          onDelete={() => handleDeleteRecipe(selectedRecipe.id)}
        />
      );
    }

    switch (view) {
      case 'home': return <HomeView recipes={recipes} onSelectRecipe={setSelectedRecipe} />;
      case 'book': return <RecipeBookView recipes={recipes} onSelectRecipe={setSelectedRecipe} onToggleFavorite={handleToggleFavorite} customCategories={customCategories} hiddenCategories={hiddenCategories} onAddCategory={handleAddCustomCategory} onDeleteCategory={handleDeleteCategory} />;
      case 'converter': return <ConverterView />;
      case 'account': return (
        <ProfileView 
          recipes={recipes} 
          isGuest={true} 
          userName={userProfile.name} 
          userPhoto={userProfile.photo} 
          userHandle={userProfile.username} 
          onNavigateToDetails={() => setView('account-details')} 
          onNavigateToAppearance={() => setView('appearance')} 
          onNavigateToSettings={() => setView('settings')} 
          onLogout={() => {}} 
          onUpdateProfile={() => {}} 
        />
      );
      case 'add-manual': return <ManualRecipeView onSave={handleSaveRecipe} onBack={() => setView('home')} customCategories={customCategories} />;
      case 'add-url': return <AddUrlView onConfirm={handleImportUrl} onBack={() => setView('home')} isLoading={isImporting} />;
      case 'scan': return <ScanView onBack={() => setView('home')} onImageCaptured={(img) => { setCapturedImage(img); setView('scan-preview'); }} />;
      case 'scan-preview': return capturedImage ? <ScanPreviewView imageUrl={capturedImage} onConfirm={handleProcessImage} onDiscard={() => { setCapturedImage(null); setView('scan'); }} onRetake={() => setView('scan')} /> : null;
      case 'preview-url': return importedRecipe ? <ManualRecipeView initialRecipe={importedRecipe} onSave={handleSaveRecipe} onBack={() => setView('home')} isPreview customCategories={customCategories} /> : null;
      case 'edit-manual': return selectedRecipe ? <ManualRecipeView initialRecipe={selectedRecipe} onSave={handleSaveRecipe} onBack={() => setView('home')} customCategories={customCategories} /> : null;
      case 'account-details': return <AccountDetailsView initialData={userProfile} isLoggedIn={true} onSave={handleSaveProfile} onBack={() => setView('account')} onGoogleLogin={handleGoogleLogin} onAppleLogin={() => {}} onEmailLogin={() => setView('auth-email')} onLogout={() => setView('account')} onDeleteAccount={() => setView('account')} />;
      case 'auth-email': return (
        <AuthView 
          onLoginSuccess={() => setView('account')} 
          onContinueAsGuest={() => setView('account')} 
          onBack={() => setView('account-details')}
        />
      );
      case 'appearance': return <AppearanceView currentTheme={theme} onThemeChange={setTheme} currentColor={accentColor} onColorChange={setAccentColor} onBack={() => setView('account')} onSave={() => {}} />;
      case 'settings': return <SettingsView language={language} onLanguageChange={(l) => { setLanguage(l); localStorage.setItem('app_lang', l); }} units={units} onUnitsChange={(u) => { setUnits(u); localStorage.setItem('app_units', u); }} onBack={() => setView('account')} onSave={() => {}} />;
      default: return <HomeView recipes={recipes} onSelectRecipe={setSelectedRecipe} />;
    }
  };

  if (view === 'landing') {
    return (
      <div className="fixed inset-0 bg-[#f9f9f9] flex flex-col items-center justify-center animate-in fade-in duration-700">
        <DoodleLogo size="lg" />
      </div>
    );
  }

  const showBottomNav = !selectedRecipe && !['edit-manual', 'account-details', 'appearance', 'settings', 'add-url', 'preview-url', 'scan', 'scan-preview', 'auth-email'].includes(view);

  return (
    <div className="w-full min-h-screen bg-[#f7f7f7] dark:bg-[#0a0a0a] font-sans text-black dark:text-white overflow-x-hidden">
      {isSyncing && (
        <div className="fixed top-4 right-4 z-50">
          <Loader2 className="animate-spin text-black dark:text-white opacity-40" size={20} />
        </div>
      )}

      {isImporting && <MagicLoading message={importMessage} />}

      <main className={showBottomNav ? 'pb-16' : ''}>
        {renderContent()}
      </main>

      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#121212] h-14 flex items-center justify-around z-40 px-2 border-t border-gray-100 dark:border-white/5">
          <TabButton icon={<House />} active={view === 'home'} onClick={() => setView('home')} />
          <TabButton icon={<ClipboardList />} active={view === 'book'} onClick={() => setView('book')} />
          <TabButton icon={<Plus />} active={false} onClick={() => setShowAddModal(true)} special />
          <TabButton icon={<Scale />} active={view === 'converter'} onClick={() => setView('converter')} />
          <TabButton icon={<User />} active={view === 'account'} onClick={() => setView('account')} />
        </nav>
      )}

      {showAddModal && (
        <AddRecipeModal 
          onClose={() => setShowAddModal(false)} 
          onSelectMethod={(method) => {
            setShowAddModal(false);
            if (method === 'MANUAL') setView('add-manual');
            if (method === 'URL') setView('add-url');
            if (method === 'SCAN') setView('scan');
          }} 
        />
      )}

      {toastMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] pointer-events-none">
          <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full shadow-xl animate-in fade-in zoom-in duration-300 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-brand-secondary" />
            <span className="font-mooli text-[13px] font-normal">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
