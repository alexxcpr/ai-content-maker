# AI Content Maker

O aplicație web pentru generarea de conținut multimedia bazată pe inteligență artificială. Transformă ideile tale în povești vizuale captivante cu text, imagini și animații generate automat.

## 🚀 Caracteristici

- **Generare Scene Narative**: Creează automat între 1-10 scene bazate pe promptul utilizatorului
- **Generare Imagini**: Integrare cu Google Gemini și CGDream AI
- **Animații**: Suport pentru Kling AI și Runway ML
- **Stiluri Variate**: Realistic, Cartoon, Artistic, Abstract
- **Interfață Modernă**: Design responsiv cu dark mode și efecte glass-morphism
- **Tracking în Timp Real**: Vizualizează progresul generării pentru fiecare scenă

## 🛠️ Tehnologii Utilizate

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Stilizare
- **React 19** - UI Library

### Backend
- **Express.js** - Server framework
- **MongoDB** - Bază de date
- **Mongoose** - ODM pentru MongoDB
- **TypeScript** - Type safety

## 📦 Instalare

### Cerințe
- Node.js 18+ 
- MongoDB Atlas account sau MongoDB local
- API Keys pentru serviciile AI (opțional în development)

### Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### Setup Backend

```bash
cd backend
npm install

# Creați fișierul .env cu variabilele necesare
cp .env.example .env

npm run dev
```

## 🔧 Configurare

### Variabile de Mediu Backend (.env)

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key
```

### Variabile de Mediu Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🎯 Utilizare

1. Accesați aplicația la `http://localhost:3000`
2. Introduceți o descriere pentru conținutul dorit
3. Selectați numărul de scene (1-10)
4. Alegeți modelele AI și stilul imaginilor
5. Click pe "Generează Conținut"
6. Urmăriți progresul în timp real
7. Vizualizați și descărcați rezultatele

## 📁 Structură Proiect

```
ai-content-maker/
├── frontend/           # Aplicație Next.js
│   ├── src/
│   │   ├── app/       # Pagini și layout
│   │   ├── components/# Componente React
│   │   ├── services/  # Servicii API
│   │   └── types/     # TypeScript types
│   └── public/        # Assets statice
├── backend/           # API Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/    # Modele MongoDB
│   │   ├── routes/    # API endpoints
│   │   └── services/  # Integrări externe
│   └── package.json
└── README.md
```

## 🔄 API Endpoints

- `POST /api/content/generate` - Generează conținut nou
- `GET /api/content/:id` - Obține conținut după ID
- `GET /api/content/:id/scene/:n` - Obține o scenă specifică
- `PUT /api/content/:id/scene/:n` - Actualizează o scenă
- `GET /api/content/settings/models` - Lista modele disponibile

## 🎨 Funcționalități Viitoare

- [ ] Integrare reală cu API-urile AI
- [ ] Export video complet
- [ ] Text-to-speech pentru narator
- [ ] Editare manuală scene
- [ ] Salvare template-uri
- [ ] Sharing și colaborare

## 📝 Licență

MIT

## 👥 Contribuții

Contribuțiile sunt binevenite! Vă rugăm să deschideți un issue sau pull request.

---

Dezvoltat cu ❤️ folosind AI și tehnologii moderne web. 