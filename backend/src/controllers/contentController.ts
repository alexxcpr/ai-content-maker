import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import GeneratedContent, { IGeneratedContent } from '../models/GeneratedContent';
import * as aiService from '../services/aiIntegrations';

import { GenerationSettings } from '../types/content.types';
import { 
  TextGenerationModel,
  AITextGenerationRequest,
  AIImageGenerationRequest,
  AIAnimationGenerationRequest,
  ImageGenerationModel,
  AnimationGenerationModel,
  AISceneResponse
} from '../types/ai.generation.types';

/**
 * Generează conținut nou
 */
export const generateContent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Afișează JSON-ul complet primit din frontend
    console.log('==== REQUEST BODY COMPLET ====');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('=============================');

    // Verifică erorile de validare
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('errors', errors.array());
      res.status(400).json({ 
        error: 'Datele de intrare sunt invalide',
        details: errors.array()
      });
      return;
    }

    const { userPrompt, numberOfScenes, settings } = req.body as { userPrompt: string, numberOfScenes: number, settings: GenerationSettings };
    const userId = req.body.userId || 'anonymous'; // În producție, ar veni din autentificare

    console.log('userPrompt', userPrompt);
    console.log('numberOfScenes', numberOfScenes);
    console.log('settings', settings);
    // Validări adiționale
    if (!userPrompt || typeof userPrompt !== 'string') {
      res.status(400).json({ error: 'Promptul utilizatorului este necesar' });
      return;
    }

    if (!numberOfScenes || !Number.isInteger(numberOfScenes) || numberOfScenes < 1 || numberOfScenes > 10) {
      res.status(400).json({ error: 'Numărul de scene trebuie să fie între 1 și 10' });
      return;
    }

    if (!settings || typeof settings !== 'object') {
      res.status(400).json({ error: 'Setările sunt necesare' });
      return;
    }

    // Validare prompt
    const validation = aiService.validatePrompt(userPrompt);
    if (!validation.valid) {
      res.status(400).json({ error: validation.message });
      return;
    }

    // Verifică dacă utilizatorul nu are prea multe cereri în procesare
    const existingProcessing = await GeneratedContent.countDocuments({
      userId,
      overallStatus: 'processing'
    });

    if (existingProcessing >= 3) {
      res.status(429).json({ 
        error: 'Aveți prea multe cereri în procesare. Vă rugăm așteptați finalizarea lor.' 
      });
      return;
    }

    // Creează documentul inițial
    const generatedContent = new GeneratedContent({
      userId,
      userPrompt,
      settings: {
        numberOfScenes: numberOfScenes,
        imageModel: settings.imageModel,
        textModel: settings.textModel,
        animationModel: settings.animationModel,
        imageStyle: settings.imageStyle,
        // Includem și celelalte proprietăți relevante
        aspectRatio: settings.aspectRatio,
        animationsEnabled: settings.animationsEnabled,
        soundEnabled: settings.soundEnabled,
        referenceCharacterImage: settings.referenceCharacterImage,
        referenceBackgroundImage: settings.referenceBackgroundImage,
        characterInfluence: settings.characterInfluence,
        backgroundInfluence: settings.backgroundInfluence,
      },
      scenes: [],
      overallStatus: 'processing'
    });

    // Salvează documentul pentru a obține ID
    await generatedContent.save();

    // Trimite răspuns imediat cu ID-ul pentru tracking
    res.status(201).json({
      message: 'Generare inițiată',
      contentId: generatedContent._id,
      status: 'processing'
    });

    // Procesează asincron
    generateScenesContentWithAI(generatedContent).catch(error => {
      console.error('Eroare în procesarea asincronă:', error);
    });

  } catch (error) {
    console.error('Eroare la generare conținut:', error);
    res.status(500).json({ error: 'Eroare internă la server' });
  }
};

/**
 * Obține conținutul generat după ID
 */
export const getContent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Verifică erorile de validare
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        error: 'ID invalid',
        details: errors.array()
      });
      return;
    }

    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'ID-ul este necesar' });
      return;
    }

    const content = await GeneratedContent.findById(id);

    if (!content) {
      res.status(404).json({ error: 'Conținut negăsit' });
      return;
    }

    res.json(content);
  } catch (error) {
    console.error('Eroare la obținere conținut:', error);
    
    // Verifică dacă este eroare de MongoDB ObjectId invalid
    if (error instanceof Error && error.message.includes('ObjectId')) {
      res.status(400).json({ error: 'ID invalid' });
      return;
    }
    
    res.status(500).json({ error: 'Eroare internă la server' });
  }
};

/**
 * Obține o scenă specifică
 */
