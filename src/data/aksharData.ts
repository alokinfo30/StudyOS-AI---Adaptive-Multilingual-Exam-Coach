import { 
  Dialect, 
  GradeLevel, 
  StudentProfile, 
  DecodableStory, 
  TaRLPlan,
  NipunIndicator,
  StudentCompetencyRecord,
  DailyJourneyStep
} from '../types/akshar';

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

// NIPUN Bharat FLN Competency Indicators (National Foundational Learning Goals)
export const NIPUN_INDICATORS: NipunIndicator[] = [
  {
    id: 'H1_LETTER_SOUND',
    code: 'H1',
    titleHindi: 'वर्ण पहचान व ध्वनि विभेद',
    titleEnglish: 'Letter & Phoneme Sound Discrimination',
    domain: 'literacy',
    targetGrade: 1,
    benchmarkDescription: 'Identifies at least 25 Devanagari letters with accurate phonetic sound discrimination without dialect substitution (e.g., distinguishing "व" vs "ब").',
  },
  {
    id: 'H2_MATRA_BLENDS',
    code: 'H2',
    titleHindi: 'मात्रा व संयुक्त वर्ण',
    titleEnglish: 'Vowel Diacritics & Consonant Blends',
    domain: 'literacy',
    targetGrade: 2,
    benchmarkDescription: 'Decodes words with standard matras (आ, इ, ई, उ, ऊ, ए, ऐ, ओ, औ) and 2-consonant conjuncts with 80%+ accuracy.',
  },
  {
    id: 'H3_FLUENT_READING',
    code: 'H3',
    titleHindi: 'सरल गद्यांश धाराप्रवाह पठन',
    titleEnglish: 'Grade-Appropriate Fluent Reading',
    domain: 'literacy',
    targetGrade: 3,
    benchmarkDescription: 'Reads an unfamiliar grade-level passage fluently at 45-60 words per minute with reading comprehension.',
  },
  {
    id: 'M1_PLACE_VALUE',
    code: 'M1',
    titleHindi: 'संख्या ज्ञान व स्थानीय मान (1-99)',
    titleEnglish: 'Number Sense & Place Value (1-99)',
    domain: 'numeracy',
    targetGrade: 1,
    benchmarkDescription: 'Represents numbers up to 99 with concrete bead-frame bundles of Tens (दहाई) and Units (इकाई).',
  },
  {
    id: 'M2_REGROUP_ADD',
    code: 'M2',
    titleHindi: 'हासिल वाला 2-अंकीय जोड़',
    titleEnglish: '2-Digit Regrouping / Carry Addition',
    domain: 'numeracy',
    targetGrade: 2,
    benchmarkDescription: 'Accurately adds two 2-digit numbers requiring unit-to-tens carryover without concatenation error.',
  },
  {
    id: 'M3_STORY_MATH',
    code: 'M3',
    titleHindi: 'मौखिक व्यावहारिक गणित',
    titleEnglish: 'Oral Contextual Story Math',
    domain: 'numeracy',
    targetGrade: 3,
    benchmarkDescription: 'Solves real-life rural transaction word problems involving subtraction and multiplication up to 100.',
  },
];

