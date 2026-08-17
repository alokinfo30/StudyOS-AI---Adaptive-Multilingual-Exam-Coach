/**
 * StudyOS AI - Developer Tech Interview Preparation Data & Curriculum
 * Spans Lowest in Knowledge (Junior/Novice) to Top-Class (Staff/Principal/Architect)
 * Stacks: Laravel (PHP), Python, JavaScript / TypeScript, AI / Machine Learning / LLMs, DSA, System Design
 */
import {
  TechTrack,
  DeveloperLevel,
  DevInterviewQuestion,
  DevCodeChallenge,
} from '../types';

export interface TechTrackInfo {
  id: TechTrack;
  name: string;
  badge: string;
  icon: string;
  description: string;
  color: string;
  keyTopics: string[];
}

export const TECH_TRACKS: TechTrackInfo[] = [
  {
    id: 'laravel',
    name: 'Laravel & Modern PHP',
    badge: 'PHP 8.3 / Laravel 11',
    icon: '🔴',
    description: 'From PHP fundamentals & MVC to Eloquent optimization, Service Containers, Queues, Octane & High-Throughput APIs.',
    color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-300',
    keyTopics: ['Eloquent ORM & N+1', 'Service Container & DI', 'Queue Workers & Redis', 'Database Transactions', 'Octane & Concurrency'],
  },
  {
    id: 'python',
    name: 'Python & Backend Systems',
    badge: 'Python 3.12 / AsyncIO',
    icon: '🐍',
    description: 'From basic data structures to GIL, Memory Management, Generators/Decorators, AsyncIO, FastAPI & High-Performance Python.',
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-300',
    keyTopics: ['Memory & Garbage Collection', 'GIL & Multi-threading', 'AsyncIO Event Loop', 'Generators & Iterators', 'FastAPI & Pydantic'],
  },
  {
    id: 'javascript',
    name: 'JavaScript, TypeScript & React',
    badge: 'ESNext / React 19 / Node',
    icon: '⚡',
    description: 'From closures & event loop to React Fiber reconciliation, TypeScript type gymnastics, Node.js streams & full-stack design.',
    color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-300',
    keyTopics: ['Event Loop & Microtasks', 'React Internals & Hooks', 'TypeScript Generics', 'Node.js Streams & Buffers', 'SSR / SSG & Hydration'],
  },
  {
    id: 'ai_ml',
    name: 'AI, LLMs & Machine Learning',
    badge: 'PyTorch / Transformers / RAG',
    icon: '🧠',
    description: 'From regression basics to Transformer attention mathematics, LoRA fine-tuning, Agentic Workflows, Vector DBs & Quantization.',
    color: 'from-purple-500/20 to-violet-500/10 border-purple-500/30 text-purple-300',
    keyTopics: ['Self-Attention & Transformers', 'RAG vs Fine-Tuning (LoRA)', 'Vector Embeddings & Cosine Search', 'Agent Loops & Tool Calling', 'Model Quantization (GGUF/AWQ)'],
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    badge: 'LeetCode / Big-O',
    icon: '🧩',
    description: 'From two-pointers and sliding window to Dynamic Programming, Graphs (BFS/DFS/Dijkstra), Trees & Trie optimization.',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
    keyTopics: ['Time/Space Complexity O(N)', 'Sliding Window & Two Pointers', 'Graph Algorithms', 'Dynamic Programming', 'Trie & Segment Trees'],
  },
  {
    id: 'system_design',
    name: 'System Design & High Scalability',
    badge: 'Staff / Principal Architect',
    icon: '🏛️',
    description: 'From client-server basics to multi-region distributed databases, Kafka streaming, Redis sharding, and 99.999% availability.',
    color: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/30 text-indigo-300',
    keyTopics: ['Distributed Caching & Sharding', 'Event-Driven Systems (Kafka)', 'CAP Theorem & Consistency', 'Rate Limiters & API Gateways', 'Database Replication & Consensus'],
  },
];

