

<div align="center">

**[ [🌐 Live Demo](https://neuroweave-ai-two.vercel.app/) ] — [ [📦 GitHub](https://github.com/nishantkr2003/NeuroWeave-AI) ]**

*A production-grade multimodal AI assistant — see it, hear it, read it, understand it.*

---

</div>

## ◈ What Is This?

NeuroWeave is a full-stack multimodal AI platform that lets you have intelligent conversations with **images, video, audio, and documents** — all in one interface.

Upload a chart, a voice memo, a scanned invoice, or a raw video clip. Ask questions. Get answers. Compare up to 10 files in a single AI context window. Export the entire session as Markdown or HTML.

Powered by **Google Gemini 1.5 Pro** for vision and reasoning, **Groq Whisper** for transcription, and streamed in real time via Server-Sent Events.

---

## ◈ Capability Map

```
INPUT                      PIPELINE                      OUTPUT
──────────────────────────────────────────────────────────────────────
🖼  Image         ──▶  Gemini Vision          ──▶  Q&A / OCR / Structured Data
🎬  Video         ──▶  FFmpeg + Gemini        ──▶  Frame Analysis / Temporal Q&A
🎙  Audio         ──▶  Groq Whisper           ──▶  Transcript / Diarization / Actions
📄  Document      ──▶  Gemini Vision          ──▶  Multi-page Analysis / Tables / Handwriting
🔀  Compare       ──▶  Multi-file Context     ──▶  Cross-file Reasoning (up to 10 files)
💬  Chat          ──▶  SSE Stream             ──▶  Full Conversation History
```

---

## ◈ Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js · Express · TypeScript |
| Database | MongoDB (Mongoose) |
| Media Storage | Cloudinary |
| Vision + LLM | Google Gemini 1.5 Pro |
| Transcription | Groq Whisper |
| Media Processing | FFmpeg · Sharp |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Animations | Framer Motion |
| Graphics | WebGL (OGL) |

---

## ◈ Prerequisites

Before anything else, verify these are installed on your machine:

```bash
node -v        # must be >= 18.0.0
npm -v         # must be >= 9.0.0
ffmpeg -version  # any recent version
git --version    # any version
```

**Installing FFmpeg**

```bash
# macOS
brew install ffmpeg

# Ubuntu / Debian
sudo apt update && sudo apt install -y ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
# Extract and add the bin/ folder to your system PATH
```

---

## ◈ API Keys You'll Need

All free tiers are sufficient for local development. Get these before running the project.

| Service | What It's For | Where to Get It |
|---|---|---|
| **MongoDB Atlas** | Database | [cloud.mongodb.com](https://cloud.mongodb.com) → free M0 cluster |
| **Cloudinary** | Media storage & CDN | [cloudinary.com](https://cloudinary.com) → free tier |
| **Google Gemini** | Vision + text reasoning | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| **Groq** | Whisper transcription + LLM | [console.groq.com/keys](https://console.groq.com/keys) → free tier |

---

## ◈ Project Layout

```
neuroweave-ai/
│
├── backend/                       ← Express + TypeScript API server
│   └── src/
│       ├── config/                   DB · Cloudinary · Multer config
│       ├── controllers/              auth · upload · analyze · chat · compare
│       ├── middleware/               JWT auth · error handling · file validation
│       ├── models/                   User · Media · Conversation (Mongoose)
│       ├── routes/                   Express route definitions
│       ├── services/                 Gemini · Groq · FFmpeg · Sharp · Cloudinary
│       ├── utils/                    token counter · scheduler · file utils
│       └── server.ts                 Entry point
│
└── frontend/                      ← Next.js App Router application
    └── src/
        ├── app/                      landing · login · register · app pages
        ├── components/               chat · media · analysis · layout UI
        ├── hooks/                    SSE · upload · clipboard · auth hooks
        ├── lib/                      API client · auth helpers · utilities
        ├── store/                    Zustand stores (auth · chat · media)
        └── types/                    Shared TypeScript types
```

---

## ◈ Local Setup — Step by Step

### Step 1 — Clone the repo

```bash
git clone https://github.com/nishantkr2003/NeuroWeave-AI.git
cd NeuroWeave-AI
```

---

### Step 2 — Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and fill in every variable:

```env
# ── Server ────────────────────────────────────
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# ── MongoDB ───────────────────────────────────
# Atlas → Clusters → Connect → Drivers → copy URI
# Replace <username>, <password>, <dbname>
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/multimodal_ai

# ── JWT ───────────────────────────────────────
# Any random string, minimum 32 characters
JWT_SECRET=change_this_to_a_long_random_secret_minimum_32_chars
JWT_EXPIRES_IN=7d

# ── Cloudinary ────────────────────────────────
# cloudinary.com → Dashboard → API Keys
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── Google Gemini ─────────────────────────────
GEMINI_API_KEY=your_gemini_api_key

# ── Groq ──────────────────────────────────────
GROQ_API_KEY=your_groq_api_key

# ── File Handling ─────────────────────────────
MAX_FILE_SIZE=104857600        # 100 MB
FILE_MAX_AGE_HOURS=24
```

Verify FFmpeg, then start:

```bash
ffmpeg -version       # confirm it's available
npm run typecheck     # optional but recommended
npm run dev           # starts on http://localhost:5000
```

Health check — open http://localhost:5000/health, you should see:

```json
{
  "status": "ok",
  "timestamp": "...",
  "environment": "development",
  "uptime": 4.2
}
```

---

### Step 3 — Frontend

Open a **new terminal** (keep the backend running):

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

`frontend/.env.local` only needs one variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
npm run dev     # starts on http://localhost:3000
```

Open http://localhost:3000 — you're in.

---

### Running Both at Once

```bash
# Terminal 1
cd backend && npm run dev    # → http://localhost:5000

# Terminal 2
cd frontend && npm run dev   # → http://localhost:3000
```

Or with `concurrently` from the project root:

```bash
npm install -g concurrently

concurrently \
  "cd backend && npm run dev" \
  "cd frontend && npm run dev"
```

---

## ◈ Available Scripts

**Backend** (`/backend`)

| Command | What It Does |
|---|---|
| `npm run dev` | Development server with hot-reload (ts-node + nodemon) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm run start` | Run compiled production build from `dist/server.js` |
| `npm run typecheck` | Type check without emitting files |

**Frontend** (`/frontend`)

| Command | What It Does |
|---|---|
| `npm run dev` | Next.js dev server on port 3000 |
| `npm run build` | Optimised production build → `.next/` |
| `npm run start` | Serve production build (requires `build` first) |
| `npm run lint` | ESLint across all source files |

---

## ◈ API Reference

All endpoints are prefixed with `/api`. Protected routes require:
```
Authorization: Bearer <token>
```

### Authentication
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ✗ | Create account |
| POST | `/auth/login` | ✗ | Login → receive JWT |
| GET | `/auth/me` | ✓ | Get current user profile |
| POST | `/auth/logout` | ✗ | Clear auth cookie |

### File Upload
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/upload` | ✓ | Upload 1–10 files (field: `files`) |
| POST | `/upload/single` | ✓ | Upload single file (field: `file`) |
| POST | `/upload/clipboard` | ✓ | Upload base64 image from clipboard |
| GET | `/media` | ✓ | List your media (paginated) |
| GET | `/media/:id` | ✓ | Single media item + analysis |
| DELETE | `/media/:id` | ✓ | Delete from DB and Cloudinary |

### Analysis
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/analyze/image` | ✓ | General image analysis |
| POST | `/analyze/image/ocr` | ✓ | Extract visible text |
| POST | `/analyze/image/structured` | ✓ | Extract structured data (invoices, tables, forms) |
| POST | `/analyze/image/chart` | ✓ | Analyze charts, extract data points |
| POST | `/analyze/video` | ✓ | Frame extraction + video analysis |
| POST | `/analyze/video/temporal-qa` | ✓ | Q&A at specific timestamps |
| POST | `/analyze/audio` | ✓ | Transcription + diarization (Groq Whisper) |
| POST | `/analyze/document` | ✓ | Document image / PDF analysis |
| POST | `/analyze/document/multipage` | ✓ | Multi-page analysis as one document |

### Chat
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/chat` | ✓ | Non-streaming message |
| GET | `/chat/stream` | ✓ | SSE streaming response |
| GET | `/chat/conversations` | ✓ | List conversations |
| GET | `/chat/conversations/:id` | ✓ | Conversation + full message history |
| DELETE | `/chat/conversations/:id` | ✓ | Delete conversation |
| POST | `/chat/conversations/:id/regenerate` | ✓ | Regenerate last response |
| POST | `/chat/conversations/:id/clear` | ✓ | Clear all messages |
| GET | `/chat/conversations/:id/export` | ✓ | Export as `?format=md` or `?format=html` |

### Compare & Batch
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/compare` | ✓ | Compare 2–10 files in one context window |
| POST | `/batch` | ✓ | Same analysis on up to 10 images → grid result |

### Gallery
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/gallery/gallery` | ✓ | Session media grouped by type (last 24h) |
| GET | `/gallery/:id/waveform` | ✓ | Audio waveform peak data |

---

## ◈ Environment Variables Reference

**Backend** (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Server port |
| `NODE_ENV` | No | — | `development` or `production` |
| `CLIENT_URL` | **Yes** | — | Frontend URL for CORS |
| `MONGODB_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Signing secret (min 32 chars) |
| `JWT_EXPIRES_IN` | No | `7d` | Token lifetime |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | — | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | **Yes** | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | **Yes** | — | Cloudinary API secret |
| `GEMINI_API_KEY` | **Yes** | — | Google Gemini API key |
| `GROQ_API_KEY` | **Yes** | — | Groq API key |
| `MAX_FILE_SIZE` | No | `104857600` | Max upload size in bytes (100 MB) |
| `FILE_MAX_AGE_HOURS` | No | `24` | Temp file retention period |

**Frontend** (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Yes** | Backend base URL (e.g. `http://localhost:5000`) |

---

## ◈ Troubleshooting

```
✗  MongoDB connection failed
```
→ Check your `MONGODB_URI`. In MongoDB Atlas, go to **Network Access → Add IP Address** and whitelist `0.0.0.0/0` for local development.

---

```
✗  Cloudinary credentials are missing
```
→ All three Cloudinary variables must be set: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

---

```
✗  File upload returns 400 — File type not supported
```
→ The backend validates files using **magic bytes**, not extensions. Supported formats: `JPEG · PNG · GIF · WebP · BMP · MP4 · WebM · MOV · AVI · MP3 · WAV · M4A · OGG · FLAC · PDF · TXT · CSV · JSON`

---

```
✗  Video analysis fails — FFprobe failed
```
→ FFmpeg is missing or not in PATH. Run `ffmpeg -version` to confirm. See Prerequisites above.

---

```
✗  GROQ_API_KEY is not configured
```
→ Add your Groq key to `backend/.env`. Get one free at [console.groq.com/keys](https://console.groq.com/keys).

---

```
✗  Frontend shows blank page after login
```
→ Make sure `NEXT_PUBLIC_API_URL` in `frontend/.env.local` points to the running backend and that the backend is actually running.

---

```
✗  CORS error in browser console
```
→ `CLIENT_URL` in backend `.env` must exactly match your frontend origin including port — e.g. `http://localhost:3000`. No trailing slash.

---

```
✗  SSE streaming does not work
```
→ Server-Sent Events require an open HTTP connection. Ensure no proxy (nginx, corporate firewall) is buffering responses. Should work out of the box in development.

---

## ◈ Deployment

| Service | Platform |
|---|---|
| Backend API | **Render** |
| Frontend App | **Vercel** |

---

## ◈ Supported File Formats

```
Images    →  JPEG  PNG  GIF  WebP  BMP
Video     →  MP4  WebM  MOV  AVI
Audio     →  MP3  WAV  M4A  OGG  FLAC
Documents →  PDF  TXT  CSV  JSON
```

---

## ◈ License

MIT — use it, fork it, build on it.

---

<div align="center">

*Built with precision. Powered by Gemini + Groq.*

**[ [🌐 Live Demo](https://neuroweave-ai-two.vercel.app/) ] — [ [📦 Source](https://github.com/nishantkr2003/NeuroWeave-AI) ]**

</div>
