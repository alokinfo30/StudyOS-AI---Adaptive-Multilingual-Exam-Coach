import { Dialect, GradeLevel, StudentProfile, DecodableStory, TaRLPlan } from '../types/akshar';

export interface DialectMeta {
  id: Dialect;
  nameEnglish: string;
  nameNative: string;
  region: string;
  phonologicalTraits: string;
  sampleGreeting: string;
}

export const DIALECTS_LIST: DialectMeta[] = [
  {
    id: 'bhojpuri',
    nameEnglish: 'Bhojpuri',
    nameNative: 'भोजपुरी',
    region: 'Eastern UP & Western Bihar (Gorakhpur, Ballia, Bhojpur, Chapra)',
    phonologicalTraits: 'Labiodental [v] articulated as bilabial [b], numeral classifier "गो" (go), auxiliary "बा/बानी".',
    sampleGreeting: 'प्रणाम गुरुजी, हमार बस्ता में दू गो किताब बा।',
  },
  {
    id: 'awadhi',
    nameEnglish: 'Awadhi',
    nameNative: 'अवधी',
    region: 'Central Uttar Pradesh (Lucknow, Ayodhya, Sultanpur, Rae Bareli)',
    phonologicalTraits: 'Glottal word-endings, diphthong preservation, /s/ replacing /ʃ/, auxiliary "आहि/बाटी".',
    sampleGreeting: 'राम-राम मास्टर साहब, हमका ई पाठ बहुत नीक लाग।',
  },
  {
    id: 'maithili',
    nameEnglish: 'Maithili',
    nameNative: 'मैथिली',
    region: 'Northern Bihar (Darbhanga, Madhubani, Samastipur)',
    phonologicalTraits: 'Honorific verb inflection, rounded vowel /ɔ/, /dʒʰ/ retention, numeral classifier "टा" (ta).',
    sampleGreeting: 'प्रणाम गुरुजी, हमर पोथी में सुंदर चित्र अछि।',
  },
  {
    id: 'magahi',
    nameEnglish: 'Magahi',
    nameNative: 'मगही',
    region: 'Central & Southern Bihar (Patna, Gaya, Nalanda, Nawada)',
    phonologicalTraits: 'Absence of aspiration in quick speech, classifier "ठो" (tho), ending in -लई/-थिन.',
    sampleGreeting: 'मास्टर जी, हम आज तीन ठो सवाल हल करलियई।',
  },
  {
    id: 'bundelkhandi',
    nameEnglish: 'Bundelkhandi',
    nameNative: 'बुंदेलखंडी',
    region: 'Bundelkhand (Jhansi, Banda, Mahoba, Sagar)',
    phonologicalTraits: 'Short vowels, voiced aspirates /gh, jh/, distinctive past tense markers.',
    sampleGreeting: 'मास्साब, हमाओ स्लेट पै लिखो देखो।',
  },
  {
    id: 'chhattisgarhi',
    nameEnglish: 'Chhattisgarhi',
    nameNative: 'छत्तीसगढ़ी',
    region: 'Chhattisgarh & Eastern MP (Raipur, Bilaspur, Bastar)',
    phonologicalTraits: 'Phonetic assimilation, nasalized plural marker -मन (man), auxiliary "हे/हवे".',
    sampleGreeting: 'जय जोहार गुरुजी, आज हमन पहाड़ा याद कर लेहेन।',
  },
  {
    id: 'marwari',
    nameEnglish: 'Marwari',
    nameNative: 'मारवाड़ी',
    region: 'Western Rajasthan (Jodhpur, Bikaner, Nagaur)',
    phonologicalTraits: 'Voiceless glottal fricative /h/ replacing sibilant /s/, retroflex lateral /ɭ/.',
    sampleGreeting: 'खम्मा घणी गुरुजी, म्हाने ई अक्षर बतावो।',
  },
];

// Sample authentic rural slates for testing the multimodal Vision engine
export interface SampleSlate {
  id: string;
  title: string;
  studentName: string;
  grade: GradeLevel;
  subject: 'hindi_fln' | 'math_numeracy' | 'english_letters';
  dialect: Dialect;
  difficulty: 'Foundational' | 'Intermediate' | 'Numeracy';
  imageUrl: string;
  thumbnailSvg: string;
  expectedError: string;
  sampleKey: string;
}

