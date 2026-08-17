/**
 * StudyOS AI - Comprehensive Academic Curriculum & Multilingual Question Bank
 * Covers: CBSE 10 & 12, UP Board, ICSE, JEE Main & NEET
 * Includes exact Board Textbook sources (NCERT, Exemplar, SCERT, Selina ICSE)
 */
import { Subject, Question } from '../types';

export const CURRICULUM_SUBJECTS: Subject[] = [
  // 1. Class 10 / JEE Foundation: Physics - Current Electricity & Light
  {
    id: 'phy_10_electricity',
    name: {
      en: 'Physics: Current Electricity & Circuits',
      hi: 'भौतिकी: विद्युत धारा एवं परिपथ',
      hinglish: 'Physics: Current Electricity & Circuits',
      bn: 'পদার্থবিজ্ঞান: তড়িৎ প্রবাহ ও বর্তনী',
      mr: 'भौतिकशास्त्र: विद्युत प्रवाह व परिपथ',
      gu: 'ભૌતિકશાસ્ત્ર: વિદ્યુત પ્રવાહ અને પરિપથ',
      ta: 'இயற்பியல்: மின்னோட்டம் மற்றும் சுற்றுகள்',
      te: 'భౌతిక శాస్త్రం: విద్యుత్ ప్రవాహం & సర్క్యూట్లు',
    },
    icon: 'Zap',
    color: 'amber',
    exam: 'CBSE_10',
    chapters: [
      {
        id: 'ch_electricity_fundamentals',
        subjectId: 'phy_10_electricity',
        title: {
          en: 'Ohm’s Law, Resistance & Power',
          hi: 'ओम का नियम, प्रतिरोध एवं विद्युत शक्ति',
          hinglish: "Ohm's Law, Resistance aur Electrical Power",
          bn: 'ওহমের সূত্র, রোধ এবং শক্তি',
          mr: 'ओहमचा नियम, रोध आणि विद्युत शक्ती',
          gu: 'ઓહ્મનો નિયમ, અવરોધ અને વિદ્યુત શક્તિ',
        },
        description: {
          en: 'Master electric current I = Q/t, potential difference V = W/Q, Ohm’s law V = IR, and Joule heating H = I²Rt.',
          hi: 'विद्युत धारा I = Q/t, विभवान्तर V = W/Q, ओम का नियम V = IR तथा जूल का तापन नियम H = I²Rt का गहन अभ्यास।',
          hinglish: 'Current I = Q/t, Voltage V = W/Q, Ohm’s law V = IR aur Power P = VI concepts ko master karein.',
        },
        targetMastery: 90,
        highYieldWeightage: 14,
        concepts: [
          {
            id: 'concept_ohms_law',
            title: {
              en: "Ohm's Law & Resistance Factors",
              hi: 'ओम का नियम एवं प्रतिरोध को प्रभावित करने वाले कारक',
              hinglish: "Ohm's Law & Factors Affecting Resistance",
              bn: 'ওহমের সূত্র ও রোধের উপাদান',
              mr: 'ओहमचा नियम व रोधाचे घटक',
            },
            summary: {
              en: 'At constant temperature, the current flowing through a conductor is directly proportional to the potential difference across its ends: V = IR. Resistance depends on length (L), cross-sectional area (A), and resistivity (ρ): R = ρ(L/A).',
              hi: 'नियत ताप पर किसी चालक में बहने वाली विद्युत धारा उसके सिरों के विभवांतर के अनुक्रमानुपाती होती है: V = IR। चालक का प्रतिरोध R = ρ(L/A) होता है।',
              hinglish: "Constant temperature par conductor me flow hone wala current (I) applied voltage (V) ke directly proportional hota hai: V = IR. Resistance R = ρ(L/A) hota hai.",
            },
            formula: 'V = I \\cdot R \\quad \\text{and} \\quad R = \\rho \\frac{L}{A}',
            keyPoints: [
              {
                en: 'Doubling the wire length doubles the resistance (R ∝ L).',
                hi: 'तार की लम्बाई दोगुनी करने पर प्रतिरोध दोगुना हो जाता है (R ∝ L)।',
                hinglish: 'Wire ki length double karne par resistance double ho jata hai.',
              },
              {
                en: 'Doubling the cross-sectional area halves the resistance (R ∝ 1/A).',
                hi: 'अनुप्रस्थ काट क्षेत्रफल दोगुना करने पर प्रतिरोध आधा हो जाता है (R ∝ 1/A)।',
                hinglish: 'Area double karne se resistance aadha (half) ho jata hai.',
              },
              {
                en: 'Resistivity (ρ) depends only on the material and temperature, NOT on dimensions.',
                hi: 'विशिष्ट प्रतिरोध (ρ) केवल पदार्थ की प्रकृति और ताप पर निर्भर करता है, आकार पर नहीं।',
                hinglish: 'Resistivity (ρ) dimensions par depend nahi karti, sirf material aur temp par depend karti hai.',
              },
            ],
            difficulty: 'medium',
            checkpointQuestion: {
              prompt: {
                en: 'A cylindrical metallic wire of resistance R is stretched to double its original length keeping volume constant. What is its new resistance?',
                hi: 'R प्रतिरोध वाले एक बेलनाकार धातु के तार को खींचकर आयतन नियत रखते हुए उसकी लम्बाई दोगुनी कर दी जाती है। नया प्रतिरोध क्या होगा?',
                hinglish: 'Ek wire jiska resistance R hai, usko stretch karke length 2x kar di jati hai (volume constant). New resistance kya hoga?',
              },
              options: [
                { en: '2R', hi: '2R', hinglish: '2R' },
                { en: '4R', hi: '4R', hinglish: '4R' },
                { en: 'R / 2', hi: 'R / 2', hinglish: 'R / 2' },
                { en: 'R / 4', hi: 'R / 4', hinglish: 'R / 4' },
              ],
              correctIndex: 1,
              explanation: {
                en: 'When stretched to 2L, volume V = A·L is constant, so area becomes A/2. New resistance R’ = ρ(2L)/(A/2) = 4·ρ(L/A) = 4R.',
                hi: 'लम्बाई 2L होने पर क्षेत्रफल A/2 हो जाता है क्योंकि आयतन नियत है। अतः R’ = ρ(2L)/(A/2) = 4R।',
                hinglish: 'Length 2L hone par area A/2 ho jata hai. Isliye R’ = 4R.',
              },
            },
          },
          {
            id: 'concept_series_parallel',
            title: {
              en: 'Series and Parallel Combination of Resistors',
              hi: 'प्रतिरोधकों का श्रेणीक्रम एवं समान्तर क्रम संयोजन',
              hinglish: 'Series & Parallel Resistor Combinations',
              bn: 'রোধের শ্রেণী ও সমান্তরাল সমবায়',
              mr: 'रोधांचे एकसर व समांतर संयोजन',
            },
            summary: {
              en: 'In series, current remains identical across all resistors, and equivalent resistance is R_eq = R₁ + R₂ + ... In parallel, voltage is identical across each branch, and 1/R_eq = 1/R₁ + 1/R₂ + ...',
              hi: 'श्रेणीक्रम में प्रत्येक प्रतिरोध में धारा समान होती है: R_eq = R₁ + R₂। समान्तर क्रम में प्रत्येक शाखा में विभवान्तर समान होता है: 1/R_eq = 1/R₁ + 1/R₂।',
              hinglish: 'Series me current same rehta hai: R_eq = R1 + R2. Parallel me voltage same rehta hai: 1/R_eq = 1/R1 + 1/R2.',
            },
            formula: 'R_{\\text{series}} = R_1 + R_2 + \\dots \\quad \\text{and} \\quad \\frac{1}{R_{\\text{parallel}}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots',
            keyPoints: [
              {
                en: 'Parallel combination always yields an equivalent resistance smaller than the smallest individual resistor.',
                hi: 'समान्तर संयोजन का तुल्य प्रतिरोध सबसे छोटे व्यक्तिगत प्रतिरोध से भी कम होता है।',
                hinglish: 'Parallel connection ka equivalent resistance hamesha smallest resistor se bhi chhota hota hai.',
              },
              {
                en: 'Household electrical circuits are wired in parallel so that failure of one appliance does not break the circuit for others.',
                hi: 'घरेलू वायरिंग समान्तर क्रम में की जाती है ताकि एक उपकरण बंद होने पर अन्य उपकरण चलते रहें।',
                hinglish: 'Domestic wiring parallel me hoti hai taki sabhi appliances ko standard 220V mile aur alag switch ho.',
              },
            ],
            difficulty: 'medium',
            checkpointQuestion: {
              prompt: {
                en: 'Three 6 Ω resistors are connected such that their equivalent resistance is 9 Ω. How are they connected?',
                hi: 'तीन 6 Ω के प्रतिरोधक किस प्रकार जोड़े जाएँ कि तुल्य प्रतिरोध 9 Ω प्राप्त हो?',
                hinglish: 'Teen 6 Ω ke resistors ko kaise connect karein ki equivalent resistance 9 Ω mile?',
              },
              options: [
                { en: 'All three in series', hi: 'तीनों श्रेणीक्रम में', hinglish: 'Teeno series me' },
                { en: 'All three in parallel', hi: 'तीनों समान्तर क्रम में', hinglish: 'Teeno parallel me' },
                { en: 'Two in parallel, connected in series with the third', hi: 'दो समान्तर क्रम में, तीसरे के साथ श्रेणीक्रम में', hinglish: '2 parallel me, aur 3rd unke sath series me' },
                { en: 'Two in series, connected in parallel with the third', hi: 'दो श्रेणीक्रम में, तीसरे के साथ समान्तर क्रम में', hinglish: '2 series me, aur 3rd unke sath parallel me' },
              ],
              correctIndex: 2,
              explanation: {
                en: 'Two 6 Ω resistors in parallel have R_p = (6 × 6)/(6 + 6) = 3 Ω. Connecting this 3 Ω in series with the third 6 Ω gives R_total = 3 + 6 = 9 Ω.',
                hi: 'दो 6 Ω समान्तर में: (6 × 6)/(6 + 6) = 3 Ω। इसे तीसरे 6 Ω के साथ श्रेणी में जोड़ने पर: 3 + 6 = 9 Ω।',
                hinglish: '2 parallel = 3 Ω. 3 Ω + 6 Ω (series) = 9 Ω.',
              },
            },
          },
          {
            id: 'concept_joule_heating_power',
            title: {
              en: 'Joule’s Law of Heating & Electrical Power',
              hi: 'जूल का तापन नियम एवं विद्युत शक्ति',
              hinglish: 'Joule Heating & Electric Power Formulas',
              bn: 'জুলের তাপীয় ফল এবং বৈদ্যুতিক ক্ষমতা',
              mr: 'ज्युलचा औष्णिक नियम व विद्युत शक्ती',
            },
            summary: {
              en: 'Heat produced in a resistor is proportional to the square of current, resistance, and time: H = I²Rt. Electric power is P = VI = I²R = V²/R. The commercial unit of electrical energy is kilowatt-hour (1 kWh = 3.6 × 10⁶ J).',
              hi: 'चालक में उत्पन्न ऊष्मा H = I²Rt होती है। विद्युत शक्ति P = VI = I²R = V²/R। विद्युत ऊर्जा की व्यापारिक इकाई 1 kWh = 3.6 × 10⁶ जूल होती है।',
              hinglish: 'Heat formula H = I²Rt aur Power P = VI = I²R = V²/R hota hai. Commercial unit 1 unit = 1 kWh = 3.6 × 10⁶ Joules.',
            },
            formula: 'H = I^2 R t \\quad \\text{and} \\quad P = V I = I^2 R = \\frac{V^2}{R}',
            keyPoints: [
              {
                en: 'At constant voltage (household supply), Power is inversely proportional to Resistance (P = V²/R).',
                hi: 'नियत वोल्टेज पर शक्ति प्रतिरोध के व्युत्क्रमानुपाती होती है (P = V²/R)।',
                hinglish: 'Constant 220V voltage par higher power appliances ka resistance kam hota hai.',
              },
              {
                en: 'An electric fuse wire has high resistance and low melting point for safety isolation.',
                hi: 'फ्यूज तार का गलनांक निम्न तथा विशिष्ट प्रतिरोध उच्च होता है।',
                hinglish: 'Fuse wire ka melting point low hota hai taki overload par turant melt ho sake.',
              },
            ],
            difficulty: 'easy',
            checkpointQuestion: {
              prompt: {
                en: 'An electric iron consumes 1 kW electric power when operated at 220 V. What rating fuse must be used for this circuit?',
                hi: 'एक विद्युत प्रेस 220 V पर 1 kW विद्युत शक्ति लेती है। इसके परिपथ में किस मान का फ्यूज लगाना चाहिए?',
                hinglish: 'Ek electric iron 220V par 1 kW power consume karta hai. Is circuit me kis rating ka fuse lagana chahiye?',
              },
              options: [
                { en: '1 A', hi: '1 A', hinglish: '1 A' },
                { en: '2 A', hi: '2 A', hinglish: '2 A' },
                { en: '5 A', hi: '5 A', hinglish: '5 A' },
                { en: '15 A', hi: '15 A', hinglish: '15 A' },
              ],
              correctIndex: 2,
              explanation: {
                en: 'Current I = P / V = 1000 W / 220 V ≈ 4.54 A. The next standard safety fuse rating is 5 A.',
                hi: 'धारा I = 1000 / 220 ≈ 4.54 A। अतः 5 A का मानक फ्यूज उपयुक्त रहेगा।',
                hinglish: 'Current I = 1000/220 = 4.54 A. Safety ke liye next standard 5 A fuse lagega.',
              },
            },
          },
        ],
      },
    ],
  },

  // 2. Class 10 / UP Board / CBSE: Mathematics - Quadratic Equations & Arithmetic Progressions
  {
    id: 'math_10_algebra',
    name: {
      en: 'Mathematics: Quadratic Equations & AP',
      hi: 'गणित: द्विघात समीकरण एवं समान्तर श्रेढ़ी',
      hinglish: 'Mathematics: Quadratic Equations & Arithmetic Progressions',
      bn: 'গণিত: দ্বিঘাত সমীকরণ ও সমান্তর প্রগতি',
      mr: 'गणित: वर्गसमीकरणे व अंकगणिती श्रेढी',
      gu: 'ગણિત: દ્વિઘાત સમીકરણો અને સમાંતર શ્રેણી',
      ta: 'கணிதம்: இருபடி சமன்பாடுகள் & கூட்டுத்தொடர்',
      te: 'గణితం: వర్గ సమీకరణాలు & అంకశ్రేఢులు',
    },
    icon: 'Calculator',
    color: 'emerald',
    exam: 'CBSE_10',
    chapters: [
      {
        id: 'ch_quadratic_equations',
        subjectId: 'math_10_algebra',
        title: {
          en: 'Quadratic Equations & Roots Nature',
          hi: 'द्विघात समीकरण एवं मूलों की प्रकृति',
          hinglish: 'Quadratic Equations & Discriminant Rules',
          bn: 'দ্বিঘাত সমীকরণ ও মূলের প্রকৃতি',
          mr: 'वर्गसमीकरणे व मुळांचे स्वरूप',
        },
        description: {
          en: 'Standard form ax² + bx + c = 0, quadratic formula x = (-b ± √(b² - 4ac)) / (2a), discriminant D = b² - 4ac.',
          hi: 'मानक रूप ax² + bx + c = 0, श्रीधराचार्य सूत्र तथा विविक्तकर D = b² - 4ac द्वारा मूलों की प्रकृति का निर्धारण।',
          hinglish: 'Standard form ax² + bx + c = 0, Shreedharacharya formula aur Discriminant D = b² - 4ac.',
        },
        targetMastery: 90,
        highYieldWeightage: 10,
        concepts: [
          {
            id: 'concept_discriminant_nature_roots',
            title: {
              en: 'Discriminant and Nature of Roots',
              hi: 'विविक्तकर तथा मूलों की प्रकृति',
              hinglish: 'Discriminant (D) and Nature of Roots',
              bn: 'নিরূপক এবং মূলের প্রকৃতি',
              mr: 'विविधता व मुळांचे स्वरूप',
            },
            summary: {
              en: 'For ax² + bx + c = 0 (a ≠ 0), Discriminant D = b² - 4ac. If D > 0: two distinct real roots. If D = 0: two equal real roots. If D < 0: no real roots (complex conjugate roots).',
              hi: 'ax² + bx + c = 0 के लिए विविक्तकर D = b² - 4ac। यदि D > 0 तो दो भिन्न वास्तविक मूल; D = 0 तो दो समान वास्तविक मूल; D < 0 तो कोई वास्तविक मूल नहीं।',
              hinglish: 'D = b² - 4ac: D > 0 matlab 2 distinct real roots, D = 0 matlab equal real roots (-b/2a), D < 0 matlab no real roots.',
            },
            formula: 'D = b^2 - 4ac \\quad \\text{and} \\quad x = \\frac{-b \\pm \\sqrt{D}}{2a}',
            keyPoints: [
              {
                en: 'If roots are equal, D = 0 → b² = 4ac.',
                hi: 'यदि मूल समान हैं तो D = 0 → b² = 4ac।',
                hinglish: 'Equal roots ke liye D = 0 hota hai.',
              },
              {
                en: 'If coefficients are rational and D is a perfect square, roots are rational; otherwise irrational conjugates.',
                hi: 'यदि D पूर्ण वर्ग है तो मूल परिमेय होते हैं, अन्यथा अपरिमेय युग्म होते हैं।',
                hinglish: 'Agar D perfect square hai toh roots rational hote hain.',
              },
            ],
            difficulty: 'easy',
            checkpointQuestion: {
              prompt: {
                en: 'For what value of k does the quadratic equation 2x² + kx + 3 = 0 have two equal roots?',
                hi: 'k के किस मान के लिए द्विघात समीकरण 2x² + kx + 3 = 0 के दो बराबर मूल होंगे?',
                hinglish: 'k ki kis value ke liye equation 2x² + kx + 3 = 0 ke equal roots honge?',
              },
              options: [
                { en: 'k = ± 2√6', hi: 'k = ± 2√6', hinglish: 'k = ± 2√6' },
                { en: 'k = ± 6', hi: 'k = ± 6', hinglish: 'k = ± 6' },
                { en: 'k = ± 4√3', hi: 'k = ± 4√3', hinglish: 'k = ± 4√3' },
                { en: 'k = ± 12', hi: 'k = ± 12', hinglish: 'k = ± 12' },
              ],
              correctIndex: 0,
              explanation: {
                en: 'For equal roots, D = b² - 4ac = 0 → k² - 4(2)(3) = 0 → k² = 24 → k = ± √24 = ± 2√6.',
                hi: 'समान मूलों के लिए D = k² - 4(2)(3) = 0 → k² = 24 → k = ± 2√6।',
                hinglish: 'D = 0 → k² - 24 = 0 → k = ± 2√6.',
              },
            },
          },
        ],
      },
    ],
  },

  // 3. Class 12 / JEE / NEET: Physics - Electrostatics & Potential
  {
    id: 'phy_12_electrostatics',
    name: {
      en: 'Physics: Electrostatics & Coulomb’s Law',
      hi: 'भौतिकी: स्थिर वैद्युतिकी एवं कूलॉम का नियम',
      hinglish: "Physics: Electrostatics & Coulomb's Law",
      bn: 'পদার্থবিজ্ঞান: স্থির তড়িৎ ও কুলম্বের সূত্র',
      mr: 'भौतिकशास्त्र: स्थितिक विद्युत व कुलम्बचा नियम',
      gu: 'ભૌતિકશાસ્ત્ર: સ્થિર વિદ્યુત અને કુલંબનો નિયમ',
      ta: 'இயற்பியல்: மின்னியல் மற்றும் கூலும் விதி',
      te: 'భౌతిక శాస్త్రం: స్థిర విద్యుత్ & కూలూమ్ నియమం',
    },
    icon: 'Atom',
    color: 'blue',
    exam: 'JEE_MAIN',
    chapters: [
      {
        id: 'ch_electric_charges_fields',
        subjectId: 'phy_12_electrostatics',
        title: {
          en: 'Coulomb’s Law, Electric Fields & Flux',
          hi: 'कूलॉम का नियम, विद्युत क्षेत्र एवं फ्लक्स',
          hinglish: 'Coulomb’s Law, Field & Gauss Theorem',
          bn: 'কুলম্বের সূত্র ও গাউসের উপপাদ্য',
          mr: 'कुलम्बचा नियम व विद्युत फ्लक्स',
        },
        description: {
          en: 'Vector Coulomb’s law, superposition principle, electric field E = F/q, electric dipole moment p = q(2a), and Gauss’s law ∮ E·dA = Q_enclosed / ε₀.',
          hi: 'कूलॉम का सदिश नियम, अध्यारोपण सिद्धांत, विद्युत क्षेत्र, द्विध्रुव आघूर्ण तथा गॉस का नियम।',
          hinglish: 'Coulomb’s law vector form, Electric Dipole and Gauss Law applications.',
        },
        targetMastery: 90,
        highYieldWeightage: 12,
        concepts: [
          {
            id: 'concept_coulombs_law',
            title: {
              en: 'Coulomb’s Law in Vector Form & Dielectrics',
              hi: 'कूलॉम का सदिश नियम एवं परावैद्युतांक प्रभाव',
              hinglish: "Coulomb's Law in Vector & Dielectric Mediums",
              bn: 'কুলম্বের ভেক্টর রূপ ও পরাবৈদ্যুতিক ধ্রুবক',
              mr: 'कुलम्बचा सदिश नियम व माध्यम',
            },
            summary: {
              en: 'The electrostatic force between two stationary point charges is directly proportional to the product of charges and inversely proportional to the square of distance: F = (1 / 4πε) · (|q₁q₂| / r²). In a medium of dielectric constant K, force reduces to F_med = F_vacuum / K.',
              hi: 'दो स्थिर बिंदु आवेशों के मध्य लगने वाला आकर्षण या प्रतिकर्षण बल F = (1 / 4πε₀K) · (q₁q₂ / r²) होता है। माध्यम में बल F/K रह जाता है।',
              hinglish: "Stationary point charges ke beech force F = k (q₁q₂ / r²) hota hai. Dielectric medium K me force F/K ho jata hai.",
            },
            formula: 'F = \\frac{1}{4\\pi \\varepsilon_0 K} \\frac{|q_1 q_2|}{r^2}',
            keyPoints: [
              {
                en: 'Force is a central force and obeys Newton’s third law (F₁₂ = -F₂₁).',
                hi: 'यह एक केंद्रीय बल है और न्यूटन के तीसरे नियम का पालन करता है (F₁₂ = -F₂₁)।',
                hinglish: 'Yeh central force hai aur Newton ke 3rd law ko follow karta hai (F₁₂ = -F₂₁).',
              },
              {
                en: 'For water (K ≈ 80), electrostatic force between ions drops by 80 times, explaining why it is a universal solvent.',
                hi: 'जल का परावैद्युतांक K ≈ 80 होने के कारण आयनों के बीच आकर्षण 80 गुना घट जाता है।',
                hinglish: 'Water ke liye K ≈ 80 hota hai, isliye ions easily dissolve ho jate hain.',
              },
            ],
            difficulty: 'hard',
            checkpointQuestion: {
              prompt: {
                en: 'Two point charges experience an electrostatic force F in air. If placed in water of dielectric constant K = 80 at the same distance, what is the new force?',
                hi: 'वायु में दो बिंदु आवेशों के बीच बल F है। यदि इन्हें समान दूरी पर K = 80 वाले जल में रख दिया जाए, तो नया बल क्या होगा?',
                hinglish: 'Air me 2 charges ke beech force F hai. Agar unhe water (K = 80) me same distance par rakha jaye toh new force kitna hoga?',
              },
              options: [
                { en: '80 F', hi: '80 F', hinglish: '80 F' },
                { en: 'F / 80', hi: 'F / 80', hinglish: 'F / 80' },
                { en: 'F / 1600', hi: 'F / 1600', hinglish: 'F / 1600' },
                { en: 'F', hi: 'F', hinglish: 'F' },
              ],
              correctIndex: 1,
              explanation: {
                en: 'In a dielectric medium, F_med = F_air / K = F / 80.',
                hi: 'परावैद्युत माध्यम में बल F_med = F / K = F / 80 होता है।',
                hinglish: 'Medium me force F_med = F / K = F / 80 ho jata hai.',
              },
            },
          },
        ],
      },
    ],
  },
];

