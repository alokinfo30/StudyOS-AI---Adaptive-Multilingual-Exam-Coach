import { Chapter } from '../../types';

/**
 * Complete Class 12 Physics Curriculum (All 14 Chapters)
 * Rationalized NCERT 2025-26, CBSE, UPMSP, BSEB & National/State Boards
 */
export const CLASS_12_PHYSICS_ALL_CHAPTERS: Chapter[] = [
  // Chapter 1
  {
    id: 'c12_phy_ch1_electric_charges_fields',
    subjectId: 'class12_physics',
    chapterNo: 1,
    title: {
      en: 'Electric Charges and Fields',
      hi: 'वैद्युत आवेश तथा क्षेत्र',
      hinglish: 'Electric Charges & Fields',
    },
    description: {
      en: 'Coulomb’s law in vector form, superposition principle, electric field lines, electric dipole and torque in uniform field, Gauss’s law and its applications to straight wire, plane sheet, and spherical shell.',
      hi: 'कूलॉम का नियम (सदिश रूप), अध्यारोपण सिद्धांत, वैद्युत क्षेत्र रेखाएँ, वैद्युत द्विध्रुव एवं बल आघूर्ण, गाउस का नियम एवं सीधे तार, समतल चादर व गोलीय कोश पर अनुप्रयोग।',
      hinglish: 'Coulomb’s law, dipole torque τ = p × E, Gauss’s theorem ∮ E·dA = q/ε₀.',
    },
    targetMastery: 90,
    highYieldWeightage: 7,
    textbookRef: 'NCERT Physics Part 1 Class 12 Ch 1 / UPMSP Bhautik Vigyan Ch 1',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_gauss_law_applications',
        title: {
          en: 'Gauss’s Law & Field Due to Uniformly Charged Wire and Sheet',
          hi: 'गाउस का नियम एवं अनंत सीधे चालक व समतल चादर का वैद्युत क्षेत्र',
          hinglish: 'Gauss’s Law & Applications',
        },
        summary: {
          en: 'Gauss’s law states that total electric flux through any closed Gaussian surface equals 1/ε₀ times net enclosed charge: ∮ E·dA = q_enclosed / ε₀. Electric field of infinite line charge: E = λ / (2πε₀r). Field of infinite non-conducting sheet: E = σ / (2ε₀) (independent of distance).',
          hi: 'गाउस का नियम: किसी बंद पृष्ठ से गुजरने वाला कुल वैद्युत फ्लक्स ∮ E·dA = q/ε₀ होता है। अनंत रेखीय आवेश का क्षेत्र E = λ/(2πε₀r) तथा समतल चादर का E = σ/(2ε₀) होता है।',
          hinglish: 'Total flux = q/ε₀. Line charge E = λ/(2πε₀r). Infinite sheet E = σ/(2ε₀).',
        },
        formula: '\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{\\text{enclosed}}}{\\varepsilon_0}, \\quad E = \\frac{\\lambda}{2\\pi \\varepsilon_0 r}, \\quad E = \\frac{\\sigma}{2\\varepsilon_0}',
        keyPoints: [
          {
            en: 'Electric field inside a uniformly charged conducting spherical shell is identically zero (E = 0 for r < R).',
            hi: 'आवेशित गोलीय कोश के भीतर वैद्युत क्षेत्र शून्य (E = 0) होता है।',
            hinglish: 'Inside a conducting shell, electric field is strictly zero.',
          },
          {
            en: 'Electric field due to an infinite plane non-conducting sheet is independent of distance from the sheet.',
            hi: 'अनंत समतल अचालक चादर का वैद्युत क्षेत्र दूरी r पर निर्भर नहीं करता।',
            hinglish: 'E = σ/(2ε₀) does not depend on distance r.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'What is the electric field inside a hollow charged spherical conducting shell of radius R at a distance r < R from the center?',
            hi: 'त्रिज्या R वाले खोखले आवेशित गोलीय कोश के केंद्र से r < R दूरी पर आंतरिक वैद्युत क्षेत्र का मान क्या होता है?',
            hinglish: 'Hollow charged spherical shell ke andar (r < R) electric field kitna hota hai?',
          },
          options: [
            { en: 'Zero (0)', hi: 'शून्य (0)', hinglish: 'Zero (0)' },
            { en: 'q / (4πε₀ R²)', hi: 'q / (4πε₀ R²)', hinglish: 'q / (4πε₀ R²)' },
            { en: 'q / (4πε₀ r²)', hi: 'q / (4πε₀ r²)', hinglish: 'q / (4πε₀ r²)' },
            { en: 'Infinity', hi: 'अनंत', hinglish: 'Infinity' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Because all free charge resides exclusively on the outer surface, any Gaussian surface drawn inside (r < R) encloses zero charge. By Gauss’s law, E = 0 everywhere inside.',
            hi: 'आवेश केवल बाह्य सतह पर रहता है अतः कोश के भीतर परिबद्ध आवेश शून्य होने से E = 0 होता है।',
            hinglish: 'Enclosed charge inside hollow shell is zero, hence E = 0.',
          }
        },
      },
    ],
  },

  // Chapter 2
  {
    id: 'c12_phy_ch2_electrostatic_potential_capacitance',
    subjectId: 'class12_physics',
    chapterNo: 2,
    title: {
      en: 'Electrostatic Potential and Capacitance',
      hi: 'स्थिरवैद्युत विभव तथा धारिता',
      hinglish: 'Electrostatic Potential & Capacitance',
    },
    description: {
      en: 'Electric potential due to point charge and dipole, equipotential surfaces, potential energy of system of charges, parallel plate capacitor with dielectric medium, series and parallel combination, and energy density.',
      hi: 'बिंदु आवेश व द्विध्रुव का विभव, समविभव पृष्ठ, निकाय की स्थितिज ऊर्जा, परावैद्युत माध्यम युक्त समांतर पट्ट संधारित्र, संयोजन एवं ऊर्जा घनत्व।',
      hinglish: 'Equipotential surfaces, C = κε₀A/d, energy U = ½ CV².',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Physics Part 1 Class 12 Ch 2 / UPMSP Bhautik Vigyan Ch 2',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_parallel_plate_capacitor_dielectric',
        title: {
          en: 'Parallel Plate Capacitor with Dielectric & Energy Stored',
          hi: 'परावैद्युत युक्त समांतर पट्ट संधारित्र एवं संचित ऊर्जा',
          hinglish: 'Capacitor with Dielectric & Energy Stored',
        },
        summary: {
          en: 'Capacitance of a parallel plate capacitor in vacuum is C₀ = ε₀A/d. When a dielectric slab of dielectric constant κ fills the gap, capacitance increases to C = κ C₀. Energy stored is U = ½ CV² = ½ Q²/C = ½ QV. Energy density in electric field is u = ½ ε₀E².',
          hi: 'निर्वात में समांतर पट्ट संधारित्र की धारिता C₀ = ε₀A/d होती है। परावैद्युतांक κ का माध्यम भरने पर C = κ C₀ हो जाती है। संचित ऊर्जा U = ½ CV² तथा ऊर्जा घनत्व u = ½ ε₀E² होता है।',
          hinglish: 'Capacitance with dielectric becomes κ times: C = κε₀A/d. Stored energy U = ½ CV².',
        },
        formula: 'C = \\frac{\\kappa \\varepsilon_0 A}{d}, \\quad U = \\frac{1}{2}CV^2 = \\frac{Q^2}{2C}, \\quad u_E = \\frac{1}{2}\\varepsilon_0 E^2',
        keyPoints: [
          {
            en: 'Work done in moving a test charge over an equipotential surface is strictly zero because electric field is everywhere perpendicular to the surface.',
            hi: 'समविभव पृष्ठ पर आवेश को ले जाने में किया गया कार्य शून्य होता है क्योंकि वैद्युत क्षेत्र पृष्ठ के लंबवत होता है।',
            hinglish: 'Work done on equipotential surface is always zero.',
          },
          {
            en: 'If a dielectric is inserted with battery disconnected, charge Q remains constant while potential V drops by factor κ.',
            hi: 'बैटरी हटाने के बाद परावैद्युत रखने पर आवेश नियत रहता है तथा विभव V/κ हो जाता है।',
            hinglish: 'Battery disconnected → Q constant, V decreases, U decreases.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'A parallel plate capacitor is charged and then disconnected from the battery. A dielectric slab (κ = 4) is inserted between the plates. What happens to the energy stored in the capacitor?',
            hi: 'एक समांतर पट्ट संधारित्र को आवेशित कर बैटरी से अलग कर दिया जाता है। प्लेटों के बीच परावैद्युत पट्टिका (κ = 4) रखने पर संचित ऊर्जा पर क्या प्रभाव पड़ेगा?',
            hinglish: 'Battery disconnect karke dielectric (κ = 4) dalne par stored energy kya hogi?',
          },
          options: [
            { en: 'Decreases by a factor of 4 (U = U₀ / 4)', hi: '4 गुना घट जाएगी (U = U₀ / 4)', hinglish: '4 times kam ho jayegi (U₀/4)' },
            { en: 'Increases by a factor of 4', hi: '4 गुना बढ़ जाएगी', hinglish: '4 times badh jayegi' },
            { en: 'Remains unchanged', hi: 'अपरिवर्तित रहेगी', hinglish: 'Same rahegi' },
            { en: 'Increases by 16 times', hi: '16 गुना बढ़ जाएगी', hinglish: '16 times badhegi' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'With battery disconnected, charge Q is conserved. Since C = 4 C₀, energy U = Q² / (2C) = Q² / (2 × 4 C₀) = U₀ / 4.',
            hi: 'बैटरी अलग होने पर आवेश Q स्थिर रहता है। C = 4 C₀ होने से U = Q²/(2C) = U₀/4 हो जाता है।',
            hinglish: 'Q is constant, C increases 4x, so U = Q²/(2C) decreases by 4x.',
          }
        },
      },
    ],
  },

  // Chapter 3
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
      en: 'Drift velocity and microscopic Ohm’s law (j = σE), temperature coefficient of resistance, internal resistance and EMF of cells, Kirchhoff’s junction and loop laws, and Wheatstone bridge balance condition.',
      hi: 'अपवाह वेग एवं ओम के नियम की व्युत्पत्ति, प्रतिरोध का ताप गुणांक, सेल का वि०वा०बल व आंतरिक प्रतिरोध, किरचॉफ के नियम, तथा व्हीटस्टोन सेतु संतुलन शर्त।',
      hinglish: 'Drift velocity vd = eEτ/m, Kirchhoff rules KCL & KVL, Wheatstone bridge P/Q = R/S.',
    },
    targetMastery: 90,
    highYieldWeightage: 9,
    textbookRef: 'NCERT Physics Part 1 Class 12 Ch 3 / UPMSP Bhautik Vigyan Ch 3',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_kirchhoff_wheatstone_bridge',
        title: {
          en: 'Kirchhoff’s Laws & Wheatstone Bridge Principle',
          hi: 'किरचॉफ के नियम एवं व्हीटस्टोन सेतु का सिद्धांत',
          hinglish: 'Kirchhoff’s Laws (KCL & KVL) & Wheatstone Bridge',
        },
        summary: {
          en: 'Kirchhoff’s Junction Law (KCL, ΣI = 0) is based on conservation of electric charge. Kirchhoff’s Loop Law (KVL, ΣΔV = 0) is based on conservation of energy. In a Wheatstone bridge with resistors P, Q, R, S, when the galvanometer detects zero current (null deflection), the balance condition is P / Q = R / S.',
          hi: 'किरचॉफ का संधि नियम (KCL, ΣI = 0) आवेश संरक्षण पर तथा लूप नियम (KVL, ΣΔV = 0) ऊर्जा संरक्षण पर आधारित है। व्हीटस्टोन सेतु संतुलन में P / Q = R / S होता है।',
          hinglish: 'KCL = charge conservation, KVL = energy conservation. Balanced Wheatstone bridge condition: P/Q = R/S.',
        },
        formula: 'I = n e A v_d, \\quad v_d = \\frac{e E \\tau}{m}, \\quad \\sum I_{\\text{junction}} = 0, \\quad \\sum \\Delta V_{\\text{loop}} = 0, \\quad \\frac{P}{Q} = \\frac{R}{S}',
        keyPoints: [
          {
            en: 'Kirchhoff’s 1st Law represents conservation of charge; 2nd Law represents conservation of energy.',
            hi: 'पहला नियम आवेश संरक्षण और दूसरा नियम ऊर्जा संरक्षण का प्रत्यक्ष प्रमाण है।',
            hinglish: '1st law = Charge conservation, 2nd law = Energy conservation.',
          },
          {
            en: 'At balance in a Wheatstone bridge, no current flows through the central galvanometer branch, so it can be removed from circuit analysis.',
            hi: 'संतुलन अवस्था में धारामापी से कोई धारा नहीं बहती, अतः उस शाखा को परिपथ से हटाया जा सकता है।',
            hinglish: 'Galvanometer branch can be ignored when bridge is balanced.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Kirchhoff’s Loop Rule (ΣΔV = 0 around any closed mesh) is a direct consequence of which fundamental conservation law?',
            hi: 'किरचॉफ का लूप नियम (बंद परिपथ में ΣΔV = 0) किस मूलभूत संरक्षण नियम पर आधारित है?',
            hinglish: 'Kirchhoff ka Loop Rule (KVL) kis conservation law par based hai?',
          },
          options: [
            { en: 'Conservation of Energy', hi: 'ऊर्जा संरक्षण का नियम', hinglish: 'Conservation of Energy' },
            { en: 'Conservation of Electric Charge', hi: 'विद्युत आवेश संरक्षण का नियम', hinglish: 'Conservation of Charge' },
            { en: 'Conservation of Linear Momentum', hi: 'रेखीय संवेग संरक्षण का नियम', hinglish: 'Conservation of Momentum' },
            { en: 'Conservation of Angular Momentum', hi: 'कोणीय संवेग संरक्षण का नियम', hinglish: 'Conservation of Angular Momentum' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Kirchhoff’s Loop Law states that total electrostatic potential change around a closed loop is zero, directly expressing that electrostatic force is conservative and total energy is conserved.',
            hi: 'लूप नियम के अनुसार बंद लूप में विभव परिवर्तनों का योग शून्य होता है जो ऊर्जा संरक्षण को सिद्ध करता है।',
            hinglish: 'KVL represents energy conservation because electrostatic force is conservative.',
          }
        },
      },
    ],
  },

  // Chapter 4
  {
    id: 'c12_phy_ch4_moving_charges_magnetism',
    subjectId: 'class12_physics',
    chapterNo: 4,
    title: {
      en: 'Moving Charges and Magnetism',
      hi: 'गतिमान आवेश और चुंबकत्व',
      hinglish: 'Moving Charges & Magnetism',
    },
    description: {
      en: 'Biot-Savart law, magnetic field on axis of circular loop, Ampere’s circuital law, solenoid, Lorentz magnetic force F = q(v × B), force between parallel conductors, and Moving Coil Galvanometer conversion to ammeter/voltmeter.',
      hi: 'बायो-सावर्ट नियम, वृत्ताकार लूप की अक्ष पर क्षेत्र, ऐम्पियर का परिपथीय नियम, परिनालिका, लॉरेंट्ज़ बल, समांतर चालकों के बीच बल, तथा चल कुण्डली धारामापी का अमीटर व वोल्टमीटर में रूपांतरण।',
      hinglish: 'Biot-Savart law dB = (μ₀/4π)(Idl sinθ/r²), Ampere’s law ∮B·dl = μ₀I, galvanometer shunt and series resistance.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Physics Part 1 Class 12 Ch 4 / UPMSP Bhautik Vigyan Ch 4',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_lorentz_galvanometer_conversion',
        title: {
          en: 'Magnetic Lorentz Force & Galvanometer Shunting Conversion',
          hi: 'चुंबकीय लॉरेंट्ज़ बल एवं धारामापी का अमीटर/वोल्टमीटर में रूपांतरण',
          hinglish: 'Lorentz Force & Galvanometer Conversion',
        },
        summary: {
          en: 'A magnetic field exerts force F = q(v × B) on moving charges; since force is always perpendicular to velocity, work done by magnetic field is zero and kinetic energy remains constant. To convert a galvanometer of resistance G into an ammeter of range I, connect a small shunt resistance S = [I_g / (I - I_g)] G in parallel. To convert into a voltmeter of range V, connect a large resistance R = (V / I_g) - G in series.',
          hi: 'चुंबकीय बल F = q(v × B) वेग के लंबवत होने से चुंबकीय बल द्वारा किया गया कार्य सदैव शून्य होता है। अमीटर बनाने हेतु समांतर क्रम में अल्प शंट प्रतिरोध S जोड़ा जाता है; वोल्टमीटर बनाने हेतु श्रेणीक्रम में उच्च प्रतिरोध R जोड़ा जाता है।',
          hinglish: 'Magnetic work done is zero. Ammeter needs small shunt in parallel; Voltmeter needs high resistance in series.',
        },
        formula: '\\vec{F} = q(\\vec{v} \\times \\vec{B}), \\quad S = \\frac{I_g}{I - I_g} G, \\quad R = \\frac{V}{I_g} - G',
        keyPoints: [
          {
            en: 'Magnetic force does no work on a charged particle; it changes only the direction of velocity, never the speed or kinetic energy.',
            hi: 'चुंबकीय बल केवल कण की दिशा बदलता है, उसकी चाल या गतिज ऊर्जा में कोई परिवर्तन नहीं करता।',
            hinglish: 'Magnetic field cannot change kinetic energy of charge.',
          },
          {
            en: 'An ideal ammeter has zero internal resistance, while an ideal voltmeter has infinite internal resistance.',
            hi: 'आदर्श अमीटर का प्रतिरोध शून्य तथा आदर्श वोल्टमीटर का प्रतिरोध अनंत होता है।',
            hinglish: 'Ideal ammeter R = 0, ideal voltmeter R = ∞.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'How is a moving coil galvanometer converted into an ammeter of higher measurement range?',
            hi: 'चल कुण्डली धारामापी को उच्च परास के अमीटर में कैसे परिवर्तित किया जाता है?',
            hinglish: 'Galvanometer ko higher range ke ammeter me kaise convert karte hain?',
          },
          options: [
            { en: 'By connecting a low resistance (shunt) in parallel with it', hi: 'इसके समांतर क्रम में एक अल्प प्रतिरोध (शंट) जोड़कर', hinglish: 'Parallel me low shunt resistance connect karke' },
            { en: 'By connecting a high resistance in series with it', hi: 'इसके श्रेणीक्रम में एक उच्च प्रतिरोध जोड़कर', hinglish: 'Series me high resistance connect karke' },
            { en: 'By connecting a high resistance in parallel with it', hi: 'इसके समांतर क्रम में एक उच्च प्रतिरोध जोड़कर', hinglish: 'Parallel me high resistance lagakar' },
            { en: 'By removing all resistance from the coil', hi: 'कुण्डली से सारा प्रतिरोध हटाकर', hinglish: 'Resistance remove karke' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'A low resistance shunt S connected in parallel bypasses the major portion of the current (I - Ig), keeping the galvanometer within its safe current limit Ig.',
            hi: 'समांतर में अल्प शंट लगाने से अधिकांश धारा शंट से निकल जाती है और धारामापी सुरक्षित रहता है।',
            hinglish: 'Low shunt resistance in parallel diverts extra current.',
          }
        },
      },
    ],
  },

  // Chapter 5
  {
    id: 'c12_phy_ch5_magnetism_matter',
    subjectId: 'class12_physics',
    chapterNo: 5,
    title: {
      en: 'Magnetism and Matter',
      hi: 'चुंबकत्व एवं द्रव्य',
      hinglish: 'Magnetism and Matter',
    },
    description: {
      en: 'Bar magnet as an equivalent solenoid, magnetic dipole moment, Gauss’s law for magnetism (∮B·dA = 0, magnetic monopoles do not exist), and classification of Dia-, Para-, and Ferromagnetic materials (Curie’s Law).',
      hi: 'परिनालिका के रूप में छड़ चुंबक, चुंबकीय द्विध्रुव आघूर्ण, चुंबकत्व का गाउस नियम (∮B·dA = 0), तथा प्रति-, अनु-, व लौहचुंबकीय पदार्थों का वर्गीकरण (क्यूरी का नियम)।',
      hinglish: 'Gauss’s law for magnetism ∮B·dA = 0, Dia, Para, Ferromagnetism, Curie law χ ∝ 1/T.',
    },
    targetMastery: 90,
    highYieldWeightage: 5,
    textbookRef: 'NCERT Physics Part 1 Class 12 Ch 5 / UPMSP Bhautik Vigyan Ch 5',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_magnetic_materials_curie',
        title: {
          en: 'Gauss’s Law for Magnetism & Dia, Para, Ferromagnetic Substances',
          hi: 'चुंबकत्व का गाउस नियम एवं प्रति, अनु, लौहचुंबकीय पदार्थ',
          hinglish: 'Magnetic Monopole Impossibility & Magnetic Substances',
        },
        summary: {
          en: 'Gauss’s law for magnetism states that net magnetic flux through any closed surface is always zero: ∮ B·dA = 0, proving that isolated magnetic monopoles do not exist. Diamagnetic substances have small negative susceptibility χ < 0 and are weakly repelled. Paramagnetic substances have small positive susceptibility χ > 0 obeying Curie’s law χ ∝ 1/T. Ferromagnetic materials have large positive χ >> 1 with magnetic domains.',
          hi: 'चुंबकत्व के गाउस नियम (∮ B·dA = 0) से सिद्ध होता है कि एकल चुंबकीय ध्रुव का कोई अस्तित्व नहीं होता। प्रतिचुंबकीय पदार्थ (χ < 0) दुर्बल प्रतिकर्षित होते हैं; अनुचुंबकीय (χ > 0) क्यूरी नियम (χ ∝ 1/T) का पालन करते हैं; लौहचुंबकीय में डोमेन होते हैं।',
          hinglish: '∮ B·dA = 0 means magnetic monopoles do not exist. Diamagnetic χ < 0, Paramagnetic χ > 0, Ferromagnetic χ >> 1.',
        },
        formula: '\\oint \\vec{B} \\cdot d\\vec{A} = 0, \\quad \\chi_{\\text{para}} = \\frac{C}{T} \\quad (\\text{Curie’s Law}), \\quad \\mu_r = 1 + \\chi',
        keyPoints: [
          {
            en: 'Unlike electrostatics, isolated magnetic charges (monopoles) do not exist in nature; magnetic field lines are continuous closed loops.',
            hi: 'स्थिरवैद्युतिकी के विपरीत प्रकृति में विलगित चुंबकीय ध्रुव नहीं होते; चुंबकीय क्षेत्र रेखाएं सतत बंद लूप बनाती हैं।',
            hinglish: 'Magnetic field lines are continuous closed loops with no source or sink.',
          },
          {
            en: 'Superconductors exhibit perfect diamagnetism (χ = -1, μr = 0), completely expelling internal magnetic fields (Meissner effect).',
            hi: 'अतिचालक पूर्ण प्रतिचुंबकत्व प्रदर्शित करते हैं (माइस्नर प्रभाव)।',
            hinglish: 'Meissner effect: Superconductors expel magnetic field completely (χ = -1).',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'What does Gauss’s Law for Magnetism (∮ B · dA = 0) signify about magnetic poles in nature?',
            hi: 'चुंबकत्व के गाउस नियम (∮ B · dA = 0) का भौतिक अभिप्राय क्या है?',
            hinglish: 'Gauss’s Law for Magnetism (∮ B · dA = 0) ka physical meaning kya hai?',
          },
          options: [
            { en: 'Isolated magnetic monopoles do not exist; magnetic lines form continuous closed loops', hi: 'प्रकृति में एकल चुंबकीय ध्रुव का अस्तित्व नहीं होता; क्षेत्र रेखाएं बंद लूप बनाती हैं', hinglish: 'Isolated magnetic monopoles do not exist' },
            { en: 'Magnetic field is always zero in all media', hi: 'सभी माध्यमों में चुंबकीय क्षेत्र शून्य होता है', hinglish: 'B is always zero' },
            { en: 'Magnetic force performs immense work on stationary charges', hi: 'स्थिर आवेशों पर चुंबकीय बल कार्य करता है', hinglish: 'Work done is immense' },
            { en: 'Magnetic north poles are fundamentally stronger than south poles', hi: 'उत्तरी ध्रुव दक्षिणी ध्रुव से अधिक शक्तिशाली होता है', hinglish: 'North pole is stronger' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'The net magnetic flux entering any closed volume equals the flux leaving it, demonstrating that magnetic field lines never start or terminate on isolated poles.',
            hi: 'जितनी क्षेत्र रेखाएं बंद पृष्ठ में प्रवेश करती हैं उतनी ही बाहर निकलती हैं, अतः स्वतंत्र चुंबकीय ध्रुव नहीं होते।',
            hinglish: 'Zero net flux proves that no isolated magnetic monopoles exist.',
          }
        },
      },
    ],
  },

  // Chapter 6
  {
    id: 'c12_phy_ch6_emi',
    subjectId: 'class12_physics',
    chapterNo: 6,
    title: {
      en: 'Electromagnetic Induction (EMI)',
      hi: 'वैद्युतचुंबकीय प्रेरण',
      hinglish: 'Electromagnetic Induction',
    },
    description: {
      en: 'Magnetic flux, Faraday’s laws of electromagnetic induction, Lenz’s law and conservation of energy, motional EMF (e = Blv), eddy currents, and self and mutual inductance (L and M).',
      hi: 'चुंबकीय फ्लक्स, फैराडे के प्रेरण के नियम, लेंज का नियम व ऊर्जा संरक्षण, गतिक वि०वा०बल, भंवर धाराएं, तथा स्वप्रेरण व अन्योन्य प्रेरण गुणांक।',
      hinglish: 'Faraday’s law ε = -dΦ/dt, Lenz’s law, motional emf e = Blv, self inductance L.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Physics Part 1 Class 12 Ch 6 / UPMSP Bhautik Vigyan Ch 6',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_lenz_faraday_motional_emf',
        title: {
          en: 'Faraday’s Laws, Lenz’s Law & Motional EMF',
          hi: 'फैराडे के नियम, लेंज का नियम एवं गतिक वि०वा०बल',
          hinglish: 'Faraday’s Law & Lenz’s Law Energy Conservation',
        },
        summary: {
          en: 'Faraday’s Law states that induced EMF in a closed loop is proportional to the time rate of change of magnetic flux: ε = -dΦ_B/dt. Lenz’s Law gives the negative sign: the polarity of the induced EMF always opposes the change in flux that produces it, directly reflecting the principle of conservation of energy. Motional EMF across a rod of length l moving with velocity v perpendicular to field B is ε = Blv.',
          hi: 'फैराडे के अनुसार प्रेरित वि०वा०बल ε = -dΦ/dt होता है। लेंज के नियम के अनुसार प्रेरित धारा सदैव उस परिवर्तन का विरोध करती है जिसके कारण वह उत्पन्न हुई है (ऊर्जा संरक्षण)। गतिक वि०वा०बल ε = Blv होता है।',
          hinglish: 'ε = -dΦ/dt. Lenz’s law polarity opposes cause, verifying energy conservation. Motional EMF ε = Blv.',
        },
        formula: '\\varepsilon = -\\frac{d\\Phi_B}{dt}, \\quad \\varepsilon = B l v, \\quad U = \\frac{1}{2}L I^2, \\quad \\Phi = L I',
        keyPoints: [
          {
            en: 'Lenz’s law is a direct consequence of the law of conservation of energy; mechanical work done in moving the magnet is converted into electrical energy.',
            hi: 'लेंज का नियम ऊर्जा संरक्षण का परिणाम है; चुंबक को गति कराने में किया गया यांत्रिक कार्य ही विद्युत ऊर्जा में बदलता है।',
            hinglish: 'Mechanical work done opposing magnetic force creates induced electrical energy.',
          },
          {
            en: 'Eddy currents induced in solid metallic cores are minimized by using thin laminated sheets insulated by varnish.',
            hi: 'भंवर धाराओं से ऊर्जा ह्रास कम करने के लिए धातु क्रोड को वार्निश युक्त पटलित पत्तियों के रूप में बनाया जाता है।',
            hinglish: 'Lamination minimizes eddy current heat loss in transformer cores.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Lenz’s Law in electromagnetic induction is a direct manifestation of which fundamental conservation principle?',
            hi: 'वैद्युतचुंबकीय प्रेरण में लेंज का नियम किस मूलभूत संरक्षण सिद्धांत का प्रत्यक्ष प्रकटीकरण है?',
            hinglish: 'EMI me Lenz’s Law kis conservation principle par based hai?',
          },
          options: [
            { en: 'Conservation of Energy', hi: 'ऊर्जा संरक्षण का सिद्धांत', hinglish: 'Conservation of Energy' },
            { en: 'Conservation of Electric Charge', hi: 'विद्युत आवेश संरक्षण का सिद्धांत', hinglish: 'Conservation of Charge' },
            { en: 'Conservation of Mass', hi: 'द्रव्यमान संरक्षण का सिद्धांत', hinglish: 'Conservation of Mass' },
            { en: 'Conservation of Angular Momentum', hi: 'कोणीय संवेग संरक्षण का सिद्धांत', hinglish: 'Conservation of Angular Momentum' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'If induced current supported the flux change, spontaneous creation of energy would occur without external work. Thus opposing polarity ensures strict conservation of energy.',
            hi: 'यदि विरोध न हो तो बिना कार्य किए असीमित ऊर्जा उत्पन्न होने लगेगी, अतः लेंज का नियम ऊर्जा संरक्षण को सुनिश्चित करता है।',
            hinglish: 'Opposition to flux change ensures mechanical work equals induced electrical energy.',
          }
        },
      },
    ],
  },

  // Chapter 7
  {
    id: 'c12_phy_ch7_alternating_current',
    subjectId: 'class12_physics',
    chapterNo: 7,
    title: {
      en: 'Alternating Current (AC)',
      hi: 'प्रत्यावर्ती धारा',
      hinglish: 'Alternating Current (AC)',
    },
    description: {
      en: 'Peak and RMS values of AC current and voltage, phasor diagrams, AC through pure R, L, C, series LCR circuit, resonance condition (ω = 1/√(LC)), power factor (cos φ), wattless current, and transformers.',
      hi: 'प्रत्यावर्ती धारा का शिखर व वर्ग माध्य मूल (RMS) मान, कला आरेख, शुद्ध R, L, C परिपथ, श्रेणी LCR परिपथ, अनुनाद शर्त (ω = 1/√(LC)), शक्ति गुणांक (cos φ), तथा ट्रांसफार्मर सिद्धांत।',
      hinglish: 'RMS values Irms = I₀/√2, Series LCR impedance Z = √[R² + (XL - XC)²], resonance ω₀ = 1/√(LC), transformers.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Physics Part 1 Class 12 Ch 7 / UPMSP Bhautik Vigyan Ch 7',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_lcr_resonance_transformers',
        title: {
          en: 'Series LCR Resonance & Transformer Efficiency',
          hi: 'श्रेणी LCR परिपथ में अनुनाद एवं ट्रांसफार्मर',
          hinglish: 'LCR Resonance & Transformers',
        },
        summary: {
          en: 'In a series LCR circuit, impedance is Z = √[R² + (X_L - X_C)²], where inductive reactance X_L = ωL and capacitive reactance X_C = 1/(ωC). At electrical resonance, X_L = X_C, impedance is minimum (Z = R), and current amplitude is maximum at resonant angular frequency ω₀ = 1/√(LC). Transformers work on mutual induction: V_s / V_p = N_s / N_p = I_p / I_s.',
          hi: 'श्रेणी LCR परिपथ में प्रतिबाधा Z = √[R² + (X_L - X_C)²]। अनुनाद पर X_L = X_C होने से Z न्यूनतम (Z = R) और धारा अधिकतम होती है (ω₀ = 1/√(LC))। ट्रांसफार्मर अन्योन्य प्रेरण पर कार्य करता है: V_s/V_p = N_s/N_p।',
          hinglish: 'Resonance condition: XL = XC, Z = R (minimum), current is maximum. Resonant frequency f₀ = 1 / (2π√LC).',
        },
        formula: 'Z = \\sqrt{R^2 + (\\omega L - \\frac{1}{\\omega C})^2}, \\quad \\omega_0 = \\frac{1}{\\sqrt{LC}}, \\quad P_{\\text{avg}} = V_{\\text{rms}} I_{\\text{rms}} \\cos\\phi, \\quad \\frac{V_s}{V_p} = \\frac{N_s}{N_p}',
        keyPoints: [
          {
            en: 'In a purely inductive or capacitive circuit, phase angle φ = 90°, power factor cos φ = 0, and average power dissipated is zero (wattless current).',
            hi: 'शुद्ध प्रेरक अथवा धारिता परिपथ में कलांतर 90° होने से शक्ति गुणांक शून्य होता है और औसत शक्ति व्यय शून्य होता है (वाटहीन धारा)।',
            hinglish: 'Pure inductor/capacitor dissipates zero average power (wattless current).',
          },
          {
            en: 'Step-up transformers increase voltage while decreasing current proportionally, keeping power V × I constant.',
            hi: 'उच्चायी ट्रांसफार्मर विभव बढ़ाता है किंतु धारा घटाता है जिससे शक्ति नियत रहती है।',
            hinglish: 'Step-up increases voltage, decreases current proportionally.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'At electrical resonance in a series LCR circuit, what is the value of circuit impedance Z?',
            hi: 'श्रेणी LCR परिपथ में अनुनाद की स्थिति में परिपथ की प्रतिबाधा Z का मान क्या होता है?',
            hinglish: 'Series LCR circuit me resonance par impedance Z kiske barabar hota hai?',
          },
          options: [
            { en: 'Minimum and equal to resistance R (Z = R)', hi: 'न्यूनतम तथा केवल प्रतिरोध R के बराबर (Z = R)', hinglish: 'Minimum and equal to R (Z = R)' },
            { en: 'Zero (Z = 0)', hi: 'शून्य (Z = 0)', hinglish: 'Zero (Z = 0)' },
            { en: 'Maximum and equal to infinity', hi: 'अधिकतम (अनंत)', hinglish: 'Maximum (infinite)' },
            { en: 'Equal to ωL', hi: 'ωL के बराबर', hinglish: 'Equal to ωL' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'At resonance, inductive and capacitive reactances cancel exactly (X_L = X_C), making total impedance purely resistive and at its absolute minimum: Z = R.',
            hi: 'अनुनाद पर X_L = X_C होने से प्रतिघात शून्य हो जाता है और प्रतिबाधा न्यूनतम Z = R रह जाती है।',
            hinglish: 'XL - XC = 0, so Z = √(R² + 0) = R.',
          }
        },
      },
    ],
  },

  // Chapter 8
  {
    id: 'c12_phy_ch8_em_waves',
    subjectId: 'class12_physics',
    chapterNo: 8,
    title: {
      en: 'Electromagnetic Waves',
      hi: 'वैद्युतचुंबकीय तरंगें',
      hinglish: 'Electromagnetic Waves',
    },
    description: {
      en: 'Displacement current (Maxwell’s modification of Ampere’s law), characteristics and transverse nature of EM waves, relation c = 1/√(μ₀ε₀) = E₀/B₀, and the electromagnetic spectrum (Radio, Micro, Infrared, Visible, UV, X-rays, Gamma rays).',
      hi: 'विस्थापन धारा (ऐम्पियर-मैक्सवेल नियम), वैद्युतचुंबकीय तरंगों की अनुप्रस्थ प्रकृति, c = 1/√(μ₀ε₀) = E₀/B₀, तथा वैद्युतचुंबकीय स्पेक्ट्रम (रेडियो, सूक्ष्म, अवरक्त, दृश्य, पराबैंगनी, एक्स, गामा किरणें)।',
      hinglish: 'Displacement current Id = ε₀ dΦE/dt, transverse waves, EM spectrum wavelengths and uses.',
    },
    targetMastery: 90,
    highYieldWeightage: 4,
    textbookRef: 'NCERT Physics Part 1 Class 12 Ch 8 / UPMSP Bhautik Vigyan Ch 8',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_displacement_current_spectrum',
        title: {
          en: 'Displacement Current & The Electromagnetic Spectrum',
          hi: 'विस्थापन धारा एवं वैद्युतचुंबकीय स्पेक्ट्रम',
          hinglish: 'Displacement Current & EM Spectrum Applications',
        },
        summary: {
          en: 'Maxwell introduced displacement current I_d = ε₀ (dΦ_E / dt) to resolve the inconsistency in Ampere’s circuital law during capacitor charging. EM waves consist of mutually perpendicular sinusoidal electric and magnetic field vectors oscillating perpendicular to wave propagation direction. Speed of EM waves in vacuum is c = 1 / √(μ₀ε₀) = 3 × 10⁸ m/s.',
          hi: 'संधारित्र आवेशन के समय परिपथीय नियम की निरंतरता बनाए रखने के लिए मैक्सवेल ने विस्थापन धारा I_d = ε₀(dΦ_E/dt) जोड़ी। वैद्युत व चुंबकीय क्षेत्र परस्पर तथा संचरण दिशा के लंबवत दोलन करते हैं (अनुप्रस्थ)। निर्वात में चाल c = 3 × 10⁸ m/s होती है।',
          hinglish: 'Displacement current Id = ε₀ dΦE/dt. Transverse nature: E ⊥ B ⊥ Propagation. Speed c = 1/√(μ₀ε₀).',
        },
        formula: 'I_d = \\varepsilon_0 \\frac{d\\Phi_E}{dt}, \\quad c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} = \\frac{E_0}{B_0} = 3 \\times 10^8\\,\\text{m/s}',
        keyPoints: [
          {
            en: 'In a charging capacitor, conduction current in connecting wires equals displacement current between capacitor plates at every instant (I_c = I_d).',
            hi: 'आवेशन के समय संयोजक तारों की चालन धारा प्लेटों के बीच विस्थापन धारा के ठीक बराबर होती है।',
            hinglish: 'Conduction current outside equals displacement current inside gap.',
          },
          {
            en: 'Electromagnetic spectrum in order of increasing frequency: Radio < Microwave < Infrared < Visible < Ultraviolet < X-rays < Gamma rays.',
            hi: 'बढ़ती आवृत्ति क्रम: रेडियो < सूक्ष्म < अवरक्त < दृश्य < पराबैंगनी < एक्स-किरणें < गामा किरणें।',
            hinglish: 'Gamma rays have highest frequency and energy; Radio waves have longest wavelength.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'Which part of the electromagnetic spectrum is utilized in RADAR communication and microwave ovens?',
            hi: 'रडार (RADAR) संचार एवं माइक्रोवेव ओवन में स्पेक्ट्रम के किस भाग का उपयोग किया जाता है?',
            hinglish: 'RADAR communication aur cooking me kaunsi EM waves use hoti hain?',
          },
          options: [
            { en: 'Microwaves', hi: 'सूक्ष्म तरंगें (Microwaves)', hinglish: 'Microwaves' },
            { en: 'Infrared Waves', hi: 'अवरक्त तरंगें (Infrared)', hinglish: 'Infrared Waves' },
            { en: 'Ultraviolet Rays', hi: 'पराबैंगनी किरणें (UV)', hinglish: 'Ultraviolet Rays' },
            { en: 'X-rays', hi: 'एक्स किरणें', hinglish: 'X-rays' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Microwaves (wavelength ~1 mm to 0.1 m) have the ideal frequency to excite water molecules in food (dielectric heating) and provide pinpoint directional reflection for RADAR systems.',
            hi: 'सूक्ष्म तरंगों (Microwaves) का उपयोग रडार तथा भोजन को गर्म करने वाले माइक्रोवेव ओवन में किया जाता है।',
            hinglish: 'Microwaves are used in RADAR systems and microwave ovens.',
          }
        },
      },
    ],
  },

  // Chapter 9
  {
    id: 'c12_phy_ch9_ray_optics',
    subjectId: 'class12_physics',
    chapterNo: 9,
    title: {
      en: 'Ray Optics and Optical Instruments',
      hi: 'किरण प्रकाशिकी एवं प्रकाशिक यंत्र',
      hinglish: 'Ray Optics & Optical Instruments',
    },
    description: {
      en: 'Total internal reflection (TIR) and optical fibers, refraction at spherical surfaces, Lens Maker’s formula, combination of thin lenses, prism refraction formula n = sin((A+δm)/2) / sin(A/2), compound microscope, and astronomical telescope.',
      hi: 'पूर्ण आंतरिक परावर्तन व प्रकाशिक तंतु, गोलीय पृष्ठों पर अपवर्तन, लेंस मेकर सूत्र, प्रिज्म सूत्र, संयुक्त सूक्ष्मदर्शी एवं खगोलीय दूरदर्शी की आवर्धन क्षमता।',
      hinglish: 'TIR condition sin C = 1/n, Lens Maker formula 1/f = (n-1)(1/R1 - 1/R2), telescope and microscope magnification.',
    },
    targetMastery: 90,
    highYieldWeightage: 9,
    textbookRef: 'NCERT Physics Part 2 Class 12 Ch 9 / UPMSP Bhautik Vigyan Ch 9',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_lens_maker_optical_instruments',
        title: {
          en: 'Lens Maker’s Formula & Compound Microscope / Telescope',
          hi: 'लेंस मेकर सूत्र तथा सूक्ष्मदर्शी व खगोलीय दूरदर्शी',
          hinglish: 'Lens Maker’s Formula & Optical Instruments',
        },
        summary: {
          en: 'The Lens Maker’s formula relates lens focal length to refractive index and radii of curvature: 1/f = (n₂/n₁ - 1)(1/R₁ - 1/R₂). Total Internal Reflection occurs when light travels from denser to rarer medium at angle of incidence i > critical angle C, where sin C = 1/n. For a compound microscope, overall magnification is m = m_o × m_e = (-L / f_o)(1 + D / f_e). For an astronomical telescope in normal adjustment, magnifying power is m = -f_o / f_e.',
          hi: 'लेंस मेकर सूत्र: 1/f = (n - 1)(1/R₁ - 1/R₂)। पूर्ण आंतरिक परावर्तन सघन से विरल माध्यम में i > C होने पर होता है (sin C = 1/n)। सामान्य समायोजन में दूरदर्शी की आवर्धन क्षमता m = -f_o / f_e तथा नली की लंबाई L = f_o + f_e होती है।',
          hinglish: 'Lens Maker: 1/f = (n-1)(1/R1 - 1/R2). TIR condition: i > critical angle C, sin C = 1/n. Telescope normal adjustment m = -fo/fe.',
        },
        formula: '\\frac{1}{f} = (n - 1)\\left( \\frac{1}{R_1} - \\frac{1}{R_2} \\right), \\quad \\sin C = \\frac{1}{n}, \\quad m_{\\text{telescope}} = -\\frac{f_o}{f_e}, \\quad L = f_o + f_e',
        keyPoints: [
          {
            en: 'If a glass equiconvex lens (n = 1.5, R₁ = +R, R₂ = -R) is submerged in water (n = 1.33), its focal length increases by roughly 4 times.',
            hi: 'काँच के उत्तल लेंस को जल में डुबाने पर उसकी फोकस दूरी लगभग 4 गुना बढ़ जाती है।',
            hinglish: 'Focal length in water is ~4 times its value in air.',
          },
          {
            en: 'In an astronomical telescope, the objective lens must have a large focal length (f_o) and large aperture to collect maximum light, while eyepiece has small f_e.',
            hi: 'खगोलीय दूरदर्शी के अभिदृश्यक की फोकस दूरी और द्वारक बड़े होते हैं जबकि अभिनेत्र छोटा होता है।',
            hinglish: 'Telescope: Objective lens has large fo and large aperture; eyepiece has small fe.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'An astronomical telescope has an objective of focal length 100 cm and an eyepiece of focal length 5 cm. What is its magnifying power in normal adjustment?',
            hi: 'एक खगोलीय दूरदर्शी के अभिदृश्यक लेंस की फोकस दूरी 100 सेमी और अभिनेत्र लेंस की 5 सेमी है। सामान्य समायोजन में इसकी आवर्धन क्षमता क्या होगी?',
            hinglish: 'Objective fo = 100 cm, Eyepiece fe = 5 cm. Normal adjustment me magnifying power kitna hoga?',
          },
          options: [
            { en: '-20', hi: '-20', hinglish: '-20' },
            { en: '-500', hi: '-500', hinglish: '-500' },
            { en: '+20', hi: '+20', hinglish: '+20' },
            { en: '-105', hi: '-105', hinglish: '-105' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Magnifying power in normal adjustment (image at infinity) is m = -f_o / f_e = -100 / 5 = -20. (The negative sign indicates an inverted image).',
            hi: 'm = -f_o / f_e = -100 / 5 = -20 (ऋणात्मक चिह्न उल्टा प्रतिबिंब दर्शाता है)।',
            hinglish: 'm = -fo / fe = -100 / 5 = -20.',
          }
        },
      },
    ],
  },

  // Chapter 10
  {
    id: 'c12_phy_ch10_wave_optics',
    subjectId: 'class12_physics',
    chapterNo: 10,
    title: {
      en: 'Wave Optics',
      hi: 'तरंग-प्रकाशिकी',
      hinglish: 'Wave Optics',
    },
    description: {
      en: 'Huygens’ wave theory and proof of laws of reflection and refraction, coherent sources, Young’s Double Slit Experiment (YDSE), fringe width expression β = λD/d, and single-slit diffraction pattern.',
      hi: 'हाइगेन्स का तरंग सिद्धांत एवं परावर्तन-अपवर्तन नियमों का सत्यापन, कला-संबद्ध स्रोत, यंग का द्वि-स्लिट प्रयोग (YDSE), फ्रिंज चौड़ाई सूत्र β = λD/d, तथा एकल झिरी विवर्तन प्रतिरूप।',
      hinglish: 'Huygens wavefronts, YDSE fringe width β = λD/d, central maxima width in diffraction.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Physics Part 2 Class 12 Ch 10 / UPMSP Bhautik Vigyan Ch 10',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_ydse_diffraction',
        title: {
          en: 'Young’s Double Slit Experiment (YDSE) & Single Slit Diffraction',
          hi: 'यंग का द्वि-स्लिट प्रयोग (YDSE) एवं एकल झिरी विवर्तन',
          hinglish: 'YDSE Fringe Width & Single Slit Diffraction',
        },
        summary: {
          en: 'In Young’s Double Slit Experiment, constructive interference occurs for path difference Δx = nλ and destructive for Δx = (2n-1)λ/2. Fringe width β = λD/d is identical for all bright and dark fringes. In single-slit Fraunhofer diffraction by slit of width a, minima occur at a sin θ = nλ (n = 1, 2, ...), and the angular width of central maximum is 2λ/a.',
          hi: 'यंग के प्रयोग में संपोषी व्यतिकरण पथांतर nλ और विनाशी व्यतिकरण (2n-1)λ/2 पर होता है। फ्रिंज चौड़ाई β = λD/d सभी फ्रिंजों के लिए समान होती है। विवर्तन में केंद्रीय उच्चिष्ठ की कोणीय चौड़ाई 2λ/a होती है।',
          hinglish: 'YDSE fringe width β = λD/d. Interference fringes are equally spaced; Diffraction central maximum is twice as wide as secondary maxima.',
        },
        formula: '\\beta = \\frac{\\lambda D}{d}, \\quad \\text{Interference Max: } \\Delta x = n\\lambda, \\quad \\text{Diffraction Min: } a\\sin\\theta = n\\lambda, \\quad 2\\theta_0 = \\frac{2\\lambda}{a}',
        keyPoints: [
          {
            en: 'If the entire YDSE apparatus is submerged in water (refractive index n), wavelength decreases to λ’ = λ/n, causing fringe width to shrink: β’ = β/n.',
            hi: 'यंग के उपकरण को जल में डुबोने पर तरंगदैर्ध्य कम होने से फ्रिंज चौड़ाई β/n रह जाती है।',
            hinglish: 'Fringe width decreases in water by factor n.',
          },
          {
            en: 'Unlike interference where all bright fringes have equal brightness, in diffraction the intensity drops sharply for higher-order secondary maxima.',
            hi: 'व्यतिकरण में सभी दीप्त फ्रिंजों की तीव्रता समान होती है, जबकि विवर्तन में तीव्रता तीव्रता से घटती है।',
            hinglish: 'Diffraction intensity falls off sharply away from central maximum.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'What happens to the fringe width β in Young’s Double Slit Experiment if the distance D between the slits and screen is doubled, while slit separation d is halved?',
            hi: 'यंग के प्रयोग में यदि स्लिट व पर्दे की दूरी D दोगुनी और स्लिटों का अंतराल d आधा कर दिया जाए, तो फ्रिंज चौड़ाई β कितनी हो जाएगी?',
            hinglish: 'YDSE me D double aur d half karne par new fringe width β’ kitni hogi?',
          },
          options: [
            { en: 'Becomes 4 times larger (4 β)', hi: '4 गुना बढ़ जाएगी (4 β)', hinglish: '4 times larger (4 β)' },
            { en: 'Becomes 2 times larger (2 β)', hi: '2 गुना बढ़ जाएगी (2 β)', hinglish: '2 times larger (2 β)' },
            { en: 'Halved (β / 2)', hi: 'आधी रह जाएगी', hinglish: 'Halved (β / 2)' },
            { en: 'Remains unchanged', hi: 'अपरिवर्तित रहेगी', hinglish: 'Remains unchanged' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Original: β = λD/d. New: β’ = λ(2D) / (d/2) = 4 (λD/d) = 4 β.',
            hi: 'β’ = λ(2D) / (d/2) = 4 (λD/d) = 4 β। फ्रिंज चौड़ाई 4 गुना हो जाएगी।',
            hinglish: '2 / (1/2) = 4x.',
          }
        },
      },
    ],
  },

  // Chapter 11
  {
    id: 'c12_phy_ch11_dual_nature',
    subjectId: 'class12_physics',
    chapterNo: 11,
    title: {
      en: 'Dual Nature of Radiation and Matter',
      hi: 'विकिरण तथा द्रव्य की द्वैत प्रकृति',
      hinglish: 'Dual Nature of Radiation & Matter',
    },
    description: {
      en: 'Photoelectric effect, Hertz and Lenard’s observations, Einstein’s photoelectric equation Kmax = hν - Φ₀, stopping potential, and de Broglie matter waves (λ = h/p = h/√(2mqV)).',
      hi: 'प्रकाश-वैद्युत प्रभाव, लेनार्ड प्रेक्षण, आइंस्टाइन का समीकरण Kmax = hν - Φ₀, निरोधी विभव, तथा दे ब्रॉग्ली द्रव्य तरंगें (λ = h/p)।',
      hinglish: 'Photoelectric equation Kmax = hν - Φ₀ = eV₀, de Broglie wavelength λ = h/mv = 12.27/√V Å for electron.',
    },
    targetMastery: 90,
    highYieldWeightage: 6,
    textbookRef: 'NCERT Physics Part 2 Class 12 Ch 11 / UPMSP Bhautik Vigyan Ch 11',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_photoelectric_einstein_debroglie',
        title: {
          en: 'Einstein’s Photoelectric Equation & de Broglie Matter Waves',
          hi: 'आइंस्टाइन का प्रकाश-वैद्युत समीकरण एवं दे ब्रॉग्ली द्रव्य तरंगें',
          hinglish: 'Photoelectric Effect & de Broglie Wavelength',
        },
        summary: {
          en: 'Light consists of discrete energy packets called photons (E = hν). Einstein’s photoelectric equation states K_max = e V₀ = hν - Φ₀, where Φ₀ = hν₀ is the work function. Stopping potential V₀ depends linearly on frequency ν but is completely independent of intensity. de Broglie proposed that moving particles have wave character with wavelength λ = h / p = h / √(2mE). For an electron accelerated through potential V: λ = 1.227 / √V nm.',
          hi: 'आइंस्टाइन के अनुसार फोटॉन ऊर्जा E = hν होती है। समीकरण: K_max = eV₀ = hν - Φ₀। निरोधी विभव आवृत्ति पर निर्भर करता है, तीव्रता पर नहीं। दे ब्रॉग्ली तरंगदैर्ध्य λ = h/p होती है; इलेक्ट्रॉन हेतु λ = 12.27/√V Å।',
          hinglish: 'Kmax = hν - Φ₀. Stopping potential V₀ depends on frequency, not intensity. de Broglie wavelength λ = h/mv.',
        },
        formula: 'K_{\\text{max}} = e V_0 = h\\nu - \\Phi_0 = h(\\nu - \\nu_0), \\quad \\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2m q V}} = \\frac{1.227}{\\sqrt{V}}\\,\\text{nm}',
        keyPoints: [
          {
            en: 'Increasing incident light intensity increases the number of emitted photoelectrons (saturation current), but does NOT change maximum kinetic energy or stopping potential.',
            hi: 'तीव्रता बढ़ाने से उत्सर्जित इलेक्ट्रॉनों की संख्या बढ़ती है, परंतु उनकी गतिज ऊर्जा या निरोधी विभव नहीं बदलता।',
            hinglish: 'Intensity increases photocurrent; frequency increases kinetic energy.',
          },
          {
            en: 'Photoelectric emission is instantaneous (time lag < 10⁻⁹ s) with no threshold energy storage time.',
            hi: 'प्रकाश-वैद्युत उत्सर्जन तात्क्षणिक होता है (समय पश्चता < 10⁻⁹ सेकंड)।',
            hinglish: 'Emission occurs without time delay as single photon-electron collision.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'If the accelerating potential of an electron beam is increased from 25 V to 100 V, what happens to its de Broglie wavelength?',
            hi: 'यदि एक इलेक्ट्रॉन पुंज के त्वरित विभव को 25 V से बढ़ाकर 100 V कर दिया जाए, तो उसकी दे ब्रॉग्ली तरंगदैर्ध्य क्या हो जाएगी?',
            hinglish: 'Electron accelerating potential 25V se 100V karne par de Broglie wavelength kitni hogi?',
          },
          options: [
            { en: 'Halved (decreases to λ / 2)', hi: 'आधी रह जाएगी (λ / 2)', hinglish: 'Halved (λ / 2)' },
            { en: 'Doubled (increases to 2λ)', hi: 'दोगुनी हो जाएगी (2λ)', hinglish: 'Doubled (2λ)' },
            { en: 'Decreases to λ / 4', hi: 'एक-चौथाई रह जाएगी (λ / 4)', hinglish: 'Decreases to λ / 4' },
            { en: 'Increases to 4λ', hi: '4 गुना बढ़ जाएगी (4λ)', hinglish: 'Increases to 4λ' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'de Broglie wavelength is inversely proportional to square root of accelerating potential: λ ∝ 1/√V. New potential is 4 times higher, so λ’ = λ / √4 = λ / 2.',
            hi: 'λ ∝ 1/√V। विभव 4 गुना (100/25) बढ़ने पर तरंगदैर्ध्य 1/√4 = 1/2 यानी आधी रह जाएगी।',
            hinglish: 'λ ∝ 1/√V. Potential is 4x, so wavelength becomes 1/√4 = 1/2.',
          }
        },
      },
    ],
  },

  // Chapter 12
  {
    id: 'c12_phy_ch12_atoms',
    subjectId: 'class12_physics',
    chapterNo: 12,
    title: {
      en: 'Atoms',
      hi: 'परमाणु',
      hinglish: 'Atoms',
    },
    description: {
      en: 'Alpha-particle scattering experiment, Rutherford’s nuclear model, Bohr’s postulates for hydrogen atom, radius of nth orbit (r_n ∝ n²), velocity (v_n ∝ 1/n), total energy (E_n = -13.6/n² eV), and hydrogen emission spectral series (Lyman, Balmer, Paschen, Brackett, Pfund).',
      hi: 'अल्फा कण प्रकीर्णन, रदरफोर्ड नाभिकीय मॉडल, हाइड्रोजन परमाणु के बोर अभिगृहीत, nवीं कक्षा की त्रिज्या (r ∝ n²), ऊर्जा (E = -13.6/n² eV), तथा हाइड्रोजन स्पेक्ट्रमी श्रेणियां (लाइमन, बामर, पाश्चन)।',
      hinglish: 'Bohr postulates, quantization mvr = nh/2π, En = -13.6/n² eV, Rydberg formula 1/λ = R(1/n₁² - 1/n₂²).',
    },
    targetMastery: 90,
    highYieldWeightage: 6,
    textbookRef: 'NCERT Physics Part 2 Class 12 Ch 12 / UPMSP Bhautik Vigyan Ch 12',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_bohr_hydrogen_spectrum',
        title: {
          en: 'Bohr’s Postulates & Hydrogen Spectral Series',
          hi: 'बोर के अभिगृहीत एवं हाइड्रोजन स्पेक्ट्रमी श्रेणियां',
          hinglish: 'Bohr Atomic Model & Spectral Series',
        },
        summary: {
          en: 'Bohr’s postulates: (1) Electrons move in stable non-radiating orbits; (2) Orbital angular momentum is quantized: L = mvr = n(h / 2π); (3) Transition between energy states emits a photon: hν = E₂ - E₁. Energy of nth orbit is E_n = -13.6 / n² eV. Spectral series: Lyman (n₁=1, Ultraviolet), Balmer (n₁=2, Visible region), Paschen (n₁=3, Infrared).',
          hi: 'बोर के अनुसार कोणीय संवेग mvr = nh/(2π) क्वांटीकृत होता है। nवीं कक्षा की ऊर्जा E_n = -13.6 / n² eV होती है। लाइमन श्रेणी पराबैंगनी क्षेत्र में, बामर श्रेणी दृश्य क्षेत्र में तथा पाश्चन अवरक्त क्षेत्र में मिलती है।',
          hinglish: 'Angular momentum mvr = nh/2π. Energy En = -13.6/n² eV. Lyman = UV, Balmer = Visible, Paschen = Infrared.',
        },
        formula: 'm v r = \\frac{n h}{2\\pi}, \\quad r_n = 0.529\\,n^2\\,\\text{Å}, \\quad E_n = -\\frac{13.6}{n^2}\\,\\text{eV}, \\quad \\frac{1}{\\lambda} = R \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right)',
        keyPoints: [
          {
            en: 'Balmer series is the only hydrogen spectral series that lies in the visible spectrum range of human sight.',
            hi: 'बामर श्रेणी ही हाइड्रोजन स्पेक्ट्रम की एकमात्र ऐसी श्रेणी है जो दृश्य प्रकाश क्षेत्र में पड़ती है।',
            hinglish: 'Balmer series falls in the visible region (n₁ = 2).',
          },
          {
            en: 'Total mechanical energy of an electron in hydrogen is negative, proving that the electron is bound to the nucleus: Total Energy = -Kinetic Energy = Potential Energy / 2.',
            hi: 'कुल ऊर्जा ऋणात्मक होने का अर्थ है कि इलेक्ट्रॉन नाभिक से बंधा हुआ है: कुल ऊर्जा = - गतिज ऊर्जा = स्थितिज ऊर्जा / 2।',
            hinglish: 'Total Energy = -KE = PE / 2.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'Which hydrogen spectral emission series falls in the visible region of the electromagnetic spectrum?',
            hi: 'हाइड्रोजन स्पेक्ट्रम की कौन सी श्रेणी वैद्युतचुंबकीय स्पेक्ट्रम के दृश्य प्रकाश क्षेत्र में पड़ती है?',
            hinglish: 'Hydrogen spectrum ki kaunsi series visible spectrum me aati hai?',
          },
          options: [
            { en: 'Balmer Series', hi: 'बामर श्रेणी (Balmer Series)', hinglish: 'Balmer Series' },
            { en: 'Lyman Series', hi: 'लाइमन श्रेणी (Lyman Series)', hinglish: 'Lyman Series' },
            { en: 'Paschen Series', hi: 'पाश्चन श्रेणी (Paschen Series)', hinglish: 'Paschen Series' },
            { en: 'Pfund Series', hi: 'फुण्ड श्रेणी (Pfund Series)', hinglish: 'Pfund Series' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Transitions ending at n₁ = 2 (Balmer series) emit photons with wavelengths between 400 nm and 700 nm, which fall in the visible light spectrum.',
            hi: 'बामर श्रेणी (n₁ = 2) के संक्रमण दृश्य प्रकाश क्षेत्र (400-700 nm) में आते हैं। लाइमन पराबैंगनी में आती है।',
            hinglish: 'Balmer series (n₁ = 2) falls strictly in the visible region.',
          }
        },
      },
    ],
  },

  // Chapter 13
  {
    id: 'c12_phy_ch13_nuclei',
    subjectId: 'class12_physics',
    chapterNo: 13,
    title: {
      en: 'Nuclei',
      hi: 'नाभिक',
      hinglish: 'Nuclei',
    },
    description: {
      en: 'Nuclear composition (protons, neutrons), nuclear radius R = R₀ A^(1/3), nuclear density independence of mass number, mass defect Δm, Einstein mass-energy equivalence E = mc², binding energy per nucleon curve, nuclear fission, and nuclear fusion.',
      hi: 'नाभिक की संरचना, नाभिकीय त्रिज्या R = R₀ A^(1/3), नाभिकीय घनत्व की अचरता, द्रव्यमान क्षति, E = mc², प्रति न्यूक्लियॉन बंधन ऊर्जा वक्र, तथा नाभिकीय विखंडन व संलयन।',
      hinglish: 'Nuclear radius R = R₀ A^(1/3), binding energy curve, nuclear fission and fusion reactions.',
    },
    targetMastery: 90,
    highYieldWeightage: 5,
    textbookRef: 'NCERT Physics Part 2 Class 12 Ch 13 / UPMSP Bhautik Vigyan Ch 13',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_binding_energy_fission_fusion',
        title: {
          en: 'Binding Energy per Nucleon Curve, Fission & Fusion',
          hi: 'प्रति न्यूक्लियॉन बंधन ऊर्जा वक्र, विखंडन एवं संलयन',
          hinglish: 'Binding Energy Curve & Nuclear Reactions',
        },
        summary: {
          en: 'Nuclear radius follows R = R₀ A^(1/3) (R₀ ≈ 1.2 fm), implying nuclear density is constant (~2.3 × 10¹⁷ kg/m³) across all elements. Mass defect Δm = [Z m_p + (A - Z) m_n] - M_nucleus converts to binding energy via E_b = Δm c² (1 amu ≈ 931.5 MeV). The binding energy per nucleon peaks near Iron-56 (~8.75 MeV/nucleon). Heavy nuclei undergo fission and light nuclei undergo fusion to achieve higher binding energy and release massive energy.',
          hi: 'नाभिकीय घनत्व सभी तत्वों के लिए स्थिर (~2.3 × 10¹⁷ kg/m³) रहता है। द्रव्यमान क्षति Δm ऊर्जा में बदलती है (1 u = 931.5 MeV)। Fe-56 के लिए प्रति न्यूक्लियॉन बंधन ऊर्जा सर्वाधिक (~8.75 MeV) होती है। भारी नाभिकों का विखंडन और हल्के नाभिकों का संलयन ऊर्जा मुक्त करता है।',
          hinglish: 'Density of all nuclei is constant. Peak of binding energy curve is Fe-56 (8.8 MeV). Fission splits heavy nuclei; fusion combines light nuclei.',
        },
        formula: 'R = R_0 A^{1/3}, \\quad E_b = \\Delta m c^2 = \\Delta m \\times 931.5\\,\\text{MeV}, \\quad \\rho_{\\text{nucleus}} \\approx 2.3 \\times 10^{17}\\,\\text{kg/m}^3',
        keyPoints: [
          {
            en: 'Nuclear density is independent of the mass number A; a uranium nucleus has the same matter density as a carbon nucleus.',
            hi: 'नाभिकीय घनत्व द्रव्यमान संख्या A पर निर्भर नहीं करता; यूरेनियम और कार्बन का नाभिकीय घनत्व लगभग समान होता है।',
            hinglish: 'All nuclei have the same density (~2.3 × 10¹⁷ kg/m³).',
          },
          {
            en: 'Nuclear fusion produces more energy per unit mass than fission and powers our sun (proton-proton cycle).',
            hi: 'नाभिकीय संलयन में प्रति इकाई द्रव्यमान विखंडन से अधिक ऊर्जा मुक्त होती है (तारों का ऊर्जा स्रोत)।',
            hinglish: 'Fusion yields much higher energy per unit mass than fission.',
          },
        ],
        difficulty: 'easy',
        checkpointQuestion: {
          prompt: {
            en: 'Around which element does the binding energy per nucleon curve reach its maximum peak value of approximately 8.75 MeV per nucleon?',
            hi: 'प्रति न्यूक्लियॉन बंधन ऊर्जा वक्र किस तत्व के निकट अपने अधिकतम शिखर मान (लगभग 8.75 MeV) तक पहुँचता है?',
            hinglish: 'Binding energy per nucleon curve kis element ke paas maximum (~8.75 MeV) hota hai?',
          },
          options: [
            { en: 'Iron (⁵⁶Fe)', hi: 'आयरन / लोहा (⁵⁶Fe)', hinglish: 'Iron (⁵⁶Fe)' },
            { en: 'Uranium (²³⁸U)', hi: 'यूरेनियम (²³⁸U)', hinglish: 'Uranium (²³⁸U)' },
            { en: 'Helium (⁴He)', hi: 'हीलियम (⁴He)', hinglish: 'Helium (⁴He)' },
            { en: 'Hydrogen (¹H)', hi: 'हाइड्रोजन (¹H)', hinglish: 'Hydrogen (¹H)' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'Iron-56 (⁵⁶Fe) has the highest binding energy per nucleon (~8.75 MeV/nucleon), making its nucleus the most thermodynamically stable in nature.',
            hi: 'आयरन-56 (⁵⁶Fe) के नाभिक की प्रति न्यूक्लियॉन बंधन ऊर्जा सर्वाधिक (~8.75 MeV) होती है, जिससे यह प्रकृति में सबसे स्थायी नाभिक है।',
            hinglish: 'Fe-56 has the highest binding energy per nucleon and maximum stability.',
          }
        },
      },
    ],
  },

  // Chapter 14
  {
    id: 'c12_phy_ch14_semiconductors',
    subjectId: 'class12_physics',
    chapterNo: 14,
    title: {
      en: 'Semiconductor Electronics: Materials, Devices and Simple Circuits',
      hi: 'अर्धचालक इलेक्ट्रॉनिकी: पदार्थ, युक्तियाँ तथा सरल परिपथ',
      hinglish: 'Semiconductor Electronics',
    },
    description: {
      en: 'Energy bands in conductors, semiconductors, and insulators; intrinsic and extrinsic semiconductors (p-type and n-type); p-n junction formation (depletion region & barrier potential); forward and reverse bias V-I characteristics; p-n junction diode as Half-Wave and Full-Wave Rectifier.',
      hi: 'चालक, कुचालक एवं अर्धचालक में ऊर्जा बैंड; नैज एवं अपद्रव्यी अर्धचालक (p-प्रकार व n-प्रकार); p-n संधि निर्माण (ह्रासी स्तर व प्राचीर विभव); अग्र एवं पश्च अभिनति अभिलाक्षणिक; तथा अर्ध-तरंग व पूर्ण-तरंग दिष्टकारी के रूप में डायोड।',
      hinglish: 'p-n junction depletion layer, forward & reverse bias, diode as rectifier.',
    },
    targetMastery: 90,
    highYieldWeightage: 8,
    textbookRef: 'NCERT Physics Part 2 Class 12 Ch 14 / UPMSP Bhautik Vigyan Ch 14',
    classLevel: '12',
    concepts: [
      {
        id: 'c12_concept_pn_junction_rectifier',
        title: {
          en: 'p-n Junction Diode Characteristics & Full-Wave Rectifier',
          hi: 'p-n संधि डायोड अभिलाक्षणिक एवं पूर्ण-तरंग दिष्टकारी',
          hinglish: 'p-n Junction Biasing & Full-Wave Rectification',
        },
        summary: {
          en: 'A p-n junction is formed by doping adjacent regions of a silicon crystal. Diffusion of holes and electrons creates an immobile ion depletion layer and a barrier potential (~0.7 V for Si). In forward bias (p to +, n to -), depletion layer width decreases and large mA current flows. In reverse bias (p to -, n to +), depletion layer widens and only tiny μA minority carrier reverse saturation current flows. In a full-wave rectifier using two diodes and a center-tapped transformer, output ripple frequency is 2f (100 Hz for 50 Hz input AC).',
          hi: 'p-n संधि में विसरण से ह्रासी परत और प्राचीर विभव (Si के लिए ~0.7 V) बनता है। अग्र अभिनति में ह्रासी परत घटती है और mA धारा बहती है। पश्च अभिनति में ह्रासी परत चौड़ी होती है। पूर्ण-तरंग दिष्टकारी में दोनों अर्ध-चक्रों में धारा एक ही दिशा में प्राप्त होती है (निर्गत आवृत्ति = 2f = 100 Hz)।',
          hinglish: 'Forward bias: p to positive, n to negative (depletion narrows, mA current). Reverse bias: depletion widens. Full-wave rectifier output frequency is 2f.',
        },
        formula: 'n_e n_h = n_i^2 \\quad (\\text{Mass Action Law}), \\quad f_{\\text{out, full-wave}} = 2 f_{\\text{in}}, \\quad f_{\\text{out, half-wave}} = f_{\\text{in}}',
        keyPoints: [
          {
            en: 'In forward bias, the external voltage opposes the internal barrier potential, reducing depletion layer width.',
            hi: 'अग्र अभिनति में बाह्य विभव आंतरिक प्राचीर विभव का विरोध करता है जिससे अवक्षय परत पतली हो जाती है।',
            hinglish: 'Forward bias reduces barrier potential and depletion width.',
          },
          {
            en: 'For 50 Hz input AC supply, the output ripple frequency is 50 Hz for a half-wave rectifier, but 100 Hz for a full-wave rectifier.',
            hi: '50 Hz प्रत्यावर्ती धारा निवेश के लिए पूर्ण-तरंग दिष्टकारी की निर्गत रिपल आवृत्ति 100 Hz होती है।',
            hinglish: 'Full-wave rectifier output frequency = 2 × 50 Hz = 100 Hz.',
          },
        ],
        difficulty: 'medium',
        checkpointQuestion: {
          prompt: {
            en: 'If a full-wave rectifier is fed with an input alternating current of frequency 50 Hz, what is the ripple frequency of the rectified output DC current?',
            hi: 'यदि 50 Hz आवृत्ति की प्रत्यावर्ती धारा को एक पूर्ण-तरंग दिष्टकारी में निवेश किया जाए, तो निर्गत धारा की रिपल आवृत्ति क्या होगी?',
            hinglish: '50 Hz input AC hone par full-wave rectifier ki output ripple frequency kya hogi?',
          },
          options: [
            { en: '100 Hz', hi: '100 Hz', hinglish: '100 Hz' },
            { en: '50 Hz', hi: '50 Hz', hinglish: '50 Hz' },
            { en: '25 Hz', hi: '25 Hz', hinglish: '25 Hz' },
            { en: '200 Hz', hi: '200 Hz', hinglish: '200 Hz' },
          ],
          correctIndex: 0,
          explanation: {
            en: 'In a full-wave rectifier, both the positive and negative half-cycles of the input AC are converted into unidirectional output pulses. Hence output frequency is 2 × f = 2 × 50 Hz = 100 Hz.',
            hi: 'पूर्ण-तरंग दिष्टकारी दोनों अर्ध-चक्रों को एक ही दिशा में मोड़ता है, अतः निर्गत आवृत्ति 2 × 50 = 100 Hz होती है।',
            hinglish: 'Full-wave doubles the pulse frequency: 2 × 50 Hz = 100 Hz.',
          }
        },
      },
    ],
  },
];
