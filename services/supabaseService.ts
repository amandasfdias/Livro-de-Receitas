
import { createClient } from '@supabase/supabase-js';
import { Recipe } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Método centralizado para Login com Google
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      skipBrowserRedirect: true,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });
  
  if (error) throw error;
  
  if (data?.url) {
    window.open(data.url, '_blank');
  }
  
  return data;
};

// Helper para converter dados do banco (snake_case) para o app (camelCase)
const mapFromDb = (recipe: any): Recipe => ({
  id: recipe.id,
  title: recipe.title,
  ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
  instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
  prepTime: recipe.prep_time,
  cookTime: recipe.cook_time,
  servings: recipe.servings,
  category: recipe.category,
  imageUrl: recipe.image_url,
  sourceUrl: recipe.source_url,
  isFavorite: recipe.is_favorite
});

// Helper para converter dados do app (camelCase) para o banco (snake_case)
const mapToDb = (recipe: Omit<Recipe, 'id'>) => ({
  title: recipe.title,
  ingredients: recipe.ingredients,
  instructions: recipe.instructions,
  prep_time: recipe.prepTime,
  cook_time: recipe.cookTime,
  servings: recipe.servings,
  category: recipe.category,
  image_url: recipe.imageUrl,
  source_url: recipe.sourceUrl,
  is_favorite: recipe.isFavorite
});

export const fetchUserRecipes = async (userId: string): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erro ao buscar receitas:", error);
    return [];
  }
  return (data || []).map(mapFromDb);
};

export const saveRecipe = async (recipe: Omit<Recipe, 'id'>, userId: string, recipeId?: string): Promise<Recipe> => {
  const dbData = { ...mapToDb(recipe), user_id: userId };
  
  if (recipeId) {
    const { data, error } = await supabase
      .from('recipes')
      .update({ ...dbData, updated_at: new Date().toISOString() })
      .eq('id', recipeId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return mapFromDb(data);
  } else {
    const { data, error } = await supabase
      .from('recipes')
      .insert([dbData])
      .select()
      .single();
    if (error) throw error;
    return mapFromDb(data);
  }
};

export const deleteRecipe = async (recipeId: string, userId: string) => {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId)
    .eq('user_id', userId);
  if (error) throw error;
};

export const updateFavoriteStatus = async (recipeId: string, isFavorite: boolean, userId: string) => {
  const { error } = await supabase
    .from('recipes')
    .update({ is_favorite: isFavorite })
    .eq('id', recipeId)
    .eq('user_id', userId);
  if (error) throw error;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error("Erro ao buscar perfil:", error);
    return null;
  }
  return data;
};

export const updateUserProfile = async (userId: string, profile: any) => {
  const dbProfile = {
    id: userId,
    name: profile.name,
    username: profile.username,
    birth_date: profile.birthDate,
    gender: profile.gender,
    location: profile.location,
    photo_url: profile.photo,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(dbProfile)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
