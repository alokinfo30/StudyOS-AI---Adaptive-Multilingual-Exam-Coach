import { Subject, Chapter, Concept, EducationBoard, ExamCategory, GoalCategory, LanguageCode, LocalizedString } from '../types';
import { CLASS_10_SCIENCE_ALL_CHAPTERS } from './curriculum/class10Science';
import { CLASS_10_MATH_ALL_CHAPTERS } from './curriculum/class10Math';
import { CLASS_12_PHYSICS_ALL_CHAPTERS } from './curriculum/class12Physics';
import { CLASS_12_CHEMISTRY_ALL_CHAPTERS } from './curriculum/class12Chemistry';
import { CLASS_12_MATH_ALL_CHAPTERS } from './curriculum/class12Math';

/**
 * Official Curriculum Repository supporting all Indian Educational Boards and Classes.
 * Dynamically synthesizes syllabus subjects, chapters, formulas, intuition blocks,
 * and checkpoint formative assessments based on student's selected Board and Class.
 */

// ============================================================================
// 1. CLASS 10 CURRICULUM DEFINITIONS (CBSE, UP BOARD, ICSE, BIHAR & STATE BOARDS)
// ============================================================================

export const CLASS_10_SCIENCE_CHAPTERS: Chapter[] = [
  {
    id: 'c10_sci_ch1_chemical_reactions',
    subjectId: 'class10_science',
    chapterNo: 1,
    title: {
      en: 'Chemical Reactions & Equations',
      hi: 'रासायनिक अभिक्रियाएँ एवं समीकरण',
      hinglish: 'Chemical Reactions and Equations',
      bn: 'রাসায়নিক বিক্রিয়া ও সমীকরণ',
      mr: 'रासायनिक अभिक्रिया आणि समीकरणे',
      gu: 'રાસાયણિક પ્રક્રિયાઓ અને સમીકરણો',
      ta: 'வேதி வினைகள் மற்றும் சமன்பாடுகள்',
      te: 'రసాయన చర్యలు మరియు సమీకరణాలు',
    },
    description: {
      en: 'Balancing chemical equations, combination, decomposition, displacement, double displacement, redox reactions, and corrosion prevention.',
      hi: 'रासायनिक समीकरणों का संतुलन, संयोजन, वियोजन, विस्थापन, द्विविस्थापन, उपचयन-अपचयन (रेडॉक्स) तथा संक्षारण व विकृतगंधिता।',
      hinglish: 'Chemical equations balance karna, types of reactions aur redox reactions.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Science Class 10 Ch 1, Pages 1-16 / State Board Textbook',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_balancing_reactions',
        title: {
          en: 'Law of Conservation of Mass & Balancing Equations',
          hi: 'द्रव्यमान संरक्षण का नियम एवं समीकरण संतुलन',
          hinglish: 'Conservation of Mass & Balancing Equations',
        },
        summary: {
          en: 'Matter can neither be created nor destroyed in a chemical reaction. Hence, the number of atoms of each element remains identical before and after a chemical reaction.',
          hi: 'किसी भी रासायनिक अभिक्रिया में द्रव्यमान का न तो निर्माण होता है न ही विनाश। अतः दोनों पक्षों में तत्वों के परमाणुओं की संख्या बराबर होनी चाहिए।',
          hinglish: 'Chemical reaction me total mass constant rehta hai, isliye reactant aur product side atoms equal hone chahiye.',
        },
        formula: '3\\text{Fe} + 4\\text{H}_2\\text{O} \\rightarrow \\text{Fe}_3\\text{O}_4 + 4\\text{H}_2',
        keyPoints: [
          {
            en: 'Always balance atoms of metals first, followed by non-metals, then hydrogen, and oxygen last.',
            hi: 'पहले धातुओं के परमाणुओं को संतुलित करें, फिर अधातुओं को, तत्पश्चात हाइड्रोजन और अंत में ऑक्सीजन को।',
            hinglish: 'Pehle metals balance karo, fir non-metals, aur last me H aur O.',
          },
          {
            en: 'Physical states (s), (l), (g), (aq) must be annotated for complete board representation.',
            hi: 'भौतिक अवस्थाओं (s, l, g, aq) को दर्शाना बोर्ड परीक्षा में पूरे अंक प्राप्त करने हेतु अनिवार्य है।',
            hinglish: 'Physical state likhna board me zaroori hai.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'What are the stoichiometric coefficients a, b, c, d to balance: a Al + b O₂ → c Al₂O₃?',
            hi: 'समीकरण a Al + b O₂ → c Al₂O₃ को संतुलित करने के लिए a, b, c के मान क्या होंगे?',
            hinglish: 'a Al + b O₂ → c Al₂O₃ ko balance karne ke liye a, b, c kya honge?',
          },
          options: [
            { en: 'a = 4, b = 3, c = 2', hi: 'a = 4, b = 3, c = 2', hinglish: 'a = 4, b = 3, c = 2' },
            { en: 'a = 2, b = 3, c = 1', hi: 'a = 2, b = 3, c = 1', hinglish: 'a = 2, b = 3, c = 1' },
            { en: 'a = 4, b = 2, c = 2', hi: 'a = 4, b = 2, c = 2', hinglish: 'a = 4, b = 2, c = 2' },
            { en: 'a = 1, b = 1, c = 1', hi: 'a = 1, b = 1, c = 1', hinglish: 'a = 1, b = 1, c = 1' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Balancing oxygen first: 3 O₂ (6 oxygen atoms) gives 2 Al₂O₃. To balance aluminum: 4 Al atoms are needed on the reactant side. Thus: 4 Al + 3 O₂ → 2 Al₂O₃.',
            hi: 'ऑक्सीजन को संतुलित करने पर: 3 O₂ से 2 Al₂O₃ बनते हैं (6 ऑक्सीजन परमाणु)। एल्यूमीनियम के 4 परमाणुओं हेतु: 4 Al + 3 O₂ → 2 Al₂O₃।',
            hinglish: 'Oxygen balance karne ke liye 3 O₂ = 6 oxygen, jo 2 Al₂O₃ dega, fir 4 Al chahiye.',
          },
        },
      },
      {
        id: 'c10_concept_redox_reactions',
        title: {
          en: 'Oxidation, Reduction & Redox Processes',
          hi: 'उपचयन (ऑक्सीकरण), अपचयन एवं रेडॉक्स अभिक्रियाएँ',
          hinglish: 'Oxidation, Reduction and Redox Reactions',
        },
        summary: {
          en: 'Oxidation is the gain of oxygen or loss of hydrogen/electrons. Reduction is the loss of oxygen or gain of hydrogen/electrons. When both occur simultaneously, it is a Redox reaction.',
          hi: 'ऑक्सीजन का योग अथवा हाइड्रोजन/इलेक्ट्रॉनों का ह्रास उपचयन कहलाता है। ऑक्सीजन का ह्रास अथवा हाइड्रोजन/इलेक्ट्रॉनों का योग अपचयन कहलाता है।',
          hinglish: 'Oxygen add hona ya hydrogen/electron loose hona Oxidation hai; Oxygen loose hona Reduction hai.',
        },
        formula: '\\text{CuO} + \\text{H}_2 \\xrightarrow{\\Delta} \\text{Cu} + \\text{H}_2\\text{O}',
        keyPoints: [
          {
            en: 'In CuO + H₂ → Cu + H₂O, CuO is reduced to Cu (acting as oxidizing agent), and H₂ is oxidized to H₂O (reducing agent).',
            hi: 'CuO + H₂ → Cu + H₂O में, CuO का अपचयन Cu में होता है (उपचायक), और H₂ का उपचयन H₂O में होता है (अपचायक)।',
            hinglish: 'CuO reduce ho raha hai (oxidizing agent), aur H₂ oxidize ho raha hai (reducing agent).',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'In the reaction: MnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂, which substance is oxidized?',
            hi: 'अभिक्रिया MnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂ में किस पदार्थ का उपचयन (ऑक्सीकरण) हो रहा है?',
            hinglish: 'Is reaction me kiska oxidation ho raha hai?',
          },
          options: [
            { en: 'HCl is oxidized to Cl₂', hi: 'HCl का Cl₂ में उपचयन हो रहा है', hinglish: 'HCl oxidize ho kar Cl₂ ban raha hai' },
            { en: 'MnO₂ is oxidized', hi: 'MnO₂ का उपचयन हो रहा है', hinglish: 'MnO₂ oxidize ho raha hai' },
            { en: 'MnCl₂ is oxidized', hi: 'MnCl₂ का उपचयन हो रहा है', hinglish: 'MnCl₂ oxidize ho raha hai' },
            { en: 'H₂O is oxidized', hi: 'H₂O का उपचयन हो रहा है', hinglish: 'H₂O oxidize ho raha hai' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'HCl loses hydrogen to form Cl₂, which is oxidation. MnO₂ loses oxygen to form MnCl₂, which is reduction.',
            hi: 'HCl से हाइड्रोजन का ह्रास होकर Cl₂ बन रहा है, अतः HCl का उपचयन हुआ।',
            hinglish: 'HCl se hydrogen nikal kar Cl₂ ban raha hai, isliye HCl oxidize ho raha hai.',
          },
        },
      },
    ],
  },
  {
    id: 'c10_sci_ch2_acids_bases_salts',
    subjectId: 'class10_science',
    chapterNo: 2,
    title: {
      en: 'Acids, Bases and Salts',
      hi: 'अम्ल, क्षारक एवं लवण',
      hinglish: 'Acids, Bases and Salts',
    },
    description: {
      en: 'Chemical properties of acids & bases, pH scale in daily life, preparation and properties of Bleaching Powder, Baking Soda, Washing Soda, and Plaster of Paris.',
      hi: 'अम्ल व क्षारकों के रासायनिक गुणधर्म, दैनिक जीवन में pH का महत्त्व, विरंजक चूर्ण, बेकिंग सोडा, धावन सोडा तथा प्लास्टर ऑफ पेरिस।',
      hinglish: 'pH scale, neutralization reaction aur important salts ki chemistry.',
    },
    targetMastery: 90,
    highYieldWeightage: 9,
    textbookRef: 'NCERT Science Class 10 Ch 2, Pages 17-38',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_ph_scale',
        title: {
          en: 'pH Scale & Hydrogen Ion Concentration',
          hi: 'pH पैमाना एवं हाइड्रोजन आयन सांद्रता',
          hinglish: 'pH Scale & Everyday Importance',
        },
        summary: {
          en: 'pH is a measure of hydrogen ion concentration: pH = -log[H⁺]. Acidic solutions have pH < 7, neutral pH = 7, and basic solutions have pH > 7. Human blood operates in the narrow range of 7.35 to 7.45.',
          hi: 'pH हाइड्रोजन आयनों की सांद्रता का ऋणात्मक लघुगणक है: pH = -log[H⁺]। अम्लीय विलयन pH < 7, उदासीन pH = 7, तथा क्षारीय pH > 7 होता है।',
          hinglish: 'pH scale 0 se 14 tak hota hai. pH < 7 acid, pH = 7 neutral, pH > 7 base.',
        },
        formula: '\\text{pH} = -\\log_{10}[\\text{H}^+] \\quad \\text{and} \\quad [\\text{H}^+][\\text{OH}^-] = 10^{-14}',
        keyPoints: [
          {
            en: 'Lower the pH value, higher is the hydronium ion concentration.',
            hi: 'pH मान जितना कम होगा, हाइड्रोनियम आयन सांद्रता उतनी ही अधिक होगी।',
            hinglish: 'Jitna kam pH, utna strong acid.',
          },
          {
            en: 'Tooth decay starts when mouth pH falls below 5.5 due to acid produced by bacterial degradation of sugars.',
            hi: 'मुख का pH 5.5 से कम होने पर दाँतों का इनैमल क्षय होने लगता है।',
            hinglish: 'Mouth ka pH 5.5 se niche jane par daant kharab hone lagte hain.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'Solution A has pH 3 and Solution B has pH 6. Which solution has a higher hydrogen ion concentration and by what factor?',
            hi: 'विलयन A का pH 3 है और विलयन B का pH 6 है। किसमें H⁺ आयनों की सांद्रता अधिक है और कितने गुना?',
            hinglish: 'Solution A ka pH 3 aur B ka pH 6 hai. Kisme H⁺ zyada hai aur kitne guna?',
          },
          options: [
            { en: 'Solution A, by 1,000 times', hi: 'विलयन A, 1,000 गुना अधिक', hinglish: 'Solution A, 1,000 times zyada' },
            { en: 'Solution B, by 2 times', hi: 'विलयन B, 2 गुना अधिक', hinglish: 'Solution B, 2 times zyada' },
            { en: 'Solution A, by 3 times', hi: 'विलयन A, 3 गुना अधिक', hinglish: 'Solution A, 3 times zyada' },
            { en: 'Solution B, by 100 times', hi: 'विलयन B, 100 गुना अधिक', hinglish: 'Solution B, 100 times zyada' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Each unit change on the pH logarithmic scale represents a 10-fold difference in [H⁺]. Difference of 3 pH units means 10³ = 1,000 times higher [H⁺] in Solution A.',
            hi: 'प्रत्येक 1 इकाई परिवर्तन 10 गुना अंतर दर्शाता है। 3 इकाइयों का अंतर = 10³ = 1,000 गुना अधिक H⁺ सांद्रता विलयन A में।',
            hinglish: 'Log scale par har 1 step 10x hota hai. 3 step difference = 10 x 10 x 10 = 1,000 times.',
          },
        },
      },
    ],
  },
  {
    id: 'c10_sci_ch11_electricity',
    subjectId: 'class10_science',
    chapterNo: 11,
    title: {
      en: 'Electricity, Ohm’s Law & Circuits',
      hi: 'विद्युत, ओम का नियम एवं परिपथ',
      hinglish: 'Electricity, Ohm’s Law & Circuits',
      bn: 'তড়িৎ ও ওহমের সূত্র',
      mr: 'विद्युतधारा व ओहमचा नियम',
    },
    description: {
      en: 'Electric potential difference, Ohm’s law, factors affecting resistance, series and parallel resistor combinations, Joule’s heating law and commercial electric power.',
      hi: 'विद्युत विभव एवं विभवांतर, ओम का नियम, प्रतिरोध की निर्भरता, श्रेणीक्रम एवं पार्श्वक्रम संयोजन, जूल का तापन नियम तथा विद्युत शक्ति।',
      hinglish: 'Ohm’s law V = IR, Series-Parallel combination aur Joule’s heating effect H = I²Rt.',
    },
    targetMastery: 90,
    highYieldWeightage: 10,
    textbookRef: 'NCERT Science Class 10 Ch 11, Pages 205-226 / UPMSP Kaksha 10 Vigyan Ch 12',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_ohms_law',
        title: {
          en: 'Ohm’s Law & Resistance Factors',
          hi: 'ओम का नियम एवं प्रतिरोध को प्रभावित करने वाले कारक',
          hinglish: 'Ohm’s Law & Factors Affecting Resistance',
        },
        summary: {
          en: 'At constant temperature, current I flowing through a metallic conductor is directly proportional to the potential difference V across its ends: V = IR. Resistance depends on length L, cross-sectional area A, and resistivity ρ: R = ρ(L/A).',
          hi: 'नियत ताप पर चालक तार में प्रवाहित धारा I उसके सिरों के विभवांतर V के समानुपाती होती है: V = IR। तार का प्रतिरोध R = ρ(L/A) होता है।',
          hinglish: 'Constant temperature par V = IR hota hai. Resistance wire ki length ke directly aur area ke inversely proportional hota hai.',
        },
        formula: 'V = I R \\quad \\text{and} \\quad R = \\rho \\frac{L}{A}',
        keyPoints: [
          {
            en: 'Doubling wire length doubles resistance (R ∝ L). Doubling cross-sectional area halves resistance (R ∝ 1/A).',
            hi: 'लंबाई दोगुनी करने पर प्रतिरोध दोगुना हो जाता है। अनुप्रस्थ काट क्षेत्रफल दोगुना करने पर प्रतिरोध आधा रह जाता है।',
            hinglish: 'Length badhane se resistance badhta hai, mota wire lene se resistance ghat-ta hai.',
          },
          {
            en: 'Resistivity ρ is an intrinsic material property and does not change with wire dimensions.',
            hi: 'प्रतिरोधकता ρ केवल पदार्थ की प्रकृति और ताप पर निर्भर करती है, तार की लंबाई अथवा मोटाई पर नहीं।',
            hinglish: 'Resistivity material ki property hoti hai, length ya radius change karne se change nahi hoti.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'A cylinder of length L and uniform cross-section A has resistance R. If stretched uniformly to double its length (2L), what is its new resistance?',
            hi: 'लंबाई L तथा अनुप्रस्थ काट A के चालक का प्रतिरोध R है। यदि इसे खींचकर इसकी लंबाई दोगुनी (2L) कर दी जाए, तो नया प्रतिरोध क्या होगा?',
            hinglish: 'Wire ko stretch karke length double (2L) kar di jaye toh new resistance kitna hoga?',
          },
          options: [
            { en: '4 R', hi: '4 R', hinglish: '4 R' },
            { en: '2 R', hi: '2 R', hinglish: '2 R' },
            { en: 'R / 2', hi: 'R / 2', hinglish: 'R / 2' },
            { en: 'R', hi: 'R', hinglish: 'R' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'When stretched, volume remains constant (V = A·L). When length becomes 2L, area becomes A/2. New resistance R’ = ρ(2L) / (A/2) = 4 · ρ(L/A) = 4R.',
            hi: 'तार को खींचने पर आयतन नियत रहता है (A·L = A’·2L → A’ = A/2)। अतः R’ = ρ(2L)/(A/2) = 4R।',
            hinglish: 'Stretch karne par volume same rehta hai, so length 2x hogi toh area half ho jayega. Resistance = 2/(1/2) = 4R.',
          },
        },
      },
      {
        id: 'c10_concept_joules_heating',
        title: {
          en: 'Joule’s Law of Heating & Electric Power',
          hi: 'जूल का तापन नियम एवं विद्युत शक्ति',
          hinglish: 'Joule’s Law of Heating (H = I²Rt)',
        },
        summary: {
          en: 'Heat produced in a resistor is directly proportional to the square of current, resistance, and time: H = I²Rt. Commercial unit of electric energy is kilowatt-hour (kWh), where 1 kWh = 3.6 × 10⁶ Joules.',
          hi: 'किसी प्रतिरोधक में उत्पन्न ऊष्मा धारा के वर्ग, प्रतिरोध तथा समय के समानुपाती होती है: H = I²Rt। विद्युत ऊर्जा का व्यापारिक मात्रक 1 kWh = 3.6 × 10⁶ जूल होता है।',
          hinglish: 'Heat H = I²Rt = VIt = (V²/R)t. 1 unit electricity = 1 kWh = 3.6 × 10⁶ J.',
        },
        formula: 'H = I^2 R t = V I t = \\frac{V^2}{R} t \\quad \\text{and} \\quad 1\\text{ kWh} = 3.6 \\times 10^6 \\text{ J}',
        keyPoints: [
          {
            en: 'In electric heating devices (geysers, heaters), nichrome alloys are used because of high resistivity and high melting point without oxidising.',
            hi: 'विद्युत हीटर में नाइक्रोम मिश्रधातु का उपयोग उच्च प्रतिरोधकता एवं उच्च गलनांक के कारण किया जाता है।',
            hinglish: 'Electric heaters me Nichrome use hota hai kyunki uska melting point aur resistivity high hoti hai.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'An electric bulb is rated 220 V and 100 W. When operated on 110 V, what is the power consumed?',
            hi: 'एक विद्युत बल्ब पर 220 V एवं 100 W अंकित है। जब इसे 110 V पर प्रचालित करते हैं, तब इसके द्वारा उपयुक्त शक्ति कितनी होगी?',
            hinglish: 'Bulb rating 220V, 100W hai. 110V par chalane par kitni power consume hogi?',
          },
          options: [
            { en: '25 W', hi: '25 W', hinglish: '25 W' },
            { en: '50 W', hi: '50 W', hinglish: '50 W' },
            { en: '75 W', hi: '75 W', hinglish: '75 W' },
            { en: '100 W', hi: '100 W', hinglish: '100 W' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Resistance of bulb R = V² / P = (220)² / 100 = 484 Ω. At 110 V: P’ = V’² / R = (110)² / 484 = 12100 / 484 = 25 W.',
            hi: 'बल्ब का प्रतिरोध R = V²/P = (220)²/100 = 484 Ω। 110 V पर: P’ = (110)²/484 = 25 W।',
            hinglish: 'R = V²/P = 220²/100 = 484 Ω. New power = 110²/484 = 25 W.',
          },
        },
      },
    ],
  },
  {
    id: 'c10_sci_ch9_light',
    subjectId: 'class10_science',
    chapterNo: 9,
    title: {
      en: 'Light – Reflection and Refraction',
      hi: 'प्रकाश – परावर्तन तथा अपवर्तन',
      hinglish: 'Light – Reflection and Refraction',
    },
    description: {
      en: 'Spherical mirrors, mirror formula, magnification, Snell’s law of refraction, spherical lenses, lens formula, and power of a lens.',
      hi: 'गोलीय दर्पण, दर्पण सूत्र, आवर्धन, स्नेल का अपवर्तन नियम, गोलीय लेंस, लेंस सूत्र तथा लेंस की क्षमता।',
      hinglish: 'Mirror formula 1/v + 1/u = 1/f, Lens formula 1/v - 1/u = 1/f aur Lens power P = 1/f.',
    },
    targetMastery: 90,
    highYieldWeightage: 10,
    textbookRef: 'NCERT Science Class 10 Ch 9, Pages 160-189',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_mirror_lens_formula',
        title: {
          en: 'Mirror & Lens Formulas with Sign Convention',
          hi: 'दर्पण व लेंस सूत्र एवं कार्तीय चिन्ह परिपाटी',
          hinglish: 'Mirror & Lens Formulas (1/v ± 1/u = 1/f)',
        },
        summary: {
          en: 'For spherical mirrors: 1/v + 1/u = 1/f and magnification m = -v/u. For spherical lenses: 1/v - 1/u = 1/f and m = v/u. Power of lens P = 1/f (in meters), measured in Dioptres (D).',
          hi: 'गोलीय दर्पण के लिए: 1/v + 1/u = 1/f तथा आवर्धन m = -v/u। लेंस के लिए: 1/v - 1/u = 1/f तथा m = v/u। लेंस की क्षमता P = 1/f (मीटर में) डायोप्टर (D) होती है।',
          hinglish: 'Mirrors ke liye plus sign (1/v + 1/u = 1/f), lenses ke liye minus sign (1/v - 1/u = 1/f). Lens Power P = 1/f(m).',
        },
        formula: '\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f} \\quad (\\text{Mirror}) \\qquad \\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f} \\quad (\\text{Lens})',
        keyPoints: [
          {
            en: 'Focal length of concave mirror and concave lens is always negative (-f). Convex mirror and convex lens have positive focal length (+f).',
            hi: 'अवतल दर्पण एवं अवतल लेंस की फोकस दूरी सदैव ऋणात्मक (-f) होती है। उत्तल की धनात्मक (+f) होती है।',
            hinglish: 'Concave ke liye f negative hota hai, Convex ke liye positive.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'A convex lens has a focal length of +20 cm. What is the power of this lens in Dioptres?',
            hi: 'एक उत्तल लेंस की फोकस दूरी +20 सेमी है। इस लेंस की क्षमता डायोप्टर में क्या होगी?',
            hinglish: 'Convex lens ki focal length +20 cm hai. Lens power kitni hogi?',
          },
          options: [
            { en: '+5.0 D', hi: '+5.0 D', hinglish: '+5.0 D' },
            { en: '-5.0 D', hi: '-5.0 D', hinglish: '-5.0 D' },
            { en: '+0.05 D', hi: '+0.05 D', hinglish: '+0.05 D' },
            { en: '+2.0 D', hi: '+2.0 D', hinglish: '+2.0 D' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Focal length in meters f = +20 cm = +0.2 m. Power P = 1 / f = 1 / 0.2 = +5.0 Dioptres.',
            hi: 'फोकस दूरी मीटर में: f = 20/100 = 0.2 मीटर। क्षमता P = 1/f = 1/0.2 = +5 D।',
            hinglish: 'P = 1/f(m) = 1/0.2 = +5.0 D.',
          },
        },
      },
    ],
  },
];

