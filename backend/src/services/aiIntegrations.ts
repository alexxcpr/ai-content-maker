// Serviciu pentru integrări AI
import { 
  TextGenerationModel,
  ImageGenerationModel, 
  AnimationGenerationModel,
  AISceneResponse,
  AITextGenerationRequest,
  AIImageGenerationRequest,
  AIAnimationGenerationRequest
} from '../types/ai.generation.types';

// Importăm librării necesare pentru API calls
// import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { GoogleGenAI, Modality } from '@google/genai';
// import OpenAI from 'openai';

// Import API keys from config
import { GEMINI_API_KEY, OPENAI_API_KEY } from '../config/apiKeys';

import * as fs from "node:fs";

// Inițializare Google Generative AI
const geminiGenAI = new GoogleGenAI({
  apiKey: GEMINI_API_KEY
});

// Inițializare OpenAI
// const openai = new OpenAI({
//   apiKey: OPENAI_API_KEY
// });

/**
 * Generează conținut folosind Gemini API
 * @param prompt - Cerința utilizatorului
 * @param numberOfScenes - Numărul de scene de generat
 * @param model - Modelul Gemini de folosit
 */
export async function generateContent(
  prompt: string, 
  numberOfScenes: number,
  model: TextGenerationModel
): Promise<AISceneResponse[]> {
  try {
    console.log(`Generare conținut cu modelul ${model} pentru ${numberOfScenes} scene`);
    
    const request: AITextGenerationRequest = {
      prompt,
      numberOfScenes,
      model: model
    };
    
    // Redirectăm către funcția corespunzătoare în funcție de model
    if (model.startsWith('gemini')) {
      return await generateContentWithGemini(request);
    } else if (model.startsWith('gpt')) {
      // return await generateContentWithGPT(request);
      console.error('Generarea cu OpenAI nu este încă implementată');
      // throw new Error('Generarea cu OpenAI nu este încă implementată');
      return [];
    } else {
      throw new Error(`Model text necunoscut: ${model}`);
    }
  } catch (error) {
    console.error('Eroare la generarea conținutului:', error);
    throw error;
  }
}

/**
 * Generează conținut folosind Gemini API
 * @param request - Cererea de generare text
 */
async function generateContentWithGemini(
  request: AITextGenerationRequest
): Promise<AISceneResponse[]> {
  try {
    // Inițializare model Gemini
    const ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY
    });
    
    // Construim prompt-ul pentru a obține structura dorită
    const structuredPrompt = `
    Creează ${request.numberOfScenes} scene pentru un conținut creativ bazat pe următoarea cerință:
    "${request.prompt}"
    
    Te rog să returnezi rezultatul ca un array JSON cu exactă această structură pentru fiecare scenă:
    {
      "sceneNumber": numărul scenei (începând de la 1),
      "continut_text": textul narativ al scenei (maxim 80 de caractere),
      "descriere_imagine": descriere detaliată pentru generarea unei imagini care să reprezinte scena,
      "descriere_animatie": instrucțiuni pentru cum ar trebui animată imaginea
    }
    `;
    
    // Generarea răspunsului
    const result = await ai.models.generateContent({
      model: request.model,
      contents: [{ role: "user", parts: [{ text: structuredPrompt }] }],
      config: {
        responseModalities: [Modality.TEXT],
      }
    });
    
    // Procesăm răspunsul pentru a extrage JSON-ul
    const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extragem partea JSON din text
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    console.log(`jsonMatch: ${jsonMatch}`);
    if (!jsonMatch) {
      throw new Error('Nu s-a putut extrage JSON din răspunsul Gemini');
    }
    
    const jsonResponse = JSON.parse(jsonMatch[0]) as AISceneResponse[];
    
    // Validăm că avem numărul corect de scene
    if (jsonResponse.length !== request.numberOfScenes) {
      console.warn(`Numărul de scene generate (${jsonResponse.length}) nu corespunde cu numărul solicitat (${request.numberOfScenes})`);
    }
    
    return jsonResponse;
  } catch (error) {
    console.error('Eroare la generarea conținutului cu Gemini:', error);
    throw error;
  }
}

/**
 * Generează conținut folosind OpenAI/GPT API
 * @param request - Cererea de generare text
 */
