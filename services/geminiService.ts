
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    category: { type: Type.STRING, description: 'Categoria principal (ex: APERITIVOS, SALADAS, SOPAS, MASSAS, CARNE_VERMELHA, FRANGO, PEIXE, MOLHOS, ACOMPANHAMENTOS, SOBREMESAS, BEBIDAS, OUTROS)' }
  },
  required: ['title', 'ingredients', 'instructions']
};

export const parseRecipeFromUrl = async (url: string): Promise<Recipe | null> => {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Timeout")), 45000);
    });

    const fetchPromise = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um especialista em culinária e extração de dados de redes sociais. 
      Analise o conteúdo do link: ${url}.

      OBJETIVO: Extrair a receita COMPLETA o mais rápido possível.

      LOGICA DE BUSCA:
      1. Leia o conteúdo do link fornecido. Se for uma rede social (TikTok, Instagram, Facebook, YouTube), faça uma busca profunda APENAS no texto da legenda do vídeo (quando houver), nos comentários e nos textos sobrepostos no vídeo.
      2. Procure ativamente por palavras-chaves como: "modo de preparo", "instruções", "xícara", "colher", "sopa", "ingredientes", "receita", "passo a passo", e qualquer outra palavra relacionada a comida para acelerar a busca.
      3. IGNORE "HISTÓRIAS" DE BLOGS: Salte direto para a lista de ingredientes e instruções.
      4. TRADUÇÃO: Se a fonte for estrangeira, traduza para Português (Brasil).
      5. NORMALIZAÇÃO: Se faltar tempo de preparo ou porções, estime valores realistas.
      
      RETORNO: Apenas o JSON puro seguindo o esquema definido.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: RECIPE_SCHEMA,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
      }
    });

    const response = await Promise.race([fetchPromise, timeoutPromise]);

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
          { text: "Transcreva fielmente esta receita da imagem para JSON. Traduza para Português se necessário. Seja o mais rápido possível." },
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: RECIPE_SCHEMA,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
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