export const CLASS_10_MATH_CHAPTERS: Chapter[] = [
  {
    id: 'c10_math_ch1_real_numbers',
    subjectId: 'class10_math',
    chapterNo: 1,
    title: {
      en: 'Real Numbers & Fundamental Theorem of Arithmetic',
      hi: 'वास्तविक संख्याएँ एवं अंकगणित की आधारभूत प्रमेय',
      hinglish: 'Real Numbers & Prime Factorization',
    },
    description: {
      en: 'Fundamental theorem of arithmetic, HCF and LCM product relationship, proving irrationality of √2, √3, √5.',
      hi: 'अंकगणित की आधारभूत प्रमेय, HCF × LCM = a × b संबंध, तथा √2, √3, √5 की अपरिमेयता का सत्यापन।',
      hinglish: 'Prime factorization, HCF x LCM = a x b aur irrationality proofs.',
    },
    targetMastery: 90,
    highYieldWeightage: 6,
    textbookRef: 'NCERT Mathematics Class 10 Ch 1, Pages 1-18',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_fundamental_theorem_arithmetic',
        title: {
          en: 'Fundamental Theorem of Arithmetic & HCF-LCM',
          hi: 'अंकगणित की आधारभूत प्रमेय तथा म.स.-ल.स. संबंध',
          hinglish: 'Fundamental Theorem of Arithmetic',
        },
        summary: {
          en: 'Every composite number can be expressed (factorized) as a unique product of primes, apart from the order in which the prime factors occur. For any two positive integers a and b: HCF(a, b) × LCM(a, b) = a × b.',
          hi: 'प्रत्येक भाज्य संख्या को अभाज्य संख्याओं के एक अद्वितीय गुणनफल के रूप में व्यक्त किया जा सकता है। दो संख्याओं हेतु: HCF(a, b) × LCM(a, b) = a × b।',
          hinglish: 'Har composite number ka prime factorization unique hota hai. Do numbers ke liye HCF x LCM = a x b.',
        },
        formula: '\\text{HCF}(a, b) \\times \\text{LCM}(a, b) = a \\times b',
        keyPoints: [
          {
            en: 'HCF is the product of smallest power of each common prime factor. LCM is product of greatest power of each prime factor.',
            hi: 'HCF उभयनिष्ठ अभाज्य गुणनखंडों की सबसे छोटी घात का गुणनफल होता है। LCM प्रत्येक अभाज्य गुणनखंड की सबसे बड़ी घात का गुणनफल होता है।',
            hinglish: 'HCF smallest power of common factors hai, LCM highest power of all factors hai.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'If HCF(306, 657) = 9, what is LCM(306, 657)?',
            hi: 'यदि HCF(306, 657) = 9 है, तो LCM(306, 657) का मान क्या होगा?',
            hinglish: 'Agar HCF(306, 657) = 9 hai, toh LCM kya hoga?',
          },
          options: [
            { en: '22,338', hi: '22,338', hinglish: '22,338' },
            { en: '2,238', hi: '2,238', hinglish: '2,238' },
            { en: '223,380', hi: '223,380', hinglish: '223,380' },
            { en: '34,218', hi: '34,218', hinglish: '34,218' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Using LCM(a, b) = (a × b) / HCF(a, b): LCM = (306 × 657) / 9 = 34 × 657 = 22,338.',
            hi: 'सूत्र LCM = (a × b) / HCF से: LCM = (306 × 657) / 9 = 34 × 657 = 22,338।',
            hinglish: 'LCM = (306 x 657) / 9 = 34 x 657 = 22,338.',
          },
        },
      },
    ],
  },
  {
    id: 'c10_math_ch4_quadratic_equations',
    subjectId: 'class10_math',
    chapterNo: 4,
    title: {
      en: 'Quadratic Equations & Roots Nature',
      hi: 'द्विघात समीकरण एवं मूलों की प्रकृति',
      hinglish: 'Quadratic Equations & Shreedharacharya Formula',
    },
    description: {
      en: 'Standard form ax² + bx + c = 0, factorization, quadratic formula x = (-b ± √(b² - 4ac)) / (2a), and nature of roots using discriminant D = b² - 4ac.',
      hi: 'मानक रूप ax² + bx + c = 0, गुणनखंडन विधि, श्रीधराचार्य सूत्र तथा विविक्तकर D = b² - 4ac द्वारा मूलों की प्रकृति।',
      hinglish: 'ax² + bx + c = 0 ke roots aur discriminant D = b² - 4ac ke rules.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Mathematics Class 10 Ch 4, Pages 70-92 / UPMSP Kaksha 10 Ganit Ch 4',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_discriminant_roots',
        title: {
          en: 'Discriminant (D) & Shreedharacharya Formula',
          hi: 'विविक्तकर (D) एवं श्रीधराचार्य सूत्र',
          hinglish: 'Discriminant D = b² - 4ac and Roots Nature',
        },
        summary: {
          en: 'For quadratic equation ax² + bx + c = 0 (a ≠ 0), the discriminant D = b² - 4ac. If D > 0: two distinct real roots. If D = 0: two equal real roots. If D < 0: no real roots.',
          hi: 'द्विघात समीकरण ax² + bx + c = 0 के लिए विविक्तकर D = b² - 4ac। यदि D > 0 तो दो भिन्न वास्तविक मूल; D = 0 तो दो समान वास्तविक मूल; D < 0 तो कोई वास्तविक मूल नहीं।',
          hinglish: 'D = b² - 4ac: D > 0 real distinct roots, D = 0 equal roots, D < 0 imaginary roots.',
        },
        formula: 'D = b^2 - 4ac \\quad \\text{and} \\quad x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        keyPoints: [
          {
            en: 'For equal roots, D must equal 0 (b² = 4ac).',
            hi: 'समान मूलों हेतु विविक्तकर शून्य होना अनिवार्य है (b² = 4ac)।',
            hinglish: 'Equal roots ke liye D = 0 rakhein.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'For what values of k does the quadratic equation 2x² + kx + 3 = 0 have equal roots?',
            hi: 'k के किस मान के लिए द्विघात समीकरण 2x² + kx + 3 = 0 के दो बराबर मूल होंगे?',
            hinglish: 'k ki kis value ke liye 2x² + kx + 3 = 0 ke equal roots honge?',
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
            hi: 'समान मूलों हेतु D = k² - 4(2)(3) = 0 → k² = 24 → k = ± 2√6।',
            hinglish: 'D = k² - 24 = 0 → k = ± √24 = ± 2√6.',
          },
        },
      },
    ],
  },
  {
    id: 'c10_math_ch5_ap',
    subjectId: 'class10_math',
    chapterNo: 5,
    title: {
      en: 'Arithmetic Progressions (AP)',
      hi: 'समांतर श्रेढ़ी (AP)',
      hinglish: 'Arithmetic Progressions (AP)',
    },
    description: {
      en: 'nth term of an AP an = a + (n - 1)d, sum of first n terms Sn = n/2 [2a + (n - 1)d], and real-life AP sum word problems.',
      hi: 'समान्तर श्रेढ़ी का n-वाँ पद an = a + (n - 1)d, प्रथम n पदों का योग Sn = n/2 [2a + (n - 1)d]।',
      hinglish: 'AP nth term formula aur Sum of n terms Sn = n/2[2a + (n-1)d].',
    },
    targetMastery: 90,
    highYieldWeightage: 7,
    textbookRef: 'NCERT Mathematics Class 10 Ch 5, Pages 93-116',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_ap_formulas',
        title: {
          en: 'AP General Term & Sum Formulas',
          hi: 'समान्तर श्रेढ़ी का व्यापक पद एवं योग सूत्र',
          hinglish: 'AP General Term & Sum Formulas',
        },
        summary: {
          en: 'In an AP with first term a and common difference d: the nth term is an = a + (n - 1)d. The sum of first n terms is Sn = (n/2)[2a + (n - 1)d] = (n/2)[a + l].',
          hi: 'प्रथम पद a और सार्व अंतर d वाली श्रेढ़ी का n-वाँ पद: an = a + (n - 1)d। प्रथम n पदों का योग: Sn = (n/2)[2a + (n - 1)d]।',
          hinglish: 'an = a + (n - 1)d aur Sn = n/2 [2a + (n - 1)d] ya n/2 [a + l].',
        },
        formula: 'a_n = a + (n - 1)d \\quad \\text{and} \\quad S_n = \\frac{n}{2}[2a + (n - 1)d] = \\frac{n}{2}(a + l)',
        keyPoints: [
          {
            en: 'Common difference d = aₙ - aₙ₋₁ can be positive, negative, or zero.',
            hi: 'सार्व अंतर d धनात्मक, ऋणात्मक अथवा शून्य हो सकता है।',
            hinglish: 'd positive, negative ya zero ho sakta hai.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'Find the 30th term of the AP: 10, 7, 4, ...',
            hi: 'समान्तर श्रेढ़ी 10, 7, 4, ... का 30-वाँ पद ज्ञात कीजिए:',
            hinglish: 'AP 10, 7, 4, ... ka 30th term kya hoga?',
          },
          options: [
            { en: '-77', hi: '-77', hinglish: '-77' },
            { en: '97', hi: '97', hinglish: '97' },
            { en: '77', hi: '77', hinglish: '77' },
            { en: '-87', hi: '-87', hinglish: '-87' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Here a = 10, d = 7 - 10 = -3. a₃₀ = a + (30 - 1)d = 10 + 29(-3) = 10 - 87 = -77.',
            hi: 'यहाँ a = 10, d = -3। a₃₀ = 10 + 29(-3) = 10 - 87 = -77।',
            hinglish: 'a = 10, d = -3. a₃₀ = 10 + 29(-3) = -77.',
          },
        },
      },
    ],
  },
];