// Sample Classroom Competency Matrix for 38 Multigrade Students
export const SAMPLE_STUDENT_COMPETENCIES: StudentCompetencyRecord[] = [
  {
    studentId: 'st_01',
    studentName: 'Aarav Kumar (आरव)',
    rollNumber: 1,
    grade: 1,
    dialect: 'bhojpuri',
    currentBand: 1,
    competencies: {
      H1_LETTER_SOUND: 'intervention',
      H2_MATRA_BLENDS: 'intervention',
      H3_FLUENT_READING: 'intervention',
      M1_PLACE_VALUE: 'developing',
      M2_REGROUP_ADD: 'intervention',
      M3_STORY_MATH: 'developing',
    },
    primaryMisconception: "Devanagari 'व' / 'ब' substitution due to Bhojpuri phonology.",
    actionableTip: 'Use finger tracing in sand-tray for the vertical belly stroke of "ब".',
  },
  {
    studentId: 'st_02',
    studentName: 'Priya Kumari (प्रिया)',
    rollNumber: 2,
    grade: 1,
    dialect: 'awadhi',
    currentBand: 1,
    competencies: {
      H1_LETTER_SOUND: 'developing',
      H2_MATRA_BLENDS: 'intervention',
      H3_FLUENT_READING: 'intervention',
      M1_PLACE_VALUE: 'developing',
      M2_REGROUP_ADD: 'intervention',
      M3_STORY_MATH: 'developing',
    },
    primaryMisconception: 'Glottal ending stops affecting nasalized matras.',
    actionableTip: 'Whisper-to-spoken volume bridge on vowel extension.',
  },
  {
    studentId: 'st_03',
    studentName: 'Rohan Nishad (रोहन)',
    rollNumber: 3,
    grade: 2,
    dialect: 'bhojpuri',
    currentBand: 2,
    competencies: {
      H1_LETTER_SOUND: 'proficient',
      H2_MATRA_BLENDS: 'developing',
      H3_FLUENT_READING: 'intervention',
      M1_PLACE_VALUE: 'proficient',
      M2_REGROUP_ADD: 'developing',
      M3_STORY_MATH: 'developing',
    },
    primaryMisconception: 'Arithmetic regrouping error: writes 11 in units column when 7+4=11.',
    actionableTip: 'Use 10-bundle pebble game: exchange 10 loose pebbles for 1 red stick.',
  },
  {
    studentId: 'st_04',
    studentName: 'Ananya Yadav (अनन्या)',
    rollNumber: 4,
    grade: 2,
    dialect: 'bhojpuri',
    currentBand: 3,
    competencies: {
      H1_LETTER_SOUND: 'proficient',
      H2_MATRA_BLENDS: 'proficient',
      H3_FLUENT_READING: 'proficient',
      M1_PLACE_VALUE: 'proficient',
      M2_REGROUP_ADD: 'proficient',
      M3_STORY_MATH: 'developing',
    },
    primaryMisconception: 'None currently; ready for peer captain leadership role.',
    actionableTip: 'Assign as Band 3 circle captain for choral reader circles.',
  },
  {
    studentId: 'st_05',
    studentName: 'Vikram Singh (विक्रम)',
    rollNumber: 5,
    grade: 3,
    dialect: 'maithili',
    currentBand: 3,
    competencies: {
      H1_LETTER_SOUND: 'proficient',
      H2_MATRA_BLENDS: 'proficient',
      H3_FLUENT_READING: 'proficient',
      M1_PLACE_VALUE: 'proficient',
      M2_REGROUP_ADD: 'proficient',
      M3_STORY_MATH: 'proficient',
    },
    primaryMisconception: 'Fluent in both Maithili home dialect and Standard Hindi reading.',
    actionableTip: 'Engage with contextual story math problem cards.',
  },
  {
    studentId: 'st_06',
    studentName: 'Kajal Devi (काजल)',
    rollNumber: 6,
    grade: 1,
    dialect: 'magahi',
    currentBand: 1,
    competencies: {
      H1_LETTER_SOUND: 'intervention',
      H2_MATRA_BLENDS: 'intervention',
      H3_FLUENT_READING: 'intervention',
      M1_PLACE_VALUE: 'developing',
      M2_REGROUP_ADD: 'intervention',
      M3_STORY_MATH: 'intervention',
    },
    primaryMisconception: 'Spatial letter inversion (Latin "d" drawn for "b").',
    actionableTip: 'Bat-before-ball vs Doughnut-before-stick mnemonic card.',
  },
  {
    studentId: 'st_07',
    studentName: 'Suraj Patel (सूरज)',
    rollNumber: 7,
    grade: 2,
    dialect: 'bundelkhandi',
    currentBand: 2,
    competencies: {
      H1_LETTER_SOUND: 'proficient',
      H2_MATRA_BLENDS: 'developing',
      H3_FLUENT_READING: 'intervention',
      M1_PLACE_VALUE: 'proficient',
      M2_REGROUP_ADD: 'developing',
      M3_STORY_MATH: 'developing',
    },
    primaryMisconception: 'Voiced aspirate cluster articulation.',
    actionableTip: 'Slow-motion oral syllable clapping drill.',
  },
  {
    studentId: 'st_08',
    studentName: 'Neetu Sahni (नीतू)',
    rollNumber: 8,
    grade: 3,
    dialect: 'bhojpuri',
    currentBand: 2,
    competencies: {
      H1_LETTER_SOUND: 'proficient',
      H2_MATRA_BLENDS: 'developing',
      H3_FLUENT_READING: 'developing',
      M1_PLACE_VALUE: 'proficient',
      M2_REGROUP_ADD: 'proficient',
      M3_STORY_MATH: 'developing',
    },
    primaryMisconception: 'Speed-reading phoneme skips on compound conjuncts.',
    actionableTip: 'Finger pointing under letters during paired reading.',
  },
];