export const getScene = async (req: Request, res: Response): Promise<void> => {
  try {
    // Verifică erorile de validare
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        error: 'Parametri invalizi',
        details: errors.array()
      });
      return;
    }

    const { id, sceneNumber } = req.params;
    const sceneNum = parseInt(sceneNumber);

    if (!id) {
      res.status(400).json({ error: 'ID-ul conținutului este necesar' });
      return;
    }

    if (isNaN(sceneNum) || sceneNum < 1 || sceneNum > 10) {
      res.status(400).json({ error: 'Numărul scenei trebuie să fie între 1 și 10' });
      return;
    }

    const content = await GeneratedContent.findById(id);

    if (!content) {
      res.status(404).json({ error: 'Conținut negăsit' });
      return;
    }

    const scene = content.scenes.find(s => s.sceneNumber === sceneNum);
    if (!scene) {
      res.status(404).json({ error: 'Scena negăsită' });
      return;
    }

    res.json(scene);
  } catch (error) {
    console.error('Eroare la obținere scenă:', error);
    
    if (error instanceof Error && error.message.includes('ObjectId')) {
      res.status(400).json({ error: 'ID invalid' });
      return;
    }
    
    res.status(500).json({ error: 'Eroare internă la server' });
  }
};

/**
 * Actualizează o scenă specifică
 */
export const updateScene = async (req: Request, res: Response): Promise<void> => {
  try {
    // Verifică erorile de validare
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        error: 'Parametri invalizi',
        details: errors.array()
      });
      return;
    }

    const { id, sceneNumber } = req.params;
    const updateData = req.body;
    const sceneNum = parseInt(sceneNumber);

    if (!id) {
      res.status(400).json({ error: 'ID-ul conținutului este necesar' });
      return;
    }

    if (isNaN(sceneNum) || sceneNum < 1 || sceneNum > 10) {
      res.status(400).json({ error: 'Numărul scenei trebuie să fie între 1 și 10' });
      return;
    }

    if (!updateData || typeof updateData !== 'object') {
      res.status(400).json({ error: 'Datele de actualizare sunt necesare' });
      return;
    }

    const content = await GeneratedContent.findById(id);
    if (!content) {
      res.status(404).json({ error: 'Conținut negăsit' });
      return;
    }

    const sceneIndex = content.scenes.findIndex(s => s.sceneNumber === sceneNum);
    if (sceneIndex === -1) {
      res.status(404).json({ error: 'Scena negăsită' });
      return;
    }

    // Validează și sanitizează datele de actualizare
    const allowedFields = ['continut_text', 'descriere_imagine', 'imagine', 'descriere_animatie', 'imagine_animata', 'status'];
    const sanitizedData: any = {};

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        sanitizedData[key] = value;
      }
    }

    // Actualizează scena
    content.scenes[sceneIndex] = {
      ...content.scenes[sceneIndex],
      ...sanitizedData
    };

    await content.save();
    res.json(content.scenes[sceneIndex]);
  } catch (error) {
    console.error('Eroare la actualizare scenă:', error);
    
    if (error instanceof Error && error.message.includes('ObjectId')) {
      res.status(400).json({ error: 'ID invalid' });
      return;
    }
    
    res.status(500).json({ error: 'Eroare internă la server' });
  }
};

/**
 * Obține lista de modele disponibile
 */
export const getAvailableModels = async (req: Request, res: Response): Promise<void> => {
  try {
    const models = aiService.getAvailableModels();
    
    // Add cache control headers to allow frontend to cache the result
    // res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.json(models);
  } catch (error) {
    console.error('Eroare la obținere modele:', error);
    res.status(500).json({ error: 'Eroare internă la server' });
  }
};

/**
 * Procesează generarea conținutului asincron folosind modelul de AI selectat
 */