export const DEVELOPER_LEVELS: { id: DeveloperLevel; label: string; sub: string; badgeColor: string }[] = [
  {
    id: 'beginner',
    label: 'Level 1: Novice / Junior (Lowest Knowledge)',
    sub: 'Clean foundations, zero-jargon syntax breakdowns, fundamental patterns & mental models.',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'intermediate',
    label: 'Level 2: Mid-Level Developer',
    sub: 'Idiomatic patterns, database indexes, async mechanics, error recovery & practical production APIs.',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    id: 'senior',
    label: 'Level 3: Senior Engineer',
    sub: 'Memory leaks, race conditions, internals, concurrency, benchmarking & architectural trade-offs.',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    id: 'top_class',
    label: 'Level 4: Top-Class Staff / Architect',
    sub: 'Ultra high-throughput, distributed consensus, failure isolation, cost-optimization & engineering leadership.',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
];

export const DEV_INTERVIEW_QUESTIONS: DevInterviewQuestion[] = [
  // ===================== LARAVEL & PHP =====================
  {
    id: 'q_lar_beg_01',
    track: 'laravel',
    level: 'beginner',
    title: 'How does Laravel Routing & MVC Architecture work?',
    topic: 'MVC & Lifecycle',
    prompt: 'Explain what happens when a user hits a route in a Laravel application. How do the Route, Controller, Model, and Blade View work together?',
    expectedAnswerSummary: 'The HTTP request enters `public/index.php`, loads the HTTP Kernel and Middleware, matches the Route file (`routes/web.php` or `api.php`), invokes the Controller method. The Controller queries data via the Eloquent Model and passes variables to a Blade template or JSON response.',
    deepDiveFollowUps: [
      'What is the role of Route Model Binding?',
      'Why should you never write heavy database queries inside Blade views?',
    ],
    commonMisconceptions: [
      'Thinking Blade runs on the client browser (Blade compiles down to pure PHP on the server).',
      'Confusing Route Middleware with Controller constructors.',
    ],
    keyArchitecturePoints: [
      'Single entry point: `public/index.php`',
      'HTTP Kernel handles global middleware stack',
      'Controller orchestrates business logic without tight database coupling',
    ],
    exampleSolution: `Route::get('/users/{user}', [UserController::class, 'show']);

class UserController extends Controller {
    public function show(User $user) {
        // Implicit Route Model Binding automatically fetches User or returns 404
        return view('users.show', ['user' => $user]);
    }
}`,
  },
  {
    id: 'q_lar_top_01',
    track: 'laravel',
    level: 'top_class',
    title: 'Solving Eloquent N+1, Chunking vs Cursor & Octane Memory Leaks',
    topic: 'High Throughput & Concurrency',
    prompt: 'At 50,000 requests/sec with Laravel Octane (Swoole/RoadRunner), explain how state persistence causes memory leaks with static variables/singletons, and how to query 10 million rows without blowing PHP RAM.',
    expectedAnswerSummary: 'In traditional PHP-FPM, memory is wiped after each request. In Octane, workers stay in memory: singleton service bindings or static class properties accumulate data across requests unless reset in listeners. For 10M rows, use `lazy()` or `cursor()` (PHP Generators) to stream PDO records one-by-one without buffering everything in memory.',
    deepDiveFollowUps: [
      'How does `LazyCollection` leverage PHP generators under the hood?',
      'How does Laravel Octane handle database connection pooling vs Swoole coroutines?',
    ],
    commonMisconceptions: [
      'Assuming `chunk(1000)` prevents offset drift when updating rows (use `chunkById` instead).',
      'Believing Eloquent `with()` solves all N+1 cases without proper composite database indexes.',
    ],
    keyArchitecturePoints: [
      'Octane worker lifespan management & container resetting',
      'Generator-based streaming (`cursor()`) reduces memory footprint from O(N) to O(1)',
      'Composite B-Tree database indexes for high-cardinality relations',
    ],
  },

  // ===================== PYTHON =====================
  {
    id: 'q_py_beg_01',
    track: 'python',
    level: 'beginner',
    title: 'List vs Tuple vs Dictionary & Mutability',
    topic: 'Data Structures & Mutability',
    prompt: 'What is the difference between a Python List, Tuple, and Dictionary? When would you choose a Tuple over a List?',
    expectedAnswerSummary: 'Lists are mutable ordered collections `[]`. Tuples are immutable ordered collections `()` that have smaller memory overhead and can be used as dictionary keys if all elements are hashable. Dictionaries are key-value mappings `{}` with $O(1)$ average lookup time.',
    deepDiveFollowUps: [
      'What makes an object hashable in Python?',
      'Can a tuple containing a list be used as a dictionary key? Why not?',
    ],
    commonMisconceptions: [
      'Thinking tuples cannot contain mutable objects (a tuple can contain a list, but that tuple becomes unhashable).',
    ],
    keyArchitecturePoints: [
      'Hash table lookup mechanics in CPython',
      'Tuple struct optimization in PyObject allocation',
    ],
  },
  {
    id: 'q_py_top_01',
    track: 'python',
    level: 'top_class',
    title: 'GIL Internals, AsyncIO Event Loop & Zero-Copy Memory Views',
    topic: 'Concurrency & CPython Internals',
    prompt: 'Deep dive into how CPython Global Interpreter Lock (GIL) operates during CPU-bound vs I/O-bound tasks. How does AsyncIO achieve cooperative multitasking on a single thread, and when should you use `memoryview` or `ctypes`?',
    expectedAnswerSummary: 'The GIL ensures only one native thread executes Python bytecode at a time to protect CPython reference counting. In I/O-bound tasks, C extensions and OS system calls release the GIL. AsyncIO uses a single-threaded reactor pattern (`epoll`/`kqueue`) with co-routines yielding via `await`. For zero-copy array operations, `memoryview` slices buffer protocols without copying memory.',
    deepDiveFollowUps: [
      'How does Python 3.13 free-threaded (PEP 703) remove the GIL and what are the trade-offs on single-core speed?',
      'How does uvloop accelerate Python AsyncIO to rival Go and Node.js?',
    ],
    commonMisconceptions: [
      'Thinking AsyncIO runs multiple CPU tasks in parallel (it is concurrent cooperative multitasking, not parallel multithreading).',
    ],
    keyArchitecturePoints: [
      'CPython bytecode evaluation loop (`ceval.c`) and GIL tick counter',
      'AsyncIO non-blocking socket polling via OS kernel epoll',
      'Zero-copy memory buffers for 10Gbps networking/AI tensor processing',
    ],
  },

  // ===================== JAVASCRIPT & REACT =====================
  {
    id: 'q_js_beg_01',
    track: 'javascript',
    level: 'beginner',
    title: 'Closures, Scope Chain & `var` vs `let` vs `const`',
    topic: 'Core JavaScript & Closures',
    prompt: 'What is a closure in JavaScript? Explain with a simple practical example of creating a private counter variable.',
    expectedAnswerSummary: 'A closure is the combination of a function bundled together with references to its surrounding lexical environment. It allows an inner function to access an outer function scope even after the outer function has executed and returned.',
    deepDiveFollowUps: [
      'What happens in memory when a closure keeps references alive?',
      'How does `let` create block-scoping inside `for` loops compared to `var`?',
    ],
    commonMisconceptions: [
      'Confusing execution context with lexical scope.',
    ],
    keyArchitecturePoints: [
      'Lexical environment record and outer reference pointers',
      'Garbage collector retains scope variables referenced by surviving closure functions',
    ],
    exampleSolution: `function createCounter() {
    let count = 0; // Private variable trapped in closure
    return {
        increment: () => ++count,
        getValue: () => count
    };
}
const counter = createCounter();
console.log(counter.increment()); // 1`,
  },
  {
    id: 'q_js_top_01',
    track: 'javascript',
    level: 'top_class',
    title: 'React 19 Fiber Reconciliation, Concurrent Mode & V8 Hidden Classes',
    topic: 'Frontend Engine & V8 Optimization',
    prompt: 'Explain how React Fiber converts recursive virtual DOM diffing into a linked-list work loop that allows priority interruptible rendering. How does the V8 engine optimize JavaScript objects using Hidden Classes and Inline Caching?',
    expectedAnswerSummary: 'Traditional React stack reconciler was synchronous and blocked the main thread. Fiber creates a singly linked-list tree of units of work (`child`, `sibling`, `return`). Time slicing via `requestIdleCallback` / scheduler checks time remaining (`shouldYield()`). V8 assigns dynamic hidden classes (Shapes) to objects; adding properties in consistent order allows monomorphic Inline Caches (IC) to turn property lookups into fast memory offset accesses.',
    deepDiveFollowUps: [
      'How does React 19 Server Components (RSC) stream serialized JSON payload over HTTP without shipping client JavaScript bundles?',
      'How do polymorphic or megamorphic ICs degrade performance in hot code paths?',
    ],
    commonMisconceptions: [
      'Believing `useMemo` is always free (creating cache keys and comparisons has memory and runtime overhead).',
    ],
    keyArchitecturePoints: [
      'Fiber double buffering tree (`current` and `workInProgress`)',
      'Lane priority bitmasks for scheduling user inputs over background updates',
      'V8 TurboFan JIT compiler de-optimizations when object shapes mutate',
    ],
  },

  // ===================== ARTIFICIAL INTELLIGENCE & LLMS =====================
  {
    id: 'q_ai_beg_01',
    track: 'ai_ml',
    level: 'beginner',
    title: 'What is an LLM, Tokenization & Prompt Engineering?',
    topic: 'Foundations of GenAI',
    prompt: 'Explain to a beginner what a Large Language Model (LLM) is, how text is converted into tokens and embeddings, and what difference System Prompt vs User Prompt makes.',
    expectedAnswerSummary: 'An LLM is a deep neural network trained to predict the next token based on statistical probabilities. Text is tokenized into word pieces (e.g. BPE), mapped into high-dimensional vector embeddings, and processed through transformer layers. The System prompt sets foundational behavioral guardrails, while the User prompt contains the immediate query.',
    deepDiveFollowUps: [
      'Why can 1 token roughly equal 0.75 English words?',
      'What is Temperature and Top-P in LLM sampling?',
    ],
    commonMisconceptions: [
      'Thinking LLMs query a live SQL database by default (they generate completions based on trained weights unless grounded via RAG/tools).',
    ],
    keyArchitecturePoints: [
      'Byte-Pair Encoding (BPE) tokenization',
      'Vector space semantic representations',
      'Next-token autoregressive generation',
    ],
  },
  {
    id: 'q_ai_top_01',
    track: 'ai_ml',
    level: 'top_class',
    title: 'Scaled Dot-Product Attention, LoRA/QLoRA & Production RAG Architecture',
    topic: 'Architectural Deep Dive & Enterprise RAG',
    prompt: 'Mathematically derive Scaled Dot-Product Attention: $Attention(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$. Explain how Low-Rank Adaptation (LoRA) updates $W = W_0 + \\frac{\\alpha}{r}BA$, and design an enterprise-scale hybrid RAG system handling 100M documents with sub-200ms latency.',
    expectedAnswerSummary: 'Scaled dot-product computes similarity between Query and Key matrices, scaled by $\\sqrt{d_k}$ to prevent gradient vanishing in extreme softmax regions. LoRA freezes $d \\times k$ base weights $W_0$ and injects trainable rank decomposition matrices $A (r \\times k)$ and $B (d \\times r)$ with $r \\ll \\min(d,k)$, saving 99% VRAM. Enterprise RAG combines Dense (HNSW / Cosine) + Sparse (BM25) search with Reciprocal Rank Fusion (RRF), Cross-Encoder Re-ranking, and speculative decoding.',
    deepDiveFollowUps: [
      'Why does QLoRA with 4-bit NormalFloat (NF4) and double quantization preserve FP16 accuracy?',
      'How does KV-Cache paging (vLLM) eliminate memory fragmentation during multi-turn generation?',
    ],
    commonMisconceptions: [
      'Assuming increasing chunk size always improves RAG accuracy (it introduces semantic dilution and noise).',
    ],
    keyArchitecturePoints: [
      'FlashAttention-2 kernel IO-aware GPU SRAM tiling',
      'Hierarchical indexing with parent-child chunk mapping',
      'Semantic routing and guardrail verification before generation',
    ],
  },
];

export const DEV_CODE_CHALLENGES: DevCodeChallenge[] = [
  {
    id: 'ch_lar_01',
    track: 'laravel',
    level: 'intermediate',
    title: 'Implement Eloquent Repository with Eager Loading & Cache Fallback',
    difficulty: 'Medium',
    language: 'php',
    expectedTimeMinutes: 15,
    description: 'Write a repository method `getTopTrendingPosts(int $limit = 10)` that fetches active posts with their author (User) and category relation, prevents N+1 query problem, caches results in Redis for 600 seconds, and tags the cache for atomic invalidation.',
    starterCode: `<?php

namespace App\\Repositories;

use App\\Models\\Post;
use Illuminate\\Support\\Facades\\Cache;
use Illuminate\\Database\\Eloquent\\Collection;

class PostRepository
{
    /**
     * Fetch trending active posts with user & category
     * 
     * @param int $limit
     * @return Collection
     */
    public function getTopTrendingPosts(int $limit = 10): Collection
    {
        // TODO: Implement eager loading, Redis cache with tags and return collection
        return Post::all();
    }
}`,
    testCases: [
      { input: 'limit = 5', expected: '5 cached Post models with user & category eager loaded', description: 'Prevents N+1 queries by using with([\'user\', \'category\'])' },
      { input: 'limit = 10', expected: 'Cache::tags([\'posts\'])->remember(...) is called', description: 'Caches query result with atomic tag invalidation' },
    ],
    hints: [
      'Use `Post::with([\'user\', \'category\'])` to eager load relations in a single query.',
      'Use `Cache::tags([\'posts\'])->remember(\'trending_\'.$limit, 600, fn() => ...)`',
    ],
    solutionCode: `public function getTopTrendingPosts(int $limit = 10): Collection
{
    return Cache::tags(['posts', 'trending'])->remember("trending_posts_{$limit}", 600, function () use ($limit) {
        return Post::query()
            ->where('is_active', true)
            ->with([
                'user:id,name,avatar',
                'category:id,name,slug'
            ])
            ->orderByDesc('views_count')
            ->limit($limit)
            ->get();
    });
}`,
    complexity: { time: 'O(1) cached / O(N log N) database index query', space: 'O(N) memory' },
    bestPractices: [
      'Select only specific columns in relations (`user:id,name`) to conserve memory',
      'Use Cache tags so when a post is updated, `Cache::tags([\'posts\'])->flush()` purges only relevant keys',
    ],
  },
  {
    id: 'ch_py_01',
    track: 'python',
    level: 'intermediate',
    title: 'Fast Stream Chunk Aggregator using Generators & AsyncIO',
    difficulty: 'Medium',
    language: 'python',
    expectedTimeMinutes: 15,
    description: 'Implement an asynchronous generator `stream_process_batches(stream_iterator, batch_size=100)` that accepts an async stream of user events, buffers them into fixed batches of size `batch_size`, and yields each batch immediately without accumulating the entire dataset in RAM ($O(1)$ memory).',
    starterCode: `from typing import AsyncIterator, List, Any

async def stream_process_batches(
    stream: AsyncIterator[Any], 
    batch_size: int = 100
) -> AsyncIterator[List[Any]]:
    """
    Stream and yield items in batches of batch_size asynchronously
    Memory complexity must be O(batch_size), not O(Total_Dataset)
    """
    batch = []
    # TODO: Write async iteration loop
    pass`,
    testCases: [
      { input: '1,000 items stream with batch_size=100', expected: '10 yields of list size 100', description: 'Yields exact batches' },
      { input: '55 items stream with batch_size=20', expected: '2 batches of 20, 1 final batch of 15', description: 'Flushes leftover batch on stream end' },
    ],
    hints: [
      'Use `async for item in stream:` loop.',
      'When `len(batch) == batch_size`, yield `batch` and reset `batch = []`.',
      'Do not forget to yield remaining items after loop terminates if `batch` is non-empty.',
    ],
    solutionCode: `async def stream_process_batches(
    stream: AsyncIterator[Any], 
    batch_size: int = 100
) -> AsyncIterator[List[Any]]:
    batch = []
    async for item in stream:
        batch.append(item)
        if len(batch) >= batch_size:
            yield batch
            batch = []
    if batch:
        yield batch`,
    complexity: { time: 'O(N) linear time', space: 'O(B) where B is batch_size' },
    bestPractices: [
      'Yielding batches bounds memory overhead to O(B) regardless of total records',
      'Proper generator teardown handles client disconnections gracefully',
    ],
  },
  {
    id: 'ch_ai_01',
    track: 'ai_ml',
    level: 'top_class',
    title: 'Vector Cosine Similarity & Top-K Retrieval Engine',
    difficulty: 'Staff-Architect',
    language: 'python',
    expectedTimeMinutes: 20,
    description: 'Implement a high-performance Cosine Similarity calculation and Top-K retrieval function in NumPy/Python without external vector databases. Given a query vector $q$ and matrix of document embeddings $D$ ($N \\times d$), compute normalized cosine similarity and return top-$k$ indices in $O(N + k \\log k)$ using `np.argpartition`.',
    starterCode: `import numpy as np
from typing import List, Tuple

def retrieve_top_k(
    query_vector: np.ndarray, 
    doc_matrix: np.ndarray, 
    k: int = 5
) -> List[Tuple[int, float]]:
    """
    Compute Cosine Similarity: dot(q, d) / (||q|| * ||d||)
    Return sorted top-k (doc_index, similarity_score)
    """
    # TODO: Implement normalized dot product & argpartition
    return []`,
    testCases: [
      { input: '10,000 docs (dim=768), k=5', expected: 'Top 5 matches sorted descending', description: 'Uses np.argpartition for O(N) rather than full O(N log N) sort' },
    ],
    hints: [
      'Pre-normalize both query vector and document rows with $L_2$ norm.',
      'Cosine similarity is then just matrix-vector multiplication: `doc_matrix @ query_norm`.',
      'Use `np.argpartition(-scores, k)[:k]` to get top-k without sorting all N elements.',
    ],
    solutionCode: `def retrieve_top_k(
    query_vector: np.ndarray, 
    doc_matrix: np.ndarray, 
    k: int = 5
) -> List[Tuple[int, float]]:
    # L2 normalize query
    q_norm = query_vector / (np.linalg.norm(query_vector) + 1e-10)
    
    # L2 normalize doc matrix along rows
    d_norms = np.linalg.norm(doc_matrix, axis=1, keepdims=True) + 1e-10
    normalized_docs = doc_matrix / d_norms
    
    # Cosine similarities
    scores = np.dot(normalized_docs, q_norm)
    
    # Top-K via argpartition for optimal O(N) selection
    k = min(k, len(scores))
    top_indices = np.argpartition(-scores, k)[:k]
    sorted_top = top_indices[np.argsort(-scores[top_indices])]
    
    return [(int(idx), float(scores[idx])) for idx in sorted_top]`,
    complexity: { time: 'O(N * d + k log k)', space: 'O(N)' },
    bestPractices: [
      'Adding epsilon `1e-10` avoids division by zero on zero vectors',
      '`argpartition` avoids full O(N log N) sorting, speeding up retrieval by up to 50x on large vector sets',
    ],
  },
];
