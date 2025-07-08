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
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Import API keys from config
import { GEMINI_API_KEY } from '../config/apiKeys';

// Inițializare Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Generează conținut folosind Gemini API
 * @param prompt - Cerința utilizatorului
 * @param numberOfScenes - Numărul de scene de generat
 * @param model - Modelul Gemini de folosit
 */
export async function generateWithGemini(
  prompt: string, 
  numberOfScenes: number,
  model: TextGenerationModel = 'gemini-2.5-flash'
): Promise<AISceneResponse[]> {
  try {
    console.log(`Generare conținut cu Gemini ${model} pentru ${numberOfScenes} scene`);
    
    const request: AITextGenerationRequest = {
      prompt,
      numberOfScenes,
      model: model
    };
    
    // Inițializare model Gemini
    const generativeModel = genAI.getGenerativeModel({ model });
    
    // Construim prompt-ul pentru a obține structura dorită
    const structuredPrompt = `
    Creează ${request.numberOfScenes} scene pentru un conținut creativ bazat pe următoarea cerință:
    "${request.prompt}"
    
    Te rog să returnezi rezultatul ca un array JSON cu exactă această structură pentru fiecare scenă:
    {
      "sceneNumber": numărul scenei (începând de la 1),
      "continut_text": textul narativ al scenei,
      "descriere_imagine": descriere detaliată pentru generarea unei imagini care să reprezinte scena,
      "descriere_animatie": instrucțiuni pentru cum ar trebui animată imaginea
    }
    `;
    
    // Generarea răspunsului
    const result = await generativeModel.generateContent({
      contents: [{ role: "user", parts: [{ text: structuredPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
    
    // Procesăm răspunsul pentru a extrage JSON-ul
    const response = result.response;
    const responseText = response.text();
    
    // Extragem partea JSON din text
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    console.log(`jsonMatch: ${jsonMatch}`);
    if (!jsonMatch) {
      throw new Error('Nu s-a putut extrage JSON din răspunsul Gemini');
    }
    
    const jsonResponse = JSON.parse(jsonMatch[0]) as AISceneResponse[];
    
    // Validăm că avem numărul corect de scene
    if (jsonResponse.length !== numberOfScenes) {
      console.warn(`Numărul de scene generate (${jsonResponse.length}) nu corespunde cu numărul solicitat (${numberOfScenes})`);
    }
    
    return jsonResponse;
  } catch (error) {
    console.error('Eroare la generarea conținutului cu Gemini:', error);
    throw error;
  }
}

/**
 * Generează conținut folosind OpenAI API
 * @param prompt - Cerința utilizatorului
 * @param numberOfScenes - Numărul de scene de generat
 * @param model - Modelul OpenAI de folosit
 */
export async function generateWithOpenAI(
  prompt: string, 
  numberOfScenes: number,
  model: TextGenerationModel = 'gpt-4'
): Promise<AISceneResponse[]> {
  // TODO: Implementare reală cu OpenAI API
  console.log(`Generare conținut cu OpenAI ${model} pentru ${numberOfScenes} scene`);
  
  const request: AITextGenerationRequest = {
    prompt,
    numberOfScenes,
    model: model
  };
  
  // Pentru moment returnăm date mock până la implementarea completă
  throw new Error('Generarea cu OpenAI nu este încă implementată');
}

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
  
  if (model === 'gemini') {
    try {
      // Inițializare model Gemini pentru imagini
      const generativeModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
      
      // Construim prompt-ul pentru a obține imaginea dorită
      const imagePrompt = `
      Generează o imagine în stilul ${request.style} cu următoarea descriere:
      "${request.description}"
      `;
      
      // TODO: Implementare completă când Gemini va oferi API pentru generare de imagini
      // Momentan returnăm un placeholder
      
      const randomId = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/1024/768?random=${randomId}`;
    } catch (error) {
      console.error('Eroare la generarea imaginii cu Gemini:', error);
      throw error;
    }
  } else if (model === 'cgdream') {
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
      { id: 'gemini', name: 'Gemini', available: true },
      { id: 'cgdream', name: 'CGDream AI', available: false }
    ],
    animation: [
      { id: 'kling', name: 'Kling AI', available: false },
      { id: 'runway', name: 'Runway ML', available: false }
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