// async function generateContentWithGPT(
//   request: AITextGenerationRequest
// ): Promise<AISceneResponse[]> {
//   try {
//     // Construim prompt-ul pentru a obține structura dorită
//     const structuredPrompt = `
//     Creează ${request.numberOfScenes} scene pentru un conținut creativ bazat pe următoarea cerință:
//     "${request.prompt}"
    
//     Te rog să returnezi rezultatul ca un array JSON cu exactă această structură pentru fiecare scenă:
//     {
//       "sceneNumber": numărul scenei (începând de la 1),
//       "continut_text": textul narativ al scenei (maxim 80 de caractere),
//       "descriere_imagine": descriere detaliată pentru generarea unei imagini care să reprezinte scena,
//       "descriere_animatie": instrucțiuni pentru cum ar trebui animată imaginea
//     }
    
//     Răspunsul trebuie să fie doar array-ul JSON, fără alt text explicativ.
//     `;
    
//     // Generarea răspunsului cu OpenAI
//     const completion = await openai.chat.completions.create({
//       model: request.model,
//       messages: [
//         {
//           role: "system",
//           content: "Ești un asistent creativ care generează conținut structurat în format JSON."
//         },
//         {
//           role: "user",
//           content: structuredPrompt
//         }
//       ],
//       temperature: 0.7,
//       max_tokens: 4000,
//       response_format: { type: "json_object" }
//     });
    
//     const responseContent = completion.choices[0]?.message?.content;
    
//     if (!responseContent) {
//       throw new Error('Răspunsul OpenAI este gol');
//     }
    
//     try {
//       // Încercăm să parsăm direct răspunsul
//       const parsedResponse = JSON.parse(responseContent);
      
//       // Verificăm dacă avem un array în proprietatea 'scenes' sau direct un array
//       const jsonResponse = Array.isArray(parsedResponse) 
//         ? parsedResponse as AISceneResponse[]
//         : parsedResponse.scenes as AISceneResponse[];
      
//       // Validăm că avem numărul corect de scene
//       if (jsonResponse.length !== request.numberOfScenes) {
//         console.warn(`Numărul de scene generate (${jsonResponse.length}) nu corespunde cu numărul solicitat (${request.numberOfScenes})`);
//       }
      
//       return jsonResponse;
//     } catch (error) {
//       console.error('Eroare la parsarea răspunsului OpenAI:', error);
//       throw new Error('Nu s-a putut procesa răspunsul OpenAI');
//     }
//   } catch (error) {
//     console.error('Eroare la generarea conținutului cu GPT:', error);
//     throw error;
//   }
// }

/**
 * Generează imagine folosind serviciul specificat
 * @param description - Descrierea imaginii
 * @param model - 'gemini' sau 'cgdream'
 * @param style - Stilul imaginii
 */
export async function generateImage(
  description: string,
  model: ImageGenerationModel,
  style: string
): Promise<string> {
  // TODO: Integrare reală cu CGDream API sau Gemini
  console.log(`Generare imagine cu ${model}, stil: ${style}`);
  
  const request: AIImageGenerationRequest = {
    description,
    model,
    style
  };
  
  if (model === 'imagen-3.0-generate-002') {
    try {
      const ai = new GoogleGenAI({});

      const contents = `
      Generează o imagine în stilul ${request.style} cu următoarea descriere:
      "${request.description}"
      `;

      const response = await ai.models.generateContent({
        model: 'imagen-3.0-generate-002',
        contents: contents,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        }
      });

      if (response?.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.text) {
            console.log(`descriere imagine oferita de Gemini: ${part.text}`);
          } else if (part.inlineData && part.inlineData.data) {
            const imageData = part.inlineData.data;
            const buffer = Buffer.from(imageData, 'base64');
            const imagePath = `./public/images/generated/image-${Date.now()}.png`;
            fs.writeFileSync(imagePath, buffer);
            console.log(`Imagine generata cu Gemini a fost salvata in ${imagePath}`);
            return `/${imagePath.replace('./public/', '')}`;
          }
        }
      }
      
      // Fallback to placeholder if no image was generated
      console.log('Nu s-a putut genera imaginea, folosim placeholder');
      const randomId = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/1024/768?random=${randomId}`;
      
      // throw new Error('Nu s-a putut genera imaginea');
    } catch (error) {
      console.error('Eroare la generarea imaginii cu Gemini:', error);
      throw error;
    }
  } else if (model === "models/gemini-2.0-flash-preview-image-generation") {
    // TODO: Implementare pentru Imagen 3.0 Generate 002
    console.log('Generare imagine cu Imagen 3.0 Generate 002');
    const randomId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/1024/768?random=${randomId}`;
  } 
  else if (model === 'cgdream') {
    // TODO: Implementare pentru CGDream
    const randomId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/1024/768?random=${randomId}`;
  }
  
  throw new Error(`Model de generare imagini necunoscut: ${model}`);
}

/**
 * Generează animație pentru o imagine
 * @param imageUrl - URL-ul imaginii de animat
 * @param description - Descrierea animației
 * @param model - 'kling' sau 'runway'
 */
export async function generateAnimation(
  imageUrl: string,
  description: string,
  model: AnimationGenerationModel
): Promise<string> {
  // TODO: Integrare reală cu Kling AI sau Runway ML
  console.log(`Generare animație cu ${model}`);
  
  const request: AIAnimationGenerationRequest = {
    imageUrl,
    description,
    model
  };
  
  // Returnează URL placeholder pentru video
  return `https://example.com/animation-placeholder-${Date.now()}.mp4`;
}

