import { Chapter } from '../../types';

/**
 * Complete Class 10 Mathematics Curriculum (All 14 Chapters)
 * Rationalized NCERT 2025-26, CBSE, UP Board (UPMSP), Bihar Board (BSEB) & State Boards
 */
export const CLASS_10_MATH_ALL_CHAPTERS: Chapter[] = [
  // Chapter 1
  {
    id: 'c10_math_ch1_real_numbers',
    subjectId: 'class10_math',
    chapterNo: 1,
    title: {
      en: 'Real Numbers',
      hi: 'वास्तविक संख्याएँ',
      hinglish: 'Real Numbers',
      bn: 'বাস্তব সংখ্যা',
      mr: 'वास्तव संख्या',
    },
    description: {
      en: 'The Fundamental Theorem of Arithmetic, prime factorization, finding HCF and LCM, and proofs of irrationality of √2, √3, and √5.',
      hi: 'अंकगणित की आधारभूत प्रमेय, अभाज्य गुणनखंड विधि, म०स० (HCF) एवं ल०स० (LCM), तथा √2, √3, √5 की अपरिमेयता के सत्यापन।',
      hinglish: 'Fundamental Theorem of Arithmetic, HCF x LCM = Product, aur proofs of irrationality.',
    },
    targetMastery: 90,
    highYieldWeightage: 6,
    textbookRef: 'NCERT Mathematics Class 10 Chapter 1 / UPMSP Ganit Ch 1',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_fundamental_theorem_arithmetic',
        title: {
          en: 'Fundamental Theorem of Arithmetic & HCF-LCM Relation',
          hi: 'अंकगणित की आधारभूत प्रमेय एवं HCF-LCM संबंध',
          hinglish: 'Fundamental Theorem & HCF-LCM Product',
        },
        summary: {
          en: 'Every composite number can be expressed as a unique product of prime numbers, up to the order of factors. For any two positive integers a and b: HCF(a, b) × LCM(a, b) = a × b.',
          hi: 'प्रत्येक भाज्य संख्या को अभाज्य संख्याओं के एक अद्वितीय गुणनफल के रूप में व्यक्त किया जा सकता है। किन्हीं दो धनात्मक पूर्णांकों a तथा b के लिए: HCF(a, b) × LCM(a, b) = a × b।',
          hinglish: 'Har composite number primes ka product hota hai. HCF × LCM = a × b.',
        },
        formula: '\\text{HCF}(a, b) \\times \\text{LCM}(a, b) = a \\times b',
        keyPoints: [
          {
            en: 'The product formula HCF × LCM = a × b holds strictly for TWO numbers only, NOT for three or more numbers.',
            hi: 'HCF × LCM = a × b का नियम केवल दो संख्याओं के लिए सत्य है, तीन संख्याओं के लिए नहीं।',
            hinglish: 'HCF × LCM = a × b formula sirf 2 numbers ke liye valid hota hai.',
          },
          {
            en: 'To prove √p is irrational when p is prime, assume √p = a/b in co-prime form and demonstrate contradiction by showing p divides both a and b.',
            hi: 'अपरिमेयता सिद्ध करने के लिए विरोधाभास विधि (Contradiction Method) का प्रयोग किया जाता है।',
            hinglish: 'Contradiction method proves √2, √3, √5 are irrational numbers.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'If HCF(306, 657) = 9, what is the LCM(306, 657)?',
            hi: 'यदि HCF(306, 657) = 9 है, तो LCM(306, 657) क्या होगा?',
            hinglish: 'Agar HCF(306, 657) = 9 hai, toh LCM kitna hoga?',
          },
          options: [
            { en: '22,338', hi: '22,338', hinglish: '22,338' },
            { en: '20,118', hi: '20,118', hinglish: '20,118' },
            { en: '24,548', hi: '24,548', hinglish: '24,548' },
            { en: '18,924', hi: '18,924', hinglish: '18,924' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'LCM(a, b) = (a × b) / HCF(a, b) = (306 × 657) / 9 = 34 × 657 = 22,338.',
            hi: 'LCM = (a × b) / HCF = (306 × 657) / 9 = 34 × 657 = 22,338।',
            hinglish: 'LCM = (306 × 657) / 9 = 22,338.',
          }
        },
      },
    ],
  },

  // Chapter 2
  {
    id: 'c10_math_ch2_polynomials',
    subjectId: 'class10_math',
    chapterNo: 2,
    title: {
      en: 'Polynomials',
      hi: 'बहुपद',
      hinglish: 'Polynomials',
    },
    description: {
      en: 'Geometrical meaning of the zeroes of a polynomial, number of zeroes from graphs, and relationships between zeroes and coefficients of quadratic polynomials.',
      hi: 'बहुपद के शून्यकों का ज्यामितीय अर्थ, ग्राफ से शून्यकों की संख्या, तथा द्विघात बहुपद के शून्यकों और गुणांकों के मध्य संबंध।',
      hinglish: 'Zeroes of polynomial, graph intersections with x-axis, sum α+β = -b/a aur product αβ = c/a.',
    },
    targetMastery: 90,
    highYieldWeightage: 6,
    textbookRef: 'NCERT Mathematics Class 10 Chapter 2 / UPMSP Ganit Ch 2',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_polynomial_zeroes_coefficients',
        title: {
          en: 'Relations Between Zeroes & Coefficients of Quadratic Polynomials',
          hi: 'द्विघात बहुपद के शून्यकों और गुणांकों में संबंध',
          hinglish: 'Sum & Product of Quadratic Zeroes',
        },
        summary: {
          en: 'For a quadratic polynomial p(x) = ax² + bx + c with zeroes α and β: Sum of zeroes (α + β) = -b/a = -(coefficient of x) / (coefficient of x²), and Product of zeroes (αβ) = c/a = (constant term) / (coefficient of x²). The number of real zeroes equals the number of times y = p(x) intersects the x-axis.',
          hi: 'द्विघात बहुपद ax² + bx + c के शून्यक α व β हों, तो शून्यकों का योग α + β = -b/a तथा गुणनफल αβ = c/a होता है।',
          hinglish: 'Quadratic equation ke do zeroes α aur β: α+β = -b/a aur αβ = c/a.',
        },
        formula: '\\alpha + \\beta = -\\frac{b}{a}, \\quad \\alpha\\beta = \\frac{c}{a}, \\quad p(x) = k[x^2 - (\\alpha + \\beta)x + \\alpha\\beta]',
        keyPoints: [
          {
            en: 'The graph of a quadratic polynomial y = ax² + bx + c is a parabola; opens upward if a > 0 and downward if a < 0.',
            hi: 'द्विघात बहुपद का आलेख परवलय (Parabola) होता है; a > 0 होने पर ऊपर खुलता है।',
            hinglish: 'Parabola opens up if a > 0, down if a < 0.',
          },
          {
            en: 'If α and β are given zeroes, the quadratic polynomial is formed by x² - (sum)x + (product).',
            hi: 'शून्यक ज्ञात होने पर बहुपद = x² - (शून्यकों का योग)x + (शून्यकों का गुणनफल)।',
            hinglish: 'Polynomial formula: x² - (α+β)x + αβ.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Find a quadratic polynomial whose sum and product of zeroes are -3 and 2 respectively.',
            hi: 'वह द्विघात बहुपद ज्ञात कीजिए जिसके शून्यकों का योग -3 तथा गुणनफल 2 है।',
            hinglish: 'Wo quadratic polynomial nikalo jiske zeroes ka sum = -3 aur product = 2 hai.',
          },
          options: [
            { en: 'x² + 3x + 2', hi: 'x² + 3x + 2', hinglish: 'x² + 3x + 2' },
            { en: 'x² - 3x + 2', hi: 'x² - 3x + 2', hinglish: 'x² - 3x + 2' },
            { en: 'x² + 3x - 2', hi: 'x² + 3x - 2', hinglish: 'x² + 3x - 2' },
            { en: 'x² - 3x - 2', hi: 'x² - 3x - 2', hinglish: 'x² - 3x - 2' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Quadratic polynomial is p(x) = x² - (sum)x + product = x² - (-3)x + 2 = x² + 3x + 2.',
            hi: 'p(x) = x² - (α + β)x + αβ = x² - (-3)x + 2 = x² + 3x + 2।',
            hinglish: 'x² - (-3)x + 2 = x² + 3x + 2.',
          }
        },
      },
    ],
  },

  // Chapter 3
  {
    id: 'c10_math_ch3_linear_equations',
    subjectId: 'class10_math',
    chapterNo: 3,
    title: {
      en: 'Pair of Linear Equations in Two Variables',
      hi: 'दो चरों वाले रैखिक समीकरण युग्म',
      hinglish: 'Pair of Linear Equations',
    },
    description: {
      en: 'Graphical solution, conditions for consistency (intersecting, parallel, coincident lines), and algebraic solutions by substitution and elimination methods.',
      hi: 'ग्राफीय विधि, संगतता की शर्तें (प्रतिच्छेदी, समांतर एवं संपाती रेखाएं), तथा प्रतिस्थापन और विलोपन विधियाँ।',
      hinglish: 'Consistency conditions a₁/a₂ ≠ b₁/b₂, substitution and elimination methods.',
    },
    targetMastery: 90,
    highYieldWeightage: 7,
    textbookRef: 'NCERT Mathematics Class 10 Chapter 3 / UPMSP Ganit Ch 3',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_consistency_linear_systems',
        title: {
          en: 'Consistency Conditions & Algebraic Elimination Method',
          hi: 'संगतता की शर्तें एवं विलोपन विधि',
          hinglish: 'Consistency Criteria & Elimination Method',
        },
        summary: {
          en: 'For equations a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0: (1) a₁/a₂ ≠ b₁/b₂ gives a unique solution (intersecting lines, consistent); (2) a₁/a₂ = b₁/b₂ = c₁/c₂ gives infinitely many solutions (coincident lines, dependent consistent); (3) a₁/a₂ = b₁/b₂ ≠ c₁/c₂ gives no solution (parallel lines, inconsistent).',
          hi: 'a₁/a₂ ≠ b₁/b₂ होने पर अद्वितीय हल (संगत)। a₁/a₂ = b₁/b₂ = c₁/c₂ होने पर अनेक हल (संपाती रेखाएँ)। a₁/a₂ = b₁/b₂ ≠ c₁/c₂ होने पर कोई हल नहीं (समांतर रेखाएँ, असंगत)।',
          hinglish: 'Unique solution: a₁/a₂ ≠ b₁/b₂. No solution: a₁/a₂ = b₁/b₂ ≠ c₁/c₂. Infinite: all equal.',
        },
        formula: '\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2} \\implies 1\\text{ sol}, \\quad \\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2} \\implies 0\\text{ sol}, \\quad \\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2} \\implies \\infty\\text{ sol}',
        keyPoints: [
          {
            en: 'Parallel lines have no point of intersection; hence an inconsistent system has zero solutions.',
            hi: 'समांतर रेखाएँ कभी नहीं मिलतीं, इसलिए असंगत समीकरणों का कोई हल नहीं होता।',
            hinglish: 'Parallel lines mean system has no solution.',
          },
          {
            en: 'In the elimination method, multiply one or both equations by non-zero constants so coefficients of one variable match, then add or subtract.',
            hi: 'विलोपन विधि में किसी एक चर के गुणांक समान बनाकर समीकरणों को जोड़ा या घटाया जाता है।',
            hinglish: 'Match coefficients of x or y and cancel them.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'For what value of k will the lines 2x + 3y = 7 and 4x + ky = 12 be parallel (no solution)?',
            hi: 'k के किस मान के लिए रेखाएँ 2x + 3y = 7 और 4x + ky = 12 समांतर होंगी (कोई हल नहीं)?',
            hinglish: 'k ki kis value ke liye lines parallel (no solution) hongi?',
          },
          options: [
            { en: 'k = 6', hi: 'k = 6', hinglish: 'k = 6' },
            { en: 'k = 3', hi: 'k = 3', hinglish: 'k = 3' },
            { en: 'k = 8', hi: 'k = 8', hinglish: 'k = 8' },
            { en: 'k = -6', hi: 'k = -6', hinglish: 'k = -6' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'For parallel lines: a₁/a₂ = b₁/b₂ ≠ c₁/c₂. Here 2/4 = 3/k ⇒ 1/2 = 3/k ⇒ k = 6. Also 3/6 ≠ 7/12 holds true.',
            hi: 'समांतर होने के लिए: a₁/a₂ = b₁/b₂ ⇒ 2/4 = 3/k ⇒ 1/2 = 3/k ⇒ k = 6।',
            hinglish: '2/4 = 3/k ⇒ k = 6.',
          }
        },
      },
    ],
  },

  // Chapter 4
  {
    id: 'c10_math_ch4_quadratic_equations',
    subjectId: 'class10_math',
    chapterNo: 4,
    title: {
      en: 'Quadratic Equations',
      hi: 'द्विघात समीकरण',
      hinglish: 'Quadratic Equations',
    },
    description: {
      en: 'Standard form ax² + bx + c = 0 (a ≠ 0), solution by factorization, quadratic formula (Shreedharacharya rule), and discriminant nature of roots.',
      hi: 'मानक रूप ax² + bx + c = 0, गुणनखंड विधि, द्विघाती सूत्र (श्रीधराचार्य नियम), तथा विविक्तकर (Discriminant) द्वारा मूलों की प्रकृति।',
      hinglish: 'Quadratic formula x = (-b ± √D)/(2a), discriminant D = b² - 4ac and roots nature.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Mathematics Class 10 Chapter 4 / UPMSP Ganit Ch 4',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_discriminant_nature_roots',
        title: {
          en: 'Discriminant D & Nature of Roots of Quadratic Equations',
          hi: 'विविक्तकर D एवं द्विघात समीकरण के मूलों की प्रकृति',
          hinglish: 'Discriminant D = b² - 4ac & Roots Nature',
        },
        summary: {
          en: 'For ax² + bx + c = 0 (a ≠ 0), the discriminant is D = b² - 4ac. If D > 0: two distinct real roots. If D = 0: two equal real roots (-b/2a). If D < 0: no real roots (roots are complex/imaginary).',
          hi: 'विविक्तकर D = b² - 4ac होता है। यदि D > 0 तो दो भिन्न वास्तविक मूल। यदि D = 0 तो दो बराबर वास्तविक मूल (-b/2a)। यदि D < 0 तो कोई वास्तविक मूल नहीं।',
          hinglish: 'D > 0: two distinct real roots. D = 0: equal real roots. D < 0: no real roots.',
        },
        formula: 'D = b^2 - 4ac, \\quad x = \\frac{-b \\pm \\sqrt{D}}{2a}',
        keyPoints: [
          {
            en: 'If a problem states that the equation has equal real roots, set D = b² - 4ac = 0 to solve for unknown parameter.',
            hi: 'यदि प्रश्न में मूल बराबर दिए गए हों, तो सदैव D = b² - 4ac = 0 रखें।',
            hinglish: 'Equal roots condition is always D = 0.',
          },
          {
            en: 'Roots can also be found by splitting the middle term so two factors multiply to (a · c) and add to b.',
            hi: 'मध्य पद विभाजन विधि में दो संख्याओं का योग b और गुणनफल a·c होना चाहिए।',
            hinglish: 'Middle term split: sum = b, product = ac.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'For what value of k does the quadratic equation 2x² + kx + 3 = 0 have two equal real roots?',
            hi: 'k के किस मान के लिए समीकरण 2x² + kx + 3 = 0 के दो बराबर वास्तविक मूल होंगे?',
            hinglish: 'k ki kis value ke liye 2x² + kx + 3 = 0 ke equal real roots honge?',
          },
          options: [
            { en: 'k = ± 2√6', hi: 'k = ± 2√6', hinglish: 'k = ± 2√6' },
            { en: 'k = ± 6', hi: 'k = ± 6', hinglish: 'k = ± 6' },
            { en: 'k = ± 4', hi: 'k = ± 4', hinglish: 'k = ± 4' },
            { en: 'k = ± 12', hi: 'k = ± 12', hinglish: 'k = ± 12' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'For equal real roots, D = b² - 4ac = 0. Here a = 2, b = k, c = 3 ⇒ k² - 4(2)(3) = 0 ⇒ k² - 24 = 0 ⇒ k² = 24 ⇒ k = ± √24 = ± 2√6.',
            hi: 'बराबर मूलों के लिए D = k² - 4(2)(3) = 0 ⇒ k² = 24 ⇒ k = ± 2√6।',
            hinglish: 'k² = 4 × 2 × 3 = 24 ⇒ k = ± √24 = ± 2√6.',
          }
        },
      },
    ],
  },

  // Chapter 5
  {
    id: 'c10_math_ch5_arithmetic_progressions',
    subjectId: 'class10_math',
    chapterNo: 5,
    title: {
      en: 'Arithmetic Progressions (AP)',
      hi: 'समान्तर श्रेढ़ी',
      hinglish: 'Arithmetic Progressions (AP)',
    },
    description: {
      en: 'Definition of an AP, common difference d, nth general term an = a + (n-1)d, sum of first n terms Sn = n/2 [2a + (n-1)d], and real-life word problems.',
      hi: 'समान्तर श्रेढ़ी की परिभाषा, सार्व अंतर d, nवाँ पद an = a + (n-1)d, प्रथम n पदों का योग Sn, तथा व्यावहारिक प्रश्न।',
      hinglish: 'General term an = a + (n-1)d aur Sum formula Sn = n/2 (a + l).',
    },
    targetMastery: 90,
    highYieldWeightage: 7,
    textbookRef: 'NCERT Mathematics Class 10 Chapter 5 / UPMSP Ganit Ch 5',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_ap_nth_term_sum',
        title: {
          en: 'General nth Term & Sum of First n Terms of an AP',
          hi: 'समान्तर श्रेढ़ी का nवाँ पद एवं प्रथम n पदों का योग',
          hinglish: 'nth Term & Sum of First n Terms of AP',
        },
        summary: {
          en: 'An AP is a sequence where each term after the first is obtained by adding a constant common difference d. The nth term is an = a + (n-1)d. The sum of the first n terms is Sn = (n/2)[2a + (n-1)d] = (n/2)(a + l), where l is the last term.',
          hi: 'AP में प्रत्येक पद पिछले पद में सार्व अंतर d जोड़ने पर प्राप्त होता है। nवाँ पद an = a + (n-1)d तथा n पदों का योग Sn = (n/2)[2a + (n-1)d] होता है।',
          hinglish: 'AP ka nth term an = a + (n-1)d aur sum Sn = (n/2)[2a + (n-1)d].',
        },
        formula: 'a_n = a + (n-1)d, \\quad S_n = \\frac{n}{2}[2a + (n-1)d] = \\frac{n}{2}(a + l)',
        keyPoints: [
          {
            en: 'Common difference d can be positive, zero, or negative: d = a_{k+1} - a_k.',
            hi: 'सार्व अंतर d धनात्मक, ऋणात्मक अथवा शून्य हो सकता है।',
            hinglish: 'Common difference d can be +ve, -ve or 0.',
          },
          {
            en: 'The nth term can also be found directly from the sum formula: an = Sn - S_{n-1}.',
            hi: 'योगफल ज्ञात होने पर nवाँ पद: an = Sn - S_{n-1}।',
            hinglish: 'an = Sn - S_{n-1}.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'Find the 10th term of the AP: 2, 7, 12, 17, ...',
            hi: 'समान्तर श्रेढ़ी 2, 7, 12, 17, ... का 10वाँ पद ज्ञात कीजिए।',
            hinglish: 'AP 2, 7, 12, 17, ... ka 10th term kya hoga?',
          },
          options: [
            { en: '47', hi: '47', hinglish: '47' },
            { en: '52', hi: '52', hinglish: '52' },
            { en: '42', hi: '42', hinglish: '42' },
            { en: '57', hi: '57', hinglish: '57' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'First term a = 2, common difference d = 7 - 2 = 5. The 10th term is a₁₀ = a + (10-1)d = 2 + 9(5) = 2 + 45 = 47.',
            hi: 'a = 2, d = 5। 10वाँ पद = 2 + (10 - 1) × 5 = 2 + 45 = 47।',
            hinglish: 'a₁₀ = 2 + 9(5) = 47.',
          }
        },
      },
    ],
  },

  // Chapter 6
  {
    id: 'c10_math_ch6_triangles',
    subjectId: 'class10_math',
    chapterNo: 6,
    title: {
      en: 'Triangles & Similarity',
      hi: 'त्रिभुज एवं समरूपता',
      hinglish: 'Triangles & Similarity Criteria',
    },
    description: {
      en: 'Similar figures, Basic Proportionality Theorem (Thales’ Theorem) and its converse, and criteria for similarity of triangles (AAA, SSS, SAS).',
      hi: 'समरूप आकृतियाँ, आधारभूत आनुपातिकता प्रमेय (थेल्स प्रमेय) व विलोम, तथा त्रिभुजों की समरूपता की कसौटियाँ (AAA, SSS, SAS)।',
      hinglish: 'Basic Proportionality Theorem (BPT Thales), AAA, SSS, SAS similarity.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Mathematics Class 10 Chapter 6 / UPMSP Ganit Ch 6',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_basic_proportionality_theorem',
        title: {
          en: 'Basic Proportionality Theorem (Thales’ Theorem) & Similarity Criteria',
          hi: 'आधारभूत आनुपातिकता प्रमेय (थेल्स प्रमेय) एवं समरूपता की कसौटियाँ',
          hinglish: 'Basic Proportionality Theorem (BPT)',
        },
        summary: {
          en: 'If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio: AD/DB = AE/EC. Two triangles are similar if corresponding angles are equal and corresponding sides are in the same ratio.',
          hi: 'यदि किसी त्रिभुज की एक भुजा के समांतर अन्य दो भुजाओं को भिन्न बिंदुओं पर प्रतिच्छेद करने वाली रेखा खींची जाए, तो वे दोनों भुजाएं एक ही अनुपात में विभाजित होती हैं: AD/DB = AE/EC।',
          hinglish: 'Line parallel to one side divides other two sides in same ratio: AD/DB = AE/EC.',
        },
        formula: '\\text{In } \\Delta\\text{ABC, if } \\text{DE} \\parallel \\text{BC} \\implies \\frac{\\text{AD}}{\\text{DB}} = \\frac{\\text{AE}}{\\text{EC}} = \\frac{\\text{AD}}{\\text{AB}} = \\frac{\\text{AE}}{\\text{AC}}',
        keyPoints: [
          {
            en: 'The converse of BPT is also true: if a line divides any two sides of a triangle in the same ratio, it is parallel to the third side.',
            hi: 'थेल्स प्रमेय का विलोम: यदि कोई रेखा दो भुजाओं को समान अनुपात में विभाजित करे, तो वह तीसरी भुजा के समांतर होती है।',
            hinglish: 'Converse: If ratios equal, lines are parallel.',
          },
          {
            en: 'Similarity criteria: AAA (or AA), SSS, and SAS require corresponding sides in proportion, NOT necessarily equal (unlike congruence).',
            hi: 'समरूपता में भुजाओं का अनुपात समान होता है, भुजाओं की लंबाई बराबर होना आवश्यक नहीं है।',
            hinglish: 'In similar triangles, angles are equal and sides are proportional.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'In ΔABC, DE || BC. If AD = 1.5 cm, DB = 3 cm, and AE = 1 cm, what is the length of EC?',
            hi: 'ΔABC में DE || BC है। यदि AD = 1.5 सेमी, DB = 3 सेमी और AE = 1 सेमी है, तो EC की लंबाई क्या होगी?',
            hinglish: 'ΔABC me DE || BC hai. Agar AD = 1.5, DB = 3, AE = 1 ho toh EC kitna hoga?',
          },
          options: [
            { en: '2.0 cm', hi: '2.0 सेमी', hinglish: '2.0 cm' },
            { en: '1.5 cm', hi: '1.5 सेमी', hinglish: '1.5 cm' },
            { en: '2.5 cm', hi: '2.5 सेमी', hinglish: '2.5 cm' },
            { en: '3.0 cm', hi: '3.0 सेमी', hinglish: '3.0 cm' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'By Thales’ Theorem (BPT): AD / DB = AE / EC ⇒ 1.5 / 3 = 1 / EC ⇒ 1 / 2 = 1 / EC ⇒ EC = 2 cm.',
            hi: 'थेल्स प्रमेय से: AD/DB = AE/EC ⇒ 1.5/3 = 1/EC ⇒ 1/2 = 1/EC ⇒ EC = 2 सेमी।',
            hinglish: '1.5 / 3 = 1 / EC ⇒ EC = 2 cm.',
          }
        },
      },
    ],
  },

  // Chapter 7
  {
    id: 'c10_math_ch7_coordinate_geometry',
    subjectId: 'class10_math',
    chapterNo: 7,
    title: {
      en: 'Coordinate Geometry',
      hi: 'निर्देशांक ज्यामिति',
      hinglish: 'Coordinate Geometry',
    },
    description: {
      en: 'Distance formula between two points, distance from origin, section formula for internal division in ratio m1:m2, and midpoint formula.',
      hi: 'दो बिंदुओं के बीच दूरी सूत्र, मूल बिंदु से दूरी, आंतरिक विभाजन हेतु विभाजन सूत्र (अनुपात m1:m2), तथा मध्य-बिंदु सूत्र।',
      hinglish: 'Distance formula d = √[(x₂-x₁)² + (y₂-y₁)²], section formula and midpoint.',
    },
    targetMastery: 90,
    highYieldWeightage: 6,
    textbookRef: 'NCERT Mathematics Class 10 Chapter 7 / UPMSP Ganit Ch 7',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_distance_section_formula',
        title: {
          en: 'Distance Formula & Section Formula in Cartesian Plane',
          hi: 'दूरी सूत्र एवं विभाजन सूत्र',
          hinglish: 'Distance & Section Formulas',
        },
        summary: {
          en: 'The distance between points P(x₁, y₁) and Q(x₂, y₂) is d = √[(x₂ - x₁)² + (y₂ - y₁)²]. The coordinates of point P dividing the line segment joining A(x₁, y₁) and B(x₂, y₂) in ratio m₁ : m₂ internally are: x = (m₁x₂ + m₂x₁) / (m₁ + m₂), y = (m₁y₂ + m₂y₁) / (m₁ + m₂). Midpoint coordinates are ((x₁+x₂)/2, (y₁+y₂)/2).',
          hi: 'दो बिंदुओं के बीच दूरी d = √[(x₂ - x₁)² + (y₂ - y₁)²]। रेखाखंड को m₁:m₂ में विभाजित करने वाले बिंदु के निर्देशांक: x = (m₁x₂ + m₂x₁)/(m₁+m₂), y = (m₁y₂ + m₂y₁)/(m₁+m₂)। मध्य बिंदु = ((x₁+x₂)/2, (y₁+y₂)/2)।',
          hinglish: 'Distance d = √[(x₂-x₁)² + (y₂-y₁)²]. Section formula divides segment in m₁:m₂.',
        },
        formula: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}, \\quad P(x, y) = \\left( \\frac{m_1 x_2 + m_2 x_1}{m_1 + m_2}, \\frac{m_1 y_2 + m_2 y_1}{m_1 + m_2} \\right)',
        keyPoints: [
          {
            en: 'The distance of any point P(x, y) from the origin (0, 0) simplifies directly to √(x² + y²).',
            hi: 'मूल बिंदु (0, 0) से बिंदु (x, y) की दूरी √(x² + y²) होती है।',
            hinglish: 'Distance from origin = √(x² + y²).',
          },
          {
            en: 'To find the ratio in which a point divides a segment, assume ratio k : 1 for faster linear calculation.',
            hi: 'विभाजन अनुपात ज्ञात करने के लिए अनुपात सदैव k : 1 मानना चाहिए।',
            hinglish: 'Assume ratio as k:1 for quick solving.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'What are the coordinates of the midpoint of the line segment joining points A(4, -2) and B(8, 6)?',
            hi: 'बिंदुओं A(4, -2) और B(8, 6) को मिलाने वाले रेखाखंड के मध्य-बिंदु के निर्देशांक क्या हैं?',
            hinglish: 'Points A(4, -2) aur B(8, 6) ke midpoint ke coordinates kya honge?',
          },
          options: [
            { en: '(6, 2)', hi: '(6, 2)', hinglish: '(6, 2)' },
            { en: '(6, 4)', hi: '(6, 4)', hinglish: '(6, 4)' },
            { en: '(12, 4)', hi: '(12, 4)', hinglish: '(12, 4)' },
            { en: '(2, 4)', hi: '(2, 4)', hinglish: '(2, 4)' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Midpoint x = (x₁ + x₂) / 2 = (4 + 8) / 2 = 6. Midpoint y = (y₁ + y₂) / 2 = (-2 + 6) / 2 = 4 / 2 = 2. Midpoint = (6, 2).',
            hi: 'x = (4 + 8)/2 = 6, y = (-2 + 6)/2 = 2। मध्य-बिंदु = (6, 2)।',
            hinglish: 'x = (4+8)/2 = 6, y = (-2+6)/2 = 2 → (6, 2).',
          }
        },
      },
    ],
  },

  // Chapter 8
  {
    id: 'c10_math_ch8_trigonometry',
    subjectId: 'class10_math',
    chapterNo: 8,
    title: {
      en: 'Introduction to Trigonometry',
      hi: 'त्रिकोणमिति का परिचय',
      hinglish: 'Introduction to Trigonometry',
    },
    description: {
      en: 'Trigonometric ratios of acute angles in a right triangle (sin, cos, tan, cosec, sec, cot), values of ratios at standard angles 0°, 30°, 45°, 60°, 90°, and fundamental trigonometric identities.',
      hi: 'समकोण त्रिभुज में त्रिकोणमितीय अनुपात (sin, cos, tan, cosec, sec, cot), मानक कोणों (0°, 30°, 45°, 60°, 90°) पर मान, तथा मूलभूत सर्वसमिकाएं।',
      hinglish: 'Trigonometric ratios, values at 0°, 30°, 45°, 60°, 90°, and identity sin²θ + cos²θ = 1.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Mathematics Class 10 Chapter 8 / UPMSP Ganit Ch 8',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_trig_identities_ratios',
        title: {
          en: 'Trigonometric Ratios & Pythagorean Identities',
          hi: 'त्रिकोणमितीय अनुपात एवं पाइथागोरियन सर्वसमिकाएं',
          hinglish: 'Trigonometric Ratios & Fundamental Identities',
        },
        summary: {
          en: 'In a right-angled triangle: sin θ = Opp/Hyp, cos θ = Adj/Hyp, tan θ = Opp/Adj. The three fundamental identities are: (1) sin² θ + cos² θ = 1, (2) 1 + tan² θ = sec² θ (for 0° ≤ θ < 90°), (3) 1 + cot² θ = cosec² θ (for 0° < θ ≤ 90°).',
          hi: 'समकोण त्रिभुज में sin θ = लंब/कर्ण, cos θ = आधार/कर्ण, tan θ = लंब/आधार। सर्वसमिकाएं: (1) sin² θ + cos² θ = 1, (2) 1 + tan² θ = sec² θ, (3) 1 + cot² θ = cosec² θ।',
          hinglish: 'sin²θ + cos²θ = 1, sec²θ - tan²θ = 1, cosec²θ - cot²θ = 1.',
        },
        formula: '\\sin^2 \\theta + \\cos^2 \\theta = 1, \\quad 1 + \\tan^2 \\theta = \\sec^2 \\theta, \\quad 1 + \\cot^2 \\theta = \\text{cosec}^2 \\theta',
        keyPoints: [
          {
            en: 'Values of sin θ and cos θ never exceed 1 because the hypotenuse is the longest side of a right triangle.',
            hi: 'कर्ण सबसे लंबी भुजा होने के कारण sin θ और cos θ का मान कभी 1 से अधिक नहीं हो सकता।',
            hinglish: 'Hypotenuse is longest side, so sin θ and cos θ cannot be > 1.',
          },
          {
            en: 'sec² θ - tan² θ = (sec θ + tan θ)(sec θ - tan θ) = 1, meaning (sec θ + tan θ) and (sec θ - tan θ) are mutual reciprocals.',
            hi: 'sec θ + tan θ और sec θ - tan θ एक-दूसरे के व्युत्क्रम होते हैं।',
            hinglish: 'sec θ + tan θ = 1 / (sec θ - tan θ).',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'If sec θ + tan θ = 4, what is the value of sec θ - tan θ?',
            hi: 'यदि sec θ + tan θ = 4 है, तो sec θ - tan θ का मान क्या होगा?',
            hinglish: 'Agar sec θ + tan θ = 4 hai, toh sec θ - tan θ kitna hoga?',
          },
          options: [
            { en: '1/4 (0.25)', hi: '1/4 (0.25)', hinglish: '1/4 (0.25)' },
            { en: '4', hi: '4', hinglish: '4' },
            { en: '-4', hi: '-4', hinglish: '-4' },
            { en: '1/16', hi: '1/16', hinglish: '1/16' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Since sec² θ - tan² θ = 1, we have (sec θ + tan θ)(sec θ - tan θ) = 1. Therefore, sec θ - tan θ = 1 / (sec θ + tan θ) = 1/4.',
            hi: '(sec θ + tan θ)(sec θ - tan θ) = 1 होने से sec θ - tan θ = 1/4 = 0.25।',
            hinglish: 'sec θ - tan θ = 1 / 4.',
          }
        },
      },
    ],
  },

  // Chapter 9
  {
    id: 'c10_math_ch9_applications_trigonometry',
    subjectId: 'class10_math',
    chapterNo: 9,
    title: {
      en: 'Some Applications of Trigonometry',
      hi: 'त्रिकोणमिति के कुछ अनुप्रयोग (ऊँचाई एवं दूरी)',
      hinglish: 'Heights & Distances',
    },
    description: {
      en: 'Line of sight, angle of elevation, angle of depression, and solving practical real-life height and distance problems involving right triangles with angles 30°, 45°, and 60°.',
      hi: 'दृष्टि रेखा, उन्नयन कोण, अवनमन कोण, तथा 30°, 45°, 60° कोणों वाले समकोण त्रिभुजों पर आधारित ऊँचाई और दूरी के व्यावहारिक प्रश्न।',
      hinglish: 'Line of sight, angle of elevation & depression, tan θ = Height/Distance.',
    },
    targetMastery: 90,
    highYieldWeightage: 6,
    textbookRef: 'NCERT Mathematics Class 10 Chapter 9 / UPMSP Ganit Ch 9',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_elevation_depression',
        title: {
          en: 'Angles of Elevation & Depression in Height & Distance Problems',
          hi: 'उन्नयन एवं अवनमन कोण तथा ऊँचाई-दूरी गणना',
          hinglish: 'Elevation & Depression Angles in Heights & Distances',
        },
        summary: {
          en: 'Angle of elevation is formed between the horizontal line and line of sight when looking upward at an object. Angle of depression is formed when looking downward. By alternate interior angles, the angle of depression from the observer equals the angle of elevation of the observer from the object.',
          hi: 'ऊपर देखने पर दृष्टि रेखा और क्षैतिज के बीच उन्नयन कोण बनता है; नीचे देखने पर अवनमन कोण बनता है। एकांतर अंतःकोण होने के कारण अवनमन कोण = उन्नयन कोण होता है।',
          hinglish: 'Looking up = elevation. Looking down = depression. Both angles are equal by alternate interior angles.',
        },
        formula: '\\tan\\theta = \\frac{\\text{Height } (h)}{\\text{Distance } (d)} \\implies h = d \\tan\\theta',
        keyPoints: [
          {
            en: 'When the angle of elevation of the sun is 45°, the height of a vertical pole equals the length of its shadow (since tan 45° = 1).',
            hi: 'जब सूर्य का उन्नयन कोण 45° होता है, तो खंभे की ऊँचाई उसकी छाया की लंबाई के बराबर होती है।',
            hinglish: 'At 45°, height = shadow length.',
          },
          {
            en: 'In multi-triangle problems, always set up equations using common shared vertical or horizontal sides.',
            hi: 'दो त्रिभुज वाले प्रश्नों में उभयनिष्ठ भुजा को आधार बनाकर दोनों समीकरण हल करें।',
            hinglish: 'Use common side to link two trigonometric equations.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'A tower stands vertically on the ground. From a point on the ground 15 m away from the foot of the tower, the angle of elevation of its top is 60°. What is the height of the tower?',
            hi: 'भूमि पर एक मीनार खड़ी है। मीनार के पाद-बिंदु से 15 मीटर दूर भूमि के एक बिंदु से मीनार के शिखर का उन्नयन कोण 60° है। मीनार की ऊँचाई ज्ञात कीजिए।',
            hinglish: 'Ground se 15m doori se tower ke top ka elevation angle 60° hai. Tower ki height kya hai?',
          },
          options: [
            { en: '15√3 meters', hi: '15√3 मीटर', hinglish: '15√3 meters' },
            { en: '15 / √3 (5√3) meters', hi: '5√3 मीटर', hinglish: '5√3 meters' },
            { en: '30 meters', hi: '30 मीटर', hinglish: '30 meters' },
            { en: '15 meters', hi: '15 मीटर', hinglish: '15 meters' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'In right Δ, tan 60° = Height / Base ⇒ √3 = h / 15 ⇒ h = 15√3 m.',
            hi: 'tan 60° = ऊँचाई / आधार ⇒ √3 = h / 15 ⇒ h = 15√3 मीटर।',
            hinglish: 'tan 60° = h / 15 ⇒ √3 = h / 15 ⇒ h = 15√3 meters.',
          }
        },
      },
    ],
  },

  // Chapter 10
  {
    id: 'c10_math_ch10_circles',
    subjectId: 'class10_math',
    chapterNo: 10,
    title: {
      en: 'Circles & Tangents',
      hi: 'वृत्त एवं स्पर्श रेखाएँ',
      hinglish: 'Circles & Tangents',
    },
    description: {
      en: 'Tangent to a circle at any point is perpendicular to the radius through point of contact (Theorem 10.1), and lengths of tangents drawn from an external point to a circle are equal (Theorem 10.2).',
      hi: 'स्पर्श रेखा स्पर्श बिंदु से जाने वाली त्रिज्या पर लंब होती है (प्रमेय 10.1), तथा बाह्य बिंदु से वृत्त पर खींची गई स्पर्श रेखाओं की लंबाइयां बराबर होती हैं (प्रमेय 10.2)।',
      hinglish: 'Tangents to circle: radius ⊥ tangent and equal lengths from external point.',
    },
    targetMastery: 90,
    highYieldWeightage: 7,
    textbookRef: 'NCERT Mathematics Class 10 Chapter 10 / UPMSP Ganit Ch 10',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_circle_tangents_theorems',
        title: {
          en: 'Tangents from an External Point & Radius Perpendicularity',
          hi: 'बाह्य बिंदु से स्पर्श रेखाएँ एवं त्रिज्या लंबवत प्रमेय',
          hinglish: 'Tangents from External Point & Radius Perpendicularity',
        },
        summary: {
          en: 'Theorem 1: The tangent at any point of a circle is perpendicular to the radius through the point of contact (OT ⊥ PT). Theorem 2: The lengths of the two tangents drawn from an external point to a circle are equal (PA = PB). The center of the circle lies on the angle bisector of the two tangents.',
          hi: 'प्रमेय 1: वृत्त के किसी बिंदु पर स्पर्श रेखा स्पर्श बिंदु से जाने वाली त्रिज्या पर लंब होती है। प्रमेय 2: बाह्य बिंदु से वृत्त पर खींची गई दो स्पर्श रेखाओं की लंबाइयां समान होती हैं (PA = PB)।',
          hinglish: 'Theorem 1: Radius ⊥ Tangent. Theorem 2: Tangents from external point are equal (PA = PB).',
        },
        formula: '\\text{PA} = \\text{PB}, \\quad \\angle\\text{OPT} = 90^\\circ, \\quad \\angle\\text{APB} + \\angle\\text{AOB} = 180^\\circ',
        keyPoints: [
          {
            en: 'The angle between the two tangents from an external point and the angle subtended by the line segments joining points of contact to the center are supplementary (sum = 180°).',
            hi: 'स्पर्श रेखाओं के बीच का कोण और केंद्र पर अंतरित कोण संपूरक (योग 180°) होते हैं।',
            hinglish: 'Angle between tangents + angle at center = 180° (supplementary).',
          },
          {
            en: 'From an external point, exactly two tangents can be drawn to a circle.',
            hi: 'वृत्त के बाहर स्थित किसी बिंदु से वृत्त पर केवल दो स्पर्श रेखाएं खींची जा सकती हैं।',
            hinglish: 'Only 2 tangents can be drawn from an exterior point.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'If tangents PA and PB from a point P to a circle with center O are inclined to each other at an angle of 80°, then what is ∠POA?',
            hi: 'यदि बिंदु P से केंद्र O वाले वृत्त पर खींची गई स्पर्श रेखाएं PA और PB परस्पर 80° के कोण पर झुकी हैं, तो ∠POA का मान क्या होगा?',
            hinglish: 'PA aur PB tangents ke beech ka angle 80° hai, toh ∠POA kitna hoga?',
          },
          options: [
            { en: '50°', hi: '50°', hinglish: '50°' },
            { en: '60°', hi: '60°', hinglish: '60°' },
            { en: '70°', hi: '70°', hinglish: '70°' },
            { en: '80°', hi: '80°', hinglish: '80°' },
          ],
          correctIndex: 0,
          explanation: {
            en: '∠AOB + ∠APB = 180° ⇒ ∠AOB = 180° - 80° = 100°. In congruent ΔPAO and ΔPBO, OP bisects ∠AOB, so ∠POA = 100° / 2 = 50°.',
            hi: '∠AOB = 180° - 80° = 100°। OP कोण को समद्विभाजित करता है, अतः ∠POA = 100° / 2 = 50°।',
            hinglish: '∠AOB = 100° → ∠POA = 100° / 2 = 50°.',
          }
        },
      },
    ],
  },

  // Chapter 11
  {
    id: 'c10_math_ch11_areas_circles',
    subjectId: 'class10_math',
    chapterNo: 11,
    title: {
      en: 'Areas Related to Circles',
      hi: 'वृत्तों से संबंधित क्षेत्रफल',
      hinglish: 'Areas Related to Circles',
    },
    description: {
      en: 'Area of sector of a circle, length of an arc of a sector, area of segment of a circle (minor and major), and combinations of plane figures.',
      hi: 'वृत्त के त्रिज्यखंड का क्षेत्रफल, त्रिज्यखंड के चाप की लंबाई, वृत्तखंड का क्षेत्रफल (लघु एवं दीर्घ), तथा समतल आकृतियों के संयोजनों के क्षेत्रफल।',
      hinglish: 'Sector area (θ/360)πr², arc length (θ/360)2πr, segment area.',
    },
    targetMastery: 90,
    highYieldWeightage: 6,
    textbookRef: 'NCERT Mathematics Class 10 Chapter 11 / UPMSP Ganit Ch 12',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_sector_segment_area',
        title: {
          en: 'Area of Sector & Segment of a Circle',
          hi: 'त्रिज्यखंड एवं वृत्तखंड का क्षेत्रफल',
          hinglish: 'Sector & Segment Area Formulas',
        },
        summary: {
          en: 'For a circle of radius r and sector angle θ (in degrees): Length of arc l = (θ / 360) × 2πr. Area of sector = (θ / 360) × πr² = ½ l r. Area of minor segment = Area of sector - Area of corresponding triangle = (θ / 360)πr² - ½ r² sin θ.',
          hi: 'त्रिज्या r और कोण θ वाले त्रिज्यखंड के चाप की लंबाई = (θ/360) × 2πr। त्रिज्यखंड का क्षेत्रफल = (θ/360) × πr²। वृत्तखंड का क्षेत्रफल = त्रिज्यखंड का क्षेत्रफल - त्रिभुज का क्षेत्रफल = (θ/360)πr² - ½ r² sin θ।',
          hinglish: 'Arc length = (θ/360)2πr. Sector area = (θ/360)πr². Segment area = Sector - Triangle.',
        },
        formula: '\\text{Area of Sector} = \\frac{\\theta}{360^\\circ} \\pi r^2, \\quad l = \\frac{\\theta}{360^\\circ} 2\\pi r, \\quad \\text{Segment Area} = \\frac{\\theta}{360^\\circ}\\pi r^2 - \\frac{1}{2}r^2 \\sin\\theta',
        keyPoints: [
          {
            en: 'Area of major sector = Total circle area (πr²) - Area of minor sector.',
            hi: 'दीर्घ त्रिज्यखंड का क्षेत्रफल = पूरे वृत्त का क्षेत्रफल (πr²) - लघु त्रिज्यखंड का क्षेत्रफल।',
            hinglish: 'Major sector area = πr² - Minor sector area.',
          },
          {
            en: 'A clock minute hand rotates through 360° in 60 minutes, so it covers (360/60) = 6° per minute.',
            hi: 'घड़ी की मिनट वाली सुई 1 मिनट में 6° का कोण बनाती है।',
            hinglish: 'Minute hand covers 6° per minute (30° in 5 minutes).',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Find the area of a sector of a circle with radius 6 cm if angle of the sector is 60° (use π = 22/7).',
            hi: '6 सेमी त्रिज्या वाले वृत्त के एक त्रिज्यखंड का क्षेत्रफल ज्ञात कीजिए जिसका कोण 60° है (π = 22/7 लें)।',
            hinglish: 'Radius 6 cm aur angle 60° wale sector ka area kitna hoga?',
          },
          options: [
            { en: '132 / 7 cm² (18.86 cm²)', hi: '132 / 7 सेमी²', hinglish: '132 / 7 cm²' },
            { en: '66 / 7 cm²', hi: '66 / 7 सेमी²', hinglish: '66 / 7 cm²' },
            { en: '154 / 7 cm²', hi: '154 / 7 सेमी²', hinglish: '154 / 7 cm²' },
            { en: '44 / 7 cm²', hi: '44 / 7 सेमी²', hinglish: '44 / 7 cm²' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Sector Area = (θ / 360) × πr² = (60 / 360) × (22 / 7) × 6 × 6 = (1 / 6) × (22 / 7) × 36 = 22 × 6 / 7 = 132 / 7 cm².',
            hi: 'क्षेत्रफल = (60/360) × (22/7) × 6² = (1/6) × (22/7) × 36 = 132/7 सेमी²।',
            hinglish: '(60/360) × (22/7) × 36 = 132/7 cm².',
          }
        },
      },
    ],
  },

  // Chapter 12
  {
    id: 'c10_math_ch12_surface_areas_volumes',
    subjectId: 'class10_math',
    chapterNo: 12,
    title: {
      en: 'Surface Areas and Volumes',
      hi: 'पृष्ठीय क्षेत्रफल और आयतन',
      hinglish: 'Surface Areas and Volumes',
    },
    description: {
      en: 'Surface area of combinations of solids (cubes, cuboids, spheres, hemispheres, right circular cylinders, cones) and volume of combinations of solids.',
      hi: 'ठोसों के संयोजनों का पृष्ठीय क्षेत्रफल (घन, घनाभ, गोला, अर्धगोला, लंबवृत्तीय बेलन, शंकु) तथा ठोसों के संयोजनों का आयतन।',
      hinglish: 'Surface areas and volumes of combined solid shapes.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Mathematics Class 10 Chapter 12 / UPMSP Ganit Ch 13',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_solids_combinations',
        title: {
          en: 'Surface Areas & Volumes of Combinations of Solids',
          hi: 'ठोसों के संयोजनों का पृष्ठीय क्षेत्रफल एवं आयतन',
          hinglish: 'Combined Solids Surface Area & Volume',
        },
        summary: {
          en: 'When two solids are joined (e.g., a cone mounted on a hemisphere to form a toy), the total surface area equals the sum of the curved surface areas of the individual components visible on the exterior: TSA = CSA(cone) + CSA(hemisphere) = πrl + 2πr². The total volume equals the sum of individual volumes: V = ⅓πr²h + ⅔πr³.',
          hi: 'जब दो ठोस जोड़े जाते हैं (जैसे अर्धगोले पर शंकु), तो कुल पृष्ठीय क्षेत्रफल = शंकु का वक्र पृष्ठ + अर्धगोले का वक्र पृष्ठ = πrl + 2πr²। कुल आयतन = ⅓πr²h + ⅔πr³।',
          hinglish: 'Combined TSA = sum of visible curved surface areas. Combined volume = sum of volumes.',
        },
        formula: '\\text{Cone: } l = \\sqrt{r^2 + h^2}, \\quad \\text{CSA} = \\pi r l, \\quad \\text{Hemisphere CSA} = 2\\pi r^2, \\quad V = \\frac{1}{3}\\pi r^2 h + \\frac{2}{3}\\pi r^3',
        keyPoints: [
          {
            en: 'Never simply add the total surface areas of the individual solids because the joining interface bases are hidden inside.',
            hi: 'जोड़ते समय कुल पृष्ठीय क्षेत्रफलों को सीधे न जोड़ें क्योंकि संपर्क तल अंदर छिप जाता है।',
            hinglish: 'Joined base is hidden inside, so only add external CSAs.',
          },
          {
            en: 'When reshaping one solid into another (e.g., melting spheres into a wire cylinder), the total volume remains strictly conserved.',
            hi: 'एक ठोस को पिघलाकर दूसरा ठोस बनाने पर आयतन सदैव अपरिवर्तित रहता है।',
            hinglish: 'Melting and recasting conserves total volume.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'A solid toy is in the form of a hemisphere surmounted by a cone, both of common radius 3.5 cm. If the height of the cone is 12 cm, what is the slant height l of the cone?',
            hi: 'एक खिलौना अर्धगोले पर अध्यारोपित शंकु के आकार का है जिनकी उभयनिष्ठ त्रिज्या 3.5 सेमी है। यदि शंकु की ऊँचाई 12 सेमी है, तो शंकु की तिर्यक ऊँचाई l क्या होगी?',
            hinglish: 'Common radius r = 3.5 cm aur cone height h = 12 cm. Cone ki slant height l kitni hogi?',
          },
          options: [
            { en: '12.5 cm', hi: '12.5 सेमी', hinglish: '12.5 cm' },
            { en: '15.5 cm', hi: '15.5 सेमी', hinglish: '15.5 cm' },
            { en: '13.0 cm', hi: '13.0 सेमी', hinglish: '13.0 cm' },
            { en: '14.5 cm', hi: '14.5 सेमी', hinglish: '14.5 cm' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Slant height l = √(r² + h²) = √(3.5² + 12²) = √(12.25 + 144) = √156.25 = 12.5 cm.',
            hi: 'तिर्यक ऊँचाई l = √(r² + h²) = √(3.5² + 12²) = √156.25 = 12.5 सेमी।',
            hinglish: 'l = √(12.25 + 144) = √156.25 = 12.5 cm.',
          }
        },
      },
    ],
  },

  // Chapter 13
  {
    id: 'c10_math_ch13_statistics',
    subjectId: 'class10_math',
    chapterNo: 13,
    title: {
      en: 'Statistics',
      hi: 'सांख्यिकी',
      hinglish: 'Statistics',
    },
    description: {
      en: 'Mean of grouped data (Direct method & Assumed Mean method), Mode of grouped data, Median of grouped data, and empirical relationship between the three central tendencies.',
      hi: 'वर्गीकृत आंकड़ों का माध्य (प्रत्यक्ष एवं कल्पित माध्य विधि), बहुलक, माध्यक (माध्यिका), तथा तीनों केंद्रीय प्रवृत्तियों के मध्य आनुभविक संबंध।',
      hinglish: 'Mean, Mode, Median of grouped data, and Mode = 3 Median - 2 Mean.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Mathematics Class 10 Chapter 13 / UPMSP Ganit Ch 14',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_mean_mode_median_empirical',
        title: {
          en: 'Central Tendencies: Mode, Median, Mean & Empirical Relationship',
          hi: 'केंद्रीय प्रवृत्तियों के माप: बहुलक, माध्यक, माध्य एवं आनुभविक संबंध',
          hinglish: 'Central Tendencies & Empirical Relation',
        },
        summary: {
          en: 'Direct Mean: x̄ = Σ(fᵢxᵢ) / Σfᵢ. Assumed Mean: x̄ = a + Σ(fᵢdᵢ) / Σfᵢ. Mode of grouped data = l + [(f₁ - f₀) / (2f₁ - f₀ - f₂)] × h. Median = l + [((n/2) - cf) / f] × h. The empirical relation is: Mode = 3 × Median - 2 × Mean.',
          hi: 'माध्य x̄ = Σ(fᵢxᵢ)/Σfᵢ। बहुलक = l + [(f₁ - f₀)/(2f₁ - f₀ - f₂)] × h। माध्यक = l + [(n/2 - cf)/f] × h। आनुभविक संबंध: बहुलक = 3 × माध्यक - 2 × माध्य।',
          hinglish: 'Empirical formula: Mode = 3 Median - 2 Mean.',
        },
        formula: '\\text{Mode} = 3\\,\\text{Median} - 2\\,\\text{Mean}, \\quad \\text{Mode} = l + \\left( \\frac{f_1 - f_0}{2f_1 - f_0 - f_2} \\right) h',
        keyPoints: [
          {
            en: 'In the mode formula, f₁ is the frequency of the modal class, f₀ is the preceding frequency, and f₂ is the succeeding frequency.',
            hi: 'बहुलक सूत्र में f₁ बहुलक वर्ग की बारंबारता, f₀ पूर्व वर्ग की तथा f₂ अगले वर्ग की बारंबारता है।',
            hinglish: 'f₁ = modal class freq, f₀ = preceding, f₂ = succeeding.',
          },
          {
            en: 'The empirical relation connects the three central measures: Mode = 3 Median - 2 Mean.',
            hi: 'आनुभविक संबंध: बहुलक = 3 माध्यक - 2 माध्य।',
            hinglish: 'Remember: 3 Median = Mode + 2 Mean.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'If the median of a frequency distribution is 26 and its mean is 24, what is the mode of the distribution?',
            hi: 'यदि किसी बारंबारता बंटन का माध्यक 26 और उसका माध्य 24 है, तो बंटन का बहुलक क्या होगा?',
            hinglish: 'Agar median = 26 aur mean = 24 ho, toh mode kitna hoga?',
          },
          options: [
            { en: '30', hi: '30', hinglish: '30' },
            { en: '28', hi: '28', hinglish: '28' },
            { en: '25', hi: '25', hinglish: '25' },
            { en: '32', hi: '32', hinglish: '32' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Mode = 3 × Median - 2 × Mean = 3(26) - 2(24) = 78 - 48 = 30.',
            hi: 'बहुलक = 3 × 26 - 2 × 24 = 78 - 48 = 30।',
            hinglish: 'Mode = 3(26) - 2(24) = 78 - 48 = 30.',
          }
        },
      },
    ],
  },

  // Chapter 14
  {
    id: 'c10_math_ch14_probability',
    subjectId: 'class10_math',
    chapterNo: 14,
    title: {
      en: 'Probability',
      hi: 'प्रायिकता',
      hinglish: 'Probability',
    },
    description: {
      en: 'Classical theoretical definition of probability P(E), elementary events, impossible and sure events, complementary events P(Ē) = 1 - P(E), and range of probability 0 ≤ P(E) ≤ 1.',
      hi: 'प्रायिकता की सैद्धांतिक परिभाषा P(E), प्रारंभिक घटनाएं, असंभव व निश्चित घटनाएं, पूरक घटना P(Ē) = 1 - P(E), तथा प्रायिकता का परिसर 0 ≤ P(E) ≤ 1।',
      hinglish: 'Theoretical probability P(E) = favorable/total, range 0 ≤ P(E) ≤ 1, complementary events.',
    },
    targetMastery: 90,
    highYieldWeightage: 5,
    textbookRef: 'NCERT Mathematics Class 10 Chapter 14 / UPMSP Ganit Ch 15',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_classical_probability',
        title: {
          en: 'Classical Probability & Complementary Events',
          hi: 'सैद्धांतिक प्रायिकता एवं पूरक घटनाएं',
          hinglish: 'Classical Probability & Complementary Events',
        },
        summary: {
          en: 'Theoretical probability of an event E is P(E) = (Number of favorable outcomes) / (Total number of all possible outcomes). Probability of an impossible event is 0; probability of a sure (certain) event is 1. The probability always satisfies 0 ≤ P(E) ≤ 1. For any event E and its complement Ē: P(E) + P(Ē) = 1.',
          hi: 'घटना E की प्रायिकता P(E) = (अनुकूल परिणामों की संख्या) / (कुल संभावित परिणाम)। असंभव घटना की प्रायिकता 0 तथा निश्चित घटना की 1 होती है। 0 ≤ P(E) ≤ 1 तथा P(E) + P(Ē) = 1।',
          hinglish: 'P(E) = favorable outcomes / total outcomes. 0 ≤ P(E) ≤ 1. P(not E) = 1 - P(E).',
        },
        formula: 'P(E) = \\frac{n(E)}{n(S)}, \\quad 0 \\le P(E) \\le 1, \\quad P(E) + P(\\bar{E}) = 1',
        keyPoints: [
          {
            en: 'Probability can never be negative and cannot exceed 1 (or 100%).',
            hi: 'प्रायिकता कभी भी ऋणात्मक नहीं हो सकती और न ही 1 (या 100%) से अधिक हो सकती है।',
            hinglish: 'Probability is never negative and never > 1.',
          },
          {
            en: 'A standard deck has 52 playing cards: 26 red, 26 black, 4 suits (13 cards each), and 12 face cards (Jacks, Queens, Kings).',
            hi: 'ताश की गड्डी में 52 पत्ते होते हैं: 26 लाल, 26 काले, 4 समूह तथा 12 तस्वीर (Face) वाले पत्ते।',
            hinglish: '52 cards = 26 red + 26 black; 12 face cards (4 J, 4 Q, 4 K).',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'If P(E) = 0.05, what is the probability of "not E" (i.e. P(Ē))?',
            hi: 'यदि P(E) = 0.05 है, तो "E नहीं" की प्रायिकता (P(Ē)) क्या होगी?',
            hinglish: 'Agar P(E) = 0.05 hai, toh P(not E) kitna hoga?',
          },
          options: [
            { en: '0.95', hi: '0.95', hinglish: '0.95' },
            { en: '0.05', hi: '0.05', hinglish: '0.05' },
            { en: '0.50', hi: '0.50', hinglish: '0.50' },
            { en: '0.90', hi: '0.90', hinglish: '0.90' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'P(not E) = 1 - P(E) = 1 - 0.05 = 0.95.',
            hi: 'P(Ē) = 1 - P(E) = 1 - 0.05 = 0.95।',
            hinglish: '1 - 0.05 = 0.95.',
          }
        },
      },
    ],
  },
];
