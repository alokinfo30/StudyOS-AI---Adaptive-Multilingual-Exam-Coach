import { Chapter } from '../../types';

/**
 * Complete Class 10 Science Curriculum (All 13 Chapters)
 * Rationalized NCERT 2025-26, CBSE, UP Board (UPMSP), Bihar Board (BSEB) & State Boards
 */
export const CLASS_10_SCIENCE_ALL_CHAPTERS: Chapter[] = [
  // Chapter 1
  {
    id: 'c10_sci_ch1_chemical_reactions',
    subjectId: 'class10_science',
    chapterNo: 1,
    title: {
      en: 'Chemical Reactions & Equations',
      hi: 'रासायनिक अभिक्रियाएँ एवं समीकरण',
      hinglish: 'Chemical Reactions & Equations',
      bn: 'রাসায়নিক বিক্রিয়া ও সমীকরণ',
      mr: 'रासायनिक अभिक्रिया आणि समीकरणे',
    },
    description: {
      en: 'Balancing chemical equations, types of reactions (combination, decomposition, displacement, double displacement), redox processes, corrosion, and rancidity.',
      hi: 'रासायनिक समीकरण संतुलन, अभिक्रियाओं के प्रकार (संयोजन, वियोजन, विस्थापन, द्विविस्थापन), उपचयन-अपचयन (रेडॉक्स), संक्षारण एवं विकृतगंधिता।',
      hinglish: 'Chemical reactions balance karna, types of reactions aur redox processes.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Science Class 10 Chapter 1 / UPMSP Vigyan Ch 1',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_balancing_reactions',
        title: {
          en: 'Law of Conservation of Mass & Balancing Chemical Equations',
          hi: 'द्रव्यमान संरक्षण का नियम एवं समीकरण संतुलन',
          hinglish: 'Conservation of Mass & Balancing Equations',
        },
        summary: {
          en: 'Matter can neither be created nor destroyed in a chemical reaction. Therefore, the total number of atoms of each element must remain identical before and after the reaction.',
          hi: 'रासायनिक अभिक्रिया में द्रव्यमान का न निर्माण होता है न विनाश। अतः अभिकारक और उत्पाद दोनों पक्षों में प्रत्येक तत्व के परमाणुओं की संख्या बराबर होनी चाहिए।',
          hinglish: 'Total mass constant rehta hai, isliye dono taraf elements ke atoms equal hone chahiye.',
        },
        formula: '3\\text{Fe}(s) + 4\\text{H}_2\\text{O}(g) \\rightarrow \\text{Fe}_3\\text{O}_4(s) + 4\\text{H}_2(g)',
        keyPoints: [
          {
            en: 'Balance metals first, then non-metals, then hydrogen, and balance oxygen last.',
            hi: 'पहले धातुओं को संतुलित करें, फिर अधातुओं को, फिर हाइड्रोजन और अंत में ऑक्सीजन को।',
            hinglish: 'Pehle metals, fir non-metals, aur last me H aur O balance karein.',
          },
          {
            en: 'State symbols (s, l, g, aq) are mandatory in board exam representations.',
            hi: 'भौतिक अवस्थाओं (s, l, g, aq) को दर्शाना बोर्ड परीक्षा में पूरे अंक प्राप्त करने हेतु आवश्यक है।',
            hinglish: 'Physical state indicators zaruri hote hain.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'What are the stoichiometric coefficients a, b, c to balance: a Al + b O₂ → c Al₂O₃?',
            hi: 'समीकरण a Al + b O₂ → c Al₂O₃ को संतुलित करने के लिए a, b, c क्या होंगे?',
            hinglish: 'a Al + b O₂ → c Al₂O₃ ko balance karne ke coefficients kya hain?',
          },
          options: [
            { en: 'a = 4, b = 3, c = 2', hi: 'a = 4, b = 3, c = 2', hinglish: 'a = 4, b = 3, c = 2' },
            { en: 'a = 2, b = 3, c = 1', hi: 'a = 2, b = 3, c = 1', hinglish: 'a = 2, b = 3, c = 1' },
            { en: 'a = 4, b = 2, c = 2', hi: 'a = 4, b = 2, c = 2', hinglish: 'a = 4, b = 2, c = 2' },
            { en: 'a = 2, b = 2, c = 1', hi: 'a = 2, b = 2, c = 1', hinglish: 'a = 2, b = 2, c = 1' },
          ],
          correctIndex: 0,
          explanation: {
            en: '3 O₂ provides 6 oxygen atoms, which matches 2 Al₂O₃. To balance 4 aluminum atoms, we need 4 Al on the left: 4 Al + 3 O₂ → 2 Al₂O₃.',
            hi: '3 O₂ में 6 ऑक्सीजन हैं जो 2 Al₂O₃ से मिलते हैं। 4 एल्यूमीनियम परमाणुओं के लिए बाएँ पक्ष में 4 Al आवश्यक हैं: 4 Al + 3 O₂ → 2 Al₂O₃।',
            hinglish: 'Left: 4 Al, 6 O. Right: 4 Al, 6 O. Balanced: 4, 3, 2.',
          }
        },
      },
    ],
  },

  // Chapter 2
  {
    id: 'c10_sci_ch2_acids_bases_salts',
    subjectId: 'class10_science',
    chapterNo: 2,
    title: {
      en: 'Acids, Bases & Salts',
      hi: 'अम्ल, क्षारक एवं लवण',
      hinglish: 'Acids, Bases and Salts',
      bn: 'অম্ল, ক্ষারক ও লবণ',
    },
    description: {
      en: 'Properties of acids and bases, pH scale in everyday life, neutralization reactions, and production of bleaching powder, baking soda, washing soda, and POP.',
      hi: 'अम्ल व क्षारकों के गुणधर्म, दैनिक जीवन में pH पैमाना, उदासीनीकरण, तथा विरंजक चूर्ण, बेकिंग सोडा, धावन सोडा और प्लास्टर ऑफ पेरिस।',
      hinglish: 'Acids, bases properties, pH scale aur daily life salts.',
    },
    targetMastery: 90,
    highYieldWeightage: 9,
    textbookRef: 'NCERT Science Class 10 Chapter 2 / UPMSP Vigyan Ch 2',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_ph_scale',
        title: {
          en: 'pH Scale & Hydrogen Ion Concentration',
          hi: 'pH पैमाना एवं हाइड्रोजन आयन सांद्रता',
          hinglish: 'pH Scale & Hydrogen Ion Concentration',
        },
        summary: {
          en: 'pH measures hydrogen ion concentration: pH = -log[H⁺]. Acidic solutions have pH < 7, neutral solutions have pH = 7, and alkaline solutions have pH > 7. Each unit decrease represents a 10-fold increase in acidity.',
          hi: 'pH हाइड्रोजन आयन सांद्रता का पैमाना है: pH = -log[H⁺]। अम्लीय विलयन pH < 7, उदासीन pH = 7, तथा क्षारीय pH > 7 होता है।',
          hinglish: 'pH < 7 acid, pH = 7 neutral, pH > 7 base hota hai.',
        },
        formula: '\\text{pH} = -\\log_{10}[\\text{H}^+], \\quad [\\text{H}^+][\\text{OH}^-] = 10^{-14}',
        keyPoints: [
          {
            en: 'Tooth decay begins when oral pH drops below 5.5 due to bacterial acid production.',
            hi: 'मुख का pH 5.5 से नीचे गिरने पर दाँतों का इनैमल क्षय होने लगता है।',
            hinglish: 'Mouth ka pH 5.5 se kam hone par tooth decay start hota hai.',
          },
          {
            en: 'Human blood functions in the tightly regulated range of pH 7.35 to 7.45.',
            hi: 'मानव रुधिर का pH 7.35 से 7.45 के मध्य नियंत्रित रहता है।',
            hinglish: 'Human blood ka pH lagbhag 7.4 hota hai.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'What happens to the [H⁺] ion concentration when a solution changes from pH 5 to pH 3?',
            hi: 'जब किसी विलयन का pH 5 से 3 हो जाता है, तो [H⁺] सांद्रता में क्या परिवर्तन होता है?',
            hinglish: 'pH 5 se 3 hone par [H⁺] concentration me kya change hota hai?',
          },
          options: [
            { en: 'Increases by 100 times', hi: '100 गुना बढ़ जाती है', hinglish: '100 times increase ho jati hai' },
            { en: 'Decreases by 100 times', hi: '100 गुना घट जाती है', hinglish: '100 times decrease ho jati hai' },
            { en: 'Increases by 2 times', hi: '2 गुना बढ़ जाती है', hinglish: '2 times increase ho jati hai' },
            { en: 'Decreases by 2 times', hi: '2 गुना घट जाती है', hinglish: '2 times decrease ho jati hai' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Since pH is a logarithmic scale, a change of 2 units corresponds to 10² = 100 times increase in [H⁺] concentration.',
            hi: 'pH लघुगणकीय पैमाना होने के कारण 2 इकाइयों की कमी का अर्थ 10² = 100 गुना [H⁺] सांद्रता की वृद्धि है।',
            hinglish: '2 units decrease matlab 10² = 100x increase in acidity.',
          }
        },
      },
    ],
  },

  // Chapter 3
  {
    id: 'c10_sci_ch3_metals_nonmetals',
    subjectId: 'class10_science',
    chapterNo: 3,
    title: {
      en: 'Metals and Non-Metals',
      hi: 'धातु एवं अधातु',
      hinglish: 'Metals and Non-Metals',
      bn: 'ধাতু ও অধাতু',
    },
    description: {
      en: 'Reactivity series, ionic compound formation, electron dot structures, properties of ionic compounds, metallurgy (roasting, calcination), and corrosion prevention.',
      hi: 'सक्रियता श्रेणी, आयनिक यौगिकों का निर्माण, इलेक्ट्रॉन बिंदु संरचना, धातुकर्म (भर्जन एवं निस्तापन), तथा संक्षारण से बचाव।',
      hinglish: 'Reactivity series, ionic bonds aur metallurgy ke concepts.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Science Class 10 Chapter 3 / UPMSP Vigyan Ch 3',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_reactivity_series_ionic',
        title: {
          en: 'Reactivity Series & Ionic Bonding Properties',
          hi: 'सक्रियता श्रेणी एवं आयनिक आबंधन के गुणधर्म',
          hinglish: 'Reactivity Series & Ionic Bonding',
        },
        summary: {
          en: 'Metals lose electrons to form cations, while non-metals gain electrons to form anions. Ionic compounds have high melting and boiling points due to strong electrostatic attraction, are soluble in water, and conduct electricity in molten or aqueous state.',
          hi: 'धातुएँ इलेक्ट्रॉन त्यागकर धनायन तथा अधातुएँ इलेक्ट्रॉन ग्रहण कर ऋणायन बनाती हैं। आयनिक यौगिकों के गलनांक उच्च होते हैं तथा वे जलीय या गलित अवस्था में विद्युत का चालन करते हैं।',
          hinglish: 'Ionic bonds strong electrostatic force se bante hain. Solid me non-conductor par molten/aqueous me good conductors hote hain.',
        },
        formula: '\\text{Na} \\rightarrow \\text{Na}^+ + e^-, \\quad \\text{Cl} + e^- \\rightarrow \\text{Cl}^- \\implies \\text{NaCl}',
        keyPoints: [
          {
            en: 'Metals above hydrogen in the reactivity series displace hydrogen from dilute acids.',
            hi: 'सक्रियता श्रेणी में हाइड्रोजन से ऊपर की धातुएँ तनु अम्लों से हाइड्रोजन विस्थापित करती हैं।',
            hinglish: 'Hydrogen se upar wale metals dilute acid se H₂ gas liberate karte hain.',
          },
          {
            en: 'Ionic compounds do not conduct electricity in solid state because ions are fixed in rigid lattice positions.',
            hi: 'ठोस अवस्था में आयनों की गतिशीलता न होने के कारण आयनिक यौगिक विद्युत का चालन नहीं करते।',
            hinglish: 'Solid state me ions fixed hote hain isliye electricity conduct nahi karte.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Why do ionic compounds conduct electricity in aqueous solutions but not in the solid state?',
            hi: 'आयनिक यौगिक ठोस अवस्था में विद्युत चालन क्यों नहीं करते जबकि जलीय विलयन में करते हैं?',
            hinglish: 'Ionic compounds aqueous solution me electricity conduct kyun karte hain but solid me nahi?',
          },
          options: [
            { en: 'Free mobile ions are available in solution but fixed in the solid crystal lattice', hi: 'विलयन में मुक्त गतिशील आयन होते हैं जबकि ठोस जालक में वे स्थिर होते हैं', hinglish: 'Solution me free ions move karte hain, solid me ions fixed hote hain' },
            { en: 'Electrons are completely absent in aqueous solutions', hi: 'जलीय विलयन में इलेक्ट्रॉन पूर्णतः अनुपस्थित होते हैं', hinglish: 'Aqueous me electrons absent hote hain' },
            { en: 'Water destroys all ionic bonds permanently', hi: 'जल सभी आयनिक बंधों को नष्ट कर देता है', hinglish: 'Water bonds ko destroy kar deta hai' },
            { en: 'Solids have lower electrostatic forces than liquids', hi: 'ठोस पदार्थों में द्रव की तुलना में स्थिर वैद्युत बल कम होता है', hinglish: 'Solids me force kam hota hai' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'In the solid state, ions are locked in fixed positions by strong electrostatic forces. In water, hydration separates ions, allowing them to migrate under an applied electric field.',
            hi: 'ठोस में आयन मजबूत आकर्षण बल से बंधे रहते हैं, जबकि जल में घुलने पर आयन मुक्त होकर गतिशील हो जाते हैं।',
            hinglish: 'Water dielectric constant separates ions, making them free to conduct electricity.',
          }
        },
      },
    ],
  },

  // Chapter 4
  {
    id: 'c10_sci_ch4_carbon_compounds',
    subjectId: 'class10_science',
    chapterNo: 4,
    title: {
      en: 'Carbon & Its Compounds',
      hi: 'कार्बन एवं उसके यौगिक',
      hinglish: 'Carbon and its Compounds',
      bn: 'কার্বন ও তার যৌগ',
    },
    description: {
      en: 'Covalent bonding, tetravalency and catenation, homologous series, functional groups, combustion, oxidation, addition and substitution reactions, ethanol, ethanoic acid, soaps, and detergents.',
      hi: 'सहसंयोजी आबंधन, चतुःसंयोजकता एवं शृंखलन, समजातीय श्रेणी, प्रकार्यात्मक समूह, रासायनिक गुणधर्म, एथेनॉल, एथेनॉइक अम्ल, साबुन एवं अपमार्जक।',
      hinglish: 'Covalent bonding, IUPAC naming, homologous series aur soaps micelle action.',
    },
    targetMastery: 90,
    highYieldWeightage: 9,
    textbookRef: 'NCERT Science Class 10 Chapter 4 / UPMSP Vigyan Ch 4',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_covalent_bonding_homologous',
        title: {
          en: 'Covalent Bonding, Catenation & Homologous Series',
          hi: 'सहसंयोजी आबंधन, शृंखलन एवं समजातीय श्रेणी',
          hinglish: 'Covalent Bonding & Homologous Series',
        },
        summary: {
          en: 'Carbon forms covalent bonds by sharing electrons due to high ionization enthalpy and electron gain constraints. Its unique properties are catenation (self-linking) and tetravalency. Successive members in a homologous series differ by a -CH₂- unit (14 u molecular mass).',
          hi: 'कार्बन इलेक्ट्रॉन साझा करके सहसंयोजी आबंध बनाता है। शृंखलन और चतुःसंयोजकता के कारण इसके लाखों यौगिक हैं। समजातीय श्रेणी के क्रमागत सदस्यों में -CH₂- (14 u द्रव्यमान) का अंतर होता है।',
          hinglish: 'Carbon 4 covalent bonds banata hai. Homologous series ke successive members me -CH₂- ka diff hota hai.',
        },
        formula: '\\text{Alkanes: } \\text{C}_n\\text{H}_{2n+2}, \\quad \\text{Alkenes: } \\text{C}_n\\text{H}_{2n}, \\quad \\text{Alkynes: } \\text{C}_n\\text{H}_{2n-2}',
        keyPoints: [
          {
            en: 'Every consecutive member of a homologous series differs by one carbon atom and two hydrogen atoms (-CH₂-).',
            hi: 'समजातीय श्रेणी के क्रमागत सदस्यों में एक कार्बन और दो हाइड्रोजन परमाणुओं का अंतर होता है।',
            hinglish: 'Difference = -CH₂- unit and 14 atomic mass units.',
          },
          {
            en: 'Soaps form spherical micelles in water with hydrophilic ionic heads facing outward and hydrophobic hydrocarbon tails pointing inward.',
            hi: 'साबुन के अणु जल में मिसेल बनाते हैं जिसमें जलरागी सिरा बाहर और जलविरागी सिरा केंद्र की ओर रहता है।',
            hinglish: 'Soap micelle me ionic head outside aur hydrocarbon tail inside oil droplet hoti hai.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'What is the molecular mass difference between any two consecutive members of a homologous series?',
            hi: 'किसी समजातीय श्रेणी के दो क्रमागत सदस्यों के आणविक द्रव्यमान में कितना अंतर होता है?',
            hinglish: 'Homologous series ke do successive members ke molecular mass me kitna difference hota hai?',
          },
          options: [
            { en: '14 u', hi: '14 u', hinglish: '14 u' },
            { en: '12 u', hi: '12 u', hinglish: '12 u' },
            { en: '16 u', hi: '16 u', hinglish: '16 u' },
            { en: '28 u', hi: '28 u', hinglish: '28 u' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Consecutive members differ by a -CH₂- group: Carbon (12 u) + 2 × Hydrogen (1 u) = 14 u.',
            hi: 'क्रमागत सदस्यों में -CH₂- समूह का अंतर होता है: C(12) + 2×H(1) = 14 u।',
            hinglish: 'C = 12, H = 1, so CH₂ = 12 + 2 = 14 u.',
          }
        },
      },
    ],
  },

  // Chapter 5
  {
    id: 'c10_sci_ch5_life_processes',
    subjectId: 'class10_science',
    chapterNo: 5,
    title: {
      en: 'Life Processes',
      hi: 'जैव प्रक्रम',
      hinglish: 'Life Processes',
      bn: 'জীবন প্রক্রিয়া',
    },
    description: {
      en: 'Autotrophic and heterotrophic nutrition, human digestive system, aerobic vs anaerobic respiration, human circulatory system and heart chambers, excretion, and nephron function.',
      hi: 'स्वपोषी एवं विषमपोषी पोषण, मानव पाचन तंत्र, वायवीय एवं अवायवीय श्वसन, मानव परिसंचरण तंत्र एवं हृदय, तथा उत्सर्जन व वृक्काणु (नेफ्रॉन)।',
      hinglish: 'Nutrition, respiration, circulation in heart aur nephron excretion.',
    },
    targetMastery: 90,
    highYieldWeightage: 10,
    textbookRef: 'NCERT Science Class 10 Chapter 5 / UPMSP Vigyan Ch 5',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_double_circulation_nephron',
        title: {
          en: 'Double Circulation in Human Heart & Nephron Excretion',
          hi: 'मानव हृदय में दोहरा परिसंचरण एवं नेफ्रॉन द्वारा उत्सर्जन',
          hinglish: 'Double Circulation & Nephron Filtration',
        },
        summary: {
          en: 'In humans, blood travels twice through the heart during one complete cycle (pulmonary and systemic circulation), preventing oxygenated and deoxygenated blood from mixing. Nephrons are the functional filtration units of the kidney, consisting of glomerulus, Bowman’s capsule, and tubule for selective reabsorption.',
          hi: 'मानव में रुधिर एक चक्र में दो बार हृदय से गुजरता है (दोहरा परिसंचरण)। नेफ्रॉन वृक्क की क्रियात्मक इकाई है जिसमें ग्लोमेरुलस, बोमन सम्पुट और नलिका द्वारा छानन तथा पुनरावशोषण होता है।',
          hinglish: 'Double circulation oxygenated aur deoxygenated blood ko separate rakhta hai. Nephron blood ko filter karke urine banata hai.',
        },
        formula: '6\\text{CO}_2 + 12\\text{H}_2\\text{O} \\xrightarrow[\\text{Chlorophyll}]{\\text{Sunlight}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 + 6\\text{H}_2\\text{O}',
        keyPoints: [
          {
            en: 'Ventricles have thicker muscular walls than atria because they pump blood under high pressure throughout the body.',
            hi: 'निलय की पेशीय भित्ति अलिंद से मोटी होती है क्योंकि उसे पूरे शरीर में रुधिर भेजना होता है।',
            hinglish: 'Ventricles pump blood to entire body, so their muscular walls are thicker.',
          },
          {
            en: 'Useful substances like glucose, amino acids, salts, and major water are selectively reabsorbed along the nephron tubule.',
            hi: 'ग्लूकोज, अमीनो अम्ल, लवण एवं जल का नेफ्रॉन नलिका में चयनात्मक पुनरावशोषण होता है।',
            hinglish: 'Glomerular filtrate se glucose aur water reabsorb hote hain.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'What is the primary evolutionary advantage of four-chambered double circulation in warm-blooded mammals and birds?',
            hi: 'स्तनधारियों और पक्षियों में चार कोष्ठकीय दोहरे परिसंचरण का मुख्य लाभ क्या है?',
            hinglish: 'Warm-blooded animals me 4-chambered heart aur double circulation ka main benefit kya hai?',
          },
          options: [
            { en: 'Complete separation of oxygenated and deoxygenated blood to maintain high body temperature', hi: 'ऑक्सीजनित और विऑक्सीजनित रुधिर का पूर्ण पृथक्करण जिससे उच्च ऊर्जा व नियत ताप बना रहे', hinglish: 'Oxygenated aur deoxygenated blood separate rehta hai high energy requirements ke liye' },
            { en: 'Allows blood to flow at very slow velocity to avoid pressure', hi: 'रुधिर को बहुत धीमे बहने देता है', hinglish: 'Slow blood flow allow karta hai' },
            { en: 'Eliminates the requirement for lungs in breathing', hi: 'फेफड़ों की आवश्यकता समाप्त कर देता है', hinglish: 'Lungs ki zarurat eliminate karta hai' },
            { en: 'Mixes arterial and venous blood to reduce heart pumping workload', hi: 'रुधिर को मिश्रित करके कार्यभार घटाता है', hinglish: 'Blood mix karta hai' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Complete separation prevents blood mixing, providing efficient oxygen delivery necessary for maintaining constant warm body temperature.',
            hi: 'पूर्ण पृथक्करण से अंगों को उच्च ऑक्सीजन मिलती है जो शरीर का तापमान स्थिर बनाए रखने के लिए अनिवार्य है।',
            hinglish: 'High metabolic rate and temperature maintenance require 100% separated oxygenated blood.',
          }
        },
      },
    ],
  },

  // Chapter 6
  {
    id: 'c10_sci_ch6_control_coordination',
    subjectId: 'class10_science',
    chapterNo: 6,
    title: {
      en: 'Control and Coordination',
      hi: 'नियंत्रण एवं समन्वय',
      hinglish: 'Control and Coordination',
    },
    description: {
      en: 'Neuron structure, synapse, reflex arc, human brain divisions, plant hormones (auxin, gibberellin, cytokinin, abscisic acid), tropic movements, and endocrine glands.',
      hi: 'तंत्रिका कोशिका (न्यूरॉन), सिनैप्स, प्रतिवर्ती चाप, मानव मस्तिष्क, पादप हार्मोन (ऑक्सिन, जिबरेलिन, साइटोकाइनिन, एब्सिसिक अम्ल), अनुवर्तन गतियाँ तथा अंतःस्रावी ग्रंथियाँ।',
      hinglish: 'Neuron, brain functions, plant hormones aur reflex action.',
    },
    targetMastery: 90,
    highYieldWeightage: 7,
    textbookRef: 'NCERT Science Class 10 Chapter 6 / UPMSP Vigyan Ch 6',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_reflex_arc_plant_hormones',
        title: {
          en: 'Reflex Arc & Plant Hormones (Auxin, Cytokinin, ABA)',
          hi: 'प्रतिवर्ती चाप एवं पादप हार्मोन',
          hinglish: 'Reflex Arc & Phytohormones',
        },
        summary: {
          en: 'A reflex arc is the neural pathway that mediates a reflex action (Receptor → Sensory Neuron → Spinal Cord Relay → Motor Neuron → Effector). In plants, auxin promotes cell elongation and phototropism, cytokinin promotes cell division, and abscisic acid (ABA) inhibits growth and causes leaf wilting.',
          hi: 'प्रतिवर्ती चाप: ग्राही → संवेदी न्यूरॉन → मेरुरज्जु → प्रेरक न्यूरॉन → कार्यकर अंग। पादपों में ऑक्सिन प्ररोह वृद्धि, साइटोकाइनिन कोशिका विभाजन, और एब्सिसिक अम्ल वृद्धि मंदन (पत्तियों का मुरझाना) करता है।',
          hinglish: 'Reflex arc direct spinal cord se operate hoti hai fast action ke liye. Auxin light ke opposite accumulate hota hai, ABA growth rokk kar wilting karta hai.',
        },
        formula: '\\text{Stimulus} \\rightarrow \\text{Receptor} \\rightarrow \\text{Sensory Neuron} \\rightarrow \\text{Spinal Relay} \\rightarrow \\text{Motor Neuron} \\rightarrow \\text{Effector}',
        keyPoints: [
          {
            en: 'Reflex arcs evolved in animals because the thinking process of the forebrain is not fast enough to prevent injury.',
            hi: 'प्रतिवर्ती चाप इसलिए विकसित हुआ ताकि मस्तिष्क के सोचने से पहले ही आपात स्थिति में प्रतिक्रिया हो सके।',
            hinglish: 'Quick spinal reflex prevents body damage before conscious thought.',
          },
          {
            en: 'Auxin diffuses to the shaded side of plant shoots, causing cells on the dark side to elongate faster and bend the shoot toward light.',
            hi: 'ऑक्सिन छाया वाले भाग की कोशिकाओं को अधिक लंबा करता है जिससे तना प्रकाश की ओर झुक जाता है।',
            hinglish: 'Phototropism is driven by auxin accumulation on shaded side.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'Which plant hormone is primarily responsible for inhibiting growth and causing the wilting of leaves?',
            hi: 'पत्तियों के मुरझाने और वृद्धि को मंद करने के लिए कौन सा पादप हार्मोन उत्तरदायी है?',
            hinglish: 'Kaunsa plant hormone growth inhibit karke leaves wilting induce karta hai?',
          },
          options: [
            { en: 'Abscisic Acid (ABA)', hi: 'एब्सिसिक अम्ल (ABA)', hinglish: 'Abscisic Acid (ABA)' },
            { en: 'Auxin', hi: 'ऑक्सिन', hinglish: 'Auxin' },
            { en: 'Gibberellin', hi: 'जिबरेलिन', hinglish: 'Gibberellin' },
            { en: 'Cytokinin', hi: 'साइटोकाइनिन', hinglish: 'Cytokinin' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Abscisic acid (ABA) is a growth inhibitor hormone that induces dormancy, stomatal closure under stress, and leaf fall/wilting.',
            hi: 'एब्सिसिक अम्ल (ABA) वृद्धि निरोधक हार्मोन है जो पत्तियों को मुरझाने के लिए प्रेरित करता है।',
            hinglish: 'ABA is the primary plant growth inhibitor and stress hormone.',
          }
        },
      },
    ],
  },

  // Chapter 7
  {
    id: 'c10_sci_ch7_how_organisms_reproduce',
    subjectId: 'class10_science',
    chapterNo: 7,
    title: {
      en: 'How do Organisms Reproduce?',
      hi: 'जीव जनन कैसे करते हैं?',
      hinglish: 'How do Organisms Reproduce?',
    },
    description: {
      en: 'Asexual reproduction modes (binary fission, budding, spore formation, regeneration), sexual reproduction in flowering plants, human male and female reproductive systems, and contraception methods.',
      hi: 'अलैंगिक जनन की विधियाँ (द्विखंडन, मुकुलन, बीजाणु समासंघ, पुनरुद्भवन), पुष्पी पौधों में लैंगिक जनन, मानव जनन तंत्र तथा गर्भनिरोधक विधियाँ।',
      hinglish: 'Asexual vs sexual reproduction, flower pollination aur human reproduction.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Science Class 10 Chapter 7 / UPMSP Vigyan Ch 7',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_plant_flower_fertilization',
        title: {
          en: 'Pollination & Double Fertilization in Flowering Plants',
          hi: 'पुष्पी पौधों में परागण एवं दोहरा निषेचन',
          hinglish: 'Flower Pollination & Fertilization',
        },
        summary: {
          en: 'Pollination is the transfer of pollen grains from anther to stigma. The pollen tube delivers male gametes to the embryo sac: one fertilizes the egg cell to form the diploid zygote, while the second fuses with two polar nuclei to form the triploid endosperm (double fertilization).',
          hi: 'परागकणों का परागकोश से वर्तिकाग्र पर पहुँचना परागण कहलाता है। पराग नली दो नर युग्मक लाती है: एक अंड से मिलकर युग्मनज बनाता है और दूसरा ध्रुवीय केंद्रकों से मिलकर भ्रूणपोष बनाता है।',
          hinglish: 'Pollen tube delivers 2 male gametes: one forms zygote, second forms triploid endosperm.',
        },
        formula: '\\text{Male Gamete} + \\text{Egg} \\rightarrow \\text{Zygote} (2n), \\quad \\text{Male Gamete} + 2\\text{ Polar Nuclei} \\rightarrow \\text{Endosperm} (3n)',
        keyPoints: [
          {
            en: 'After fertilization, the ovary ripens into a fruit and the ovules develop into tough seeds.',
            hi: 'निषेचन के बाद अंडाशय फल बनता है और बीजांड बीज में परिवर्तित होते हैं।',
            hinglish: 'Ovary develops into fruit, ovules into seeds.',
          },
          {
            en: 'Contraceptive barrier methods like condoms protect against sexually transmitted infections (STIs) such as HIV-AIDS.',
            hi: 'कंडोम जैसे रोधक साधन एचआईवी जैसी यौन संचारित बीमारियों से सुरक्षा प्रदान करते हैं।',
            hinglish: 'Barrier methods prevent both pregnancy and STIs.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Following successful fertilization in a flower, which floral part develops into the fruit?',
            hi: 'पुष्प में निषेचन के पश्चात कौन सा भाग फल के रूप में विकसित होता है?',
            hinglish: 'Flower me fertilization ke baad fruit me kaunsa part convert hota hai?',
          },
          options: [
            { en: 'Ovary', hi: 'अंडाशय (Ovary)', hinglish: 'Ovary' },
            { en: 'Ovule', hi: 'बीजांड (Ovule)', hinglish: 'Ovule' },
            { en: 'Stigma', hi: 'वर्तिकाग्र (Stigma)', hinglish: 'Stigma' },
            { en: 'Petals', hi: 'दलपुंज (Petals)', hinglish: 'Petals' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'The ovary grows rapidly and ripens to form the fruit, while the ovules inside form the seeds.',
            hi: 'अंडाशय विकसित होकर फल बनता है तथा बीजांड बीज बनाते हैं।',
            hinglish: 'Ovary becomes fruit, ovules become seeds.',
          }
        },
      },
    ],
  },

  // Chapter 8
  {
    id: 'c10_sci_ch8_heredity',
    subjectId: 'class10_science',
    chapterNo: 8,
    title: {
      en: 'Heredity',
      hi: 'आनुवंशिकता',
      hinglish: 'Heredity',
    },
    description: {
      en: 'Accumulation of variations, Mendel’s laws of inheritance (Monohybrid 3:1 ratio and Dihybrid 9:3:3:1 ratio), dominant vs recessive traits, and human chromosomal sex determination (XX and XY).',
      hi: 'विभिन्नताओं का संचयन, मेंडल के आनुवंशिकता के नियम (एकसंकर 3:1 तथा द्विसंकर 9:3:3:1 अनुपात), प्रभावी व अप्रभावी लक्षण, तथा मानव में लिंग निर्धारण (XX एवं XY)।',
      hinglish: 'Mendel laws, Punnett square ratios aur XX/XY sex determination.',
    },
    targetMastery: 90,
    highYieldWeightage: 7,
    textbookRef: 'NCERT Science Class 10 Chapter 8 / UPMSP Vigyan Ch 8',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_mendel_sex_determination',
        title: {
          en: 'Mendel’s Crosses & Chromosomal Sex Determination in Humans',
          hi: 'मेंडल के संकरण प्रयोग एवं मानव में लिंग निर्धारण',
          hinglish: 'Mendelian Ratios & Human Sex Determination',
        },
        summary: {
          en: 'Mendel’s monohybrid cross between pure tall (TT) and pure dwarf (tt) gives an F2 phenotypic ratio of 3:1 (genotypic 1:2:1). In humans, sex is determined chromosomally: females possess XX chromosomes, while males possess XY. A sperm carrying an X chromosome results in a female child (XX), while a sperm carrying a Y chromosome results in a male child (XY).',
          hi: 'मेंडल के एकसंकर F2 में लक्षणप्ररूपी अनुपात 3:1 और जीनप्ररूपी अनुपात 1:2:1 होता है। मानव में माता के पास केवल X गुणसूत्र होते हैं, अतः बच्चे का लिंग पिता से प्राप्त शुक्राणु (X या Y) पर निर्भर करता है।',
          hinglish: 'Monohybrid F2 phenotype is 3:1. Child gender depends strictly on father’s sperm (X or Y), giving 50% probability.',
        },
        formula: '\\text{F2 Monohybrid Phenotype} = 3:1, \\quad \\text{F2 Dihybrid Phenotype} = 9:3:3:1, \\quad \\text{Mother (XX)} \\times \\text{Father (XY)} \\rightarrow 50\\% \\text{ XX}, 50\\% \\text{ XY}',
        keyPoints: [
          {
            en: 'All human eggs contain one X chromosome. The sperm supplies either an X or a Y chromosome, making the father’s gamete genetically decisive for the child’s sex.',
            hi: 'सभी अंडों में X गुणसूत्र होता है। पिता का शुक्राणु X या Y प्रदान करता है, अतः बच्चे का लिंग पिता के गुणसूत्र पर निर्भर करता है।',
            hinglish: 'Father contributes X or Y; mother always gives X.',
          },
          {
            en: 'Recessive traits are only expressed phenotypically in the homozygous condition (tt).',
            hi: 'अप्रभावी लक्षण केवल समयुग्मजी अवस्था (tt) में ही अभिव्यक्त होते हैं।',
            hinglish: 'Recessive alleles need both copies to show trait.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'What is the statistical probability of a human couple conceiving a male child in any given pregnancy?',
            hi: 'किसी भी गर्भधारण में मानव दंपत्ति के पुत्र होने की सांख्यिकीय प्रायिकता क्या है?',
            hinglish: 'Har pregnancy me male child hone ki statistical probability kitni hoti hai?',
          },
          options: [
            { en: '50% (1 in 2)', hi: '50% (2 में से 1)', hinglish: '50% (1/2)' },
            { en: '25% (1 in 4)', hi: '25% (4 में से 1)', hinglish: '25% (1/4)' },
            { en: '75% (3 in 4)', hi: '75% (4 में से 3)', hinglish: '75% (3/4)' },
            { en: '100%', hi: '100%', hinglish: '100%' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Half of all viable sperms carry an X chromosome and half carry a Y chromosome, resulting in exactly a 50% chance (1:1 ratio) for male or female.',
            hi: '50% शुक्राणु X तथा 50% Y गुणसूत्र वाले होते हैं, अतः पुत्र या पुत्री की संभावना 50% होती है।',
            hinglish: 'Male produces equal numbers of X and Y sperms: 50% probability.',
          }
        },
      },
    ],
  },

  // Chapter 9
  {
    id: 'c10_sci_ch9_light',
    subjectId: 'class10_science',
    chapterNo: 9,
    title: {
      en: 'Light – Reflection and Refraction',
      hi: 'प्रकाश – परावर्तन तथा अपवर्तन',
      hinglish: 'Light – Reflection & Refraction',
      bn: 'আলো - প্রতিফলন ও প্রতিসরণ',
    },
    description: {
      en: 'Spherical mirrors (concave and convex), mirror formula and magnification, laws of refraction and Snell’s law, refractive index, spherical lenses, lens formula, and power of a lens.',
      hi: 'गोलीय दर्पण, दर्पण सूत्र एवं आवर्धन, अपवर्तन के नियम एवं स्नेल का नियम, अपवर्तनांक, लेंस सूत्र एवं लेंस की क्षमता।',
      hinglish: 'Mirror formula, Snell’s law, Lens formula aur Lens power P = 1/f.',
    },
    targetMastery: 90,
    highYieldWeightage: 10,
    textbookRef: 'NCERT Science Class 10 Chapter 9 / UPMSP Vigyan Ch 9',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_mirror_lens_formula',
        title: {
          en: 'Mirror Formula, Lens Formula & Optical Power',
          hi: 'दर्पण सूत्र, लेंस सूत्र एवं प्रकाशिक क्षमता',
          hinglish: 'Mirror & Lens Formulas & Optical Power',
        },
        summary: {
          en: 'Mirror formula is 1/f = 1/v + 1/u, while Lens formula is 1/f = 1/v - 1/u (using Cartesian sign conventions: object distance u is always negative). Optical power P of a lens is the reciprocal of focal length in meters: P = 1/f(m), measured in Dioptres (D). Converging lenses have positive power, diverging lenses have negative power.',
          hi: 'दर्पण सूत्र 1/f = 1/v + 1/u तथा लेंस सूत्र 1/f = 1/v - 1/u होता है। लेंस की क्षमता P = 1/f (मीटर में) होती है, जिसका मात्रक डायोप्टर (D) है। उत्तल लेंस की क्षमता धनात्मक तथा अवतल की ऋणात्मक होती है।',
          hinglish: 'Mirror: 1/f = 1/v + 1/u. Lens: 1/f = 1/v - 1/u. Power P = 1/f (in meters).',
        },
        formula: '\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u} \\quad (\\text{Mirror}), \\quad \\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u} \\quad (\\text{Lens}), \\quad P = \\frac{1}{f\\,(\\text{m})}',
        keyPoints: [
          {
            en: 'According to Cartesian sign conventions, object distance u is ALWAYS negative.',
            hi: 'चिह्न परिपाटी के अनुसार बिंब दूरी u सदैव ऋणात्मक ली जाती है।',
            hinglish: 'Object distance u hamesha negative (-ve) li jati hai.',
          },
          {
            en: 'A convex lens of focal length +25 cm has optical power P = 1 / 0.25 m = +4.0 D.',
            hi: '+25 सेमी फोकस दूरी वाले उत्तल लेंस की क्षमता P = 1 / 0.25 = +4 D होती है।',
            hinglish: 'f = +25 cm = +0.25 m → P = +4 D.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'A doctor prescribes a corrective lens of power -2.0 D. What is the focal length and nature of this lens?',
            hi: 'एक नेत्र चिकित्सक -2.0 D क्षमता का संशोधक लेंस निर्धारित करता है। लेंस की फोकस दूरी तथा प्रकृति क्या है?',
            hinglish: 'Doctor -2.0 D power ka lens prescribe karta hai. Lens ki focal length aur nature kya hai?',
          },
          options: [
            { en: 'f = -50 cm, Concave (Diverging)', hi: 'f = -50 सेमी, अवतल (अपसारी)', hinglish: 'f = -50 cm, Concave (Diverging)' },
            { en: 'f = +50 cm, Convex (Converging)', hi: 'f = +50 सेमी, उत्तल (अभिसारी)', hinglish: 'f = +50 cm, Convex (Converging)' },
            { en: 'f = -20 cm, Concave (Diverging)', hi: 'f = -20 सेमी, अवतल (अपसारी)', hinglish: 'f = -20 cm, Concave (Diverging)' },
            { en: 'f = +20 cm, Convex (Converging)', hi: 'f = +20 सेमी, उत्तल (अभिसारी)', hinglish: 'f = +20 cm, Convex (Converging)' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Focal length f = 1 / P = 1 / (-2.0 D) = -0.5 m = -50 cm. A negative focal length corresponds to a concave (diverging) lens used to correct myopia.',
            hi: 'f = 1 / P = 1 / (-2.0) = -0.5 मीटर = -50 सेमी। ऋणात्मक फोकस दूरी अवतल (अपसारी) लेंस को दर्शाती है जो निकट-दृष्टि दोष को ठीक करता है।',
            hinglish: 'f = 1/P = 1/-2 = -0.5 m = -50 cm. Negative power means concave lens.',
          }
        },
      },
    ],
  },

  // Chapter 10
  {
    id: 'c10_sci_ch10_human_eye',
    subjectId: 'class10_science',
    chapterNo: 10,
    title: {
      en: 'The Human Eye & the Colourful World',
      hi: 'मानव नेत्र तथा रंगबिरंगा संसार',
      hinglish: 'Human Eye & Colourful World',
    },
    description: {
      en: 'Structure of the human eye, power of accommodation, defects of vision (myopia, hypermetropia, presbyopia) and corrections, refraction through glass prism, dispersion of white light, atmospheric refraction, and scattering (Tyndall effect).',
      hi: 'मानव नेत्र की संरचना, समंजन क्षमता, दृष्टि दोष (निकट, दूर एवं जरा-दूरदृष्टिता) और निवारण, प्रिज्म से अपवर्तन, विक्षेपण, वायुमंडलीय अपवर्तन तथा प्रकीर्णन (टिंडल प्रभाव)।',
      hinglish: 'Eye defects and corrections, prism dispersion aur scattering of light.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Science Class 10 Chapter 10 / UPMSP Vigyan Ch 10',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_vision_defects_dispersion',
        title: {
          en: 'Defects of Vision (Myopia, Hypermetropia) & Light Scattering',
          hi: 'दृष्टि दोष (निकट व दूरदृष्टि दोष) एवं प्रकाश प्रकीर्णन',
          hinglish: 'Eye Defects & Scattering of Light',
        },
        summary: {
          en: 'In Myopia (near-sightedness), distant images form in front of the retina, corrected using a concave lens of appropriate power. In Hypermetropia (far-sightedness), near images form behind the retina, corrected using a convex lens. The blue color of the clear sky and red sunsets are caused by Rayleigh scattering: scattering intensity is inversely proportional to the fourth power of wavelength (I ∝ 1/λ⁴).',
          hi: 'निकट-दृष्टि दोष में दूर की वस्तु का प्रतिबिंब रेटिना के आगे बनता है (अवतल लेंस से निवारण)। दूर-दृष्टि दोष में रेटिना के पीछे बनता है (उत्तल लेंस से निवारण)। आकाश का नीला रंग प्रकाश के प्रकीर्णन (I ∝ 1/λ⁴) के कारण होता है।',
          hinglish: 'Myopia = concave lens correction. Hypermetropia = convex lens correction. Blue sky = Rayleigh scattering (shorter blue wavelength scatters most).',
        },
        formula: 'I \\propto \\frac{1}{\\lambda^4} \\quad (\\text{Rayleigh Scattering Law}), \\quad P = \\frac{1}{f}',
        keyPoints: [
          {
            en: 'Blue light has a shorter wavelength (~400 nm) and is scattered nearly 16 times more effectively than red light (~700 nm).',
            hi: 'नीले प्रकाश की तरंगदैर्ध्य कम होने से वह लाल प्रकाश की तुलना में लगभग 16 गुना अधिक प्रकीर्णित होता है।',
            hinglish: 'Shorter wavelength scatters much more strongly.',
          },
          {
            en: 'Twinkling of stars and early sunrise/delayed sunset by ~2 minutes are caused by continuous atmospheric refraction.',
            hi: 'तारों का टिमटिमाना तथा अग्रिम सूर्योदय व विलंबित सूर्यास्त वायुमंडलीय अपवर्तन के कारण होते हैं।',
            hinglish: 'Atmospheric refraction causes twinkling and 2-min advance sunrise.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'Why do danger signal lights installed on towers and traffic signals always use red colored light?',
            hi: 'खतरे के संकेतों में लाल रंग के प्रकाश का उपयोग क्यों किया जाता है?',
            hinglish: 'Danger signals me hamesha red color ka light kyun use kiya jata hai?',
          },
          options: [
            { en: 'Red light has the longest visible wavelength and is least scattered by fog or smoke', hi: 'लाल रंग की तरंगदैर्ध्य सर्वाधिक होती है अतः कोहरे या धुएँ में सबसे कम प्रकीर्णित होता है', hinglish: 'Red light has longest wavelength, so least scattered by fog' },
            { en: 'Red light is completely absorbed by atmospheric gases', hi: 'लाल रंग वायुमंडल में पूरी तरह अवशोषित हो जाता है', hinglish: 'Red light absorb ho jati hai' },
            { en: 'Red light travels much faster than all other colors in vacuum', hi: 'लाल रंग निर्वात में सबसे तेज चलता है', hinglish: 'Red light faster move karti hai' },
            { en: 'Human eyes have zero sensitivity to all colors except red', hi: 'मानव आँख केवल लाल रंग देख सकती है', hinglish: 'Eyes only sensitive to red' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Because red light has the longest wavelength among visible colors, according to Rayleigh’s law it is scattered least by air and smoke particles, remaining visible from long distances.',
            hi: 'लाल रंग की तरंगदैर्ध्य सबसे अधिक होने से प्रकीर्णन सबसे कम होता है और वह दूर से भी साफ दिखाई देता है।',
            hinglish: 'Longest wavelength = least scattered, travels through fog over long distances.',
          }
        },
      },
    ],
  },

  // Chapter 11
  {
    id: 'c10_sci_ch11_electricity',
    subjectId: 'class10_science',
    chapterNo: 11,
    title: {
      en: 'Electricity, Ohm’s Law & Circuits',
      hi: 'विद्युत, ओम का नियम एवं परिपथ',
      hinglish: 'Electricity, Ohm’s Law & Circuits',
      bn: 'তড়িৎ ও ওহমের সূত্র',
    },
    description: {
      en: 'Electric current and potential difference, Ohm’s law, resistance factors, resistors in series and parallel, Joule’s law of heating, and commercial electric power.',
      hi: 'विद्युत धारा एवं विभवांतर, ओम का नियम, प्रतिरोध की निर्भरता, श्रेणी व समान्तर संयोजन, जूल का तापन नियम तथा विद्युत शक्ति।',
      hinglish: 'Ohm’s law V = IR, series-parallel combinations, Joule heating H = I²Rt.',
    },
    targetMastery: 90,
    highYieldWeightage: 10,
    textbookRef: 'NCERT Science Class 10 Chapter 11 / UPMSP Vigyan Ch 12',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_ohms_law',
        title: {
          en: 'Ohm’s Law & Factors Affecting Conductor Resistance',
          hi: 'ओम का नियम एवं चालक के प्रतिरोध को प्रभावित करने वाले कारक',
          hinglish: 'Ohm’s Law & Factors Affecting Resistance',
        },
        summary: {
          en: 'At constant temperature, current I flowing through a metallic conductor is directly proportional to the potential difference V across its terminals: V = IR. Resistance is directly proportional to length L, inversely proportional to cross-sectional area A, and depends on material resistivity ρ: R = ρ(L/A).',
          hi: 'नियत ताप पर चालक तार में प्रवाहित धारा उसके सिरों के विभवांतर के समानुपाती होती है: V = IR। प्रतिरोध R = ρ(L/A) होता है।',
          hinglish: 'Constant temperature par V = IR. Resistance R = ρ(L/A).',
        },
        formula: 'V = I R, \\quad R = \\rho \\frac{L}{A}, \\quad H = I^2 R t, \\quad P = V I = \\frac{V^2}{R}',
        keyPoints: [
          {
            en: 'Doubling wire length doubles resistance; doubling cross-sectional area halves resistance.',
            hi: 'लंबाई दोगुनी करने पर प्रतिरोध दोगुना और क्षेत्रफल दोगुना करने पर प्रतिरोध आधा होता है।',
            hinglish: 'R ∝ L and R ∝ 1/A.',
          },
          {
            en: 'Domestic electrical appliances are connected in parallel so each receives full 220 V and operates independently.',
            hi: 'घरेलू वायरिंग समान्तर क्रम में की जाती है ताकि सभी को 220 V मिले और अलग स्विच हो।',
            hinglish: 'Parallel wiring ensures identical 220V supply and independent control.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'A wire of resistance R is stretched to double its original length keeping volume constant. What is its new resistance?',
            hi: 'R प्रतिरोध के एक तार को खींचकर आयतन नियत रखते हुए उसकी लंबाई दोगुनी कर दी जाती है। नया प्रतिरोध क्या होगा?',
            hinglish: 'R resistance wale wire ko stretch karke length double karne par new resistance kitna hoga?',
          },
          options: [
            { en: '4 R', hi: '4 R', hinglish: '4 R' },
            { en: '2 R', hi: '2 R', hinglish: '2 R' },
            { en: 'R / 2', hi: 'R / 2', hinglish: 'R / 2' },
            { en: 'R / 4', hi: 'R / 4', hinglish: 'R / 4' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'When stretched to 2L, constant volume V = A·L requires the area to become A/2. New resistance R’ = ρ(2L)/(A/2) = 4 · ρ(L/A) = 4R.',
            hi: 'लंबाई 2L होने पर आयतन नियत रहने से क्षेत्रफल A/2 हो जाता है। नया प्रतिरोध R’ = ρ(2L)/(A/2) = 4R।',
            hinglish: 'Length doubled (2x) and area halved (/2) → 2/(1/2) = 4x resistance.',
          }
        },
      },
    ],
  },

  // Chapter 12
  {
    id: 'c10_sci_ch12_magnetic_effects',
    subjectId: 'class10_science',
    chapterNo: 12,
    title: {
      en: 'Magnetic Effects of Electric Current',
      hi: 'विद्युत धारा के चुंबकीय प्रभाव',
      hinglish: 'Magnetic Effects of Electric Current',
    },
    description: {
      en: 'Magnetic field and field lines, field around straight conductor and circular loop, Right Hand Thumb Rule, magnetic force on current-carrying conductor, Fleming’s Left Hand Rule, electric motor, and domestic circuits (fuse & earthing).',
      hi: 'चुंबकीय क्षेत्र एवं क्षेत्र रेखाएँ, सीधे चालक व वृत्ताकार पाश का क्षेत्र, दक्षिण हस्त अंगुष्ठ नियम, चुंबकीय बल, फ्लेमिंग का वाम हस्त नियम, विद्युत मोटर तथा घरेलू विद्युत परिपथ (फ्यूज व भू-तार)।',
      hinglish: 'Magnetic field lines, Right Hand Thumb rule, Fleming’s Left Hand rule aur earthing wire.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Science Class 10 Chapter 12 / UPMSP Vigyan Ch 13',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_flemings_left_hand_earthing',
        title: {
          en: 'Fleming’s Left Hand Rule & Safety Earthing in Domestic Circuits',
          hi: 'फ्लेमिंग का वाम-हस्त नियम एवं घरेलू परिपथ में भूसंपर्कन (Earthing)',
          hinglish: 'Fleming’s Left Hand Rule & Domestic Circuit Earthing',
        },
        summary: {
          en: 'Fleming’s Left Hand Rule determines the direction of force on a current-carrying conductor in a magnetic field: Thumb represents Force, Forefinger represents Magnetic Field, and Middle finger represents Current. The earth wire (green insulation) conducts accidental leakage current to the ground, preventing severe electric shocks.',
          hi: 'फ्लेमिंग के वाम-हस्त नियम में अंगूठा बल की दिशा, तर्जनी चुंबकीय क्षेत्र तथा मध्यमा विद्युत धारा की दिशा दर्शाती है। हरा भूसंपर्क तार धातु आवरण से लीक धारा को भूमि में पहुँचाकर झटके से बचाता है।',
          hinglish: 'Left hand rule: Thumb=Motion/Force, Forefinger=Field, Center finger=Current. Green earthing wire safely discharges shock leakage.',
        },
        formula: 'F = B I L \\sin\\theta, \\quad \\text{Thumb (F), Forefinger (B), Middle (I)}',
        keyPoints: [
          {
            en: 'Magnetic field lines never intersect each other because that would imply two different field directions at the same point.',
            hi: 'दो चुंबकीय क्षेत्र रेखाएं कभी एक-दूसरे को नहीं काटतीं क्योंकि कटान बिंदु पर दो दिशाएं असंभव हैं।',
            hinglish: 'Field lines never cross each other.',
          },
          {
            en: 'An electric fuse works on the heating effect of electric current (H = I²Rt) and is always placed in the live wire.',
            hi: 'विद्युत फ्यूज सदैव विद्युन्मय (लाइव) तार में जोड़ा जाता है।',
            hinglish: 'Fuse must always be connected in the live wire.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'According to Fleming’s Left Hand Rule, what direction does the forefinger point toward?',
            hi: 'फ्लेमिंग के वाम-हस्त नियम के अनुसार तर्जनी अंगुली किस दिशा का संकेत करती है?',
            hinglish: 'Fleming ke Left Hand Rule ke mutabik forefinger kis direction ko point karti hai?',
          },
          options: [
            { en: 'Direction of Magnetic Field', hi: 'चुंबकीय क्षेत्र की दिशा', hinglish: 'Magnetic Field direction' },
            { en: 'Direction of Force / Motion', hi: 'चालक पर लगने वाले बल की दिशा', hinglish: 'Force / Motion direction' },
            { en: 'Direction of Electric Current', hi: 'विद्युत धारा की दिशा', hinglish: 'Electric Current direction' },
            { en: 'Direction of Induced Voltage', hi: 'प्रेरित विभवांतर की दिशा', hinglish: 'Induced Voltage direction' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'In Fleming’s Left Hand Rule: Forefinger = Field, Middle finger = Current, Thumb = Motion/Force.',
            hi: 'तर्जनी चुंबकीय क्षेत्र (Field), मध्यमा धारा (Current) तथा अंगूठा बल (Force) को दर्शाता है।',
            hinglish: 'Forefinger = Field (B).',
          }
        },
      },
    ],
  },

  // Chapter 13
  {
    id: 'c10_sci_ch13_our_environment',
    subjectId: 'class10_science',
    chapterNo: 13,
    title: {
      en: 'Our Environment',
      hi: 'हमारा पर्यावरण',
      hinglish: 'Our Environment',
    },
    description: {
      en: 'Ecosystem components, trophic levels, food chains and food webs, 10% law of energy transfer, biological magnification of pesticides, ozone layer depletion by CFCs, and municipal waste management.',
      hi: 'पारितंत्र के घटक, पोषी स्तर, आहार शृंखला एवं खाद्य जाल, 10% ऊर्जा स्थानांतरण नियम, जैव आवर्धन, सीएफसी द्वारा ओजोन परत क्षरण, तथा कचरा प्रबंधन।',
      hinglish: 'Ecosystem food chains, 10% energy law, biomagnification aur ozone layer depletion.',
    },
    targetMastery: 90,
    highYieldWeightage: 6,
    textbookRef: 'NCERT Science Class 10 Chapter 13 / UPMSP Vigyan Ch 14',
    classLevel: '10',
    concepts: [
      {
        id: 'c10_concept_trophic_levels_ozone',
        title: {
          en: '10% Energy Transfer Law & Biological Magnification',
          hi: '10% ऊर्जा स्थानांतरण नियम एवं जैव आवर्धन',
          hinglish: '10% Energy Law & Biomagnification',
        },
        summary: {
          en: 'According to Lindeman’s 10% Law, only 10% of energy entering a trophic level is transferred to the next higher level; 90% is lost as metabolic heat. Biological magnification is the progressive accumulation of non-biodegradable chemicals (like DDT) at progressively higher trophic levels, reaching highest concentrations in top predators and humans.',
          hi: 'लिंडमान के 10% नियम के अनुसार केवल 10% ऊर्जा अगले पोषी स्तर को मिलती है। जैव आवर्धन वह प्रक्रिया है जिसमें अजैव निम्नीकरणीय कीटनाशक उच्च पोषी स्तरों (शीर्ष पर स्थित मानव) में सर्वाधिक सांद्रता में जमा होते हैं।',
          hinglish: 'Only 10% energy moves to next level. Non-biodegradable toxins reach highest concentration in top consumer (biomagnification).',
        },
        formula: '\\text{Energy Available at Trophic Level } (n+1) = 0.10 \\times \\text{Energy at Level } (n)',
        keyPoints: [
          {
            en: 'Food chains rarely exceed 4 to 5 trophic levels because available energy becomes too small to support another level.',
            hi: 'आहार शृंखला में सामान्यतः 3-4 स्तर ही होते हैं क्योंकि ऊर्जा अत्यंत कम बचती है।',
            hinglish: 'Available energy diminishes sharply, limiting chain length to 4-5 steps.',
          },
          {
            en: 'Ozone (O₃) in the stratosphere shields Earth from harmful solar UV-B radiation; it was depleted by chlorofluorocarbons (CFCs).',
            hi: 'ओजोन परत पराबैंगनी विकिरण से रक्षा करती है जिसे सीएफसी (क्लोरोफ्लोरोकार्बन) नुकसान पहुँचाते हैं।',
            hinglish: 'Ozone layer absorbs harmful ultraviolet rays.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'If 10,000 Joules of solar energy is captured by green plants (producers), how much energy will be available to the secondary consumers in a 3-step food chain?',
            hi: 'यदि उत्पादक हरे पौधे 10,000 जूल ऊर्जा संचित करते हैं, तो तृतीय पोषी स्तर (द्वितीयक उपभोक्ता) को कितनी ऊर्जा मिलेगी?',
            hinglish: 'Agar producers ke paas 10,000 J energy hai, toh secondary consumer ko kitni energy milegi?',
          },
          options: [
            { en: '100 Joules', hi: '100 जूल', hinglish: '100 Joules' },
            { en: '1,000 Joules', hi: '1,000 जूल', hinglish: '1,000 Joules' },
            { en: '10 Joules', hi: '10 जूल', hinglish: '10 Joules' },
            { en: '1 Joule', hi: '1 जूल', hinglish: '1 Joule' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Producers: 10,000 J. Primary consumers receive 10%: 1,000 J. Secondary consumers receive 10% of that: 100 J.',
            hi: 'उत्पादक: 10,000 J → प्राथमिक उपभोक्ता: 1,000 J → द्वितीयक उपभोक्ता: 100 J।',
            hinglish: '10,000 × 0.10 = 1,000 J (Primary) → 1,000 × 0.10 = 100 J (Secondary).',
          }
        },
      },
    ],
  },
];
