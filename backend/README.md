# AI Content Maker - Backend

Backend API pentru aplicația AI Content Maker.

## Configurare

1. Instalați dependențele:
```bash
npm install
```

2. Creați un fișier `.env` în directorul root și adăugați următoarele variabile:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-content-maker?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Porniți serverul:
```bash
npm run dev
```

## API Endpoints

### Content Generation

- `POST /api/content/generate` - Generează conținut nou
- `GET /api/content/:id` - Obține conținut după ID
- `GET /api/content/:id/scene/:sceneNumber` - Obține o scenă specifică
- `PUT /api/content/:id/scene/:sceneNumber` - Actualizează o scenă
- `GET /api/content/settings/models` - Obține modelele disponibile

### Exemplu Request

```json
POST /api/content/generate
{
  "userPrompt": "Creează o poveste despre un astronaut",
  "numberOfScenes": 3,
  "settings": {
    "imageModel": "gemini",
    "textModel": "gemini-pro",
    "animationModel": "kling",
    "imageStyle": "realistic"
  }
}
```

## Structură Proiect

```
backend/
├── src/
│   ├── controllers/    # Logica de business
│   ├── models/        # Modele MongoDB
│   ├── routes/        # Definirea rutelor API
│   ├── services/      # Servicii externe (AI integrations)
│   ├── middleware/    # Middleware Express
│   └── index.ts       # Entry point
├── package.json
└── tsconfig.json
```