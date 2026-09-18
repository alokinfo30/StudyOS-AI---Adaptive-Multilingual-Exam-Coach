import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { sendVerificationEmail, verifyEmailCode } from './src/server/emailAuth';

dotenv.config();

const DATA_DIR = path.join(__dirname, '.data');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
}
const PROFILES_STORE_FILE = fs.existsSync(DATA_DIR)
  ? path.join(DATA_DIR, 'studyos_profiles.json')
  : path.join('/tmp', 'studyos_profiles.json');

const SESSIONS_STORE_FILE = fs.existsSync(DATA_DIR)
  ? path.join(DATA_DIR, 'studyos_sessions.json')
  : path.join('/tmp', 'studyos_sessions.json');

const SEEDED_DEFAULT_PROFILES: Record<string, any> = {
  'alokinfo30@gmail.com': {
    profile: {
      id: 'student_alok_kumar',
      name: 'Alok Kumar',
      email: 'alokinfo30@gmail.com',
      preferredLanguage: 'hi',
      selectedExam: 'CBSE_10',
      targetScore: 95,
      examDate: '2026-03-01',
      streakDays: 7,
      lastActiveDate: new Date().toISOString().split('T')[0],
      activeRole: 'student',
      goalCategory: 'school_board',
      selectedBoard: 'CBSE',
      selectedClass: '10',
      parentPhone: '+919876543210',
      parentName: 'Ramesh Kumar',
      isGoalConfirmed: true,
      authProvider: 'google',
      linkedMethods: ['google', 'email'],
      emailVerified: true,
      isOfflineMode: false,
    },
    account: {
      id: 'student_alok_kumar',
      name: 'Alok Kumar',
      email: 'alokinfo30@gmail.com',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alokinfo30%40gmail.com',
      createdAt: 1700000000000,
      selectedExam: 'CBSE_10',
      preferredLanguage: 'hi',
      goalCategory: 'school_board',
      selectedBoard: 'CBSE',
      selectedClass: '10',
      parentPhone: '+919876543210',
      parentName: 'Ramesh Kumar',
      isGoalConfirmed: true,
      autoSendReportsToParent: true,
      parentReportFrequency: 'daily_summary',
      authProvider: 'google',
    },
    updatedAt: Date.now(),
  },
};