// ============================================================================
// 2. CLASS 12 CURRICULUM DEFINITIONS (CBSE, UP BOARD, ISC, BIHAR & STATE BOARDS)
// ============================================================================

export const CLASS_12_PHYSICS_CHAPTERS: Chapter[] = [
  {
    id: 'c12_phy_ch1_electric_charges',
    subjectId: 'class12_physics',
    chapterNo: 1,
    title: {
      en: 'Electric Charges & Fields (Coulomb’s Law)',
      hi: 'वैद्युत आवेश तथा क्षेत्र (कूलॉम का नियम)',
      hinglish: 'Electric Charges & Fields (Coulomb’s Law)',
      bn: 'স্থির তড়িৎ ও কুলম্বের সূত্র',
      mr: 'विद्युत प्रभार आणि क्षेत्रे',
    },
    description: {
      en: 'Coulomb’s law in vector form, superposition principle, electric field due to dipole, torque on dipole in uniform field, Gauss’s theorem and its applications.',
      hi: 'कूलॉम का सदिश नियम, अध्यारोपण सिद्धांत, वैद्युत द्विध्रुव एवं आघूर्ण, एकसमान क्षेत्र में बल आघूर्ण, गॉस का नियम तथा अनंत चालक तार व चादर हेतु अनुप्रयोग।',
      hinglish: 'Coulomb’s law vector form, Electric Dipole torque aur Gauss Theorem applications.',
    },
    targetMastery: 90,
    highYieldWeightage: 10,
    textbookRef: 'NCERT Physics Class 12 Part 1 Ch 1, Pages 1-52 / UPMSP Bhautiki Ch 1',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_coulombs_vector',
        title: {
          en: 'Coulomb’s Law in Vector Form & Dielectrics',
          hi: 'कूलॉम का सदिश नियम एवं परावैद्युतांक प्रभाव',
          hinglish: 'Coulomb’s Law Vector Form & Dielectrics',
        },
        summary: {
          en: 'The electrostatic force between two stationary point charges is F = (1 / 4πε₀) · (|q₁q₂| / r²). In a dielectric medium of constant K, the force drops to F_med = F_vacuum / K.',
          hi: 'दो स्थिर बिंदु आवेशों के मध्य लगने वाला आकर्षण अथवा प्रतिकर्षण बल F = (1 / 4πε₀K) · (q₁q₂ / r²) होता है। माध्यम में बल F/K रह जाता है।',
          hinglish: 'Stationary charges ke beech force F = (1/4πε₀) (q₁q₂/r²) hota hai. Dielectric medium me force K times kam ho jata hai.',
        },
        formula: '\\vec{F}_{12} = \\frac{1}{4\\pi \\varepsilon_0 K} \\frac{q_1 q_2}{r_{12}^2} \\hat{r}_{12}',
        keyPoints: [
          {
            en: 'Coulomb force is a central force obeying Newton’s third law (F₁₂ = -F₂₁).',
            hi: 'कूलॉम बल केंद्रीय बल है और न्यूटन के तीसरे नियम का पालन करता है (F₁₂ = -F₂₁)।',
            hinglish: 'Yeh central force hai aur Newton’s 3rd law follow karta hai.',
          },
          {
            en: 'Permittivity of free space ε₀ = 8.854 × 10⁻¹² C² N⁻¹ m⁻²; 1 / (4πε₀) ≈ 9 × 10⁹ N m² C⁻².',
            hi: 'निर्वात की विद्युतशीलता ε₀ = 8.854 × 10⁻¹² C² N⁻¹ m⁻² होती है।',
            hinglish: '1 / (4πε₀) ki value 9 x 10⁹ N m² C⁻² hoti hai.',
          },
        ],
        difficulty: 'hard',
        checkpointQuestion: {
          prompt: {
            en: 'Two charges experience an electrostatic force F in vacuum. If immersed in water (dielectric constant K = 80) at the same distance, what is the new force?',
            hi: 'निर्वात में दो आवेशों के मध्य बल F है। यदि इन्हें समान दूरी पर जल (परावैद्युतांक K = 80) में रख दिया जाए, तो नया बल क्या होगा?',
            hinglish: 'Vacuum me force F hai. Water (K = 80) me immerse karne par new force kitna hoga?',
          },
          options: [
            { en: 'F / 80', hi: 'F / 80', hinglish: 'F / 80' },
            { en: '80 F', hi: '80 F', hinglish: '80 F' },
            { en: 'F / 1600', hi: 'F / 1600', hinglish: 'F / 1600' },
            { en: 'F', hi: 'F', hinglish: 'F' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Electrostatic force in a dielectric medium is F_med = F_vacuum / K = F / 80.',
            hi: 'परावैद्युत माध्यम में स्थिरवैद्युत बल F_med = F / K = F / 80 होता है।',
            hinglish: 'Medium me force F/K ho jata hai, isliye F/80.',
          },
        },
      },
      {
        id: 'c12_concept_gauss_law',
        title: {
          en: 'Gauss’s Theorem & High-Yield Applications',
          hi: 'गॉस की प्रमेय एवं प्रमुख अनुप्रयोग',
          hinglish: 'Gauss’s Law (∮ E·dA = Q / ε₀)',
        },
        summary: {
          en: 'The total electric flux through any closed Gaussian surface equals 1/ε₀ times the total enclosed charge: Φ = ∮ E·dA = Q_enclosed / ε₀. Electric field of infinite wire is E = λ / (2πε₀r).',
          hi: 'किसी बंद गॉसियन पृष्ठ से गुजरने वाला कुल वैद्युत फ्लक्स उस पृष्ठ द्वारा परिबद्ध कुल आवेश का 1/ε₀ गुना होता है: Φ = Q / ε₀।',
          hinglish: 'Closed surface se total flux = Q_enclosed / ε₀. Infinite line wire ke liye E = λ / (2πε₀r).',
        },
        formula: '\\Phi = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{\\text{enclosed}}}{\\varepsilon_0} \\quad \\text{and} \\quad E = \\frac{\\lambda}{2\\pi \\varepsilon_0 r}',
        keyPoints: [
          {
            en: 'Electric flux is independent of the size and shape of the Gaussian surface.',
            hi: 'वैद्युत फ्लक्स गॉसियन पृष्ठ के आकार व आकृति पर निर्भर नहीं करता।',
            hinglish: 'Flux Gaussian surface ke shape aur size par depend nahi karta.',
          },
        ],
        difficulty: 'hard',
        checkpointQuestion: {
          prompt: {
            en: 'A point charge q is placed at the center of a cube of edge length a. What is the electric flux emerging through ONE face of the cube?',
            hi: 'एक बिंदु आवेश q भुजा a वाले घन के केंद्र पर रखा है। घन के किसी एक फलक से गुजरने वाला वैद्युत फ्लक्स क्या होगा?',
            hinglish: 'Cube ke center par charge q hai. Cube ke ONE face se kitna flux niklega?',
          },
          options: [
            { en: 'q / (6 ε₀)', hi: 'q / (6 ε₀)', hinglish: 'q / (6 ε₀)' },
            { en: 'q / ε₀', hi: 'q / ε₀', hinglish: 'q / ε₀' },
            { en: 'q / (8 ε₀)', hi: 'q / (8 ε₀)', hinglish: 'q / (8 ε₀)' },
            { en: 'q / (24 ε₀)', hi: 'q / (24 ε₀)', hinglish: 'q / (24 ε₀)' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'By Gauss’s Law, total flux through all 6 identical symmetrical faces of the cube is q / ε₀. Hence through one single face: Φ_face = (1/6) · (q / ε₀).',
            hi: 'गॉस की प्रमेय से घन के सभी 6 फलकों से कुल फ्लक्स q/ε₀ है। अतः 1 फलक से: q / (6 ε₀)।',
            hinglish: 'Cube ke 6 faces hote hain, symmetry se har face se (1/6) * (q/ε₀) flux pass hoga.',
          },
        },
      },
    ],
  },
  {
    id: 'c12_phy_ch2_capacitance',
    subjectId: 'class12_physics',
    chapterNo: 2,
    title: {
      en: 'Electrostatic Potential & Capacitance',
      hi: 'स्थिरवैद्युत विभव तथा धारिता',
      hinglish: 'Potential & Capacitance',
    },
    description: {
      en: 'Electric potential due to dipole, equipotential surfaces, parallel plate capacitor with dielectric slab, and energy stored U = 1/2 CV².',
      hi: 'बिंदु आवेश व द्विध्रुव के कारण विभव, समविभव पृष्ठ, समांतर पट्टिका संधारित्र तथा परावैद्युत पट्टिका का प्रभाव, संचित ऊर्जा U = 1/2 CV²।',
      hinglish: 'Capacitance C = ε₀A/d, Dielectric effect C’ = KC, aur Energy U = 1/2 CV².',
    },
    targetMastery: 90,
    highYieldWeightage: 9,
    textbookRef: 'NCERT Physics Class 12 Part 1 Ch 2, Pages 53-92',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_capacitance_dielectric',
        title: {
          en: 'Parallel Plate Capacitor & Dielectrics',
          hi: 'समांतर पट्टिका संधारित्र एवं परावैद्युत का प्रभाव',
          hinglish: 'Capacitance with Dielectric Slab',
        },
        summary: {
          en: 'Capacitance of a parallel plate capacitor in vacuum is C₀ = ε₀A / d. When filled completely with dielectric of constant K, capacitance increases to C = K C₀. Energy stored is U = (1/2) C V² = Q² / (2C).',
          hi: 'समांतर पट्टिका संधारित्र की धारिता C₀ = ε₀A / d होती है। परावैद्युतांक K भरने पर धारिता C = K C₀ हो जाती है। संचित ऊर्जा U = (1/2) C V² होती है।',
          hinglish: 'C = ε₀A/d. Dielectric K fill karne par capacitance C’ = K C₀ ho jati hai. Energy U = 1/2 CV².',
        },
        formula: 'C = \\frac{K \\varepsilon_0 A}{d} \\quad \\text{and} \\quad U = \\frac{1}{2} C V^2 = \\frac{Q^2}{2C}',
        keyPoints: [
          {
            en: 'If disconnected from battery, charge Q remains constant; potential difference drops (V’ = V/K) and energy drops (U’ = U/K).',
            hi: 'बैटरी हटाने के पश्चात आवेश Q नियत रहता है, विभवांतर V/K तथा संचित ऊर्जा U/K हो जाती है।',
            hinglish: 'Battery disconnected hone par Q constant rehta hai, V aur U decrease hote hain.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'A parallel plate capacitor is charged and then disconnected from the battery. If the distance between plates is doubled, what happens to the stored energy?',
            hi: 'एक समांतर पट्टिका संधारित्र को आवेशित कर बैटरी से अलग कर दिया जाता है। यदि प्लेटों के बीच की दूरी दोगुनी कर दी जाए, तो संचित ऊर्जा में क्या परिवर्तन होगा?',
            hinglish: 'Capacitor ko charge karke battery hata di gayi. Plate distance double karne par stored energy kya hogi?',
          },
          options: [
            { en: 'Energy is doubled (2U)', hi: 'ऊर्जा दोगुनी हो जाएगी (2U)', hinglish: 'Energy 2 times badh jayegi (2U)' },
            { en: 'Energy is halved (U/2)', hi: 'ऊर्जा आधी रह जाएगी (U/2)', hinglish: 'Energy aadhi ho jayegi (U/2)' },
            { en: 'Energy remains unchanged (U)', hi: 'ऊर्जा अपरिवर्तित रहेगी (U)', hinglish: 'Energy same rahegi (U)' },
            { en: 'Energy becomes four times (4U)', hi: 'ऊर्जा चार गुनी हो जाएगी (4U)', hinglish: 'Energy 4 times ho jayegi' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'With battery disconnected, charge Q is constant. When distance d is doubled, capacitance C = ε₀A/d is halved (C’ = C/2). Stored energy U = Q² / (2C’) = Q² / (2 · C/2) = 2 · [Q² / 2C] = 2U.',
            hi: 'बैटरी हटने पर Q नियत रहता है। दूरी दोगुनी करने पर धारिता आधी (C/2) हो जाती है। अतः ऊर्जा U’ = Q²/(2C’) = 2U हो जाएगी।',
            hinglish: 'Q constant hai. d double hua so C half hua. Formula U = Q²/(2C) use karein toh C half hone par U double ho jayega.',
          },
        },
      },
    ],
  },
  {
    id: 'c12_phy_ch3_current_electricity',
    subjectId: 'class12_physics',
    chapterNo: 3,
    title: {
      en: 'Current Electricity & Kirchhoff’s Laws',
      hi: 'विद्युत धारा एवं किरचॉफ के नियम',
      hinglish: 'Current Electricity & Kirchhoff’s Laws',
    },
    description: {
      en: 'Drift velocity vd = eEτ/m, internal resistance of cells, Kirchhoff’s junction and loop rules, and Wheatstone bridge balancing condition P/Q = R/S.',
      hi: 'अपवाह वेग vd = eEτ/m, सेलों का आंतरिक प्रतिरोध एवं संयोजन, किरचॉफ का संधि व पाश नियम, तथा व्हीटस्टोन सेतु संतुलन शर्त P/Q = R/S।',
      hinglish: 'Drift velocity vd, Kirchhoff junction/loop rule aur Wheatstone bridge.',
    },
    targetMastery: 90,
    highYieldWeightage: 9,
    textbookRef: 'NCERT Physics Class 12 Part 1 Ch 3, Pages 93-134',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_kirchhoffs_laws',
        title: {
          en: 'Kirchhoff’s Laws & Wheatstone Bridge',
          hi: 'किरचॉफ के नियम एवं व्हीटस्टोन सेतु',
          hinglish: 'Kirchhoff’s Current & Voltage Rules',
        },
        summary: {
          en: 'First Law (KCL): Algebraic sum of currents at a junction is zero (Σ I = 0, based on charge conservation). Second Law (KVL): Algebraic sum of emf and potential drops in a closed loop is zero (Σ IR = Σ E, energy conservation).',
          hi: 'प्रथम नियम (KCL): संधि पर मिलने वाली समस्त धाराओं का बीजगणितीय योग शून्य होता है (आवेश संरक्षण)। द्वितीय नियम (KVL): बंद पाश में विभवांतरों का योग शून्य होता है (ऊर्जा संरक्षण)।',
          hinglish: 'Junction Rule (KCL): Σ I = 0 (charge conservation). Loop Rule (KVL): Σ IR = Σ E (energy conservation).',
        },
        formula: '\\sum I = 0 \\quad \\text{(KCL)} \\qquad \\sum I R = \\sum \\mathcal{E} \\quad \\text{(KVL)} \\qquad \\frac{P}{Q} = \\frac{R}{S}',
        keyPoints: [
          {
            en: 'Balanced Wheatstone bridge condition: No current flows through galvanometer when P / Q = R / S.',
            hi: 'संतुलित व्हीटस्टोन सेतु में जब P/Q = R/S हो, तो धारामापी से कोई धारा प्रवाहित नहीं होती।',
            hinglish: 'P/Q = R/S hone par galvanometer me zero deflection hoti hai.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Kirchhoff’s First and Second laws are based on the conservation of which quantities respectively?',
            hi: 'किरचॉफ का प्रथम एवं द्वितीय नियम क्रमशः किन भौतिक राशियों के संरक्षण पर आधारित हैं?',
            hinglish: 'Kirchhoff ka 1st aur 2nd rule kiske conservation par based hain?',
          },
          options: [
            { en: 'Charge and Energy', hi: 'आवेश एवं ऊर्जा', hinglish: 'Charge and Energy' },
            { en: 'Energy and Charge', hi: 'ऊर्जा एवं आवेश', hinglish: 'Energy and Charge' },
            { en: 'Momentum and Charge', hi: 'संवेग एवं आवेश', hinglish: 'Momentum and Charge' },
            { en: 'Mass and Energy', hi: 'द्रव्यमान एवं ऊर्जा', hinglish: 'Mass and Energy' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Kirchhoff’s Junction rule (KCL) is based on the Law of Conservation of Charge. The Loop rule (KVL) is based on the Law of Conservation of Energy.',
            hi: 'प्रथम नियम (संधि नियम) आवेश संरक्षण पर तथा द्वितीय नियम (पाश नियम) ऊर्जा संरक्षण पर आधारित है।',
            hinglish: '1st rule = Conservation of Charge, 2nd rule = Conservation of Energy.',
          },
        },
      },
    ],
  },
];

