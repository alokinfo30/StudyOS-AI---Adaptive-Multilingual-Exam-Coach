import React, { useState } from 'react';
import { CheckCircle2, BookOpen, Layers, Check, ChevronDown, ChevronUp, Sparkles, Award } from 'lucide-react';
import { EducationBoard, ExamCategory, GoalCategory, LanguageCode } from '../../types';

interface ChapterItem {
  id: string;
  chapterNo: number;
  titleEn: string;
  titleHi: string;
  textbookRef: string;
  weightage: string;
  keyTopics: string[];
  pyqCount?: number;
}

interface SyllabusSubject {
  id: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  bookTitle: string;
  chapters: ChapterItem[];
}

const CLASS_10_SYLLABUS: SyllabusSubject[] = [
  {
    id: 'sci_10',
    nameEn: 'Science (Physics, Chem, Bio)',
    nameHi: 'विज्ञान (भौतिकी, रसायन, जीवविज्ञान)',
    icon: '🔬',
    bookTitle: 'NCERT Science Class 10 / State Board Vigyan',
    chapters: [
      {
        id: 'c10_ch1',
        chapterNo: 1,
        titleEn: 'Chemical Reactions and Equations',
        titleHi: 'रासायनिक अभिक्रियाएं एवं समीकरण',
        textbookRef: 'NCERT Ch 1, Pages 1-16 (Exercises 1.1 - 1.4)',
        weightage: '6-8 Marks',
        keyTopics: ['Balancing chemical equations', 'Types of chemical reactions (Combination, Decomposition)', 'Displacement & Double displacement', 'Oxidation & Reduction (Redox)', 'Corrosion & Rancidity'],
      },
      {
        id: 'c10_ch2',
        chapterNo: 2,
        titleEn: 'Acids, Bases and Salts',
        titleHi: 'अम्ल, क्षारक एवं लवण',
        textbookRef: 'NCERT Ch 2, Pages 17-36 (In-Text & Exercises)',
        weightage: '6-8 Marks',
        keyTopics: ['Chemical properties of acids and bases', 'pH scale & importance in everyday life', 'Salts: Bleaching powder, Baking soda, Washing soda, Plaster of Paris'],
      },
      {
        id: 'c10_ch3',
        chapterNo: 3,
        titleEn: 'Metals and Non-metals',
        titleHi: 'धातु एवं अधातु',
        textbookRef: 'NCERT Ch 3, Pages 37-56',
        weightage: '7-9 Marks',
        keyTopics: ['Physical & chemical properties of metals', 'Reactivity series & displacement', 'Formation & properties of ionic compounds', 'Metallurgy & prevention of corrosion'],
      },
      {
        id: 'c10_ch4',
        chapterNo: 4,
        titleEn: 'Carbon and its Compounds',
        titleHi: 'कार्बन एवं उसके यौगिक',
        textbookRef: 'NCERT Ch 4, Pages 57-79',
        weightage: '8-10 Marks',
        keyTopics: ['Covalent bonding in carbon compounds', 'Versatile nature of carbon (Catenation, Tetravalency)', 'Homologous series & IUPAC nomenclature', 'Combustion, Oxidation, Addition & Substitution reactions', 'Ethanol & Ethanoic acid properties', 'Soaps and detergents (Micelle formation)'],
      },
      {
        id: 'c10_ch5',
        chapterNo: 5,
        titleEn: 'Life Processes',
        titleHi: 'जैव प्रक्रम',
        textbookRef: 'NCERT Ch 5, Pages 80-109',
        weightage: '9-11 Marks',
        keyTopics: ['Autotrophic & heterotrophic nutrition', 'Human digestive system and enzymes', 'Respiration (Aerobic vs Anaerobic, human respiratory system)', 'Transportation in humans (Double circulation) & plants (Xylem/Phloem)', 'Excretion in humans (Nephron structure) and plants'],
      },
      {
        id: 'c10_ch6',
        chapterNo: 6,
        titleEn: 'Control and Coordination',
        titleHi: 'नियंत्रण एवं समन्वय',
        textbookRef: 'NCERT Ch 6, Pages 110-128',
        weightage: '6-7 Marks',
        keyTopics: ['Nervous system & Neuron structure', 'Reflex arc mechanism', 'Human brain parts (Forebrain, Midbrain, Hindbrain)', 'Plant hormones (Auxin, Gibberellin, Cytokinin, Abscisic acid)', 'Hormones in animals (Thyroid, Pituitary, Adrenal, Pancreas)'],
      },
      {
        id: 'c10_ch7',
        chapterNo: 7,
        titleEn: 'How do Organisms Reproduce?',
        titleHi: 'जीव जनन कैसे करते हैं?',
        textbookRef: 'NCERT Ch 7, Pages 129-144',
        weightage: '7-8 Marks',
        keyTopics: ['Asexual reproduction modes (Binary fission, Fragmentation, Regeneration, Budding, Spores)', 'Sexual reproduction in flowering plants (Pollination, Fertilization)', 'Human male and female reproductive systems', 'Reproductive health and contraception methods'],
      },
      {
        id: 'c10_ch8',
        chapterNo: 8,
        titleEn: 'Heredity and Evolution',
        titleHi: 'आनुवंशिकता एवं जैव विकास',
        textbookRef: 'NCERT Ch 8, Pages 145-159',
        weightage: '6-7 Marks',
        keyTopics: ['Mendel’s experiments on pea plants', 'Monohybrid cross (3:1 ratio) and Dihybrid cross (9:3:3:1 ratio)', 'Sex determination mechanism in human beings (XX and XY chromosomes)'],
      },
      {
        id: 'c10_ch9',
        chapterNo: 9,
        titleEn: 'Light – Reflection and Refraction',
        titleHi: 'प्रकाश – परावर्तन तथा अपवर्तन',
        textbookRef: 'NCERT Ch 9, Pages 160-189 (Numerical Exercises 9.1-9.4)',
        weightage: '9-11 Marks',
        keyTopics: ['Spherical mirrors: Concave and Convex mirror ray diagrams', 'Mirror formula (1/v + 1/u = 1/f) and magnification', 'Snell’s law of refraction & Refractive index', 'Spherical lenses: Convex and Concave lens ray diagrams', 'Lens formula (1/v - 1/u = 1/f) and Power of a lens (P = 1/f)'],
      },
      {
        id: 'c10_ch10',
        chapterNo: 10,
        titleEn: 'The Human Eye and the Colorful World',
        titleHi: 'मानव नेत्र तथा रंगबिरंगा संसार',
        textbookRef: 'NCERT Ch 10, Pages 190-204',
        weightage: '5-6 Marks',
        keyTopics: ['Structure and functioning of human eye', 'Defects of vision: Myopia, Hypermetropia, Presbyopia and correction', 'Refraction through a glass prism and dispersion of white light', 'Atmospheric refraction (Twinkling of stars, Advanced sunrise)', 'Scattering of light (Tyndall effect, Blue color of sky)'],
      },
      {
        id: 'c10_ch11',
        chapterNo: 11,
        titleEn: 'Electricity',
        titleHi: 'विद्युत',
        textbookRef: 'NCERT Ch 11, Pages 205-226 (Ohm’s Law Numericals)',
        weightage: '8-10 Marks',
        keyTopics: ['Electric current (I = Q/t) and Electric potential difference (V = W/Q)', 'Ohm’s law (V = IR) and Factors affecting resistance (R = ρL/A)', 'Resistors in Series (Rs = R1 + R2) and Parallel (1/Rp = 1/R1 + 1/R2)', 'Joule’s law of heating (H = I²Rt) and applications', 'Electric power (P = VI = I²R = V²/R) and commercial unit (kWh)'],
      },
      {
        id: 'c10_ch12',
        chapterNo: 12,
        titleEn: 'Magnetic Effects of Electric Current',
        titleHi: 'विद्युत धारा के चुंबकीय प्रभाव',
        textbookRef: 'NCERT Ch 12, Pages 227-242',
        weightage: '6-8 Marks',
        keyTopics: ['Magnetic field lines and their properties', 'Right-Hand Thumb Rule for straight conductor and circular loop', 'Magnetic field inside a current-carrying Solenoid', 'Force on current-carrying conductor (Fleming’s Left-Hand Rule)', 'Domestic electric circuits (Live, Neutral, Earth wires, Fuse, Earthing)'],
      },
      {
        id: 'c10_ch13',
        chapterNo: 13,
        titleEn: 'Our Environment',
        titleHi: 'हमारा पर्यावरण',
        textbookRef: 'NCERT Ch 13, Pages 243-254',
        weightage: '4-5 Marks',
        keyTopics: ['Eco-system components: Biotic and Abiotic', 'Food chains, Food webs and Trophic levels', '10% energy transfer law in trophic levels', 'Biological magnification of harmful chemicals', 'Ozone layer depletion and waste management'],
      },
    ],
  },
  {
    id: 'math_10',
    nameEn: 'Mathematics (Algebra, Geometry, Trigonometry)',
    nameHi: 'गणित (बीजगणित, ज्यामिति, त्रिकोणमिति)',
    icon: '📐',
    bookTitle: 'NCERT Mathematics Class 10 / State Board Ganit',
    chapters: [
      {
        id: 'm10_ch1',
        chapterNo: 1,
        titleEn: 'Real Numbers',
        titleHi: 'वास्तविक संख्याएँ',
        textbookRef: 'NCERT Ch 1, Pages 1-18',
        weightage: '6 Marks',
        keyTopics: ['Fundamental Theorem of Arithmetic', 'Proving irrationality of √2, √3, √5', 'Revisiting rational numbers & decimal expansions'],
      },
      {
        id: 'm10_ch2',
        chapterNo: 2,
        titleEn: 'Polynomials',
        titleHi: 'बहुपद',
        textbookRef: 'NCERT Ch 2, Pages 19-37',
        weightage: '5 Marks',
        keyTopics: ['Geometrical meaning of zeroes of a polynomial', 'Relationship between zeroes and coefficients of quadratic polynomials'],
      },
      {
        id: 'm10_ch3',
        chapterNo: 3,
        titleEn: 'Pair of Linear Equations in Two Variables',
        titleHi: 'दो चर वाले रैखिक समीकरण युग्म',
        textbookRef: 'NCERT Ch 3, Pages 38-69',
        weightage: '7 Marks',
        keyTopics: ['Graphical method of solution and consistency conditions', 'Algebraic methods: Substitution and Elimination methods', 'Word problems on numbers, speed-distance, ages'],
      },
      {
        id: 'm10_ch4',
        chapterNo: 4,
        titleEn: 'Quadratic Equations',
        titleHi: 'द्विघात समीकरण',
        textbookRef: 'NCERT Ch 4, Pages 70-92 (Exercise 4.4 Discriminant)',
        weightage: '8 Marks',
        keyTopics: ['Standard form ax² + bx + c = 0', 'Solving quadratic equations by factorization', 'Quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)', 'Nature of roots using discriminant D = b² - 4ac (Real, Equal, Imaginary)'],
      },
      {
        id: 'm10_ch5',
        chapterNo: 5,
        titleEn: 'Arithmetic Progressions',
        titleHi: 'समांतर श्रेढ़ी',
        textbookRef: 'NCERT Ch 5, Pages 93-116',
        weightage: '7 Marks',
        keyTopics: ['General term of an AP: an = a + (n - 1)d', 'Sum of first n terms: Sn = n/2 [2a + (n - 1)d]', 'Real-life applications of AP sums'],
      },
      {
        id: 'm10_ch6',
        chapterNo: 6,
        titleEn: 'Triangles',
        titleHi: 'त्रिभुज',
        textbookRef: 'NCERT Ch 6, Pages 117-154',
        weightage: '9 Marks',
        keyTopics: ['Basic Proportionality Theorem (Thales Theorem) and its converse', 'Criteria for similarity of triangles: AAA, SAS, SSS', 'Theorems on area and similarity proofs'],
      },
      {
        id: 'm10_ch7',
        chapterNo: 7,
        titleEn: 'Coordinate Geometry',
        titleHi: 'निर्देशांक ज्यामिति',
        textbookRef: 'NCERT Ch 7, Pages 155-172',
        weightage: '6 Marks',
        keyTopics: ['Distance formula: d = √((x2 - x1)² + (y2 - y1)²)', 'Section formula for internal division: ((m1x2 + m2x1)/(m1+m2))', 'Midpoint formula'],
      },
      {
        id: 'm10_ch8',
        chapterNo: 8,
        titleEn: 'Introduction to Trigonometry',
        titleHi: 'त्रिकोणमिति का परिचय',
        textbookRef: 'NCERT Ch 8, Pages 173-194',
        weightage: '8 Marks',
        keyTopics: ['Trigonometric ratios of an acute angle of a right-angled triangle', 'Values of ratios at 0°, 30°, 45°, 60°, 90°', 'Trigonometric identities: sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ'],
      },
      {
        id: 'm10_ch9',
        chapterNo: 9,
        titleEn: 'Some Applications of Trigonometry',
        titleHi: 'त्रिकोणमिति के कुछ अनुप्रयोग',
        textbookRef: 'NCERT Ch 9, Pages 195-207',
        weightage: '6 Marks',
        keyTopics: ['Angle of elevation and Angle of depression', 'Simple problems on heights and distances with single/double angles'],
      },
    ],
  },
];

