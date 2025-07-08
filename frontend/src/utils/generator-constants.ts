// Constante pentru generatorul de conținut

// Modele pentru generarea imaginilor
export const imageModels = [
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'cgdream', label: 'CGDream AI' }
] as const;

// Modele pentru generarea textului
export const textModels = [
  { value: 'gemini-pro', label: 'Gemini Pro' },
  { value: 'gemini-pro-vision', label: 'Gemini Pro Vision' }
] as const;

// Modele pentru generarea animațiilor
export const animationModels = [
  { value: 'kling', label: 'Kling AI' },
  { value: 'runway', label: 'Runway ML' }
] as const;

// Stiluri de imagine disponibile
export const imageStyles = [
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
];

// Formate de aspect pentru imagini
export const aspectRatios = [
  { value: '16:9', label: 'Landscape (16:9)', icon: 'Maximize' },
  { value: '1:1', label: 'Pătrat (1:1)', icon: 'Square' },
  { value: '9:16', label: 'Portrait (9:16)', icon: 'Minimize' },
];

// Animații pentru elemente UI
export const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  }
}; 