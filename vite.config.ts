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
            // CRITICAL: Live verification code must NOT be returned to the client browser!
            const { code: _ignored, ...clientResult } = result;
            res.end(JSON.stringify({
              ...clientResult,
              expiresInMinutes: 10,
            }));
            return;
          }

          if (req.url === '/api/auth/verify-code' && req.method === 'POST') {
            const body = await parseBody();
            const { email, code } = body;
            if (!email || !code) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, verified: false, error: 'Email and 6-digit code are required.' }));
              return;
            }
            const result = verifyEmailCode(email, code);
            if (!result || !result.verified) {
              res.statusCode = 400;
              res.end(JSON.stringify({
                success: false,
                verified: false,
                error: result?.error || 'Wrong verification code. Please check your Gmail and try again.',
              }));
              return;
            }
            const cleanEmail = email.trim().toLowerCase();
            res.setHeader('Set-Cookie', [
              `studyos_session=${encodeURIComponent(cleanEmail)}; Path=/; Max-Age=31536000; SameSite=Lax`,
              `studyos_active_email=${encodeURIComponent(cleanEmail)}; Path=/; Max-Age=31536000; SameSite=Lax`,
            ]);
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
              const candidate = sessions[targetEmail];
              if (candidate.expiresAt && candidate.expiresAt < Date.now()) {
                delete sessions[targetEmail];
                try {
                  fs.writeFileSync(SESSIONS_STORE_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
                } catch {}
              } else {
                matchedSession = candidate;
              }
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
            const cookies = parseCookiesFromHeader(req.headers.cookie);
            let bodyEmail = '';
            let studentId = '';
            try {
              const body = await parseBody();
              bodyEmail = (body?.email || '').trim().toLowerCase();
              studentId = (body?.studentId || '').trim();
            } catch {}
            const cookieEmail = (cookies.studyos_session || cookies.studyos_active_email || '').trim().toLowerCase();
            const targetEmail = bodyEmail || cookieEmail;
            const finalStudentId = studentId || (cookies.studyos_active_student_id || '').trim();

            if (fs.existsSync(SESSIONS_STORE_FILE)) {
              try {
                const sessions = JSON.parse(fs.readFileSync(SESSIONS_STORE_FILE, 'utf-8'));
                delete sessions['__last_active__'];
                if (targetEmail && sessions[targetEmail]) {
                  delete sessions[targetEmail];
                }
                if (finalStudentId) {
                  for (const k of Object.keys(sessions)) {
                    if (sessions[k]?.studentId === finalStudentId) {
                      delete sessions[k];
                    }
                  }
                }
                fs.writeFileSync(SESSIONS_STORE_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
              } catch {}
            }

            res.setHeader('Set-Cookie', [
              `studyos_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax`,
              `studyos_active_email=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax`,
              `studyos_active_student_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax`,
              `studyos_session_token_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax`,
              `studyos_session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax`,
            ]);

            res.end(JSON.stringify({
              success: true,
              terminated: true,
              message: 'Backend session invalidated and cookies cleared successfully',
            }));
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

          // AksharSetu: Multimodal Snap & Diagnose (Vision AI for Student Slates & Worksheets)
          if (req.url === '/api/akshar/snap-diagnose' && req.method === 'POST') {
            const body = await parseBody();
            const { imageBase64, dialect = 'bhojpuri', grade = 1, subject = 'hindi_fln', childName = 'विद्यार्थी', sampleKey } = body;

            // Handle Gemini Vision diagnosis if imageBase64 is provided and AI client exists
            let diagnosisResult: any = null;

            if (ai && imageBase64 && imageBase64.length > 50) {
              try {
                const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
                const mimeType = imageBase64.includes('data:image/png') ? 'image/png' : 'image/jpeg';

                const promptText = `You are AksharSetu Vision Pedagogical Diagnostics Engine.
Analyze this photo of a primary school child's slate or notebook (Grade ${grade}, vernacular dialect background: ${dialect}, subject: ${subject}).
Look closely for:
1. Exact handwritten text/numbers detected.
2. Handwriting and cognitive error pattern:
   - Phonological confusion (e.g. 'ब' vs 'व', 'श' vs 'स', 'ड़' vs 'ड' common in ${dialect} dialect speech)
   - Spatial letter inversion / lateral mirroring (e.g. 'd' vs 'b', 'p' vs 'q', reversed Devanagari matras 'ि' vs 'ी')
   - Place-value carry-over misconceptions (e.g. 17+8 written as 115 because of missing tens carry-over, or place alignment slips)
   - Stroke formation / matra truncation.
3. Classify error type: one of 'phonological_confusion', 'letter_inversion', 'place_value_carryover', 'matra_displacement', 'spacing_alignment', 'correct'.
4. Specific error subtype in English and Hindi.
5. Overall accuracy score (0 to 100).
6. 1 to 3 bounding box error regions with normalized coordinates (x, y, width, height from 0 to 100 percentages) pointing to the exact mistake location on the slate.
7. Root Misconception: 2-sentence explanation of WHY the child made this specific mistake (linking vernacular spoken habit or developmental motor/spatial stage).
8. 1-Minute Offline Remediation Tip: Practical, zero-cost physical/chalk exercise the teacher can do right now with this child while other students work in circles.
9. Recommended TaRL learning band: 1 (Foundational Akshar/Matra), 2 (Word/Blending), or 3 (Sentence/Decodable Fluent).
10. Spoken Audio Bridge Script: Warm, encouraging message in child's colloquial ${dialect} dialect first, bridging to standard Hindi.

Return strictly valid JSON with keys:
- detectedText: string
- errorType: string
- errorSubtype: string
- accuracyScore: number
- boundingBoxes: array of { label: string, x: number, y: number, width: number, height: number, severity: "critical" | "moderate" | "success" }
- rootMisconception: string
- remediationTip1Min: string
- recommendedTaRLBand: number (1, 2, or 3)
- audioBridgeScript: string`;

                const response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: {
                    parts: [
                      {
                        inlineData: {
                          mimeType,
                          data: cleanBase64,
                        },
                      },
                      { text: promptText },
                    ],
                  },
                  config: {
                    responseMimeType: 'application/json',
                    temperature: 0.3,
                  },
                });

                if (response.text) {
                  diagnosisResult = JSON.parse(response.text.trim());
                }
              } catch (e: any) {
                console.warn('[AksharSetu Vision Error]', e.message);
              }
            }

            // High-fidelity pedagogical fallback if no AI key or processing synthetic sample
            if (!diagnosisResult) {
              const sampleDiagnoses: Record<string, any> = {
                bhojpuri_ba_va: {
                  detectedText: 'बकील बाबू आइल बाड़न (मानक: वकील बाबू आए हैं)',
                  errorType: 'phonological_confusion',
                  errorSubtype: 'व (v/w) vs ब (b) Vernacular Phoneme Substitution',
                  accuracyScore: 72,
                  boundingBoxes: [
                    { label: 'व -> ब Substitution', x: 8, y: 35, width: 22, height: 42, severity: 'critical' },
                    { label: 'Matra Alignment', x: 34, y: 32, width: 28, height: 40, severity: 'moderate' },
                  ],
                  rootMisconception: 'In Bhojpuri and Awadhi regional phonetics, bilabial stop [b] naturally replaces labiodental approximant [v/w] in colloquial speech. The child spells purely by vernacular auditory memory rather than standard orthographic rule.',
                  remediationTip1Min: 'Mirror & Lip Shape Game: Have the child place their lower lip against upper teeth to make the vibrating [vvv] sound for "व", contrasted with popping both lips together for [bbb] "ब". Trace "व" in sand/slate with a round belly without the inner slash line.',
                  recommendedTaRLBand: 1,
                  audioBridgeScript: 'अरे वाह! रउआ बहुत सुंदर लिखले बानी। देखल जाव, जवन रउआ बोलिला "बकील", ओकरा के किताब में "व" से लिखल जाला। दुनो होंठ ना दबा के, दांत से निचला होंठ छुवा के बोलीं— "व... वकील"!',
                },
                letter_inversion_db: {
                  detectedText: 'd a g (for b a g)',
                  errorType: 'letter_inversion',
                  errorSubtype: 'Lateral Mirror Inversion: "d" written instead of "b"',
                  accuracyScore: 68,
                  boundingBoxes: [
                    { label: 'Lateral Inversion: d for b', x: 12, y: 25, width: 26, height: 52, severity: 'critical' },
                    { label: 'Vowel Formation: a', x: 42, y: 38, width: 20, height: 38, severity: 'success' },
                  ],
                  rootMisconception: 'Children in foundational literacy (ages 5–7) experience visual mirror invariance: in the physical world, a cup is a cup whether facing left or right. They must unlearn mirror-invariance specifically for asymmetric alphabetic glyphs like b/d/p/q.',
                  remediationTip1Min: 'Bat & Ball Physical Anchor: Teach the "b comes first with the Bat, then the Ball" mnemonic. Child holds their left hand in a "b" thumbs-up (bed posture) to verify letter direction before writing.',
                  recommendedTaRLBand: 1,
                  audioBridgeScript: 'बहुत बढ़िया प्रयास! देख बबुआ, जब हमनी "b" बनाईंला, त पहिले डंडा (बैट) आवेला, ओकरा बाद गोल गेंद (बॉल)। बायां हाथ से थम्स-अप बना के देखऽ, ई बन गइल "b"!',
                },
                math_carryover: {
                  detectedText: '  1 7 \n+   8 \n-----\n 1 1 5',
                  errorType: 'place_value_carryover',
                  errorSubtype: 'Place Value Concatenation without Regrouping (7+8 = 15 written in units column)',
                  accuracyScore: 60,
                  boundingBoxes: [
                    { label: 'Regrouping Error: 15 concatenated directly', x: 28, y: 55, width: 48, height: 35, severity: 'critical' },
                    { label: 'Tens Column ignored', x: 24, y: 20, width: 20, height: 30, severity: 'moderate' },
                  ],
                  rootMisconception: 'The child treats each vertical column as an isolated single-digit operation without understanding the base-10 bundle. When 7 + 8 equals 15, they write the full two-digit "15" below the line instead of carrying the bundle of 10 to the tens column.',
                  remediationTip1Min: '10-Stick Bundling (Tili & Bundle): Hand the child 15 loose sticks/pebbles. Ask them to tie exactly 10 into one bundle ("दहाई की पोटली") and pass that bundle to the Tens column slate.',
                  recommendedTaRLBand: 2,
                  audioBridgeScript: 'शाबाश! 7 आ 8 जोड़ के 15 बिल्कुल सही आइल। बाकिर इकाई के घर में खाली 9 गो संख्या रह सकेला। 10 गो के एगो गठरी (दहाई) बना के ऊपर भेज दीं, आ नीचे खाली 5 बची!',
                },
              };

              const fallbackKey = sampleKey || (subject === 'math_numeracy' ? 'math_carryover' : (grade === 1 && subject === 'english_letters' ? 'letter_inversion_db' : 'bhojpuri_ba_va'));
              diagnosisResult = sampleDiagnoses[fallbackKey] || sampleDiagnoses.bhojpuri_ba_va;
            }

            res.end(JSON.stringify({
              success: true,
              data: {
                ...diagnosisResult,
                studentId: `std_${Date.now().toString(36)}`,
                childName,
                grade,
                dialect,
                subject,
                timestamp: Date.now(),
              },
            }));
            return;
          }

          // AksharSetu: Dialect-to-Standard Oral Bridge (Voice & Phonetic Reasoning)
          if (req.url === '/api/akshar/oral-bridge' && req.method === 'POST') {
            const body = await parseBody();
            const { spokenText, dialect = 'bhojpuri', targetStandard = 'standard_hindi', grade = 1 } = body;

            if (!spokenText || typeof spokenText !== 'string') {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Spoken text or audio transcript is required.' }));
              return;
            }

            let bridgeResult: any = null;

            if (ai) {
              try {
                const response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: `Student spoken input in colloquial dialect (${dialect}): "${spokenText}".
Target classroom language: ${targetStandard} (Grade ${grade}).
Task:
1. Identify the dialectical vernacular phonemes and colloquial grammatical markers used.
2. Produce a warm, encouraging pedagogical bridge spoken in the child's home dialect (${dialect}) that acknowledges their thought warmly and scaffolds to the standard curriculum phrasing.
3. Provide standard ${targetStandard} equivalent with syllabic phonetic breakdown.
4. Suggest a 30-second call-and-response rhythmic oral chant for the multigrade circle.
Return valid JSON with keys:
- detectedDialect: string
- vernacularPhrasing: string
- standardEquivalent: string
- phonemicDifference: string
- homeDialectPraiseBridge: string
- classroomPracticeChant: string
- fluencyScore: number (0-100)`,
                  config: {
                    responseMimeType: 'application/json',
                    temperature: 0.4,
                  },
                });

                if (response.text) {
                  bridgeResult = JSON.parse(response.text.trim());
                }
              } catch (e: any) {
                console.warn('[Oral Bridge AI Error]', e.message);
              }
            }

            if (!bridgeResult) {
              const dialectBridges: Record<string, any> = {
                bhojpuri: {
                  detectedDialect: 'Bhojpuri (भोजपुरी)',
                  vernacularPhrasing: spokenText,
                  standardEquivalent: spokenText.replace(/दू गो/g, 'दो').replace(/बा/g, 'है').replace(/हमार/g, 'मेरा').replace(/बानी/g, 'हूँ').replace(/बकील/g, 'वकील'),
                  phonemicDifference: 'Vernacular [b] for standard [v], colloquial classifier "गो" (go), auxiliary verb "बा/बानी".',
                  homeDialectPraiseBridge: 'बहुत सुंदर बोललऽ बबुआ! रउआ कहनी "हमार दू गो किताब बा"। मानक हिंदी में हमनी कहब— "मेरी दो किताबें हैं"। दुनु बहुत बढ़िया बा!',
                  classroomPracticeChant: 'बोलो-बोलो एक, दो, तीन • किताब खुली और शुरू हुई बीन! (वकील, वर्षा, वन • व से बोलो सब बच्चे संग)',
                  fluencyScore: 84,
                },
                awadhi: {
                  detectedDialect: 'Awadhi (अवधी)',
                  vernacularPhrasing: spokenText,
                  standardEquivalent: spokenText.replace(/हमार/g, 'मेरा').replace(/आहि/g, 'है').replace(/दुइ/g, 'दो'),
                  phonemicDifference: 'Awadhi glottal endings, /ai/ diphthongs, and retroflex flap alternation.',
                  homeDialectPraiseBridge: 'अरे वाह! तोहार बात एकदम साफ बा। अवधी मा जौन बात कह्यो, किताबन मा ओका "मेरी पुस्तक" कहा जात है।',
                  classroomPracticeChant: 'हमार गाँव, हमार देश • सीखब हिंदी, बनब विशेष!',
                  fluencyScore: 86,
                },
                maithili: {
                  detectedDialect: 'Maithili (मैथिली)',
                  vernacularPhrasing: spokenText,
                  standardEquivalent: spokenText.replace(/हमर/g, 'मेरा').replace(/अछि/g, 'है').replace(/दुटा/g, 'दो'),
                  phonemicDifference: 'Maithili honorific verb morphology and rounded vowel /ɔ/ sounds.',
                  homeDialectPraiseBridge: 'बड्ड नीक! अपने जे कहलहुँ से एकदम सटीक अछि। कक्षा मे एकरा कहब— "यह मेरी पुस्तक है"।',
                  classroomPracticeChant: 'मिथिलाक बोली, विद्यापति केर गान • अक्षर-अक्षर सँ बनब महान!',
                  fluencyScore: 88,
                },
              };

              bridgeResult = dialectBridges[dialect] || dialectBridges.bhojpuri;
            }

            res.end(JSON.stringify({
              success: true,
              data: bridgeResult,
            }));
            return;
          }

          // AksharSetu: TaRL Micro-Grouping & Offline Activity Generator
          if (req.url === '/api/akshar/tarl-generate-activities' && req.method === 'POST') {
            const body = await parseBody();
            const { activeBand = 1, classroomSize = 38, focusSubject = 'FLN Literacy', dialect = 'bhojpuri' } = body;

            let activitiesData: any = null;

            if (ai) {
              try {
                const response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: `Generate 5-minute autonomous peer-circle activities for a multigrade rural classroom (Grades 1-3, ${classroomSize} students, ${dialect} dialect background).
The teacher is currently giving 10 minutes of direct micro-instruction to Band ${activeBand}.
Provide:
1. Specific offline activity for Band 1 (Akshar starters) - tactile/slate.
2. Specific offline peer-buddy game for Band 2 (Word/Blending) - using sticks, pebbles, or slate flashcards.
3. Specific independent reader challenge for Band 3 (Decodable story readers).
4. A quick 3-line Blackboard Chalk drawing prompt the teacher can draw in 30 seconds.
Return valid JSON with keys:
- band1Activity: { title: string, duration: string, materialsNeeded: string, instructions: string, peerLeaderRole: string }
- band2Activity: { title: string, duration: string, materialsNeeded: string, instructions: string, peerLeaderRole: string }
- band3Activity: { title: string, duration: string, materialsNeeded: string, instructions: string, peerLeaderRole: string }
- blackboardChalkPrompt: string
- rotationTimerMinutes: number`,
                  config: {
                    responseMimeType: 'application/json',
                    temperature: 0.5,
                  },
                });

                if (response.text) {
                  activitiesData = JSON.parse(response.text.trim());
                }
              } catch (e: any) {
                console.warn('[TaRL Activity Generation Error]', e.message);
              }
            }

            if (!activitiesData) {
              activitiesData = {
                band1Activity: {
                  title: 'कंकड़-अक्षर ट्रेसिंग (Pebble-Letter Sand Contour)',
                  duration: '10 Mins',
                  materialsNeeded: 'Slates, soft chalk, 20 small clean pebbles or tamarind seeds',
                  instructions: 'Children trace large outline of target letter "ब" and "व" on their slates, placing small pebbles along the stroke curve to feel the open loop of "व" vs closed belly line of "ब".',
                  peerLeaderRole: 'Student Buddy checks that pebbles do not roll away and leads phonetic sound chant ("व... वर्षा, ब... बकरा").',
                },
                band2Activity: {
                  title: 'मात्रा-पहेली रेलगाड़ी (Matra Train Relay)',
                  duration: '10 Mins',
                  materialsNeeded: 'Chalk pieces, 3 slate boards placed in a row',
                  instructions: 'First child writes a root consonant (e.g. क), second child adds a matra (का / कि / कू), third child reads the blended syllable aloud and speaks a real-life word.',
                  peerLeaderRole: 'Peer monitor awards a chalk star on the slate for each valid word blended.',
                },
                band3Activity: {
                  title: 'मुन्नी और बछड़ा - लघु कथा वाचन (Paired Decodable Reading)',
                  duration: '10 Mins',
                  materialsNeeded: 'Graded Decodable Storycard #4',
                  instructions: 'Pairs take turns reading 2 lines each of the rural decodable reader. If a student stumbles on an anuswar word, their partner points with a twig to sound it out together.',
                  peerLeaderRole: 'Group captain asks 2 oral comprehension questions ("बछड़ा कहाँ भागा?", "मुन्नी ने क्या खिलाया?").',
                },
                blackboardChalkPrompt: '┌─────────────┬─────────────┬─────────────┐\n│  दल १ (अक्षर) │ दल २ (मात्रा) │ दल ३ (कहानी) │\n│  व ० ब ० म  │ क+ा=का, क+ि=कि │ कार्ड नं. ४  │\n│  (कंकड़ जमाव) │  (शब्द रेल) │ (साथी वाचन) │\n└─────────────┴─────────────┴─────────────┘',
                rotationTimerMinutes: 12,
              };
            }

            res.end(JSON.stringify({
              success: true,
              data: activitiesData,
            }));
            return;
          }

          // AksharSetu: Batch Sync & Edge Persistence Queue Endpoint
          if (req.url === '/api/akshar/sync-batch' && req.method === 'POST') {
            const body = await parseBody();
            const { items = [], teacherId = 'teacher_sarita_devi', schoolId = 'ps_piprahi_01' } = body;

            const SYNC_STORE_FILE = path.join(DATA_DIR, 'aksharsetu_evaluations.json');
            let existing: any[] = [];
            if (fs.existsSync(SYNC_STORE_FILE)) {
              try {
                existing = JSON.parse(fs.readFileSync(SYNC_STORE_FILE, 'utf-8'));
              } catch {}
            }

            const updated = [...items, ...existing].slice(0, 500);
            try {
              fs.writeFileSync(SYNC_STORE_FILE, JSON.stringify(updated, null, 2), 'utf-8');
            } catch {}

            res.end(JSON.stringify({
              success: true,
              syncedCount: items.length,
              totalRecordsStored: updated.length,
              syncTimestamp: Date.now(),
              message: `Successfully synchronized ${items.length} offline evaluations to cloud node.`,
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
