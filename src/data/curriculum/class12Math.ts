import { Chapter } from '../../types';

/**
 * Complete Class 12 Mathematics Curriculum (All 13 Chapters)
 * Rationalized NCERT 2025-26, CBSE, UPMSP, BSEB & National/State Boards
 */
export const CLASS_12_MATH_ALL_CHAPTERS: Chapter[] = [
  // Chapter 1
  {
    id: 'c12_math_ch1_relations_functions',
    subjectId: 'class12_math',
    chapterNo: 1,
    title: {
      en: 'Relations and Functions',
      hi: 'संबंध एवं फलन',
      hinglish: 'Relations & Functions',
    },
    description: {
      en: 'Types of relations (reflexive, symmetric, transitive, equivalence relation), types of functions (one-one / injective, onto / surjective, bijective), and composition of functions.',
      hi: 'संबंधों के प्रकार (स्वतुल्य, सममित, संक्रामक, तुल्यता संबंध), फलनों के प्रकार (एकैकी, आच्छादक, एकैकी आच्छादी फलन)।',
      hinglish: 'Equivalence relations, Injective (one-one), Surjective (onto), Bijective functions.',
    },
    targetMastery: 90,
    highYieldWeightage: 5,
    textbookRef: 'NCERT Mathematics Part 1 Class 12 Ch 1 / UPMSP Ganit Ch 1',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_equivalence_bijective',
        title: {
          en: 'Equivalence Relations & Bijective Functions',
          hi: 'तुल्यता संबंध एवं एकैकी-आच्छादक फलन',
          hinglish: 'Equivalence Relations & Bijective Functions',
        },
        summary: {
          en: 'A relation R on set A is an Equivalence Relation if and only if it is simultaneously: (1) Reflexive ((a, a) ∈ R for all a ∈ A), (2) Symmetric ((a, b) ∈ R ⇒ (b, a) ∈ R), and (3) Transitive ((a, b) ∈ R and (b, c) ∈ R ⇒ (a, c) ∈ R). A function f: A → B is Bijective if it is both Injective (f(x₁) = f(x₂) ⇒ x₁ = x₂) and Surjective (Range(f) = Co-domain B).',
          hi: 'एक संबंध तुल्यता संबंध होता है यदि वह स्वतुल्य, सममित एवं संक्रामक तीनों हो। फलन f एकैकी-आच्छादी (Bijective) होता है यदि वह एकैकी और आच्छादक दोनों हो।',
          hinglish: 'Equivalence: Reflexive + Symmetric + Transitive. Bijective: One-one and Onto.',
        },
        formula: 'f(x_1) = f(x_2) \\implies x_1 = x_2 \\quad (\\text{One-One}), \\quad \\text{Range}(f) = \\text{Codomain}(f) \\quad (\\text{Onto})',
        keyPoints: [
          {
            en: 'An equivalence relation partitions a non-empty set into pairwise disjoint subsets called equivalence classes.',
            hi: 'तुल्यता संबंध समुच्चय को असंयुक्त तुल्यता वर्गों में विभाजित करता है।',
            hinglish: 'Equivalence classes form a partition of the set.',
          },
          {
            en: 'A function f has an inverse function f⁻¹ if and only if f is bijective.',
            hi: 'फलन का प्रतिलोम तभी संभव होता है जब वह एकैकी एवं आच्छादक दोनों हो।',
            hinglish: 'Invertible function must be strictly bijective.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'A relation R on the set of all integers Z is defined by (a, b) ∈ R if and only if (a - b) is divisible by 5. What type of relation is R?',
            hi: 'पूर्णांकों के समुच्चय Z पर संबंध R इस प्रकार है कि (a, b) ∈ R यदि (a - b), 5 से विभाज्य है। यह संबंध कैसा है?',
            hinglish: '(a - b) is divisible by 5 relation R kaisa relation hai?',
          },
          options: [
            { en: 'Equivalence Relation (Reflexive, Symmetric, and Transitive)', hi: 'तुल्यता संबंध (स्वतुल्य, सममित एवं संक्रामक)', hinglish: 'Equivalence Relation' },
            { en: 'Symmetric only', hi: 'केवल सममित', hinglish: 'Symmetric only' },
            { en: 'Reflexive only', hi: 'केवल स्वतुल्य', hinglish: 'Reflexive only' },
            { en: 'Transitive only', hi: 'केवल संक्रामक', hinglish: 'Transitive only' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'a - a = 0 (divisible by 5, reflexive); if 5 | (a-b), then 5 | (b-a) (symmetric); if 5 | (a-b) and 5 | (b-c), then 5 | (a-c) (transitive). Hence, R is an equivalence relation.',
            hi: 'a - a = 0 (स्वतुल्य); a-b भाज्य है तो b-a भी भाज्य है (सममित); (a-b) + (b-c) = a-c भी भाज्य है (संक्रामक)। अतः यह तुल्यता संबंध है।',
            hinglish: 'Reflexive, symmetric, and transitive all hold true, making it an equivalence relation.',
          }
        },
      },
    ],
  },

  // Chapter 2
  {
    id: 'c12_math_ch2_inverse_trig',
    subjectId: 'class12_math',
    chapterNo: 2,
    title: {
      en: 'Inverse Trigonometric Functions',
      hi: 'प्रतिलोम त्रिकोणमितीय फलन',
      hinglish: 'Inverse Trigonometric Functions',
    },
    description: {
      en: 'Definition, range, domain, and principal value branches of inverse trigonometric functions (sin⁻¹ x, cos⁻¹ x, tan⁻¹ x, cosec⁻¹ x, sec⁻¹ x, cot⁻¹ x).',
      hi: 'प्रतिलोम त्रिकोणमितीय फलनों की परिभाषा, प्रांत, परिसर, तथा मुख्य मान शाखाएं।',
      hinglish: 'Principal value branch, domain and range of inverse trig functions.',
    },
    targetMastery: 90,
    highYieldWeightage: 4,
    textbookRef: 'NCERT Mathematics Part 1 Class 12 Ch 2 / UPMSP Ganit Ch 2',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_principal_value_branch',
        title: {
          en: 'Principal Value Branches of Inverse Trigonometric Functions',
          hi: 'प्रतिलोम त्रिकोणमितीय फलनों की मुख्य मान शाखाएं',
          hinglish: 'Principal Value Branches',
        },
        summary: {
          en: 'To define inverses, trig functions are restricted to standard principal value intervals: sin⁻¹ x has domain [-1, 1] and principal range [-π/2, π/2]; cos⁻¹ x has domain [-1, 1] and range [0, π]; tan⁻¹ x has domain (-∞, ∞) and range (-π/2, π/2). Properties: sin⁻¹(-x) = -sin⁻¹(x), whereas cos⁻¹(-x) = π - cos⁻¹(x).',
          hi: 'sin⁻¹ x का परिसर [-π/2, π/2], cos⁻¹ x का [0, π], तथा tan⁻¹ x का (-π/2, π/2) होता है। sin⁻¹(-x) = -sin⁻¹ x जबकि cos⁻¹(-x) = π - cos⁻¹ x होता है।',
          hinglish: 'sin⁻¹ range [-π/2, π/2], cos⁻¹ range [0, π], tan⁻¹ range (-π/2, π/2). Remember: cos⁻¹(-x) = π - cos⁻¹(x).',
        },
        formula: '\\sin^{-1}(-x) = -\\sin^{-1}(x), \\quad \\cos^{-1}(-x) = \\pi - \\cos^{-1}(x), \\quad \\sin^{-1}(x) + \\cos^{-1}(x) = \\frac{\\pi}{2}',
        keyPoints: [
          {
            en: 'Always verify if the angle falls inside the principal value range before writing sin⁻¹(sin θ) = θ; if θ ∉ [-π/2, π/2], reduce it into the branch first.',
            hi: 'sin⁻¹(sin θ) = θ केवल तभी सत्य है जब θ ∈ [-π/2, π/2] हो।',
            hinglish: 'sin⁻¹(sin θ) = θ only when θ is in [-π/2, π/2].',
          },
          {
            en: 'cos⁻¹(-1/2) equals π - π/3 = 2π/3, NOT -π/3, because the principal branch of cos⁻¹ x is [0, π].',
            hi: 'cos⁻¹(-1/2) का मान 2π/3 होता है क्योंकि परिसर [0, π] है।',
            hinglish: 'cos⁻¹(-1/2) = π - π/3 = 2π/3.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'What is the principal value of cos⁻¹(-1/2)?',
            hi: 'cos⁻¹(-1/2) का मुख्य मान क्या है?',
            hinglish: 'cos⁻¹(-1/2) ka principal value kya hoga?',
          },
          options: [
            { en: '2π / 3 (120°)', hi: '2π / 3 (120°)', hinglish: '2π / 3 (120°)' },
            { en: '-π / 3 (-60°)', hi: '-π / 3 (-60°)', hinglish: '-π / 3 (-60°)' },
            { en: 'π / 3 (60°)', hi: 'π / 3 (60°)', hinglish: 'π / 3 (60°)' },
            { en: '4π / 3 (240°)', hi: '4π / 3 (240°)', hinglish: '4π / 3 (240°)' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Using the identity cos⁻¹(-x) = π - cos⁻¹(x): cos⁻¹(-1/2) = π - cos⁻¹(1/2) = π - π/3 = 2π/3, which strictly lies in [0, π].',
            hi: 'cos⁻¹(-x) = π - cos⁻¹ x सूत्र से: π - π/3 = 2π/3, जो [0, π] में स्थित है।',
            hinglish: 'cos⁻¹(-1/2) = π - π/3 = 2π/3.',
          }
        },
      },
    ],
  },

  // Chapter 3
  {
    id: 'c12_math_ch3_matrices',
    subjectId: 'class12_math',
    chapterNo: 3,
    title: {
      en: 'Matrices',
      hi: 'आव्यूह',
      hinglish: 'Matrices',
    },
    description: {
      en: 'Matrix operations (addition, scalar multiplication, matrix multiplication non-commutativity), transpose of matrix, symmetric and skew-symmetric matrices (A = A^T vs A = -A^T), and expressing any square matrix as sum of symmetric and skew-symmetric matrices.',
      hi: 'आव्यूहों की संक्रियाएं (योग, गुणन), परिवर्त आव्यूह, सममित एवं विषम-सममित आव्यूह, तथा किसी वर्ग आव्यूह को सममित व विषम-सममित आव्यूहों के योग के रूप में व्यक्त करना।',
      hinglish: 'Matrix multiplication AB ≠ BA, symmetric (A^T = A), skew-symmetric (A^T = -A).',
    },
    targetMastery: 90,
    highYieldWeightage: 6,
    textbookRef: 'NCERT Mathematics Part 1 Class 12 Ch 3 / UPMSP Ganit Ch 3',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_symmetric_skew_multiplication',
        title: {
          en: 'Matrix Multiplication & Symmetric / Skew-Symmetric Matrices',
          hi: 'आव्यूह गुणन एवं सममित तथा विषम-सममित आव्यूह',
          hinglish: 'Matrix Multiplication & Symmetric Matrices',
        },
        summary: {
          en: 'Matrix multiplication AB is defined only when columns of A equal rows of B, and is generally non-commutative (AB ≠ BA). Transpose satisfies (AB)^T = B^T A^T. A square matrix A is Symmetric if A^T = A, and Skew-Symmetric if A^T = -A (where all diagonal elements are zero). Any square matrix can be uniquely decomposed as A = ½(A + A^T) + ½(A - A^T).',
          hi: 'आव्यूह गुणन सामान्यतः क्रमविनिमेय नहीं होता (AB ≠ BA)। सममित आव्यूह में A^T = A तथा विषम-सममित में A^T = -A होता है (विकर्ण अवयव सदैव शून्य)। A = ½(A + A^T) + ½(A - A^T)।',
          hinglish: 'AB ≠ BA in general. Transpose of product reverses order: (AB)^T = B^T A^T. Skew-symmetric diagonal entries are all 0.',
        },
        formula: '(A B)^T = B^T A^T, \\quad A = \\frac{1}{2}(A + A^T) + \\frac{1}{2}(A - A^T), \\quad a_{ii} = 0 \\quad (\\text{Skew-Symmetric})',
        keyPoints: [
          {
            en: 'All main diagonal elements of a skew-symmetric matrix are identically zero because a_ii = -a_ii implies 2a_ii = 0.',
            hi: 'विषम-सममित आव्यूह के मुख्य विकर्ण के सभी अवयव शून्य होते हैं (a_ii = -a_ii)।',
            hinglish: 'Diagonal elements of any skew-symmetric matrix are always zero.',
          },
          {
            en: 'Reversal law of transposes: (AB)^T = B^T A^T.',
            hi: 'परिवर्त का उत्क्रमण नियम: (AB)^T = B^T A^T।',
            hinglish: '(AB)^T = B^T A^T.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'What is always true regarding the main diagonal elements of any skew-symmetric matrix?',
            hi: 'किसी विषम-सममित आव्यूह के मुख्य विकर्ण के अवयवों के संबंध में क्या सदैव सत्य है?',
            hinglish: 'Kisi skew-symmetric matrix ke main diagonal elements ke baare me kya sach hai?',
          },
          options: [
            { en: 'They are all identically equal to zero (0)', hi: 'वे सभी सदैव शून्य (0) होते हैं', hinglish: 'All are identically zero (0)' },
            { en: 'They are all equal to one (1)', hi: 'वे सभी एक (1) होते हैं', hinglish: 'All are equal to 1' },
            { en: 'They can be arbitrary non-zero real numbers', hi: 'वे कोई भी वास्तविक संख्या हो सकते हैं', hinglish: 'Can be any numbers' },
            { en: 'They must all be negative integers', hi: 'वे सभी ऋणात्मक पूर्णांक होने चाहिए', hinglish: 'Must be negative' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'By definition of skew-symmetric matrix: a_ij = -a_ji. For diagonal entries where i = j: a_ii = -a_ii ⇒ 2a_ii = 0 ⇒ a_ii = 0.',
            hi: 'परिभाषा से a_ii = -a_ii ⇒ 2a_ii = 0 ⇒ a_ii = 0। विकर्ण अवयव सदैव शून्य होते हैं।',
            hinglish: 'a_ii = -a_ii means each diagonal element must be 0.',
          }
        },
      },
    ],
  },

  // Chapter 4
  {
    id: 'c12_math_ch4_determinants',
    subjectId: 'class12_math',
    chapterNo: 4,
    title: {
      en: 'Determinants',
      hi: 'सारणिक',
      hinglish: 'Determinants',
    },
    description: {
      en: 'Determinant of square matrix (up to 3x3), minors and cofactors, adjoint and inverse of a matrix (A⁻¹ = adj(A)/|A|), and solving system of linear equations using matrix method (X = A⁻¹ B).',
      hi: 'वर्ग आव्यूह का सारणिक, उपसारणिक एवं सहखंड, आव्यूह का सहखंडज व व्युत्क्रम (A⁻¹ = adj(A)/|A|), तथा आव्यूह विधि द्वारा रैखिक समीकरण निकाय का हल (X = A⁻¹ B)।',
      hinglish: 'Determinants, adj(A), inverse formula A⁻¹ = (1/|A|) adj(A), solving equations X = A⁻¹B.',
    },
    targetMastery: 90,
    highYieldWeightage: 7,
    textbookRef: 'NCERT Mathematics Part 1 Class 12 Ch 4 / UPMSP Ganit Ch 4',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_adjoint_inverse_matrix_method',
        title: {
          en: 'Adjoint, Inverse of a Matrix & Matrix Inversion Method',
          hi: 'सहखंडज, आव्यूह का व्युत्क्रम एवं आव्यूह विधि',
          hinglish: 'Adjoint, Inverse & Solving System of Equations',
        },
        summary: {
          en: 'A square matrix A is invertible if and only if it is non-singular (|A| ≠ 0). The inverse is given by A⁻¹ = (1 / |A|) adj(A). Key properties: A · adj(A) = |A| I, and |adj(A)| = |A|^(n-1) for an n × n matrix. A system of linear equations AX = B has a unique solution given by X = A⁻¹ B whenever |A| ≠ 0.',
          hi: 'व्युत्क्रमणीय आव्यूह हेतु |A| ≠ 0 होना आवश्यक है। A⁻¹ = (1 / |A|) adj(A)। महत्वपूर्ण गुण: A · adj(A) = |A| I तथा |adj(A)| = |A|^(n-1)। रैखिक निकाय का अद्वितीय हल X = A⁻¹ B होता है।',
          hinglish: 'A⁻¹ = adj(A) / |A|. For n×n matrix, |adj(A)| = |A|^(n-1). System solution: X = A⁻¹ B.',
        },
        formula: 'A^{-1} = \\frac{1}{|A|}\\operatorname{adj}(A), \\quad |\\operatorname{adj}(A)| = |A|^{n-1}, \\quad A(\\operatorname{adj} A) = |A| I_n, \\quad X = A^{-1} B',
        keyPoints: [
          {
            en: 'For a 3 × 3 matrix A with determinant |A| = 4, the determinant of its adjoint is |adj(A)| = |A|^(3-1) = 4² = 16.',
            hi: 'यदि 3 × 3 आव्यूह का |A| = 4 हो तो |adj(A)| = 4^(3-1) = 16 होता है।',
            hinglish: '|adj(A)| = |A|^(n-1) is a very frequent high-yield board question.',
          },
          {
            en: 'If |A| = 0, the matrix is singular and does not have an inverse.',
            hi: 'यदि |A| = 0 हो तो आव्यूह अव्युत्क्रमणीय होता है।',
            hinglish: 'Singular matrix has no inverse.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'If A is a 3 × 3 square matrix with determinant |A| = 5, what is the value of |adj(A)|?',
            hi: 'यदि A एक 3 × 3 क्रम का वर्ग आव्यूह है जिसका सारणिक |A| = 5 है, तो |adj(A)| का मान क्या होगा?',
            hinglish: 'Agar A 3x3 matrix hai aur |A| = 5, to |adj(A)| kitna hoga?',
          },
          options: [
            { en: '25 (5²)', hi: '25 (5²)', hinglish: '25 (5²)' },
            { en: '5', hi: '5', hinglish: '5' },
            { en: '125 (5³)', hi: '125 (5³)', hinglish: '125 (5³)' },
            { en: '1 / 5', hi: '1 / 5', hinglish: '1 / 5' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'For any n × n matrix, |adj(A)| = |A|^(n-1). Here n = 3, so |adj(A)| = |A|^(3-1) = 5² = 25.',
            hi: '|adj(A)| = |A|^(n-1) सूत्र से n = 3 के लिए: |adj(A)| = 5^(3-1) = 5² = 25।',
            hinglish: '|adj(A)| = |A|^(n-1) = 5^(3-1) = 25.',
          }
        },
      },
    ],
  },

  // Chapter 5
  {
    id: 'c12_math_ch5_continuity_differentiability',
    subjectId: 'class12_math',
    chapterNo: 5,
    title: {
      en: 'Continuity and Differentiability',
      hi: 'सांतत्य तथा अवकलनीयता',
      hinglish: 'Continuity & Differentiability',
    },
    description: {
      en: 'Continuity test at a point, differentiability, chain rule, derivative of inverse trig functions, implicit differentiation, logarithmic differentiation, derivatives of parametric functions, and second order derivatives (d²y/dx²).',
      hi: 'बिंदु पर सांतत्य, अवकलनीयता, श्रृंखला नियम, प्रतिलोम त्रिकोणमितीय फलनों के अवकलज, अस्पष्ट फलन, लघुगणकीय अवकलन, प्राचलिक फलन, तथा द्वितीय कोटि के अवकलज (d²y/dx²)।',
      hinglish: 'Chain rule, logarithmic differentiation for y = f(x)^g(x), parametric derivatives dy/dx = (dy/dt)/(dx/dt).',
    },
    targetMastery: 90,
    highYieldWeightage: 9,
    textbookRef: 'NCERT Mathematics Part 1 Class 12 Ch 5 / UPMSP Ganit Ch 5',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_logarithmic_parametric_differentiation',
        title: {
          en: 'Logarithmic Differentiation & Parametric Derivatives',
          hi: 'लघुगणकीय अवकलन एवं प्राचलिक अवकलज',
          hinglish: 'Logarithmic & Parametric Differentiation',
        },
        summary: {
          en: 'Logarithmic differentiation is required when differentiating functions of the form y = [u(x)]^[v(x)] or complicated products/quotients: take ln on both sides (ln y = v ln u) and differentiate implicitly: (1/y)(dy/dx) = v’ ln u + v (u’/u). For parametric equations x = f(t) and y = g(t), first derivative is dy/dx = (dy/dt) / (dx/dt), and second derivative is d²y/dx² = [d/dt (dy/dx)] / (dx/dt).',
          hi: 'जब फलन y = u(x)^v(x) के रूप में हो तो दोनों ओर log लेकर अवकलन करते हैं। प्राचलिक रूप x = f(t), y = g(t) में dy/dx = (dy/dt)/(dx/dt) तथा d²y/dx² = [d/dt(dy/dx)] / (dx/dt) होता है।',
          hinglish: 'For y = u^v, take log: ln y = v ln u. Parametric: dy/dx = (dy/dt)/(dx/dt). Don’t forget chain rule factor 1/(dx/dt) in d²y/dx².',
        },
        formula: '\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}, \\quad \\frac{d^2y}{dx^2} = \\frac{\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)}{\\frac{dx}{dt}}, \\quad \\frac{d}{dx}(x^x) = x^x(1 + \\ln x)',
        keyPoints: [
          {
            en: 'Every differentiable function is continuous, but the converse is NOT true (e.g. f(x) = |x| is continuous at x = 0 but not differentiable).',
            hi: 'प्रत्येक अवकलनीय फलन सतत होता है, परंतु इसका विलोम सदैव सत्य नहीं होता (जैसे f(x) = |x| x=0 पर सतत है किंतु अवकलनीय नहीं)।',
            hinglish: 'Differentiability implies continuity, but continuity does not guarantee differentiability.',
          },
          {
            en: 'Derivative of x^x is NOT x·x^(x-1); it is x^x(1 + ln x) obtained via logarithmic differentiation.',
            hi: 'x^x का अवकलज x^x(1 + ln x) होता है।',
            hinglish: 'd/dx(x^x) = x^x (1 + ln x).',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'If x = a cos θ and y = a sin θ, what is the value of dy/dx in terms of parameter θ?',
            hi: 'यदि x = a cos θ और y = a sin θ हो, तो dy/dx का मान क्या होगा?',
            hinglish: 'x = a cos θ, y = a sin θ hone par dy/dx kya hoga?',
          },
          options: [
            { en: '-cot θ', hi: '-cot θ', hinglish: '-cot θ' },
            { en: '-tan θ', hi: '-tan θ', hinglish: '-tan θ' },
            { en: 'tan θ', hi: 'tan θ', hinglish: 'tan θ' },
            { en: 'cot θ', hi: 'cot θ', hinglish: 'cot θ' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'dx/dθ = -a sin θ and dy/dθ = a cos θ. Therefore dy/dx = (dy/dθ) / (dx/dθ) = (a cos θ) / (-a sin θ) = -cot θ.',
            hi: 'dx/dθ = -a sin θ तथा dy/dθ = a cos θ। अतः dy/dx = (a cos θ)/(-a sin θ) = -cot θ।',
            hinglish: 'dy/dx = (a cos θ) / (-a sin θ) = -cot θ.',
          }
        },
      },
    ],
  },

  // Chapter 6
  {
    id: 'c12_math_ch6_application_of_derivatives',
    subjectId: 'class12_math',
    chapterNo: 6,
    title: {
      en: 'Application of Derivatives (AOD)',
      hi: 'अवकलज के अनुप्रयोग',
      hinglish: 'Application of Derivatives',
    },
    description: {
      en: 'Rate of change of quantities, strictly increasing and decreasing functions (f’(x) > 0 vs f’(x) < 0), maxima and minima, first derivative test, second derivative test, and practical optimization problems.',
      hi: 'राशियों के परिवर्तन की दर, वर्धमान एवं ह्रासमान फलन (f’(x) > 0 व f’(x) < 0), उच्चतम और निम्नतम मान, प्रथम व द्वितीय अवकलज परीक्षण, तथा इष्टतमीकरण समस्याएं।',
      hinglish: 'Rate of change, increasing/decreasing functions f’(x), local maxima/minima second derivative test.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Mathematics Part 1 Class 12 Ch 6 / UPMSP Ganit Ch 6',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_maxima_minima_second_derivative',
        title: {
          en: 'Second Derivative Test for Maxima, Minima & Optimization',
          hi: 'उच्चतम एवं निम्नतम हेतु द्वितीय अवकलज परीक्षण एवं इष्टतमीकरण',
          hinglish: 'Maxima and Minima Second Derivative Test',
        },
        summary: {
          en: 'Critical points c are where f’(c) = 0. According to the Second Derivative Test: if f’(c) = 0 and f’’(c) < 0, then f has a local maximum at c; if f’(c) = 0 and f’’(c) > 0, then f has a local minimum at c. If f’’(c) = 0, the test is inconclusive and the first derivative test must be used.',
          hi: 'क्रांतिक बिंदु पर f’(c) = 0 होता है। यदि f’(c) = 0 और f’’(c) < 0 हो तो स्थानीय उच्चतम; यदि f’’(c) > 0 हो तो स्थानीय निम्नतम होता है।',
          hinglish: 'f’(c) = 0 & f’’(c) < 0 → Local Maxima. f’(c) = 0 & f’’(c) > 0 → Local Minima.',
        },
        formula: 'f\'(c) = 0 \\implies \\begin{cases} f\'\'(c) < 0 & \\text{Local Maximum} \\\\ f\'\'(c) > 0 & \\text{Local Minimum} \\end{cases}',
        keyPoints: [
          {
            en: 'For a function to be strictly increasing on an open interval (a, b), f’(x) > 0 for all x ∈ (a, b).',
            hi: 'निरंतर वर्धमान फलन हेतु f’(x) > 0 होना आवश्यक है।',
            hinglish: 'Strictly increasing: f’(x) > 0 everywhere in the interval.',
          },
          {
            en: 'To find absolute (global) extrema on a closed interval [a, b], evaluate f(x) at all critical points AND at the two endpoints a and b.',
            hi: 'बंद अंतराल [a, b] में निरपेक्ष उच्चतम/निम्नतम मान हेतु क्रांतिक बिंदुओं के साथ-साथ सिरों a व b पर भी फलन का मान जाँचा जाता है।',
            hinglish: 'Global extrema on [a, b] requires checking critical points AND endpoints.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'At a critical point x = c where f’(c) = 0, the second derivative evaluates to f’’(c) = -12. What conclusion can be drawn regarding f(c)?',
            hi: 'एक क्रांतिक बिंदु x = c पर जहाँ f’(c) = 0 है, द्वितीय अवकलज का मान f’’(c) = -12 प्राप्त होता है। f(c) के विषय में क्या निष्कर्ष निकलता है?',
            hinglish: 'f’(c) = 0 aur f’’(c) = -12 hone par x = c par kya hoga?',
          },
          options: [
            { en: 'f has a local maximum at x = c', hi: 'x = c पर स्थानीय उच्चतम (Local Maximum) है', hinglish: 'f has a local maximum at x = c' },
            { en: 'f has a local minimum at x = c', hi: 'x = c पर स्थानीय निम्नतम (Local Minimum) है', hinglish: 'f has a local minimum at x = c' },
            { en: 'f has a point of inflection at x = c', hi: 'x = c नति परिवर्तन बिंदु है', hinglish: 'Point of inflection' },
            { en: 'The test fails completely', hi: 'परीक्षण असफल रहता है', hinglish: 'Test fails' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'By the second derivative test, f’’(c) < 0 indicates concave down curvature, which corresponds to a local maximum at x = c.',
            hi: 'f’’(c) < 0 (ऋणात्मक) होने पर वक्र नीचे की ओर नत होता है अतः बिंदु पर स्थानीय उच्चतम प्राप्त होता है।',
            hinglish: 'f’’(c) < 0 means local maximum.',
          }
        },
      },
    ],
  },

  // Chapter 7
  {
    id: 'c12_math_ch7_integrals',
    subjectId: 'class12_math',
    chapterNo: 7,
    title: {
      en: 'Integrals',
      hi: 'समाकलन',
      hinglish: 'Integrals',
    },
    description: {
      en: 'Indefinite integrals, integration by substitution, integration using trigonometric identities, integration by partial fractions, integration by parts (ILATE rule), definite integrals, Fundamental Theorem of Calculus, and properties of definite integrals (King’s property).',
      hi: 'अनिश्चित समाकलन, प्रतिस्थापन विधि, आंशिक भिन्नों द्वारा समाकलन, खंडशः समाकलन (ILATE नियम), निश्चित समाकलन, तथा निश्चित समाकलन के प्रगुण (किंग्स प्रॉपर्टी)।',
      hinglish: 'Integration by parts ∫u v dx = u∫v - ∫(u’∫v), King’s property ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx.',
    },
    targetMastery: 90,
    highYieldWeightage: 10,
    textbookRef: 'NCERT Mathematics Part 2 Class 12 Ch 7 / UPMSP Ganit Ch 7',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_by_parts_definite_properties',
        title: {
          en: 'Integration by Parts (ILATE) & King’s Definite Property',
          hi: 'खंडशः समाकलन (ILATE) एवं निश्चित समाकलन के प्रगुण',
          hinglish: 'Integration by Parts & Definite Properties',
        },
        summary: {
          en: 'Integration by parts formula: ∫ u v dx = u ∫ v dx - ∫ [u’ (∫ v dx)] dx, choosing the first function u using the ILATE order: Inverse, Logarithmic, Algebraic, Trigonometric, Exponential. Special formula: ∫ e^x [f(x) + f’(x)] dx = e^x f(x) + C. The most used definite integral property (King’s Property): ∫_a^b f(x) dx = ∫_a^b f(a + b - x) dx, and specifically ∫_0^a f(x) dx = ∫_0^a f(a - x) dx.',
          hi: 'खंडशः समाकलन: ∫ u v dx = u ∫ v dx - ∫ [u’ (∫ v dx)] dx (ILATE नियम)। विशेष सूत्र: ∫ e^x [f(x) + f’(x)] dx = e^x f(x) + C। निश्चित समाकलन का प्रगुण: ∫_0^a f(x) dx = ∫_0^a f(a - x) dx।',
          hinglish: 'ILATE for choosing first function. Special form: ∫ e^x [f(x) + f’(x)] dx = e^x f(x) + C. King’s rule: ∫₀ᵃ f(x) dx = ∫₀ᵃ f(a-x) dx.',
        },
        formula: '\\int u v\\,dx = u\\int v\\,dx - \\int \\left( u\' \\int v\\,dx \\right) dx, \\quad \\int e^x [f(x) + f\'(x)]\\,dx = e^x f(x) + C, \\quad \\int_0^a f(x)\\,dx = \\int_0^a f(a - x)\\,dx',
        keyPoints: [
          {
            en: 'King’s property solves classic integrals such as ∫₀^(π/2) [√sin x / (√sin x + √cos x)] dx = π/4 instantly by adding equations (2I = ∫₀^(π/2) 1 dx).',
            hi: 'किंग्स प्रगुण द्वारा ∫₀^(π/2) [√sin x / (√sin x + √cos x)] dx का मान तुरंत π/4 प्राप्त होता है।',
            hinglish: 'Adding I + I after applying King’s property yields I = π/4.',
          },
          {
            en: 'For odd functions (f(-x) = -f(x)), the symmetric definite integral ∫_(-a)^a f(x) dx is identically zero.',
            hi: 'विषम फलनों हेतु ∫_(-a)^a f(x) dx सदैव शून्य होता है।',
            hinglish: '∫_(-a)^a (odd function) dx = 0.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'What is the value of the definite integral ∫₀^(π/2) (sin x / (sin x + cos x)) dx?',
            hi: 'निश्चित समाकलन ∫₀^(π/2) (sin x / (sin x + cos x)) dx का मान क्या होगा?',
            hinglish: '∫₀^(π/2) (sin x / (sin x + cos x)) dx ki value kya hogi?',
          },
          options: [
            { en: 'π / 4', hi: 'π / 4', hinglish: 'π / 4' },
            { en: 'π / 2', hi: 'π / 2', hinglish: 'π / 2' },
            { en: '1', hi: '1', hinglish: '1' },
            { en: '0', hi: '0', hinglish: '0' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Using ∫₀^a f(x) dx = ∫₀^a f(a-x) dx, let I = ∫₀^(π/2) (sin x / (sin x + cos x)) dx. Then I = ∫₀^(π/2) (cos x / (cos x + sin x)) dx. Adding the two: 2I = ∫₀^(π/2) 1 dx = [x]₀^(π/2) = π/2 ⇒ I = π/4.',
            hi: 'प्रगुण 4 लगाकर दोनों समीकरण जोड़ने पर: 2I = ∫₀^(π/2) 1 dx = π/2, अतः I = π/4।',
            hinglish: 'King’s property gives 2I = π/2, so I = π/4.',
          }
        },
      },
    ],
  },

  // Chapter 8
  {
    id: 'c12_math_ch8_application_of_integrals',
    subjectId: 'class12_math',
    chapterNo: 8,
    title: {
      en: 'Application of Integrals (AOI)',
      hi: 'समाकलनों के अनुप्रयोग',
      hinglish: 'Application of Integrals',
    },
    description: {
      en: 'Area of bounded planar regions using vertical and horizontal strips, area enclosed by circles, parabolas, and ellipses in standard form (e.g. x²/a² + y²/b² = 1 gives Area = πab).',
      hi: 'समाकलन द्वारा समतलीय क्षेत्रों का क्षेत्रफल, मानक वृत्त, परवलय एवं दीर्घवृत्त (x²/a² + y²/b² = 1 का क्षेत्रफल = πab) द्वारा परिबद्ध क्षेत्र।',
      hinglish: 'Area under curves A = ∫ y dx, area of ellipse = πab, area of circle = πr².',
    },
    targetMastery: 90,
    highYieldWeightage: 6,
    textbookRef: 'NCERT Mathematics Part 2 Class 12 Ch 8 / UPMSP Ganit Ch 8',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_area_bounded_curves',
        title: {
          en: 'Area Under Simple Curves (Circles, Parabolas, Ellipses)',
          hi: 'सरल वक्रों (वृत्त, परवलय, दीर्घवृत्त) के अंतर्गत क्षेत्रफल',
          hinglish: 'Area Under Curves & Symmetrical Regions',
        },
        summary: {
          en: 'The area bounded by curve y = f(x), x-axis, and vertical lines x = a and x = b is A = ∫_a^b |y| dx. For symmetric curves, calculate the area of one quadrant and multiply by symmetry factor (e.g. 4 for an ellipse or circle). Total area of an ellipse x²/a² + y²/b² = 1 is 4 ∫₀^a (b/a)√(a² - x²) dx = πab.',
          hi: 'वक्र y = f(x) तथा x-अक्ष द्वारा परिबद्ध क्षेत्रफल A = ∫_a^b y dx होता है। सममित वक्रों (वृत्त, दीर्घवृत्त) में प्रथम चतुर्थांश का क्षेत्रफल निकालकर 4 से गुणा करते हैं। दीर्घवृत्त का कुल क्षेत्रफल πab होता है।',
          hinglish: 'Area = ∫ y dx. Ellipse area = πab. Circle of radius r area = πr².',
        },
        formula: 'A = \\int_a^b y\\,dx = \\int_a^b f(x)\\,dx, \\quad \\text{Area of Ellipse } \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 \\implies \\text{Area} = \\pi a b',
        keyPoints: [
          {
            en: 'Standard integral formula used in circular and elliptic areas: ∫ √(a² - x²) dx = (x/2)√(a² - x²) + (a²/2) sin⁻¹(x/a) + C.',
            hi: 'वृत्त व दीर्घवृत्त के क्षेत्रफल में प्रयुक्त सूत्र: ∫ √(a² - x²) dx = (x/2)√(a² - x²) + (a²/2) sin⁻¹(x/a) + C।',
            hinglish: 'Core formula: ∫ √(a² - x²) dx = (x/2)√(a²-x²) + (a²/2) sin⁻¹(x/a).',
          },
          {
            en: 'Area bounded by parabola y² = 4ax and its latus rectum x = a is 8a² / 3.',
            hi: 'परवलय y² = 4ax तथा इसके नाभिलंब x = a से घिरे क्षेत्र का क्षेत्रफल 8a²/3 होता है।',
            hinglish: 'Parabola and latus rectum bounded area = 8a²/3.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'What is the total area enclosed by the ellipse x² / 16 + y² / 9 = 1?',
            hi: 'दीर्घवृत्त x² / 16 + y² / 9 = 1 द्वारा परिबद्ध कुल क्षेत्रफल क्या होगा?',
            hinglish: 'Ellipse x²/16 + y²/9 = 1 ka total enclosed area kitna hoga?',
          },
          options: [
            { en: '12π sq units', hi: '12π वर्ग इकाई', hinglish: '12π sq units' },
            { en: '25π sq units', hi: '25π वर्ग इकाई', hinglish: '25π sq units' },
            { en: '144π sq units', hi: '144π वर्ग इकाई', hinglish: '144π sq units' },
            { en: '7π sq units', hi: '7π वर्ग इकाई', hinglish: '7π sq units' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Here a² = 16 ⇒ a = 4, and b² = 9 ⇒ b = 3. Enclosed area of an ellipse is πab = π(4)(3) = 12π square units.',
            hi: 'a = 4 तथा b = 3। दीर्घवृत्त का कुल क्षेत्रफल = πab = π × 4 × 3 = 12π वर्ग इकाई।',
            hinglish: 'Area = πab = π × 4 × 3 = 12π.',
          }
        },
      },
    ],
  },

  // Chapter 9
  {
    id: 'c12_math_ch9_differential_equations',
    subjectId: 'class12_math',
    chapterNo: 9,
    title: {
      en: 'Differential Equations',
      hi: 'अवकल समीकरण',
      hinglish: 'Differential Equations',
    },
    description: {
      en: 'Order and degree of differential equations, general vs particular solutions, variable separable method, homogeneous differential equations (y = vx substitution), and linear differential equations of first order (dy/dx + Py = Q, Integrating Factor IF = e^(∫P dx)).',
      hi: 'अवकल समीकरण की कोटि एवं घात, व्यापक व विशिष्ट हल, चर पृथक्करण विधि, समघातीय अवकल समीकरण (y = vx), तथा प्रथम कोटि के रैखिक अवकल समीकरण (dy/dx + Py = Q, समाकलन गुणक IF = e^(∫P dx))।',
      hinglish: 'Order & degree, separation of variables, Integrating Factor IF = e^(∫P dx), y · IF = ∫(Q · IF) dx + C.',
    },
    targetMastery: 90,
    highYieldWeightage: 7,
    textbookRef: 'NCERT Mathematics Part 2 Class 12 Ch 9 / UPMSP Ganit Ch 9',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_linear_differential_equations_if',
        title: {
          en: 'First Order Linear Differential Equations & Integrating Factor',
          hi: 'प्रथम कोटि के रैखिक अवकल समीकरण एवं समाकलन गुणक',
          hinglish: 'Linear Differential Equations & Integrating Factor',
        },
        summary: {
          en: 'A first order linear differential equation has the standard form dy/dx + P(x) y = Q(x). Its Integrating Factor is IF = e^(∫ P dx). Multiplying by the IF makes the left side a total derivative d/dx (y · IF). The general solution is: y · (IF) = ∫ [Q(x) · (IF)] dx + C.',
          hi: 'रैखिक अवकल समीकरण का मानक रूप dy/dx + Py = Q होता है। समाकलन गुणक IF = e^(∫ P dx) होता है तथा व्यापक हल y · (IF) = ∫ [Q · (IF)] dx + C होता है।',
          hinglish: 'Standard form: dy/dx + Py = Q. Integrating Factor: IF = e^(∫P dx). Solution: y · IF = ∫(Q · IF) dx + C.',
        },
        formula: '\\frac{dy}{dx} + P y = Q, \\quad \\text{I.F.} = e^{\\int P\\,dx}, \\quad y \\cdot (\\text{I.F.}) = \\int Q \\cdot (\\text{I.F.})\\,dx + C',
        keyPoints: [
          {
            en: 'Order is the highest derivative present in the equation; Degree is the power of the highest derivative once the equation is made a polynomial in derivatives.',
            hi: 'कोटि उच्चतम अवकलज का क्रम है; घात उस उच्चतम अवकलज की घात होती है जब समीकरण अवकलजों में बहुपद हो।',
            hinglish: 'Order = highest derivative; Degree = power of highest derivative.',
          },
          {
            en: 'If an equation contains sin(dy/dx), e^(dy/dx), or ln(dy/dx), its order is defined, but its degree is NOT defined.',
            hi: 'यदि समीकरण में sin(dy/dx) या e^(dy/dx) पद उपस्थित हों तो कोटि परिभाषित होती है किंतु घात अपरिभाषित होती है।',
            hinglish: 'Degree is undefined when derivatives are trapped inside transcendental functions.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'What is the Integrating Factor (I.F.) for the linear differential equation dy/dx + (2/x) y = x² ?',
            hi: 'रैखिक अवकल समीकरण dy/dx + (2/x) y = x² का समाकलन गुणक (I.F.) क्या होगा?',
            hinglish: 'dy/dx + (2/x)y = x² ka Integrating Factor kya hoga?',
          },
          options: [
            { en: 'x²', hi: 'x²', hinglish: 'x²' },
            { en: '2 ln x', hi: '2 ln x', hinglish: '2 ln x' },
            { en: 'x', hi: 'x', hinglish: 'x' },
            { en: 'e^(2x)', hi: 'e^(2x)', hinglish: 'e^(2x)' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Here P(x) = 2/x. Therefore IF = e^(∫ P dx) = e^(∫ (2/x) dx) = e^(2 ln x) = e^(ln x²) = x².',
            hi: 'P = 2/x ⇒ IF = e^(∫ 2/x dx) = e^(2 ln x) = e^(ln x²) = x²।',
            hinglish: 'IF = e^(∫ (2/x) dx) = e^(ln x²) = x².',
          }
        },
      },
    ],
  },

  // Chapter 10
  {
    id: 'c12_math_ch10_vector_algebra',
    subjectId: 'class12_math',
    chapterNo: 10,
    title: {
      en: 'Vector Algebra',
      hi: 'सदिश बीजगणित',
      hinglish: 'Vector Algebra',
    },
    description: {
      en: 'Vectors and scalars, magnitude and direction cosines/ratios, dot (scalar) product and projection of vector on line, cross (vector) product, area of triangle and parallelogram using vectors.',
      hi: 'सदिश एवं अदिश राशियां, दिक्-कोसाइन व दिक्-अनुपात, अदिश (डॉट) गुणन व प्रक्षेप, सदिश (क्रॉस) गुणन, तथा त्रिभुज व समांतर चतुर्भुज का क्षेत्रफल।',
      hinglish: 'Dot product a·b = |a||b|cosθ, Cross product a×b = |a||b|sinθ n̂, projection of a on b = (a·b)/|b|.',
    },
    targetMastery: 90,
    highYieldWeightage: 7,
    textbookRef: 'NCERT Mathematics Part 2 Class 12 Ch 10 / UPMSP Ganit Ch 10',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_dot_cross_product_projection',
        title: {
          en: 'Scalar (Dot) Product, Vector (Cross) Product & Projection',
          hi: 'अदिश (डॉट) गुणन, सदिश (क्रॉस) गुणन एवं प्रक्षेप',
          hinglish: 'Dot & Cross Products of Vectors',
        },
        summary: {
          en: 'The dot product of two vectors is a scalar: a · b = |a| |b| cos θ; two non-zero vectors are perpendicular if and only if a · b = 0. The projection of vector a on vector b is (a · b) / |b|. The cross product is a vector perpendicular to both: a × b = |a| |b| sin θ n̂; two non-zero vectors are parallel if and only if a × b = 0. Area of parallelogram with adjacent sides a and b is |a × b|.',
          hi: 'डॉट गुणन: a · b = |a| |b| cos θ। लंबवत सदिशों हेतु a · b = 0 होता है। a का b पर प्रक्षेप (a · b)/|b| होता है। क्रॉस गुणन: a × b = |a| |b| sin θ n̂। समांतर सदिशों हेतु a × b = 0 होता है। समांतर चतुर्भुज का क्षेत्रफल |a × b| होता है।',
          hinglish: 'Perpendicular condition: a·b = 0. Parallel condition: a×b = 0. Projection of a on b is (a·b)/|b|.',
        },
        formula: '\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta, \\quad \\text{Proj}_{\\vec{b}}(\\vec{a}) = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|}, \\quad \\vec{a} \\times \\vec{b} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix}',
        keyPoints: [
          {
            en: 'For standard orthonormal basis vectors: i · i = j · j = k · k = 1, while i · j = j · k = k · i = 0.',
            hi: 'एकांक सदिशों हेतु: i · i = j · j = k · k = 1 तथा i · j = j · k = k · i = 0 होता है।',
            hinglish: 'Dot product of same unit vector is 1; mutually perpendicular is 0.',
          },
          {
            en: 'Cross product is anti-commutative: a × b = - (b × a).',
            hi: 'क्रॉस गुणन प्रति-क्रमविनिमेय होता है: a × b = - (b × a)।',
            hinglish: 'a × b = - (b × a).',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'If vector a = 2î + 3ĵ + 2k̂ and vector b = î + 2ĵ + k̂, what is the projection of vector a on vector b?',
            hi: 'यदि सदिश a = 2î + 3ĵ + 2k̂ तथा सदिश b = î + 2ĵ + k̂ हो, तो सदिश a का सदिश b पर प्रक्षेप क्या होगा?',
            hinglish: 'Vector a ka vector b par projection kitna hoga?',
          },
          options: [
            { en: '10 / √6', hi: '10 / √6', hinglish: '10 / √6' },
            { en: '10 / √17', hi: '10 / √17', hinglish: '10 / √17' },
            { en: '5 / √6', hi: '5 / √6', hinglish: '5 / √6' },
            { en: '10', hi: '10', hinglish: '10' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'a · b = (2)(1) + (3)(2) + (2)(1) = 2 + 6 + 2 = 10. Magnitude |b| = √(1² + 2² + 1²) = √6. Projection = (a · b) / |b| = 10 / √6.',
            hi: 'a · b = 2 + 6 + 2 = 10। |b| = √(1 + 4 + 1) = √6। प्रक्षेप = 10 / √6।',
            hinglish: 'Projection = (a · b) / |b| = 10 / √6.',
          }
        },
      },
    ],
  },

  // Chapter 11
  {
    id: 'c12_math_ch11_3d_geometry',
    subjectId: 'class12_math',
    chapterNo: 11,
    title: {
      en: 'Three Dimensional Geometry (3D)',
      hi: 'त्रिविमीय ज्यामिति',
      hinglish: 'Three Dimensional Geometry',
    },
    description: {
      en: 'Direction cosines and direction ratios of a line, vector and Cartesian equations of a line in space (r = a + λb), angle between two lines, and shortest distance between two skew lines (d = |(b₁ × b₂) · (a₂ - a₁)| / |b₁ × b₂|).',
      hi: 'रेखा के दिक्-कोसाइन व दिक्-अनुपात, अंतरिक्ष में रेखा का सदिश व कार्तीय समीकरण (r = a + λb), दो रेखाओं के मध्य कोण, तथा दो विषमतलीय रेखाओं के बीच न्यूनतम दूरी।',
      hinglish: 'Line equation r = a + λb, shortest distance between skew lines d = |(b1 × b2)·(a2 - a1)| / |b1 × b2|.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Mathematics Part 2 Class 12 Ch 11 / UPMSP Ganit Ch 11',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_skew_lines_shortest_distance',
        title: {
          en: 'Shortest Distance Between Skew Lines in Space',
          hi: 'विषमतलीय रेखाओं के मध्य न्यूनतम दूरी',
          hinglish: 'Shortest Distance Between Skew Lines',
        },
        summary: {
          en: 'Skew lines are non-parallel, non-intersecting lines lying in different planes. For two skew lines r₁ = a₁ + λ b₁ and r₂ = a₂ + μ b₂, the shortest distance d is the length of the common perpendicular vector: d = |(b₁ × b₂) · (a₂ - a₁)| / |b₁ × b₂|. If d = 0, the lines intersect.',
          hi: 'विषमतलीय रेखाएं जो न तो समांतर होती हैं और न ही एक-दूसरे को काटती हैं। दो रेखाओं r = a₁ + λb₁ व r = a₂ + μb₂ के बीच न्यूनतम दूरी d = |(b₁ × b₂) · (a₂ - a₁)| / |b₁ × b₂| होती है। यदि d = 0 हो तो रेखाएं प्रतिच्छेद करती हैं।',
          hinglish: 'Shortest distance formula d = |(b1 × b2) · (a2 - a1)| / |b1 × b2|. If d = 0, lines intersect.',
        },
        formula: 'd = \\frac{\\left| (\\vec{b}_1 \\times \\vec{b}_2) \\cdot (\\vec{a}_2 - \\vec{a}_1) \\right|}{|\\vec{b}_1 \\times \\vec{b}_2|}',
        keyPoints: [
          {
            en: 'Two lines in 3D space intersect if and only if the scalar triple product (b₁ × b₂) · (a₂ - a₁) equals zero.',
            hi: 'दो रेखाएं एक-दूसरे को प्रतिच्छेद करेंगी यदि (b₁ × b₂) · (a₂ - a₁) = 0 हो।',
            hinglish: 'Lines intersect when shortest distance d = 0.',
          },
          {
            en: 'Cartesian equation of a line passing through (x₁, y₁, z₁) with direction ratios (a, b, c) is: (x - x₁)/a = (y - y₁)/b = (z - z₁)/c.',
            hi: 'बिंदु (x₁, y₁, z₁) से जाने वाली रेखा का कार्तीय रूप: (x - x₁)/a = (y - y₁)/b = (z - z₁)/c।',
            hinglish: 'Cartesian form: (x-x₁)/a = (y-y₁)/b = (z-z₁)/c.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'What is the necessary and sufficient condition for two lines r = a₁ + λb₁ and r = a₂ + μb₂ to intersect in 3D space?',
            hi: 'त्रिविम अंतरिक्ष में दो रेखाओं r = a₁ + λb₁ और r = a₂ + μb₂ के परस्पर प्रतिच्छेद करने की आवश्यक एवं पर्याप्त शर्त क्या है?',
            hinglish: 'Do lines intersect kab karengi?',
          },
          options: [
            { en: '(b₁ × b₂) · (a₂ - a₁) = 0', hi: '(b₁ × b₂) · (a₂ - a₁) = 0', hinglish: '(b₁ × b₂) · (a₂ - a₁) = 0' },
            { en: 'b₁ · b₂ = 0', hi: 'b₁ · b₂ = 0', hinglish: 'b₁ · b₂ = 0' },
            { en: 'b₁ × b₂ = 0', hi: 'b₁ × b₂ = 0', hinglish: 'b₁ × b₂ = 0' },
            { en: 'a₁ · a₂ = 0', hi: 'a₁ · a₂ = 0', hinglish: 'a₁ · a₂ = 0' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'If lines intersect, the shortest distance between them is zero: d = 0, which directly requires the scalar triple product numerator (b₁ × b₂) · (a₂ - a₁) to equal zero.',
            hi: 'प्रतिच्छेद करने पर दोनों रेखाओं के बीच न्यूनतम दूरी शून्य होती है, अतः अंश (b₁ × b₂) · (a₂ - a₁) = 0 होना चाहिए।',
            hinglish: 'Shortest distance numerator must be 0 for intersecting lines.',
          }
        },
      },
    ],
  },

  // Chapter 12
  {
    id: 'c12_math_ch12_linear_programming',
    subjectId: 'class12_math',
    chapterNo: 12,
    title: {
      en: 'Linear Programming (LPP)',
      hi: 'रैखिक प्रोग्रामन',
      hinglish: 'Linear Programming Problems',
    },
    description: {
      en: 'Mathematical formulation of LPP, objective function Z = ax + by, linear constraints, feasible region, bounded vs unbounded feasible regions, and Corner Point Method for finding optimal maximum/minimum.',
      hi: 'रैखिक प्रोग्रामन समस्या का गणितीय सूत्रीकरण, उद्देश्य फलन Z = ax + by, व्यवरोध, सुसंगत क्षेत्र (परिबद्ध व अपरिबद्ध), तथा कोनीय बिंदु विधि द्वारा इष्टतम मान ज्ञात करना।',
      hinglish: 'Objective function Z = ax + by, feasible region, Corner Point theorem for optimization.',
    },
    targetMastery: 90,
    highYieldWeightage: 5,
    textbookRef: 'NCERT Mathematics Part 2 Class 12 Ch 12 / UPMSP Ganit Ch 12',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_corner_point_method',
        title: {
          en: 'Corner Point Theorem for Optimal Feasible Solutions',
          hi: 'कोनीय बिंदु विधि एवं इष्टतम सुसंगत हल',
          hinglish: 'Corner Point Theorem & Feasible Region',
        },
        summary: {
          en: 'The Corner Point Theorem states that if the feasible region of an LPP is convex and bounded, the objective function Z = ax + by attains both its optimal maximum and minimum values at the extreme corner points (vertices) of the feasible region. If two corner points produce the same maximum (or minimum) value, then every single point on the line segment joining these two vertices also yields that same optimal value.',
          hi: 'कोनीय बिंदु प्रमेय के अनुसार किसी परिबद्ध सुसंगत क्षेत्र में उद्देश्य फलन Z = ax + by का अधिकतम अथवा न्यूनतम मान सुसंगत क्षेत्र के शीर्षों (कोनीय बिंदुओं) पर ही प्राप्त होता है।',
          hinglish: 'Optimal value of Z always occurs at corner points (vertices) of the bounded feasible region.',
        },
        formula: 'Z = a x + b y \\quad (\\text{Evaluate at all corner points } (x_i, y_i))',
        keyPoints: [
          {
            en: 'Non-negativity constraints x ≥ 0, y ≥ 0 restrict the feasible region strictly to the first quadrant of the Cartesian plane.',
            hi: 'ऋणेतर व्यवरोध x ≥ 0, y ≥ 0 सुसंगत क्षेत्र को प्रथम चतुर्थांश में सीमित करते हैं।',
            hinglish: 'x ≥ 0 and y ≥ 0 keeps feasible region in quadrant 1.',
          },
          {
            en: 'If the feasible region is unbounded, a corner point value M is a maximum only if the open half-plane ax + by > M has no common points with the feasible region.',
            hi: 'अपरिबद्ध क्षेत्र में मान M अधिकतम तभी होता है जब खुला अर्धतल ax + by > M सुसंगत क्षेत्र से कोई उभयनिष्ठ बिंदु न रखता हो।',
            hinglish: 'For unbounded region, check if open half-plane intersects feasible region.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'If two distinct corner points of a bounded feasible region yield the exact same maximum value of the objective function Z, how many points in the feasible region will give this maximum value?',
            hi: 'यदि किसी परिबद्ध सुसंगत क्षेत्र के दो अलग-अलग कोनीय बिंदु उद्देश्य फलन Z का समान अधिकतम मान देते हैं, तो सुसंगत क्षेत्र में ऐसे कितने बिंदु होंगे जो यह अधिकतम मान प्रदान करेंगे?',
            hinglish: 'Agar 2 corner points par same maximum Z milta hai, to total kitne points par maximum milega?',
          },
          options: [
            { en: 'Infinitely many points (every point on the segment joining the two vertices)', hi: 'अनंत बिंदु (दोनों शीर्षों को मिलाने वाले रेखाखंड का प्रत्येक बिंदु)', hinglish: 'Infinitely many points' },
            { en: 'Only those two specific corner points', hi: 'केवल वे दो कोनीय बिंदु', hinglish: 'Only those 2 points' },
            { en: 'Exactly zero points', hi: 'शून्य बिंदु', hinglish: 'Zero points' },
            { en: 'Three points', hi: 'तीन बिंदु', hinglish: 'Three points' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Because the objective function Z is linear, if it takes the same maximum value at two vertices, it is constant along the entire line segment connecting those two vertices, giving infinitely many optimal solutions.',
            hi: 'उद्देश्य फलन रैखिक होने के कारण दोनों शीर्षों को जोड़ने वाले रेखाखंड के प्रत्येक बिंदु पर वही अधिकतम मान प्राप्त होता है, अतः इसके अनंत हल होते हैं।',
            hinglish: 'Linearity implies every point on the line segment joining the two vertices gives the maximum value.',
          }
        },
      },
    ],
  },

  // Chapter 13
  {
    id: 'c12_math_ch13_probability',
    subjectId: 'class12_math',
    chapterNo: 13,
    title: {
      en: 'Probability',
      hi: 'प्रायिकता',
      hinglish: 'Probability',
    },
    description: {
      en: 'Conditional probability P(A|B) = P(A∩B)/P(B), multiplication theorem, independent events (P(A∩B) = P(A)P(B)), theorem of total probability, and Bayes’ Theorem.',
      hi: 'सप्रतिबंध प्रायिकता P(A|B) = P(A∩B)/P(B), गुणन प्रमेय, स्वतंत्र घटनाएं, संपूर्ण प्रायिकता प्रमेय, तथा बेज़ प्रमेय।',
      hinglish: 'Conditional probability P(A|B), Independent events, Bayes’ Theorem P(E₁|A).',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Mathematics Part 2 Class 12 Ch 13 / UPMSP Ganit Ch 13',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_bayes_theorem_conditional',
        title: {
          en: 'Bayes’ Theorem & Law of Total Probability',
          hi: 'बेज़ प्रमेय एवं संपूर्ण प्रायिकता प्रमेय',
          hinglish: 'Bayes’ Theorem & Conditional Probability',
        },
        summary: {
          en: 'Conditional probability of event A given B is P(A|B) = P(A ∩ B) / P(B). Events A and B are statistically independent if and only if P(A ∩ B) = P(A) · P(B). When a sample space is partitioned into mutually exclusive and exhaustive events E₁, E₂, ..., En, Bayes’ Theorem calculates the posterior probability of hypothesis Ei given observed event A: P(Ei | A) = [P(Ei) P(A | Ei)] / [Σ P(Ej) P(A | Ej)].',
          hi: 'सप्रतिबंध प्रायिकता P(A|B) = P(A∩B)/P(B)। स्वतंत्र घटनाओं हेतु P(A∩B) = P(A)P(B)। बेज़ प्रमेय पूर्व प्रायिकताओं व साक्ष्यों के आधार पर पश्च प्रायिकता ज्ञात करती है: P(Ei|A) = [P(Ei) P(A|Ei)] / Σ [P(Ej) P(A|Ej)]।',
          hinglish: 'Bayes’ theorem calculates posterior probability P(Ei|A) using prior probabilities and likelihoods.',
        },
        formula: 'P(E_i | A) = \\frac{P(E_i) P(A | E_i)}{\\sum_{j=1}^n P(E_j) P(A | E_j)}, \\quad P(A \\cap B) = P(A) P(B) \\quad (\\text{Independent})',
        keyPoints: [
          {
            en: 'Two mutually exclusive events with non-zero probabilities can NEVER be independent, because if one occurs, the probability of the other is 0.',
            hi: 'परस्पर अपवर्जी घटनाएं कभी भी स्वतंत्र नहीं हो सकतीं।',
            hinglish: 'Mutually exclusive events cannot be independent.',
          },
          {
            en: 'Bayes’ theorem reverses the condition: it determines the probability of a cause (Ei) given an observed outcome (A).',
            hi: 'बेज़ प्रमेय परिणाम ज्ञात होने पर कारण की प्रायिकता ज्ञात करती है (उल्टी प्रायिकता)।',
            hinglish: 'Bayes theorem calculates probability of the cause given the effect.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'If two events A and B are independent with P(A) = 0.4 and P(B) = 0.5, what is the value of P(A ∩ B)?',
            hi: 'यदि दो घटनाएं A तथा B स्वतंत्र हैं और P(A) = 0.4 तथा P(B) = 0.5 है, तो P(A ∩ B) का मान क्या होगा?',
            hinglish: 'Independent events A aur B ke liye P(A)=0.4, P(B)=0.5 hone par P(A ∩ B) kya hoga?',
          },
          options: [
            { en: '0.20', hi: '0.20', hinglish: '0.20' },
            { en: '0.90', hi: '0.90', hinglish: '0.90' },
            { en: '0.10', hi: '0.10', hinglish: '0.10' },
            { en: '0.45', hi: '0.45', hinglish: '0.45' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'For statistically independent events: P(A ∩ B) = P(A) × P(B) = 0.4 × 0.5 = 0.20.',
            hi: 'स्वतंत्र घटनाओं हेतु P(A ∩ B) = P(A) × P(B) = 0.4 × 0.5 = 0.20।',
            hinglish: 'P(A ∩ B) = P(A) × P(B) = 0.4 × 0.5 = 0.20.',
          }
        },
      },
    ],
  },
];
