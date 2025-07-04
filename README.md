# AI Content Maker

O aplicație full-stack pentru generarea de conținut AI, construită cu tehnologii moderne.

## 🚀 Tehnologii Utilizate

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Siguranța tipurilor
- **Next.js 14** - Framework React cu SSR/SSG
- **Tailwind CSS** - Styling modern

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Siguranța tipurilor

### Baza de Date
- **MongoDB Atlas** - Baza de date cloud NoSQL

## 📁 Structura Proiectului

```
ai-content-maker/
├── frontend/          # Aplicația Next.js
│   ├── src/
│   │   ├── app/      # App Router (Next.js 13+)
│   │   ├── components/
│   │   └── lib/
│   └── package.json
├── backend/           # Server Express.js
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── config/
│   └── package.json
└── package.json       # Workspace principal
```

## 🛠️ Instalare și Configurare

### 1. Instalarea dependințelor
```bash
npm run install:all
```

### 2. Configurarea variabilelor de mediu
```bash
# În directorul backend
cp .env.example .env
# Editează .env cu configurațiile tale MongoDB Atlas
```

### 3. Rularea în modul dezvoltare
```bash
npm run dev
```

Aceasta va porni:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
```

### Backend (Railway/Render)
```bash
cd backend
npm run build
npm start
```

## 📝 Scripturi Disponibile

- `npm run dev` - Pornește ambele aplicații în modul dezvoltare
- `npm run build` - Construiește ambele aplicații pentru producție
- `npm run start` - Pornește ambele aplicații în modul producție
- `npm run dev:frontend` - Pornește doar frontend-ul
- `npm run dev:backend` - Pornește doar backend-ul

## 🔧 Configurare MongoDB Atlas

1. Creează un cont pe [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Creează un cluster nou
3. Obține connection string-ul
4. Adaugă-l în fișierul `.env` din backend

## 📦 Dependințe Principale

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios pentru HTTP requests

### Backend
- Express.js
- Mongoose pentru MongoDB
- CORS pentru cross-origin requests
- dotenv pentru variabile de mediu
- bcryptjs pentru hash-urile parolelor
- jsonwebtoken pentru autentificare

## 🤝 Contribuții

Contribuțiile sunt binevenite! Te rugăm să deschizi o issue mai întâi pentru a discuta schimbările propuse.

## 📄 Licență

Acest proiect este licențiat sub [MIT License](LICENSE). 