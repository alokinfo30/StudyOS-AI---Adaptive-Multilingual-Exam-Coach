/**
 * StudyOS AI - Career Roadmap Engine
 * Verified Indian educational pathways, entrance exams, cutoff tiers & career milestones
 */
import { CareerRoadmap } from '../types';

export const CAREER_ROADMAPS: CareerRoadmap[] = [
  {
    id: 'marine_engineering',
    category: 'Engineering & Maritime',
    icon: 'Anchor',
    title: {
      en: 'Marine Engineering (Merchant Navy & Maritime)',
      hi: 'मरीन इंजीनियरिंग (मर्चेंट नेवी एवं समुद्री अभियांत्रिकी)',
      hinglish: 'Marine Engineering (Merchant Navy Officer)',
      bn: 'মেরিন ইঞ্জিনিয়ারিং (মার্চেন্ট নেভি)',
      mr: 'मरीन इंजिनिअरिंग (मर्चंट नेव्ही)',
    },
    shortDescription: {
      en: 'Design, operate, and maintain marine vessels, mega-ships, and submarine propulsion systems globally.',
      hi: 'वैश्विक जहाजों, कार्गो एवं समुद्री इंजनों का संचालन, डिजाइन और तकनीकी प्रबंधन।',
      hinglish: 'Cargo ships, naval vessels aur marine engines ke operation & maintenance ka global career.',
    },
    recommendedStream: '12th PCM (Physics, Chemistry, Maths) ≥ 60% with English ≥ 50%',
    avgStartingSalaryIndia: '₹12 Lakhs – ₹28 Lakhs / year (Tax-free under NRI status)',
    skillsRequired: ['Thermodynamics', 'Fluid Mechanics', 'Diesel Propulsion', 'Physical & Eye Fitness', 'Problem Solving Under Pressure'],
    milestones: [
      {
        stage: 'Stage 1: Secondary & Higher Secondary',
        ageOrClass: 'Class 11 - 12',
        title: {
          en: '10+2 PCM Preparation & Medical Screening',
          hi: '10+2 पीसीएम तैयारी एवं प्रारंभिक चिकित्सा जांच',
          hinglish: '10+2 PCM + Eye Fitness (6/6 without color blindness)',
        },
        description: {
          en: 'Secure minimum 60% aggregate in PCM and 50% in English in Class 12. Undergo DG Shipping-approved medical test with 6/6 vision and no color blindness.',
          hi: '12वीं कक्षा में पीसीएम में न्यूनतम 60% तथा अंग्रेजी में 50% अंक। डीजी शिपिंग स्वीकृत डॉक्टर से पूर्ण दृष्टि व फिटनेस प्रमाणन।',
          hinglish: 'Class 12 PCM me 60%+ score karein. DG Shipping approved eye test clear karein.',
        },
        exams: ['IMU-CET (Indian Maritime University Common Entrance Test)', 'JEE Main (accepted by select institutes)'],
        keySubjects: ['Physics (Mechanics, Heat)', 'Maths (Calculus, Vectors)', 'Chemistry', 'English & General Aptitude'],
        selectionRate: 'Top 5% in IMU-CET',
        topInstitutes: ['IMU Kolkata (DMET)', 'IMU Mumbai (MERI)', 'Tolani Maritime Institute (TMI)', 'Anglo-Eastern Maritime Academy'],
      },
      {
        stage: 'Stage 2: Degree / Cadets Training',
        ageOrClass: '4 Years (B.Tech Marine Engg) or 1 Year (GME for Mech Engg)',
        title: {
          en: 'B.Tech Marine Engineering & Pre-Sea Training',
          hi: 'बी.टेक मरीन इंजीनियरिंग एवं प्री-सी प्रशिक्षण',
          hinglish: 'B.Tech Marine Engg + Workshop & Simulators',
        },
        description: {
          en: 'Intensive 4-year residential academy training covering Marine Boilers, Naval Architecture, Auxiliary Machinery, Automation, and STCW safety certifications.',
          hi: '4 वर्षीय आवासीय प्रशिक्षण जिसमें मरीन बॉयलर्स, जहाज वास्तुकला, ऑटोमेशन और सुरक्षा प्रमाणपत्र शामिल हैं।',
          hinglish: 'Ship machinery, marine electricals aur high-voltage systems ki hands-on training.',
        },
        exams: ['Semester Exams', 'MOP (Marine Officers Proficiency)', 'STCW 2010 Basic Safety Courses'],
        keySubjects: ['Marine Electricals', 'Ship Construction', 'Marine IC Engines', 'Control Engineering'],
        selectionRate: 'Campus Placement Rate: ~85% in Tier 1 Academies',
        topInstitutes: ['Indian Maritime University', 'TMI Pune', 'Samundra Institute of Maritime Studies'],
      },
      {
        stage: 'Stage 3: Sea Service & Officer Licensure',
        ageOrClass: 'Age 22 - 27',
        title: {
          en: 'Junior Engineer ➔ Class IV MMD Certificate of Competency (CoC)',
          hi: 'जूनियर इंजीनियर ➔ क्लास 4 एमएमडी सक्षमता प्रमाण पत्र',
          hinglish: 'Junior Engineer ➔ 4th / 3rd Engineer (Class IV CoC)',
        },
        description: {
          en: 'Complete 6 months structured sea-time as Junior Engineer/Engine Cadet. Pass the Ministry of Shipping Class IV Part B CoC exam to earn license as 4th Engineer Officer.',
          hi: '6 माह की समुद्री सेवा पूरी कर भारत सरकार के शिपिंग मंत्रालय की क्लास 4 CoC परीक्षा पास कर 4th इंजीनियर ऑफिसर बनें।',
          hinglish: '6 months sea service complete karke MMD Class 4 exam clear karein aur Officer rank payein.',
        },
        exams: ['MMD Class IV CoC Oral & Written Exams', 'Advanced Fire Fighting (AFF)'],
        keySubjects: ['Marine Engineering Practice (Motor & Steam)', 'Safety & Maritime Law (SOLAS, MARPOL)'],
        selectionRate: '90% of Cadets pass within 2 attempts',
        topInstitutes: ['Mercantile Marine Department (MMD Government of India)'],
      },
      {
        stage: 'Stage 4: Senior Officer & Chief Engineer',
        ageOrClass: 'Age 28 - 35+',
        title: {
          en: '2nd Engineer ➔ Chief Engineer Officer',
          hi: 'द्वितीय अभियंता ➔ मुख्य अभियंता (चीफ इंजीनियर)',
          hinglish: '2nd Engineer ➔ Chief Engineer (Master of Engine Dept)',
        },
        description: {
          en: 'Clear MMD Class II and Class I CoC. As Chief Engineer, you assume supreme technical command of multi-million dollar vessels worldwide or transition to Shore Superintendent roles.',
          hi: 'क्लास 2 और क्लास 1 CoC उत्तीर्ण कर जहाज के मुख्य अभियंता का पद संभालें।',
          hinglish: 'Class I CoC clear karke Chief Engineer banein. Monthly salary: ₹8-15 Lakhs tax-free.',
        },
        exams: ['MMD Class II CoC', 'MMD Class I (Chief Engineer) CoC'],
        keySubjects: ['Shipboard Management', 'Marine Environmental Law', 'Crisis Engineering'],
        selectionRate: 'Top 15% reach Chief Engineer before age 32',
        topInstitutes: ['Directorate General of Shipping (DGS)'],
      },
    ],
  },
  {
    id: 'software_ai_engineer',
    category: 'Computer Science & AI',
    icon: 'Cpu',
    title: {
      en: 'Software & Artificial Intelligence Engineer',
      hi: 'सॉफ्टवेयर एवं आर्टिफिशियल इंटेलिजेंस इंजीनियर',
      hinglish: 'Software & AI Engineer (Full Stack / ML)',
      bn: 'সফটওয়্যার ও এআই ইঞ্জিনিয়ার',
      mr: 'सॉफ्टवेअर व एआय अभियंता',
    },
    shortDescription: {
      en: 'Architect scalable cloud systems, intelligent deep learning agents, and distributed applications.',
      hi: 'स्केलेबल क्लाउड सिस्टम, डीप लर्निंग मॉडल एवं आधुनिक डिजिटल प्लेटफॉर्म का निर्माण।',
      hinglish: 'Algorithms, Generative AI models aur high-scale cloud platforms build karein.',
    },
    recommendedStream: '12th PCM / Computer Science ≥ 75% for Tier 1 institutes',
    avgStartingSalaryIndia: '₹10 Lakhs – ₹45 Lakhs / year',
    skillsRequired: ['Data Structures & Algorithms', 'Python / TypeScript', 'Linear Algebra & Calculus', 'System Design', 'LLMs & Cloud Infra'],
    milestones: [
      {
        stage: 'Stage 1: Foundation & Entrance Exams',
        ageOrClass: 'Class 11 - 12',
        title: {
          en: 'Target JEE Main, JEE Advanced & BITSAT',
          hi: 'जेईई मेन, जेईई एडवांस्ड एवं बिटसैट की तैयारी',
          hinglish: 'Target JEE Main, Advanced & State CETs',
        },
        description: {
          en: 'Achieve high percentile in Mathematics and Physics to secure Computer Science / AI Engineering in premier engineering colleges.',
          hi: 'कंप्यूटर साइंस एवं एआई शाखा प्राप्त करने के लिए शीर्ष रैंक प्राप्त करना।',
          hinglish: 'Top 1% rank in JEE / BITSAT for CS / AI branch.',
        },
        exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'MHT-CET / WBJEE / KCET'],
        keySubjects: ['Calculus', 'Coordinate Geometry', 'Modern Physics', 'Basic Coding (Python/C++)'],
        selectionRate: 'Top 1-2% for Top Tier CS',
        topInstitutes: ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'BITS Pilani', 'IIIT Hyderabad', 'NIT Trichy'],
      },
      {
        stage: 'Stage 2: Core Computer Science & AI Specialization',
        ageOrClass: 'College Years 1 - 4',
        title: {
          en: 'B.Tech CSE / AI & Open Source Contribution',
          hi: 'बी.टेक सीएसई एवं ओपन सोर्स / एआई प्रोजेक्ट्स',
          hinglish: 'DSA + System Design + Deep Learning Projects',
        },
        description: {
          en: 'Master DSA (LeetCode), Operating Systems, DBMS, Distributed Systems, PyTorch/TensorFlow, and build production web & AI apps.',
          hi: 'डाटा स्ट्रक्चर्स, एल्गोरिदम, मशीन लर्निंग तथा क्लाउड कंप्यूटिंग में महारत हासिल करना।',
          hinglish: 'DSA me 400+ problems solve karein aur real AI agent projects build karein.',
        },
        exams: ['GATE CS (optional for PSU/M.Tech)', 'Campus Tech Screenings'],
        keySubjects: ['Algorithms', 'Probability & Statistics', 'Deep Learning', 'Cloud Architecture'],
        selectionRate: 'Top 10% secure high-tier product engineering offers',
        topInstitutes: ['IIIT-H', 'IITs', 'NITs', 'Top Universities'],
      },
    ],
  },
  {
    id: 'mbbs_doctor',
    category: 'Medical & Healthcare',
    icon: 'Stethoscope',
    title: {
      en: 'Medical Doctor (MBBS ➔ MD / MS Specialist)',
      hi: 'चिकित्सक (एमबीबीएस ➔ एमडी / एमएस विशेषज्ञ)',
      hinglish: 'Medical Doctor (MBBS ➔ MD / MS Specialist)',
      bn: 'চিকিৎসক (এমবিবিএস ও বিশেষজ্ঞ)',
      mr: 'वैद्यकीय डॉक्टर (एमबीबीएस)',
    },
    shortDescription: {
      en: 'Diagnose illnesses, perform life-saving surgeries, and advance clinical healthcare and biomedical research.',
      hi: 'रोग निदान, शल्य चिकित्सा एवं जीवन रक्षक स्वास्थ्य सेवाओं का नेतृत्व।',
      hinglish: 'Clinical diagnosis, surgery aur healthcare healthcare leadership.',
    },
    recommendedStream: '12th PCB (Physics, Chemistry, Biology) ≥ 60%',
    avgStartingSalaryIndia: '₹9 Lakhs – ₹25 Lakhs / year',
    skillsRequired: ['Anatomy & Physiology', 'Clinical Reasoning', 'Empathy', 'Surgical Dexterity', 'Stamina'],
    milestones: [
      {
        stage: 'Stage 1: NEET UG Preparation',
        ageOrClass: 'Class 11 - 12',
        title: {
          en: 'Crack NEET UG (650+ Marks Target)',
          hi: 'नीट यूजी (650+ अंक लक्ष्य) उत्तीर्ण करना',
          hinglish: 'NEET UG 650+ score target for Govt Medical College',
        },
        description: {
          en: 'Complete NCERT mastery across Biology (Botany/Zoology), Chemistry, and Physics.',
          hi: 'बायोलॉजी, केमिस्ट्री एवं फिजिक्स की एनसीईआरटी पर 100% पकड़।',
          hinglish: 'Biology NCERT line by line + Physics numerical speed.',
        },
        exams: ['NEET UG (National Eligibility cum Entrance Test)'],
        keySubjects: ['Genetics & Evolution', 'Human Physiology', 'Organic Chemistry', 'Electrodynamics & Optics'],
        selectionRate: 'Top 2.5% get Government Medical College (GMC)',
        topInstitutes: ['AIIMS New Delhi', 'JIPMER Puducherry', 'KGMU Lucknow', 'CMC Vellore', 'Maulana Azad Medical College (MAMC)'],
      },
    ],
  },
];