export const CLASS_12_CHEMISTRY_CHAPTERS: Chapter[] = [
  {
    id: 'c12_chem_ch1_solutions',
    subjectId: 'class12_chemistry',
    chapterNo: 1,
    title: {
      en: 'Solutions & Colligative Properties',
      hi: 'विलयन एवं अणुसंख्य गुणधर्म',
      hinglish: 'Solutions & Colligative Properties',
    },
    description: {
      en: 'Raoult’s law for volatile solutes, ideal and non-ideal solutions, colligative properties (ΔTb, ΔTf, Π), and van ‘t Hoff factor i for abnormal molar mass.',
      hi: 'राउल्ट का नियम, आदर्श व अनादर्श विलयन, अणुसंख्य गुणधर्म (क्वथनांक उन्नयन, हिमांक अवनमन, परासरण दाब) तथा वांट हॉफ गुणक i।',
      hinglish: 'Raoult’s law, elevation in boiling point, depression in freezing point aur Van ‘t Hoff factor.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Chemistry Class 12 Part 1 Ch 1, Pages 1-32',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_raoults_colligative',
        title: {
          en: 'Colligative Properties & Van ‘t Hoff Factor',
          hi: 'अणुसंख्य गुणधर्म एवं वांट हॉफ गुणक (i)',
          hinglish: 'Colligative Properties & Van ‘t Hoff Factor (i)',
        },
        summary: {
          en: 'Properties depending only on the number of solute particles, not their nature: ΔTb = i·Kb·m, ΔTf = i·Kf·m, and osmotic pressure Π = i·C·R·T. For dissociation i > 1, for association i < 1.',
          hi: 'वे गुणधर्म जो विलेय के कणों की संख्या पर निर्भर करते हैं: ΔTb = i·Kb·m, ΔTf = i·Kf·m तथा परासरण दाब Π = i·CRT। वियोजन हेतु i > 1, संयोजन हेतु i < 1।',
          hinglish: 'Colligative properties number of particles par depend karti hain. Dissociation me i > 1, Association me i < 1.',
        },
        formula: '\\Delta T_b = i K_b m \\quad \\Delta T_f = i K_f m \\quad \\Pi = i C R T \\quad i = 1 + (n - 1)\\alpha',
        keyPoints: [
          {
            en: 'For NaCl (n=2), i ≈ 2; for BaCl₂ (n=3), i ≈ 3. Higher particle count produces greater depression in freezing point.',
            hi: 'NaCl हेतु i ≈ 2, BaCl₂ हेतु i ≈ 3। कणों की संख्या अधिक होने पर हिमांक में अधिक अवनमन होता है।',
            hinglish: 'BaCl₂ me 3 ions bante hain isliye iska colligative effect NaCl se zyada hota hai.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Which of the following 0.1 M aqueous solutions will exhibit the lowest freezing point?',
            hi: 'निम्नलिखित में से किस 0.1 M जलीय विलयन का हिमांक न्यूनतम होगा?',
            hinglish: 'Inme se kis 0.1 M solution ka freezing point lowest hoga?',
          },
          options: [
            { en: '0.1 M Al₂(SO₄)₃ (i ≈ 5)', hi: '0.1 M Al₂(SO₄)₃ (i ≈ 5)', hinglish: '0.1 M Al₂(SO₄)₃ (i ≈ 5)' },
            { en: '0.1 M BaCl₂ (i ≈ 3)', hi: '0.1 M BaCl₂ (i ≈ 3)', hinglish: '0.1 M BaCl₂ (i ≈ 3)' },
            { en: '0.1 M NaCl (i ≈ 2)', hi: '0.1 M NaCl (i ≈ 2)', hinglish: '0.1 M NaCl (i ≈ 2)' },
            { en: '0.1 M Glucose (i = 1)', hi: '0.1 M ग्लूकोस (i = 1)', hinglish: '0.1 M Glucose (i = 1)' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Depression in freezing point ΔTf = i·Kf·m. For Al₂(SO₄)₃, it dissociates into 2 Al³⁺ and 3 SO₄²⁻ ions (n = 5), producing the maximum depression and thus the lowest actual freezing point.',
            hi: 'Al₂(SO₄)₃ में 5 आयन बनते हैं (i ≈ 5), अतः हिमांक में अवनमन सर्वाधिक होगा जिससे विलयन का हिमांक सबसे कम होगा।',
            hinglish: 'Al₂(SO₄)₃ me total 5 ions bante hain, so maximum ΔTf hoga matlab freezing point sabse kam ho jayega.',
          },
        },
      },
    ],
  },
  {
    id: 'c12_chem_ch2_electrochem',
    subjectId: 'class12_chemistry',
    chapterNo: 2,
    title: {
      en: 'Electrochemistry & Nernst Equation',
      hi: 'वैद्युतरसायन एवं नेर्नस्ट समीकरण',
      hinglish: 'Electrochemistry & Nernst Equation',
    },
    description: {
      en: 'Standard electrode potential, Nernst equation for cell EMF, Kohlrausch’s law, Faraday’s laws of electrolysis, and fuel cells.',
      hi: 'मानक इलेक्ट्रोड विभव, सेल विभव हेतु नेर्नस्ट समीकरण, कोलराउश का स्वतंत्र अभिगमन नियम, तथा फैराडे के वैद्युत अपघटन नियम।',
      hinglish: 'Nernst equation E = E° - (0.0591/n) log Q, Kohlrausch’s law aur Faraday’s laws.',
    },
    targetMastery: 90,
    highYieldWeightage: 9,
    textbookRef: 'NCERT Chemistry Class 12 Part 1 Ch 2, Pages 33-66',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_nernst_equation',
        title: {
          en: 'Nernst Equation for Electrode & Cell EMF',
          hi: 'इलेक्ट्रोड एवं सेल विभव हेतु नेर्नस्ट समीकरण',
          hinglish: 'Nernst Equation at 298 K',
        },
        summary: {
          en: 'Nernst equation calculates cell EMF at non-standard ion concentrations: E_cell = E°_cell - (2.303 RT / nF) log Q. At 298 K, this simplifies to E_cell = E°_cell - (0.0591 / n) log Q.',
          hi: 'नेर्नस्ट समीकरण किसी भी सांद्रता पर सेल विभव ज्ञात करने हेतु प्रयुक्त होता है: 298 K पर E_cell = E°_cell - (0.0591 / n) log Q।',
          hinglish: '298 K par E_cell = E°_cell - (0.0591 / n) log ([Anode]/[Cathode]).',
        },
        formula: 'E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log_{10} Q \\quad \\text{at 298 K}',
        keyPoints: [
          {
            en: 'At equilibrium, E_cell = 0 and Q = Kc. Thus: E°_cell = (0.0591 / n) log Kc.',
            hi: 'साम्यावस्था पर E_cell = 0 तथा Q = Kc होता है, अतः E°_cell = (0.0591 / n) log Kc।',
            hinglish: 'Equilibrium par E_cell = 0 hota hai, jisse equilibrium constant Kc calculate hota hai.',
          },
        ],
        difficulty: 'hard',
        checkpointQuestion: {
          prompt: {
            en: 'For Daniell cell: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s) with E° = 1.10 V. If [Zn²⁺] = 0.1 M and [Cu²⁺] = 0.01 M, what is the EMF of the cell at 298 K?',
            hi: 'डेनियल सेल हेतु: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s) जिसका E° = 1.10 V है। यदि [Zn²⁺] = 0.1 M तथा [Cu²⁺] = 0.01 M हो, तो 298 K पर सेल का EMF क्या होगा?',
            hinglish: 'Daniell cell ka E° = 1.10 V. [Zn²⁺]=0.1M aur [Cu²⁺]=0.01M par E_cell kitna hoga?',
          },
          options: [
            { en: '1.07 V', hi: '1.07 V', hinglish: '1.07 V' },
            { en: '1.13 V', hi: '1.13 V', hinglish: '1.13 V' },
            { en: '1.10 V', hi: '1.10 V', hinglish: '1.10 V' },
            { en: '0.98 V', hi: '0.98 V', hinglish: '0.98 V' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Here n = 2. Q = [Zn²⁺]/[Cu²⁺] = 0.1 / 0.01 = 10. E_cell = 1.10 - (0.0591 / 2) log(10) = 1.10 - 0.0295(1) = 1.0705 V ≈ 1.07 V.',
            hi: 'n = 2, Q = 0.1/0.01 = 10। E_cell = 1.10 - (0.0591/2)·1 = 1.10 - 0.0295 = 1.07 V।',
            hinglish: 'E = 1.10 - (0.0591/2)*log(10) = 1.10 - 0.0295 = 1.07 V.',
          },
        },
      },
    ],
  },
];

