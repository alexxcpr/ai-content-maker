import { TextGenerationModel, ImageGenerationModel, AnimationGenerationModel } from '../types/ai.generation.types';
import mongoose, { Schema, Document } from 'mongoose';

// Interfețe pentru tipuri
interface ISceneStatus {
  text: 'completed' | 'pending' | 'error';
  image: 'completed' | 'pending' | 'error';
  animation: 'completed' | 'pending' | 'error';
}

interface IScene {
  sceneNumber: number;
  continut_text: string;
  descriere_imagine: string;
  imagine: string | null;
  descriere_animatie: string;
  imagine_animata: string | null;
  status: ISceneStatus;
}

interface IGenerationSettings {
  numberOfScenes: number;
  imageModel: ImageGenerationModel;
  textModel: TextGenerationModel;
  animationModel: AnimationGenerationModel;
  imageStyle: string;
  aspectRatio: string;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  referenceCharacterImage: string | null;
  referenceBackgroundImage: string | null;
  characterInfluence: number | null;
  backgroundInfluence: number | null;
}

export interface IGeneratedContent extends Document {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  userPrompt: string;
  settings: IGenerationSettings;
  scenes: IScene[];
  overallStatus: 'processing' | 'completed' | 'partial' | 'error';
}

// Schema pentru status scenă
const SceneStatusSchema = new Schema({
  text: {
    type: String,
    enum: ['completed', 'pending', 'error'],
    default: 'pending',
    required: true
  },
  image: {
    type: String,
    enum: ['completed', 'pending', 'error'],
    default: 'pending',
    required: true
  },
  animation: {
    type: String,
    enum: ['completed', 'pending', 'error'],
    default: 'pending',
    required: true
  }
}, { _id: false });