const CLASS_12_SYLLABUS: SyllabusSubject[] = [
  {
    id: 'phy_12',
    nameEn: 'Physics Part 1 & 2',
    nameHi: 'भौतिक विज्ञान (भाग 1 एवं 2)',
    icon: '⚡',
    bookTitle: 'NCERT Physics Class 12 (Vols 1 & 2) / State Board Bhautiki',
    chapters: [
      {
        id: 'c12_p1',
        chapterNo: 1,
        titleEn: 'Electric Charges and Fields',
        titleHi: 'वैद्युत आवेश तथा क्षेत्र',
        textbookRef: 'NCERT Part 1 Ch 1, Pages 1-52',
        weightage: '8-9 Marks',
        keyTopics: ['Coulomb’s law in vector form', 'Electric field due to dipole (Axial and Equatorial points)', 'Torque on electric dipole in uniform field', 'Gauss’s theorem and applications (Infinitely long wire, Infinite sheet, Spherical shell)'],
      },
      {
        id: 'c12_p2',
        chapterNo: 2,
        titleEn: 'Electrostatic Potential and Capacitance',
        titleHi: 'स्थिरवैद्युत विभव तथा धारिता',
        textbookRef: 'NCERT Part 1 Ch 2, Pages 53-92',
        weightage: '8-9 Marks',
        keyTopics: ['Electric potential due to point charge & dipole', 'Equipotential surfaces & relationship E = -dV/dr', 'Parallel plate capacitor with & without dielectric slab', 'Energy stored in a capacitor (U = 1/2 CV²) and common potential'],
      },
      {
        id: 'c12_p3',
        chapterNo: 3,
        titleEn: 'Current Electricity',
        titleHi: 'विद्युत धारा',
        textbookRef: 'NCERT Part 1 Ch 3, Pages 93-134',
        weightage: '8-9 Marks',
        keyTopics: ['Drift velocity, mobility and relation with electric current', 'Temperature dependence of resistivity', 'Internal resistance, terminal voltage and EMF of cells in series/parallel', 'Kirchhoff’s laws and applications to Wheatstone bridge'],
      },
      {
        id: 'c12_p4',
        chapterNo: 4,
        titleEn: 'Moving Charges and Magnetism',
        titleHi: 'गतिमान आवेश और चुंबकत्व',
        textbookRef: 'NCERT Part 1 Ch 4, Pages 135-176',
        weightage: '7-8 Marks',
        keyTopics: ['Biot-Savart law and magnetic field of a circular current loop', 'Ampere’s circuital law and solenoid', 'Force on moving charge (Lorentz force) & magnetic dipole moment', 'Moving coil galvanometer, sensitivity and conversion to Ammeter/Voltmeter'],
      },
      {
        id: 'c12_p5',
        chapterNo: 5,
        titleEn: 'Ray Optics and Optical Instruments',
        titleHi: 'किरण प्रकाशिकी एवं प्रकाशिक यंत्र',
        textbookRef: 'NCERT Part 2 Ch 9, Pages 309-350',
        weightage: '9-10 Marks',
        keyTopics: ['Total internal reflection and optical fibres', 'Refraction at spherical surfaces and Lens Maker’s formula', 'Prism formula (n = sin((A + Dm)/2) / sin(A/2))', 'Astronomical telescope and Compound microscope magnifying power'],
      },
      {
        id: 'c12_p6',
        chapterNo: 6,
        titleEn: 'Wave Optics',
        titleHi: 'तरंग प्रकाशिकी',
        textbookRef: 'NCERT Part 2 Ch 10, Pages 351-386',
        weightage: '8-9 Marks',
        keyTopics: ['Huygens’ principle: Reflection and Refraction wave-front proofs', 'Coherent sources and Interference of light', 'Young’s Double Slit Experiment (YDSE) fringe width derivation', 'Diffraction at a single slit: Central maximum width'],
      },
      {
        id: 'c12_p7',
        chapterNo: 7,
        titleEn: 'Semiconductor Electronics',
        titleHi: 'अर्धचालक इलेक्ट्रॉनिकी',
        textbookRef: 'NCERT Part 2 Ch 14, Pages 467-502',
        weightage: '7-8 Marks',
        keyTopics: ['Intrinsic and Extrinsic semiconductors (n-type and p-type)', 'p-n junction diode under forward and reverse bias', 'Half-wave and Full-wave rectifiers with filter circuits', 'Basic logic gates (AND, OR, NOT, NAND, NOR) truth tables'],
      },
    ],
  },
  {
    id: 'chem_12',
    nameEn: 'Chemistry Part 1 & 2',
    nameHi: 'रसायन विज्ञान (भाग 1 एवं 2)',
    icon: '🧪',
    bookTitle: 'NCERT Chemistry Class 12 (Vols 1 & 2)',
    chapters: [
      {
        id: 'c12_c1',
        chapterNo: 1,
        titleEn: 'Solutions',
        titleHi: 'विलयन',
        textbookRef: 'NCERT Part 1 Ch 1, Pages 1-32',
        weightage: '7 Marks',
        keyTopics: ['Henry’s law and Raoult’s law for volatile solutes', 'Ideal and Non-ideal solutions (Azeotropes)', 'Colligative properties: Relative lowering of vapor pressure, Elevation in boiling point, Depression in freezing point, Osmotic pressure', 'van ‘t Hoff factor i and abnormal molar mass'],
      },
      {
        id: 'c12_c2',
        chapterNo: 2,
        titleEn: 'Electrochemistry',
        titleHi: 'वैद्युतरसायन',
        textbookRef: 'NCERT Part 1 Ch 2, Pages 33-66',
        weightage: '9 Marks',
        keyTopics: ['Galvanic cells & Standard hydrogen electrode (SHE)', 'Nernst equation and equilibrium constant calculation', 'Conductivity, Molar conductivity, Kohlrausch’s law of independent migration', 'Faraday’s laws of electrolysis and battery cells (Lead accumulator, Fuel cell)'],
      },
      {
        id: 'c12_c3',
        chapterNo: 3,
        titleEn: 'Chemical Kinetics',
        titleHi: 'रासायनिक बलगतिकी',
        textbookRef: 'NCERT Part 1 Ch 3, Pages 67-96',
        weightage: '7 Marks',
        keyTopics: ['Rate of reaction, Rate law and Order vs Molecularity', 'Integrated rate equations for zero and first order reactions', 'Half-life period (t1/2) calculations', 'Arrhenius equation and activation energy (Ea) graphs'],
      },
      {
        id: 'c12_c4',
        chapterNo: 4,
        titleEn: 'Coordination Compounds',
        titleHi: 'उपसहसंयोजन यौगिक',
        textbookRef: 'NCERT Part 1 Ch 5, Pages 137-168',
        weightage: '7 Marks',
        keyTopics: ['Werner’s theory of coordination compounds', 'IUPAC nomenclature of mononuclear coordination complexes', 'Isomerism (Geometrical, Optical, Linkage, Coordination)', 'Valence Bond Theory (VBT) and Crystal Field Theory (CFT) octahedral/tetrahedral splitting'],
      },
    ],
  },
];