export const SAMPLE_SLATES: SampleSlate[] = [
  {
    id: 'slate_01',
    title: 'देवनागरी "ब" बनाम "व" ध्वन्यात्मक भ्रम (Phonological Confusion)',
    studentName: 'आरव कुमार',
    grade: 1,
    subject: 'hindi_fln',
    dialect: 'bhojpuri',
    difficulty: 'Foundational',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
    thumbnailSvg: 'बकील बाबू आइल बाड़न',
    expectedError: 'Phonological substitution of "व" with "ब" due to Bhojpuri dialectical phonetics.',
    sampleKey: 'bhojpuri_ba_va',
  },
  {
    id: 'slate_02',
    title: 'अंग्रेजी वर्ण दर्पण पलटाव: d vs b (Lateral Mirror Inversion)',
    studentName: 'प्रिया कुमारी',
    grade: 1,
    subject: 'english_letters',
    dialect: 'bhojpuri',
    difficulty: 'Foundational',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
    thumbnailSvg: 'd a g (for b a g)',
    expectedError: 'Spatial lateral mirror inversion: "d" drawn instead of "b" due to developmental mirror-invariance.',
    sampleKey: 'letter_inversion_db',
  },
  {
    id: 'slate_03',
    title: 'दो अंकों का जोड़: हासिल (Carryover) अवधारणा भ्रांति',
    studentName: 'रोहन यादव',
    grade: 2,
    subject: 'math_numeracy',
    dialect: 'awadhi',
    difficulty: 'Numeracy',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    thumbnailSvg: '17 + 8 = 115',
    expectedError: 'Column addition concatenation without base-10 regrouping (wrote 15 directly under 7+8).',
    sampleKey: 'math_carryover',
  },
];