/**
 * Obține lista de modele disponibile
 * This function is the single source of truth for available AI models
 */
export function getAvailableModels() {
  return {
    text: [
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', available: true },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', available: true },
      { id: 'gemini-2.5-flash-lite-preview-06-17', name: 'Gemini 2.5 Flash Lite Preview 06-17', available: true },
      { id: 'gpt-4', name: 'GPT-4', available: false },
      { id: 'gpt-4o', name: 'GPT-4o', available: false },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', available: false }
    ],
    image: [
      { id: 'imagen-3.0-generate-002', name: 'Imagen 3.0 Generate 002', available: true },
      { id: 'models/gemini-2.0-flash-preview-image-generation', name: 'Gemini 2.0 Flash Preview Image Generation', available: false },
      { id: 'cgdream', name: 'CGDream AI Backend', available: false },
      { id: 'dalle3', name: 'DALL-E 3', available: false },
      { id: 'midjourney', name: 'Midjourney v6', available: false },
      { id: 'stable-diffusion-xl', name: 'Stable Diffusion XL 1.0', available: false }
    ],
    animation: [
      { id: 'kling', name: 'Kling AI', available: false },
      { id: 'runway', name: 'Runway ML', available: true }
    ],
    imageStyles: [
      { 
        category: 'Realist', 
        styles: [
          { value: 'realistic', label: 'Realist', icon: '🖼️' },
          { value: 'photographic', label: 'Fotografic', icon: '📷' },
          { value: 'cinematic', label: 'Cinematic', icon: '🎬' }
        ] 
      },
      { 
        category: 'Artistic', 
        styles: [
          { value: 'artistic', label: 'Artistic', icon: '🎨' },
          { value: 'oil-painting', label: 'Pictură în ulei', icon: '🖌️' },
          { value: 'watercolor', label: 'Acuarelă', icon: '💧' }
        ] 
      },
      { 
        category: 'Stylized', 
        styles: [
          { value: 'cartoon', label: 'Desen animat', icon: '🎭' },
          { value: 'anime', label: 'Anime', icon: '👾' },
          { value: 'pixel-art', label: 'Pixel Art', icon: '👾' },
          { value: 'abstract', label: 'Abstract', icon: '🔳' }
        ] 
      }
    ],
    aspectRatios: [
      { value: '16:9', label: 'Landscape (16:9)', icon: 'Maximize' },
      { value: '1:1', label: 'Pătrat (1:1)', icon: 'Square' },
      { value: '9:16', label: 'Portrait (9:16)', icon: 'Minimize' },
    ]
  };
}

/**
 * Validează dacă un prompt este adecvat
 */
export function validatePrompt(prompt: string): { valid: boolean; message?: string } {
  if (prompt.length < 10) {
    return { valid: false, message: 'Promptul trebuie să aibă cel puțin 10 caractere' };
  }
  
  if (prompt.length > 5000) {
    return { valid: false, message: 'Promptul nu poate depăși 5000 de caractere' };
  }
  
  // Verificări adiționale pentru conținut inadecvat ar putea fi adăugate aici
  
  return { valid: true };
}