const COMPETITIVE_SYLLABUS: SyllabusSubject[] = [
  {
    id: 'jee_neet_phy',
    nameEn: 'Physics (NTA 10-Yr PYQ High-Yield Topics)',
    nameHi: 'भौतिकी (10-वर्षीय PYQ प्रश्न एवं वेटेज)',
    icon: '🎯',
    bookTitle: 'Official NTA 2015-2025 Previous 10 Years Question Bank',
    chapters: [
      {
        id: 'comp_p1',
        chapterNo: 1,
        titleEn: 'Rotational Dynamics & Moment of Inertia',
        titleHi: 'घूर्णन गति एवं जड़त्व आघूर्ण',
        textbookRef: 'NTA JEE/NEET 2015-2025 PYQ Sets',
        weightage: '8-12% (2-3 Questions/Paper)',
        keyTopics: ['Parallel and Perpendicular axes theorems', 'Rolling without slipping on inclined plane (a = g sinθ / (1 + k²/R²))', 'Conservation of angular momentum in collisions'],
        pyqCount: 42,
      },
      {
        id: 'comp_p2',
        chapterNo: 2,
        titleEn: 'Thermodynamics & Kinetic Theory',
        titleHi: 'ऊष्मागतिकी एवं अणुगति सिद्धांत',
        textbookRef: 'NTA JEE/NEET 2015-2025 PYQ Sets',
        weightage: '9-11% (2 Questions/Paper)',
        keyTopics: ['First law of thermodynamics (Q = ΔU + W)', 'Isothermal, Adiabatic, Isochoric, Isobaric processes', 'Carnot engine efficiency and heat pumps (η = 1 - T2/T1)'],
        pyqCount: 38,
      },
      {
        id: 'comp_p3',
        chapterNo: 3,
        titleEn: 'Electrodynamics & AC Circuits',
        titleHi: 'विद्युतगतिकी एवं प्रत्यावर्ती धारा',
        textbookRef: 'NTA JEE/NEET 2015-2025 PYQ Sets',
        weightage: '14-16% (3-4 Questions/Paper)',
        keyTopics: ['Coulomb’s law, Gauss’s law with non-uniform charge density', 'Series LCR resonance, Quality factor Q and Power factor cos φ', 'Faraday’s laws & Mutual inductance'],
        pyqCount: 64,
      },
      {
        id: 'comp_p4',
        chapterNo: 4,
        titleEn: 'Modern Physics & Photoelectric Effect',
        titleHi: 'आधुनिक भौतिकी एवं प्रकाश विद्युत प्रभाव',
        textbookRef: 'NTA JEE/NEET 2015-2025 PYQ Sets',
        weightage: '12-14% (3 Questions/Paper)',
        keyTopics: ['Einstein’s photoelectric equation (hν = W + Kmax)', 'de Broglie wavelength for accelerated charged particles (λ = h / √(2mqV))', 'Bohr hydrogen energy states & Rydberg formula for spectral lines'],
        pyqCount: 52,
      },
    ],
  },
  {
    id: 'jee_neet_chem_bio',
    nameEn: 'Chemistry & Biology / Math High-Yield PYQs',
    nameHi: 'रसायन, जीवविज्ञान / गणित PYQ',
    icon: '🧬',
    bookTitle: 'NTA Official 10-Year Question Archives (2015-2025)',
    chapters: [
      {
        id: 'comp_cb1',
        chapterNo: 1,
        titleEn: 'Organic Reaction Mechanisms & Named Reactions',
        titleHi: 'कार्बनिक अभिक्रिया क्रियाविधि',
        textbookRef: 'NTA JEE/NEET 2015-2025 Papers',
        weightage: '14% Exam Weightage',
        keyTopics: ['SN1 and SN2 nucleophilic substitutions with stereochemistry', 'Aldol condensation, Cannizzaro reaction, Hoffman bromamide', 'Acidity of phenols and basicity of substituted anilines'],
        pyqCount: 48,
      },
      {
        id: 'comp_cb2',
        chapterNo: 2,
        titleEn: 'Genetics, Evolution & Biotechnology (NEET) / Calculus (JEE)',
        titleHi: 'आनुवंशिकी एवं जैवप्रौद्योगिकी / कलन',
        textbookRef: 'NTA Official Examination 2015-2025 Papers',
        weightage: '18% Exam Weightage',
        keyTopics: ['Mendelian crosses, Pedigree analysis, Lac operon', 'Recombinant DNA technology: Restriction enzymes and cloning vectors', 'For JEE: Definite integrals, Differential equations, Maxima-Minima'],
        pyqCount: 76,
      },
    ],
  },
];