// The 4 Frictionless Daily Stages (Slide 5: Users and Context Journey Map)
export const DAILY_JOURNEY_STEPS: DailyJourneyStep[] = [
  {
    stepNumber: 1,
    title: 'Ambient Oral Warm-up',
    titleHindi: 'मौखिक ध्वनि सेतु (प्रारंभिक 2 मिनट)',
    durationLabel: '2 mins (Hands-Free)',
    timeEstimateSeconds: 120,
    icon: 'Mic',
    description: 'Teacher sets phone on desk. Children recite or respond to vernacular oral prompts in home dialect. Voice AI listens ambiently without screen touching.',
    hardwareConstraint: 'Zero student hardware; runs hands-free on teacher desk.',
  },
  {
    stepNumber: 2,
    title: 'Snap & Diagnose',
    titleHindi: 'स्लेट दृष्टि निदान (त्वरित 90 सेकंड)',
    durationLabel: '90 secs (Batch Mode)',
    timeEstimateSeconds: 90,
    icon: 'Camera',
    description: 'Teacher snaps quick photos of 10-15 slates at writing practice conclusion. Vision AI diagnoses underlying cognitive misconceptions in under 60 seconds.',
    hardwareConstraint: 'Teacher smartphone camera with edge-cached batch processing.',
  },
  {
    stepNumber: 3,
    title: 'Dynamic Grouping (TaRL)',
    titleHindi: 'स्वायत्त दल विभाजन (3 मिनट)',
    durationLabel: '3 mins (3 Learning Circles)',
    timeEstimateSeconds: 180,
    icon: 'Users',
    description: 'AI instantly groups the 38 students into 3 TaRL competency circles and generates 5-minute zero-cost peer games (pebbles/sticks) for independent practice.',
    hardwareConstraint: 'Teacher gives 30-sec chalk cue on blackboard; students lead peers.',
  },
  {
    stepNumber: 4,
    title: 'Offline Auto-Sync',
    titleHindi: 'ऑफलाइन कतार व स्वतः सिंक',
    durationLabel: 'Automated Background',
    timeEstimateSeconds: 30,
    icon: 'RefreshCw',
    description: 'Progress metrics, error distributions, and BEO WhatsApp summaries are queued in local IndexedDB and sync automatically the moment 3G/4G/Wi-Fi connects.',
    hardwareConstraint: 'Works with zero internet during classroom blackouts.',
  },
];

// Full Slide Deck Content for Presentation & Evaluation (Slides 0 to 9)
export interface SlideDeckItem {
  slideNumber: number;
  slideCode: string;
  title: string;
  category: string;
  headline: string;
  keyPoints: { label: string; text: string }[];
  accentColor: string;
}

