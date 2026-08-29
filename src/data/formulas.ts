/**
 * StudyOS AI - Comprehensive Quick Formula Database
 * NCERT Class 10 & 12, JEE Main & NEET, UP Board, ICSE High-Yield Cheat Sheets
 */
import { FormulaEntry } from '../types';

export const FORMULA_DATABASE: FormulaEntry[] = [
  // ----------------------------------------------------
  // PHYSICS: Current Electricity & Circuits
  // ----------------------------------------------------
  {
    id: 'form_ohms_law',
    title: "Ohm's Law & Resistance",
    subjectId: 'phy_10_electricity',
    subjectName: 'Physics',
    chapterId: 'ch_electricity_fundamentals',
    chapterName: 'Current Electricity & Circuits',
    latex: 'V = I \\cdot R \\quad \\iff \\quad R = \\frac{V}{I}',
    plainText: 'V = I * R (Voltage = Current * Resistance)',
    explanation:
      'The electric current flowing through a metallic conductor is directly proportional to the potential difference applied across its ends, provided temperature and physical conditions remain constant.',
    variables: [
      { symbol: 'V', meaning: 'Potential Difference / Voltage', unit: 'Volt (V)' },
      { symbol: 'I', meaning: 'Electric Current', unit: 'Ampere (A)' },
      { symbol: 'R', meaning: 'Electrical Resistance', unit: 'Ohm (Ω)' },
    ],
    applications: [
      'Determining required current for domestic load circuits',
      'Calculating series and shunt resistors for circuit safety',
      'Determining voltage drop across transmission cables',
    ],
    boardPyqFrequency: 'Crucial',
    commonMistakes: [
      'Assuming Ohm’s law applies to non-ohmic devices like diodes and transistors',
      'Forgetting that resistance increases with temperature in pure metallic conductors',
    ],
    tags: ['electricity', 'current', 'voltage', 'resistors', 'class10', 'jee'],
  },
  {
    id: 'form_resistivity',
    title: 'Resistance Dependency & Resistivity Formula',
    subjectId: 'phy_10_electricity',
    subjectName: 'Physics',
    chapterId: 'ch_electricity_fundamentals',
    chapterName: 'Current Electricity & Circuits',
    latex: 'R = \\rho \\frac{L}{A} = \\rho \\frac{L}{\\pi r^2}',
    plainText: 'R = rho * (L / A)',
    explanation:
      'Resistance of a uniform conductor is directly proportional to its length (L) and inversely proportional to its cross-sectional area (A). The proportionality constant ρ (rho) is the material resistivity.',
    variables: [
      { symbol: 'R', meaning: 'Resistance', unit: 'Ohm (Ω)' },
      { symbol: 'ρ (rho)', meaning: 'Electrical Resistivity', unit: 'Ohm-meter (Ω·m)' },
      { symbol: 'L', meaning: 'Length of conductor', unit: 'Meter (m)' },
      { symbol: 'A', meaning: 'Cross-sectional area', unit: 'Square Meter (m²)' },
      { symbol: 'r', meaning: 'Wire radius', unit: 'Meter (m)' },
    ],
    applications: [
      'Stretching of wires: when stretched to n-times length with constant volume, new resistance becomes n² * R',
      'Selecting alloy materials (Nichrome) for heating appliances due to high resistivity and resistance to oxidation',
    ],
    boardPyqFrequency: 'Very High',
    commonMistakes: [
      'Confusing resistance (geometry dependent) with resistivity (material constant independent of length/area)',
      'Forgetting that stretching wire halves the area if length doubles (constant volume V = A*L)',
    ],
    tags: ['resistivity', 'wire', 'dimensions', 'physics'],
  },
  {
    id: 'form_series_parallel',
    title: 'Series & Parallel Equivalent Resistance',
    subjectId: 'phy_10_electricity',
    subjectName: 'Physics',
    chapterId: 'ch_electricity_fundamentals',
    chapterName: 'Current Electricity & Circuits',
    latex: 'R_s = \\sum_{i=1}^n R_i \\quad \\text{and} \\quad \\frac{1}{R_p} = \\sum_{i=1}^n \\frac{1}{R_i}',
    plainText: 'Series: R_eq = R1 + R2 + ... | Parallel: 1/R_eq = 1/R1 + 1/R2 + ...',
    explanation:
      'In a series circuit, current is identical across all components and total resistance is the algebraic sum. In parallel circuits, voltage is identical across every branch and equivalent resistance is always smaller than the smallest branch.',
    variables: [
      { symbol: 'R_s', meaning: 'Equivalent series resistance', unit: 'Ohm (Ω)' },
      { symbol: 'R_p', meaning: 'Equivalent parallel resistance', unit: 'Ohm (Ω)' },
      { symbol: 'R₁, R₂', meaning: 'Individual branch resistors', unit: 'Ohm (Ω)' },
    ],
    applications: [
      'For two resistors in parallel: R_eq = (R1 * R2) / (R1 + R2)',
      'For n identical resistors of value R in parallel: R_eq = R / n',
      'For n identical resistors in series: R_eq = n * R',
    ],
    boardPyqFrequency: 'Crucial',
    commonMistakes: [
      'Adding reciprocals and forgetting to invert at the end (finding 1/R_p instead of R_p)',
      'Assuming current splits equally in unequal parallel branches',
    ],
    tags: ['series', 'parallel', 'equivalent', 'circuits'],
  },
  {
    id: 'form_electric_power_joule',
    title: 'Electric Power & Joule’s Heating Law',
    subjectId: 'phy_10_electricity',
    subjectName: 'Physics',
    chapterId: 'ch_electricity_fundamentals',
    chapterName: 'Current Electricity & Circuits',
    latex: 'P = V \\cdot I = I^2 R = \\frac{V^2}{R} \\quad ; \\quad H = I^2 R t',
    plainText: 'P = V * I = I^2 * R = V^2 / R and Heat H = I^2 * R * t',
    explanation:
      'Rate at which electrical energy is consumed or dissipated in a circuit is electrical power. Heat produced in a resistor is proportional to the square of current, resistance, and time duration.',
    variables: [
      { symbol: 'P', meaning: 'Electrical Power', unit: 'Watt (W)' },
      { symbol: 'H', meaning: 'Heat Generated / Energy dissipated', unit: 'Joule (J)' },
      { symbol: 't', meaning: 'Time duration', unit: 'Seconds (s)' },
      { symbol: '1 kWh', meaning: 'Commercial unit of energy (1 Unit)', typicalValue: '3.6 × 10⁶ Joules' },
    ],
    applications: [
      'Calculating monthly household electricity bill: Units = (Total Watts × Hours per day × 30) / 1000',
      'Bulb brightness comparison: In series, higher resistance bulb glows brighter; in parallel, lower resistance bulb glows brighter',
    ],
    boardPyqFrequency: 'Very High',
    commonMistakes: [
      'Using P = I²R when voltage is fixed (parallel mains 220V) instead of P = V²/R',
      'Using time in minutes or hours directly in Joule’s equation without converting to seconds',
    ],
    tags: ['power', 'joule-heating', 'energy', 'kwh', 'class10'],
  },

  // ----------------------------------------------------
  // PHYSICS: Light - Reflection & Refraction
  // ----------------------------------------------------
  {
    id: 'form_mirror_magnification',
    title: 'Spherical Mirror Formula & Linear Magnification',
    subjectId: 'phy_10_light',
    subjectName: 'Physics',
    chapterId: 'ch_light_optics',
    chapterName: 'Light: Reflection & Refraction',
    latex: '\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u} \\quad ; \\quad m = -\\frac{v}{u} = \\frac{h_i}{h_o}',
    plainText: '1/f = 1/v + 1/u and Magnification m = -v/u = h_i / h_o',
    explanation:
      'Relates focal length (f), object distance (u), and image distance (v) for concave and convex spherical mirrors using standard Cartesian sign conventions.',
    variables: [
      { symbol: 'f', meaning: 'Focal length (f = R/2)', unit: 'Meter (m) or cm' },
      { symbol: 'u', meaning: 'Object distance (always negative in sign convention)', unit: 'cm' },
      { symbol: 'v', meaning: 'Image distance', unit: 'cm' },
      { symbol: 'm', meaning: 'Linear Magnification', unit: 'Dimensionless' },
      { symbol: 'h_i, h_o', meaning: 'Image height and Object height', unit: 'cm' },
    ],
    applications: [
      'Concave mirrors in shaving/dentist mirrors: produces magnified virtual image when u < f',
      'Convex rear-view mirrors in automobiles: always produces erect, diminished virtual image with wide field of view',
    ],
    boardPyqFrequency: 'Crucial',
    commonMistakes: [
      'Missing the minus sign in mirror magnification formula (m = -v/u for mirrors vs m = +v/u for lenses)',
      'Forgetting that object distance u is ALWAYS negative (-u)',
    ],
    tags: ['light', 'mirror', 'optics', 'reflection', 'focal-length'],
  },
  {
    id: 'form_lens_power',
    title: 'Lens Formula, Magnification & Power of Lens',
    subjectId: 'phy_10_light',
    subjectName: 'Physics',
    chapterId: 'ch_light_optics',
    chapterName: 'Light: Reflection & Refraction',
    latex: '\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u} \\quad ; \\quad m = \\frac{v}{u} = \\frac{h_i}{h_o} \\quad ; \\quad P = \\frac{1}{f \\text{ (in meters)}}',
    plainText: '1/f = 1/v - 1/u and m = v/u and Power P = 1/f (in meters)',
    explanation:
      'Relates focal length and conjugate distances for spherical thin lenses. Power of a lens is the degree of convergence or divergence of light rays, equal to the reciprocal of focal length in meters.',
    variables: [
      { symbol: 'P', meaning: 'Power of lens', unit: 'Dioptre (D)' },
      { symbol: 'f', meaning: 'Focal length (Positive for Convex, Negative for Concave)', unit: 'Meters (m)' },
      { symbol: 'P_total', meaning: 'Combination of lenses in contact', typicalValue: 'P₁ + P₂ + P₃' },
    ],
    applications: [
      'Myopia (near-sightedness) correction requires concave lens of negative power (P < 0)',
      'Hypermetropia (far-sightedness) correction requires convex lens of positive power (P > 0)',
    ],
    boardPyqFrequency: 'Very High',
    commonMistakes: [
      'Calculating Power P = 1/f with f in centimeters instead of meters (Power in Dioptres requires 100/f if f is in cm)',
      'Mixing up signs in lens formula (1/f = 1/v - 1/u) with mirror formula (1/f = 1/v + 1/u)',
    ],
    tags: ['lens', 'power', 'dioptre', 'myopia', 'hypermetropia', 'optics'],
  },
  {
    id: 'form_snells_law',
    title: 'Snell’s Law of Refraction & Refractive Index',
    subjectId: 'phy_10_light',
    subjectName: 'Physics',
    chapterId: 'ch_light_optics',
    chapterName: 'Light: Reflection & Refraction',
    latex: 'n = \\frac{c}{v} = \\frac{\\sin i}{\\sin r} = \\frac{n_2}{n_1} \\quad ; \\quad n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2',
    plainText: 'n = c/v = sin(i) / sin(r) and n1*sin(theta1) = n2*sin(theta2)',
    explanation:
      'The ratio of the sine of the angle of incidence to the sine of the angle of refraction is a constant for a given pair of media and color of light.',
    variables: [
      { symbol: 'c', meaning: 'Speed of light in vacuum', typicalValue: '3.0 × 10⁸ m/s' },
      { symbol: 'v', meaning: 'Speed of light in medium', unit: 'm/s' },
      { symbol: 'n', meaning: 'Absolute refractive index (always >= 1)', unit: 'Dimensionless' },
      { symbol: 'i, r', meaning: 'Angle of incidence and angle of refraction', unit: 'Degrees' },
    ],
    applications: [
      'Apparent depth of a swimming pool: Apparent Depth = Real Depth / n',
      'Optical fibers and total internal reflection (TIR) when angle of incidence exceeds critical angle θ_c = sin⁻¹(1/n)',
    ],
    boardPyqFrequency: 'Crucial',
    commonMistakes: [
      'Using refractive index of medium 1 instead of medium 2 in relative index calculations (₁n₂ = n₂ / n₁)',
      'Forgetting that frequency of light remains UNCHANGED during refraction, while speed and wavelength change',
    ],
    tags: ['snells-law', 'refraction', 'speed-of-light', 'optics'],
  },

  // ----------------------------------------------------
  // MATHEMATICS: Quadratic Equations & Algebra
  // ----------------------------------------------------
  {
    id: 'form_quadratic_formula',
    title: 'Quadratic Formula, Discriminant & Nature of Roots',
    subjectId: 'math_10_algebra',
    subjectName: 'Mathematics',
    chapterId: 'ch_quadratics',
    chapterName: 'Quadratic Equations & Polynomials',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\quad ; \\quad D = b^2 - 4ac',
    plainText: 'x = (-b ± sqrt(b^2 - 4ac)) / (2a) and Discriminant D = b^2 - 4ac',
    explanation:
      'For any quadratic equation ax² + bx + c = 0 (a ≠ 0), the nature of roots is determined by discriminant D: D > 0 (two distinct real roots), D = 0 (two equal real roots -b/2a), D < 0 (no real roots / complex conjugate roots).',
    variables: [
      { symbol: 'a, b, c', meaning: 'Coefficients of quadratic equation', unit: 'Real constants (a ≠ 0)' },
      { symbol: 'D', meaning: 'Discriminant: b² - 4ac', unit: 'Real number' },
      { symbol: 'α + β', meaning: 'Sum of roots = -b/a', typicalValue: '-b / a' },
      { symbol: 'α · β', meaning: 'Product of roots = c/a', typicalValue: 'c / a' },
    ],
    applications: [
      'Finding conditions for real and equal roots in exam word problems (set D = 0 to solve for unknown parameter k)',
      'Constructing quadratic equation from roots: x² - (Sum of roots)x + (Product of roots) = 0',
    ],
    boardPyqFrequency: 'Crucial',
    commonMistakes: [
      'Forgetting the entire numerator is divided by 2a, not just the square root term',
      'Sign error when evaluating -b when b is already negative (e.g. if b = -6, then -b = +6)',
    ],
    tags: ['quadratics', 'roots', 'discriminant', 'algebra', 'class10'],
  },
  {
    id: 'form_arithmetic_progression',
    title: 'Arithmetic Progression (AP): N-th Term & Sum of Terms',
    subjectId: 'math_10_algebra',
    subjectName: 'Mathematics',
    chapterId: 'ch_ap_series',
    chapterName: 'Arithmetic Progressions',
    latex: 'a_n = a + (n - 1)d \\quad ; \\quad S_n = \\frac{n}{2}\\left[2a + (n - 1)d\\right] = \\frac{n}{2}(a + l)',
    plainText: 'a_n = a + (n-1)*d and S_n = (n/2)*[2a + (n-1)*d] = (n/2)*(a + l)',
    explanation:
      'An arithmetic progression is a sequence of numbers where the difference of any two successive members is a constant common difference d.',
    variables: [
      { symbol: 'a', meaning: 'First term of AP', unit: 'Real number' },
      { symbol: 'd', meaning: 'Common difference (a₂ - a₁)', unit: 'Real number' },
      { symbol: 'n', meaning: 'Number of terms (always a positive integer)', unit: 'Integer >= 1' },
      { symbol: 'a_n / l', meaning: 'N-th term or last term', unit: 'Real number' },
      { symbol: 'S_n', meaning: 'Sum of first n terms', unit: 'Real number' },
    ],
    applications: [
      'Sum of first n natural numbers: S_n = n(n + 1) / 2',
      'Finding N-th term from given Sum formula: a_n = S_n - S_{n-1}',
    ],
    boardPyqFrequency: 'Crucial',
    commonMistakes: [
      'Confusing common difference sign: if AP is decreasing (e.g. 20, 16, 12...), d is negative (d = -4)',
      'Assuming n can be a fraction or negative in contextual problems',
    ],
    tags: ['arithmetic-progression', 'series', 'sum-of-ap', 'class10'],
  },
  {
    id: 'form_trigonometry_identities',
    title: 'Trigonometric Pythagorean Identities & Ratios',
    subjectId: 'math_10_trig',
    subjectName: 'Mathematics',
    chapterId: 'ch_trigonometry',
    chapterName: 'Trigonometry & Applications',
    latex: '\\sin^2\\theta + \\cos^2\\theta = 1 \\quad ; \\quad 1 + \\tan^2\\theta = \\sec^2\\theta \\quad ; \\quad 1 + \\cot^2\\theta = \\csc^2\\theta',
    plainText: 'sin^2(θ) + cos^2(θ) = 1, 1 + tan^2(θ) = sec^2(θ), 1 + cot^2(θ) = cosec^2(θ)',
    explanation:
      'Fundamental identities relating angles and side ratios in right-angled triangles and unit circles.',
    variables: [
      { symbol: 'sin θ', meaning: 'Opposite / Hypotenuse', unit: 'Ratio' },
      { symbol: 'cos θ', meaning: 'Adjacent / Hypotenuse', unit: 'Ratio' },
      { symbol: 'tan θ', meaning: 'Opposite / Adjacent = sin θ / cos θ', unit: 'Ratio' },
      { symbol: 'Standard Values', meaning: 'sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2, tan 45° = 1', typicalValue: 'Exact tables' },
    ],
    applications: [
      'Heights and Distances: Height h = d * tan(angle of elevation)',
      'Simplifying complex algebraic trigonometric proofs',
    ],
    boardPyqFrequency: 'Crucial',
    commonMistakes: [
      'Confusing sec²θ - tan²θ = 1 with tan²θ - sec²θ = -1',
      'Writing sin(A + B) as sin A + sin B (which is algebraically false)',
    ],
    tags: ['trigonometry', 'identities', 'angles', 'heights-distances'],
  },
  {
    id: 'form_coordinate_geometry',
    title: 'Distance Formula & Section Formula (Internal Division)',
    subjectId: 'math_10_geometry',
    subjectName: 'Mathematics',
    chapterId: 'ch_coordinate_geom',
    chapterName: 'Coordinate Geometry',
    latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} \\quad ; \\quad P(x, y) = \\left( \\frac{m_1 x_2 + m_2 x_1}{m_1 + m_2}, \\frac{m_1 y_2 + m_2 y_1}{m_1 + m_2} \\right)',
    plainText: 'd = sqrt((x2 - x1)^2 + (y2 - y1)^2) and P(x,y) = ((m1*x2 + m2*x1)/(m1+m2), (m1*y2 + m2*y1)/(m1+m2))',
    explanation:
      'Calculates Euclidean distance between two coordinate points and coordinates of point P dividing line segment AB internally in the ratio m₁ : m₂.',
    variables: [
      { symbol: '(x₁, y₁), (x₂, y₂)', meaning: 'Endpoints of line segment', unit: 'Cartesian coordinates' },
      { symbol: 'm₁ : m₂', meaning: 'Internal division ratio (often set as k : 1)', unit: 'Ratio' },
      { symbol: 'Midpoint', meaning: 'When m₁ = m₂: ((x₁ + x₂)/2, (y₁ + y₂)/2)', typicalValue: 'Midpoint formula' },
      { symbol: 'Centroid of Triangle', meaning: 'G = ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3)', typicalValue: 'Centroid formula' },
    ],
    applications: [
      'Finding the ratio in which the y-axis (x = 0) or x-axis (y = 0) divides a line segment',
      'Proving collinearity of 3 points or verifying parallelogram diagonals bisect each other',
    ],
    boardPyqFrequency: 'Very High',
    commonMistakes: [
      'Multiplying ratio m₁ with x₁ instead of cross-multiplying m₁ with x₂',
      'Sign mistakes when coordinates contain negative values',
    ],
    tags: ['coordinate-geometry', 'distance', 'section-formula', 'centroid'],
  },

  // ----------------------------------------------------
  // CHEMISTRY: Chemical Formulas & Stoichiometry
  // ----------------------------------------------------
  {
    id: 'form_ph_scale',
    title: 'pH Scale & Hydrogen Ion Concentration',
    subjectId: 'chem_10_acids',
    subjectName: 'Chemistry',
    chapterId: 'ch_acids_bases',
    chapterName: 'Acids, Bases and Salts',
    latex: '\\text{pH} = -\\log_{10}[\\text{H}^+] \\quad ; \\quad \\text{pH} + \\text{pOH} = 14 \\quad \\text{at } 25^\\circ\\text{C}',
    plainText: 'pH = -log10[H+] and pH + pOH = 14 at 25°C',
    explanation:
      'Quantitative measure of the acidity or basicity of an aqueous solution. Scale ranges from 0 (strongly acidic) to 7 (neutral) to 14 (strongly alkaline). A 1-unit decrease in pH represents a 10-fold increase in [H+] concentration.',
    variables: [
      { symbol: 'pH', meaning: 'Potential of Hydrogen (scale 0 - 14)', unit: 'Dimensionless' },
      { symbol: '[H⁺]', meaning: 'Molar concentration of hydrogen/hydronium ions', unit: 'mol/L (M)' },
      { symbol: 'Kw', meaning: 'Ionic product of water at 25°C = [H⁺][OH⁻]', typicalValue: '1.0 × 10⁻¹⁴' },
    ],
    applications: [
      'Soil pH optimization for agriculture (adding slaked lime Ca(OH)₂ or chalk to acidic soil)',
      'Tooth decay prevention: Enamel decays when mouth pH falls below 5.5',
      'Antacid treatment (Milk of Magnesia Mg(OH)₂ / Baking soda NaHCO₃) for stomach hyperacidity',
    ],
    boardPyqFrequency: 'Very High',
    commonMistakes: [
      'Thinking a higher pH means a stronger acid (higher pH means MORE basic, lower pH means MORE acidic)',
      'Assuming dilution changes an acid into a basic solution (diluting an acid only approaches pH 7)',
    ],
    tags: ['ph-scale', 'acids', 'bases', 'chemistry', 'class10'],
  },
  {
    id: 'form_mole_concept',
    title: 'The Mole Concept & Avogadro’s Number',
    subjectId: 'chem_10_reactions',
    subjectName: 'Chemistry',
    chapterId: 'ch_chemical_reactions',
    chapterName: 'Chemical Reactions & Equations',
    latex: 'n = \\frac{m}{M} = \\frac{N}{N_A} = \\frac{V_{\\text{STP}}}{22.4\\text{ L}} \\quad ; \\quad N_A = 6.022 \\times 10^{23}\\text{ mol}^{-1}',
    plainText: 'n = mass / MolarMass = N / N_A = Volume_at_STP / 22.4L',
    explanation:
      'One mole of any substance contains exactly 6.022 × 10²³ elementary entities (atoms, molecules, or ions), and occupies 22.4 liters of volume at Standard Temperature and Pressure (STP).',
    variables: [
      { symbol: 'n', meaning: 'Number of moles', unit: 'mol' },
      { symbol: 'm', meaning: 'Given mass in grams', unit: 'g' },
      { symbol: 'M', meaning: 'Molar mass of substance', unit: 'g/mol' },
      { symbol: 'N', meaning: 'Number of particles (atoms/molecules)', unit: 'Count' },
      { symbol: 'N_A', meaning: 'Avogadro’s constant', typicalValue: '6.022 × 10²³' },
    ],
    applications: [
      'Calculating yield in chemical reactions and determining limiting reagents',
      'Balancing redox equations and stoichiometry calculations in board exams',
    ],
    boardPyqFrequency: 'Crucial',
    commonMistakes: [
      'Confusing molecular mass of diatomic gases (e.g. Oxygen gas O₂ is 32 g/mol, not 16 g/mol)',
      'Using 22.4 L conversion when conditions are not at STP',
    ],
    tags: ['mole-concept', 'stoichiometry', 'avogadro', 'chemistry', 'jee'],
  },

  // ----------------------------------------------------
  // SOFTWARE & SYSTEM DESIGN / TECH INTERVIEW FORMULAS
  // ----------------------------------------------------
  {
    id: 'form_littles_law',
    title: 'Little’s Law of Queuing & Concurrency (System Design)',
    subjectId: 'tech_system_design',
    subjectName: 'System Architecture',
    chapterId: 'ch_sys_concurrency',
    chapterName: 'Distributed Systems & Scalability',
    latex: 'L = \\lambda \\cdot W \\quad \\iff \\quad \\text{Concurrent Requests} = \\text{Throughput (RPS)} \\times \\text{Latency (sec)}',
    plainText: 'L = lambda * W (Concurrency = Throughput * Latency)',
    explanation:
      'Fundamental law of queuing theory in distributed system design: average number of items in a stationary queueing system (L) equals the average arrival rate (λ) multiplied by average time an item spends in the system (W).',
    variables: [
      { symbol: 'L', meaning: 'Average active concurrent requests in server', unit: 'Concurrent tasks' },
      { symbol: 'λ (lambda)', meaning: 'Arrival rate / Throughput', unit: 'Requests Per Second (RPS)' },
      { symbol: 'W', meaning: 'Average Latency / Response Time', unit: 'Seconds (s)' },
    ],
    applications: [
      'Sizing connection pools and server worker threads: If server processes 10,000 RPS with 50ms (0.05s) p99 latency, minimum thread pool = 10,000 × 0.05 = 500 concurrent threads',
      'Preventing thread starvation and sizing Redis/PostgreSQL max_connections',
    ],
    boardPyqFrequency: 'Crucial',
    commonMistakes: [
      'Mixing units (multiplying RPS by milliseconds instead of seconds)',
      'Assuming system is unbounded when calculating buffer backpressure',
    ],
    tags: ['system-design', 'concurrency', 'littles-law', 'scalability', 'tech-interview'],
  },
  {
    id: 'form_amdahl_law',
    title: 'Amdahl’s Law of Parallel Speedup',
    subjectId: 'tech_system_design',
    subjectName: 'Computer Architecture',
    chapterId: 'ch_sys_concurrency',
    chapterName: 'Distributed Systems & Scalability',
    latex: 'S_{\\text{latency}}(s) = \\frac{1}{(1 - p) + \\frac{p}{s}}',
    plainText: 'Speedup = 1 / ((1 - p) + (p / s))',
    explanation:
      'Gives the theoretical speedup in latency of the execution of a task at fixed workload that can be expected of a system whose resources are improved by factor s, where p is the proportion of execution time that benefits from the improvement.',
    variables: [
      { symbol: 'p', meaning: 'Parallelizable fraction of workload (0.0 to 1.0)', unit: 'Fraction' },
      { symbol: '1 - p', meaning: 'Strictly sequential portion of workload', unit: 'Fraction' },
      { symbol: 's', meaning: 'Number of parallel processor cores or scaling factor', unit: 'Integer' },
      { symbol: 'Max Speedup', meaning: 'As s -> infinity, max theoretical speedup = 1 / (1 - p)', typicalValue: 'Theoretical ceiling' },
    ],
    applications: [
      'Evaluating whether adding more CPU cores will solve an API bottleneck (if DB locking is sequential, speedup is capped)',
      'Async batch processing architecture design',
    ],
    boardPyqFrequency: 'Very High',
    commonMistakes: [
      'Assuming adding 100 servers will give 100x speedup if 10% of code runs sequentially (max speedup with 10% sequential code is 10x even with infinite servers)',
    ],
    tags: ['amdahl', 'parallelism', 'multithreading', 'performance'],
  },
];