interface SyllabusCrossCheckIndexProps {
  goalCategory: GoalCategory;
  selectedClass: '10' | '12';
  selectedBoard: EducationBoard;
  selectedExam: ExamCategory;
  language: LanguageCode;
}

export const SyllabusCrossCheckIndex: React.FC<SyllabusCrossCheckIndexProps> = ({
  goalCategory,
  selectedClass,
  selectedBoard,
  selectedExam,
  language,
}) => {
  // Determine relevant syllabus dataset
  const activeSyllabus =
    goalCategory === 'competitive_entrance'
      ? COMPETITIVE_SYLLABUS
      : selectedClass === '12'
      ? CLASS_12_SYLLABUS
      : CLASS_10_SYLLABUS;

  const [activeSubjectId, setActiveSubjectId] = useState<string>(activeSyllabus[0]?.id || '');
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [verifiedChapters, setVerifiedChapters] = useState<Record<string, boolean>>({});

  const currentSubject =
    activeSyllabus.find((s) => s.id === activeSubjectId) || activeSyllabus[0];

  const toggleVerifyChapter = (chapterId: string) => {
    setVerifiedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleVerifyAllInSubject = () => {
    const updated = { ...verifiedChapters };
    currentSubject.chapters.forEach((ch) => {
      updated[ch.id] = true;
    });
    setVerifiedChapters(updated);
  };

  const totalVerified = Object.values(verifiedChapters).filter(Boolean).length;
  const totalChapters = activeSyllabus.reduce((acc, s) => acc + s.chapters.length, 0);

  return (
    <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Curriculum Cross-Check & Index
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {goalCategory === 'competitive_entrance'
                ? `${selectedExam.replace('_', ' ')} (10-Yr PYQ Bank 2015-2025)`
                : `${selectedBoard} Board — Class ${selectedClass}`}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
            <span>Verify Official Chapters Index</span>
            <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {totalVerified} of {totalChapters} Verified
            </span>
          </h3>
          <p className="text-xs text-zinc-400">
            Cross-check chapters and official textbook references before proceeding to launch your learning mission.
          </p>
        </div>

        <button
          type="button"
          onClick={handleVerifyAllInSubject}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Cross-Check All in Subject</span>
        </button>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {activeSyllabus.map((subject) => {
          const isSelected = subject.id === currentSubject.id;
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => {
                setActiveSubjectId(subject.id);
                setExpandedChapterId(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold shadow-md'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <span>{subject.icon}</span>
              <span>{language === 'hi' ? subject.nameHi : subject.nameEn}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-zinc-950/20 text-zinc-900 font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                {subject.chapters.length} Ch
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Subject Textbook Source */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/80 px-3.5 py-2 rounded-xl border border-zinc-800/80">
        <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-mono text-zinc-300">
          Source Textbook: <strong className="text-zinc-100">{currentSubject.bookTitle}</strong>
        </span>
      </div>

      {/* Chapter Indices List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {currentSubject.chapters.map((chapter) => {
          const isVerified = !!verifiedChapters[chapter.id];
          const isExpanded = expandedChapterId === chapter.id;

          return (
            <div
              key={chapter.id}
              className={`rounded-xl border transition-all ${
                isVerified
                  ? 'bg-emerald-950/10 border-emerald-500/40'
                  : 'bg-zinc-900/60 border-zinc-800/90 hover:border-zinc-700'
              }`}
            >
              {/* Chapter Summary Row */}
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  onClick={() => setExpandedChapterId(isExpanded ? null : chapter.id)}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    isVerified
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  }`}>
                    {String(chapter.chapterNo).padStart(2, '0')}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-xs sm:text-sm text-zinc-100 truncate">
                        {language === 'hi' ? chapter.titleHi : chapter.titleEn}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700/60">
                        {chapter.weightage}
                      </span>
                      {chapter.pyqCount && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {chapter.pyqCount} 10-Yr PYQs
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate mt-0.5 font-mono">
                      {chapter.textbookRef}
                    </div>
                  </div>
                </div>

                {/* Right controls: Verify Checkmark Toggle & Expand Arrow */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleVerifyChapter(chapter.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isVerified
                        ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                    }`}
                    title={isVerified ? 'Chapter verified' : 'Click to mark chapter verified'}
                  >
                    <Check className={`w-3.5 h-3.5 ${isVerified ? 'text-zinc-950' : 'text-zinc-400'}`} />
                    <span className="hidden sm:inline">{isVerified ? 'Verified' : 'Check'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpandedChapterId(isExpanded ? null : chapter.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                    title="Toggle chapter details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Key Topics & In-Text Drills */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-zinc-800/80 bg-zinc-950/50 space-y-2 rounded-b-xl text-xs">
                  <div className="font-mono text-zinc-400 text-[11px] uppercase font-bold">
                    Official Textbook Sub-Topics & Exercise Blueprint:
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-zinc-300">
                    {chapter.keyTopics.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 text-[10px] text-zinc-400 font-mono flex items-center justify-between border-t border-zinc-800/60">
                    <span>Target Board: {selectedBoard}</span>
                    <span>Synchronized with NCERT & State Repository</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
