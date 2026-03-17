-- MIGRATIONS PARA O SUPABASE
-- Execute este SQL no painel do Supabase (SQL Editor)

-- 1. Tabela de Perfis (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    name TEXT,
    birth_date DATE,
    gender TEXT,
    location TEXT,
    photo_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabela de Receitas (Recipes)
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    ingredients JSONB NOT NULL DEFAULT '[]',
    instructions JSONB NOT NULL DEFAULT '[]',
    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER,
    category TEXT,
    image_url TEXT,
    source_url TEXT,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Segurança (Policies)

-- Perfis
CREATE POLICY "Perfis são visíveis por todos" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Usuários podem editar o próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Usuários podem criar o próprio perfil" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Receitas
CREATE POLICY "Usuários podem ver suas próprias receitas" ON public.recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar suas próprias receitas" ON public.recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem editar suas próprias receitas" ON public.recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem excluir suas próprias receitas" ON public.recipes FOR DELETE USING (auth.uid() = user_id);
