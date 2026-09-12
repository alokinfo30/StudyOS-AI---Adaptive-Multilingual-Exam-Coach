import { Chapter } from '../../types';

/**
 * Complete Class 12 Chemistry Curriculum (All 10 Chapters)
 * Rationalized NCERT 2025-26, CBSE, UPMSP, BSEB & National/State Boards
 */
export const CLASS_12_CHEMISTRY_ALL_CHAPTERS: Chapter[] = [
  // Chapter 1
  {
    id: 'c12_chem_ch1_solutions',
    subjectId: 'class12_chemistry',
    chapterNo: 1,
    title: {
      en: 'Solutions',
      hi: 'विलयन',
      hinglish: 'Solutions',
    },
    description: {
      en: 'Types of solutions, Henry’s law, Raoult’s law for ideal & non-ideal solutions, colligative properties (relative lowering of vapor pressure, elevation of boiling point, depression of freezing point, osmotic pressure), van ’t Hoff factor (i), and abnormal molar mass.',
      hi: 'विलयनों के प्रकार, हेनरी का नियम, राउल्ट का नियम, आदर्श व अनादर्श विलयन, अणुसंख्य गुणधर्म (वाष्प दाब का आपेक्षिक अवनमन, क्वथनांक उन्नयन, हिमांक अवनमन, परासरण दाब), वांट हॉफ गुणांक (i) तथा असामान्य मोलर द्रव्यमान।',
      hinglish: 'Raoult’s law, colligative properties, osmotic pressure π = CRT, van ’t Hoff factor i.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Chemistry Part 1 Class 12 Ch 1 / UPMSP Rasayan Vigyan Ch 1',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_colligative_properties_vanthoff',
        title: {
          en: 'Colligative Properties & van ’t Hoff Factor (i)',
          hi: 'अणुसंख्य गुणधर्म एवं वांट हॉफ गुणांक (i)',
          hinglish: 'Colligative Properties & van ’t Hoff Factor',
        },
        summary: {
          en: 'Colligative properties depend solely on the number of solute particles, not their chemical nature. They are: Relative Lowering of Vapor Pressure (ΔP/P₁° = i x₂), Boiling Point Elevation (ΔTb = i Kb m), Freezing Point Depression (ΔTf = i Kf m), and Osmotic Pressure (π = i CRT). For electrolytes that dissociate, i > 1; for associated solutes, i < 1. Degree of dissociation α = (i - 1) / (n - 1).',
          hi: 'अणुसंख्य गुणधर्म केवल विलेय के कणों की संख्या पर निर्भर करते हैं। क्वथनांक उन्नयन ΔTb = i Kb m, हिमांक अवनमन ΔTf = i Kf m, तथा परासरण दाब π = i CRT होता है। वियोजन के लिए i > 1 तथा संगुणन हेतु i < 1 होता है।',
          hinglish: 'Colligative properties depend only on number of solute particles. van ’t Hoff factor i accounts for dissociation or association.',
        },
        formula: '\\Delta T_b = i K_b m, \\quad \\Delta T_f = i K_f m, \\quad \\pi = i C R T, \\quad i = \\frac{\\text{Normal Molar Mass}}{\\text{Abnormal Molar Mass}} = 1 + (n-1)\\alpha',
        keyPoints: [
          {
            en: 'Osmotic pressure measurement is the best method for determining molecular weights of polymers, proteins, and biomolecules because measurements are performed at room temperature.',
            hi: 'बहुलक एवं प्रोटीनों के मोलर द्रव्यमान निर्धारण हेतु परासरण दाब विधि सर्वोत्तम है क्योंकि यह कमरे के तापमान पर ज्ञात की जाती है।',
            hinglish: 'Osmotic pressure is best for biomolecules as room temperature avoids denaturation.',
          },
          {
            en: 'Equimolar solutions of NaCl, CaCl₂, and Glucose do NOT have the same depression in freezing point: CaCl₂ (i ≈ 3) > NaCl (i ≈ 2) > Glucose (i = 1).',
            hi: 'CaCl₂ में 3 आयन बनते हैं अतः इसका हिमांक अवनमन ग्लूकोज से 3 गुना अधिक होता है।',
            hinglish: 'CaCl₂ (i=3) has greatest freezing point depression compared to NaCl (i=2) and glucose (i=1).',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Which of the following 0.1 M aqueous solutions will exhibit the lowest freezing point?',
            hi: 'निम्नलिखित में से किस 0.1 M जलीय विलयन का हिमांक सबसे कम होगा?',
            hinglish: 'Inme se kis 0.1 M aqueous solution ka freezing point sabse kam hoga?',
          },
          options: [
            { en: '0.1 M Al₂(SO₄)₃ (dissociates into 5 ions)', hi: '0.1 M Al₂(SO₄)₃ (5 आयनों में वियोजित)', hinglish: '0.1 M Al₂(SO₄)₃ (5 ions)' },
            { en: '0.1 M CaCl₂ (dissociates into 3 ions)', hi: '0.1 M CaCl₂ (3 आयनों में वियोजित)', hinglish: '0.1 M CaCl₂ (3 ions)' },
            { en: '0.1 M NaCl (dissociates into 2 ions)', hi: '0.1 M NaCl (2 आयनों में वियोजित)', hinglish: '0.1 M NaCl (2 ions)' },
            { en: '0.1 M Glucose (does not dissociate, i = 1)', hi: '0.1 M ग्लूकोज (अविद्युतअपघट्य, i = 1)', hinglish: '0.1 M Glucose (i = 1)' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Freezing point depression ΔTf = i Kf m. Al₂(SO₄)₃ produces 2 Al³⁺ + 3 SO₄²⁻ (n = 5 ions, i ≈ 5), causing the largest depression ΔTf and therefore the lowest actual freezing point.',
            hi: 'Al₂(SO₄)₃ के वियोजन से 5 आयन (i ≈ 5) बनते हैं। सर्वाधिक हिमांक अवनमन होने से इसका वास्तविक हिमांक न्यूनतम होगा।',
            hinglish: 'Highest i value (i ≈ 5) produces largest freezing depression, giving lowest freezing point.',
          }
        },
      },
    ],
  },

  // Chapter 2
  {
    id: 'c12_chem_ch2_electrochemistry',
    subjectId: 'class12_chemistry',
    chapterNo: 2,
    title: {
      en: 'Electrochemistry',
      hi: 'वैद्युतरसायन',
      hinglish: 'Electrochemistry',
    },
    description: {
      en: 'Galvanic cells, standard electrode potentials, Nernst equation, equilibrium constant from Nernst equation, conductivity and molar conductivity (Λm), Kohlrausch’s law, Faraday’s laws of electrolysis, dry cells, lead storage battery, fuel cells, and corrosion.',
      hi: 'गैल्वेनिक सेल, मानक इलेक्ट्रोड विभव, नेर्नस्ट समीकरण, साम्य स्थिरांक, चालकता एवं मोलर चालकता (Λm), कोलराउश का नियम, फैराडे के नियम, लेड संचायक सेल, तथा संक्षारण।',
      hinglish: 'Nernst equation E = E° - (0.0591/n) log Q, Kohlrausch’s law, molar conductivity.',
    },
    targetMastery: 90,
    highYieldWeightage: 9,
    textbookRef: 'NCERT Chemistry Part 1 Class 12 Ch 2 / UPMSP Rasayan Vigyan Ch 2',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_nernst_kohlrausch',
        title: {
          en: 'Nernst Equation & Kohlrausch’s Law of Independent Migration',
          hi: 'नेर्नस्ट समीकरण एवं कोलराउश का स्वतंत्र अभिगमन नियम',
          hinglish: 'Nernst Equation & Kohlrausch’s Law',
        },
        summary: {
          en: 'The Nernst equation gives cell potential under non-standard conditions at 298 K: E_cell = E°_cell - (0.0591 / n) log₁₀ Q. At equilibrium, E_cell = 0 and log K_c = (n E°_cell) / 0.0591. Kohlrausch’s law states that limiting molar conductivity of an electrolyte is the sum of limiting ionic conductivities of its constituent ions: Λ°m = ν₊ λ°₊ + ν₋ λ°₋.',
          hi: 'नेर्नस्ट समीकरण: E_cell = E°_cell - (0.0591/n) log Q। कोलराउश का नियम: अनंत तनुता पर किसी विद्युतअपघट्य की मोलर चालकता उसके सभी धनायनों एवं ऋणायनों की आयनिक चालकताओं का योग होती है: Λ°m = ν₊ λ°₊ + ν₋ λ°₋।',
          hinglish: 'Nernst equation: E_cell = E°_cell - (0.0591/n) log Q. Kohlrausch: Λ°m = ν₊ λ°₊ + ν₋ λ°₋.',
        },
        formula: 'E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log_{10} Q, \\quad \\Delta G^\\circ = -n F E^\\circ_{\\text{cell}}, \\quad \\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ',
        keyPoints: [
          {
            en: 'Conductivity (κ) decreases with dilution because number of ions per unit volume decreases, but molar conductivity (Λm) increases with dilution.',
            hi: 'तनुता बढ़ाने पर चालकता (κ) घटती है क्योंकि प्रति इकाई आयतन आयन घटते हैं, किंतु मोलर चालकता (Λm) बढ़ती है।',
            hinglish: 'Specific conductivity κ decreases with dilution; molar conductivity Λm increases.',
          },
          {
            en: 'In hydrogen-oxygen fuel cells, energy efficiency reaches ~70% compared to ~40% in thermal plants, producing pure drinkable water as the only byproduct.',
            hi: 'ईंधन सेल की दक्षता ~70% होती है तथा इसका एकमात्र सह-उत्पाद जल होता है।',
            hinglish: 'H₂-O₂ fuel cells produce zero pollution with ~70% thermodynamic efficiency.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Why does the specific conductivity (κ) of an electrolyte solution decrease upon continuous dilution with water?',
            hi: 'जल मिलाकर तनु करने पर किसी विद्युतअपघट्य की विशिष्ट चालकता (κ) क्यों घटती है?',
            hinglish: 'Dilution karne par specific conductivity (κ) kyun decrease hoti hai?',
          },
          options: [
            { en: 'The number of current-carrying ions per unit volume decreases', hi: 'प्रति इकाई आयतन धारावाही आयनों की संख्या घट जाती है', hinglish: 'Number of ions per unit volume decreases' },
            { en: 'The mobility of ions becomes exactly zero', hi: 'आयनों की गतिशीलता शून्य हो जाती है', hinglish: 'Mobility becomes zero' },
            { en: 'Electrolyte molecules permanently precipitate', hi: 'विद्युतअपघट्य अवक्षेपित हो जाता है', hinglish: 'Precipitation occurs' },
            { en: 'Water destroys all electrical charge on ions', hi: 'जल आयनों के आवेश को समाप्त कर देता है', hinglish: 'Charge destroyed' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Conductivity is the conductance of 1 cm³ of solution. While total volume increases, the concentration of ions per unit volume drops, reducing specific conductivity.',
            hi: 'चालकता 1 सेमी³ विलयन का चालकत्व है। आयतन बढ़ने पर प्रति इकाई आयतन आयनों की संख्या घट जाती है।',
            hinglish: 'Fewer ions per cubic centimeter means lower specific conductance κ.',
          }
        },
      },
    ],
  },

  // Chapter 3
  {
    id: 'c12_chem_ch3_chemical_kinetics',
    subjectId: 'class12_chemistry',
    chapterNo: 3,
    title: {
      en: 'Chemical Kinetics',
      hi: 'रासायनिक बलगतिकी',
      hinglish: 'Chemical Kinetics',
    },
    description: {
      en: 'Rate of reaction, rate law and specific rate constant, order vs molecularity, integrated rate equations for zero and first order reactions, half-life (t1/2), and Arrhenius equation for temperature dependence and activation energy (Ea).',
      hi: 'अभिक्रिया का वेग, वेग नियम व विशिष्ट दर नियतांक, कोटि एवं आणविकता, शून्य व प्रथम कोटि की समाकलित वेग समीकरण, अर्ध-आयु काल (t1/2), तथा आरेनियस समीकरण व सक्रियण ऊर्जा (Ea)।',
      hinglish: 'Integrated rate law, first order t1/2 = 0.693/k, Arrhenius equation log(k2/k1) = Ea/2.303R [1/T1 - 1/T2].',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Chemistry Part 1 Class 12 Ch 3 / UPMSP Rasayan Vigyan Ch 3',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_integrated_rate_first_order_arrhenius',
        title: {
          en: 'First Order Kinetics & Arrhenius Activation Energy',
          hi: 'प्रथम कोटि अभिक्रिया एवं आरेनियस सक्रियण ऊर्जा',
          hinglish: 'First Order Integrated Rate & Arrhenius Equation',
        },
        summary: {
          en: 'For a first order reaction, rate is proportional to reactant concentration: k = (2.303 / t) log₁₀ ([R]₀ / [R]). Its half-life t₁/₂ = 0.693 / k is completely independent of initial reactant concentration. The Arrhenius equation links rate constant to temperature: k = A e^(-Ea / RT), where Ea is activation energy. Plot of ln k versus 1/T yields a straight line with slope = -Ea / R.',
          hi: 'प्रथम कोटि अभिक्रिया हेतु k = (2.303/t) log([R]₀/[R]) तथा अर्ध-आयु काल t₁/₂ = 0.693/k होता है जो प्रारंभिक सांद्रता पर निर्भर नहीं करता। आरेनियस समीकरण: k = A e^(-Ea/RT)।',
          hinglish: 'First order half-life t1/2 = 0.693/k is independent of initial concentration. Arrhenius equation: log(k2/k1) = (Ea/2.303R)[(T2-T1)/(T1·T2)].',
        },
        formula: 'k = \\frac{2.303}{t}\\log_{10}\\frac{[R]_0}{[R]}, \\quad t_{1/2} = \\frac{0.693}{k}, \\quad \\log_{10}\\frac{k_2}{k_1} = \\frac{E_a}{2.303 R}\\left[ \\frac{T_2 - T_1}{T_1 T_2} \\right]',
        keyPoints: [
          {
            en: 'Order of a reaction is determined strictly experimentally and can be fractional or zero; molecularity is a theoretical count of colliding species and must be a positive integer (1, 2, or 3).',
            hi: 'कोटि प्रयोगात्मक मान है जो शून्य या भिन्न हो सकती है; आणविकता सैद्धांतिक होती है और सदैव धनात्मक पूर्णांक होती है।',
            hinglish: 'Order can be zero/fractional/negative; molecularity is always 1, 2, or 3.',
          },
          {
            en: 'For a first-order reaction, the time required to complete 99.9% of the reaction is approximately 10 times its half-life (t_99.9% = 10 × t₁/₂).',
            hi: 'प्रथम कोटि अभिक्रिया के 99.9% पूर्ण होने में लगा समय उसकी अर्ध-आयु का 10 गुना होता है।',
            hinglish: 't_99.9% = 10 × t₁/₂.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'A first order reaction has a rate constant k = 0.0693 min⁻¹. What is the half-life (t₁/₂) of this reaction?',
            hi: 'एक प्रथम कोटि की अभिक्रिया का वेग स्थिरांक k = 0.0693 min⁻¹ है। इसकी अर्ध-आयु (t₁/₂) क्या होगी?',
            hinglish: 'First order reaction ka rate constant k = 0.0693 min⁻¹ hai. Half-life t₁/₂ kitna hoga?',
          },
          options: [
            { en: '10 minutes', hi: '10 मिनट', hinglish: '10 minutes' },
            { en: '69.3 minutes', hi: '69.3 मिनट', hinglish: '69.3 minutes' },
            { en: '5 minutes', hi: '5 मिनट', hinglish: '5 minutes' },
            { en: '1 minute', hi: '1 मिनट', hinglish: '1 minute' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'For a first-order reaction: t₁/₂ = 0.693 / k = 0.693 / 0.0693 min⁻¹ = 10 minutes.',
            hi: 't₁/₂ = 0.693 / k = 0.693 / 0.0693 = 10 मिनट।',
            hinglish: 't₁/₂ = 0.693 / 0.0693 = 10 min.',
          }
        },
      },
    ],
  },

  // Chapter 4
  {
    id: 'c12_chem_ch4_d_and_f_block',
    subjectId: 'class12_chemistry',
    chapterNo: 4,
    title: {
      en: 'The d- and f-Block Elements',
      hi: 'd- एवं f-ब्लॉक के तत्व',
      hinglish: 'The d- and f-Block Elements',
    },
    description: {
      en: 'Electronic configuration, atomic and ionic radii, transition metals variable oxidation states, catalytic properties, magnetic behavior (spin-only formula μ = √(n(n+2)) BM), formation of colored ions, interstitial compounds, and Lanthanoid contraction consequences.',
      hi: 'इलेक्ट्रॉनिक विन्यास, संक्रमण धातुओं की परिवर्तनशील ऑक्सीकरण अवस्थाएं, उत्प्रेरकीय गुण, चुंबकीय व्यवहार (μ = √(n(n+2)) BM), रंगीन आयनों का निर्माण, तथा लैन्थेनाइड आकुंचन के प्रभाव।',
      hinglish: 'Transition metal trends, spin-only magnetic moment μ = √(n(n+2)) BM, lanthanoid contraction.',
    },
    targetMastery: 90,
    highYieldWeightage: 7,
    textbookRef: 'NCERT Chemistry Part 1 Class 12 Ch 4 / UPMSP Rasayan Vigyan Ch 4',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_lanthanoid_contraction_magnetism',
        title: {
          en: 'Lanthanoid Contraction & Spin-Only Magnetic Moment',
          hi: 'लैन्थेनाइड आकुंचन एवं चक्रण-मात्र चुंबकीय आघूर्ण',
          hinglish: 'Lanthanoid Contraction & Magnetic Properties',
        },
        summary: {
          en: 'Lanthanoid contraction is the steady decrease in atomic and ionic radii across the lanthanoids (La to Lu) due to poor shielding by 4f electrons. As a direct consequence, 4d and 5d series elements have nearly identical atomic radii (e.g., Zr ≈ Hf, Nb ≈ Ta). Transition metal magnetic moments arise from unpaired electrons calculated via the spin-only formula: μ = √[n(n + 2)] Bohr Magnetons (BM).',
          hi: '4f इलेक्ट्रॉनों के दुर्बल परिरक्षण प्रभाव के कारण लैन्थेनाइडों के आकार में नियमित कमी लैन्थेनाइड आकुंचन कहलाती है। इसके कारण 4d और 5d तत्वों (जैसे Zr व Hf) के आकार लगभग समान हो जाते हैं। चक्रण-मात्र चुंबकीय आघूर्ण μ = √[n(n+2)] BM होता है।',
          hinglish: 'Poor shielding of 4f electrons causes Lanthanoid contraction; Zr and Hf have almost identical size. Magnetic moment μ = √(n(n+2)) BM.',
        },
        formula: '\\mu = \\sqrt{n(n+2)}\\,\\text{BM}, \\quad r(\\text{Zr}) \\approx r(\\text{Hf}) \\approx 160\\,\\text{pm}',
        keyPoints: [
          {
            en: 'Zirconium (Zr) and Hafnium (Hf) have nearly identical atomic and ionic radii and chemical properties due to Lanthanoid contraction.',
            hi: 'लैन्थेनाइड आकुंचन के कारण ज़िरकोनियम (Zr) और हाफ्नियम (Hf) के परमाणु आकार और रासायनिक गुण लगभग समान होते हैं।',
            hinglish: 'Zr and Hf have nearly identical radii due to Lanthanoid contraction.',
          },
          {
            en: 'Sc³⁺ and Zn²⁺ ions are colorless and diamagnetic because they possess completely empty (d⁰) or completely filled (d¹⁰) subshells with zero unpaired electrons.',
            hi: 'Sc³⁺ (d⁰) और Zn²⁺ (d¹⁰) में अयुग्मित d इलेक्ट्रॉन न होने से वे रंगहीन और प्रतिचुंबकीय होते हैं।',
            hinglish: 'No unpaired d-electrons means ions are colorless and diamagnetic.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Why do elements of the 4d series (like Zirconium, Zr) and 5d series (like Hafnium, Hf) possess almost identical atomic radii?',
            hi: '4d श्रेणी के तत्व (जैसे ज़िरकोनियम Zr) और 5d श्रेणी के तत्व (जैसे हाफ्नियम Hf) के परमाणु आकार लगभग समान क्यों होते हैं?',
            hinglish: 'Zr aur Hf ka atomic radius lagbhag identical kyun hota hai?',
          },
          options: [
            { en: 'Due to Lanthanoid Contraction (poor shielding by 4f electrons)', hi: 'लैन्थेनाइड आकुंचन (4f इलेक्ट्रॉनों के दुर्बल परिरक्षण) के कारण', hinglish: 'Due to Lanthanoid Contraction' },
            { en: 'Due to identical nuclear charges', hi: 'समान नाभिकीय आवेश के कारण', hinglish: 'Identical nuclear charge' },
            { en: 'Because they belong to the same period in periodic table', hi: 'समान आवर्त में होने के कारण', hinglish: 'Same period' },
            { en: 'Due to diagonal relationship', hi: 'विकर्ण संबंध के कारण', hinglish: 'Diagonal relationship' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'The filling of 4f orbitals before 5d elements results in poor screening of the nuclear charge, pulling electrons closer and counteracting the normal increase in size from adding an energy level.',
            hi: '4f उपकोश का दुर्बल परिरक्षण नाभिकीय आकर्षण को बढ़ा देता है जिससे 5d तत्वों का आकार संकुचित होकर 4d के समान हो जाता है।',
            hinglish: 'Lanthanoid contraction balances the expected size increase between 4d and 5d series.',
          }
        },
      },
    ],
  },

  // Chapter 5
  {
    id: 'c12_chem_ch5_coordination_compounds',
    subjectId: 'class12_chemistry',
    chapterNo: 5,
    title: {
      en: 'Coordination Compounds',
      hi: 'उपसहसंयोजन यौगिक',
      hinglish: 'Coordination Compounds',
    },
    description: {
      en: 'Werner’s theory (primary and secondary valencies), IUPAC nomenclature of coordination entities, geometric and optical isomerism, Valence Bond Theory (VBT, inner vs outer orbital complexes), and Crystal Field Theory (CFT, octahedral and tetrahedral crystal field splitting Δo and Δt).',
      hi: 'वार्नर का सिद्धांत, उपसहसंयोजन यौगिकों का IUPAC नामकरण, ज्यामितीय व प्रकाशिक समावयवता, संयोजकता आबंध सिद्धांत (VBT), तथा क्रिस्टल क्षेत्र सिद्धांत (CFT, अष्टफलकीय व चतुष्फलकीय विपाटन Δo)।',
      hinglish: 'IUPAC naming, VBT hybridization (d²sp³ vs sp³d²), CFT crystal field splitting Δo.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Chemistry Part 1 Class 12 Ch 5 / UPMSP Rasayan Vigyan Ch 5',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_cft_crystal_field_splitting',
        title: {
          en: 'Crystal Field Theory (CFT) & Octahedral Splitting (t2g - eg)',
          hi: 'क्रिस्टल क्षेत्र सिद्धांत (CFT) एवं अष्टफलकीय विपाटन (t2g - eg)',
          hinglish: 'Crystal Field Splitting in Octahedral Complexes',
        },
        summary: {
          en: 'In Crystal Field Theory, ligand-metal interactions are treated as electrostatic. In an octahedral complex, approaching ligands split degenerate d-orbitals into lower energy t₂g orbitals (-0.4 Δo) and higher energy eg orbitals (+0.6 Δo). Strong field ligands (CN⁻, CO) produce large crystal field splitting (Δo > P), forcing electron pairing to form low-spin complexes. Weak field ligands (F⁻, Cl⁻, H₂O) produce small Δo (Δo < P), forming high-spin complexes. Tetrahedral splitting satisfies Δt = (4/9) Δo.',
          hi: 'अष्टफलकीय संकुल में d-कक्षक दो समूहों में विपाटित होते हैं: निम्न ऊर्जा t₂g (-0.4 Δo) और उच्च ऊर्जा eg (+0.6 Δo)। प्रबल क्षेत्र लिगैंड (CN⁻, CO) बड़ा विपाटन (Δo > P) करके युग्मन कराते हैं (निम्न-चक्रण संकुल)। दुर्बल लिगैंड उच्च-चक्रण संकुल बनाते हैं।',
          hinglish: 'Octahedral field splits d-orbitals into t2g (lower) and eg (higher). Strong ligands cause pairing (Δo > Pairing energy P). Tetrahedral Δt = (4/9)Δo.',
        },
        formula: '\\Delta_t = \\frac{4}{9}\\Delta_o, \\quad \\text{CFSE} = [-0.4 n(t_{2g}) + 0.6 n(e_g)]\\Delta_o + m P',
        keyPoints: [
          {
            en: 'Spectrochemical series ranks ligands by field strength: I⁻ < Br⁻ < S²⁻ < Cl⁻ < F⁻ < OH⁻ < C₂O₄²⁻ < H₂O < NCS⁻ < NH₃ < en < NO₂⁻ < CN⁻ < CO.',
            hi: 'स्पेक्ट्रमी-रासायनिक श्रेणी: CO और CN⁻ सबसे प्रबल लिगैंड हैं जबकि हैलाइड दुर्बल लिगैंड हैं।',
            hinglish: 'CO and CN⁻ are strongest field ligands in spectrochemical series.',
          },
          {
            en: 'Inner orbital complexes use (n-1)d orbitals with d²sp³ hybridization, while outer orbital complexes use nd orbitals with sp³d² hybridization.',
            hi: 'आंतरिक कक्षक संकुल d²sp³ तथा बाह्य कक्षक संकुल sp³d² संकरण दर्शाते हैं।',
            hinglish: 'Inner orbital = d²sp³ (strong ligands); Outer orbital = sp³d² (weak ligands).',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'What is the relationship between crystal field splitting in tetrahedral (Δt) and octahedral (Δo) complexes for identical metal and ligands?',
            hi: 'समान धातु और लिगैंड के लिए चतुष्फलकीय (Δt) और अष्टफलकीय (Δo) विपाटन ऊर्जा में क्या संबंध है?',
            hinglish: 'Δt aur Δo ke beech relation kya hota hai?',
          },
          options: [
            { en: 'Δt = (4/9) Δo', hi: 'Δt = (4/9) Δo', hinglish: 'Δt = (4/9) Δo' },
            { en: 'Δt = (9/4) Δo', hi: 'Δt = (9/4) Δo', hinglish: 'Δt = (9/4) Δo' },
            { en: 'Δt = Δo', hi: 'Δt = Δo', hinglish: 'Δt = Δo' },
            { en: 'Δt = (1/2) Δo', hi: 'Δt = (1/2) Δo', hinglish: 'Δt = (1/2) Δo' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Because there are only 4 ligands in tetrahedral geometry compared to 6 in octahedral, and none point directly along the d-orbitals, Δt = (4/9) Δo.',
            hi: 'चतुष्फलकीय संकुल में केवल 4 लिगैंड होते हैं और वे अक्षों के अनुदिश नहीं आते, अतः Δt = (4/9) Δo।',
            hinglish: 'Tetrahedral crystal field splitting is always smaller: Δt = 4/9 Δo.',
          }
        },
      },
    ],
  },

  // Chapter 6
  {
    id: 'c12_chem_ch6_haloalkanes_haloarenes',
    subjectId: 'class12_chemistry',
    chapterNo: 6,
    title: {
      en: 'Haloalkanes and Haloarenes',
      hi: 'हैलोऐल्केन तथा हैलोऐरीन',
      hinglish: 'Haloalkanes and Haloarenes',
    },
    description: {
      en: 'Nomenclature, nature of C-X bond, nucleophilic substitution mechanisms (SN1 vs SN2 comparison, kinetics, and stereochemistry - inversion of configuration vs racemization), elimination reactions (Saytzeff’s rule), and low reactivity of haloarenes.',
      hi: 'नामकरण, C-X आबंध की प्रकृति, नाभिकरागी प्रतिस्थापन अभिक्रियाएं (SN1 व SN2 तुलना, दर, त्रिविम रसायन - वाल्डेन प्रतिलोमन व रेसिमीकरण), निराकरण अभिक्रियाएं (सेत्ज़ेफ नियम), तथा हैलोऐरीन की कम क्रियाशीलता।',
      hinglish: 'SN1 (carbocation, racemization) vs SN2 (single step, inversion), Saytzeff rule elimination.',
    },
    targetMastery: 90,
    highYieldWeightage: 7,
    textbookRef: 'NCERT Chemistry Part 2 Class 12 Ch 6 / UPMSP Rasayan Vigyan Ch 6',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_sn1_sn2_mechanisms',
        title: {
          en: 'SN1 vs SN2 Nucleophilic Substitution Mechanisms & Stereochemistry',
          hi: 'SN1 एवं SN2 नाभिकरागी प्रतिस्थापन क्रियाविधि तथा त्रिविम रसायन',
          hinglish: 'SN1 vs SN2 Reaction Mechanisms',
        },
        summary: {
          en: 'SN1 is a two-step unimolecular substitution proceeding via a planar carbocation intermediate, following first-order kinetics (Rate = k[R-X]). Reactivity order: 3° > 2° > 1° alkyl halides. It results in racemization with slight inversion. SN2 is a concerted single-step bimolecular substitution with backside attack through a penta-coordinate transition state, following second-order kinetics (Rate = k[R-X][Nu⁻]). Reactivity order: Methyl > 1° > 2° > 3° (steric hindrance). It proceeds with 100% Walden inversion of configuration.',
          hi: 'SN1 दो पदों में होती है (कार्बधनायन मध्यवर्ती, प्रथम कोटि, 3° > 2° > 1°, रेसिमीकरण)। SN2 एक ही पद में पश्च आक्रमण द्वारा होती है (संक्रमण अवस्था, द्वितीय कोटि, 1° > 2° > 3°, 100% वाल्डेन प्रतिलोमन)।',
          hinglish: 'SN1: 2 steps, carbocation, 3°>2°>1°, racemization. SN2: 1 step, backside attack, 1°>2°>3°, Walden inversion.',
        },
        formula: '\\text{SN1: Rate} = k[\\text{R-X}], \\quad \\text{SN2: Rate} = k[\\text{R-X}][\\text{Nu}^-], \\quad \\text{Reactivity SN2: } \\text{CH}_3\\text{X} > 1^\\circ > 2^\\circ > 3^\\circ',
        keyPoints: [
          {
            en: 'Tertiary alkyl halides undergo substitution predominantly via SN1 due to exceptional stability of the 3° carbocation.',
            hi: '3° ऐल्किल हैलाइड मुख्य रूप से SN1 क्रियाविधि दर्शाते हैं क्योंकि 3° कार्बधनायन सर्वाधिक स्थायी होता है।',
            hinglish: '3° halides undergo SN1 due to tertiary carbocation stability.',
          },
          {
            en: 'Haloarenes are extremely unreactive toward nucleophilic substitution due to resonance stabilization of the C-Cl bond (partial double bond character) and sp² hybridized carbon.',
            hi: 'अनुनाद के कारण C-Cl आबंध में आंशिक द्वि-आबंध लक्षण आ जाता है जिससे हैलोऐरीन कम क्रियाशील होते हैं।',
            hinglish: 'Partial double bond character in haloarenes makes them resistant to nucleophilic attack.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Which of the following alkyl halides will react most rapidly via the SN2 nucleophilic substitution mechanism?',
            hi: 'निम्नलिखित में से कौन सा ऐल्किल हैलाइड SN2 नाभिकरागी प्रतिस्थापन अभिक्रिया में सबसे तेजी से क्रिया करेगा?',
            hinglish: 'Inme se kaunsa alkyl halide SN2 reaction me sabse fastest react karega?',
          },
          options: [
            { en: 'CH₃-Br (Methyl bromide)', hi: 'CH₃-Br (मेथिल ब्रोमाइड)', hinglish: 'CH₃-Br (Methyl bromide)' },
            { en: '(CH₃)₃C-Br (tert-Butyl bromide)', hi: '(CH₃)₃C-Br (तृतीयक-ब्यूटिल ब्रोमाइड)', hinglish: '(CH₃)₃C-Br (tert-Butyl bromide)' },
            { en: '(CH₃)₂CH-Br (Isopropyl bromide)', hi: '(CH₃)₂CH-Br (आइसोप्रोपिल ब्रोमाइड)', hinglish: '(CH₃)₂CH-Br (Isopropyl bromide)' },
            { en: 'C₆H₅-Br (Bromobenzene)', hi: 'C₆H₅-Br (ब्रोमोबेंजीन)', hinglish: 'C₆H₅-Br (Bromobenzene)' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'SN2 involves backside attack in a single transition state. Methyl halide (CH₃Br) has the minimum steric hindrance, allowing the nucleophile unhindered approach.',
            hi: 'SN2 में पश्च आक्रमण होता है। मेथिल ब्रोमाइड (CH₃Br) में न्यूनतम त्रिविम बाधा (Steric hindrance) होने के कारण यह सर्वाधिक तीव्र गति से अभिक्रिया करता है।',
            hinglish: 'Least steric hindrance in methyl halide gives fastest SN2 rate.',
          }
        },
      },
    ],
  },

  // Chapter 7
  {
    id: 'c12_chem_ch7_alcohols_phenols_ethers',
    subjectId: 'class12_chemistry',
    chapterNo: 7,
    title: {
      en: 'Alcohols, Phenols and Ethers',
      hi: 'ऐल्कोहॉल, फ़ीनॉल एवं ईथर',
      hinglish: 'Alcohols, Phenols and Ethers',
    },
    description: {
      en: 'Preparation of alcohols (hydroboration-oxidation, Grignard reagents), distinction by Lucas test, acidity comparison of alcohols and phenols (resonance stabilization of phenoxide ion), Kolbe’s reaction, Reimer-Tiemann reaction, Williamson ether synthesis, and cleavage of ethers with HI.',
      hi: 'ऐल्कोहॉल विरचन (हाइड्रोबोरेशन-ऑक्सीकरण, ग्रीन्यार अभिकर्मक), ल्यूकास परीक्षण, ऐल्कोहॉल व फ़ीनॉल की अम्लीय प्रकृति की तुलना, कोल्बे अभिक्रिया, राइमर-टीमन अभिक्रिया, विलियमसन ईथर संश्लेषण, तथा HI द्वारा ईथर का विदलन।',
      hinglish: 'Lucas test distinction (3° instant turbidity), phenol acidity, Reimer-Tiemann reaction, Williamson synthesis.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Chemistry Part 2 Class 12 Ch 7 / UPMSP Rasayan Vigyan Ch 7',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_phenol_acidity_lucas_williamson',
        title: {
          en: 'Phenol Acidity, Reimer-Tiemann Reaction & Williamson Ether Synthesis',
          hi: 'फ़ीनॉल की अम्लीय प्रकृति, राइमर-टीमन अभिक्रिया एवं विलियमसन संश्लेषण',
          hinglish: 'Phenol Acidity & Named Reactions',
        },
        summary: {
          en: 'Phenol is significantly more acidic than alcohols (Ka ~ 10⁻¹⁰ vs ~10⁻¹⁶) because the resulting phenoxide ion is stabilized by resonance over the benzene ring. In the Reimer-Tiemann reaction, phenol reacts with CHCl₃ and aq NaOH to form salicylaldehyde (o-hydroxybenzaldehyde). Williamson synthesis prepares symmetrical and unsymmetrical ethers by reacting an alkoxide (R-ONa) with a primary alkyl halide (R’-X) via an SN2 mechanism.',
          hi: 'फ़ीनॉल ऐल्कोहॉल से अधिक अम्लीय है क्योंकि फ़ीनॉक्साइड आयन अनुनाद द्वारा स्थायी होता है। राइमर-टीमन अभिक्रिया में फ़ीनॉल CHCl₃ व NaOH से क्रिया कर सैलिसिलैल्डिहाइड बनाता है। विलियमसन संश्लेषण में ऐल्कॉक्साइड की 1° ऐल्किल हैलाइड से क्रिया द्वारा ईथर बनता है।',
          hinglish: 'Phenoxide resonance makes phenol acidic. Reimer-Tiemann gives salicylaldehyde. Williamson synthesis requires primary alkyl halide with alkoxide.',
        },
        formula: '\\text{C}_6\\text{H}_5\\text{OH} + \\text{CHCl}_3 + 3\\text{NaOH} \\xrightarrow{340\\,\\text{K}} o\\text{-}\\text{HOC}_6\\text{H}_4\\text{CHO} \\quad (\\text{Salicylaldehyde})',
        keyPoints: [
          {
            en: 'In the Lucas Test (conc. HCl + anhyd. ZnCl₂), tertiary alcohols produce immediate cloudiness/turbidity, secondary alcohols in 5 minutes, and primary alcohols do not produce turbidity at room temperature.',
            hi: 'ल्यूकास परीक्षण में 3° ऐल्कोहॉल तुरंत धुंधलापन देते हैं, 2° ऐल्कोहॉल 5 मिनट में, तथा 1° ऐल्कोहॉल कमरे के ताप पर नहीं देते।',
            hinglish: 'Lucas test: 3° instant turbidity, 2° in 5 min, 1° only on heating.',
          },
          {
            en: 'In Williamson synthesis, the alkyl halide MUST be primary (1°); using a tertiary alkyl halide results exclusively in an alkene elimination product.',
            hi: 'विलियमसन संश्लेषण में ऐल्किल हैलाइड 1° होना अनिवार्य है; 3° हैलाइड लेने पर ईथर के बजाय ऐल्कीन बनती है।',
            hinglish: '3° alkyl halide with alkoxide gives elimination alkene, not ether.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'What happens when phenol is treated with chloroform (CHCl₃) in the presence of aqueous sodium hydroxide (Reimer-Tiemann reaction)?',
            hi: 'जब फ़ीनॉल की अभिक्रिया जलीय NaOH की उपस्थिति में क्लोरोफॉर्म (CHCl₃) से कराई जाती है (राइमर-टीमन अभिक्रिया), तो मुख्य उत्पाद क्या बनता है?',
            hinglish: 'Reimer-Tiemann reaction me phenol + CHCl₃ + NaOH se main product kya banta hai?',
          },
          options: [
            { en: 'Salicylaldehyde (o-hydroxybenzaldehyde)', hi: 'सैलिसिलैल्डिहाइड (o-हाइड्रॉक्सीबेंजैल्डिहाइड)', hinglish: 'Salicylaldehyde' },
            { en: 'Salicylic acid', hi: 'सैलिसिलिक अम्ल', hinglish: 'Salicylic acid' },
            { en: 'Benzoic acid', hi: 'बेंज़ोइक अम्ल', hinglish: 'Benzoic acid' },
            { en: 'Picric acid', hi: 'पिक्रिक अम्ल', hinglish: 'Picric acid' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'The electrophile dichlorocarbene (:CCl₂) generated in situ attacks the electron-rich ortho position of phenol, forming salicylaldehyde upon hydrolysis.',
            hi: 'मध्यवर्ती डाइक्लोरोकार्बीन (:CCl₂) के ऑर्थो आक्रमण से मुख्य उत्पाद सैलिसिलैल्डिहाइड प्राप्त होता है।',
            hinglish: 'Phenol + CHCl₃ + NaOH → Salicylaldehyde via dichlorocarbene intermediate.',
          }
        },
      },
    ],
  },

  // Chapter 8
  {
    id: 'c12_chem_ch8_aldehydes_ketones_carboxylic',
    subjectId: 'class12_chemistry',
    chapterNo: 8,
    title: {
      en: 'Aldehydes, Ketones and Carboxylic Acids',
      hi: 'ऐल्डिहाइड, कीटोन एवं कार्बोक्सिलिक अम्ल',
      hinglish: 'Aldehydes, Ketones & Carboxylic Acids',
    },
    description: {
      en: 'Carbonyl group reactivity, nucleophilic addition reactions (HCN, NaHSO₃, Grignard), Tollens’ silver mirror test and Fehling’s test, Aldol condensation, Cannizzaro reaction, acidity of carboxylic acids, and effect of electron withdrawing/donating substituents on acidity.',
      hi: 'कार्बोनिल समूह की नाभिकरागी योगज अभिक्रियाएं, टॉलेन परीक्षण (रजत दर्पण) व फेलिंग परीक्षण, ऐल्डोल संघनन, कैनिजारो अभिक्रिया, कार्बोक्सिलिक अम्लों की अम्लता तथा प्रतिस्थापियों का प्रभाव।',
      hinglish: 'Tollens silver mirror test, Fehling test, Aldol (α-H present) vs Cannizzaro (no α-H), carboxylic acidity.',
    },
    targetMastery: 90,
    highYieldWeightage: 9,
    textbookRef: 'NCERT Chemistry Part 2 Class 12 Ch 8 / UPMSP Rasayan Vigyan Ch 8',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_aldol_cannizzaro_tests',
        title: {
          en: 'Aldol Condensation vs Cannizzaro Reaction & Distinguishing Tests',
          hi: 'ऐल्डोल संघनन बनाम कैनिजारो अभिक्रिया एवं विभेदक परीक्षण',
          hinglish: 'Aldol Condensation & Cannizzaro Reaction',
        },
        summary: {
          en: 'Aldehydes and ketones with at least one α-hydrogen undergo Aldol condensation in dilute alkali to form β-hydroxy carbonyl compounds (aldols), which lose water upon heating to yield α,β-unsaturated carbonyl compounds. Aldehydes with NO α-hydrogen (e.g., formaldehyde HCHO, benzaldehyde C₆H₅CHO) undergo the Cannizzaro reaction in 50% conc. KOH, undergoing self-redox to produce one alcohol molecule and one carboxylate salt molecule. Tollens’ test (silver mirror) and Fehling’s test distinguish aldehydes (positive) from ketones (negative).',
          hi: 'α-हाइड्रोजन युक्त कार्बोनिल यौगिक तनु क्षार में ऐल्डोल संघनन दर्शाते हैं। बिना α-हाइड्रोजन वाले ऐल्डिहाइड (HCHO, बेंजैल्डिहाइड) 50% KOH में कैनिजारो अभिक्रिया द्वारा एक अणु ऐल्कोहॉल व एक अणु लवण में बदल जाते हैं। टॉलेन अभिकर्मक ऐल्डिहाइड के साथ रजत दर्पण देता है।',
          hinglish: 'Aldol requires α-H (forms enone). Cannizzaro occurs with NO α-H (disproportionation into alcohol + acid salt). Tollens gives silver mirror with aldehydes.',
        },
        formula: '2\\text{HCHO} + \\text{conc. KOH} \\rightarrow \\text{CH}_3\\text{OH} + \\text{HCOOK} \\quad (\\text{Cannizzaro Reaction})',
        keyPoints: [
          {
            en: 'Formaldehyde (HCHO) and Benzaldehyde (C₆H₅CHO) lack α-hydrogen atoms and undergo Cannizzaro reaction, NOT aldol condensation.',
            hi: 'फॉर्मैल्डिहाइड और बेंजैल्डिहाइड में α-हाइड्रोजन नहीं होता, अतः वे कैनिजारो अभिक्रिया दर्शाते हैं।',
            hinglish: 'HCHO and PhCHO undergo Cannizzaro because they have zero α-hydrogens.',
          },
          {
            en: 'Carboxylic acids are stronger acids than phenols because the negative charge in the carboxylate ion is delocalized over two highly electronegative equivalent oxygen atoms.',
            hi: 'कार्बोक्सिलिक अम्ल फ़ीनॉल से अधिक अम्लीय हैं क्योंकि कार्बोक्सिलेट आयन में ऋणावेश दो समतुल्य ऑक्सीजन परमाणुओं पर विस्थापित होता है।',
            hinglish: 'Carboxylate resonance over two equivalent oxygen atoms confers high acidity.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Which of the following compounds undergoes the Cannizzaro reaction when heated with concentrated sodium hydroxide (50% NaOH)?',
            hi: 'निम्नलिखित में से कौन सा यौगिक सांद्र NaOH (50%) के साथ गर्म करने पर कैनिजारो अभिक्रिया दर्शाता है?',
            hinglish: 'Inme se kaunsa compound 50% NaOH ke saath Cannizzaro reaction dega?',
          },
          options: [
            { en: 'Benzaldehyde (C₆H₅CHO)', hi: 'बेंजैल्डिहाइड (C₆H₅CHO)', hinglish: 'Benzaldehyde (C₆H₅CHO)' },
            { en: 'Acetaldehyde (CH₃CHO)', hi: 'ऐसिटैल्डिहाइड (CH₃CHO)', hinglish: 'Acetaldehyde (CH₃CHO)' },
            { en: 'Acetone (CH₃COCH₃)', hi: 'ऐसीटोन (CH₃COCH₃)', hinglish: 'Acetone (CH₃COCH₃)' },
            { en: 'Propionaldehyde (CH₃CH₂CHO)', hi: 'प्रोपियोनैल्डिहाइड (CH₃CH₂CHO)', hinglish: 'Propionaldehyde (CH₃CH₂CHO)' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Benzaldehyde (C₆H₅CHO) has no α-hydrogen atom attached to the carbonyl carbon, so it cannot form an enolate and instead undergoes disproportionation via the Cannizzaro reaction.',
            hi: 'बेंजैल्डिहाइड में कोई α-हाइड्रोजन नहीं होता, अतः यह ऐल्डोल के बजाय कैनिजारो अभिक्रिया द्वारा बेंजिल ऐल्कोहॉल और सोडियम बेंजोएट बनाता है।',
            hinglish: 'Benzaldehyde has no alpha-hydrogens, so it undergoes Cannizzaro reaction.',
          }
        },
      },
    ],
  },

  // Chapter 9
  {
    id: 'c12_chem_ch9_amines',
    subjectId: 'class12_chemistry',
    chapterNo: 9,
    title: {
      en: 'Amines',
      hi: 'ऐमीन',
      hinglish: 'Amines',
    },
    description: {
      en: 'Structure and classification of amines, Gabriel phthalimide synthesis, Hoffmann bromamide degradation, basic character comparison of amines in gas vs aqueous phase, Carbylamine test, Hinsberg test, and synthetic utility of benzenediazonium chloride (Sandmeyer reaction).',
      hi: 'ऐमीन का वर्गीकरण, गैब्रिएल थैलिमाइड संश्लेषण, हॉफमान ब्रोमामाइड निम्नीकरण, ऐमीन की क्षारीय प्रबलता (जलीय व गैसीय अवस्था), कार्बिलऐमीन परीक्षण, हिन्सबर्ग परीक्षण, तथा डाइऐज़ोनियम लवण (सैन्डमायर अभिक्रिया)।',
      hinglish: 'Carbylamine test for 1° amines, Hoffmann bromamide reaction, basicity order: 2° > 1° > 3° in aqueous medium.',
    },
    targetMastery: 90,
    highYieldWeightage: 7,
    textbookRef: 'NCERT Chemistry Part 2 Class 12 Ch 9 / UPMSP Rasayan Vigyan Ch 9',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_amines_basicity_carbylamine',
        title: {
          en: 'Amine Basicity Order, Carbylamine Test & Diazonium Salts',
          hi: 'ऐमीन की क्षारीयता क्रम, कार्बिलऐमीन परीक्षण एवं डाइऐज़ोनियम लवण',
          hinglish: 'Amine Basicity & Identification Tests',
        },
        summary: {
          en: 'In aqueous medium, the basic strength of aliphatic amines depends on inductive (+I), steric hindrance, and hydration effects. For ethyl substituted amines, the order is: (C₂H₅)₂NH (2°) > (C₂H₅)₃N (3°) > C₂H₅NH₂ (1°) > NH₃. For methyl substituted: (CH₃)₂NH (2°) > CH₃NH₂ (1°) > (CH₃)₃N (3°) > NH₃. The Carbylamine test is specific for primary (1°) amines: heating with CHCl₃ and alc. KOH yields an extremely foul-smelling isocyanide (carbylamine R-NC). Benzenediazonium chloride undergoes the Sandmeyer reaction with CuCl/HCl or CuBr/HBr to prepare aryl halides.',
          hi: 'जलीय माध्यम में एथिल ऐमीन की क्षारीयता: 2° > 3° > 1° > NH₃। कार्बिलऐमीन परीक्षण केवल प्राथमिक (1°) ऐमीन देते हैं: CHCl₃ व alc. KOH के साथ गर्म करने पर दुर्गंधयुक्त आइसोसाइनाइड (R-NC) बनता है। सैन्डमायर अभिक्रिया द्वारा डाइऐज़ोनियम लवण से क्लोरो/ब्रोमोबेंजीन बनाई जाती है।',
          hinglish: 'Carbylamine test: only 1° amines produce foul isocyanide. Hoffmann bromamide reduces 1 carbon: RCONH₂ + Br₂ + 4KOH → RNH₂.',
        },
        formula: '\\text{R-NH}_2 + \\text{CHCl}_3 + 3\\text{KOH (alc.)} \\xrightarrow{\\Delta} \\text{R-NC (Foul smell)} + 3\\text{KCl} + 3\\text{H}_2\\text{O}',
        keyPoints: [
          {
            en: 'The Carbylamine test is given exclusively by primary (1°) aliphatic and aromatic amines; secondary and tertiary amines show zero reaction.',
            hi: 'कार्बिलऐमीन परीक्षण केवल 1° ऐमीन देते हैं; 2° और 3° ऐमीन यह परीक्षण नहीं देते।',
            hinglish: 'Carbylamine test is strictly selective for primary (1°) amines.',
          },
          {
            en: 'Hoffmann bromamide degradation reaction produces a primary amine containing ONE LESS carbon atom than the starting amide.',
            hi: 'हॉफमान ब्रोमामाइड निम्नीकरण में प्राप्त 1° ऐमीन में जनक ऐमाइड की तुलना में एक कार्बन परमाणु कम होता है।',
            hinglish: 'Product amine has one less carbon atom than starting amide.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Which class of amines gives a positive Carbylamine test (formation of an extremely foul-smelling isocyanide) on heating with chloroform and alcoholic KOH?',
            hi: 'क्लोरोफॉर्म एवं एल्कोहॉलीय KOH के साथ गर्म करने पर अत्यंत दुर्गंधयुक्त आइसोसाइनाइड (कार्बिलऐमीन परीक्षण) केवल कौन सी ऐमीन देती हैं?',
            hinglish: 'Carbylamine test (foul smelling isocyanide) kaunsi amines deti hain?',
          },
          options: [
            { en: 'Only primary (1°) aliphatic and aromatic amines', hi: 'केवल प्राथमिक (1°) ऐलिफैटिक एवं ऐरोमैटिक ऐमीन', hinglish: 'Only primary (1°) aliphatic and aromatic amines' },
            { en: 'Only secondary (2°) amines', hi: 'केवल द्वितीयक (2°) ऐमीन', hinglish: 'Only secondary (2°) amines' },
            { en: 'Only tertiary (3°) amines', hi: 'केवल तृतीयक (3°) ऐमीन', hinglish: 'Only tertiary (3°) amines' },
            { en: 'All classes of amines equally', hi: 'सभी प्रकार की ऐमीन', hinglish: 'All amines equally' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Only primary amines possess the two nitrogen protons necessary to eliminate two water molecules with the dichlorocarbene intermediate to generate an isocyanide (carbylamine).',
            hi: 'केवल 1° ऐमीन में दो प्रोटॉन होते हैं जो निष्कासित होकर आइसोसाइनाइड (R-NC) का निर्माण करते हैं।',
            hinglish: 'Strictly selective test for 1° amines.',
          }
        },
      },
    ],
  },

  // Chapter 10
  {
    id: 'c12_chem_ch10_biomolecules',
    subjectId: 'class12_chemistry',
    chapterNo: 10,
    title: {
      en: 'Biomolecules',
      hi: 'जैव-अणु',
      hinglish: 'Biomolecules',
    },
    description: {
      en: 'Classification of carbohydrates, structure of D-glucose and D-fructose, cyclic Haworth structures and mutarotation, glycosidic linkage, proteins (amino acids, zwitterion, peptide bond, primary/secondary/tertiary structures, denaturation), vitamins, and nucleic acids (DNA double helix and RNA structure).',
      hi: 'कार्बोहाइड्रेट का वर्गीकरण, ग्लूकोज व फ्रुक्टोज की संरचना, हॉवर्थ संरचनाएं, ग्लाइकोसिडिक बंध, प्रोटीन (अमीनो अम्ल, ज्विटर आयन, पेप्टाइड बंध, प्राथमिक/द्वितीयक संरचना, विकृतीकरण), विटामिन, तथा न्यूक्लिक अम्ल (DNA व RNA)।',
      hinglish: 'Glucose Haworth structures, protein peptide bonds, denaturation, DNA double helix base pairing (A=T, G≡C).',
    },
    targetMastery: 90,
    highYieldWeightage: 7,
    textbookRef: 'NCERT Chemistry Part 2 Class 12 Ch 10 / UPMSP Rasayan Vigyan Ch 10',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_glucose_protein_dna_structure',
        title: {
          en: 'Protein Denaturation & DNA Complementary Base Pairing',
          hi: 'प्रोटीन का विकृतीकरण एवं DNA पूरक क्षार युग्मन',
          hinglish: 'Protein Structures & DNA Base Pairing',
        },
        summary: {
          en: 'Proteins are polymers of α-amino acids linked by peptide bonds (-CONH-). During denaturation (by heat, pH change), secondary and tertiary structures unfold and biological activity is lost, but the primary structure (covalent amino acid sequence) remains intact. In DNA, nucleotides are linked by phosphodiester bonds, and the two antiparallel strands are held together by complementary hydrogen bonds: Adenine pairs with Thymine via 2 hydrogen bonds (A = T), and Guanine pairs with Cytosine via 3 hydrogen bonds (G ≡ C).',
          hi: 'प्रोटीन विकृतीकरण में ऊष्मा या pH परिवर्तन से द्वितीयक व तृतीयक संरचनाएं नष्ट हो जाती हैं किंतु प्राथमिक संरचना अप्रभावित रहती है। DNA में पूरक हाइड्रोजन बंध होते हैं: एडेनिन और थाइमिन में दो (A = T) तथा ग्वानिन और साइटोसिन में तीन हाइड्रोजन बंध (G ≡ C) होते हैं।',
          hinglish: 'Denaturation destroys 2° and 3° protein structures, leaving primary structure intact. DNA base pairing: A=T (2 H-bonds), G≡C (3 H-bonds).',
        },
        formula: '\\text{Peptide Bond: } -\\text{CO}-\\text{NH}-, \\quad \\text{DNA Base Pairs: } \\text{A} = \\text{T} \\quad (2\\,\\text{H-bonds}), \\quad \\text{G} \\equiv \\text{C} \\quad (3\\,\\text{H-bonds})',
        keyPoints: [
          {
            en: 'During denaturation of proteins (like boiling an egg or curdling milk), secondary and tertiary structures are destroyed, while the primary sequence remains undamaged.',
            hi: 'अंडे को उबालने पर विकृतीकरण से द्वितीयक व तृतीयक संरचनाएं नष्ट होती हैं, प्राथमिक संरचना सुरक्षित रहती है।',
            hinglish: 'Primary structure is NOT destroyed during protein denaturation.',
          },
          {
            en: 'RNA contains Uracil (U) instead of Thymine (T), and ribose sugar instead of 2-deoxyribose.',
            hi: 'RNA में थाइमिन के स्थान पर यूरेसिल (U) तथा राइबोज शर्करा पाई जाती है।',
            hinglish: 'RNA has Uracil instead of Thymine and ribose sugar.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'During the denaturation of proteins (e.g. upon coagulation of egg whites by boiling), which structural level of the protein remains completely unaffected?',
            hi: 'प्रोटीन के विकृतीकरण के दौरान (जैसे अंडे को उबालने पर), प्रोटीन की कौन सी संरचना पूर्णतया अप्रभावित रहती है?',
            hinglish: 'Protein denaturation me kaunsa structure completely unaffected rehta hai?',
          },
          options: [
            { en: 'Primary Structure', hi: 'प्राथमिक संरचना (Primary Structure)', hinglish: 'Primary Structure' },
            { en: 'Secondary Structure', hi: 'द्वितीयक संरचना (Secondary Structure)', hinglish: 'Secondary Structure' },
            { en: 'Tertiary Structure', hi: 'तृतीयक संरचना (Tertiary Structure)', hinglish: 'Tertiary Structure' },
            { en: 'Quaternary Structure', hi: 'चतुष्क संरचना (Quaternary Structure)', hinglish: 'Quaternary Structure' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Denaturation breaks weak hydrogen and ionic bonds stabilizing secondary and tertiary folded states, but cannot cleave the strong covalent peptide bonds of the primary amino acid chain.',
            hi: 'विकृतीकरण से हाइड्रोजन बंध टूटते हैं परंतु मजबूत सहसंयोजी पेप्टाइड बंध नहीं टूटते, अतः प्राथमिक संरचना सुरक्षित रहती है।',
            hinglish: 'Covalent peptide bonds remain intact, so primary structure survives denaturation.',
          }
        },
      },
    ],
  },
];
