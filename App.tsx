
import React, { useState, useEffect, useRef } from 'react';
import { House, ClipboardList, Plus, Scale, User, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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
import { ManageCategoriesView } from './views/ManageCategoriesView.tsx';
import { PrivacyPolicyView } from './views/PrivacyPolicyView.tsx';
import { TermsOfServiceView } from './views/TermsOfServiceView.tsx';
import { DoodleLogo } from './components/DoodleLogo.tsx';
import { isSupabaseConfigured, supabase, fetchUserRecipes, getProfile, saveRecipeToDb, deleteRecipeFromDb, updateUserSettings, updateUserProfile, signOut, signInWithGoogle } from './services/supabaseService.ts';
import { parseRecipeFromUrl, scanRecipeFromImage } from './services/geminiService.ts';
import { User as SupabaseUser } from '@supabase/supabase-js';

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'sample-carrot-cake',
    title: 'BOLO DE CENOURA COM CHOCOLATE',
    category: 'SOBREMESAS',
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
    category: 'APERITIVOS',
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
    category: 'OUTROS',
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


const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const viewRef = useRef<ViewState>(view);
  useEffect(() => { viewRef.current = view; }, [view]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [isGuest, setIsGuest] = useState(true); 
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isScanReady, setIsScanReady] = useState(false);
  const [importedRecipe, setImportedRecipe] = useState<Recipe | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('signup');
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [hiddenCategories, setHiddenCategories] = useState<string[]>([]);
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [categoryOverrides, setCategoryOverrides] = useState<Record<string, { label?: string; iconName?: string }>>({});

  // App Settings State
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem('app_theme') as ThemeMode) || 'light');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('app_accent') || '#bd715d');
  const [language, setLanguage] = useState(() => localStorage.getItem('app_lang') || 'pt-BR');
  const [units, setUnits] = useState(() => localStorage.getItem('app_units') || 'metric');
  const [showMainCategories, setShowMainCategories] = useState(() => localStorage.getItem('show_main_categories') !== 'false');
  const [showSecondaryCategories, setShowSecondaryCategories] = useState(() => localStorage.getItem('show_secondary_categories') !== 'false');
  const [hideRecipeMetadata, setHideRecipeMetadata] = useState(() => localStorage.getItem('hide_recipe_metadata') === 'true');
  const [hideRecipeCount, setHideRecipeCount] = useState(() => localStorage.getItem('hide_recipe_count') === 'true');
  const [usePhotosForCategories, setUsePhotosForCategories] = useState(() => localStorage.getItem('use_photos_for_categories') === 'true');
  const [categoryPhotos, setCategoryPhotos] = useState<Record<string, string | { url: string; isDark: boolean; isTransparent?: boolean }>>(() => JSON.parse(localStorage.getItem('category_photos') || '{}'));
  const [keepScreenOn, setKeepScreenOn] = useState(() => localStorage.getItem('keep_screen_on') === 'true');
  const [categoryFontSize, setCategoryFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('category_font_size');
    const parsed = parseInt(saved || '11', 10);
    const value = isNaN(parsed) ? 11 : parsed;
    return Math.min(Math.max(value, 9), 13);
  });
  const { t, i18n } = useTranslation();

  // Wake Lock for Recipe Detail View
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let wakeLock: any = null;
    
    const requestWakeLock = async () => {
      if (keepScreenOn && selectedRecipe && 'wakeLock' in navigator) {
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err: unknown) {
          // Suppress NotAllowedError which happens in iframes without permission
          const error = err as Error;
          if (error.name !== 'NotAllowedError' && !error.message?.includes('disallowed by permissions policy')) {
            console.error('Wake Lock error:', error);
          }
        }
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock !== null) {
        wakeLock.release().then(() => {
          wakeLock = null;
        });
      }
    };
  }, [keepScreenOn, selectedRecipe]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Fulano da Silva',
    email: '',
    username: 'meu_usuario',
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
    
    if (currentUser) {
      updateUserSettings(currentUser.id, {
        accentColor,
        theme,
        language,
        units,
        showMainCategories,
        showSecondaryCategories,
        hideRecipeMetadata,
        hideRecipeCount,
        usePhotosForCategories,
        categoryPhotos,
        keepScreenOn,
        categoryFontSize,
        customCategories,
        hiddenCategories,
        categoryOrder,
        categoryOverrides
      }).catch(console.error);
    }
  }, [accentColor, theme, language, units, showMainCategories, showSecondaryCategories, hideRecipeMetadata, hideRecipeCount, usePhotosForCategories, categoryPhotos, keepScreenOn, categoryFontSize, customCategories, hiddenCategories, categoryOrder, categoryOverrides, currentUser]);

  // Handle Auth Persistence and Hybrid Transition
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsGuest(true);
      const savedRecipes = localStorage.getItem('local_recipes');
      if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
      else setRecipes(SAMPLE_RECIPES);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setCurrentUser(session.user);
        setIsGuest(false);
        loadUserData(session);
      } else {
        const savedRecipes = localStorage.getItem('local_recipes');
        if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
        else setRecipes(SAMPLE_RECIPES);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setCurrentUser(session.user);
        setIsGuest(false);
        loadUserData(session);
      } else {
        setCurrentUser(null);
        setIsGuest(true);
        // Fallback to local data when logged out
        const savedRecipes = localStorage.getItem('local_recipes');
        if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
        else setRecipes(SAMPLE_RECIPES);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (currentSession: { user: { id: string; email?: string } } | null) => {
    if (!currentSession?.user) return;
    const userId = currentSession.user.id;
    
    setIsSyncing(true);
    try {
      const [profileData, userRecipes] = await Promise.all([
        getProfile(userId),
        fetchUserRecipes(userId)
      ]);
      
      if (profileData) {
        setUserProfile({
          name: profileData.name || 'Fulano da Silva',
          email: currentSession.user.email || '',
          username: profileData.username || 'meu_usuario',
          birthDate: profileData.birth_date || '',
          gender: profileData.gender || '',
          location: profileData.location || '',
          photo: profileData.photo_url || ''
        });

        const s = profileData.settings || {};
        if (s.theme) setTheme(s.theme);
        if (s.accentColor) setAccentColor(s.accentColor);
        if (s.language) setLanguage(s.language);
        if (s.units) setUnits(s.units);
        if (s.showMainCategories !== undefined) setShowMainCategories(s.showMainCategories);
        if (s.showSecondaryCategories !== undefined) setShowSecondaryCategories(s.showSecondaryCategories);
        if (s.hideRecipeMetadata !== undefined) setHideRecipeMetadata(s.hideRecipeMetadata);
        if (s.hideRecipeCount !== undefined) setHideRecipeCount(s.hideRecipeCount);
        if (s.usePhotosForCategories !== undefined) setUsePhotosForCategories(s.usePhotosForCategories);
        if (s.categoryPhotos) setCategoryPhotos(s.categoryPhotos);
        if (s.keepScreenOn !== undefined) setKeepScreenOn(s.keepScreenOn);
        if (s.categoryFontSize) setCategoryFontSize(s.categoryFontSize);
        if (s.customCategories) setCustomCategories(s.customCategories);
        if (s.hiddenCategories) setHiddenCategories(s.hiddenCategories);
        if (s.categoryOrder) setCategoryOrder(s.categoryOrder);
        if (s.categoryOverrides) setCategoryOverrides(s.categoryOverrides);
      } else {
        // Fallback for new users
        setUserProfile(prev => ({
          ...prev,
          email: currentSession.user.email || ''
        }));
      }
      
      if (userRecipes && userRecipes.length > 0) {
        setRecipes(userRecipes);
      } else if (!profileData) {
         // If brand new user with no profile, maybe they have local data?
         const savedRecipes = localStorage.getItem('local_recipes');
         if (savedRecipes) {
            const local = JSON.parse(savedRecipes);
            setRecipes(local);
            // Optionally sync local to DB here
         } else {
            setRecipes(SAMPLE_RECIPES);
         }
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
        let customCats: CustomCategory[] = [];
        const savedCategories = localStorage.getItem('custom_categories');
        if (savedCategories) {
          const parsedCategories = JSON.parse(savedCategories);
          // Remove duplicated 'Salada' and 'Aves' custom categories
          const filteredCategories = parsedCategories.filter((c: CustomCategory) => {
            const label = c.label.toLowerCase();
            return label !== 'salada' && label !== 'saladas' && label !== 'aves' && label !== 'ave';
          });
          
          if (filteredCategories.length !== parsedCategories.length) {
            localStorage.setItem('custom_categories', JSON.stringify(filteredCategories));
          }
          customCats = filteredCategories;
          setCustomCategories(filteredCategories);
        }
        
        const savedHidden = localStorage.getItem('hidden_categories');
        if (savedHidden) setHiddenCategories(JSON.parse(savedHidden));
        
        const savedOrder = localStorage.getItem('category_order');
        let order = savedOrder ? JSON.parse(savedOrder) : [];
        
        // One-time migration to move FIT to the end (removed as FIT is deleted)
        if (!localStorage.getItem('fit_moved_to_end')) {
          const allCatIds = [
            'CAFE_DA_MANHA', 'APERITIVOS', 'SALADAS', 'SOPAS', 'MASSAS', 'CARNE_VERMELHA', 'FRANGO', 
            'PEIXE', 'MOLHOS', 'ACOMPANHAMENTOS', 'SOBREMESAS', 'BEBIDAS',
            ...customCats.map((c: CustomCategory) => c.id)
          ];
          
          if (order.length === 0) {
            order = allCatIds;
          }
          
          order = order.filter((id: string) => id !== 'FIT');
          
          localStorage.setItem('category_order', JSON.stringify(order));
          localStorage.setItem('fit_moved_to_end', 'true');
        }
        
        if (!localStorage.getItem('breakfast_first')) {
          order = order.filter((id: string) => id !== 'CAFE_DA_MANHA');
          order = ['CAFE_DA_MANHA', ...order];
          localStorage.setItem('category_order', JSON.stringify(order));
          localStorage.setItem('breakfast_first', 'true');
        }
        
        if (order.length > 0) setCategoryOrder(order);
        
        const savedOverrides = localStorage.getItem('category_overrides');
        if (savedOverrides) setCategoryOverrides(JSON.parse(savedOverrides));
        setIsSyncing(false);
      };
      loadData();
    }
  }, [isGuest, t]);

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

    // Save to DB
    if (currentUser) {
      try {
        await saveRecipeToDb({ id: recipeId, isFavorite: newStatus }, currentUser.id);
      } catch (err) {
        console.error("Error updating favorite status in DB:", err);
      }
    }
  };

  const handleUpdateNotes = async (recipeId: string, notes: string) => {
    const updatedRecipes = recipes.map(recipe => recipe.id === recipeId ? { ...recipe, notes } : recipe);
    setRecipes(updatedRecipes);
    
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe({ ...selectedRecipe, notes });
    }
    
    // Save locally
    localStorage.setItem('local_recipes', JSON.stringify(updatedRecipes));

    // Save to DB
    if (currentUser) {
      try {
        await saveRecipeToDb({ id: recipeId, notes }, currentUser.id);
      } catch (err) {
        console.error("Error updating notes in DB:", err);
      }
    }
  };

  const handleUpdateCost = async (recipeId: string, estimatedCost: string) => {
    const updatedRecipes = recipes.map(recipe => recipe.id === recipeId ? { ...recipe, estimatedCost } : recipe);
    setRecipes(updatedRecipes);
    
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe({ ...selectedRecipe, estimatedCost });
    }
    
    // Save locally
    localStorage.setItem('local_recipes', JSON.stringify(updatedRecipes));

    // Save to DB
    if (currentUser) {
      try {
        await saveRecipeToDb({ id: recipeId, estimatedCost }, currentUser.id);
      } catch (err) {
        console.error("Error updating cost in DB:", err);
      }
    }
  };

  const handleImportUrl = async (url: string) => {
    setIsImporting(true);
    const originView = viewRef.current;
    try {
      const recipe = await parseRecipeFromUrl(url);
      if (recipe) {
        if (viewRef.current !== originView) return; // User navigated away
        setImportedRecipe(recipe);
        setView('preview-url');
      } else {
        if (viewRef.current !== originView) return;
        setToastMessage(t("Este site não é suportado para importação automática. Utilize outra opção da lista."));
        setTimeout(() => setToastMessage(null), 12000);
      }
    } catch (err) {
      console.error(err);
      if (viewRef.current !== originView) return;
      setToastMessage(t("Este site não é suportado para importação automática. Utilize outra opção da lista."));
      setTimeout(() => setToastMessage(null), 12000);
    } finally {
      setIsImporting(false);
    }
  };

  const handleProcessImage = async (rotatedImageUrl?: string) => {
    const imgToProcess = rotatedImageUrl || capturedImage;
    if (!imgToProcess) return;
    setIsScanReady(false);
    setIsImporting(true);
    const originView = viewRef.current;
    try {
      const base64Data = imgToProcess.split(',')[1];
      const recipe = await scanRecipeFromImage(base64Data);
      if (recipe) {
        if (viewRef.current !== originView) return;
        setImportedRecipe(recipe);
        setIsScanReady(true);
      } else {
        if (viewRef.current !== originView) return;
        alert(t("Não conseguimos ler a imagem. Tente uma foto mais nítida."));
        setView('scan'); // Go back if failed
      }
    } catch (err) {
      console.error(err);
      if (viewRef.current !== originView) return;
      alert(t("Erro ao processar imagem."));
      setView('scan');
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveRecipe = async (recipeData: Omit<Recipe, 'id'>) => {
    setIsSyncing(true);
    try {
      const isEditing = selectedRecipe && (view === 'edit-manual');
      let updatedList: Recipe[];
      let savedRecipe: Recipe;

      if (currentUser) {
        // Save to Supabase
        const dbRecipe = isEditing ? { ...recipeData, id: selectedRecipe!.id } : recipeData;
        savedRecipe = await saveRecipeToDb(dbRecipe, currentUser.id);
        
        if (isEditing) {
          updatedList = recipes.map(r => r.id === savedRecipe.id ? savedRecipe : r);
        } else {
          updatedList = [savedRecipe, ...recipes.filter(r => r.id.startsWith('sample-') === false)];
        }
      } else {
        // Local only
        if (isEditing) {
          savedRecipe = { ...recipeData, id: selectedRecipe!.id };
          updatedList = recipes.map(r => r.id === savedRecipe.id ? savedRecipe : r);
        } else {
          savedRecipe = { ...recipeData, id: crypto.randomUUID() };
          updatedList = [savedRecipe, ...recipes.filter(r => r.id.startsWith('sample-') === false)];
        }
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

  const handleSaveProfile = async (data: typeof userProfile) => {
    setUserProfile(data);
    localStorage.setItem('local_profile', JSON.stringify(data));
    
    if (currentUser) {
      try {
        await updateUserProfile(currentUser.id, data);
      } catch (err) {
        console.error("Error updating profile in DB:", err);
      }
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    setIsSyncing(true);
    try {
      if (currentUser && !recipeId.startsWith('sample-')) {
        await deleteRecipeFromDb(recipeId, currentUser.id);
      }
      const updatedList = recipes.filter(r => r.id !== recipeId);
      setRecipes(updatedList);
      localStorage.setItem('local_recipes', JSON.stringify(updatedList));
      setSelectedRecipe(null);
      setView('book');
    } catch (err) {
      console.error("Error deleting recipe:", err);
      alert(t("Erro ao excluir receita."));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateCategory = (id: string, updates: { label?: string; iconName?: string }) => {
    const newOverrides = { ...categoryOverrides, [id]: { ...categoryOverrides[id], ...updates } };
    setCategoryOverrides(newOverrides);
    localStorage.setItem('category_overrides', JSON.stringify(newOverrides));
  };

  const handleReorderCategories = (newOrder: string[]) => {
    setCategoryOrder(newOrder);
    localStorage.setItem('category_order', JSON.stringify(newOrder));
  };

  const handleAddCustomCategory = (label: string, iconName?: string, isMain?: boolean, isTag?: boolean) => {
    const newCategory: CustomCategory = {
      id: label.toUpperCase().replace(/\s+/g, '_'),
      label,
      iconName,
      isMain,
      isTag
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

    // Cascading delete: remove the category/tag from all recipes
    const updatedRecipes = recipes.map(recipe => {
      let modified = false;
      const newRecipe = { ...recipe };
      
      if (newRecipe.category === id) {
        newRecipe.category = undefined;
        modified = true;
      }
      if (newRecipe.mainCategory === id) {
        newRecipe.mainCategory = undefined;
        modified = true;
      }
      if (newRecipe.tags && newRecipe.tags.includes(id)) {
        newRecipe.tags = newRecipe.tags.filter(t => t !== id);
        modified = true;
      }
      
      return modified ? newRecipe : recipe;
    });

    if (JSON.stringify(updatedRecipes) !== JSON.stringify(recipes)) {
      setRecipes(updatedRecipes);
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    }
  };

  const handleToggleDefaultCategory = (id: string) => {
    if (hiddenCategories.includes(id)) {
      const updated = hiddenCategories.filter(c => c !== id);
      setHiddenCategories(updated);
      localStorage.setItem('hidden_categories', JSON.stringify(updated));
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
          onUpdateNotes={(notes) => handleUpdateNotes(selectedRecipe.id, notes)}
          onUpdateCost={(cost) => handleUpdateCost(selectedRecipe.id, cost)}
          accentColor={accentColor}
        />
      );
    }

    switch (view) {
      case 'home': return (
        <HomeView 
          recipes={recipes} 
          onSelectRecipe={setSelectedRecipe} 
          onStart={() => {
            setAuthInitialMode('signup');
            setView('auth-email');
          }}
          onLogin={() => {
            setAuthInitialMode('login');
            setView('auth-email');
          }}
        />
      );
      case 'book': return <RecipeBookView recipes={recipes} onSelectRecipe={setSelectedRecipe} onToggleFavorite={handleToggleFavorite} customCategories={customCategories} hiddenCategories={hiddenCategories} categoryOrder={categoryOrder} categoryOverrides={categoryOverrides} onAddCategory={handleAddCustomCategory} onDeleteCategory={handleDeleteCategory} showMainCategories={showMainCategories} showSecondaryCategories={showSecondaryCategories} hideRecipeMetadata={hideRecipeMetadata} hideRecipeCount={hideRecipeCount} usePhotosForCategories={usePhotosForCategories} categoryPhotos={categoryPhotos} categoryFontSize={categoryFontSize} accentColor={accentColor} onCategoryPhotoChange={(categoryId, photo) => { const newPhotos = { ...categoryPhotos, [categoryId]: photo }; setCategoryPhotos(newPhotos); try { localStorage.setItem('category_photos', JSON.stringify(newPhotos)); } catch (e) { console.error('Failed to save category photos to localStorage', e); alert('Não foi possível salvar a foto. O limite de armazenamento do navegador foi atingido. Tente remover algumas fotos de outras categorias.'); } }} />;
      case 'converter': return <ConverterView accentColor={accentColor} />;
      case 'account': return (
        <ProfileView 
          recipes={recipes} 
          isGuest={isGuest} 
          userName={userProfile.name} 
          userPhoto={userProfile.photo} 
          userHandle={userProfile.username} 
          onNavigateToDetails={() => setView('account-details')} 
          onNavigateToAppearance={() => setView('appearance')} 
          onNavigateToSettings={() => setView('settings')} 
          onNavigateToCategories={() => setView('categories')}
          onNavigateToPrivacy={() => setView('privacy')}
          onNavigateToTerms={() => setView('terms-of-service')}
          onLogout={async () => {
            await signOut();
            setView('home');
          }}
          onUpdateProfile={() => {}} 
        />
      );
      case 'categories': return <ManageCategoriesView onBack={() => setView('account')} customCategories={customCategories} hiddenCategories={hiddenCategories} categoryOrder={categoryOrder} categoryOverrides={categoryOverrides} onAddCategory={handleAddCustomCategory} onDeleteCategory={handleDeleteCategory} onToggleDefaultCategory={handleToggleDefaultCategory} onUpdateCategory={handleUpdateCategory} onReorderCategories={handleReorderCategories} recipes={recipes} />;
      case 'add-manual': return <ManualRecipeView onSave={handleSaveRecipe} onBack={() => setView('home')} customCategories={customCategories} categoryOverrides={categoryOverrides} categoryOrder={categoryOrder} onAddCategory={handleAddCustomCategory} hiddenCategories={hiddenCategories} />;
      case 'add-url': return <AddUrlView onConfirm={handleImportUrl} onBack={() => setView('home')} isLoading={isImporting} />;
      case 'scan': return <ScanView onBack={() => setView('home')} onImageCaptured={(img) => { setCapturedImage(img); setIsScanReady(false); setView('scan-preview'); }} />;
      case 'scan-preview': return capturedImage ? <ScanPreviewView imageUrl={capturedImage} onScanExecute={handleProcessImage} onScanReady={isScanReady} onTransitionComplete={() => setView('preview-url')} onDiscard={() => { setCapturedImage(null); setView('home'); }} /> : null;
      case 'preview-url': return importedRecipe ? <ManualRecipeView initialRecipe={importedRecipe} onSave={handleSaveRecipe} onBack={() => setView('home')} isPreview customCategories={customCategories} categoryOverrides={categoryOverrides} categoryOrder={categoryOrder} onAddCategory={handleAddCustomCategory} hiddenCategories={hiddenCategories} /> : null;
      case 'edit-manual': return selectedRecipe ? <ManualRecipeView initialRecipe={selectedRecipe} onSave={handleSaveRecipe} onBack={() => setView('home')} customCategories={customCategories} categoryOverrides={categoryOverrides} categoryOrder={categoryOrder} onAddCategory={handleAddCustomCategory} hiddenCategories={hiddenCategories} /> : null;
      case 'account-details': return <AccountDetailsView initialData={userProfile} isLoggedIn={!isGuest} onSave={handleSaveProfile} onBack={() => setView('account')} onGoogleLogin={handleGoogleLogin} onAppleLogin={() => {}} onEmailLogin={() => { setAuthInitialMode('login'); setView('auth-email'); }} onDeleteAccount={() => setView('account')} accentColor={accentColor} />;
      case 'auth-email': return (
        <AuthView 
          key={authInitialMode}
          initialMode={authInitialMode}
          onLoginSuccess={() => setView('account')} 
          onBack={() => setView('home')}
          onViewTerms={() => setView('terms-of-service')}
          onViewPrivacy={() => setView('privacy')}
          accentColor={accentColor}
        />
      );
      case 'appearance': return <AppearanceView currentTheme={theme} onThemeChange={setTheme} currentColor={accentColor} onColorChange={setAccentColor} keepScreenOn={keepScreenOn} onKeepScreenOnChange={(v) => { setKeepScreenOn(v); localStorage.setItem('keep_screen_on', v.toString()); }} categoryFontSize={categoryFontSize} onCategoryFontSizeChange={(v) => { setCategoryFontSize(v); localStorage.setItem('category_font_size', v.toString()); }} onBack={() => setView('account')} onSave={() => {}} />;
      case 'settings': return <SettingsView language={language} onLanguageChange={(l) => { setLanguage(l); localStorage.setItem('app_lang', l); i18n.changeLanguage(l); }} units={units} onUnitsChange={(u) => { setUnits(u); localStorage.setItem('app_units', u); }} showMainCategories={showMainCategories} onShowMainCategoriesChange={(v) => { setShowMainCategories(v); localStorage.setItem('show_main_categories', v.toString()); }} showSecondaryCategories={showSecondaryCategories} onShowSecondaryCategoriesChange={(v) => { setShowSecondaryCategories(v); localStorage.setItem('show_secondary_categories', v.toString()); }} hideRecipeMetadata={hideRecipeMetadata} onHideRecipeMetadataChange={(v) => { setHideRecipeMetadata(v); localStorage.setItem('hide_recipe_metadata', v.toString()); }} hideRecipeCount={hideRecipeCount} onHideRecipeCountChange={(v) => { setHideRecipeCount(v); localStorage.setItem('hide_recipe_count', v.toString()); }} usePhotosForCategories={usePhotosForCategories} onUsePhotosForCategoriesChange={(v) => { setUsePhotosForCategories(v); localStorage.setItem('use_photos_for_categories', v.toString()); }} onBack={() => setView('account')} onSave={() => {}} />;
      case 'privacy': return <PrivacyPolicyView onBack={() => setView('auth-email')} />;
      case 'terms-of-service': return <TermsOfServiceView onBack={() => setView(viewRef.current === 'account' ? 'account' : 'auth-email')} />;
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

  const showBottomNav = !selectedRecipe && !['edit-manual', 'add-manual', 'account-details', 'appearance', 'settings', 'add-url', 'preview-url', 'scan', 'scan-preview', 'auth-email', 'categories', 'privacy'].includes(view);

  return (
    <div className="w-full min-h-screen bg-[#f2f2f2] dark:bg-[#0a0a0a] font-sans text-black dark:text-white overflow-x-hidden">
      {isSyncing && (
        <div className="fixed top-4 right-4 z-50">
          <Loader2 className="animate-spin text-black dark:text-white opacity-40" size={20} />
        </div>
      )}

      <main className={showBottomNav && view !== 'home' ? 'pb-16' : ''}>
        {renderContent()}
      </main>

      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#121212] h-14 flex items-center justify-around z-40 px-2">
          <TabButton icon={<House />} active={view === 'home'} onClick={() => setView('home')} title={t('Início')} />
          <TabButton icon={<ClipboardList />} active={view === 'book'} onClick={() => setView('book')} title={t('Livro de Receitas')} />
          <TabButton icon={<Plus />} active={false} onClick={() => setShowAddModal(true)} special title={t('Adicionar Receita')} />
          <TabButton icon={<Scale />} active={view === 'converter'} onClick={() => setView('converter')} title={t('Conversor')} />
          <TabButton icon={<User />} active={view === 'account'} onClick={() => setView('account')} title={t('Conta')} />
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
        <div className={`fixed left-0 right-0 flex justify-center z-[300] pointer-events-none px-4 ${
          toastMessage.includes('suportado') ? 'inset-0 items-center' : 'bottom-12'
        }`}>
          <div className={`px-5 py-4 shadow-xl animate-in fade-in duration-300 flex items-center gap-3 w-full max-w-[360px] ${
            toastMessage.includes('suportado') ? 'zoom-in-95' : 'slide-in-from-bottom-5'
          } ${
            toastMessage.toLowerCase().includes('sucesso') || toastMessage.toLowerCase().includes('copiada') || toastMessage.includes('suportado')
              ? 'bg-black dark:bg-white text-white dark:text-black rounded-full text-center px-6 py-3 min-h-[50px] justify-center'
              : 'bg-black text-white rounded-lg text-center'
          }`}>
            {toastMessage.toLowerCase().includes('sucesso') || toastMessage.toLowerCase().includes('copiada') ? (
              <CheckCircle2 size={18} className="text-brand-secondary shrink-0" />
            ) : toastMessage.includes('suportado') ? (
              <AlertCircle size={18} className="text-red-500 shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            )}
            <span className="font-mooli text-[13px] font-medium leading-tight">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
