import { createClient } from '@supabase/supabase-js';
import { Recipe, Checkout } from '../types';

const DEFAULT_SUPABASE_URL = 'https://kenzguhtinkgumhrtnjy.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbnpndWh0aW5rZ3VtaHJ0bmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjI0NDQsImV4cCI6MjA5MzQ5ODQ0NH0.xGF2piAG0-5hQVZcrp_8jkMTOw_dXO3hK1n9B8P0BOw';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
// Normalize URL: remove trailing slashes and common API paths if present
let supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

// Fix invalid URLs from env variables
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  console.warn('Invalid VITE_SUPABASE_URL provided, falling back to default.');
  supabaseUrl = DEFAULT_SUPABASE_URL;
}

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('nodngrbhschbkgwjmrfx') &&
  !supabaseUrl.includes('YOUR_SUPABASE_URL')
);

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co', 
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder'
);

// --- Authentication ---

export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  
  if (error) throw error;
  return data;
};

// --- Recipes ---

const mapFromDb = (recipe: Record<string, unknown>): Recipe => ({
  id: recipe.id as string,
  title: recipe.title as string,
  ingredients: (recipe.ingredients as string[]) || [],
  instructions: (recipe.instructions as string[]) || [],
  prepTime: recipe.prep_time as string,
  cookTime: recipe.cook_time as string,
  servings: recipe.servings as string,
  category: recipe.category as string,
  mainCategory: recipe.main_category as string,
  tags: (recipe.tags as string[]) || [],
  imageUrl: recipe.image_url as string,
  sourceUrl: recipe.source_url as string,
  isFavorite: recipe.is_favorite as boolean,
  notes: recipe.notes as string,
  estimatedCost: recipe.estimated_cost as string
});

const mapToDb = (recipe: Partial<Recipe>) => ({
  title: recipe.title,
  ingredients: recipe.ingredients,
  instructions: recipe.instructions,
  prep_time: recipe.prepTime,
  cook_time: recipe.cookTime,
  servings: recipe.servings,
  category: recipe.category,
  main_category: recipe.mainCategory,
  tags: recipe.tags,
  image_url: recipe.imageUrl,
  source_url: recipe.sourceUrl,
  is_favorite: recipe.isFavorite,
  notes: recipe.notes,
  estimated_cost: recipe.estimatedCost
});

export const fetchUserRecipes = async (userId: string): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
  return (data || []).map(r => mapFromDb(r as Record<string, unknown>));
};

export const saveRecipeToDb = async (recipe: Partial<Recipe>, userId: string): Promise<Recipe> => {
  const isUpdate = !!recipe.id && recipe.id.length > 10; // Simple check for real UUID vs temp id
  const dbData = { ...mapToDb(recipe), user_id: userId };
  
  if (isUpdate) {
    const { data, error } = await supabase
      .from('recipes')
      .update({ ...dbData, updated_at: new Date().toISOString() })
      .eq('id', recipe.id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return mapFromDb(data);
  } else {
    // Omitting id if it exists but is just a local temp id
    const { id: _, ...insertData } = dbData as Record<string, unknown>;
    void _; // Explicitly use the ignored variable to satisfy some linters if needed, though _ usually works
    const { data, error } = await supabase
      .from('recipes')
      .insert([insertData])
      .select()
      .single();
    if (error) throw error;
    return mapFromDb(data as Record<string, unknown>);
  }
};

export const deleteRecipeFromDb = async (recipeId: string, userId: string) => {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId)
    .eq('user_id', userId);
  if (error) throw error;
};

// --- Profiles & Settings ---

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No profile found
    throw error;
  }
  return data;
};

export const updateUserSettings = async (userId: string, settings: Record<string, unknown>) => {
  const { error } = await supabase
    .from('profiles')
    .update({ 
      settings,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
  
  if (error) throw error;
};

export const updateUserProfile = async (userId: string, profileData: Record<string, unknown>) => {
  // Convert camelCase from app to snake_case for DB if needed
  const dbProfile = {
    name: profileData.name,
    username: profileData.username,
    birth_date: profileData.birthDate,
    gender: profileData.gender,
    location: profileData.location,
    photo_url: profileData.photo,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('profiles')
    .update(dbProfile)
    .eq('id', userId);
  
  if (error) throw error;
};

// --- Checkouts ---

export const saveCheckoutToDb = async (checkout: Omit<Checkout, 'id' | 'createdAt'>): Promise<Checkout> => {
  const { data, error } = await supabase
    .from('checkouts')
    .insert([
      {
        user_id: checkout.userId,
        amount: checkout.amount,
        status: checkout.status
      }
    ])
    .select()
    .single();
    
  if (error) throw error;
  return {
    id: data.id,
    userId: data.user_id,
    amount: data.amount,
    status: data.status,
    createdAt: data.created_at
  };
};

export const fetchUserCheckouts = async (userId: string): Promise<Checkout[]> => {
  const { data, error } = await supabase
    .from('checkouts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(c => ({
    id: c.id,
    userId: c.user_id,
    amount: c.amount,
    status: c.status,
    createdAt: c.created_at
  }));
};
