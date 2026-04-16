# Nuclear Streaming Server

Servidor gratuito para streaming de música desde YouTube, SoundCloud, y otras fuentes.

##Endpoints

```
GET  /health          - Health check
POST /search         - Buscar canciones: { query: "artist song" }
POST /stream        - Obtener stream: { url: "youtubeURL" }
```

##Desplieguegratuito

### Opción 1: Railway
1. Ve a https://railway.app
2. Crea cuenta gratuita
3. New Project → Empty Project
4. Add Redis (no, gratis sin Redis) → desplegar desde GitHub
5. Sube este código a un repositorio GitHub
6. Railway detecta el Dockerfile

### Opción 2: Render
1. Ve a https://render.com
2. Crea cuenta gratuita
3. New → Web Service
4. Configura:
   - Build Command: (vacío)
   - Start Command: node server.js

### Opción 3: Fly.io
1. Instala flyctl
2. fly launch
3. Selecciona gratis

### Opción 4: Tu propio servidor
```bash
# Instalar dependencias
npm install

# Instalar yt-dlp
pip install yt-dlp

# Ejecutar
node server.js
```

## Uso

```bash
# Buscar
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Queen Bohemian Rhapsody"}'

# Obtener stream
curl -X POST http://localhost:3000/stream \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=xxxx"}'
```

## Límites gratuitos

| Servicio | Slots | monthly |
|----------|-------|---------|
| Railway  | 1      | 500h    |
| Render   | 1      | 750h    |
| Fly.io   | 3      | 3000h   |

Happy streaming! 🎵