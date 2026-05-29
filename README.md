<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d1b9489b-6d8f-4e26-93e4-c3cb97ed63a5

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env` to your Gemini API key.
3. Run the app:
   `npm run dev`

`npm run dev` starts both the Vite frontend on port 3000 and the local mock API on port 4000. If you only start Vite, API actions such as "Extract job match score" will fail locally because `/api/gemini` has nothing to proxy to.
