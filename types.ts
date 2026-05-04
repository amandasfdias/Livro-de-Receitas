
export interface CustomCategory {
  id: string;
  label: string;
  iconName?: string;
  isMain?: boolean;
  isTag?: boolean;
}
export interface Checkout {
  id: string;
  userId: string;
  amount: number;
  status: string;
  createdAt?: string;
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
  mainCategory?: string;
  tags?: string[];
  imageUrl?: string;
  sourceUrl?: string;
  isFavorite?: boolean;
  notes?: string;
  estimatedCost?: string;
}

export type ViewState = 'landing' | 'auth' | 'auth-email' | 'home' | 'book' | 'converter' | 'account' | 'account-details' | 'recipe-detail' | 'add-manual' | 'edit-manual' | 'scan' | 'scan-preview' | 'add-url' | 'appearance' | 'preview-url' | 'settings' | 'categories' | 'privacy' | 'terms-of-service';

export enum AddMethod {
  URL = 'URL',
  MANUAL = 'MANUAL',
  SCAN = 'SCAN'
}
