// Serviciu pentru integrări AI
// În producție, acestea vor fi înlocuite cu integrări reale

interface SceneTemplate {
  sceneNumber: number;
  continut_text: string;
  descriere_imagine: string;
  descriere_animatie: string;
}

// Mock responses pentru development
const mockGeminiResponses: { [key: number]: SceneTemplate[] } = {
  1: [{
    sceneNumber: 1,
    continut_text: "O poveste captivantă care începe aici...",
    descriere_imagine: "O scenă de deschidere impresionantă",
    descriere_animatie: "Camera se mișcă lent pentru a dezvălui scena"
  }],
  2: [
    {
      sceneNumber: 1,
      continut_text: "Prima parte a poveștii noastre...",
      descriere_imagine: "Introducere vizuală captivantă",
      descriere_animatie: "Tranziție lină către acțiune"
    },
    {
      sceneNumber: 2,
      continut_text: "Continuarea care aduce mai multă profunzime...",
      descriere_imagine: "Dezvoltarea vizuală a narațiunii",
      descriere_animatie: "Mișcare dinamică pentru impact"
    }
  ],
  3: [
    {
      sceneNumber: 1,
      continut_text: "Începutul unei călătorii extraordinare...",
      descriere_imagine: "Peisaj impresionant de deschidere",
      descriere_animatie: "Zoom out pentru a dezvălui amploarea"
    },
    {
      sceneNumber: 2,
      continut_text: "Dezvoltarea conflictului principal...",
      descriere_imagine: "Tensiune vizuală crescândă",
      descriere_animatie: "Mișcări rapide pentru dinamism"
    },
    {
      sceneNumber: 3,
      continut_text: "Rezolvarea și încheierea satisfăcătoare...",
      descriere_imagine: "Final vizual memorabil",
      descriere_animatie: "Tranziție lină către final"
    }
  ]
};

/**
 * Generează conținut folosind Gemini API
 * @param prompt - Cerința utilizatorului
 * @param numberOfScenes - Numărul de scene de generat
 * @param model - Modelul Gemini de folosit
 */
export async function generateWithGemini(
  prompt: string, 
  numberOfScenes: number,
  model: string = 'gemini-pro'
): Promise<SceneTemplate[]> {
  // TODO: Implementare reală cu Gemini API
  console.log(`Generare conținut cu Gemini ${model} pentru ${numberOfScenes} scene`);
  
  // Simulare delay pentru a imita un API call real
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Returnează mock data bazat pe numărul de scene
  const mockData = mockGeminiResponses[numberOfScenes] || mockGeminiResponses[3];
  
  // Personalizează răspunsul bazat pe prompt
  return mockData.map(scene => ({
    ...scene,
    continut_text: `${scene.continut_text} [Bazat pe: ${prompt.substring(0, 50)}...]`
  }));
}

/**
 * Generează imagine folosind serviciul specificat
 * @param description - Descrierea imaginii
 * @param model - 'gemini' sau 'cgdream'
 * @param style - Stilul imaginii
 */
export async function generateImage(
  description: string,
  model: 'gemini' | 'cgdream',
  style: string
): Promise<string> {
  // TODO: Integrare reală cu CGDream API sau Gemini
  console.log(`Generare imagine cu ${model}, stil: ${style}`);
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Returnează URL placeholder
  const randomId = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/1024/768?random=${randomId}`;
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
  model: 'kling' | 'runway'
): Promise<string> {
  // TODO: Integrare reală cu Kling AI sau Runway ML
  console.log(`Generare animație cu ${model}`);
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Returnează URL placeholder pentru video
  return `https://example.com/animation-placeholder-${Date.now()}.mp4`;
}

/**
 * Obține lista de modele disponibile
 */
export function getAvailableModels() {
  return {
    text: [
      { id: 'gemini-pro', name: 'Gemini Pro', available: true },
      { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', available: true }
    ],
    image: [
      { id: 'gemini', name: 'Google Gemini', available: true },
      { id: 'cgdream', name: 'CGDream AI', available: false }
    ],
    animation: [
      { id: 'kling', name: 'Kling AI', available: false },
      { id: 'runway', name: 'Runway ML', available: false }
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
  
  // Verificări adiționale pentru conținut inadecvat
  // TODO: Implementare filtre de conținut
  
  return { valid: true };
}
