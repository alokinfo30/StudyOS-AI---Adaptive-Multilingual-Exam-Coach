import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { sendVerificationEmail, verifyEmailCode } from './src/server/emailAuth';

dotenv.config();

function apiDevServerPlugin(): Plugin {
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const parseBody = (): Promise<any> => {
          return new Promise((resolve) => {
            let data = '';
            req.on('data', (chunk) => {
              data += chunk;
            });
            req.on('end', () => {
              try {
                resolve(JSON.parse(data || '{}'));
              } catch {
                resolve({});
              }
            });
          });
        };

        res.setHeader('Content-Type', 'application/json');

        try {
          if (req.url === '/api/auth/send-verification-code' && req.method === 'POST') {
            const body = await parseBody();
            const { email, studentName } = body;
            if (!email || typeof email !== 'string' || !email.includes('@')) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Valid email is required' }));
              return;
            }
            const result = await sendVerificationEmail(email, studentName);
            res.end(JSON.stringify(result));
            return;
          }

          if (req.url === '/api/auth/verify-code' && req.method === 'POST') {
            const body = await parseBody();
            const { email, code } = body;
            if (!email || !code) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, verified: false, error: 'Email and code are required' }));
              return;
            }
            const result = verifyEmailCode(email, code);
            res.end(JSON.stringify(result));
            return;
          }

          if (req.url === '/api/ai/tutor' && req.method === 'POST') {
            const body = await parseBody();
            const { prompt, language = 'en', conceptTitle, context, mode = 'socratic' } = body;

            if (!ai) {
              res.end(JSON.stringify({
                success: true,
                text: `[Offline Mode] Here is the step-by-step concept breakdown for **${conceptTitle || 'this topic'}** in ${language}: Focus on key principles, apply the core formula, and check units carefully.`,
                fallback: true,
              }));
              return;
            }

            const response = await ai.models.generateContent({
              model: 'gemini-3.7-flash',
              contents: `Concept: ${conceptTitle || 'General Concept'}\nContext: ${context || 'Study Session'}\nStudent Query: ${prompt}`,
              config: {
                systemInstruction: `You are StudyOS AI, an expert exam coach for Class 10/12, JEE, NEET, and Board Exams.
Language preference: ${language}.
If language is "hi", explain in conversational Hindi with English scientific/technical terms preserved.
If language is "hinglish", explain in Smart Hinglish (conversational Hindi syntax + technical terms in English).
Preserve formulas ($F = ma$, $V = IR$). Mode: ${mode}. Never give answers directly when Socratic guidance is better.`,
                temperature: 0.7,
              },
            });

            res.end(JSON.stringify({
              success: true,
              text: response.text || 'Let us explore this step by step.',
            }));
            return;
          }

          if (req.url === '/api/ai/explain-differently' && req.method === 'POST') {
            const body = await parseBody();
            const { conceptTitle, formula, explanation, style = 'analogy', language = 'en' } = body;

            if (!ai) {
              res.end(JSON.stringify({
                success: true,
                text: `[Offline Mode] **${conceptTitle}** explanation in ${style} style: Remember the relationship ${formula || ''}. Imagine flow in a closed system where obstacles resist movement.`,
                fallback: true,
              }));
              return;
            }

            const styleInstructions: Record<string, string> = {
              simple: 'Explain to a 10-year-old with simple intuition and zero jargon.',
              analogy: 'Use an unforgettable real-life everyday Indian analogy (cricket, kitchen, traffic, water pipes, train journeys).',
              visual: 'Explain using a clear structured textual diagram / ASCII flow and step-by-step spatial breakdown.',
              socratic: 'Ask 3 progressive questions that guide the student to discover the underlying formula or rule on their own.',
              hinglish: 'Explain in Smart Hinglish (English technical terms + conversational Hindi).',
              practice_check: 'Provide 1 quick check question with 4 options and detailed explanation to verify this exact concept.',
            };

            const response = await ai.models.generateContent({
              model: 'gemini-3.7-flash',
              contents: `Concept: ${conceptTitle}\nFormula: ${formula || 'N/A'}\nOriginal context: ${explanation || ''}\nTarget Style: ${style} (${styleInstructions[style] || styleInstructions.analogy})\nTarget Language: ${language}`,
              config: {
                systemInstruction: `You are an expert pedagogy and mnemonic master. Keep formulas exact ($F=ma$, $V=IR$, etc.). Format with clean markdown headers and bullet points.`,
                temperature: 0.6,
              },
            });

            res.end(JSON.stringify({
              success: true,
              text: response.text || 'Here is another way to look at this concept.',
            }));
            return;
          }

          if (req.url === '/api/ai/diagnose-error' && req.method === 'POST') {
            const body = await parseBody();
            const { question, studentAnswer, correctAnswer, concept, errorType, language = 'en' } = body;

            if (!ai) {
              res.end(JSON.stringify({
                success: true,
                diagnosis: `You selected "${studentAnswer}" instead of "${correctAnswer}". This often happens due to ${errorType || 'a conceptual slip'}. Double check how the formula applies.`,
                fallback: true,
              }));
              return;
            }

            const response = await ai.models.generateContent({
              model: 'gemini-3.7-flash',
              contents: `Question: ${question}\nStudent Answer: ${studentAnswer}\nCorrect Answer: ${correctAnswer}\nConcept: ${concept}\nClassified Error Type: ${errorType}\nTarget Language: ${language}`,
              config: {
                systemInstruction: `Analyze why a student made this mistake. Give:
1. Diagnosis of the root misconception in 2-3 sentences.
2. The exact conceptual fix.
3. A 1-sentence mnemonic.
Language: ${language}. Keep formulas preserved.`,
                temperature: 0.5,
              },
            });

            res.end(JSON.stringify({
              success: true,
              diagnosis: response.text || 'Review the core definition and sign conventions.',
            }));
            return;
          }

          if (req.url === '/api/ai/generate-question' && req.method === 'POST') {
            const body = await parseBody();
            const { subject, chapter, concept, difficulty = 'medium', language = 'en', exam = 'CBSE 10' } = body;

            if (!ai) {
              res.end(JSON.stringify({
                success: true,
                question: {
                  id: `gen_${Date.now()}`,
                  text: `In ${concept}, what is the effect of doubling the primary variable under standard conditions?`,
                  options: ['It doubles', 'It quadruples', 'It remains unchanged', 'It is halved'],
                  correctIndex: 0,
                  explanation: `According to the direct proportionality principle in ${concept}, the quantity scales linearly.`,
                  hint1: `Consider the fundamental equation relating these variables.`,
                  hint2: `Notice if the exponent in the formula is 1 or 2.`,
                  difficulty,
                  marks: 4,
                  expectedTimeSec: 60,
                },
                fallback: true,
              }));
              return;
            }

            const response = await ai.models.generateContent({
              model: 'gemini-3.7-flash',
              contents: `Generate a high-quality assessment question for Exam: ${exam}, Subject: ${subject}, Chapter: ${chapter}, Concept: ${concept}, Difficulty: ${difficulty}, Language: ${language}.
Return strictly valid JSON with keys:
- text: string
- options: array of 4 strings
- correctIndex: number (0, 1, 2, or 3)
- explanation: string
- hint1: string
- hint2: string
- commonMistake: string`,
              config: {
                responseMimeType: 'application/json',
                temperature: 0.7,
              },
            });

            let data;
            try {
              data = JSON.parse(response.text || '{}');
            } catch {
              data = {
                text: `Regarding ${concept}, which statement is scientifically accurate?`,
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctIndex: 0,
                explanation: 'Concept explanation.',
              };
            }

            res.end(JSON.stringify({
              success: true,
              question: {
                id: `gen_${Date.now()}`,
                ...data,
                difficulty,
                marks: 4,
                expectedTimeSec: 75,
              },
            }));
            return;
          }

          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Endpoint not found' }));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
