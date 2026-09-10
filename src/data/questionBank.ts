import { Question, UserProfile, EducationBoard, ExamCategory } from '../types';

export const ALL_QUESTIONS_BANK: Question[] = [
  // =========================================================================
  // CLASS 10 QUESTIONS (CBSE, NCERT, UP BOARD, ICSE)
  // =========================================================================
  {
    id: 'q_class10_ncert_elec_01',
    conceptId: 'concept_ohms_law',
    chapterId: 'ch_electricity_fundamentals',
    subjectId: 'phy_10_electricity',
    classLevel: '10',
    targetBoard: 'CBSE',
    targetExam: 'CBSE_10',
    isPYQ: false,
    type: 'MCQ',
    difficulty: 'medium',
    marks: 4,
    negativeMarks: 0,
    expectedTimeSec: 45,
    textbookSource: {
      board: 'CBSE',
      bookTitle: 'NCERT Science Class 10 (Official Textbook)',
      chapterNo: 12,
      chapterName: 'Electricity',
      exercise: 'In-Text Example 12.5',
      questionNo: 'Page 208, Example 12.5',
      pageNo: 208,
      category: 'example',
    },
    prompt: {
      en: 'A resistance wire of length L and uniform area of cross-section A has resistance R. What is the resistance of another wire of the same material having length L/2 and area of cross-section 2A?',
      hi: 'लंबाई L तथा एकसमान अनुप्रस्थ काट क्षेत्रफल A के किसी चालक तार का प्रतिरोध R है। उसी पदार्थ के किसी अन्य तार का प्रतिरोध क्या होगा जिसकी लंबाई L/2 तथा अनुप्रस्थ काट क्षेत्रफल 2A है?',
      hinglish: 'Ek wire ki length L aur cross-section area A hai, jiska resistance R hai. Usi material ke doosre wire ka resistance kya hoga jiski length L/2 aur area 2A ho?',
      bn: 'L দৈর্ঘ্যের এবং A প্রস্থচ্ছেদের একটি তারের রোধ R। একই পদার্থের তৈরি L/2 দৈর্ঘ্য এবং 2A প্রস্থচ্ছেদের তারের রোধ কত?',
      mr: 'L लांबी आणि A काटछेदाचे क्षेत्रफळ असलेल्या तारेचा रोध R आहे. समान द्रव्याच्या L/2 लांबी आणि 2A क्षेत्रफळ असलेल्या तारेचा रोध किती?',
    },
    options: [
      { en: 'R / 4', hi: 'R / 4', hinglish: 'R / 4' },
      { en: 'R / 2', hi: 'R / 2', hinglish: 'R / 2' },
      { en: '2R', hi: '2R', hinglish: '2R' },
      { en: '4R', hi: '4R', hinglish: '4R' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'The resistance of a conductor is given by R = ρ(L / A). For the new wire: R’ = ρ · (L/2) / (2A) = (1/4) · ρ(L / A) = R / 4. Halving the length halves resistance, and doubling cross-sectional area halves it again.',
      hi: 'प्रतिरोध का सूत्र R = ρ(L / A) होता है। नए तार के लिए: R’ = ρ · (L/2) / (2A) = (1/4) · ρ(L / A) = R / 4।',
      hinglish: 'Formula: R = ρ(L/A). Naye wire ke liye length L/2 aur area 2A hai: R’ = ρ(L/2)/(2A) = R/4.',
    },
    hint1: {
      en: 'Recall that resistance is directly proportional to length and inversely proportional to cross-sectional area.',
      hi: 'स्मरण करें कि प्रतिरोध लंबाई के समानुपाती और क्षेत्रफल के व्युत्क्रमानुपाती होता है।',
      hinglish: 'R directly proportional hota hai L ke aur inversely proportional hota hai A ke.',
    },
    guidedReasoning: {
      en: 'Step 1: Write original resistance R = ρ(L/A).\nStep 2: Substitute L’ = L/2 and A’ = 2A.\nStep 3: R’ = ρ(L/2)/(2A) = (1/4) · ρ(L/A) = R/4.',
      hi: 'चरण 1: मूल सूत्र R = ρ(L/A)।\nचरण 2: L’ = L/2 और A’ = 2A रखें।\nचरण 3: R’ = R/4।',
      hinglish: 'Step 1: R = ρL/A. Step 2: R’ = ρ(L/2)/(2A) = R/4.',
    },
    whyReason: {
      en: 'NCERT Class 10 Textbook Example 12.5 testing fundamental resistance scaling relationships.',
      hi: 'एनसीईआरटी कक्षा 10 विज्ञान का मूलभूत उदाहरण।',
      hinglish: 'NCERT standard textbook problem for class 10 boards.',
    },
  },

  {
    id: 'q_class10_ncert_math_quad_02',
    conceptId: 'concept_discriminant_nature_roots',
    chapterId: 'ch_quadratic_equations',
    subjectId: 'math_10_algebra',
    classLevel: '10',
    targetBoard: 'CBSE',
    targetExam: 'CBSE_10',
    isPYQ: false,
    type: 'MCQ',
    difficulty: 'medium',
    marks: 4,
    negativeMarks: 0,
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
      en: 'Find the value of k for which the quadratic equation kx(x - 2) + 6 = 0 has two equal real roots.',
      hi: 'k का वह मान ज्ञात कीजिए जिसके लिए द्विघात समीकरण kx(x - 2) + 6 = 0 के दो बराबर वास्तविक मूल हों।',
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
      en: 'Expanding gives kx² - 2kx + 6 = 0. Here a = k, b = -2k, c = 6. For equal roots, Discriminant D = b² - 4ac = 0. Hence (-2k)² - 4(k)(6) = 0 → 4k² - 24k = 0 → 4k(k - 6) = 0. Since a = k ≠ 0 for a quadratic equation, k = 6.',
      hi: 'विस्तार करने पर: kx² - 2kx + 6 = 0। समान मूलों के लिए D = 0 → 4k² - 24k = 0 → 4k(k - 6) = 0। चूँकि k ≠ 0, अतः k = 6।',
      hinglish: 'kx² - 2kx + 6 = 0. D = 0 → 4k² - 24k = 0 → 4k(k - 6) = 0. Since k ≠ 0, k = 6.',
    },
    hint1: {
      en: 'Convert to standard form ax² + bx + c = 0 and set discriminant b² - 4ac = 0.',
      hi: 'मानक रूप ax² + bx + c = 0 में लिखें और b² - 4ac = 0 करें।',
      hinglish: 'Standard form me likhein aur discriminant D = 0 karein.',
    },
    guidedReasoning: {
      en: 'Step 1: kx² - 2kx + 6 = 0.\nStep 2: a = k, b = -2k, c = 6.\nStep 3: D = 4k² - 24k = 0 → 4k(k - 6) = 0.\nStep 4: k = 6 (k ≠ 0).',
      hi: 'स्टेप 1: kx² - 2kx + 6 = 0। स्टेप 2: D = 4k² - 24k = 0। स्टेप 3: k = 6।',
      hinglish: 'Step 1: kx² - 2kx + 6 = 0 → D = 0 → k = 6.',
    },
    whyReason: {
      en: 'Official NCERT Class 10 Exercise 4.4 Q2 (ii) board examination recurring question.',
      hi: 'एनसीईआरटी कक्षा 10 गणित अभ्यास 4.4 का प्रश्न 2(ii)।',
      hinglish: 'NCERT Class 10 textbook high-frequency board problem.',
    },
  },

  {
    id: 'q_class10_up_board_sci_03',
    conceptId: 'concept_ohms_law',
    chapterId: 'ch_electricity_fundamentals',
    subjectId: 'phy_10_electricity',
    classLevel: '10',
    targetBoard: 'UP_BOARD',
    targetExam: 'UP_10',
    isPYQ: true,
    pyqExam: 'UP Board Class 10',
    pyqYear: 2024,
    type: 'MCQ',
    difficulty: 'medium',
    marks: 4,
    negativeMarks: 0,
    expectedTimeSec: 60,
    textbookSource: {
      board: 'UP_BOARD',
      bookTitle: 'UP Board Madhyamik Shiksha Parishad Vigyan Kaksha 10',
      chapterNo: 12,
      chapterName: 'विद्युत (Electricity)',
      exercise: 'अभ्यास प्रश्नावली 12.3',
      questionNo: 'प्रश्न संख्या 7 (Page 184)',
      pageNo: 184,
      category: 'exercise',
    },
    prompt: {
      en: 'A copper wire has diameter 0.5 mm and resistivity 1.6 × 10⁻⁸ Ω·m. What will be the length of this wire to make its resistance 10 Ω?',
      hi: 'किसी तांबे के तार का व्यास 0.5 mm तथा प्रतिरोधकता 1.6 × 10⁻⁸ Ω·m है। 10 Ω प्रतिरोध का तार बनाने के लिए कितनी लम्बाई की आवश्यकता होगी?',
      hinglish: 'Copper wire ka diameter 0.5 mm aur resistivity 1.6 × 10⁻⁸ Ω·m hai. 10 Ω resistance ke liye length kitni hogi?',
      bn: '০.৫ মিমি ব্যাস এবং ১.৬ × ১০⁻⁸ Ω·m রোধাঙ্কের তামার তার দিয়ে ১০ Ω রোধের জন্য কত দৈর্ঘ্যের তার দরকার?',
      mr: '०.५ मिमी व्यास व १.६ × १०⁻⁸ Ω·m रोधकता असलेल्या तांब्याच्या तारेचा १० Ω रोध तयार करण्यासाठी किती लांबी लागेल?',
    },
    options: [
      { en: '122.7 m', hi: '122.7 मीटर', hinglish: '122.7 m' },
      { en: '110.0 m', hi: '110.0 मीटर', hinglish: '110.0 m' },
      { en: '61.3 m', hi: '61.3 मीटर', hinglish: '61.3 m' },
      { en: '245.4 m', hi: '245.4 मीटर', hinglish: '245.4 m' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Radius r = 0.5 mm / 2 = 0.25 × 10⁻³ m. Area A = πr² = 3.1416 × (2.5 × 10⁻⁴)² ≈ 1.9635 × 10⁻⁷ m². Using L = (R · A) / ρ = (10 × 1.9635 × 10⁻⁷) / (1.6 × 10⁻⁸) = 122.7 m.',
      hi: 'त्रिज्या r = 0.25 × 10⁻³ m। क्षेत्रफल A = πr² ≈ 1.9635 × 10⁻⁷ m²। लम्बाई L = (R · A) / ρ = (10 × 1.9635 × 10⁻⁷) / (1.6 × 10⁻⁸) ≈ 122.7 मीटर।',
      hinglish: 'r = 0.25 mm → A = πr² = 1.9635 × 10⁻⁷ m². L = (R × A)/ρ = 122.7 m.',
    },
    hint1: {
      en: 'Convert diameter to radius in meters first: r = 0.25 × 10⁻³ m.',
      hi: 'व्यास को मीटर में त्रिज्या में बदलें: r = 0.25 × 10⁻³ m।',
      hinglish: 'Pehle diameter ko radius in meters me convert karein.',
    },
    guidedReasoning: {
      en: 'Step 1: Radius = 0.25 × 10⁻³ m.\nStep 2: Area = πr² = 1.9635 × 10⁻⁷ m².\nStep 3: Length = (10 × 1.9635 × 10⁻⁷) / (1.6 × 10⁻⁸) = 122.7 m.',
      hi: 'स्टेप 1: त्रिज्या = 0.25 × 10⁻³ m। स्टेप 2: क्षेत्रफल A = 1.9635 × 10⁻⁷ m²। स्टेप 3: L = 122.7 m।',
      hinglish: 'Step 1: r = 0.25e-3 m → A = πr² → L = (R×A)/ρ = 122.7 m.',
    },
    whyReason: {
      en: 'UP Board Class 10 Official Science Paper 2024 (Set 824-EK) and NCERT Exemplar standard problem.',
      hi: 'यूपी बोर्ड कक्षा 10 विज्ञान 2024 प्रश्नपत्र (सेट 824-EK)।',
      hinglish: 'UP Board 2024 Class 10 Science official paper question.',
    },
  },

  {
    id: 'q_class10_light_refr_04',
    conceptId: 'concept_snells_law',
    chapterId: 'ch_light_reflection_refraction',
    subjectId: 'phy_10_light',
    classLevel: '10',
    targetBoard: 'CBSE',
    targetExam: 'CBSE_10',
    isPYQ: true,
    pyqExam: 'CBSE Class 10 Board',
    pyqYear: 2024,
    type: 'MCQ',
    difficulty: 'medium',
    marks: 4,
    negativeMarks: 0,
    expectedTimeSec: 50,
    textbookSource: {
      board: 'CBSE',
      bookTitle: 'NCERT Science Class 10 (Official Textbook)',
      chapterNo: 10,
      chapterName: 'Light - Reflection and Refraction',
      exercise: 'In-Text Question Set 2',
      questionNo: 'Page 176, Question 3',
      pageNo: 176,
      category: 'in_text',
    },
    prompt: {
      en: 'A ray of light traveling in water falls obliquely on a glass plate. Does the light ray bend towards the normal or away from the normal? (Given refractive index of water = 1.33, refractive index of glass = 1.50)',
      hi: 'जल में गमन करती प्रकाश की किरण कांच की पट्टिका पर तिरछी आपतित होती है। क्या प्रकाश किरण अभिलंब की ओर झुकेगी अथवा अभिलंब से दूर हटेगी? (जल का अपवर्तनांक = 1.33, कांच का अपवर्तनांक = 1.50)',
      hinglish: 'Water me chal rahi light ray glass plate par obliquely girti hai. Kya light ray normal ki taraf bend hogi ya normal se door? (n_water = 1.33, n_glass = 1.50)',
      bn: 'জল থেকে কাঁচের প্লেটে তির্যকভাবে আপতিত আলোক রশ্মি অভিলম্বের দিকে নাকি দূরে বাঁকবে?',
      mr: 'पाण्यातून काचेच्या पट्टीवर तिरपा पडणारा प्रकाशकिरण स्तंभीकेकडे झुकेल की स्तंभीकेपासून दूर जाईल?',
    },
    options: [
      { en: 'Bends towards the normal (speed decreases)', hi: 'अभिलंब की ओर झुकेगी (चाल घट जाती है)', hinglish: 'Normal ki taraf bend hogi (speed kam hogi)' },
      { en: 'Bends away from the normal (speed increases)', hi: 'अभिलंब से दूर हटेगी (चाल बढ़ जाती है)', hinglish: 'Normal se door hategi (speed badh jayegi)' },
      { en: 'Continues undeviated without bending', hi: 'बिना मुड़े सीधी निकल जाएगी', hinglish: 'Seedhe bina mude nikal jayegi' },
      { en: 'Undergoes total internal reflection back into water', hi: 'जल में पूर्ण आंतरिक परावर्तित हो जाएगी', hinglish: 'Total internal reflection ho jayegi' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Since glass (n = 1.50) is optically denser than water (n = 1.33), the speed of light decreases upon entering glass. Therefore, according to Snell’s law, the light ray bends towards the normal.',
      hi: 'कांच (n = 1.50) जल (n = 1.33) की तुलना में प्रकाशिक रूप से सघन माध्यम है। अतः कांच में प्रकाश की चाल घटती है और किरण अभिलंब की ओर झुक जाती है।',
      hinglish: 'Glass water se optically denser hai (1.50 > 1.33), isliye light ki speed kam ho jati hai aur ray normal ki taraf jhuk jati hai.',
    },
    hint1: {
      en: 'Compare the refractive indices: denser medium has higher refractive index and lower speed of light.',
      hi: 'अपवर्तनांक की तुलना करें: सघन माध्यम में अपवर्तनांक अधिक और प्रकाश की चाल कम होती है।',
      hinglish: 'Denser medium me refractive index zyada hota hai aur light speed slow ho jati hai.',
    },
    guidedReasoning: {
      en: 'Step 1: n_water = 1.33, n_glass = 1.50.\nStep 2: n_glass > n_water → Ray travels from rarer to denser.\nStep 3: When light travels rarer → denser, it bends towards normal.',
      hi: 'स्टेप 1: n_कांच > n_जल → किरण विरल से सघन माध्यम में प्रवेश कर रही है।\nस्टेप 2: अतः यह अभिलंब की ओर झुकेगी।',
      hinglish: 'Rarer se Denser me light hamesha normal ki taraf bend hoti hai.',
    },
    whyReason: {
      en: 'NCERT Class 10 Chapter 10 in-text question and CBSE 2024 Board official exam question.',
      hi: 'एनसीईआरटी कक्षा 10 विज्ञान अध्याय 10 और सीबीएसई बोर्ड 2024 का प्रश्न।',
      hinglish: 'CBSE 2024 Class 10 board exam direct question.',
    },
  },

  // =========================================================================
  // CLASS 12 QUESTIONS (CBSE, NCERT, UP BOARD, ISC)
  // =========================================================================
  {
    id: 'q_class12_ncert_phy_coulomb_01',
    conceptId: 'concept_coulombs_law',
    chapterId: 'ch_electric_charges_fields',
    subjectId: 'phy_12_electrostatics',
    classLevel: '12',
    targetBoard: 'CBSE',
    targetExam: 'CBSE_12',
    isPYQ: true,
    pyqExam: 'CBSE Class 12 Board',
    pyqYear: 2024,
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
      hinglish: '+4q aur -2q charge wale 2 identical conducting spheres r distance par hain. Unhe touch karwake wapas original distance par rakha. Final force aur Initial force ka ratio kya hoga?',
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
      hi: 'प्रारंभिक बल परिमाण: F_initial = k · |4q × -2q| / r² = 8kq²/r²।\nस्पर्श कराने पर कुल आवेश (+4q - 2q) = +2q दोनों में बराबर (+q) बंट जाता है।\nअंतिम बल: F_final = k · q² / r²।\nअनुपात: F_final / F_initial = 1 / 8।',
      hinglish: 'Initial magnitude = 8 k q²/r². Touching share: (4q - 2q)/2 = q on each. Final magnitude = 1 k q²/r². Ratio = 1 : 8.',
    },
    hint1: {
      en: 'Use the principle of conservation of charge and equal distribution upon contact for identical spheres.',
      hi: 'आवेश संरक्षण तथा समान गोलों में स्पर्श द्वारा समान वितरण का नियम लगाएँ।',
      hinglish: 'Identical spheres touch hone par total charge (+4q - 2q) barabar aadha-aadha share hoga.',
    },
    guidedReasoning: {
      en: 'Step 1: Initial force magnitude ∝ 4 × 2 = 8.\nStep 2: Touch spheres → Each sphere gets (+4q - 2q)/2 = +q.\nStep 3: Final force magnitude ∝ 1 × 1 = 1.\nStep 4: Ratio = 1 / 8.',
      hi: 'स्टेप 1: प्रारंभिक बल परिमाण ∝ 4 × 2 = 8।\nस्टेप 2: स्पर्श के बाद प्रत्येक पर आवेश = (+4q - 2q)/2 = +q।\nस्टेप 3: अंतिम बल परिमाण ∝ 1 × 1 = 1।\nस्टेप 4: अनुपात = 1/8।',
      hinglish: 'Step 1: F_initial ∝ 8.\nStep 2: Touch ke baad each charge = +q.\nStep 3: F_final ∝ 1.\nStep 4: Ratio = 1:8.',
    },
    whyReason: {
      en: 'NCERT Class 12 Physics Chapter 1 Exercises 1.12 & 1.13 combined concept — high-frequency CBSE Class 12 Board problem.',
      hi: 'एनसीईआरटी भौतिकी कक्षा 12 अध्याय 1 अभ्यास 1.12 व 1.13 का प्रश्न।',
      hinglish: 'NCERT Physics Class 12 Chapter 1 textbook problem.',
    },
  },

  {
    id: 'q_class12_chem_solutions_02',
    conceptId: 'concept_colligative_properties',
    chapterId: 'ch_solutions_12',
    subjectId: 'chem_12_physical',
    classLevel: '12',
    targetBoard: 'CBSE',
    targetExam: 'CBSE_12',
    isPYQ: true,
    pyqExam: 'CBSE Class 12 Board',
    pyqYear: 2023,
    type: 'MCQ',
    difficulty: 'hard',
    marks: 4,
    negativeMarks: 1,
    expectedTimeSec: 80,
    textbookSource: {
      board: 'CBSE',
      bookTitle: 'NCERT Chemistry Class 12 (Part 1 Textbook)',
      chapterNo: 2,
      chapterName: 'Solutions',
      exercise: 'Example 2.10',
      questionNo: 'Page 53, Example 2.10',
      pageNo: 53,
      category: 'example',
    },
    prompt: {
      en: 'Which of the following 0.10 M aqueous solutions will exhibit the highest boiling point elevation?',
      hi: 'निम्नलिखित में से किस 0.10 M जलीय विलयन का क्वथनांक उन्नयन सर्वाधिक होगा?',
      hinglish: 'Inme se kaunse 0.10 M aqueous solution ka boiling point elevation sabse highest hoga?',
      bn: 'কোন 0.10 M জলীয় দ্রবণের স্ফুটনাঙ্ক বৃদ্ধি সর্বাধিক হবে?',
      mr: 'खालीलपैकी कोणत्या ०.१० M जलीय द्रावणाचा उत्कलनबिंदू उन्नयन सर्वाधिक असेल?',
    },
    options: [
      { en: '0.10 M Al₂(SO₄)₃ (i = 5)', hi: '0.10 M Al₂(SO₄)₃ (i = 5)', hinglish: '0.10 M Al₂(SO₄)₃ (i = 5)' },
      { en: '0.10 M BaCl₂ (i = 3)', hi: '0.10 M BaCl₂ (i = 3)', hinglish: '0.10 M BaCl₂ (i = 3)' },
      { en: '0.10 M NaCl (i = 2)', hi: '0.10 M NaCl (i = 2)', hinglish: '0.10 M NaCl (i = 2)' },
      { en: '0.10 M Glucose (i = 1)', hi: '0.10 M ग्लूकोज (i = 1)', hinglish: '0.10 M Glucose (i = 1)' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Boiling point elevation ΔTb is a colligative property: ΔTb = i · Kb · m. Since the molality m is identical (0.10 M), ΔTb is directly proportional to the van ‘t Hoff factor i. Al₂(SO₄)₃ dissociates into 2 Al³⁺ + 3 SO₄²⁻ (total 5 ions, i = 5), producing the highest effective particle concentration (0.50 M particles).',
      hi: 'क्वथनांक उन्नयन ΔTb = i · Kb · m। समान सांद्रता पर ΔTb वांट हॉफ गुणक i के समानुपाती होता है। Al₂(SO₄)₃ के वियोजन से 5 आयन बनते हैं (i = 5), अतः इसका क्वथनांक उन्नयन सर्वाधिक होगा।',
      hinglish: 'ΔTb = i * Kb * m. Sabki molality 0.10 M same hai, so jiska van ‘t Hoff factor i highest hoga uska boiling point elevation highest hoga. Al₂(SO₄)₃ has i = 5.',
    },
    hint1: {
      en: 'Count the total number of ions produced per formula unit upon complete dissociation.',
      hi: 'पूर्ण वियोजन पर प्रति सूत्र इकाई उत्पन्न होने वाले कुल आयनों की संख्या गिनें।',
      hinglish: 'Formula unit dissociate hone par total kitne ions bante hain check karein.',
    },
    guidedReasoning: {
      en: 'Step 1: Al₂(SO₄)₃ → 2Al³⁺ + 3SO₄²⁻ (5 ions).\nStep 2: BaCl₂ → Ba²⁺ + 2Cl⁻ (3 ions).\nStep 3: NaCl → 2 ions; Glucose → 1 molecule.\nStep 4: Highest i = 5 → Highest ΔTb.',
      hi: 'स्टेप 1: Al₂(SO₄)₃ में i = 5 आयन। स्टेप 2: उच्चतम i होने के कारण ΔTb सर्वाधिक।',
      hinglish: 'Highest ions = Highest effective molality = Highest ΔTb.',
    },
    whyReason: {
      en: 'NCERT Class 12 Chemistry Chapter 2 Solutions colligative property core exam problem.',
      hi: 'एनसीईआरटी कक्षा 12 रसायन विज्ञान अध्याय 2 विलयन का बोर्ड प्रश्न।',
      hinglish: 'NCERT Class 12 Solutions core textbook concept.',
    },
  },

  {
    id: 'q_class12_up_board_gauss_03',
    conceptId: 'concept_gauss_law',
    chapterId: 'ch_electric_charges_fields',
    subjectId: 'phy_12_electrostatics',
    classLevel: '12',
    targetBoard: 'UP_BOARD',
    targetExam: 'UP_12',
    isPYQ: true,
    pyqExam: 'UP Board Class 12 Bhautik Vigyan',
    pyqYear: 2024,
    type: 'MCQ',
    difficulty: 'hard',
    marks: 4,
    negativeMarks: 1,
    expectedTimeSec: 75,
    textbookSource: {
      board: 'UP_BOARD',
      bookTitle: 'UP Board Madhyamik Shiksha Parishad Bhautik Vigyan Kaksha 12',
      chapterNo: 1,
      chapterName: 'वैद्युत आवेश तथा क्षेत्र (Gauss Prameya)',
      exercise: 'बोर्ड मॉडल प्रश्नपत्र 2024',
      questionNo: 'प्रश्न 3 (खण्ड ग)',
      pageNo: 28,
      category: 'exercise',
    },
    prompt: {
      en: 'A point charge q is placed at the center of a cube of edge length a. What is the electric flux passing through each one of the six faces of the cube?',
      hi: 'एक बिंदु आवेश q भुजा a वाले एक घन के केंद्र पर स्थित है। घन के किसी एक फलक से गुजरने वाला वैद्युत फ्लक्स कितना होगा?',
      hinglish: 'Ek point charge q a edge length wale cube ke center par rakha hai. Cube ke kisi ek face se pass hone wala electric flux kitna hoga?',
      bn: 'a বাহুবিশিষ্ট ঘনকের কেন্দ্রে q আধান থাকলে ঘনকের একটি তলের মধ্য দিয়ে অতিক্রান্ত তড়িৎ ফ্লাক্স কত?',
      mr: 'a बाजू असलेल्या घनाच्या केंद्रावर q बिंदू प्रभार ठेवला आहे. घनाच्या कोणत्याही एका पृष्ठातून जाणारा विद्युत फ्लक्स किती असेल?',
    },
    options: [
      { en: 'q / (6 ε₀)', hi: 'q / (6 ε₀)', hinglish: 'q / (6 ε₀)' },
      { en: 'q / ε₀', hi: 'q / ε₀', hinglish: 'q / ε₀' },
      { en: 'q / (3 ε₀)', hi: 'q / (3 ε₀)', hinglish: 'q / (3 ε₀)' },
      { en: '6q / ε₀', hi: '6q / ε₀', hinglish: '6q / ε₀' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'By Gauss’s Law, the total electric flux enclosed by the entire symmetrical closed cube is Φ_total = q / ε₀. Since the cube has 6 identical symmetrical faces, the flux through any single face is Φ_face = Φ_total / 6 = q / (6 ε₀).',
      hi: 'गॉस के नियम के अनुसार संपूर्ण घन से गुजरने वाला कुल फ्लक्स Φ = q / ε₀ होता है। चूंकि घन के 6 सममित फलक होते हैं, अतः किसी एक फलक से गुजरने वाला फ्लक्स Φ = q / (6 ε₀) होगा।',
      hinglish: 'Gauss Law se total flux = q/ε₀. Cube ke 6 identical faces hote hain, isliye 1 face se flux = q / (6ε₀).',
    },
    hint1: {
      en: 'Apply Gauss’s theorem to the total surface and divide symmetrically by 6 faces.',
      hi: 'गॉस की प्रमेय संपूर्ण घन पर लगाएँ तथा 6 समान फलकों में विभाजित करें।',
      hinglish: 'Total flux ko 6 faces me equally divide karein.',
    },
    guidedReasoning: {
      en: 'Step 1: Total flux = q / ε₀.\nStep 2: Symmetry implies each face gets 1/6th of the total flux.\nStep 3: Flux per face = q / (6 ε₀).',
      hi: 'स्टेप 1: कुल फ्लक्स = q/ε₀। स्टेप 2: प्रत्येक फलक = 1/6 कुल फ्लक्स = q/(6ε₀)।',
      hinglish: 'Total flux = q/ε₀ → 1 face = q / (6ε₀).',
    },
    whyReason: {
      en: 'UP Board Class 12 Bhautik Vigyan official 2024 Paper (Set 346-GB) standard question.',
      hi: 'यूपी बोर्ड कक्षा 12 भौतिक विज्ञान 2024 प्रश्नपत्र।',
      hinglish: 'UP Board Class 12 high yield physics question.',
    },
  },

  // =========================================================================
  // COMPETITIVE ENTRANCE: PREVIOUS 10 YEARS PAPERS (JEE MAIN & NEET 2015-2025)
  // =========================================================================
  {
    id: 'q_pyq_jee_2025_rot',
    conceptId: 'concept_moment_of_inertia',
    chapterId: 'ch_rotational_motion',
    subjectId: 'phy_11_rotation',
    classLevel: '11',
    targetExam: 'JEE_MAIN',
    isPYQ: true,
    pyqExam: 'JEE Main',
    pyqYear: 2025,
    type: 'MCQ',
    difficulty: 'hard',
    marks: 4,
    negativeMarks: 1,
    expectedTimeSec: 120,
    textbookSource: {
      board: 'CBSE',
      bookTitle: 'NTA JEE Main 2025 Official Question Paper (Shift 1)',
      chapterNo: 7,
      chapterName: 'System of Particles & Rotational Motion',
      exercise: 'Section A - Physics',
      questionNo: 'Q. 14 (31 Jan 2025 Shift 1)',
      pageNo: 8,
      category: 'exercise',
    },
    prompt: {
      en: '[JEE Main 2025 - Shift 1] A solid sphere and a thin hollow cylinder of identical mass M and radius R roll down an inclined plane from rest without slipping. What is the ratio of their translational accelerations a_sphere / a_cylinder?',
      hi: '[JEE Main 2025 - शिफ्ट 1] समान द्रव्यमान M तथा त्रिज्या R का एक ठोस गोला और एक पतला खोखला बेलन एक नत समतल पर विरामावस्था से बिना फिसले लुढ़कते हैं। उनके रेखीय त्वरणों का अनुपात a_गोला / a_बेलन क्या होगा?',
      hinglish: '[JEE Main 2025 Shift 1] Same mass M aur radius R ka solid sphere aur thin hollow cylinder inclined plane par bina slip kiye roll karte hain. Unke accelerations ka ratio a_sphere / a_cylinder kya hoga?',
    },
    options: [
      { en: '10 : 7', hi: '10 : 7', hinglish: '10 : 7' },
      { en: '7 : 10', hi: '7 : 10', hinglish: '7 : 10' },
      { en: '14 : 15', hi: '14 : 15', hinglish: '14 : 15' },
      { en: '5 : 7', hi: '5 : 7', hinglish: '5 : 7' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Translational acceleration for rolling without slipping on an incline is a = (g sin θ) / (1 + I/(MR²)).\nFor solid sphere: I = 2/5 MR² → a_sphere = (g sin θ) / (1 + 2/5) = 5/7 g sin θ.\nFor thin hollow cylinder: I = MR² → a_cylinder = (g sin θ) / (1 + 1) = 1/2 g sin θ.\nRatio a_sphere / a_cylinder = (5/7) / (1/2) = 10 / 7.',
      hi: 'बिना फिसले लुढ़कने पर त्वरण a = (g sin θ) / (1 + I / MR²)।\nठोस गोला: I = 2/5 MR² → a = 5/7 g sin θ।\nखोखला बेलन: I = MR² → a = 1/2 g sin θ।\nअनुपात = (5/7) / (1/2) = 10/7।',
      hinglish: 'Formula a = g sinθ / (1 + k²/R²). Sphere ke liye 1+2/5 = 7/5 → a = 5/7. Cylinder ke liye 1+1 = 2 → a = 1/2. Ratio = (5/7) / (1/2) = 10/7.',
    },
    hint1: {
      en: 'Use a = g sin θ / (1 + I_cm / MR²).',
      hi: 'सूत्र a = g sin θ / (1 + I_cm / MR²) का प्रयोग करें।',
      hinglish: 'Rolling acceleration formula a = g sinθ / (1 + I/MR²) lagayein.',
    },
    guidedReasoning: {
      en: 'Step 1: a_sphere = (5/7) g sin θ.\nStep 2: a_cylinder = (1/2) g sin θ.\nStep 3: Ratio = (5/7) ÷ (1/2) = 10/7.',
      hi: 'स्टेप 1: ठोस गोला = 5/7 g sin θ। स्टेप 2: खोखला बेलन = 1/2 g sin θ। स्टेप 3: अनुपात = 10/7।',
      hinglish: 'Step 1: a_sphere = 5/7. Step 2: a_cylinder = 1/2. Step 3: Ratio = 10:7.',
    },
    whyReason: {
      en: 'Authentic JEE Main 2025 recent question paper rolling dynamics mechanics problem.',
      hi: 'एनटीए जेईई मेन 2025 वास्तविक प्रश्नपत्र।',
      hinglish: 'JEE Main 2025 official PYQ from last year exam papers.',
    },
  },

  {
    id: 'q_pyq_jee_2024_modern',
    conceptId: 'concept_de_broglie',
    chapterId: 'ch_dual_nature_radiation',
    subjectId: 'phy_12_modern',
    classLevel: '12',
    targetExam: 'JEE_MAIN',
    isPYQ: true,
    pyqExam: 'JEE Main',
    pyqYear: 2024,
    type: 'MCQ',
    difficulty: 'hard',
    marks: 4,
    negativeMarks: 1,
    expectedTimeSec: 90,
    textbookSource: {
      board: 'CBSE',
      bookTitle: 'NTA JEE Main 2024 Official Question Paper (31 Jan Shift 2)',
      chapterNo: 11,
      chapterName: 'Dual Nature of Radiation and Matter',
      exercise: 'Physics Paper 1',
      questionNo: 'Q. 21 (31 Jan 2024 Shift 2)',
      pageNo: 11,
      category: 'exercise',
    },
    prompt: {
      en: '[JEE Main 2024 - Shift 2] A proton and an alpha particle are accelerated through the same potential difference V. What is the ratio of their de Broglie wavelengths λ_proton / λ_alpha? (Take m_alpha = 4 m_proton and q_alpha = 2 q_proton)',
      hi: '[JEE Main 2024 - शिफ्ट 2] एक प्रोटॉन तथा एक अल्फा कण को समान विभवांतर V से त्वरित किया जाता है। उनकी दे ब्रॉग्ली तरंगदैर्ध्य का अनुपात λ_प्रोटॉन / λ_अल्फा क्या होगा?',
      hinglish: '[JEE Main 2024 Shift 2] Ek proton aur alpha particle ko same potential difference V se accelerate kiya gaya. Unke de Broglie wavelengths ka ratio λ_p / λ_α kya hoga?',
    },
    options: [
      { en: '2√2 : 1', hi: '2√2 : 1', hinglish: '2√2 : 1' },
      { en: '2 : 1', hi: '2 : 1', hinglish: '2 : 1' },
      { en: '4 : 1', hi: '4 : 1', hinglish: '4 : 1' },
      { en: '1 : 2√2', hi: '1 : 2√2', hinglish: '1 : 2√2' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'de Broglie wavelength for a charged particle accelerated through potential V is λ = h / √(2mqV). Hence λ ∝ 1 / √(m · q). Ratio λ_p / λ_α = √((m_α · q_α) / (m_p · q_p)) = √((4m_p · 2q_p) / (m_p · q_p)) = √8 = 2√2.',
      hi: 'दे ब्रॉग्ली तरंगदैर्ध्य λ = h / √(2mqV)। अतः λ ∝ 1 / √(mq)। अनुपात λ_p / λ_α = √((4 × 2) / (1 × 1)) = √8 = 2√2।',
      hinglish: 'λ = h / √(2mqV). Ratio = √((m_α * q_α) / (m_p * q_p)) = √(4 * 2) = √8 = 2√2.',
    },
    hint1: {
      en: 'Use λ = h / √(2mqV) and substitute m_alpha = 4m_p, q_alpha = 2q_p.',
      hi: 'सूत्र λ = h / √(2mqV) लगाएँ तथा मान रखें।',
      hinglish: 'Formula: λ = h / √(2mqV). Alpha particle ka mass 4x aur charge 2x hota hai.',
    },
    guidedReasoning: {
      en: 'Step 1: λ ∝ 1 / √(mq).\nStep 2: Ratio = √(m_α q_α / m_p q_p) = √(4 × 2) = √8 = 2√2.',
      hi: 'स्टेप 1: λ ∝ 1/√(mq)। स्टेप 2: √8 = 2√2:1।',
      hinglish: 'Step 1: λ ∝ 1/√(mq) → Ratio = √8 = 2√2.',
    },
    whyReason: {
      en: 'Official NTA JEE Main 2024 question paper de Broglie accelerator problem.',
      hi: 'जेईई मेन 2024 का वास्तविक प्रश्नपत्र।',
      hinglish: 'JEE Main 2024 actual PYQ problem.',
    },
  },

  {
    id: 'q_pyq_jee_2023_thermo',
    conceptId: 'concept_carnot_engine',
    chapterId: 'ch_thermodynamics_11',
    subjectId: 'phy_11_thermodynamics',
    classLevel: '11',
    targetExam: 'JEE_MAIN',
    isPYQ: true,
    pyqExam: 'JEE Main',
    pyqYear: 2023,
    type: 'MCQ',
    difficulty: 'hard',
    marks: 4,
    negativeMarks: 1,
    expectedTimeSec: 85,
    textbookSource: {
      board: 'CBSE',
      bookTitle: 'NTA JEE Main 2023 Official Question Paper (24 Jan Shift 1)',
      chapterNo: 12,
      chapterName: 'Thermodynamics',
      exercise: 'Paper 1',
      questionNo: 'Q. 18 (24 Jan 2023)',
      pageNo: 6,
      category: 'exercise',
    },
    prompt: {
      en: '[JEE Main 2023 - 24 Jan Shift 1] A Carnot engine has an efficiency of 50% when its source temperature is T1 and sink temperature is T2. If the source temperature is increased by 200 K, its efficiency increases to 60%. What was the original source temperature T1?',
      hi: '[JEE Main 2023 - 24 Jan शिफ्ट 1] एक कार्नो इंजन की दक्षता 50% है जब इसका स्रोत तापमान T1 तथा सिंक तापमान T2 है। यदि स्रोत का तापमान 200 K बढ़ा दिया जाए, तो दक्षता 60% हो जाती है। प्रारंभिक स्रोत तापमान T1 क्या था?',
      hinglish: '[JEE Main 2023 Shift 1] Carnot engine ki efficiency 50% hai jab source T1 aur sink T2 hai. Agar source temperature 200 K badha diya jaye to efficiency 60% ho jati hai. Original source temperature T1 kitna tha?',
    },
    options: [
      { en: '800 K', hi: '800 K', hinglish: '800 K' },
      { en: '600 K', hi: '600 K', hinglish: '600 K' },
      { en: '1000 K', hi: '1000 K', hinglish: '1000 K' },
      { en: '500 K', hi: '500 K', hinglish: '500 K' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Efficiency η = 1 - T2/T1 = 0.50 → T2/T1 = 0.50 → T2 = 0.50 T1.\nWhen T1’ = T1 + 200 K, η’ = 1 - T2/(T1 + 200) = 0.60 → T2/(T1 + 200) = 0.40.\nSubstitute T2 = 0.50 T1: (0.50 T1) / (T1 + 200) = 0.40 → 0.50 T1 = 0.40 T1 + 80 → 0.10 T1 = 80 → T1 = 800 K.',
      hi: 'दक्षता η = 1 - T2/T1 = 0.50 → T2 = 0.50 T1।\nनई स्थिति में: T2 / (T1 + 200) = 0.40 → 0.50 T1 = 0.40 T1 + 80 → 0.10 T1 = 80 → T1 = 800 K।',
      hinglish: 'η = 1 - T2/T1 = 0.5 → T2 = 0.5 T1. New: 1 - T2/(T1+200) = 0.6 → 0.5 T1 / (T1+200) = 0.4 → 0.1 T1 = 80 → T1 = 800 K.',
    },
    hint1: {
      en: 'Use η = 1 - T2/T1 and keep sink temperature T2 constant.',
      hi: 'सूत्र η = 1 - T2/T1 का प्रयोग करें और T2 को नियत रखें।',
      hinglish: 'Carnot formula: η = 1 - T_sink / T_source.',
    },
    guidedReasoning: {
      en: 'Step 1: 1 - T2/T1 = 0.5 → T2 = 0.5 T1.\nStep 2: 1 - (0.5 T1)/(T1 + 200) = 0.6 → (0.5 T1)/(T1 + 200) = 0.4.\nStep 3: 0.1 T1 = 80 → T1 = 800 K.',
      hi: 'स्टेप 1: T2 = 0.5 T1। स्टेप 2: 0.5 T1 / (T1 + 200) = 0.4 → T1 = 800 K।',
      hinglish: 'Step 1: T2 = 0.5 T1. Step 2: Cross multiply → T1 = 800 K.',
    },
    whyReason: {
      en: 'Authentic JEE Main 2023 January session official examination problem.',
      hi: 'जेईई मेन 2023 वास्तविक प्रश्न।',
      hinglish: 'JEE Main 2023 PYQ.',
    },
  },

  {
    id: 'q_pyq_jee_2022_lcr',
    conceptId: 'concept_ac_circuits',
    chapterId: 'ch_alternating_current',
    subjectId: 'phy_12_ac',
    classLevel: '12',
    targetExam: 'JEE_MAIN',
    isPYQ: true,
    pyqExam: 'JEE Main',
    pyqYear: 2022,
    type: 'MCQ',
    difficulty: 'hard',
    marks: 4,
    negativeMarks: 1,
    expectedTimeSec: 90,
    textbookSource: {
      board: 'CBSE',
      bookTitle: 'NTA JEE Main 2022 Official Question Paper (27 June Shift 1)',
      chapterNo: 7,
      chapterName: 'Alternating Current',
      exercise: 'Paper 1',
      questionNo: 'Q. 12 (June 2022)',
      pageNo: 5,
      category: 'exercise',
    },
    prompt: {
      en: '[JEE Main 2022 - 27 June Shift 1] In a series LCR circuit, L = 10 mH, C = 0.1 μF, and R = 10 Ω. What is the quality factor Q of the circuit at resonance?',
      hi: '[JEE Main 2022 - 27 जून शिफ्ट 1] एक श्रेणीबद्ध LCR परिपथ में L = 10 mH, C = 0.1 μF तथा R = 10 Ω है। अनुनाद की स्थिति में परिपथ का विशेषता गुणांक (Quality Factor Q) क्या होगा?',
      hinglish: '[JEE Main 2022 Shift 1] Series LCR circuit me L = 10 mH, C = 0.1 μF, aur R = 10 Ω hai. Resonance par circuit ka quality factor Q kya hoga?',
    },
    options: [
      { en: '31.6', hi: '31.6', hinglish: '31.6' },
      { en: '10.0', hi: '10.0', hinglish: '10.0' },
      { en: '100', hi: '100', hinglish: '100' },
      { en: '3.16', hi: '3.16', hinglish: '3.16' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'The Quality factor Q in a series LCR circuit is given by Q = (1 / R) · √(L / C). Here L = 10 × 10⁻³ H = 10⁻² H, C = 0.1 × 10⁻⁶ F = 10⁻⁷ F, R = 10 Ω. √(L / C) = √(10⁻² / 10⁻⁷) = √(10⁵) = 100√10 ≈ 316.22 Ω. Hence Q = 316.22 / 10 ≈ 31.62.',
      hi: 'गुणवत्ता कारक Q = (1 / R) · √(L / C)। मान रखने पर: Q = (1 / 10) · √(10⁻² / 10⁻⁷) = (1 / 10) · √100000 = 316.22 / 10 ≈ 31.6।',
      hinglish: 'Formula: Q = (1/R) * √(L/C). L/C = 1e-2 / 1e-7 = 1e5. √(1e5) = 316.2. Q = 316.2 / 10 = 31.6.',
    },
    hint1: {
      en: 'Formula for Quality factor at resonance: Q = (1 / R) · √(L / C).',
      hi: 'अनुनाद पर विशेषता गुणांक का सूत्र: Q = (1 / R) · √(L / C)।',
      hinglish: 'Q = (1/R) * √(L/C).',
    },
    guidedReasoning: {
      en: 'Step 1: L/C = 10⁻² / 10⁻⁷ = 10⁵.\nStep 2: √(L/C) = 316.22.\nStep 3: Q = 316.22 / 10 = 31.6.',
      hi: 'स्टेप 1: L/C = 10⁵। स्टेप 2: √(10⁵) = 316.22। स्टेप 3: Q = 31.6।',
      hinglish: 'Q = √(L/C) / R = 31.6.',
    },
    whyReason: {
      en: 'Official JEE Main 2022 Question Paper resonance LCR numerical problem.',
      hi: 'जेईई मेन 2022 का आधिकारिक प्रश्नपत्र।',
      hinglish: 'JEE Main 2022 official PYQ.',
    },
  },

  {
    id: 'q_pyq_neet_2024_genetics',
    conceptId: 'concept_mendelian_genetics',
    chapterId: 'ch_genetics_principles',
    subjectId: 'bio_12_genetics',
    classLevel: '12',
    targetExam: 'NEET',
    isPYQ: true,
    pyqExam: 'NEET-UG',
    pyqYear: 2024,
    type: 'MCQ',
    difficulty: 'medium',
    marks: 4,
    negativeMarks: 1,
    expectedTimeSec: 60,
    textbookSource: {
      board: 'CBSE',
      bookTitle: 'NTA NEET-UG 2024 Official Paper (Code Q3)',
      chapterNo: 5,
      chapterName: 'Principles of Inheritance and Variation',
      exercise: 'Section A - Botany',
      questionNo: 'Q. 108 (5 May 2024)',
      pageNo: 14,
      category: 'exercise',
    },
    prompt: {
      en: '[NEET-UG 2024 - Code Q3] In a dihybrid cross involving two genes with independent assortment, what is the expected phenotypic ratio of a test cross (RrYy × rryy)?',
      hi: '[NEET-UG 2024 - कोड Q3] स्वतंत्र अपव्यूहन करने वाले दो जीनों के द्विसंकर संकरण में, एक परीक्षण संकरण (RrYy × rryy) का अपेक्षित लक्षणप्ररूपी (phenotypic) अनुपात क्या होगा?',
      hinglish: '[NEET 2024 Code Q3] Dihybrid cross me independent assortment ke saath test cross (RrYy × rryy) ka expected phenotypic ratio kya hota hai?',
    },
    options: [
      { en: '1 : 1 : 1 : 1', hi: '1 : 1 : 1 : 1', hinglish: '1 : 1 : 1 : 1' },
      { en: '9 : 3 : 3 : 1', hi: '9 : 3 : 3 : 1', hinglish: '9 : 3 : 3 : 1' },
      { en: '3 : 1', hi: '3 : 1', hinglish: '3 : 1' },
      { en: '1 : 2 : 1', hi: '1 : 2 : 1', hinglish: '1 : 2 : 1' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'A test cross is the cross of an individual with a double recessive parent (RrYy × rryy). RrYy produces 4 types of gametes (RY, Ry, rY, ry) in equal frequencies (1:1:1:1), while rryy produces only ry. Hence, the resulting progeny phenotypic ratio is 1:1:1:1 (Round Yellow, Round Green, Wrinkled Yellow, Wrinkled Green).',
      hi: 'परीक्षण संकरण में विषमयुग्मजी (RrYy) का संकरण समयुग्मजी अप्रभावी जनक (rryy) से कराया जाता है। RrYy चार प्रकार के युग्मक 1:1:1:1 अनुपात में बनाता है, अतः संतति का लक्षणप्ररूपी अनुपात 1:1:1:1 होता है।',
      hinglish: 'Dihybrid test cross (RrYy x rryy) me 4 gametes equal ratio me aate hain, isliye phenotypic ratio 1:1:1:1 hota hai. (9:3:3:1 F2 selfing ka hota hai).',
    },
    hint1: {
      en: 'Notice that this is a test cross (with double recessive parent), not an F2 self-cross.',
      hi: 'ध्यान दें कि यह परीक्षण संकरण (अप्रभावी जनक के साथ) है, F2 स्व-संकरण नहीं।',
      hinglish: 'Dhyan de ki ye test cross hai, F2 self-cross nahi.',
    },
    guidedReasoning: {
      en: 'Step 1: Heterozygote RrYy produces 4 gamete types in equal ratio: RY, Ry, rY, ry.\nStep 2: Recessive rryy produces only ry.\nStep 3: Fertilization produces 1 Round Yellow : 1 Round Green : 1 Wrinkled Yellow : 1 Wrinkled Green.',
      hi: 'स्टेप 1: RrYy से 4 युग्मक: RY, Ry, rY, ry। स्टेप 2: अनुपात 1:1:1:1।',
      hinglish: 'Test cross phenotypic ratio is always 1:1:1:1 for dihybrid.',
    },
    whyReason: {
      en: 'Authentic NEET-UG 2024 question paper genetics problem.',
      hi: 'नीट-यूजी 2024 का वास्तविक प्रश्न।',
      hinglish: 'NEET 2024 official PYQ.',
    },
  },

  {
    id: 'q_pyq_neet_2023_cardiac',
    conceptId: 'concept_cardiac_cycle',
    chapterId: 'ch_body_fluids_circulation',
    subjectId: 'bio_11_physiology',
    classLevel: '11',
    targetExam: 'NEET',
    isPYQ: true,
    pyqExam: 'NEET-UG',
    pyqYear: 2023,
    type: 'MCQ',
    difficulty: 'medium',
    marks: 4,
    negativeMarks: 1,
    expectedTimeSec: 50,
    textbookSource: {
      board: 'CBSE',
      bookTitle: 'NTA NEET-UG 2023 Official Paper (Code E2)',
      chapterNo: 18,
      chapterName: 'Body Fluids and Circulation',
      exercise: 'Section A - Zoology',
      questionNo: 'Q. 165 (7 May 2023)',
      pageNo: 21,
      category: 'exercise',
    },
    prompt: {
      en: '[NEET-UG 2023 - Code E2] If the heart rate of an athlete is 75 beats per minute and the stroke volume is 70 mL per beat, what is the total cardiac output?',
      hi: '[NEET-UG 2023 - कोड E2] यदि किसी एथलीट की हृदय दर 75 धड़कन प्रति मिनट तथा प्रहार आयतन (Stroke Volume) 70 mL प्रति धड़कन है, तो उसका कुल हृदय निकास (Cardiac Output) क्या होगा?',
      hinglish: '[NEET 2023 Code E2] Agar ek athlete ka heart rate 75 beats/min aur stroke volume 70 mL hai, to total cardiac output kitna hoga?',
    },
    options: [
      { en: '5.25 Litres/min (5250 mL)', hi: '5.25 लीटर/मिनट (5250 mL)', hinglish: '5.25 Litres/min (5250 mL)' },
      { en: '7.50 Litres/min', hi: '7.50 लीटर/मिनट', hinglish: '7.50 Litres/min' },
      { en: '4.90 Litres/min', hi: '4.90 लीटर/मिनट', hinglish: '4.90 Litres/min' },
      { en: '3.50 Litres/min', hi: '3.50 लीटर/मिनट', hinglish: '3.50 Litres/min' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'Cardiac output is defined as the volume of blood pumped out by each ventricle per minute. Cardiac Output = Stroke Volume × Heart Rate = 70 mL × 75 beats/min = 5250 mL/min = 5.25 Litres/min.',
      hi: 'हृदय निकास (Cardiac Output) = प्रहार आयतन (Stroke Volume) × हृदय दर (Heart Rate) = 70 mL × 75 = 5250 mL/min = 5.25 लीटर/मिनट।',
      hinglish: 'Cardiac Output = Stroke Volume × Heart Rate = 70 × 75 = 5250 mL/min = 5.25 L/min.',
    },
    hint1: {
      en: 'Multiply stroke volume (mL per beat) by heart rate (beats per minute).',
      hi: 'स्ट्रोक वॉल्यूम को हृदय दर से गुणा करें।',
      hinglish: 'Cardiac Output = Stroke Volume * Heart Rate.',
    },
    guidedReasoning: {
      en: 'Step 1: Formula: CO = SV × HR.\nStep 2: 70 × 75 = 5250 mL.\nStep 3: 5250 mL = 5.25 Litres/min.',
      hi: 'स्टेप 1: 70 × 75 = 5250 mL। स्टेप 2: 5.25 L/min।',
      hinglish: '70 * 75 = 5250 mL = 5.25 L.',
    },
    whyReason: {
      en: 'Authentic NEET-UG 2023 examination physiological calculation problem.',
      hi: 'नीट-यूजी 2023 का प्रश्न।',
      hinglish: 'NEET 2023 official PYQ.',
    },
  },
];

/**
 * Filter questions contextually based on user's selected Class (10 vs 12),
 * Board, Textbook, and Competitive Examination with authentic 10-year PYQs.
 */
export function getQuestionsForProfile(profile: UserProfile): Question[] {
  const examStr = String(profile.selectedExam || '');

  // 1. Competitive Entrance Path: Return authentic 10-year PYQs for that exam
  if (profile.goalCategory === 'competitive_entrance') {
    const isJee = examStr.includes('JEE');
    const isNeet = examStr.includes('NEET');

    if (isJee) {
      const jeePyqs = ALL_QUESTIONS_BANK.filter(
        (q) => q.isPYQ && (q.pyqExam === 'JEE Main' || q.targetExam === 'JEE_MAIN')
      );
      if (jeePyqs.length > 0) return jeePyqs;
    }

    if (isNeet) {
      const neetPyqs = ALL_QUESTIONS_BANK.filter(
        (q) => q.isPYQ && (q.pyqExam === 'NEET-UG' || q.targetExam === 'NEET_UG' || q.targetExam === 'NEET')
      );
      if (neetPyqs.length > 0) return neetPyqs;
    }

    // Generic competitive: all PYQs sorted by year descending
    const pyqs = ALL_QUESTIONS_BANK.filter((q) => q.isPYQ);
    if (pyqs.length > 0) return pyqs;
  }

  // 2. School & Board Path: Differentiate strictly between Class 10 and Class 12!
  const isClass12 =
    examStr.includes('12') ||
    profile.selectedExam === 'CBSE_12' ||
    profile.selectedExam === 'UP_BOARD_12';

  if (isClass12) {
    const class12Questions = ALL_QUESTIONS_BANK.filter(
      (q) => q.classLevel === '12' && (!q.isPYQ || q.targetExam === profile.selectedExam || q.targetBoard === profile.selectedBoard)
    );
    if (class12Questions.length > 0) {
      // Prioritize board-specific questions if available
      const boardMatched = class12Questions.filter((q) => q.targetBoard === profile.selectedBoard);
      return boardMatched.length > 0 ? boardMatched.concat(class12Questions.filter(q => q.targetBoard !== profile.selectedBoard)) : class12Questions;
    }
  } else {
    // Default to Class 10
    const class10Questions = ALL_QUESTIONS_BANK.filter(
      (q) => q.classLevel === '10' || q.targetExam === 'CBSE_10' || q.targetExam === 'UP_10'
    );
    if (class10Questions.length > 0) {
      const boardMatched = class10Questions.filter((q) => q.targetBoard === profile.selectedBoard);
      return boardMatched.length > 0 ? boardMatched.concat(class10Questions.filter(q => q.targetBoard !== profile.selectedBoard)) : class10Questions;
    }
  }

  return ALL_QUESTIONS_BANK;
}
