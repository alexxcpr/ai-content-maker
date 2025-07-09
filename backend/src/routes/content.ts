import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import * as contentController from '../controllers/contentController';

const router = Router();

// Middleware pentru verificarea erorilor de validare
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Datele de intrare sunt invalide',
      details: errors.array()
    });
    return;
  }
  next();
};

// Validări pentru generare conținut
const generateValidation = [
  body('userPrompt')
    .isString()
    .withMessage('Promptul trebuie să fie text')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Promptul trebuie să aibă între 10 și 5000 caractere')
    .custom((value) => {
      // Verifică dacă promptul nu conține doar spații
      if (!value || value.trim().length < 10) {
        throw new Error('Promptul trebuie să aibă conținut valid de cel puțin 10 caractere');
      }
      return true;
    }),
  body('numberOfScenes')
    .isInt({ min: 1, max: 10 })
    .withMessage('Numărul de scene trebuie să fie un număr întreg între 1 și 10'),
  body('settings')
    .isObject()
    .withMessage('Setările trebuie să fie un obiect valid'),
  body('settings.imageModel')
    .isString()
    .withMessage('Model imagine trebuie să fie de tip string'),
  body('settings.textModel')
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Model text trebuie să fie un string valid'),
  body('settings.animationModel')
    .isString()
    .withMessage('Model animație trebuie să fie de tip string'),
  body('settings.imageStyle')
    .isString()
    .withMessage('Stil imagine trebuie să fie de tip string')
];

// Validare pentru ID MongoDB
const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID-ul trebuie să fie un ObjectId MongoDB valid')
];

// Validare pentru număr scenă
const sceneNumberValidation = [
  param('sceneNumber')
    .isInt({ min: 1, max: 10 })
    .withMessage('Numărul scenei trebuie să fie un număr întreg între 1 și 10')
];

// Validare pentru actualizare scenă
const updateSceneValidation = [
  body('continut_text')
    .optional()
    .isString()
    .isLength({ max: 10000 })
    .withMessage('Conținutul text nu poate depăși 10000 caractere'),
  body('descriere_imagine')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Descrierea imaginii nu poate depăși 1000 caractere'),
  body('imagine')
    .optional()
    .isURL()
    .withMessage('URL-ul imaginii trebuie să fie valid'),
  body('descriere_animatie')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Descrierea animației nu poate depăși 1000 caractere'),
  body('imagine_animata')
    .optional()
    .isURL()
    .withMessage('URL-ul animației trebuie să fie valid'),
  body('status')
    .optional()
    .isObject()
    .withMessage('Status-ul trebuie să fie un obiect valid'),
  body('status.text')
    .optional()
    .isIn(['completed', 'pending', 'error'])
    .withMessage('Status text trebuie să fie: completed, pending sau error'),
  body('status.image')
    .optional()
    .isIn(['completed', 'pending', 'error'])
    .withMessage('Status imagine trebuie să fie: completed, pending sau error'),
  body('status.animation')
    .optional()
    .isIn(['completed', 'pending', 'error'])
    .withMessage('Status animație trebuie să fie: completed, pending sau error')
];

// Middleware pentru rate limiting specific pentru generare
const generationRateLimit = (req: Request, res: Response, next: NextFunction) => {
  // Aici poți adăuga logică suplimentară pentru rate limiting
  // de exemplu, verificare în baza de date pentru utilizatori specifici
  next();
};

// Middleware pentru logging
const logRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
};

// Aplicare middleware global pentru toate rutele
router.use(logRequest);

// Rute cu validări și middleware
router.post('/generate', 
  generationRateLimit,
  generateValidation, 
  handleValidationErrors, 
  contentController.generateContent
);

router.get('/:id', 
  mongoIdValidation, 
  handleValidationErrors, 
  contentController.getContent
);

router.get('/:id/scene/:sceneNumber', 
  mongoIdValidation,
  sceneNumberValidation,
  handleValidationErrors, 
  contentController.getScene
);

router.put('/:id/scene/:sceneNumber', 
  mongoIdValidation,
  sceneNumberValidation,
  updateSceneValidation,
  handleValidationErrors, 
  contentController.updateScene
);

router.get('/settings/models', 
  contentController.getAvailableModels
);

// Rută pentru obținerea statisticilor (opțional)
router.get('/stats/:userId', 
  param('userId').isString().withMessage('User ID trebuie să fie string'),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      // Această rută poate fi implementată pentru a afișa statistici utilizator
      res.json({ message: 'Statistics endpoint - to be implemented' });
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(500).json({ error: 'Eroare internă la server' });
    }
  }
);

export default router;
