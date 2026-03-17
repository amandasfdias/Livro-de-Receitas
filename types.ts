
export interface CustomCategory {
  id: string;
  label: string;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  category?: string;
  imageUrl?: string;
  sourceUrl?: string;
  isFavorite?: boolean;
}

export type ViewState = 'landing' | 'auth' | 'auth-email' | 'home' | 'book' | 'converter' | 'account' | 'account-details' | 'recipe-detail' | 'add-manual' | 'edit-manual' | 'scan' | 'scan-preview' | 'add-url' | 'appearance' | 'preview-url' | 'settings';

export enum AddMethod {
  URL = 'URL',
  MANUAL = 'MANUAL',
  SCAN = 'SCAN'
}