// Multigrade class roster of 38 students across Grades 1, 2, and 3
export const INITIAL_STUDENTS_ROSTER: StudentProfile[] = [
  // Band 1: Akshar & Matra Starters (14 students)
  { id: 'st_01', name: 'आरव कुमार', rollNumber: 1, grade: 1, homeDialect: 'bhojpuri', currentBand: 1, avatar: '👦🏽', phonicsAccuracy: 64, attendanceToday: true, peerLeaderEligible: false, notes: 'व vs ब phonetic confusion' },
  { id: 'st_02', name: 'प्रिया कुमारी', rollNumber: 2, grade: 1, homeDialect: 'bhojpuri', currentBand: 1, avatar: '👧🏽', phonicsAccuracy: 58, attendanceToday: true, peerLeaderEligible: false, notes: 'd/b mirror writing' },
  { id: 'st_03', name: 'सूरज पासवान', rollNumber: 3, grade: 1, homeDialect: 'magahi', currentBand: 1, avatar: '👦🏾', phonicsAccuracy: 52, attendanceToday: true, peerLeaderEligible: false, notes: 'Needs stroke grip practice' },
  { id: 'st_04', name: 'अंशु पटेल', rollNumber: 4, grade: 1, homeDialect: 'awadhi', currentBand: 1, avatar: '👧🏽', phonicsAccuracy: 62, attendanceToday: true, peerLeaderEligible: false, notes: 'Vowel recognition starter' },
  { id: 'st_05', name: 'छोटू बिंद', rollNumber: 5, grade: 1, homeDialect: 'bhojpuri', currentBand: 1, avatar: '👦🏽', phonicsAccuracy: 48, attendanceToday: true, peerLeaderEligible: false, notes: 'Single digit 1-5 counting' },
  { id: 'st_06', name: 'रवि शर्मा', rollNumber: 6, grade: 1, homeDialect: 'maithili', currentBand: 1, avatar: '👦🏽', phonicsAccuracy: 66, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_07', name: 'खुशबू निशाद', rollNumber: 7, grade: 1, homeDialect: 'bhojpuri', currentBand: 1, avatar: '👧🏽', phonicsAccuracy: 60, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_08', name: 'दीपक गोंड', rollNumber: 8, grade: 2, homeDialect: 'bhojpuri', currentBand: 1, avatar: '👦🏾', phonicsAccuracy: 55, attendanceToday: true, peerLeaderEligible: false, notes: 'Grade 2 repeat support' },
  { id: 'st_09', name: 'सीमा भारती', rollNumber: 9, grade: 2, homeDialect: 'awadhi', currentBand: 1, avatar: '👧🏽', phonicsAccuracy: 62, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_10', name: 'मोनू चौहान', rollNumber: 10, grade: 1, homeDialect: 'bhojpuri', currentBand: 1, avatar: '👦🏽', phonicsAccuracy: 50, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_11', name: 'पूजा राजभर', rollNumber: 11, grade: 1, homeDialect: 'bhojpuri', currentBand: 1, avatar: '👧🏽', phonicsAccuracy: 65, attendanceToday: false, peerLeaderEligible: false },
  { id: 'st_12', name: 'गोलू यादव', rollNumber: 12, grade: 1, homeDialect: 'awadhi', currentBand: 1, avatar: '👦🏽', phonicsAccuracy: 59, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_13', name: 'साक्षी मल्लाह', rollNumber: 13, grade: 2, homeDialect: 'bhojpuri', currentBand: 1, avatar: '👧🏽', phonicsAccuracy: 63, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_14', name: 'कृष्णा खरवार', rollNumber: 14, grade: 1, homeDialect: 'bhojpuri', currentBand: 1, avatar: '👦🏽', phonicsAccuracy: 57, attendanceToday: true, peerLeaderEligible: false },

  // Band 2: Word & Blending Navigators (16 students)
  { id: 'st_15', name: 'रोहन यादव', rollNumber: 15, grade: 2, homeDialect: 'awadhi', currentBand: 2, avatar: '👦🏽', phonicsAccuracy: 78, attendanceToday: true, peerLeaderEligible: true, notes: 'Peer buddy leader for matras' },
  { id: 'st_16', name: 'सुनीता चौहान', rollNumber: 16, grade: 2, homeDialect: 'bhojpuri', currentBand: 2, avatar: '👧🏽', phonicsAccuracy: 74, attendanceToday: true, peerLeaderEligible: true },
  { id: 'st_17', name: 'अमन राज', rollNumber: 17, grade: 2, homeDialect: 'magahi', currentBand: 2, avatar: '👦🏽', phonicsAccuracy: 72, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_18', name: 'काजल वर्मा', rollNumber: 18, grade: 2, homeDialect: 'awadhi', currentBand: 2, avatar: '👧🏽', phonicsAccuracy: 76, attendanceToday: true, peerLeaderEligible: true },
  { id: 'st_19', name: 'विकास मांझी', rollNumber: 19, grade: 2, homeDialect: 'bhojpuri', currentBand: 2, avatar: '👦🏾', phonicsAccuracy: 70, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_20', name: 'सलोनी मिश्रा', rollNumber: 20, grade: 2, homeDialect: 'maithili', currentBand: 2, avatar: '👧🏽', phonicsAccuracy: 80, attendanceToday: true, peerLeaderEligible: true },
  { id: 'st_21', name: 'आदित्य साहनी', rollNumber: 21, grade: 2, homeDialect: 'bhojpuri', currentBand: 2, avatar: '👦🏽', phonicsAccuracy: 73, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_22', name: 'पिंकी देवी', rollNumber: 22, grade: 3, homeDialect: 'bhojpuri', currentBand: 2, avatar: '👧🏽', phonicsAccuracy: 75, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_23', name: 'नीरज कन्नौजिया', rollNumber: 23, grade: 2, homeDialect: 'awadhi', currentBand: 2, avatar: '👦🏽', phonicsAccuracy: 71, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_24', name: 'प्रीति चौरसिया', rollNumber: 24, grade: 2, homeDialect: 'bhojpuri', currentBand: 2, avatar: '👧🏽', phonicsAccuracy: 77, attendanceToday: true, peerLeaderEligible: true },
  { id: 'st_25', name: 'सोनू पंडित', rollNumber: 25, grade: 3, homeDialect: 'maithili', currentBand: 2, avatar: '👦🏽', phonicsAccuracy: 73, attendanceToday: false, peerLeaderEligible: false },
  { id: 'st_26', name: 'रितु पाल', rollNumber: 26, grade: 2, homeDialect: 'awadhi', currentBand: 2, avatar: '👧🏽', phonicsAccuracy: 75, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_27', name: 'समीर अली', rollNumber: 27, grade: 2, homeDialect: 'bhojpuri', currentBand: 2, avatar: '👦🏽', phonicsAccuracy: 79, attendanceToday: true, peerLeaderEligible: true },
  { id: 'st_28', name: 'चांदनी खातून', rollNumber: 28, grade: 2, homeDialect: 'bhojpuri', currentBand: 2, avatar: '👧🏽', phonicsAccuracy: 72, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_29', name: 'करण पासवान', rollNumber: 29, grade: 3, homeDialect: 'magahi', currentBand: 2, avatar: '👦🏾', phonicsAccuracy: 74, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_30', name: 'मुस्कान भारती', rollNumber: 30, grade: 2, homeDialect: 'bhojpuri', currentBand: 2, avatar: '👧🏽', phonicsAccuracy: 76, attendanceToday: true, peerLeaderEligible: false },

  // Band 3: Paragraph & Decodable Fluent Readers (8 students)
  { id: 'st_31', name: 'मनीषा गुप्ता', rollNumber: 31, grade: 3, homeDialect: 'bhojpuri', currentBand: 3, avatar: '👧🏽', phonicsAccuracy: 94, attendanceToday: true, peerLeaderEligible: true, notes: 'Class captain & reading buddy' },
  { id: 'st_32', name: 'अभिषेक सिंह', rollNumber: 32, grade: 3, homeDialect: 'bhojpuri', currentBand: 3, avatar: '👦🏽', phonicsAccuracy: 91, attendanceToday: true, peerLeaderEligible: true },
  { id: 'st_33', name: 'दीक्षा शर्मा', rollNumber: 33, grade: 3, homeDialect: 'awadhi', currentBand: 3, avatar: '👧🏽', phonicsAccuracy: 95, attendanceToday: true, peerLeaderEligible: true },
  { id: 'st_34', name: 'हर्ष तिवारी', rollNumber: 34, grade: 3, homeDialect: 'maithili', currentBand: 3, avatar: '👦🏽', phonicsAccuracy: 89, attendanceToday: true, peerLeaderEligible: true },
  { id: 'st_35', name: 'संध्या राजभर', rollNumber: 35, grade: 3, homeDialect: 'bhojpuri', currentBand: 3, avatar: '👧🏽', phonicsAccuracy: 88, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_36', name: 'पंकज कुमार', rollNumber: 36, grade: 3, homeDialect: 'magahi', currentBand: 3, avatar: '👦🏽', phonicsAccuracy: 92, attendanceToday: true, peerLeaderEligible: true },
  { id: 'st_37', name: 'अंजलि मौर्या', rollNumber: 37, grade: 3, homeDialect: 'awadhi', currentBand: 3, avatar: '👧🏽', phonicsAccuracy: 90, attendanceToday: true, peerLeaderEligible: false },
  { id: 'st_38', name: 'अनुज प्रजापति', rollNumber: 38, grade: 3, homeDialect: 'bhojpuri', currentBand: 3, avatar: '👦🏽', phonicsAccuracy: 93, attendanceToday: true, peerLeaderEligible: true },
];

export const INITIAL_TARL_PLAN: TaRLPlan = {
  band1Activity: {
    title: 'कंकड़-अक्षर ट्रेसिंग (Pebble-Letter Sand Contour)',
    duration: '10 Mins',
    materialsNeeded: 'Slates, soft chalk, 20 small clean pebbles or tamarind seeds',
    instructions: 'Children trace large outline of target letter "ब" and "व" on their slates, placing small pebbles along the stroke curve to feel the open loop of "व" vs closed belly line of "ब".',
    peerLeaderRole: 'Student Buddy checks that pebbles do not roll away and leads phonetic sound chant ("व... वर्षा, ब... बकरा").',
  },
  band2Activity: {
    title: 'मात्रा-पहेली रेलगाड़ी (Matra Train Relay)',
    duration: '10 Mins',
    materialsNeeded: 'Chalk pieces, 3 slate boards placed in a row',
    instructions: 'First child writes a root consonant (e.g. क), second child adds a matra (का / कि / कू), third child reads the blended syllable aloud and speaks a real-life word.',
    peerLeaderRole: 'Peer monitor awards a chalk star on the slate for each valid word blended.',
  },
  band3Activity: {
    title: 'मुन्नी और बछड़ा - लघु कथा वाचन (Paired Decodable Reading)',
    duration: '10 Mins',
    materialsNeeded: 'Graded Decodable Storycard #4',
    instructions: 'Pairs take turns reading 2 lines each of the rural decodable reader. If a student stumbles on an anuswar word, their partner points with a twig to sound it out together.',
    peerLeaderRole: 'Group captain asks 2 oral comprehension questions ("बछड़ा कहाँ भागा?", "मुन्नी ने क्या खिलाया?").',
  },
  blackboardChalkPrompt: '┌─────────────┬─────────────┬─────────────┐\n│  दल १ (अक्षर) │ दल २ (मात्रा) │ दल ३ (कहानी) │\n│  व ० ब ० म  │ क+ा=का, क+ि=कि │ कार्ड नं. ४  │\n│  (कंकड़ जमाव) │  (शब्द रेल) │ (साथी वाचन) │\n└─────────────┴─────────────┴─────────────┘',
  rotationTimerMinutes: 12,
};

export const DECODABLE_STORIES: DecodableStory[] = [
  {
    id: 'story_01',
    title: 'मुन्नी और बछड़ा',
    dialectTitle: 'मुन्नी आ बाछी',
    grade: 1,
    level: 1,
    phonemeFocus: ['ब', 'व', 'छ', 'म'],
    vocabularyVernacular: [
      { dialect: 'बाछी (Bhojpuri)', standard: 'बछड़ा', meaning: 'Young calf' },
      { dialect: 'दउरल (Bhojpuri)', standard: 'दौड़ा', meaning: 'Ran' },
      { dialect: 'दूध पियवइली (Bhojpuri)', standard: 'दूध पिलाया', meaning: 'Fed milk' },
    ],
    sentences: [
      {
        standard: 'मुन्नी के पास एक छोटा बछड़ा था।',
        dialect: 'मुन्नी लगे एगो छोट बाछी रहल।',
      },
      {
        standard: 'बछड़ा बगीचे में उछल-कूद कर रहा था।',
        dialect: 'बाछी बगइचा में कूद-फांद करत रहल।',
      },
      {
        standard: 'मुन्नी ने उसे हरी घास और मीठा पानी दिया।',
        dialect: 'मुन्नी ओकरा के हरियर घास आ मीठ पानी दिहलस।',
      },
      {
        standard: 'बछड़ा खुश होकर मुन्नी के पास दौड़ आया।',
        dialect: 'बाछी खुश होके मुन्नी लगे दउर के आइल।',
      },
    ],
    comprehensionQuestions: [
      'मुन्नी के पास कौन सा जानवर था? (Which animal did Munni have?)',
      'बछड़े ने क्या खाया? (What did the calf eat?)',
    ],
  },
  {
    id: 'story_02',
    title: 'नदी किनारे मेला',
    dialectTitle: 'नदिया तीरे मेला',
    grade: 2,
    level: 2,
    phonemeFocus: ['न', 'द', 'म', 'ल'],
    vocabularyVernacular: [
      { dialect: 'तीरे (Awadhi/Bhojpuri)', standard: 'किनारे', meaning: 'River bank' },
      { dialect: 'खिलौना (General)', standard: 'खिलौना', meaning: 'Toy' },
      { dialect: 'जलेबी (General)', standard: 'जलेबी', meaning: 'Sweet pretzel' },
    ],
    sentences: [
      {
        standard: 'आज नदी किनारे बहुत बड़ा मेला लगा है।',
        dialect: 'आज नदिया तीरे भारी मेला लागल बा।',
      },
      {
        standard: 'रोहन और सीमा ने मिट्टी के खिलौने खरीदे।',
        dialect: 'रोहन आ सीमा मटिक खिलौना कीनल लो।',
      },
      {
        standard: 'दोनों ने गरम-गरम जलेबी भी खाई।',
        dialect: 'दुनो जाने तातल-तातल जलेबी खइलन।',
      },
      {
        standard: 'शाम को सब बच्चे खुशी-खुशी घर लौटे।',
        dialect: 'सँझिया के सब लइका खुश होके घरे लौटलन।',
      },
    ],
    comprehensionQuestions: [
      'मेला कहाँ लगा था? (Where was the fair set up?)',
      'बच्चों ने मेले में क्या खाया? (What sweet did they eat?)',
    ],
  },
  {
    id: 'story_03',
    title: 'बरसात और नाव',
    dialectTitle: 'बरखा आ कागजी नाव',
    grade: 3,
    level: 3,
    phonemeFocus: ['ब', 'र', 'स', 'व'],
    vocabularyVernacular: [
      { dialect: 'बरखा (Bhojpuri/Awadhi)', standard: 'वर्षा / बरसात', meaning: 'Rain' },
      { dialect: 'डोंगी (Vernacular)', standard: 'नाव', meaning: 'Boat' },
    ],
    sentences: [
      {
        standard: 'आसमान में काले बादल घिर आए और वर्षा शुरू हुई।',
        dialect: 'अकास में करिया बदरी घेर आइल आ बरखा सुरु भइल।',
      },
      {
        standard: 'बच्चों ने कागज की रंग-बिरंगी नावें बनाईं।',
        dialect: 'लइकाईन कागद के रंग-बिरंग डोंगी बनवलस।',
      },
      {
        standard: 'पानी की धारा में नावें तैरने लगीं।',
        dialect: 'पानी के धार में डोंगी उतराये लागल।',
      },
      {
        standard: 'सब मिलकर ताली बजाकर गाने लगे।',
        dialect: 'सब मिलके ताली बजा के गावे लागल।',
      },
    ],
    comprehensionQuestions: [
      'बादल किस रंग के थे? (What color were the clouds?)',
      'बच्चों ने किस चीज की नाव बनाई? (What did the children make boats with?)',
    ],
  },
];