export const CLASS_12_MATH_CHAPTERS: Chapter[] = [
  {
    id: 'c12_math_ch1_matrices',
    subjectId: 'class12_math',
    chapterNo: 1,
    title: {
      en: 'Matrices and Determinants',
      hi: 'आव्यूह एवं सारणिक',
      hinglish: 'Matrices & Determinants',
    },
    description: {
      en: 'Matrix multiplication properties, symmetric and skew-symmetric matrices, adjoint and inverse of matrix A⁻¹ = adj(A)/|A|, and solving system of linear equations using matrix method.',
      hi: 'आव्यूह गुणन, सममित व विषम सममित आव्यूह, सहखंडज तथा व्युत्क्रम A⁻¹ = adj(A)/|A|, तथा आव्यूह विधि से रैखिक समीकरण निकाय का हल।',
      hinglish: 'Matrix inverse A⁻¹ = adj(A)/|A| aur Cramer’s rule / matrix method.',
    },
    targetMastery: 90,
    highYieldWeightage: 10,
    textbookRef: 'NCERT Mathematics Class 12 Part 1 Ch 3 & 4, Pages 58-140',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_matrix_inverse',
        title: {
          en: 'Adjoint & Inverse of Square Matrix',
          hi: 'वर्ग आव्यूह का सहखंडज एवं व्युत्क्रम',
          hinglish: 'Matrix Invertibility & Inverse Formula',
        },
        summary: {
          en: 'A square matrix A is invertible if and only if it is non-singular (|A| ≠ 0). The inverse is given by A⁻¹ = (1 / |A|) · adj(A), satisfying A · A⁻¹ = A⁻¹ · A = I.',
          hi: 'कोई वर्ग आव्यूह A व्युत्क्रमणीय होता है यदि और केवल यदि वह अव्युत्क्रमणीय न हो (|A| ≠ 0)। इसका व्युत्क्रम A⁻¹ = adj(A) / |A| होता है।',
          hinglish: 'Square matrix invertible tabhi hoti hai jab |A| ≠ 0. Inverse formula: A⁻¹ = adj(A) / |A|.',
        },
        formula: 'A^{-1} = \\frac{1}{|A|} \\operatorname{adj}(A) \\quad (|A| \\neq 0) \\qquad A \\cdot \\operatorname{adj}(A) = |A| \\, I_n',
        keyPoints: [
          {
            en: 'For order n: |adj(A)| = |A|ⁿ⁻¹ and |A · adj(A)| = |A|ⁿ.',
            hi: 'कोटि n के लिए: |adj(A)| = |A|ⁿ⁻¹ होता है।',
            hinglish: 'Formula: |adj(A)| = |A|ⁿ⁻¹.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'If A is a 3 × 3 non-singular matrix with |A| = 4, what is the value of |adj(A)|?',
            hi: 'यदि A कोटि 3 × 3 का एक वर्ग आव्यूह है जिसका सारणिक |A| = 4 है, तो |adj(A)| का मान क्या होगा?',
            hinglish: 'Agar A 3x3 matrix hai with |A| = 4, toh |adj(A)| kitna hoga?',
          },
          options: [
            { en: '16', hi: '16', hinglish: '16' },
            { en: '4', hi: '4', hinglish: '4' },
            { en: '64', hi: '64', hinglish: '64' },
            { en: '12', hi: '12', hinglish: '12' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'For an n × n matrix, |adj(A)| = |A|ⁿ⁻¹. Here n = 3 and |A| = 4, so |adj(A)| = 4³⁻¹ = 4² = 16.',
            hi: 'सूत्र |adj(A)| = |A|ⁿ⁻¹ से: |adj(A)| = 4³⁻¹ = 4² = 16।',
            hinglish: '|adj(A)| = |A|^(n-1) = 4^(3-1) = 4² = 16.',
          },
        },
      },
    ],
  },
  {
    id: 'c12_math_ch3_integrals',
    subjectId: 'class12_math',
    chapterNo: 3,
    title: {
      en: 'Integrals & Definite Integration',
      hi: 'समाकलन एवं निश्चित समाकलन',
      hinglish: 'Integrals & Definite Integration',
    },
    description: {
      en: 'Integration by substitution, partial fractions, integration by parts ∫ u v dx, and properties of definite integrals ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a - x)dx.',
      hi: 'प्रतिस्थापन, आंशिक भिन्न, खंडशः समाकलन, तथा निश्चित समाकलन के प्रगुण (जैसे ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a - x)dx)।',
      hinglish: 'Integration by parts, partial fractions aur definite integral properties.',
    },
    targetMastery: 90,
    highYieldWeightage: 12,
    textbookRef: 'NCERT Mathematics Class 12 Part 2 Ch 7, Pages 288-360',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_integration_by_parts',
        title: {
          en: 'Integration by Parts (ILATE Rule)',
          hi: 'खंडशः समाकलन (ILATE नियम)',
          hinglish: 'Integration by Parts (ILATE Rule)',
        },
        summary: {
          en: 'For product of two functions: ∫ u·v dx = u ∫ v dx - ∫ [u’ · (∫ v dx)] dx. The first function u is chosen according to ILATE priority: Inverse trigonometric, Logarithmic, Algebraic, Trigonometric, Exponential.',
          hi: 'दो फलनों के गुणनफल का समाकलन: ∫ u·v dx = u ∫ v dx - ∫ [u’ · (∫ v dx)] dx। फलन u का चयन ILATE नियम के आधार पर किया जाता है।',
          hinglish: 'Product of functions ke liye ∫ u v dx = u ∫ v dx - ∫ (u’ ∫ v dx) dx. First function ILATE order se chunein.',
        },
        formula: '\\int u v \\, dx = u \\int v \\, dx - \\int \\left( \\frac{du}{dx} \\int v \\, dx \\right) dx',
        keyPoints: [
          {
            en: 'Special standard board integral: ∫ eˣ [f(x) + f’(x)] dx = eˣ f(x) + C.',
            hi: 'मानक बोर्ड सूत्र: ∫ eˣ [f(x) + f’(x)] dx = eˣ f(x) + C।',
            hinglish: '∫ eˣ [f(x) + f’(x)] dx = eˣ f(x) + C direct exam question hai.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Evaluate the integral: ∫ x · eˣ dx',
            hi: 'समाकलन का मान ज्ञात कीजिए: ∫ x · eˣ dx',
            hinglish: '∫ x · eˣ dx evaluate karein:',
          },
          options: [
            { en: 'eˣ (x - 1) + C', hi: 'eˣ (x - 1) + C', hinglish: 'eˣ (x - 1) + C' },
            { en: 'eˣ (x + 1) + C', hi: 'eˣ (x + 1) + C', hinglish: 'eˣ (x + 1) + C' },
            { en: 'x eˣ + C', hi: 'x eˣ + C', hinglish: 'x eˣ + C' },
            { en: '(x²/2) eˣ + C', hi: '(x²/2) eˣ + C', hinglish: '(x²/2) eˣ + C' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'By ILATE, take u = x (Algebraic) and v = eˣ (Exponential). ∫ x eˣ dx = x ∫ eˣ dx - ∫ [1 · eˣ] dx = x eˣ - eˣ + C = eˣ (x - 1) + C.',
            hi: 'u = x तथा v = eˣ लेने पर: x eˣ - ∫ eˣ dx = x eˣ - eˣ + C = eˣ (x - 1) + C।',
            hinglish: 'u = x, v = eˣ. ∫ x eˣ dx = x eˣ - eˣ + C = eˣ (x - 1) + C.',
          },
        },
      },
    ],
  },
];

