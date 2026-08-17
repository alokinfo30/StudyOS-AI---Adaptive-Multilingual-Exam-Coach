import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gemini SDK with required User-Agent
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

// 1. AI Tutor Socratic Explanations & Dialogue
app.post('/api/ai/tutor', async (req, res) => {
  try {
    const { prompt, language = 'en', conceptTitle, context, mode = 'socratic' } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        text: `[Offline Mode] Here is the step-by-step concept breakdown for **${conceptTitle || 'this topic'}** in ${language}: Focus on key principles, apply the core formula, and check units carefully.`,
        fallback: true,
      });
    }

    const systemInstruction = `You are StudyOS AI, a world-class Indian exam coach and Socratic tutor for Class 10/12, JEE, NEET, and Board Exams.
Your objective is to provide active, guided learning.
Language preference: ${language}.
If language is "hi", explain in clear conversational Hindi with English scientific/technical terms preserved.
If language is "hinglish", explain in natural Smart Hinglish (conversational Hindi syntax + technical terms in English, e.g. "Ohm's Law batata hai ki voltage aur current proportional hote hain").
If language is Bengali, Marathi, Gujarati, Tamil, Telugu, Kannada, Malayalam, Punjabi, Urdu, respond in that language while preserving standard scientific formulas ($F = ma$, $V = IR$, chemical equations, units).
Never give answers directly when guided reasoning is needed; use progressive hints and encouragement. Mode: ${mode}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Concept: ${conceptTitle || 'General Concept'}\nContext: ${context || 'Study Session'}\nStudent Query: ${prompt}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      text: response.text || 'Let us explore this step by step. What do you think is the first principle here?',
    });
  } catch (error: any) {
    console.error('AI Tutor error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate tutor response' });
  }
});

// 2. "Explain Differently" API
app.post('/api/ai/explain-differently', async (req, res) => {
  try {
    const { conceptTitle, formula, explanation, style = 'analogy', language = 'en' } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        text: `[Offline Mode] **${conceptTitle}** explanation in ${style} style: Remember the relationship ${formula || ''}. Imagine flow in a closed system where obstacles resist movement.`,
        fallback: true,
      });
    }

    const styleInstructions: Record<string, string> = {
      simple: 'Explain to a 10-year-old using simple words, zero jargon, and high intuition.',
      analogy: 'Use an unforgettable real-life everyday Indian analogy (cricket, kitchen, traffic, water pipes, train journeys) to explain.',
      visual: 'Explain using a clear structured textual diagram / ASCII flow and step-by-step spatial breakdown.',
      socratic: 'Ask 3 progressive questions that guide the student to discover the underlying formula or rule on their own.',
      hinglish: 'Explain in Smart Hinglish (English technical terms + conversational Hindi).',
      practice_check: 'Provide 1 quick check question with 4 options and detailed explanation to verify this exact concept.',
    };

    const promptText = `Provide an alternative explanation for this concept:
Concept: ${conceptTitle}
Formula: ${formula || 'N/A'}
Original context: ${explanation || ''}
Target Style: ${style} (${styleInstructions[style] || styleInstructions.analogy})
Target Language: ${language}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        systemInstruction: `You are an expert pedagogy and mnemonic master in India. Keep formulas exact ($F=ma$, $V=IR$, etc.). Format with clean markdown headers and bullet points.`,
        temperature: 0.6,
      },
    });

    res.json({
      success: true,
      text: response.text || 'Here is another way to look at this concept.',
    });
  } catch (error: any) {
    console.error('Explain Differently error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Misconception & Error Diagnostics
app.post('/api/ai/diagnose-error', async (req, res) => {
  try {
    const { question, studentAnswer, correctAnswer, concept, errorType, language = 'en' } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        diagnosis: `You selected "${studentAnswer}" instead of "${correctAnswer}". This often happens due to ${errorType || 'a conceptual slip'}. Double check how the formula applies.`,
        recoveryTip: 'Review the underlying definition and practice with simpler numbers before attempting higher difficulty.',
        fallback: true,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Question: ${question}\nStudent Answer: ${studentAnswer}\nCorrect Answer: ${correctAnswer}\nConcept: ${concept}\nClassified Error Type: ${errorType}\nTarget Language: ${language}`,
      config: {
        systemInstruction: `You are an educational psychologist and error intelligence engine.
Analyze why a student made this mistake. Give:
1. Diagnosis of the root misconception in 2-3 sentences.
2. The exact conceptual fix.
3. A 1-sentence mnemonic or rule of thumb.
Language: ${language}. Keep formulas preserved.`,
        temperature: 0.5,
      },
    });

    res.json({
      success: true,
      diagnosis: response.text || 'Review the core definition and sign conventions.',
    });
  } catch (error: any) {
    console.error('Diagnose error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Dynamic Practice Question Generator
app.post('/api/ai/generate-question', async (req, res) => {
  try {
    const { subject, chapter, concept, difficulty = 'medium', language = 'en', exam = 'CBSE 10' } = req.body;

    if (!ai) {
      return res.json({
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
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Generate a high-quality assessment question for Exam: ${exam}, Subject: ${subject}, Chapter: ${chapter}, Concept: ${concept}, Difficulty: ${difficulty}, Language: ${language}.
Return strictly valid JSON with keys:
- text: string (the question statement)
- options: array of 4 strings
- correctIndex: number (0, 1, 2, or 3)
- explanation: string (step by step solution)
- hint1: string (conceptual clue without giving answer)
- hint2: string (formula clue)
- commonMistake: string (why students pick the distractor)`,
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
        text: `Regarding ${concept}, which of the following statements is scientifically accurate?`,
        options: ['Statement A', 'Statement B', 'Statement C', 'Statement D'],
        correctIndex: 0,
        explanation: 'Detailed concept analysis.',
      };
    }

    res.json({
      success: true,
      question: {
        id: `gen_${Date.now()}`,
        ...data,
        difficulty,
        marks: 4,
        expectedTimeSec: 75,
      },
    });
  } catch (error: any) {
    console.error('Question gen error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Developer Tech Interview AI Evaluator & Mock Interviewer
app.post('/api/ai/dev-interview-evaluate', async (req, res) => {
  try {
    const { questionPrompt, developerAnswer, techTrack, level, expectedAnswer } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        score: 82,
        feedback: `[Offline Evaluator] Solid technical response for ${techTrack} at ${level} level. You correctly identified the core principle. To reach staff level, elaborate on memory overhead and edge-case handling.`,
        followUpQuestion: `How would your solution perform if the traffic increased by 100x or when database network latency spikes?`,
        strengths: ['Good foundational logic', 'Identified primary API/syntax'],
        areasToImprove: ['Add explicit Big-O time and space complexity', 'Mention distributed cache invalidation'],
        fallback: true,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `You are a Principal Software Architect and FAANG / High-Growth Tech Interviewer evaluating a candidate.
Tech Track: ${techTrack} (e.g. Laravel/PHP, Python, JavaScript/TypeScript/React, AI/ML/Transformers, DSA, System Design)
Target Level: ${level} (beginner = junior/lowest knowledge, intermediate = mid, senior = senior, top_class = staff/principal architect)
Interview Question: ${questionPrompt}
Candidate's Spoken / Written Answer: ${developerAnswer}
Benchmark Concept: ${expectedAnswer}

Evaluate rigorously according to the target level. Return strictly valid JSON with keys:
- score: number (0-100)
- rating: string ("Needs Improvement", "Acceptable", "Strong", "Top-Class / Staff-Ready")
- feedback: string (comprehensive constructive architectural & conceptual analysis, 3-4 paragraphs)
- followUpQuestion: string (a sharp, Socratic follow-up interview question probing deeper into edge cases or system scale)
- strengths: string[] (2-3 items)
- areasToImprove: string[] (2-3 items)
- topTierTip: string (1 sentence insider tip that distinguishes a top 1% developer from the rest)`,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    let result;
    try {
      result = JSON.parse(response.text || '{}');
    } catch {
      result = {
        score: 80,
        rating: 'Strong',
        feedback: response.text || 'Good technical explanation.',
        followUpQuestion: 'What are the concurrency trade-offs under heavy load?',
        strengths: ['Clear intuition'],
        areasToImprove: ['Add time/space complexity analysis'],
        topTierTip: 'Always benchmark before premature optimization.',
      };
    }

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Dev Interview evaluation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5.5. Developer Tech Interview Voice-to-Text Answer Generator
app.post('/api/ai/dev-interview-generate-answer', async (req, res) => {
  try {
    const {
      questionPrompt,
      spokenNotesOrPrompt = '',
      techTrack = 'General Software Engineering',
      level = 'senior',
      answerStyle = 'senior_architecture',
      expectedBenchmark = '',
    } = req.body;

    if (!ai) {
      const fallbackSnippet =
        techTrack.toLowerCase().includes('laravel')
          ? `// High-Performance Query with Eager Loading & Caching\n$users = Cache::remember('active_users', 300, function() {\n    return User::with(['profile', 'roles'])\n        ->where('is_active', true)\n        ->select(['id', 'name', 'email'])\n        ->get();\n});`
          : techTrack.toLowerCase().includes('python')
          ? `def solve_efficiently(data_stream):\n    \"\"\"O(N) single-pass streaming with generator to preserve memory.\"\"\"\n    for item in data_stream:\n        if item.is_valid():\n            yield item.transform()`
          : `// Distributed Architectural Pattern\nexport async function handleRequest(ctx) {\n  const cached = await redis.get(ctx.key);\n  if (cached) return JSON.parse(cached);\n  const data = await db.query(ctx.key);\n  await redis.set(ctx.key, JSON.stringify(data), 'EX', 60);\n  return data;\n}`;

      return res.json({
        success: true,
        structuredAnswer: `### Technical Interview Response (${level.toUpperCase()} Level)

**1. Core Architectural Principle & Approach:**
When addressing **"${questionPrompt}"** in **${techTrack}**, the critical focus is balancing throughput, memory efficiency, and operational observability. ${
          spokenNotesOrPrompt ? `Building on your point: *"${spokenNotesOrPrompt}"*` : ''
        }

**2. Key Mechanics & Execution:**
- **State Management & Concurrency:** Ensure atomic transactions and avoid shared-state race conditions.
- **Resource Profiling:** Prevent connection pool exhaustion by leveraging non-blocking asynchronous I/O and idempotent caching layers.
- **Resilience & Fault Tolerance:** Implement circuit-breakers with exponential backoff on downstream service calls.

**3. Complexity & Production Trade-Offs:**
- **Time Complexity:** $O(N)$ linear processing during stream consumption.
- **Space Overhead:** $O(1)$ constant auxiliary memory by streaming rather than buffering into RAM.
- **Trade-Off:** Trading minor write latency on cache invalidation for sub-5ms read queries at scale.`,
        keyTalkingPoints: [
          'Directly state the primary design pattern in the first 10 seconds.',
          'Quantify time/space complexity before writing or detailing code.',
          'Proactively address concurrency hazards and failover recovery.',
        ],
        timeAndSpaceComplexity: 'Time: O(N) | Space: O(1) auxiliary memory',
        tradeOffs: [
          'Strong Consistency vs Eventual Consistency (Read-heavy replica scaling)',
          'In-Memory caching speed vs cache-invalidation stampede risks',
        ],
        codeOrDiagramSnippet: fallbackSnippet,
        topPitfallsAvoided: [
          'Avoiding N+1 database queries via batching/eager loading.',
          'Never storing unbounded memory buffers in the event loop.',
        ],
        suggestedFollowUpPrep: [
          'Be ready to explain horizontal sharding strategy if dataset grows > 10TB.',
        ],
        style: answerStyle,
        fallback: true,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `You are a Principal Software Architect and FAANG Tech Interviewer creating an exemplary, top-tier technical interview answer for a candidate.

Context:
- Technology Track: ${techTrack} (e.g., Laravel/PHP, Python, JavaScript/React/TypeScript, AI/ML, System Design, DSA)
- Candidate Target Level: ${level} (beginner = junior, intermediate = mid-level, senior = senior engineer, top_class = staff/principal architect)
- Answering Framework / Style: ${answerStyle} (e.g. senior_architecture, star_method, concise_executive, code_and_complexity)
- Interview Question / Prompt: "${questionPrompt}"
- Candidate's Raw Spoken Notes / Voice Transcription: "${spokenNotesOrPrompt || 'None provided - generate the best standard response'}"
- Benchmark Concept: "${expectedBenchmark || 'Industry standard best practice'}"

Instructions:
1. Synthesize the candidate's spoken thoughts (if any) and elevate them into a master-class technical response suitable for a real interview.
2. Tailor technical depth to the ${level} tier:
   - For junior: crystal clear fundamentals, syntax correctness, clean structure.
   - For senior/staff: high-throughput scalability, memory profiling, concurrency/race conditions, distributed failure modes, Big-O trade-offs, and metrics.
3. Return strictly valid JSON matching this schema:
{
  "structuredAnswer": "string (Markdown formatted full answer with bolded key terms, clear sections, and conversational delivery flow)",
  "keyTalkingPoints": ["string (3-4 concise soundbites the candidate should say in 30-60 seconds)"],
  "timeAndSpaceComplexity": "string (e.g. 'Time: O(N) | Space: O(1)' or 'Sub-10ms p99 latency with O(1) Redis lookups')",
  "tradeOffs": ["string (2-3 trade-offs considered, e.g. latency vs consistency)"],
  "codeOrDiagramSnippet": "string (clean code snippet or ASCII architecture diagram)",
  "topPitfallsAvoided": ["string (2-3 common candidate errors this answer avoids)"],
  "suggestedFollowUpPrep": ["string (1-2 likely follow-up questions interviewer will ask next)"]
}`,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    let data;
    try {
      data = JSON.parse(response.text || '{}');
    } catch {
      data = {
        structuredAnswer: response.text || 'Comprehensive technical answer generated.',
        keyTalkingPoints: ['Articulate core principle', 'Analyze trade-offs', 'Provide complexity guarantees'],
        timeAndSpaceComplexity: 'Time: O(N) | Space: O(1)',
        tradeOffs: ['Latency vs memory footprint'],
        codeOrDiagramSnippet: '// Sample implementation\nconst result = executeOptimally();',
        topPitfallsAvoided: ['Unbounded memory growth', 'Ignoring edge cases'],
        suggestedFollowUpPrep: ['How to scale across multiple regions'],
      };
    }

    res.json({
      success: true,
      ...data,
      style: answerStyle,
    });
  } catch (error: any) {
    console.error('Dev Interview Answer Generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Developer Code Challenge AI Reviewer & Optimizer
app.post('/api/ai/dev-code-review', async (req, res) => {
  try {
    const { code, language, challengeTitle, level, testCases } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        review: {
          score: 85,
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(1)',
          codeQualityRating: 'Good',
          strengths: ['Clean code structure', 'Handles standard input correctly'],
          bottlenecksOrBugs: ['Ensure null/empty array checks are handled safely'],
          architectureFeedback: 'Production-ready for standard workloads. Consider generator-based streaming for multi-gigabyte datasets.',
          optimizedCodeSnippet: code,
        },
        fallback: true,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `You are a Staff Software Engineer & Code Reviewer.
Challenge: ${challengeTitle}
Language: ${language}
Target Developer Level: ${level}
Candidate Code:
\`\`\`${language}
${code}
\`\`\`

Perform a comprehensive code review. Return strictly valid JSON with keys:
- score: number (0-100)
- timeComplexity: string (e.g. "O(N)", "O(N log N)")
- spaceComplexity: string (e.g. "O(1)", "O(N)")
- codeQualityRating: string ("Needs Improvement", "Acceptable", "Good", "Top-Class / Production-Ready")
- strengths: string[] (list of what the developer did well)
- bottlenecksOrBugs: string[] (edge cases missed, memory leaks, performance traps)
- architectureFeedback: string (advice on concurrency, design patterns, testing)
- optimizedCodeSnippet: string (the cleanest, most idiomatic production-grade refactored code)`,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    let parsed;
    try {
      parsed = JSON.parse(response.text || '{}');
    } catch {
      parsed = {
        score: 85,
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        codeQualityRating: 'Good',
        strengths: ['Solid algorithmic logic'],
        bottlenecksOrBugs: ['Validate edge cases with empty collections'],
        architectureFeedback: 'Good execution.',
      };
    }

    res.json({
      success: true,
      review: parsed,
    });
  } catch (error: any) {
    console.error('Dev code review error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve Vite build in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`StudyOS AI server running on http://localhost:${PORT}`);
});
