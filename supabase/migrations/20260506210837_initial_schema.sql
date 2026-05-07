-- Initial schema for The Recipes Lab

-- PROFILES
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  username text UNIQUE,
  birth_date text,
  gender text,
  location text,
  photo_url text,
  settings jsonb,
  updated_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Trigger to create a profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, created_at)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- RECIPES
CREATE TABLE public.recipes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  ingredients jsonb DEFAULT '[]'::jsonb,
  instructions jsonb DEFAULT '[]'::jsonb,
  prep_time text,
  cook_time text,
  servings text,
  category text,
  main_category text,
  tags jsonb DEFAULT '[]'::jsonb,
  image_url text,
  source_url text,
  is_favorite boolean DEFAULT false,
  notes text,
  estimated_cost text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recipes" 
  ON public.recipes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes" 
  ON public.recipes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" 
  ON public.recipes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes" 
  ON public.recipes FOR DELETE 
  USING (auth.uid() = user_id);

-- CHECKOUTS
CREATE TABLE public.checkouts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  status text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.checkouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own checkouts" 
  ON public.checkouts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkouts" 
  ON public.checkouts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);