export const SLIDE_DECK_CONTENT: SlideDeckItem[] = [
  {
    slideNumber: 0,
    slideCode: 'Slide 0: Title Page',
    title: 'AksharSetu (अक्षरसेतु)',
    category: 'Title Page (Overview)',
    headline: 'Ambient Multi-Dialect Voice & Vision Pedagogical Assistant for Multigrade Foundational Classrooms',
    keyPoints: [
      { label: 'Project Name', text: 'AksharSetu (अक्षरसेतु) — The Vernacular-First FLN Assistant' },
      { label: 'Challenge Track', text: 'Classroom Complexity & Foundational Learning Interventions (FLN)' },
      { label: 'System Architect', text: 'Alok Srivastava (Lead Full Stack & System Architect) & Collaborators' },
      { label: 'Target Audience', text: 'Primary School Educators (Grades 1–3) in multigrade composite rooms (ages 5–9)' },
      { label: 'Operating Paradigm', text: '1 Single Teacher Smartphone • 100% Offline Edge Resilient • Zero Student Tablets Needed' },
    ],
    accentColor: 'amber',
  },
  {
    slideNumber: 1,
    slideCode: 'Slide 1: Problem Understanding',
    title: 'The Multigrade Trilemma',
    category: 'Problem Understanding',
    headline: 'High Dialectal Variance, Cognitive Overload, and Invisible Learning Gaps',
    keyPoints: [
      { label: 'Multigrade Disparity', text: '1 teacher manages 30–50 students across Grades 1, 2, and 3 simultaneously in a single composite hall, making individual attention nearly impossible.' },
      { label: 'Dialectal Distance', text: 'Children speak home dialects (Bhojpuri, Awadhi, Maithili, Magahi) while textbooks strictly enforce Standard Hindi/English, causing cognitive friction in phonemic acquisition.' },
      { label: 'Delayed Formative Feedback', text: 'Educators spend up to 70% of evaluation time manually checking slates for mechanical correctness rather than diagnosing underlying cognitive misconceptions.' },
      { label: 'Outcome Deficit', text: 'Without instant diagnostic visibility, learning deficits compound into permanent FLN failure before children reach Grade 3.' },
    ],
    accentColor: 'red',
  },
  {
    slideNumber: 2,
    slideCode: 'Slide 2: Proposed Solution',
    title: 'AksharSetu Core Concept',
    category: 'Proposed Solution (Part 1)',
    headline: 'The Single-Device AI Copilot for Foundational Classrooms',
    keyPoints: [
      { label: 'Single-Device Architecture', text: 'Lightweight ambient copilot running on the teacher’s single smartphone, unifying multimodal vision diagnostics with dialect-adaptive voice evaluation.' },
      { label: 'Snap & Diagnose (Vision)', text: 'Teacher captures a single snapshot of notebooks or slates. The vision agent identifies specific phonological and numerical error topologies, not binary marks.' },
      { label: 'Dialect-to-Standard Bridge', text: 'Interactive oral companion allowing children to respond in their home tongue, gently mapping phonetic variations to standard curriculum benchmarks.' },
      { label: 'Automated TaRL Micro-Grouping', text: 'Groups students into 3 dynamic learning tiers daily, generating tailored 5-minute peer-led activities to engage the room during targeted remediation.' },
      { label: 'Same-Day Remediation Loop', text: 'Shifts evaluation from delayed end-of-term exams to same-day actionable pedagogical interventions.' },
    ],
    accentColor: 'orange',
  },
  {
    slideNumber: 3,
    slideCode: 'Slide 3: Pedagogical Remediation',
    title: 'Pedagogical Remediation',
    category: 'Proposed Solution (Part 2)',
    headline: 'Transforming Raw Mistakes into Actionable Cognitive Interventions',
    keyPoints: [
      { label: 'Letter Inversions & Mirroring', text: 'Detects spatial orientation errors (confusing "b" vs "d" or "व" vs "ब") and triggers kinesthetic tracing micro-drills (sand-tray & chalk belly splits).' },
      { label: 'Place-Value Misconceptions', text: 'Recognizes regrouping/carry-over errors in single- and double-digit math, prescribing visual bead-frame (गिनाती माला) and pebble bundle prompts.' },
      { label: 'NIPUN Bharat Heatmap', text: 'Replaces rigid end-of-quarter report cards with real-time competency heatmaps aligned with national foundational stage goals (H1-H3, M1-M3).' },
      { label: 'Bilingual Instructional Scripts', text: 'Equips educators with automated bilingual instructional scripts to explain complex concepts in vernacular before transitioning to standard academic terminology.' },
    ],
    accentColor: 'emerald',
  },
  {
    slideNumber: 4,
    slideCode: 'Slide 4: Personas & Environment',
    title: 'Personas & Ground Environment',
    category: 'Users & Context (Part 1)',
    headline: 'Designed for Severe Ground Constraints — Zero Student Hardware & Spotty Connectivity',
    keyPoints: [
      { label: 'Teacher Persona: Suman Devi', text: 'Primary School Teacher managing Grades 1 and 2 in a single composite room. Uses a mid-range Android phone with intermittent 3G/4G connectivity; zero time for admin paperwork.' },
      { label: 'Learner Persona', text: 'First-generation rural school goers with rich verbal dialect vocabulary, limited print exposure at home, and zero personal screen access.' },
      { label: 'Hardware Limit', text: 'Strictly 1 smartphone per classroom (owned by the educator); students never need personal tablets or laptops.' },
      { label: 'Network Reality', text: 'Frequent cellular blackouts during school hours; full offline operational resilience with asynchronous edge sync.' },
      { label: 'Acoustic Resilience', text: 'Engineered for high ambient rural classroom chatter with robust phoneme isolation.' },
    ],
    accentColor: 'blue',
  },
  {
    slideNumber: 5,
    slideCode: 'Slide 5: Users Journey Map',
    title: 'Daily Classroom Workflow',
    category: 'Users & Context (Part 2)',
    headline: 'Frictionless Daily Workflow in 4 Simple Stages',
    keyPoints: [
      { label: 'Stage 1: Ambient Oral Warm-up', text: 'Teacher places phone on desk; children recite or respond to dialect oral prompts (2 mins hands-free).' },
      { label: 'Stage 2: Snap & Diagnose', text: 'Teacher snaps photos of 10-15 slates at the end of writing practice (90 secs batch mode).' },
      { label: 'Stage 3: Dynamic Grouping', text: 'AI groups class into 3 competency circles; generates oral peer-games for groups (3 mins).' },
      { label: 'Stage 4: Offline Auto-Sync', text: 'Progress metrics, error patterns, and TaRL reports sync automatically once Wi-Fi/4G connects.' },
    ],
    accentColor: 'violet',
  },
  {
    slideNumber: 6,
    slideCode: 'Slide 6: Innovation & Creativity',
    title: 'Frontier AI Paradigms',
    category: 'Innovation & Creativity (Part 1)',
    headline: 'Moving Beyond Chatbots — Frontier Multimodal AI as an Ambient Co-Teacher',
    keyPoints: [
      { label: 'Diagnostic Vision (Beyond OCR)', text: 'Unlike OCR converting handwriting to flat text, our model reasons over raw image pixels to detect motor-skill development, stroke directionality, and spatial confusion.' },
      { label: 'Phonetic Distance Modeling', text: 'Employs speech alignment to calculate dialect-to-standard phonetic distance, enabling affirming corrective feedback without penalizing regional pronunciations.' },
      { label: 'Sub-Prompt Pedagogical Coach', text: 'Leverages frontier reasoning capabilities to act as an on-device instructional coach, formulating individualized lesson interventions on the fly.' },
    ],
    accentColor: 'indigo',
  },
  {
    slideNumber: 7,
    slideCode: 'Slide 7: Competitive Differentiation',
    title: 'Competitive Differentiation',
    category: 'Innovation & Creativity (Part 2)',
    headline: 'Substantial Value Leap Over Existing EdTech Solutions',
    keyPoints: [
      { label: 'Zero Student Hardware', text: 'Unlike tablet-lab BYOD apps costing $200/student, AksharSetu operates on the single phone the teacher already owns.' },
      { label: 'Dialect Inclusivity', text: 'Existing apps enforce rigid standard language; AksharSetu embraces 7+ vernacular dialects as pedagogical bridges.' },
      { label: 'Handwriting Misconception Diagnostics', text: 'Moves beyond binary multiple-choice quizzes to deep diagnostic error topology on actual physical chalk slates.' },
      { label: 'TaRL Classroom Orchestration', text: 'Specifically designed for multigrade rooms by orchestrating peer-circle rotations rather than isolating individual screen users.' },
      { label: 'Edge-First Offline Queuing', text: 'Functions seamlessly during deep-rural network outages with local storage and background queues.' },
    ],
    accentColor: 'pink',
  },
  {
    slideNumber: 8,
    slideCode: 'Slide 8: Technology & Data',
    title: 'Technology Stack & Data Feasibility',
    category: 'Technology & Data (Part 1)',
    headline: 'Resilient Architecture Engineered for Edge & Asynchronous Cloud Scalability',
    keyPoints: [
      { label: 'Vision Diagnostics', text: 'Gemini 3.8-flash / Claude 3.5 Sonnet multimodal vision pipelines analyzing slate layout and stroke directionality.' },
      { label: 'Speech Layer', text: 'Indic-tuned Whisper + Bhashini open-source speech pipelines for noise-robust vernacular speech-to-text and low-latency audio response.' },
      { label: 'Client Application', text: 'Offline-first Progressive Web App (PWA) with IndexedDB & localStorage for full offline operation.' },
      { label: 'Backend API Gateway', text: 'FastAPI / Node.js containerized microservices handling multimodal streaming and batch sync endpoints.' },
      { label: 'Queue & Caching Layer', text: 'Redis and BullMQ architecture handling background batch ingestion and deferred image evaluation.' },
    ],
    accentColor: 'teal',
  },
  {
    slideNumber: 9,
    slideCode: 'Slide 9: Safety & Roadmap',
    title: 'Data Strategy, Safety & Roadmap',
    category: 'Technology & Data (Part 2)',
    headline: 'Ethical Data Pipelines, Privacy by Design, and Phased Execution',
    keyPoints: [
      { label: 'Benchmark Datasets', text: 'Grounded in open-source foundational literacy materials (NCERT, Pratham TaRL frameworks, and state curriculum repositories).' },
      { label: 'Child Privacy Edge Shield', text: 'Fully anonymized image streams; facial features and identifying metadata stripped at device edge before cloud transit. No persistent biometric voice storage.' },
      { label: 'Build Stage (Weeks 1–3)', text: 'Core vision prompt engineering, offline storage caching, and Hindi/Bhojpuri dialect speech pipeline integration.' },
      { label: 'Pilot Validation (Weeks 4–6)', text: 'Usability field testing in selected multigrade primary classrooms to measure teacher time saved and diagnostic precision.' },
      { label: 'Scale-Out (Beyond Hackathon)', text: 'Expansion of phonetic corpora to 10+ Indic languages and district-level dashboard integrations.' },
    ],
    accentColor: 'emerald',
  },
];

