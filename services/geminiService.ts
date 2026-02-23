
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RECIPE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'Título da receita' },
    ingredients: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: 'Lista de ingredientes com quantidades exatas'
    },
    instructions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: 'Modo de preparo passo a passo'
    },
    prepTime: { type: Type.STRING, description: 'Tempo de preparo apenas em minutos (ex: 15)' },
    cookTime: { type: Type.STRING, description: 'Tempo de cozimento apenas em minutos (ex: 30)' },
    servings: { type: Type.STRING, description: 'Número de porções (ex: 4)' },
    category: { type: Type.STRING, description: 'Categoria principal (ex: DOCE, SALGADO, PADARIA, BEBIDA, FIT)' }
  },
  required: ['title', 'ingredients', 'instructions']
};

export const parseRecipeFromUrl = async (url: string): Promise<Recipe | null> => {
  try {
    const isSocial = url.includes('instagram.com') || url.includes('tiktok.com') || url.includes('facebook.com') || url.includes('youtube.com') || url.includes('youtu.be');
    
    // Usamos o Pro para tarefas complexas de extração de texto
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Você é um especialista em culinária e mestre em extração de dados. 
      Analise o link: ${url}.

      OBJETIVO: Extrair a receita COMPLETA.

      LOGICA DE BUSCA:
      1. Se o link for de REDE SOCIAL (Instagram, TikTok, YT) e a receita não estiver óbvia na legenda, USE O GOOGLE SEARCH para encontrar o blog oficial do autor ou transcrições dessa receita específica.
      2. IGNORE "HISTÓRIAS" DE BLOGS: Muitas páginas têm textos longos antes da receita. Salte direto para a lista de ingredientes e instruções.
      3. TRADUÇÃO: Se a fonte for estrangeira, traduza fielmente para Português (Brasil).
      4. NORMALIZAÇÃO: Se faltar tempo de preparo ou porções no texto original, use sua base de conhecimento para ESTIMAR valores realistas baseados na complexidade da receita encontrada.
      
      RETORNO: Apenas o JSON puro seguindo o esquema definido.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: RECIPE_SCHEMA,
        tools: [{ googleSearch: {} }] 
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        ...data,
        id: crypto.randomUUID(),
        sourceUrl: url,
        title: data.title?.toUpperCase() || 'RECEITA IMPORTADA'
      };
    }
    return null;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
};

export const scanRecipeFromImage = async (base64Image: string): Promise<Recipe | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: "Transcreva fielmente esta receita da imagem para JSON. Traduza para Português se necessário." },
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: RECIPE_SCHEMA
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        ...data,
        id: crypto.randomUUID(),
        title: data.title?.toUpperCase() || 'RECEITA ESCANEADA'
      };
    }
    return null;
  } catch (error) {
    console.error("Error scanning image:", error);
    return null;
  }
};