function parseCookiesFromHeader(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts.shift()?.trim();
    if (name) {
      list[name] = decodeURIComponent(parts.join('=').trim());
    }
  });
  return list;
}

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
            if (result && result.verified) {
              const cleanEmail = email.trim().toLowerCase();
              res.setHeader('Set-Cookie', [
                `studyos_session=${encodeURIComponent(cleanEmail)}; Path=/; Max-Age=31536000; SameSite=Lax`,
                `studyos_active_email=${encodeURIComponent(cleanEmail)}; Path=/; Max-Age=31536000; SameSite=Lax`,
              ]);
            }
            res.end(JSON.stringify(result));
            return;
          }

          // Active session management for mobile persistence & reloads
          if (req.url === '/api/auth/session' && req.method === 'POST') {
            const body = await parseBody();
            const { email, studentId, profile, account, sessionToken, rememberMe, expiresAt } = body;
            if (!email) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Email required' }));
              return;
            }
            const cleanEmail = email.trim().toLowerCase();
            const resolvedStudentId = studentId || (account && account.id) || (profile && profile.id) || 'student_alok_kumar';
            const resolvedToken = sessionToken || `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            const resolvedExpiresAt = expiresAt || (Date.now() + (rememberMe !== false ? 30 * 864e5 : 24 * 3600e3));

            let sessions: Record<string, any> = {};
            if (fs.existsSync(SESSIONS_STORE_FILE)) {
              try {
                sessions = JSON.parse(fs.readFileSync(SESSIONS_STORE_FILE, 'utf-8'));
              } catch {}
            }
            const sessionData = {
              email: cleanEmail,
              studentId: resolvedStudentId,
              sessionToken: resolvedToken,
              expiresAt: resolvedExpiresAt,
              rememberMe: rememberMe !== false,
              profile,
              account,
              updatedAt: Date.now(),
            };
            sessions[cleanEmail] = sessionData;
            sessions['__last_active__'] = sessionData;
            try {
              fs.writeFileSync(SESSIONS_STORE_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
            } catch {}

            let store: Record<string, any> = { ...SEEDED_DEFAULT_PROFILES };
            if (fs.existsSync(PROFILES_STORE_FILE)) {
              try {
                store = { ...store, ...JSON.parse(fs.readFileSync(PROFILES_STORE_FILE, 'utf-8')) };
              } catch {}
            }
            store[cleanEmail] = {
              profile: profile || store[cleanEmail]?.profile,
              account: account || store[cleanEmail]?.account,
              updatedAt: Date.now(),
            };
            try {
              fs.writeFileSync(PROFILES_STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
            } catch {}

            res.setHeader('Set-Cookie', [
              `studyos_session=${encodeURIComponent(cleanEmail)}; Path=/; Max-Age=31536000; SameSite=Lax`,
              `studyos_active_email=${encodeURIComponent(cleanEmail)}; Path=/; Max-Age=31536000; SameSite=Lax`,
              `studyos_active_student_id=${encodeURIComponent(resolvedStudentId)}; Path=/; Max-Age=31536000; SameSite=Lax`,
            ]);

            res.end(JSON.stringify({ success: true, session: sessionData }));
            return;
          }

          if (req.url?.startsWith('/api/auth/session') && req.method === 'GET') {
            const cookies = parseCookiesFromHeader(req.headers.cookie);
            const urlObj = new URL(req.url, 'http://localhost:3000');
            let targetEmail = (cookies.studyos_session || cookies.studyos_active_email || urlObj.searchParams.get('email') || '').trim().toLowerCase();
            let targetStudentId = (cookies.studyos_active_student_id || urlObj.searchParams.get('studentId') || '').trim();

            let sessions: Record<string, any> = {};
            if (fs.existsSync(SESSIONS_STORE_FILE)) {
              try {
                sessions = JSON.parse(fs.readFileSync(SESSIONS_STORE_FILE, 'utf-8'));
              } catch {}
            }

            let profilesStore: Record<string, any> = { ...SEEDED_DEFAULT_PROFILES };
            if (fs.existsSync(PROFILES_STORE_FILE)) {
              try {
                profilesStore = { ...profilesStore, ...JSON.parse(fs.readFileSync(PROFILES_STORE_FILE, 'utf-8')) };
              } catch {}
            }

            let matchedSession: any = null;

            if (targetEmail && sessions[targetEmail]) {
              matchedSession = sessions[targetEmail];
            } else if (targetEmail && profilesStore[targetEmail]) {
              const record = profilesStore[targetEmail];
              matchedSession = {
                email: targetEmail,
                studentId: targetStudentId || record.account?.id || record.profile?.id || 'student_alok_kumar',
                profile: record.profile,
                account: record.account,
                expiresAt: Date.now() + 30 * 864e5,
                updatedAt: Date.now(),
              };
            } else if (!targetEmail && sessions['__last_active__']) {
              matchedSession = sessions['__last_active__'];
            } else if (!targetEmail && SEEDED_DEFAULT_PROFILES['alokinfo30@gmail.com']) {
              const defaultRecord = SEEDED_DEFAULT_PROFILES['alokinfo30@gmail.com'];
              matchedSession = {
                email: 'alokinfo30@gmail.com',
                studentId: 'student_alok_kumar',
                profile: defaultRecord.profile,
                account: defaultRecord.account,
                expiresAt: Date.now() + 30 * 864e5,
                updatedAt: Date.now(),
              };
            }

            if (matchedSession) {
              const cleanEmail = matchedSession.email;
              const sId = matchedSession.studentId || 'student_alok_kumar';

              // Refresh session expiration if nearing expiration (less than 7 days)
              const NEAR_EXPIRY = 7 * 864e5;
              if (!matchedSession.expiresAt || matchedSession.expiresAt - Date.now() < NEAR_EXPIRY) {
                matchedSession.expiresAt = Date.now() + 30 * 864e5;
                matchedSession.updatedAt = Date.now();
                sessions[cleanEmail] = matchedSession;
                sessions['__last_active__'] = matchedSession;
                try {
                  fs.writeFileSync(SESSIONS_STORE_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
                } catch {}
              }

              res.setHeader('Set-Cookie', [
                `studyos_session=${encodeURIComponent(cleanEmail)}; Path=/; Max-Age=31536000; SameSite=Lax`,
                `studyos_active_email=${encodeURIComponent(cleanEmail)}; Path=/; Max-Age=31536000; SameSite=Lax`,
                `studyos_active_student_id=${encodeURIComponent(sId)}; Path=/; Max-Age=31536000; SameSite=Lax`,
              ]);

              res.end(JSON.stringify({
                success: true,
                authenticated: true,
                session: matchedSession,
              }));
              return;
            }

            res.end(JSON.stringify({ success: true, authenticated: false, message: 'No active session' }));
            return;
          }

          if (req.url === '/api/auth/logout' && req.method === 'POST') {
            if (fs.existsSync(SESSIONS_STORE_FILE)) {
              try {
                const sessions = JSON.parse(fs.readFileSync(SESSIONS_STORE_FILE, 'utf-8'));
                delete sessions['__last_active__'];
                fs.writeFileSync(SESSIONS_STORE_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
              } catch {}
            }

            res.setHeader('Set-Cookie', [
              `studyos_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`,
              `studyos_active_email=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`,
              `studyos_active_student_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`,
            ]);

            res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }));
            return;
          }

          if (req.url === '/api/auth/sync-profile' && req.method === 'POST') {
            const body = await parseBody();
            const { email, profile, account } = body;
            if (!email) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Email required for sync' }));
              return;
            }
            const cleanEmail = email.trim().toLowerCase();
            let store: Record<string, any> = { ...SEEDED_DEFAULT_PROFILES };
            if (fs.existsSync(PROFILES_STORE_FILE)) {
              try {
                store = { ...store, ...JSON.parse(fs.readFileSync(PROFILES_STORE_FILE, 'utf-8')) };
              } catch {}
            }
            store[cleanEmail] = {
              profile,
              account,
              updatedAt: Date.now(),
            };
            try {
              fs.writeFileSync(PROFILES_STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
            } catch {}
            res.end(JSON.stringify({ success: true, message: 'Profile synced successfully across devices' }));
            return;
          }

          if (req.url?.startsWith('/api/auth/get-profile') && req.method === 'GET') {
            const urlObj = new URL(req.url, 'http://localhost:3000');
            const email = (urlObj.searchParams.get('email') || '').trim().toLowerCase();
            if (!email) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Email required' }));
              return;
            }
            let record: any = null;
            if (fs.existsSync(PROFILES_STORE_FILE)) {
              try {
                const store = JSON.parse(fs.readFileSync(PROFILES_STORE_FILE, 'utf-8'));
                if (store[email]) {
                  record = store[email];
                }
              } catch {}
            }
            if (!record && SEEDED_DEFAULT_PROFILES[email]) {
              record = SEEDED_DEFAULT_PROFILES[email];
            }
            if (record) {
              res.end(JSON.stringify({
                success: true,
                data: record,
                profile: record.profile,
                account: record.account,
              }));
              return;
            }
            res.end(JSON.stringify({ success: false, message: 'No remote profile found' }));
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