/**
 * High-Yield Multilingual Question Bank with exact Board Textbook Metadata
 */
export const CURRICULUM_QUESTIONS: Question[] = [
  // Question 1: CBSE Class 10 NCERT Science Textbook
  {
    id: 'q_elec_001',
    conceptId: 'concept_ohms_law',
    chapterId: 'ch_electricity_fundamentals',
    subjectId: 'phy_10_electricity',
    type: 'MCQ',
    difficulty: 'medium',
    marks: 4,
    negativeMarks: 1,
    expectedTimeSec: 60,
    textbookSource: {
      board: 'CBSE',
      bookTitle: 'NCERT Science Class 10 (Official Textbook)',
      chapterNo: 12,
      chapterName: 'Electricity',
      exercise: 'Chapter-End Exercise',
      questionNo: 'Q1 (Page 221)',
      pageNo: 221,
      category: 'exercise',
    },
    prompt: {
      en: 'A piece of wire of resistance R is cut into five equal parts. These parts are then connected in parallel. If the equivalent resistance of this combination is R′, then what is the ratio R/R′?',
      hi: 'R प्रतिरोध के एक तार को पाँच बराबर भागों में काटा जाता है। इन भागों को फिर समान्तर क्रम में संयोजित किया जाता है। यदि इस संयोजन का तुल्य प्रतिरोध R′ है, तो अनुपात R/R′ क्या होगा?',
      hinglish: 'R resistance wale wire ko 5 equal parts me cut kiya gaya aur un 5 parts ko parallel me connect kiya gaya. Agar equivalent resistance R′ hai, toh ratio R/R′ kya hoga?',
      bn: 'R রোধের একটি তারকে সমান ৫ টুকরো করে সমান্তরাল সমবায়ে যুক্ত করা হলো। R/R′ অনুপাত কত হবে?',
      mr: 'R रोधाच्या तारेचे ५ समान तुकडे करून समांतर जोडले. R/R′ चे गुणोत्तर काय असेल?',
    },
    options: [
      { en: '1 / 25', hi: '1 / 25', hinglish: '1 / 25' },
      { en: '1 / 5', hi: '1 / 5', hinglish: '1 / 5' },
      { en: '5', hi: '5', hinglish: '5' },
      { en: '25', hi: '25', hinglish: '25' },
    ],
    correctIndex: 3,
    explanation: {
      en: 'Each cut piece has resistance r = R / 5 (since R ∝ L). Connecting 5 identical resistors of r in parallel gives 1/R′ = 5 × (1/r) = 5 × (5/R) = 25/R → R′ = R / 25. Therefore, the ratio R/R′ = 25.',
      hi: 'प्रत्येक टुकड़े का प्रतिरोध r = R / 5 होगा। समान्तर क्रम में: 1/R′ = 5 × (5/R) = 25/R → R′ = R/25। अतः अनुपात R/R′ = 25 होगा।',
      hinglish: 'Har piece ka resistance r = R/5. Parallel me 5 pieces: 1/R′ = 5/(R/5) = 25/R → R/R′ = 25.',
    },
    hint1: {
      en: 'First calculate the individual resistance of 1 piece when the length becomes L/5.',
      hi: 'पहले यह निकालें कि लम्बाई L/5 होने पर 1 टुकड़े का प्रतिरोध कितना होगा।',
      hinglish: 'Pehle 1 piece ka resistance nikalein jab length L/5 ho jati hai.',
    },
    hint2: {
      en: 'For N identical resistors of resistance r in parallel, R′ = r / N = (R/5) / 5.',
      hi: 'समान्तर क्रम में N समान प्रतिरोध r के लिए R′ = r / N = (R/5) / 5 होता है।',
      hinglish: 'Parallel me identical resistors ke liye R′ = r / N hota hai.',
    },
    guidedReasoning: {
      en: 'Step 1: Resistance is directly proportional to length (R ∝ L). So each 1/5th piece is R/5.\nStep 2: Connect five R/5 resistors in parallel: R′ = (R/5) / 5 = R / 25.\nStep 3: Ratio R / R′ = R / (R/25) = 25.',
      hi: 'स्टेप 1: लम्बाई 1/5 होने पर प्रतिरोध R/5 होता है।\nस्टेप 2: पाँचों को समान्तर में जोड़ने पर: R′ = R / 25।\nस्टेप 3: अनुपात R / R′ = 25।',
      hinglish: 'Step 1: Wire cut kiya 5 parts me → har part R/5.\nStep 2: 5 parts parallel me → R′ = R/25.\nStep 3: R / R′ = 25.',
    },
    commonMisconception: {
      en: 'Students often forget the double division and incorrectly select 1/25 or 5.',
      hi: 'छात्र अक्सर अनुपात को उल्टा लिखकर 1/25 चुन लेते हैं।',
      hinglish: 'Students direct R′ ka answer (R/25) dekh kar 1/25 tick kar dete hain, jabki ratio R/R′ pucha gaya hai.',
    },
    whyReason: {
      en: 'Official NCERT Chapter 12 Exercise Question 1 — frequently asked in CBSE & State Board examinations.',
      hi: 'एनसीईआरटी अध्याय 12 अभ्यास प्रश्न 1 — बोर्ड परीक्षाओं में सर्वाधिक पूछा जाने वाला प्रश्न।',
      hinglish: 'NCERT Textbook Exercise 12.1 Q1 direct board problem.',
    },
  },

  // Question 2: NCERT Exemplar & CBSE In-Text Question
  {
    id: 'q_elec_002',
    conceptId: 'concept_joule_heating_power',
    chapterId: 'ch_electricity_fundamentals',
    subjectId: 'phy_10_electricity',
    type: 'MCQ',
    difficulty: 'medium',
    marks: 4,
    negativeMarks: 1,
    expectedTimeSec: 75,
    textbookSource: {
      board: 'CBSE',
      bookTitle: 'NCERT Science In-Text & NCERT Exemplar Problems',
      chapterNo: 12,
      chapterName: 'Electricity',
      exercise: 'In-Text Example 12.12',
      questionNo: 'Page 218 Solved Example',
      pageNo: 218,
      category: 'in_text',
    },
    prompt: {
      en: 'Two electric bulbs are rated (60W, 220V) and (100W, 220V). Which bulb has higher electrical resistance?',
      hi: 'दो विद्युत बल्बों पर (60W, 220V) तथा (100W, 220V) अंकित है। किस बल्ब का विद्युत प्रतिरोध अधिक होगा?',
      hinglish: 'Do electric bulbs (60W, 220V) aur (100W, 220V) hain. Kis bulb ka electrical resistance jyada hoga?',
      bn: 'দুটি বৈদ্যুতিক বাল্ব (৬০ ওয়াট, ২২০ ভোল্ট) এবং (১০০ ওয়াট, ২২০ ভোল্ট)। কোনটির রোধ বেশি?',
      mr: 'दोन बल्ब (६०W, २२०V) आणि (१००W, २२०V) आहेत. कोणत्या बल्बचा रोध जास्त असेल?',
    },
    options: [
      { en: 'The 60W bulb', hi: '60W वाला बल्ब', hinglish: '60W wala bulb' },
      { en: 'The 100W bulb', hi: '100W वाला बल्ब', hinglish: '100W wala bulb' },
      { en: 'Both have equal resistance', hi: 'दोनों का प्रतिरोध समान होगा', hinglish: 'Dono ka resistance equal hoga' },
      { en: 'Depends on the supply current', hi: 'प्रवाहित धारा पर निर्भर करता है', hinglish: 'Supply current par depend karta hai' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'From power formula P = V² / R, resistance R = V² / P at rated voltage. Since 220V is constant, R is inversely proportional to Power (R ∝ 1/P). Thus, the lower wattage bulb (60W) has higher resistance.',
      hi: 'शक्ति सूत्र P = V² / R से, प्रतिरोध R = V² / P। नियत वोल्टेज पर प्रतिरोध शक्ति के व्युत्क्रमानुपाती होता है (R ∝ 1/P)। अतः 60W वाले बल्ब का प्रतिरोध अधिक होगा।',
      hinglish: 'P = V²/R formula se R = V²/P. Jiska Power kam hoga (60W), uska resistance jyada hoga.',
    },
    hint1: {
      en: 'Relate rated power P and rated voltage V to resistance R.',
      hi: 'शक्ति P और वोल्टेज V को प्रतिरोध R के सूत्र से जोड़ें।',
      hinglish: 'Power P aur Voltage V ka formula P = V²/R use karein.',
    },
    hint2: {
      en: 'R = V² / P. Notice the inverse relationship between R and P.',
      hi: 'R = V² / P। R और P के बीच व्युत्क्रम सम्बन्ध देखें।',
      hinglish: 'R = V²/P me R aur P inversely proportional hain.',
    },
    guidedReasoning: {
      en: 'Step 1: Both bulbs operate at 220V.\nStep 2: R_60 = (220)²/60 ≈ 806.6 Ω.\nStep 3: R_100 = (220)²/100 = 484 Ω.\nConclusion: 60W bulb has higher resistance.',
      hi: 'स्टेप 1: दोनों का वोल्टेज 220V है।\nस्टेप 2: R_60 = (220)²/60 = 806.6 Ω।\nस्टेप 3: R_100 = (220)²/100 = 484 Ω।\nअतः 60W बल्ब का प्रतिरोध अधिक है।',
      hinglish: 'Step 1: Rated voltage 220V same hai.\nStep 2: R = V²/P → 60W bulb ka R = 806.6 Ω jabki 100W bulb ka R = 484 Ω.',
    },
    commonMisconception: {
      en: 'Students intuitively think higher power means higher resistance (confusing P = I²R when current is not constant).',
      hi: 'छात्र अक्सर सोचते हैं कि अधिक वाट का मतलब अधिक प्रतिरोध है (P = I²R का गलत प्रयोग)।',
      hinglish: 'Students think higher power = higher resistance, which is incorrect at fixed voltage.',
    },
    whyReason: {
      en: 'NCERT In-Text Problem testing distinction between series current formula and parallel voltage formula.',
      hi: 'एनसीईआरटी इन-टेक्स्ट प्रश्न: विद्युत शक्ति तथा प्रतिरोध के सही सम्बन्ध की जांच।',
      hinglish: 'NCERT In-text concept check for rated electrical appliances.',
    },
  },

  // Question 3: NCERT Mathematics Class 10 Textbook (Quadratic Equations)
  {
    id: 'q_quad_001',
    conceptId: 'concept_discriminant_nature_roots',
    chapterId: 'ch_quadratic_equations',
    subjectId: 'math_10_algebra',
    type: 'MCQ',
    difficulty: 'medium',
    marks: 4,
    negativeMarks: 1,
    expectedTimeSec: 60,
    textbookSource: {
      board: 'CBSE',
      bookTitle: 'NCERT Mathematics Class 10 (Official Textbook)',
      chapterNo: 4,
      chapterName: 'Quadratic Equations',
      exercise: 'Exercise 4.4',
      questionNo: 'Q2 (ii) (Page 91)',
      pageNo: 91,
      category: 'exercise',
    },
    prompt: {
      en: 'Find the values of k for which the quadratic equation kx(x - 2) + 6 = 0 has two equal real roots.',
      hi: 'k का वह मान ज्ञात कीजिए जिसके लिए द्विघात समीकरण kx(x - 2) + 6 = 0 के दो बराबर मूल हों।',
      hinglish: 'k ki value find karein jiske liye quadratic equation kx(x - 2) + 6 = 0 ke do equal real roots hon.',
      bn: 'kx(x - 2) + 6 = 0 সমীকরণের দুটি সমান মূল থাকলে k এর মান কত?',
      mr: 'kx(x - 2) + 6 = 0 या वर्गसमीकरणाची मुळे समान असतील तर k चे मूल्य काय असेल?',
    },
    options: [
      { en: 'k = 6 (k ≠ 0)', hi: 'k = 6 (k ≠ 0)', hinglish: 'k = 6 (k ≠ 0)' },
      { en: 'k = 0 only', hi: 'केवल k = 0', hinglish: 'Sirf k = 0' },
      { en: 'k = ± 6', hi: 'k = ± 6', hinglish: 'k = ± 6' },
      { en: 'k = 24', hi: 'k = 24', hinglish: 'k = 24' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Expanding: kx² - 2kx + 6 = 0. Here a = k, b = -2k, c = 6. For equal roots, D = b² - 4ac = 0 → (-2k)² - 4(k)(6) = 0 → 4k² - 24k = 0 → 4k(k - 6) = 0. Since a = k ≠ 0 for a quadratic equation, k = 6.',
      hi: 'विस्तार करने पर: kx² - 2kx + 6 = 0। यहाँ a = k, b = -2k, c = 6। समान मूलों के लिए D = 0 → 4k² - 24k = 0 → 4k(k - 6) = 0। चूँकि k ≠ 0, अतः k = 6।',
      hinglish: 'kx² - 2kx + 6 = 0. D = 0 → 4k² - 24k = 0 → 4k(k - 6) = 0. Since k ≠ 0, k = 6.',
    },
    hint1: {
      en: 'First write the equation in the standard form ax² + bx + c = 0.',
      hi: 'पहले समीकरण को मानक रूप ax² + bx + c = 0 में लिखें।',
      hinglish: 'Pehle equation ko expand karke ax² + bx + c = 0 form me layein.',
    },
    hint2: {
      en: 'Remember: if k = 0, the equation ceases to be a quadratic equation (a = 0).',
      hi: 'ध्यान रखें: यदि k = 0 होगा तो यह द्विघात समीकरण नहीं रहेगा।',
      hinglish: 'k = 0 reject hoga kyunki quadratic equation ke liye a ≠ 0 hona zaroori hai.',
    },
    guidedReasoning: {
      en: 'Step 1: Form: kx² - 2kx + 6 = 0.\nStep 2: a = k, b = -2k, c = 6.\nStep 3: D = (-2k)² - 4(k)(6) = 4k² - 24k = 0.\nStep 4: k(k - 6) = 0 → k = 6 (k ≠ 0).',
      hi: 'स्टेप 1: kx² - 2kx + 6 = 0।\nस्टेप 2: D = 4k² - 24k = 0।\nस्टेप 3: k = 6 (k = 0 अमान्य)।',
      hinglish: 'Step 1: kx² - 2kx + 6 = 0 → 4k(k - 6) = 0 → k = 6.',
    },
    commonMisconception: {
      en: 'Students include k = 0 without realizing it eliminates the x² term.',
      hi: 'छात्र k = 0 को भी उत्तर में शामिल कर लेते हैं, जिससे द्विघात पद समाप्त हो जाता है।',
      hinglish: 'k = 0 ko bhi answer maan lena bina check kiye ki yeh quadratic term destroy kar deta hai.',
    },
    whyReason: {
      en: 'Official NCERT Class 10 Maths Exercise 4.4 Q2 (ii) — tests standard form expansion & non-zero leading coefficient condition.',
      hi: 'एनसीईआरटी कक्षा 10 गणित अभ्यास 4.4 प्रश्न 2 (ii) — बोर्ड का अत्यंत लोकप्रिय प्रश्न।',
      hinglish: 'NCERT Class 10 Exercise 4.4 Question 2(ii) high yield.',
    },
  },

  // Question 4: Class 12 NCERT Physics (Electrostatics)
  {
    id: 'q_electro_001',
    conceptId: 'concept_coulombs_law',
    chapterId: 'ch_electric_charges_fields',
    subjectId: 'phy_12_electrostatics',
    type: 'MCQ',
    difficulty: 'hard',
    marks: 4,
    negativeMarks: 1,
    expectedTimeSec: 90,
    textbookSource: {
      board: 'CBSE',
      bookTitle: 'NCERT Physics Class 12 (Part 1 Textbook)',
      chapterNo: 1,
      chapterName: 'Electric Charges and Fields',
      exercise: 'Chapter-End Exercise',
      questionNo: 'Exercise 1.12 & 1.13 (Page 47)',
      pageNo: 47,
      category: 'exercise',
    },
    prompt: {
      en: 'Two identical small conducting spheres having charges +4q and -2q are placed at distance r apart in vacuum. They are brought in contact and then returned to their original positions. What is the ratio of final electrostatic force to initial electrostatic force?',
      hi: '+4q तथा -2q आवेश वाले दो समान चालक गोले निर्वात में r दूरी पर रखे हैं। उन्हें परस्पर स्पर्श कराकर पुनः उसी दूरी पर रख दिया जाता है। अंतिम स्थिर वैद्युत बल तथा प्रारंभिक बल का अनुपात क्या होगा?',
      hinglish: '+4q aur -2q charge wale 2 identical conducting spheres r distance par hain. Unhe touch karwake wapas usi distance par rakh diya gaya. Final force aur Initial force ka ratio kya hoga?',
      bn: '+4q ও -2q আধানযুক্ত দুটি গোলককে স্পর্শ করিয়ে আবার আগের দূরত্বে রাখলে বলের অনুপাত কত হবে?',
      mr: '+4q आणि -2q प्रभार असलेले दोन गोल एकमेकांना स्पर्श करून मूळ अंतरावर ठेवले. अंतिम बल व प्रारंभिक बलाचे गुणोत्तर काय असेल?',
    },
    options: [
      { en: '1 : 8', hi: '1 : 8', hinglish: '1 : 8' },
      { en: '1 : 4', hi: '1 : 4', hinglish: '1 : 4' },
      { en: '1 : 2', hi: '1 : 2', hinglish: '1 : 2' },
      { en: '8 : 1', hi: '8 : 1', hinglish: '8 : 1' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Initial Force: F_initial = k · |(+4q)(-2q)| / r² = 8kq²/r² (attractive).\nWhen touched, total charge Q_total = +4q + (-2q) = +2q is shared equally: q’ = +2q / 2 = +q on each sphere.\nFinal Force: F_final = k · (q)(q) / r² = kq²/r² (repulsive).\nRatio F_final / F_initial = (kq²/r²) / (8kq²/r²) = 1 / 8.',
      hi: 'प्रारंभिक बल: F_initial = k · |4q × -2q| / r² = 8kq²/r²।\nस्पर्श कराने पर कुल आवेश (+4q - 2q) = +2q दोनों में बराबर (+q) बंट जाता है।\nअंतिम बल: F_final = k · q² / r²।\nअनुपात: F_final / F_initial = 1 / 8।',
      hinglish: 'Initial magnitude = 8 k q²/r². Touching share: (4q - 2q)/2 = q on each. Final magnitude = 1 k q²/r². Ratio = 1 : 8.',
    },
    hint1: {
      en: 'Use the principle of conservation of charge and equal distribution upon contact for identical spheres.',
      hi: 'आवेश संरक्षण तथा समान गोलों में स्पर्श द्वारा समान वितरण का नियम लगाएँ।',
      hinglish: 'Identical spheres touch hone par total charge (+4q - 2q) barabar aadha-aadha share hoga.',
    },
    hint2: {
      en: 'Compare magnitude: Initial has product |4 × -2| = 8, Final has product |1 × 1| = 1.',
      hi: 'परिमाण की तुलना करें: प्रारंभिक गुणनफल |4 × -2| = 8, अंतिम गुणनफल |1 × 1| = 1।',
      hinglish: 'Initial product = 8, Final product = 1. Ratio = 1:8.',
    },
    guidedReasoning: {
      en: 'Step 1: Initial force magnitude ∝ 4 × 2 = 8.\nStep 2: Touch spheres → Each sphere gets (+4q - 2q)/2 = +q.\nStep 3: Final force magnitude ∝ 1 × 1 = 1.\nStep 4: Ratio = 1 / 8.',
      hi: 'स्टेप 1: प्रारंभिक बल परिमाण ∝ 4 × 2 = 8।\nस्टेप 2: स्पर्श के बाद प्रत्येक पर आवेश = (+4q - 2q)/2 = +q।\nस्टेप 3: अंतिम बल परिमाण ∝ 1 × 1 = 1।\nस्टेप 4: अनुपात = 1/8।',
      hinglish: 'Step 1: F_initial ∝ 8.\nStep 2: Touch ke baad each charge = +q.\nStep 3: F_final ∝ 1.\nStep 4: Ratio = 1:8.',
    },
    commonMisconception: {
      en: 'Adding magnitudes without sign (+4 + 2 = 6q → 3q each → 9/8 ratio). Must account for algebraic sign.',
      hi: 'चिन्हों को अनदेखा कर (+4 + 2 = 6q) जोड़ देना। आवेशों का योग बीजगणितीय होना चाहिए।',
      hinglish: 'Sign ignore karke 4+2=6q maan lena common mistake hai.',
    },
    whyReason: {
      en: 'NCERT Class 12 Physics Chapter 1 Exercises 1.12 & 1.13 combined concept — high-frequency JEE/NEET problem.',
      hi: 'एनसीईआरटी भौतिकी कक्षा 12 अध्याय 1 अभ्यास 1.12 व 1.13 का समन्वित प्रश्न।',
      hinglish: 'NCERT Physics Class 12 Chapter 1 textbook problem.',
    },
  },

  // Question 5: UP Board & NCERT Exemplar Chemistry / Physics
  {
    id: 'q_up_001',
    conceptId: 'concept_ohms_law',
    chapterId: 'ch_electricity_fundamentals',
    subjectId: 'phy_10_electricity',
    type: 'MCQ',
    difficulty: 'hard',
    marks: 4,
    negativeMarks: 1,
    expectedTimeSec: 80,
    textbookSource: {
      board: 'UP_BOARD',
      bookTitle: 'UP Board Madhyamik Shiksha Parishad Vigyan',
      chapterNo: 12,
      chapterName: 'विद्युत धारा (Current Electricity)',
      exercise: 'अभ्यास प्रश्नावली 12.3',
      questionNo: 'प्रश्न संख्या 7 (Page 184)',
      pageNo: 184,
      category: 'exercise',
    },
    prompt: {
      en: 'A copper wire has diameter 0.5 mm and resistivity of 1.6 × 10⁻⁸ Ω·m. What will be the length of this wire to make its resistance 10 Ω?',
      hi: 'किसी तांबे के तार का व्यास 0.5 mm तथा प्रतिरोधकता 1.6 × 10⁻⁸ Ω·m है। 10 Ω प्रतिरोध का तार बनाने के लिए कितनी लम्बाई की आवश्यकता होगी?',
      hinglish: 'Copper wire ka diameter 0.5 mm aur resistivity 1.6 × 10⁻⁸ Ω·m hai. 10 Ω resistance banane ke liye wire ki kitni length chahiye?',
      bn: 'একটি তামার তারের ব্যাস ০.৫ মিমি এবং রোধাঙ্ক ১.৬ × ১০⁻⁸ ওহম-মিটার হলে ১০ ওহম রোধের জন্য কত দৈর্ঘ্যের তার প্রয়োজন?',
      mr: 'तांब्याच्या तारेचा व्यास ०.५ मिमी आणि रोधकता १.६ × १०⁻⁸ Ω·m आहे. १० Ω रोधासाठी तारेची लांबी किती असावी?',
    },
    options: [
      { en: '122.7 m', hi: '122.7 मीटर', hinglish: '122.7 m' },
      { en: '110.0 m', hi: '110.0 मीटर', hinglish: '110.0 m' },
      { en: '61.3 m', hi: '61.3 मीटर', hinglish: '61.3 m' },
      { en: '245.4 m', hi: '245.4 मीटर', hinglish: '245.4 m' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Radius r = 0.5 mm / 2 = 0.25 mm = 2.5 × 10⁻⁴ m. Cross-sectional Area A = πr² = 3.1416 × (2.5 × 10⁻⁴)² ≈ 1.9635 × 10⁻⁷ m². From R = ρ(L/A) → L = (R · A) / ρ = (10 × 1.9635 × 10⁻⁷) / (1.6 × 10⁻⁸) ≈ 122.7 m.',
      hi: 'त्रिज्या r = 0.25 mm = 2.5 × 10⁻⁴ m। क्षेत्रफल A = πr² = 1.9635 × 10⁻⁷ m²। सूत्र L = (R · A) / ρ = (10 × 1.9635 × 10⁻⁷) / (1.6 × 10⁻⁸) ≈ 122.7 मीटर।',
      hinglish: 'r = 0.25 mm → A = πr² = 1.9635 × 10⁻⁷ m². L = (R × A)/ρ = 122.7 m.',
    },
    hint1: {
      en: 'Convert diameter to radius in meters first: r = 0.25 × 10⁻³ m.',
      hi: 'पहले व्यास को मीटर में त्रिज्या में बदलें: r = 0.25 × 10⁻³ m।',
      hinglish: 'Pehle diameter ko radius in meters me convert karein: r = 0.25 × 10⁻³ m.',
    },
    hint2: {
      en: 'Rearrange R = ρ(L/A) to isolate length: L = (R · A) / ρ.',
      hi: 'सूत्र को पुनर्व्यवस्थित करें: L = (R · A) / ρ।',
      hinglish: 'Formula: L = (R * A) / ρ.',
    },
    guidedReasoning: {
      en: 'Step 1: Radius = 0.25 × 10⁻³ m.\nStep 2: Area = πr² = 1.9635 × 10⁻⁷ m².\nStep 3: Length = (10 × 1.9635 × 10⁻⁷) / (1.6 × 10⁻⁸) = 122.7 m.',
      hi: 'स्टेप 1: त्रिज्या = 0.25 × 10⁻³ m।\nस्टेप 2: क्षेत्रफल A = 1.9635 × 10⁻⁷ m²।\nस्टेप 3: L = 122.7 m।',
      hinglish: 'L = (10 × π × (2.5e-4)²) / (1.6e-8) = 122.7 m.',
    },
    commonMisconception: {
      en: 'Using diameter directly instead of radius in πr², resulting in 4x calculation error.',
      hi: 'त्रिज्या के स्थान पर सीधे व्यास का उपयोग कर देना, जिससे 4 गुना त्रुटि हो जाती है।',
      hinglish: 'Diameter ko direct radius ki jagah use karne se 4 times error aata hai.',
    },
    whyReason: {
      en: 'UP Board Class 10 Science & NCERT Exemplar standard numerical problem on wire resistivity dimensions.',
      hi: 'यूपी बोर्ड तथा एनसीईआरटी का मानक संख्यात्मक प्रश्न।',
      hinglish: 'UP Board & NCERT Exemplar dimensional resistivity calculation.',
    },
  },
];
