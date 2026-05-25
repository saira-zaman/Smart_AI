# SmartHire AI++ - Deployment Guide

## Project Status ✅

### Completed:
- ✅ All TypeScript/React errors resolved
- ✅ API endpoints created for Gemini integration (`/api/gemini/*`)
- ✅ Build verification passed - `npm run build` successful
- ✅ Code pushed to GitHub: https://github.com/saira-zaman/Smart_AI.git
- ✅ Environment configuration ready (`.env` template)

### Architecture:
- **Frontend**: React + Vite + Tailwind CSS
- **API Layer**: Vercel serverless functions in `/api/gemini/`
  - `/api/gemini/analyze.ts` - Resume analysis
  - `/api/gemini/fixAndApply.ts` - Resume improvement
  - `/api/gemini/strategy.ts` - Career strategy
  - `/api/gemini/interviewQuestion.ts` - Interview simulation
  - `/api/gemini/evaluate.ts` - Answer evaluation

---

## Deployment to Vercel

### Option 1: Git-Connected Deployment (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import from Git → Select **GitHub**
4. Find and select **`saira-zaman/Smart_AI`** repository
5. Configure Project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` ✓
   - **Output Directory**: `dist` ✓
6. **Add Environment Variable**:
   ```
   Key: GEMINI_API_KEY
   Value: your_actual_gemini_api_key_here
   ```
7. Click **"Deploy"** → Auto-deploys on every GitHub push

### Option 2: CLI Deployment (If needed)

```bash
cd c:\projects\smarthire-ai++
npm install -g vercel
vercel --prod --env GEMINI_API_KEY=your_key_here
```

---

## Environment Variables Required

Create `.env.local` in Vercel dashboard:

```
GEMINI_API_KEY=your_google_genai_api_key
```

Get your free API key: https://aistudio.google.com/apikey

---

## Local Development

```bash
# Install dependencies
npm install

# Create .env file
cat > .env << EOF
GEMINI_API_KEY=your_key_here
APP_URL=http://localhost:3001
EOF

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
smarthire-ai++/
├── src/
│   ├── App.tsx              # Main React component
│   ├── main.tsx             # React entry point
│   ├── index.css            # Tailwind styles
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   └── services/
│       └── geminiService.ts # API client (proxies to /api/gemini)
├── api/gemini/              # Vercel serverless functions
│   ├── analyze.ts           # Resume analysis endpoint
│   ├── fixAndApply.ts       # Resume improvement endpoint
│   ├── strategy.ts          # Career strategy endpoint
│   ├── interviewQuestion.ts # Interview question endpoint
│   └── evaluate.ts          # Answer evaluation endpoint
├── vite.config.ts           # Vite configuration
├── vercel.json              # Vercel deployment config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

---

## Features

### Resume Analysis 📊
- **Selection Probability**: AI-calculated chance of acceptance
- **Skill Radar**: Proficiency level breakdown
- **Rejection Intelligence**: Brutally honest feedback
- **Missing Skills**: Roadmap to fill gaps

### Resume Improvement 🚀
- AI-powered resume rewriting
- ATS optimization
- Cover letter generation
- LinkedIn/Email outreach templates

### Interview Simulation 🎤
- Persona-based interview questions
- Real-time answer evaluation
- Feedback and scoring
- Improved answer suggestions

### Career Strategy 📈
- 30-60 day action plan
- Priority-based tasks
- Skill development roadmap

---

## Troubleshooting

### Build Errors
```bash
npm run lint  # Check TypeScript
npm run build # Full build with error details
```

### API Issues on Vercel
- Check Environment Variables are set in Vercel Dashboard
- Verify API Key has Gemini API enabled
- Check `/api/gemini/*.ts` files are present in project root

### CORS/Local Testing
- Dev server runs on `http://localhost:3001`
- API routes available at `/api/gemini/*`

---

## Next Steps

1. **Connect GitHub to Vercel**: Use git-based deployment for CI/CD
2. **Set GEMINI_API_KEY** in Vercel Environment Variables
3. **Add Custom Domain** (optional): In Vercel Dashboard
4. **Enable Analytics** (optional): Track usage

---

**Deployment Status**: Ready for Vercel  
**Last Updated**: May 25, 2026  
**GitHub**: https://github.com/saira-zaman/Smart_AI.git