// ============================================================================
// 3. DYNAMIC CURRICULUM RESOLVER FOR BOARD AND CLASS
// ============================================================================

export interface BoardCurriculumInfo {
  board: EducationBoard;
  classLevel: string;
  boardFullName: string;
  boardNativeName: string;
  textbookStandard: string;
  syllabusEdition: string;
  examPatternSummary: string;
}

export function getBoardCurriculumInfo(
  board: EducationBoard = 'CBSE',
  classLevel: string = '10'
): BoardCurriculumInfo {
  const normClass = classLevel === '12' ? '12' : '10';

  switch (board) {
    case 'UP_BOARD':
      return {
        board: 'UP_BOARD',
        classLevel: normClass,
        boardFullName: 'UPMSP — Uttar Pradesh Madhyamik Shiksha Parishad (Prayagraj)',
        boardNativeName: 'उत्तर प्रदेश माध्यमिक शिक्षा परिषद (प्रयागराज)',
        textbookStandard: normClass === '10' 
          ? 'UPMSP कक्षा 10 विज्ञान एवं गणित (NCERT/SCERT अधिकृत)'
          : 'UPMSP कक्षा 12 भौतिक विज्ञान, रसायन एवं गणित (अधिकृत पाठ्यक्रम)',
        syllabusEdition: '2025-2026 Session (OMR 20 MCQs + Section B Proofs)',
        examPatternSummary: '20 OMR MCQs (Part A) + 50 Marks Descriptive Solutions & Proofs (Part B)',
      };

    case 'ICSE_ISC':
      return {
        board: 'ICSE_ISC',
        classLevel: normClass,
        boardFullName: normClass === '10' ? 'CISCE — ICSE Class 10' : 'CISCE — ISC Class 12',
        boardNativeName: 'Council for the Indian School Certificate Examinations',
        textbookStandard: normClass === '10'
          ? 'Selina Concise Physics, Chemistry, Biology & Frank Maths'
          : 'Nootan ISC Physics, Chemistry & ML Aggarwal ISC Mathematics',
        syllabusEdition: 'CISCE Detailed Examination Specifications 2026',
        examPatternSummary: 'Application-focused proofs, conceptual derivations, and lab experiments',
      };

    case 'BIHAR_BOARD':
      return {
        board: 'BIHAR_BOARD',
        classLevel: normClass,
        boardFullName: 'BSEB — Bihar School Examination Board (Patna)',
        boardNativeName: 'बिहार विद्यालय परीक्षा समिति (पटना)',
        textbookStandard: normClass === '10'
          ? 'BSEB मैट्रिक परीक्षा पाठ्यपुस्तक (BSTBPC / NCERT)'
          : 'BSEB इंटरमीडिएट परीक्षा पाठ्यपुस्तक (BSTBPC / NCERT)',
        syllabusEdition: 'BSEB 2026 50% Objective MCQ OMR Pattern',
        examPatternSummary: '50% Objective Multiple Choice Questions with 100% choices available',
      };

    case 'MAHARASHTRA_STATE':
      return {
        board: 'MAHARASHTRA_STATE',
        classLevel: normClass,
        boardFullName: normClass === '10' ? 'MSBSHSE SSC Board (Pune)' : 'MSBSHSE HSC Board (Pune)',
        boardNativeName: 'महाराष्ट्र राज्य माध्यमिक व उच्च माध्यमिक शिक्षण मंडळ',
        textbookStandard: 'Balbharati Official Maharashtra State Board Textbooks',
        syllabusEdition: 'State Board Competency Pattern 2025-26',
        examPatternSummary: 'Activity sheets, diagram labels, and stepwise numerical evaluations',
      };

    case 'STATE_BOARD_RAJASTHAN':
      return {
        board: 'STATE_BOARD_RAJASTHAN',
        classLevel: normClass,
        boardFullName: 'RBSE — Rajasthan Board of Secondary Education (Ajmer)',
        boardNativeName: 'माध्यमिक शिक्षा बोर्ड राजस्थान (अजमेर)',
        textbookStandard: 'RBSE / SCERT Rajasthan Textbooks & NCERT Alignment',
        syllabusEdition: 'RBSE 2025-26 Session Guidelines',
        examPatternSummary: 'Knowledge, Understanding, Application & Skill-based division',
      };

    case 'STATE_BOARD_MP':
      return {
        board: 'STATE_BOARD_MP',
        classLevel: normClass,
        boardFullName: 'MPBSE — Madhya Pradesh Board of Secondary Education (Bhopal)',
        boardNativeName: 'माध्यमिक शिक्षा मण्डल, मध्य प्रदेश (भोपाल)',
        textbookStandard: 'MPBSE / SCERT MP State Textbooks (NCERT)',
        syllabusEdition: 'MPBSE High School / Higher Secondary 2025-26',
        examPatternSummary: '30 Marks Objective questions + 50 Marks Subjective derivations',
      };

    case 'CBSE':
    default:
      return {
        board: 'CBSE',
        classLevel: normClass,
        boardFullName: 'CBSE — Central Board of Secondary Education (New Delhi)',
        boardNativeName: 'केन्द्रीय माध्यमिक शिक्षा बोर्ड (नई दिल्ली)',
        textbookStandard: normClass === '10'
          ? 'NCERT Science & Mathematics Class 10 (Official Textbook & Exemplar)'
          : 'NCERT Physics, Chemistry & Mathematics Class 12 (Vols 1 & 2)',
        syllabusEdition: 'CBSE 2025-2026 Official Curriculum & Sample Papers',
        examPatternSummary: '50% Competency-Based, Case-Study, Assertion-Reason & High-Yield Derivations',
      };
  }
}