// Schema pentru scenă
const SceneSchema = new Schema({
  sceneNumber: {
    type: Number,
    required: true,
    min: [1, 'Numărul scenei trebuie să fie cel puțin 1'],
    max: [10, 'Numărul scenei nu poate depăși 10']
  },
  continut_text: {
    type: String,
    default: '',
    maxlength: [10000, 'Conținutul text nu poate depăși 10000 caractere']
  },
  descriere_imagine: {
    type: String,
    default: '',
    maxlength: [1000, 'Descrierea imaginii nu poate depăși 1000 caractere']
  },
  imagine: {
    type: String,
    default: null,
    validate: {
      validator: function(v: string | null) {
        if (v === null) return true;
        // Validare URL simplă
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'URL-ul imaginii nu este valid'
    }
  },
  descriere_animatie: {
    type: String,
    default: '',
    maxlength: [1000, 'Descrierea animației nu poate depăși 1000 caractere']
  },
  imagine_animata: {
    type: String,
    default: null,
    validate: {
      validator: function(v: string | null) {
        if (v === null) return true;
        // Validare URL simplă
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'URL-ul animației nu este valid'
    }
  },
  status: {
    type: SceneStatusSchema,
    required: true
  }
}, { _id: false });

// Schema pentru setări generare
const GenerationSettingsSchema = new Schema({
  numberOfScenes: {
    type: Number,
    required: true,
    min: [1, 'Numărul de scene trebuie să fie cel puțin 1'],
    max: [10, 'Numărul de scene nu poate depăși 10']
  },
  imageModel: {
    type: String,
    required: true,
    enum: {
      values: ['models/gemini-2.0-flash-preview-image-generation', 'cgdream', 'imagen-3.0-generate-002', 'dalle3', 'midjourney', 'stable-diffusion-xl'],
      message: 'Modelul de imagine trebuie să fie "models/gemini-2.0-flash-preview-image-generation" sau "cgdream" sau "imagen-3.0-generate-002" sau "dalle3" sau "midjourney" sau "stable-diffusion-xl"'
    }
  },
  textModel: {
    type: String,
    required: true,
    minlength: [1, 'Modelul text nu poate fi gol'],
    maxlength: [50, 'Modelul text nu poate depăși 50 caractere']
  },
  animationModel: {
    type: String,
    required: true,
    enum: {
      values: ['kling', 'runway'],
      message: 'Modelul de animație trebuie să fie "kling" sau "runway"'
    }
  },
  imageStyle: {
    type: String,
    required: true,
    enum: {
      values: ['realistic', 'photographic', 'cinematic', 'artistic', 'oil-painting', 'watercolor', 'cartoon', 'anime', 'pixel-art', 'abstract'],
      message: 'Stilul imaginii trebuie să fie unul din: realistic, photographic, cinematic, artistic, oil-painting, watercolor, cartoon, anime, pixel-art, abstract'
    }
  },
  aspectRatio: {
    type: String,
    required: true,
    enum: {
      values: ['16:9', '1:1', '9:16'],
      message: 'Aspect ratio-ul trebuie să fie unul din: 16:9, 1:1, 9:16'
    }
  },
  animationsEnabled: {
    type: Boolean,
    required: true,
    default: false
  },
  soundEnabled: {
    type: Boolean,
    required: true,
    default: false
  },
  referenceCharacterImage: {
    type: String,
    default: null
  },
  referenceBackgroundImage: {
    type: String,
    default: null
  },
  characterInfluence: {
    type: Number,
    default: null
  },
  backgroundInfluence: {
    type: Number,
    default: null
  }
}, { _id: false });

// Schema principală
const GeneratedContentSchema = new Schema({
  userId: {
    type: String,
    required: [true, 'User ID este necesar'],
    trim: true,
    maxlength: [100, 'User ID nu poate depăși 100 caractere']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true // Nu poate fi modificat după creare
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  userPrompt: {
    type: String,
    required: [true, 'Promptul utilizatorului este necesar'],
    trim: true,
    minlength: [10, 'Promptul trebuie să aibă cel puțin 10 caractere'],
    maxlength: [5000, 'Promptul nu poate depăși 5000 caractere']
  },
  settings: {
    type: GenerationSettingsSchema,
    required: [true, 'Setările sunt necesare']
  },
  scenes: {
    type: [SceneSchema],
    default: [],
    validate: {
      validator: function(scenes: IScene[]) {
        // Verifică că nu avem mai multe scene decât specificat în setări
        const settings = (this as any).settings;
        if (settings && scenes.length > settings.numberOfScenes) {
          return false;
        }
        
        // Verifică că numerele scenelor sunt unice și consecutive
        const sceneNumbers = scenes.map(s => s.sceneNumber).sort((a, b) => a - b);
        for (let i = 0; i < sceneNumbers.length; i++) {
          if (sceneNumbers[i] !== i + 1) {
            return false;
          }
        }
        
        return true;
      },
      message: 'Scenele trebuie să aibă numere consecutive începând de la 1'
    }
  },
  overallStatus: {
    type: String,
    enum: {
      values: ['processing', 'completed', 'partial', 'error'],
      message: 'Status-ul general trebuie să fie unul din: processing, completed, partial, error'
    },
    default: 'processing'
  }
}, {
  collection: 'generated-content',
  timestamps: { 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt' 
  }
});

// Middleware pre-save pentru actualizarea updatedAt
GeneratedContentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Middleware post-save pentru logging
GeneratedContentSchema.post('save', function(doc) {
  console.log(`Content saved: ${doc._id} - Status: ${doc.overallStatus}`);
});

// Indexuri pentru performanță
GeneratedContentSchema.index({ userId: 1, createdAt: -1 });
GeneratedContentSchema.index({ overallStatus: 1 });
GeneratedContentSchema.index({ 'settings.numberOfScenes': 1 });
GeneratedContentSchema.index({ createdAt: -1 }); // Pentru sortare cronologică

// Metode virtuale
GeneratedContentSchema.virtual('completionPercentage').get(function() {
  if (this.scenes.length === 0) return 0;
  
  const completedScenes = this.scenes.filter((scene: IScene) => 
    scene.status.text === 'completed' && 
    scene.status.image === 'completed' && 
    scene.status.animation === 'completed'
  ).length;
  
  return Math.round((completedScenes / this.scenes.length) * 100);
});

// Metode de instanță
GeneratedContentSchema.methods.updateSceneStatus = function(sceneNumber: number, statusType: keyof ISceneStatus, status: 'completed' | 'pending' | 'error') {
  const scene = this.scenes.find((s: IScene) => s.sceneNumber === sceneNumber);
  if (scene) {
    scene.status[statusType] = status;
    return this.save();
  }
  throw new Error(`Scena ${sceneNumber} nu a fost găsită`);
};

// Metode statice
GeneratedContentSchema.statics.findByUser = function(userId: string, limit: number = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

GeneratedContentSchema.statics.findProcessing = function() {
  return this.find({ overallStatus: 'processing' });
};

export default mongoose.model<IGeneratedContent>('GeneratedContent', GeneratedContentSchema);
