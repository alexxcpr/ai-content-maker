// Constante pentru aplicație
export const APP_CONFIG = {
  name: 'AI Content Maker',
  version: '1.0.0',
  description: 'Transformă ideile tale în povești vizuale captivante',
  
  // Limitări
  MAX_SCENES: 10,
  MIN_SCENES: 1,
  MAX_PROMPT_LENGTH: 5000,
  MIN_PROMPT_LENGTH: 10,
  
  // Timeout-uri (în milisecunde)
  API_TIMEOUT: 30000,
  GENERATION_TIMEOUT: 60000,
  POLLING_INTERVAL: 2000,
  MAX_POLLING_RETRIES: 30,
  
  // Rate limiting
  MAX_CONCURRENT_GENERATIONS: 3,
  
  // Setări UI
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  
  // Dimensiuni
  SIDEBAR_WIDTH: 280,
  MOBILE_BREAKPOINT: 768,
  
  // Culori (pentru consistență)
  COLORS: {
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  }
} as const;

// Modele disponibile
export const AVAILABLE_MODELS = {
  image: [
    { value: 'gemini', label: 'Google Gemini', description: 'Model versatil pentru imagini de înaltă calitate' },
    { value: 'cgdream', label: 'CGDream AI', description: 'Specializat în artă digitală și concepte creative' }
  ],
  text: [
    { value: 'gemini-pro', label: 'Gemini Pro', description: 'Model avansat pentru generare text' },
    { value: 'gemini-pro-vision', label: 'Gemini Pro Vision', description: 'Model cu capacități vizuale' }
  ],
  animation: [
    { value: 'kling', label: 'Kling AI', description: 'Animații fluide și naturale' },
    { value: 'runway', label: 'Runway ML', description: 'Animații creative și artistice' }
  ]
} as const;

// Stiluri de imagine
export const IMAGE_STYLES = [
  { value: 'realistic', label: 'Realist', description: 'Imagini foto-realiste' },
  { value: 'cartoon', label: 'Desen animat', description: 'Stil cartoon colorat' },
  { value: 'artistic', label: 'Artistic', description: 'Stil artistic și expresiv' },
  { value: 'abstract', label: 'Abstract', description: 'Forme și culori abstracte' }
] as const;

// Status-uri posibile
export const STATUS_TYPES = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  PARTIAL: 'partial',
  ERROR: 'error',
  PENDING: 'pending'
} as const;

// Mesaje de eroare comune
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Nu se poate conecta la server. Verificați conexiunea la internet.',
  TIMEOUT_ERROR: 'Cererea a durat prea mult. Încercați din nou.',
  VALIDATION_ERROR: 'Datele introduse nu sunt valide.',
  SERVER_ERROR: 'Eroare de server. Încercați din nou mai târziu.',
  UNKNOWN_ERROR: 'A apărut o eroare neașteptată.',
  RATE_LIMIT_ERROR: 'Ați făcut prea multe cereri. Așteptați puțin și încercați din nou.',
  
  // Mesaje specifice
  PROMPT_TOO_SHORT: 'Promptul trebuie să aibă cel puțin 10 caractere',
  PROMPT_TOO_LONG: 'Promptul nu poate depăși 5000 de caractere',
  INVALID_SCENES_COUNT: 'Numărul de scene trebuie să fie între 1 și 10',
  GENERATION_FAILED: 'Generarea conținutului a eșuat',
  POLLING_FAILED: 'Nu s-a putut urmări progresul generării'
} as const;

// Mesaje de succes
export const SUCCESS_MESSAGES = {
  GENERATION_STARTED: 'Generarea a fost inițiată cu succes',
  GENERATION_COMPLETED: 'Conținutul a fost generat cu succes',
  SCENE_UPDATED: 'Scena a fost actualizată',
  SETTINGS_SAVED: 'Setările au fost salvate'
} as const;

// Chei pentru localStorage
export const STORAGE_KEYS = {
  IMAGE_SETTINGS: 'ai-content-maker-image-settings',
  ANIMATION_SETTINGS: 'ai-content-maker-animation-settings',
  TEXT_SETTINGS: 'ai-content-maker-text-settings',
  USER_PREFERENCES: 'ai-content-maker-user-preferences',
  LAST_GENERATION: 'ai-content-maker-last-generation'
} as const;

// Tipuri de evenimente pentru analytics (dacă se implementează)
export const ANALYTICS_EVENTS = {
  GENERATION_STARTED: 'generation_started',
  GENERATION_COMPLETED: 'generation_completed',
  GENERATION_FAILED: 'generation_failed',
  SCENE_VIEWED: 'scene_viewed',
  SETTINGS_CHANGED: 'settings_changed',
  ERROR_OCCURRED: 'error_occurred'
} as const;

// Regex patterns pentru validări
export const VALIDATION_PATTERNS = {
  URL: /^https?:\/\/.+/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MONGO_ID: /^[0-9a-fA-F]{24}$/
} as const;

// Configurații pentru diferite environment-uri
export const ENV_CONFIG = {
  development: {
    API_URL: 'http://localhost:5000/api',
    ENABLE_LOGGING: true,
    ENABLE_DEBUG: true
  },
  production: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    ENABLE_LOGGING: false,
    ENABLE_DEBUG: false
  }
} as const;

// Helper pentru a obține configurația curentă
export const getCurrentConfig = () => {
  const env = process.env.NODE_ENV as keyof typeof ENV_CONFIG;
  return ENV_CONFIG[env] || ENV_CONFIG.development;
};