/**
 * Returns subjects and chapters mapped dynamically to the chosen board and class.
 * Ensures the student sees exact curriculum subjects and chapters for their selected class & board.
 */
export function getCurriculumForBoardAndClass(
  board: EducationBoard = 'CBSE',
  classLevel: string = '10',
  preferredLanguage: LanguageCode = 'hi',
  goalCategory: GoalCategory = 'school_board'
): Subject[] {
  const normClass = classLevel === '12' ? '12' : '10';
  const boardInfo = getBoardCurriculumInfo(board, normClass);

  if (normClass === '12') {
    // CLASS 12 SUBJECTS
    const physicsExam: ExamCategory = board === 'UP_BOARD' ? 'UP_BOARD_12' : 'CBSE_12';

    return [
      {
        id: 'c12_sub_physics',
        name: {
          en: `Physics (Class 12 — ${boardInfo.board})`,
          hi: `भौतिक विज्ञान (कक्षा 12 — ${boardInfo.boardNativeName})`,
          hinglish: `Physics Class 12 (${boardInfo.board})`,
          bn: `পদার্থবিজ্ঞান (দ্বাদশ শ্রেণি — ${boardInfo.board})`,
          mr: `भौतिकशास्त्र (इयत्ता १२ वी — ${boardInfo.board})`,
        },
        icon: 'Atom',
        color: 'blue',
        exam: physicsExam,
        board,
        classLevel: '12',
        textbookStandard: boardInfo.textbookStandard,
        chapters: CLASS_12_PHYSICS_ALL_CHAPTERS.map((ch) => ({
          ...ch,
          board,
          classLevel: '12',
        })),
      },
      {
        id: 'c12_sub_chemistry',
        name: {
          en: `Chemistry (Class 12 — ${boardInfo.board})`,
          hi: `रसायन विज्ञान (कक्षा 12 — ${boardInfo.boardNativeName})`,
          hinglish: `Chemistry Class 12 (${boardInfo.board})`,
          bn: `রসায়ন (দ্বাদশ শ্রেণি — ${boardInfo.board})`,
          mr: `रसायनशास्त्र (इयत्ता १२ वी — ${boardInfo.board})`,
        },
        icon: 'FlaskConical',
        color: 'emerald',
        exam: physicsExam,
        board,
        classLevel: '12',
        textbookStandard: boardInfo.textbookStandard,
        chapters: CLASS_12_CHEMISTRY_ALL_CHAPTERS.map((ch) => ({
          ...ch,
          board,
          classLevel: '12',
        })),
      },
      {
        id: 'c12_sub_math',
        name: {
          en: `Mathematics (Class 12 — ${boardInfo.board})`,
          hi: `गणित (कक्षा 12 — ${boardInfo.boardNativeName})`,
          hinglish: `Mathematics Class 12 (${boardInfo.board})`,
          bn: `গণিত (দ্বাদশ শ্রেণি — ${boardInfo.board})`,
          mr: `गणित (इयत्ता १२ वी — ${boardInfo.board})`,
        },
        icon: 'Calculator',
        color: 'amber',
        exam: physicsExam,
        board,
        classLevel: '12',
        textbookStandard: boardInfo.textbookStandard,
        chapters: CLASS_12_MATH_ALL_CHAPTERS.map((ch) => ({
          ...ch,
          board,
          classLevel: '12',
        })),
      },
    ];
  }

  // CLASS 10 SUBJECTS (Default)
  const class10Exam: ExamCategory = board === 'UP_BOARD' ? 'UP_BOARD_10' : 'CBSE_10';

  return [
    {
      id: 'c10_sub_science',
      name: {
        en: `Science (Class 10 — ${boardInfo.board})`,
        hi: `विज्ञान (कक्षा 10 — ${boardInfo.boardNativeName})`,
        hinglish: `Science Class 10 (${boardInfo.board})`,
        bn: `বিজ্ঞান (দশম শ্রেণি — ${boardInfo.board})`,
        mr: `विज्ञान (इयत्ता १० वी — ${boardInfo.board})`,
      },
      icon: 'Atom',
      color: 'amber',
      exam: class10Exam,
      board,
      classLevel: '10',
      textbookStandard: boardInfo.textbookStandard,
      chapters: CLASS_10_SCIENCE_ALL_CHAPTERS.map((ch) => ({
        ...ch,
        board,
        classLevel: '10',
      })),
    },
    {
      id: 'c10_sub_math',
      name: {
        en: `Mathematics (Class 10 — ${boardInfo.board})`,
        hi: `गणित (कक्षा 10 — ${boardInfo.boardNativeName})`,
        hinglish: `Mathematics Class 10 (${boardInfo.board})`,
        bn: `গণিত (দশম শ্রেণি — ${boardInfo.board})`,
        mr: `गणित (इयत्ता १० वी — ${boardInfo.board})`,
      },
      icon: 'Calculator',
      color: 'emerald',
      exam: class10Exam,
      board,
      classLevel: '10',
      textbookStandard: boardInfo.textbookStandard,
      chapters: CLASS_10_MATH_ALL_CHAPTERS.map((ch) => ({
        ...ch,
        board,
        classLevel: '10',
      })),
    },
  ];
}