async function generateScenesContentWithAI(content: IGeneratedContent) {
  try {
    const { userPrompt, settings } = content;
    let sceneTemplates: AISceneResponse[] = [];

    // Selectăm metoda de generare text în funcție de modelul ales
    console.log(`Using text generation model: ${settings.textModel}`);

    // Construim obiectul de request pentru generarea de text
    const textGenerationRequest: AITextGenerationRequest = {
      prompt: userPrompt,
      numberOfScenes: settings.numberOfScenes,
      model: settings.textModel,
      language: 'ro'
    };

    // Generează conținutul text cu modelul selectat
    if (settings.textModel.startsWith('gemini')) {
      sceneTemplates = await aiService.generateContent(
        textGenerationRequest.prompt,
        textGenerationRequest.numberOfScenes,
        settings.textModel as TextGenerationModel
      );
    } else if (settings.textModel.startsWith('gpt')) {
      sceneTemplates = await aiService.generateContent(
        textGenerationRequest.prompt,
        textGenerationRequest.numberOfScenes,
        settings.textModel as TextGenerationModel
      );
    } else {
      throw new Error(`Model de text nesupportat: ${settings.textModel}`);
    }

    // Verifică dacă avem suficiente template-uri
    if (!sceneTemplates || sceneTemplates.length === 0) {
      throw new Error('Nu s-au putut genera template-urile pentru scene');
    }

    // Creează scenele bazate pe template-uri
    for (let i = 0; i < Math.min(sceneTemplates.length, settings.numberOfScenes); i++) {
      const template = sceneTemplates[i];
      
      if (!template || !template.continut_text) {
        console.warn(`Template invalid pentru scena ${i + 1}`);
        continue;
      }
      
      content.scenes.push({
        sceneNumber: i + 1, // Folosește index-ul real, nu template.sceneNumber
        continut_text: template.continut_text,
        descriere_imagine: template.descriere_imagine || '',
        descriere_animatie: template.descriere_animatie || '',
        imagine: null,
        imagine_animata: null,
        status: {
          text: 'completed',
          image: 'pending',
          animation: 'pending'
        }
      } as any);
    }

    await content.save();

    // Pas 2: Generează imaginile pentru fiecare scenă
    for (let i = 0; i < content.scenes.length; i++) {
      const scene = content.scenes[i];
      
      try {
        if (!scene.descriere_imagine) {
          scene.status.image = 'error';
          continue;
        }

        // Construim obiectul de request pentru generarea de imagini
        const imageGenerationRequest: AIImageGenerationRequest = {
          description: scene.descriere_imagine,
          model: settings.imageModel,
          style: settings.imageStyle,
          aspectRatio: settings.aspectRatio,
          referenceImage: settings.referenceCharacterImage
        };

        const imageUrl = await aiService.generateImage(
          imageGenerationRequest.description,
          imageGenerationRequest.model,
          imageGenerationRequest.style
        );

        scene.imagine = imageUrl;
        scene.status.image = 'completed';
        await content.save();
      } catch (error) {
        console.error(`Eroare la generare imagine pentru scena ${i + 1}:`, error);
        scene.status.image = 'error';
        await content.save();
      }
    }

    // Pas 3: Generează animațiile (opțional, poate fi dezactivat)
    if (settings.animationsEnabled) {
      for (let i = 0; i < content.scenes.length; i++) {
        const scene = content.scenes[i];
        
        if (scene.imagine && scene.status.image === 'completed' && scene.descriere_animatie) {
          try {
            // Construim obiectul de request pentru generarea de animații
            const animationGenerationRequest: AIAnimationGenerationRequest = {
              imageUrl: scene.imagine,
              description: scene.descriere_animatie,
              model: settings.animationModel,
              duration: 5, // Default duration in seconds
              fps: 24 // Default fps
            };

            const animationUrl = await aiService.generateAnimation(
              animationGenerationRequest.imageUrl,
              animationGenerationRequest.description,
              animationGenerationRequest.model
            );

            scene.imagine_animata = animationUrl;
            scene.status.animation = 'completed';
            await content.save();
          } catch (error) {
            console.error(`Eroare la generare animație pentru scena ${i + 1}:`, error);
            scene.status.animation = 'error';
            await content.save();
          }
        } else {
          // Marchează animația ca error dacă nu poate fi generată
          scene.status.animation = 'error';
        }
      }
    } else {
      // Dacă animațiile sunt dezactivate, marchează toate statusurile de animație ca 'error'
      for (const scene of content.scenes) {
        scene.status.animation = 'error';
      }
      await content.save();
    }

    // Determină status-ul general
    const allCompleted = content.scenes.every(scene => 
      scene.status.text === 'completed' && 
      scene.status.image === 'completed' && 
      (settings.animationsEnabled ? scene.status.animation === 'completed' : true)
    );

    const hasErrors = content.scenes.some(scene =>
      scene.status.text === 'error' ||
      scene.status.image === 'error' ||
      (settings.animationsEnabled ? scene.status.animation === 'error' : false)
    );

    if (allCompleted) {
      content.overallStatus = 'completed';
    } else if (hasErrors) {
      content.overallStatus = 'partial';
    }

    await content.save();
    console.log(`Procesare completă pentru conținut ${content._id}`);

  } catch (error) {
    console.error('Eroare în procesarea conținutului:', error);
    
    try {
      content.overallStatus = 'error';
      await content.save();
    } catch (saveError) {
      console.error('Eroare la salvarea status-ului de eroare:', saveError);
    }
  }
}
