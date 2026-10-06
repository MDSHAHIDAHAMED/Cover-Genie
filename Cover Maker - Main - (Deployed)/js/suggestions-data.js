const POLYTECHNIC_INSTITUTES = [
  "Dhaka Polytechnic Institute", "Dhaka Mohila Polytechnic Institute",
  "Chittagong Polytechnic Institute", "Chittagong Mohila Polytechnic Institute",
  "Rajshahi Polytechnic Institute", "Rajshahi Mohila Polytechnic Institute",
  "Khulna Polytechnic Institute", "Khulna Mohila Polytechnic Institute",
  "Mymensingh Polytechnic Institute", "Sylhet Polytechnic Institute",
  "Barisal Polytechnic Institute", "Rangpur Polytechnic Institute",
  "Comilla Polytechnic Institute", "Bogura Polytechnic Institute",
  "Pabna Polytechnic Institute", "Faridpur Polytechnic Institute",
  "Jashore Polytechnic Institute", "Kushtia Polytechnic Institute",
  "Dinajpur Polytechnic Institute", "Tangail Polytechnic Institute",
  "Feni Polytechnic Institute", "Feni Computer Institute",
  "Graphic Arts Institute", "Institute of Glass & Ceramics",
  "Bangladesh Survey Institute", "Bangladesh Sweden Polytechnic Institute",
  "Barguna Polytechnic Institute", "Bhola Polytechnic Institute",
  "Brahmanbaria Polytechnic Institute", "Chandpur Polytechnic Institute",
  "Chapainawabganj Polytechnic Institute", "Cox's Bazar Polytechnic Institute",
  "Gopalganj Polytechnic Institute", "Habiganj Polytechnic Institute",
  "Jhenaidah Polytechnic Institute", "Kishoreganj Polytechnic Institute",
  "Kurigram Polytechnic Institute", "Lakshmipur Polytechnic Institute",
  "Magura Polytechnic Institute", "Moulvibazar Polytechnic Institute",
  "Munshiganj Polytechnic Institute", "Naogaon Polytechnic Institute",
  "Narsingdi Polytechnic Institute", "Patuakhali Polytechnic Institute",
  "Satkhira Polytechnic Institute", "Shariatpur Polytechnic Institute",
  "Sherpur Polytechnic Institute", "Sirajganj Polytechnic Institute",
  "Thakurgaon Polytechnic Institute",
  "Ahsanullah Institute of Technical and Vocational Education and Training",
  "National Polytechnic Institute", "Shyamoli Ideal Polytechnic Institute",
  "Daffodil Polytechnic Institute", "Mirpur Polytechnic Institute",
  "Uttara Polytechnic Institute", "Haji Abul Hossain Institute of Technology",
  "City Polytechnic Institute", "Islamia Bank Institute of Technology",
  "Mangrove Institute of Science and Technology", "Desh Polytechnic College",
  "National Institute of Engineering & Technology"
];
const PUBLIC_UNIVERSITIES = [
  "University of Dhaka", "Bangladesh University of Engineering & Technology (BUET)",
  "Jahangirnagar University", "Rajshahi University", "University of Chittagong",
  "Khulna University", "Shahjalal University of Science & Technology (SUST)",
  "Bangladesh Agricultural University (BAU)", "Sher-e-Bangla Agricultural University",
  "Chittagong University of Engineering & Technology (CUET)",
  "Rajshahi University of Engineering & Technology (RUET)",
  "Khulna University of Engineering & Technology (KUET)",
  "Dhaka University of Engineering & Technology (DUET)", "Jagannath University",
  "Islamic University Bangladesh", "Comilla University",
  "Noakhali Science & Technology University", "Jatiya Kabi Kazi Nazrul Islam University",
  "Begum Rokeya University Rangpur", "Bangladesh University of Professionals (BUP)",
  "Bangladesh University of Textiles (BUTEX)", "University of Barishal",
  "Pabna University of Science and Technology", "Jessore University of Science and Technology",
  "Mawlana Bhashani Science & Technology University",
  "Hajee Mohammad Danesh Science & Technology University",
  "Patuakhali Science and Technology University",
  "Chittagong Veterinary and Animal Sciences University", "Sylhet Agricultural University",
  "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
  "Bangabandhu Sheikh Mujibur Rahman Agricultural University",
  "Bangabandhu Sheikh Mujibur Rahman Science & Technology University",
  "National University", "Bangladesh Open University", "Islamic Arabic University",
  "Military Institute of Science and Technology (MIST)",
  "Bangabandhu Sheikh Mujibur Rahman Maritime University",
  "Bangabandhu Sheikh Mujibur Rahman Aviation and Aerospace University",
  "Rabindra University Bangladesh", "Sheikh Hasina University",
  "Bangamata Sheikh Fojilatunnesa Mujib Science and Technology University",
  "Khulna Agricultural University", "Chandpur Science and Technology University",
  "Hobiganj Agricultural University", "Kurigram Agricultural University",
  "Sunamganj Science and Technology University"
];
const PRIVATE_UNIVERSITIES = [
  "North South University", "BRAC University",
  "Ahsanullah University of Science and Technology",
  "American International University-Bangladesh", "East West University",
  "Independent University Bangladesh", "United International University",
  "Daffodil International University", "Dhaka International University",
  "University of Asia Pacific", "University of Liberal Arts Bangladesh",
  "Bangladesh University of Business and Technology",
  "International University of Business Agriculture and Technology",
  "Stamford University Bangladesh", "Southeast University", "Green University of Bangladesh",
  "State University of Bangladesh", "Eastern University",
  "University of Information Technology & Sciences", "Northern University Bangladesh",
  "Primeasia University", "Prime University", "Asia Pacific University",
  "World University of Bangladesh", "City University", "Victoria University of Bangladesh",
  "Manarat International University", "Shanto-Mariam University of Creative Technology",
  "Asa University Bangladesh", "Atish Dipankar University of Science and Technology",
  "International Islamic University Chittagong", "Premier University Chittagong",
  "Leading University Sylhet", "Metropolitan University Sylhet",
  "Varendra University Rajshahi", "Port City International University Chittagong",
  "BGMEA University of Fashion & Technology", "Notre Dame University Bangladesh",
  "Gono Bishwabidyalay", "Bangladesh Army University of Engineering & Technology",
  "Bangladesh Army University of Science and Technology",
  "Bangladesh Army International University of Science and Technology",
  "Canadian University of Bangladesh", "European University of Bangladesh",
  "Sonargaon University", "Uttara University", "Royal University of Dhaka",
  "Central Women's University", "Asian University of Bangladesh",
  "Peoples University of Bangladesh", "University of Development Alternative"
];
const WORLD_UNIVERSITIES = [
  "Massachusetts Institute of Technology (MIT)", "Harvard University", "Stanford University",
  "California Institute of Technology (Caltech)", "Princeton University",
  "University of Cambridge", "University of Oxford", "Imperial College London",
  "University College London (UCL)", "ETH Zurich", "National University of Singapore (NUS)",
  "Nanyang Technological University (NTU)", "Tsinghua University", "Peking University",
  "The University of Tokyo", "University of Melbourne", "University of Toronto"
];
const UNIVERSITIES = [
  ...POLYTECHNIC_INSTITUTES,
  ...PUBLIC_UNIVERSITIES,
  ...PRIVATE_UNIVERSITIES,
  ...WORLD_UNIVERSITIES
];
const DEPARTMENTS = [
  "Computer Science & Engineering (CSE)",
  "Electrical & Electronic Engineering (EEE)",
  "Business Administration (BBA)",
  "English Language & Literature (ELL)",
  "Law",
  "Architecture",
  "Pharmacy",
  "Civil Engineering (CE)",
  "Textile Engineering (TE)",
  "Journalism & Mass Communication (JMC)",
  "Public Health (PH)",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biochemistry",
  "Microbiology",
  "Biology",
  "Economics",
  "Accounting",
  "Finance",
  "Marketing",
  "Management",
  "Computer Science (CS)",
  "Information Technology (IT)",
  "Software Engineering (SWE)",
  "Electrical Engineering (EE)",
  "Electronic Engineering (EE)",
  "Mechanical Engineering (ME)",
  "Industrial Engineering (IE)",
  "Environmental Science (ES)",
  "Food Science & Nutrition (FSN)",
  "Islamic Studies (IS)",
  "Bangla",
  "History",
  "Political Science (PS)",
  "Sociology",
  "Social Work (SW)",
  "Education",
  "Fine Arts (FA)",
  "Agriculture",
  "Fisheries",
  "Library & Information Science (LIS)",
  "Bachelor of Laws (LLB)",
  "Development Studies (DS)",
  "Master of Laws (LLM)"
];
const SUBJECTS_BY_DEPT = {
  CSE: [
    "Data Structures", "Algorithms", "Discrete Mathematics",
    "Database Management Systems", "Complex Variables and Transforms", "Operating Systems",
    "Computer Networks", "Software Engineering",
    "Object Oriented Programming", "Web Technologies",
    "Artificial Intelligence", "Machine Learning",
    "Digital Logic Design", "Computer Architecture",
    "Theory of Computation", "Compiler Design",
    "Mobile Application Development", "Cloud Computing",
    "Cyber Security", "Human Computer Interaction",
    "Computer Graphics", "Numerical Methods",
    "System Analysis & Design", "Project Management",
    "Advanced Programming", "Structured Programming",
    "C Programming", "Java Programming", "Python Programming",
    "Microprocessors & Assembly Language", "Computer Ethics",
    "Simulation & Modelling", "Information Systems",
    "Digital Image Processing", "Natural Language Processing",
    "Computer Vision", "Robotics", "IoT", "Blockchain",
    "Physics", "Engineering Mathematics", "Calculus",
    "Communication Skills", "Technical Writing"
  ],
  EEE: [
    "voltalic Theory", "Electrical Machines", "Power Systems",
    "Electronics I", "Electronics II", "Digital Electronics",
    "Signals and Systems", "Electromagnetic Fields",
    "Control Systems", "Microprocessors",
    "Power Electronics", "Communication Engineering",
    "VLSI Design", "Renewable Energy Systems",
    "Measurement & Instrumentation", "Solid State Devices",
    "High Voltage Engineering", "Switchgear & Protection",
    "Industrial Electronics", "Digital Signal Processing"
  ],
  BBA: [
    "Principles of Management", "Principles of Marketing",
    "Principles of Accounting", "Business Communication",
    "Business Mathematics", "Business Statistics",
    "Financial Accounting", "Managerial Accounting",
    "Cost Accounting", "Business Law", "Organizational Behavior",
    "Human Resource Management", "Operations Management",
    "Strategic Management", "Entrepreneurship",
    "International Business", "E-Commerce",
    "Consumer Behavior", "Supply Chain Management",
    "Investment Analysis", "Financial Management",
    "Corporate Finance", "Bank Management",
    "Research Methodology", "Business Ethics"
  ],
  English: [
    "Introduction to Literature", "British Literature",
    "American Literature", "World Literature",
    "Linguistics", "Phonetics & Phonology",
    "Morphology & Syntax", "Semantics & Pragmatics",
    "Literary Criticism & Theory", "Poetry",
    "Drama", "Fiction", "Creative Writing",
    "Academic Writing", "Technical Writing",
    "Research Methods", "ELT Methods",
    "Sociolinguistics", "Applied Linguistics",
    "Translation Studies", "Discourse Analysis"
  ],
  Law: [
    "Constitutional Law", "Contract Law", "Criminal Law",
    "Land Law", "Administrative Law", "Family Law",
    "International Law", "Tort Law", "Commercial Law",
    "Labour Law", "Human Rights Law", "Evidence",
    "Civil Procedure Code", "Criminal Procedure Code",
    "Jurisprudence", "Legal Drafting",
    "Alternative Dispute Resolution", "Environmental Law",
    "Intellectual Property Law", "Company Law"
  ],
  Pharmacy: [
    "Pharmaceutics", "Pharmacology", "Pharmacognosy",
    "Pharmaceutical Chemistry", "Biochemistry",
    "Microbiology", "Anatomy & Physiology",
    "Clinical Pharmacy", "Pharmaceutical Analysis",
    "Drug Delivery Systems", "Biopharmaceutics",
    "Pharmaceutical Technology", "Hospital Pharmacy",
    "Pharmaceutical Jurisprudence", "Industrial Pharmacy"
  ],
  Architecture: [
    "Architectural Design", "Building Construction",
    "History of Architecture", "Structural Systems",
    "Environmental Science & Technology",
    "Urban Design & Planning", "Interior Design",
    "Landscape Architecture", "Computer Aided Design",
    "Materials & Methods", "Professional Practice",
    "Building Services", "Thesis Project"
  ]
};
const DEPT_FULL_NAMES = (() => {
  const map = {};
  DEPARTMENTS.forEach(entry => {
    const m = entry.match(/^(.*)\s*\(([^)]+)\)$/);
    if (m && SUBJECTS_BY_DEPT[m[2].trim()]) {
      map[m[2].trim()] = m[1].trim();  
    }
  });
  return map;
})();
const DEPT_FULL_NAMES_NO_ABBR = (() => {
  const map = {};
  DEPARTMENTS.forEach(entry => {
    const m = entry.match(/^(.*)\s*\(([^)]+)\)$/);
    if (m && !SUBJECTS_BY_DEPT[m[2].trim()]) {
      map[m[2].trim().toUpperCase()] = m[1].trim(); 
    }
  });
  return map;
})();
function findDeptKey(dept) {
  if (!dept) return null;
  const keys = Object.keys(SUBJECTS_BY_DEPT);
  const stripped = dept
    .trim()
    .replace(/^(department|dept)\.?\s+of\s+/i, '')
    .replace(/\s+(department|dept)\.?$/i, '')
    .trim();
  let key = keys.find(k => k.toLowerCase() === stripped.toLowerCase());
  if (key) return key;
  const paren = dept.match(/\(([^)]+)\)/);
  if (paren) {
    const abbr = paren[1].trim();
    key = keys.find(k => k.toLowerCase() === abbr.toLowerCase());
    if (key) return key;
  }
  key = keys.find(k => new RegExp(`\\b${k}\\b`, 'i').test(dept));
  if (key) return key;
  // Compare on a normalised form: DEPT_FULL_NAMES values are mixed-case and use
  // "&", while people type lowercase "and".
  const normName = s => String(s).toLowerCase().replace(/&/g, ' and ').replace(/\s+/g, ' ').trim();
  const strippedLower = normName(stripped);
  if (strippedLower.length >= 3) {
    key = keys.find(k => {
      const full = DEPT_FULL_NAMES[k] ? normName(DEPT_FULL_NAMES[k]) : '';
      return full && (full.includes(strippedLower) || strippedLower.includes(full));
    });
    if (key) return key;
  }
  return null;
}
const STANDALONE_DEPT_NAMES = new Set([
  'bangla', 'english', 'history', 'economics', 'sociology',
  'agriculture', 'fisheries', 'mathematics', 'physics', 'chemistry',
  'accounting', 'finance', 'marketing', 'management',
  'law', 'pharmacy', 'architecture', 'education', 'biochemistry', 'microbiology', 'biology'
]);
function deriveDeptTitle(deptInput) {
  const raw = (deptInput || '').trim();
  if (!raw) return '';

  // Bangla department names follow their own convention — the department
  // word is suffixed ("<name> বিভাগ"), not prefixed the way English does
  // ("Department of <name>"). Falling through to the English logic below
  // for Bangla text produced mixed-language titles like
  // "Department of কম্পিউটার বিজ্ঞান". Trigger on the current language OR on
  // the input actually containing Bengali script, so a Bangla department
  // name is handled correctly even if state.language hasn't flipped yet.
  const hasBengaliScript = /[\u0980-\u09FF]/.test(raw);
  if ((typeof state !== 'undefined' && state.language === 'bn') || hasBengaliScript) {
    return /বিভাগ\s*$/.test(raw) ? raw : `${raw} বিভাগ`;
  }

  if (/\b(department|dept)\b/i.test(raw)) return raw;
  const isSingleWord = !/\s/.test(raw);
  if (isSingleWord && STANDALONE_DEPT_NAMES.has(raw.toLowerCase())) {
    const properCased = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    return `Department of ${properCased}`;
  }
  const parenMatch = raw.match(/\(([^)]+)\)$/);
  const abbr = parenMatch ? parenMatch[1].trim().toUpperCase() : (isSingleWord ? raw.toUpperCase() : null);
  const nameOnly = parenMatch ? raw.replace(/\s*\([^)]+\)$/, '').trim() : raw;
  if (abbr && DEPT_FULL_NAMES[abbr]) {
    const fullName = DEPT_FULL_NAMES[abbr]; 
    return `Department of ${abbr}`;
  }
  if (isSingleWord && DEPT_FULL_NAMES[raw.toUpperCase()]) {
    const fullName = DEPT_FULL_NAMES[raw.toUpperCase()];
    return `Department of ${fullName} (${raw.toUpperCase()})`;
  }
  if (abbr && DEPT_FULL_NAMES_NO_ABBR[abbr]) {
    return `Department of ${DEPT_FULL_NAMES_NO_ABBR[abbr]}`;
  }
  if (isSingleWord && DEPT_FULL_NAMES_NO_ABBR[raw.toUpperCase()]) {
    return `Department of ${DEPT_FULL_NAMES_NO_ABBR[raw.toUpperCase()]}`;
  }
  if (!isSingleWord) {
    const titled = nameOnly.replace(/\S+/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    return `Department of ${titled}`;
  }
  const letters = raw.replace(/[^A-Za-z]/g, '');
  if (letters.length > 3) {
    const isAllCaps = raw === raw.toUpperCase() && raw !== raw.toLowerCase();
    if (isAllCaps) {
      return `Department of ${raw}`;
    }
    const titled = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    return `Department of ${titled}`;
  }
  return `Department of ${raw.toUpperCase()}`;
}
function filterWithPriority(list, query, max) {
  const lq = query.toLowerCase();
  const startMatches = [];
  const midMatches = [];
  for (const s of list) {
    const idx = s.toLowerCase().indexOf(lq);
    if (idx === -1) continue;
    if (idx === 0) startMatches.push(s);
    else midMatches.push(s);
  }
  return [...startMatches, ...midMatches].slice(0, max);
}
function getCourseList() {
  const dept = (state.department || '').trim();
  const deptKey = findDeptKey(dept);
  if (deptKey) return SUBJECTS_BY_DEPT[deptKey];
  const all = Object.values(SUBJECTS_BY_DEPT).flat();
  return [...new Set(all)];
}
const COURSE_CODES_BY_DEPT = {
  CSE: [
    "0612101", "0612102", "0613101", "0613102", "0613103", "0612201", "0612202", "0612203",
    "0613201", "0613202", "0613301", "0613302", "0612502", "0613501", "0613503", "0613504",
    "0619505", "0612507", "0619518", "0688534", "0688535",
    "CSE-111", "CSE-112", "CSE-121", "CSE-122", "CSE-211", "CSE-212", "CSE-221",
    "CSE-311", "CSE-312", "CSE-321", "CSE-411", "CSE-421"
  ],
  EEE: [
    "EEE-111", "EEE-112", "EEE-121", "EEE-122", "EEE-211", "EEE-212", "EEE-213",
    "EEE-221", "EEE-223", "EEE-311", "EEE-312", "EEE-313", "EEE-321", "EEE-325",
    "EEE-411", "EEE-412", "EEE-421", "EEE-424"
  ],
  Law: [
    "LL.BH-101", "LL.BH-102", "LL.BH-103", "LL.BH-201", "LL.BH-202", "LL.BH-203",
    "LL.BH-301", "LL.BH-401", "LL.BH-403", "LL.BH-501", "LL.BH-503", "LL.BH-504",
    "LL.BH-603", "LL.BH-701", "LL.BH-801", "LL.BH-901", "LL.BH-1001", "LL.BH-1101", "LL.BH-1201",
    "LL.M. 3101", "LL.M. 3102", "LL.M. 3103", "LL.M. 3201", "LL.M. 3202", "LL.M. 3406",
    "MHRL-101", "MHRL-102", "MHRL-201", "MHRL-301", "MHRL-401"
  ],
  BBA: [
    "CCB 111", "CCB 121", "CCB 211", "CCB 221", "CCB 314", "CCB 323", "CCB 332", "CCB 333",
    "MGT 411", "MGT 412", "MGT 413", "MGT 423", "HRM 421", "HRM 422", "HRM 423",
    "MKT 421", "MKT 422", "MKT 423", "FIN 411", "FIN 413", "FIN 424",
    "BKM 421", "BKM 422", "BKM 424", "MIS 413", "MIS 414", "MIS 422"
  ]
};
const GENERAL_EDUCATION_COURSE_CODES = [
  "0231101", "0312501", "0541101",
  "GED-111", "GED-113", "GED-123", "GED-211", "GED-213", "GED-223",
  "MAT-111", "MAT-121", "MAT-211", "MAT-321", "PHY-111", "PHY-112", "CHM-311", "STA-101"
];
function getCourseCodeList() {
  const dept = (state.department || '').trim();
  const deptKey = findDeptKey(dept);
  if (deptKey && COURSE_CODES_BY_DEPT[deptKey]) {
    return [...new Set([...COURSE_CODES_BY_DEPT[deptKey], ...GENERAL_EDUCATION_COURSE_CODES])];
  }
  const all = Object.values(COURSE_CODES_BY_DEPT).flat().concat(GENERAL_EDUCATION_COURSE_CODES);
  return [...new Set(all)];
}
const DHAKA_INTL_UNIV_FACULTY_BY_DEPT = {
  CSE: [
    "Prof. Dr. A.T.M. Mahobubur Rahaman Sharker", "Mst. Jahanara Akhtar", "Dr. Md. Anisur Rahman Pramanik",
    "Dr. Sayed Ul Alam Shibly", "Sraboni Barua", "Md. Sifuzzaman", "Nazmus Sakib", "Md. Zahidul Islam",
    "Dr. Shameem Ahmed", "Jahanur Biswas", "Hemonta Kumar Barman", "Md. Rakib Hossain", "Md. Shariful Islam",
    "Nazis Sultana", "Md. Nahid Hasan", "Mir Aminul Haque", "Shifat Jahan Setu", "Sayma Sultana",
    "Md. Muksit Ul Islam", "Md. Mostafijur Rahman", "Md. Alamgir Hossain", "Paritosh Chandra Ray",
    "Aminur Rahman", "Md. Toufiqur Rahman", "Mohiuddin Hasan", "Md. Nazmus Sakib", "Bipasha Majumder",
    "Md. Maruf Bangabashi", "Golam Mahmud", "Kazi Farhan Hasan Tanjim", "Md. Marufur Rahman",
    "Mazharul Hasan", "Mobarak Hossain Al-Mamon", "Md. Shakil Sarker", "Sumaiya Tabassum",
    "Abdullah All Mamun Siam", "M. Morsedur Rahman", "Md. Arif Hossain", "Fahim Foysal Abak",
    "Md. Maruf Ahmed", "Md. Mashrur Alam", "Md. Didar Ahmed", "Umme Niraj Mahi", "Md. Manirujjaman",
    "Md. Habibul Basar Faruq", "Jayed Bin Azad", "Md. Mizanur Rahman", "Shobnom Mushtary",
    "Md. Fazle Rabbi Rizon", "Safwan Ishrak", "Sajia Akhter Airin", "Md. Mahabubur Rahman",
    "Md Manowarul Islam", "Md. Raiyanul Islam", "Saimoon Al Farshi Oman", "Rakib Mahmud",
    "Md. Ayon Mia", "Tahmid Hasan", "Bokhtiar Adil Prottoy", "Md. Amirul Hasan Shanto",
    "Anik Mahmud Shanto", "Md. Safwan Zaher Asif", "Ahmedul Kabir", "Dr. Forhad Zahid Shaikh",
    "Mohammad Samiul Haque", "Md. Abu Zafor", "Md. Fazlur Rahman"
  ],
  EEE: [
    "Ahmmad Musha", "Dr. Shafiq Aftab", "Mohammad Tareq", "Md Shafiq Uddin", "Dr. Mohammad Aasim Ullah",
    "Prof. Dr. Abdul Mannan Sardar", "Md. Rafsan Tahmid", "Sayed Hasan Murad", "Syed Abdullah Al-Nahid",
    "Tafsir Ahmed Khan", "Md. Mazidul Islam", "Sakib Ahmed", "Ashikur Islam", "Hasibul Hasan Bhuiyan Abid",
    "Mahamudul Hassan Fuad", "Rahima Nusrat Suravi", "Md. Fahid Hasan Mojumder", "Md. Biplob Hossain",
    "Numayer Andalib Zaman", "Md. Monirul Islam", "Sharika Manjuma Islam", "Mahim Al Masud",
    "Mahadi Hasan Patwary", "Fahatin Binta Faruque Maisha", "Shafin Shadman Ahmed", "Shagor Hasan",
    "Mahmudul Hassan", "Avishek Das", "Md. Sadman Sakib Chowdhury Manjur", "Tasnia Akter Tanni",
    "Sawrav Das", "Ajmal Ahmed", "Ibne Hasan Emon", "Md. Aminul Islam", "Nobonita Chakarvarty",
    "Md. Abdullah Al Noman"
  ],
  BBA: [
    "Md. Azmir Hossain", "Md. Rofiqul Islam", "Md. Siddique Alam Khan", "Md. Ruhul Amin",
    "Md. Bazlur Rahman", "Rabeya Sarker", "Sohag Datta", "Bushra Ferdousi", "Mohammad Rezaur Rahman",
    "Swadrul wola Choudhury", "Hasina Parvin Jolly", "Sadia Mahjabeen", "Sayma Sharmen",
    "Afrin Rahman Mili", "Tahmina Akter Arzin", "Md. Noyan Hossain", "Md. Mahedi Hasan",
    "Md. Shahriya Mannan", "Sharmin Akter", "Prof. Md. Salim Bhuiyan", "Md. Jahidul Kabir",
    "Umma Salma Tama", "Md. Taufiq Anam", "Tarjina Kulsum Akhey", "Rupa Akter"
  ],
  English: [
    "Professor Dr. Md. Sazzad Hossain", "Arif Ahmad", "Mohammad Shah Alam Chowdhury",
    "Prof. Dr. Md. Abul Kalam Azad", "Mili Rahman", "Md. Atiqur Rahman Mamun", "Ms. Tahmina Sultana",
    "Md. Anisor Rahman", "Md. Shahriar Mahmud Rakib", "Ali Akber", "Amena Begum", "Mainul Islam",
    "Arko Halder", "Tasnim Jahan", "Rashed Mahmud", "Samiha Anwar", "Sadia Ferdous", "Md. Fozle Rabbi",
    "Tasnim Jarin", "Sanjida Abedin Rafha", "Mahima Akhter Addrita", "Iffat Binte Mizan (Shukti)",
    "Nishat Tarannum", "Nafia Tabassum", "Md. Redwan Islam", "Umamah Manal Mahmood", "Diptaa Biswas"
  ],
  Law: [
    "Prof. Dr. Abdullah-Al-Monzur Hussain", "Nasir Ahmad", "Dr. Uttam Kumar Das", "Mrs. Mily Sultana",
    "Md. Raisul Islam Sourav", "Roksana Akter", "Mrs. Sunita Rani Biswas", "Mrs. Sharmin Sultana",
    "Mobarak Hossain", "Imtiaz Ahmed Sajal", "Shahriar Mahmud Minar", "Md Riad Arefin",
    "Md. Arafat Hossain", "Md. Abdur Rahim", "Adv. Kamruzzaman Bhuiyan", "Shehabul Islam",
    "Shahidul Islam", "Md. Arif Rabbani Khan", "Mahbub Alam", "Nusrat Jahan Panna",
    "Md. Ziaur Rahman", "Habibur Rahman Rifat", "Professor Dr. Muhammad Mahbubur Rahman",
    "Nusrat Jahan Urmi", "Dr. Mohammad Shahjahan"
  ],
  Pharmacy: [
    "Md. Akbar Hossain", "Amir Hossain", "Sharmistha Das", "Md. Mahadi Hasan", "Farhana Rahman Trisha",
    "Shahenul Islam", "As-Sazzad Mahmud", "Progga Paramita Paul", "Md. Hamedul Islam", "Adiba Firuj",
    "Tasnim Shammi", "Md. Mizanur Rahman", "Khadija Akhter Poly", "Rana Ahmed", "Rafat Hossain Rafi",
    "Sazzad Mahmud", "Professor Dr. Md. Abdul Muhit", "Dr. Shimul Halder", "Professor Dr. Md. Shah Amran"
  ],
  Civil: [
    "S M Sazzad Ahmed Shovon", "Dr. Md. Serajul Islam Prodhan", "Omar Faruk", "Monica Rani Das",
    "Md. Saniul Haque Mahi", "Md. Abul Hasanath", "Abdul Awol Rabby", "Md. Sajid Shahriar",
    "Md. Moniruzzaman Saukhin", "Azmaeen Rahman Abhra", "Md. Jaber Hossain", "Samira Jarin Khan",
    "Md. Humayun Mahmood", "Tanjun Ashravi Ridoy", "Maruf Hossain Hredoy", "Md. Rakibul Islam",
    "Imon Hasan Bhuiyan", "Md. Ashaduzzaman Rakib", "Supriya Roy", "Arjun Chandra Biswas",
    "Araf Mahmud", "Sumiya Akter Ramin", "Tanjir Ahmed", "Abhijit Nath Abhi",
    "Nazmul Hasan Khan Zimi", "Towhidul Islam", "Muhtasim Shahriar Mostafa", "Sonjoy Halder",
    "Md. Shaim Mahfuz", "Tasnia Tabassum Anika", "Md. Asif", "Nazmin Akter", "Rokeya Akter",
    "Gobinda Kirtonia", "Mohammad Abid Hasan", "Imran Md. Azizul Islam", "Mahibul Taohid Aditya",
    "Abhijeet Debnath Abhi", "Md. Shahadat Hossain", "Md. Obaedullah", "Robiul Islam",
    "Nusrat Jahan", "Md. Abir Uddin", "Mohammad Monzur Morshed", "Pranta Roy", "Tonmoy Paul"
  ],
  Microbiology: [
    "Dr. Md. Asaduzzaman Shishir", "Taslima Akter Tisha", "Shamim Khandaker", "Alfi Anjum Rashid",
    "S M Syed Muktadir Turzo", "Jubayer Ahmed", "Shoriful Islam Antar"
  ],
  BMB: [
    "Dr. Tania Mannan", "Dr. Momotaj Jahan", "Dr. Amelia Ferdaus Sara", "Md. Shameem Ali",
    "Ovi Sikder", "Md. Shahed Alam", "Md. Rubiath Islam", "Dr. Most Umme Habiba",
    "Md. Rejaul Islam", "Zitu Barman"
  ],
  PoliticalScience: [
    "Mohammad Mehedi Hasan", "Md. Fazlul Haque", "Professor Dr. Md. Nurul Amin Bepari",
    "Dr. Abdul Latif Masum", "Dr. Md. Shariful Alam", "Sanjida Afroze", "Doel Akter",
    "Asaduzzaman", "Fahim Ahmed Emon", "Md. Jahid Hashan", "Md. Yousuf Ali", "Sahabuddin Ahmed",
    "Mujahidul Islam", "Salima Jannath Lyra", "Sabina Yasmin Surjamokhey", "Dola Das", "Falguni Halder"
  ],
  Sociology: [
    "Tanjila Shabnam", "Abdur Rahim Mollah", "Jamsedur Rahman", "Tahmina Khan", "Dr. Moshfeka Khatun",
    "Md. Nasimuzzaman Khan", "Md. Touhiduzzaman", "Bushra Islam", "Md. Sohel Rana", "Tanjuma Mohima",
    "Farhana Islam", "Rokeya Parvin", "Kamrunnahar Koli", "Farhana Yasmin", "Sharmin Sultana"
  ],
  Economics: [
    "Shamima Akter", "Saikat Pande", "Sojib Bhawmick", "Naorin Afroz", "Mostafa Monir",
    "Md. Abu Noman", "Syeda Maria", "Kazi Farida Parvin", "Md. Anowar Hossain", "Dr. Md. Abu Raihan",
    "Professor Dr. Md. Nazmus Sadekin", "Md. Alauddin", "Dr. Ahsan Ullah", "Dr. Foyasal Khan",
    "Mohammad Iftekharul Islam", "Marium Binte Aziz"
  ],
  DevelopmentStudies: [
    "Dr. Shamim Hamide", "Janifar Alam", "Md. Nazmul Huda"
  ]
};
const NSU_FACULTY_BY_DEPT = {
  CSE: [
    'Dr. Nova Ahmed', 'Dr. Sumaiya Tabassum Nimi',
    'Dr. Mohammad Faqrul Alam Chowdhury', 'Ms. Silvia Ahmed', 'Mr. Iqbalur Rahman Rokon'
  ],
  EEE: [
    'Dr. Rajesh Palit', 'Dr. Mohammad Abdul Matin', 'Dr. Shazzad Hossein',
    'Dr. Atiqur Rahman', 'Dr. Kazi Md. Rokibul Islam'
  ],
  CEE: [
    'Dr. Md. Shoaib Chowdhury', 'Dr. Javed Bari', 'Dr. Nadir Yilmaz', 'Dr. Sirajul Islam'
  ],
  ARCH: [
    'Dr. Saiful Islam', 'Mr. Mujtaba Ahsan', 'Ms. Shaila Joarder', 'Mr. Ishtiaque Zahir Titas'
  ],
  DMP: [
    'Dr. Md. Mamun Molla', 'Dr. Subir Chandra Das', 'Dr. Syed Hasibul Hasan Chowdhury'
  ],
  ACT: [
    'Dr. Sharif Nurul Ahsan', 'Dr. Md. Mohammad Tayeenul Hoque', 'Dr. Tamgid Ahmed Chowdhury'
  ],
  MGT: [
    'Dr. Helal Ahammad', 'Dr. Md. Mamun Habib', 'Dr. Norman K. Swazo'
  ],
  MKT: [
    'Dr. Mahmud Hassan', 'Dr. Mohammad Abdul Momen', 'Dr. Farhana Zahir'
  ],
  ECO: [
    'Dr. M. Ismail Hossain', 'Dr. A.K.M. Atiqur Rahman',
    'Dr. Asaduzzaman', 'Dr. Tapas Kumar Biswas'
  ],
  ENG: [
    'Dr. Aqeel Khan', 'Dr. Deena P. Vera', 'Dr. AQMA Rahman Bhuiyan', 'Mr. Shafqath Rabbee'
  ],
  LAW: [
    'Dr. Md. Rizwanul Islam', 'Dr. Arafat Hosen Khan', 'Ms. Nasrin Akter'
  ],
  PSS: [
    'Dr. Sk. Tawfique M. Haque', 'Dr. Mahbubur Rahman', 'Dr. Helal Mohd. Mohiuddin'
  ],
  HIS: [
    'Dr. Norman K. Swazo', 'Dr. Sharif Uddin Ahmed', 'Dr. Md. Towhidul Islam'
  ]
};
const BRAC_UNIV_FACULTY_BY_DEPT = {
  CSE: [
    "Dr. Mahbubul Alam Majumdar", "Dr. Sadia Hamid Kazi", "Dr. Mohammad Kaykobad",
    "Dr. Chowdhury Mofizur Rahman", "Dr. Matin Saad Abdullah", "Dr. Md. Khalilur Rahman",
    "Dr. Md. Golam Rabiul Alam", "Dr. Md Sadek Ferdous", "Dr. Amitabha Chakrabarty",
    "Dr. Farida Chowdhury", "Dr. Swakkhar Shatabda", "Dr. Taiabul Haque",
    "Md. Shafiul Alam", "Abu Mohammad Khan", "Dr. Muhammad Nur Yanhaona",
    "Dr. Md. Ashraful Alam", "Dr. Muhammad Iqbal Hossain", "Dr. Farig Yousuf Sadeque",
    "Dr. Md. Sakir Hossain", "Dr. Aniqua Nusrat Zereen", "Mr. Annajiat Alim Rasel",
    "Md. Akhtaruzaman Adnan", "Ms. Mehnaz Seraj", "Sowmitra Das",
    "Najeefa Nikhat Choudhury", "Mahrin Tasfe", "Mr. Md. Tanzim Reza",
    "Dibyo Fabian Dofadar", "Mr. Zaber Mohammad", "Md Arif Hasan",
    "Ashraful Islam Shanto Sikder", "Ummay Maria Muna", "Mohammad Naveed Hossain",
    "Aniqa Tabassum", "Ayman Rasheed", "Atanu Roy", "Mohammed Ashfaqul Haque",
    "Ateya Ahmed Subarna", "Faria Binta Awal", "Avinandan Banerjee",
    "Ariyan Hossain", "Mohammad Badrul Hossain", "Muhammad Ehsanul Kader",
    "Ehtashamul Haque", "Farden Ehsan Khan", "Md. Fatin Ishraq Faruqui",
    "Md. Fakhruddin Gazzali", "Fatiha Ishrar Chowdhury", "Fardin Zubair Nafis",
    "Mr. Sheikh Araf Noshin", "Tanhiat Fatema Afnan", "Lara Khanom",
    "Majisha Jahan Disha", "Mir Hamidul Hussain", "Ipshita Bonhi Upoma",
    "Utsha Kumar Roy", "Abdullah Nayem Wasi Emran", "Ahmad Farhan Shahriar Chowdhury",
    "Md. Rifat Rahman", "Asif Hasan Chowdhury", "Md. Zulkar Naim",
    "Tanveer Rahman", "Md. Khaliduzzaman Khan Samrat", "Kaniz Fatema Supti",
    "Kabbya Kantam Patwary", "Ms. Khondoker Nazia Iqbal", "Kazi Kamruzzaman Rabbi",
    "Labib Hasan Khan", "Marshia Nujhat", "Sabiha Hasan Mim",
    "Mohammad Fahim", "Mehedi Hasan Emo", "Anindita Labonno"
  ],
  BBS: [
    "Dr. Mohammad Mujibul Haque", "Dr. M A Taher", "Dr. Shamim Ahmed Khan",
    "Syeda Shaharbanu Shahbazi", "Mohammad Baijed", "K.M. Wahiduzzaman Fahad",
    "Dr. Tahrima Ferdous", "Dr. Md. Zahurul Haq", "Dr. Taslima Jannat",
    "Dr. Md Shah Newaz", "Dr. Easnin Ara", "Dr. Md Nurul Islam Sohel",
    "Dr. M. Fouzul Kabir Khan", "Dr. Muhammad Hasibul Hasan", "Dr. A.B.M. Md. Azizul Islam",
    "Dr. Salehuddin Ahmed", "Dr. Mohammad Abdul Hoque", "Dr. Sebastian Groh",
    "Dr. Syed Mahbubur Rahman", "Dr. Abu Reza Mohmmad Islam", "Dr. Md Mahmudul Alam",
    "Dr. Mohammad Rabiul Basher Rubel", "Dr. Suman Paul Chowdhury", "Dr. Zaheed Halim",
    "Dr. Nitai Chandra Debnath", "Dr. Muhommad Azizur Rahman", "Ms. Rifat Iqbal",
    "K. M. Azwad Hossain", "Ruhan Habib", "Mirza Abdullah Al Noman", "Nafis Faisal"
  ],
  EEE: [
    "Dr. Md. Mosaddequr Rahman", "Dr. Shahidul Islam Khan", "Dr. Md. Hassan Kafi",
    "Dr. Taufiq Ismail", "Dr. AKM Abdul Malek Azad", "Dr. Mohammad Zoynal Abedin"
  ],
  ENH: [
    "Dr. Firdous Azim", "Dr. Nahid Afrose Kabir", "Dr. Asifa Sultana",
    "Dr. Sabiha Huq", "Dr. Md Al Amin", "Dr. Sabreena Ahmed",
    "Dr. Tabassum Zaman", "Dr. Mahruba Mowtushi", "Dr. Gazi Md Mizanur Rahman",
    "Dr. Asif Iqbal", "Roohi Andalib Huda", "Dr. Syeda Farzana Sultana",
    "Rukhsana Rahim Chowdhury", "Salma Khan", "Mohammad Zaki Rezwan",
    "Nazah Farhat", "Lubaba Sanjana", "Samirah Tabassum", "Nawshaba Ahmed",
    "Anika Saba", "Seema Nusrat Amin", "Jahin Kaiissar", "Atiya Tafannum",
    "Sumaiya Tasnim", "Shakika Rubaiat", "Khondker Shahad Muktadir",
    "Kanij Fatema", "Anmana Manishita", "Joutha Monisha", "Md. Arifujjaman Babu", "Ayesha Jahan"
  ],
  ESS: [
    "Dr. Muhammad Wasiqur Rahman Khan", "Dr. Farzana Munshi", "Dr. Adnan Haque",
    "Dr. Shahidur Rahman", "Dr. Seuty Sabur", "Dr. S M Chaudhury"
  ],
  Pharmacy: [
    "Dr. Sharmind Neelotpol", "Dr. Raushanara Akter", "Dr. Eva Rahman Kabir",
    "Dr. Mesbah Talukder", "Dr. Hasina Yasmin", "Dr. Muhammad Asaduzzaman",
    "Dr. Farhana Alam Ripa", "Dr. Mohd. Raeed Jamiruddin", "Dr. Afrina Afrose",
    "Dr. Md. Aminul Haque", "Dr. Md. Rabiul Islam", "Dr. Humair Bin Md Omer",
    "Dr. Nishat Zareen Khair", "Dr. Zara Sheikh", "Dr. Md. Moniruzzaman",
    "Ashis Kumar Podder", "Md. Tanvir Kabir", "Mohammad Kawsar Sharif Siam",
    "Namara Mariam Chowdhury", "Tanisha Tabassum Sayka Khan", "Tanisha Momtaz",
    "Luluel Maknun Fariha", "Nashrah Mustafa", "Mehedi Islam",
    "Eshaba Karim", "Mushtahsin Ferdousi", "Galib Muhammad Abrar Ishtiaque",
    "Asef Raj", "Nushrat Alam", "Kazi Milenur Rahman Prattay",
    "Mehrin Haque Tanisha", "Fazle Rabbi"
  ],
  Architecture: [
    "Dr. Fuad Hassan Mallick", "Dr. Zainab Faruqui Ali", "Dr. Huraera Jabeen",
    "Dr. Imon Chowdhoory", "Mohammad Habib Reza"
  ],
  MNS: [
    "Dr. Md. Firoze Hassanul Haque", "Dr. Aparna Islam", "Dr. Iftekhar Bin Naser",
    "Dr. Nadia Sultana Deen", "Dr. Mahboob Hossain", "Dr. Md. Hasibun Naher"
  ],
  Law: [
    "Dr. Khondker Shamsuddin Mahmood", "Dr. Saira Rahman Khan", "Dr. K. Shamsuddin Mahmood",
    "Mostafa Mahmud Naser"
  ]
};
const SOUTHEAST_UNIV_FACULTY_BY_DEPT = {
  CSE: [
    "Prof. Dr. Engineer M. M. Shahidul Hassan", "Dr. Shahriar Shahabuddin",
    "Md. Monirul Islam", "Syed Mohammad Khaled", "S.M. Aminul Haque",
    "Md. Ashraful Chowdhury", "Ms. Kaniz Fatema", "Md. Abdul Latif",
    "Ferdousi Ara Sabrina", "Niaz Arefin", "Naznin Sultana", "Md. Shamsur Rahman"
  ],
  EEE: [
    "Prof. Dr. Engr. Muhibul Haque Bhuyan", "Dr. Md. Rafiqul Islam",
    "Md. Saifur Rahman", "Rashida Akter", "S.M. Rashedul Islam"
  ],
  Textile: [
    "Prof. Dr. ANM Ahmed Ullah", "Prof. Dr. Syed Atiqur Rahman",
    "Md. Al-Amin", "Engr. Md. Shamsuzzaman", "Engr. Rokonuzzaman"
  ],
  Architecture: [
    "Ar. Farhana Yeasmin", "Ar. Mohammad Sajjad Hossain", "Ar. Naimul Ahsan"
  ],
  BBA: [
    "Prof. Dr. S.M. Ikhtiar Alam", "Dr. Serajul Islam", "Md. Abdul Momen",
    "Dr. Farhana Ferdousi", "Kazi Mohammad Tariq", "Sheikh Majedul Huq", "Fahmida Hossain"
  ],
  English: [
    "Prof. Dr. Md. Absar Ali", "Dr. Shamsad Mortuza", "Ms. Sadia Afreen",
    "Md. Rashidul Hasan", "Ms. Dilrose Barua", "Nazneen Sultana"
  ],
  Law: [
    "Prof. Dr. Md. Shahjahan", "Md. Jahid Hossain", "Mrs. Syeda Pinky Sarwar",
    "Md. Mobarak Hossain", "Nusrat Jahan"
  ],
  Pharmacy: [
    "Prof. Dr. Md. Siddiqul Islam", "Dr. Hasina Yasmin", "Md. Abdur Rahman",
    "Sultana Rajia", "Farzana Alam"
  ]
};
const CITY_UNIV_FACULTY_BY_DEPT = {
  CSE: [
    "Brig Gen Prof. Dr. Engr Md Lutfor Rahman (Retd)", "Engr S M Anisur Rahman",
    "Sharmin Akter", "Md Ataullah Bhuiyan", "Sabbir Hossen", "Md. Showrov Hossen",
    "Ahsan Habib", "Faria Rahman Annasha", "Nazneen Islam", "Al Amin Mridha",
    "Shikha Moni", "Md. Ajharul Islam Miraj", "Sraboni Ghosh Joya",
    "Maysha Fhamida Bristy", "Mehedi Hasan", "Labiba Tasfiya Jeba",
    "Debobrata Chakraborty", "Tanima Chowdhury", "Soumitra Bhowmik", "Rafia Sultana"
  ],
  EEE: [
    "Shayan Rana", "Sharifa Akter Rukaia", "Sumaiya Nazmi"
  ],
  BBA: [
    "Zulfiqar Hasan", "Zahidur Rahman", "Khondokar Jilhajj"
  ],
  English: [
    "Dr. Rahman M. Mahbub", "Dr. Aniruddha Kahali", "Dr. Laizu Nasrin",
    "Samsunnahar Lina", "Fahmida Jabin", "Md. Solaiman", "Md. Elius Hossain", "Rabby Imam"
  ],
  Law: [
    "Zakaria Gazi", "Al Amin", "Sheikh Md. Mozammel Haque",
    "Abdullah Al Mamun", "Ananda Paul", "Md Meherab Hossen", "M. M. Shahedur Rahman Shanto"
  ]
};
const BU_FACULTY_BY_DEPT = {
  CSE: [
    "Mahmud Naeem", "Md Tariqul Islam", "Md. Ibrahim Hosen Sojib",
    "Md. Mesbahuddin Hasib", "Md. Rakibul Hasan", "Md. Riaz Uddin",
    "Md. Rifat-Uz-Zaman", "Md. Mamun"
  ],
  EEE: [
    "S.M. Ashraful Alam", "Md. Mehedi Hasan", "Md. Shahinur Islam",
    "Md. Robiul Islam"
  ],
  BBA: [
    "Dr. Gazi Md. Abu Issa Nur", "Afsana Tajnin", "Md. Hasan Talukdar",
    "Md. Mokshud Ali", "Md. Nafiul Karim", "Md. Tuhin Hussain",
    "Mohammad Nesar Uddin", "Monika Mehjabeen Tisha"
  ],
  English: [
    "Mohammad Humayun Kabir", "Debdas Biswas", "Dr. Md Nesar Uddin",
    "Farah Diba Yasmin", "Tanziri Jahan", "Rifah Tasnia",
    "Shayeka Laolak", "Shobita Yesmin"
  ],
  Law: [
    "Kazi Latifur Reza", "Md. Mostofa", "Kaniz Tania Bint-E-Basar",
    "Mitali Rani Das", "Kazi Sonia Tasnim", "Md. Al-Amin",
    "Md. Razeul Alim", "Tanvir Hossain"
  ],
  Pharmacy: [
    "Abul Kalam Azad", "Tawhida Akter", "Tonima Enam",
    "Dr. S. M. Abdur Rahman", "Dr. Md. Ruhul Kuddus",
    "Fahamida Binta Anower", "Fatema Akhter", "Sabiha Khatun Urmy"
  ],
  Architecture: [
    "Ar. Dr. Nurur Rahman Khan", "Shamsul Wares", "Ar. Iqbal Habib",
    "Ar. Sheikh Itmam Soud", "Ar. Khandoker Tariqul Islam",
    "Ar. Farahnaz Khadiza Chowdhury"
  ]
};
// SIPI = Shyamoli Ideal Polytechnic Institute. "All Department" faculty from
// the source list are appended to every department below, since they teach
// across departments rather than belonging to just one.
const SIPI_FACULTY_BY_DEPT = {
  Textile: [
    "Sadia Afrin", "Nurul Islam Mohon", "Shah Jamal Khan", "Hosne Ara"
  ],
  CST: [
    "Polash Chandra Biswas", "Masud Rana", "Shahinul Islam", "Nurul Islam Mohon", "Shah Jamal Khan", "Hosne Ara"
  ],
  Electrical: [
    "Momtajul Billah", "Nurul Islam Mohon", "Shah Jamal Khan", "Hosne Ara"
  ],
  Electronics: [
    "Roli Rani Sarkar", "Nurul Islam Mohon", "Shah Jamal Khan", "Hosne Ara"
  ],
  Mechanical: [
    "Bokhtiar Hossain", "Nurul Islam Mohon", "Shah Jamal Khan", "Hosne Ara"
  ],
  Civil: [
    "Rakib Hossain", "Nurul Islam Mohon", "Shah Jamal Khan", "Hosne Ara"
  ],
  Architecture: [
    "Sajiya Afrin Nahar", "Nurul Islam Mohon", "Shah Jamal Khan", "Hosne Ara"
  ],
  Automobile: [
    "Rasel Haque Sabuj", "Nurul Islam Mohon", "Shah Jamal Khan", "Hosne Ara"
  ],
  GraphicDesign: [
    "Shumi Sharma Mou", "Nurul Islam Mohon", "Shah Jamal Khan", "Hosne Ara"
  ],
  RAC: [
    "Monir Hossain", "Nurul Islam Mohon", "Shah Jamal Khan", "Hosne Ara"
  ]
};
const BUBT_FACULTY_BY_DEPT = {
  CSE: [
    "Prof. Dr. Md. Ahsan Habib", "Dr. Khandoker Nadim Parvez",
    "Md. Saifur Rahman", "Shamim Ahmed", "Mijanur Rahman",
    "Sabiha Firdaus", "Md. Shadman Sakib"
  ],
  EEE: [
    "Dr. Md. Asadur Rahman", "Ruhul Amin", "Md. Sabbir Hasan Sohag"
  ],
  Accounting: [
    "Prof. Dr. Syed Masud Husain", "Dr. Kazi Naeema Binte Faruky",
    "Md. Tanim-Ul-Islam", "Sharmin Akther", "Shahnag Akter", "Md. Moslah Uddin"
  ],
  Marketing: [
    "Omar Faruck Ansari", "Dr. Mohammad Raihanul Hasan", "Dr. Md. Aslam Uddin",
    "Maliha Ahmed Siddique", "Nafisa Nur Chowdhury", "Dil Afrooz Khushee",
    "Sultan Mahmud", "Fayez Ahmed"
  ],
  Management: [
    "Md. Abdulla Al Mamun"
  ]
};
// BUBT's own department picker offers "Accounting"/"Marketing"/"Management"
// as distinct entries, but the app's shared department list only offers the
// umbrella "Business Administration (BBA)" — so a BBA-only selection needs
// its own combined roster, or it falls through to "no department matched"
// and shows every BUBT faculty member (CSE/EEE included).
BUBT_FACULTY_BY_DEPT.BBA = [
  ...new Set([
    ...BUBT_FACULTY_BY_DEPT.Accounting,
    ...BUBT_FACULTY_BY_DEPT.Marketing,
    ...BUBT_FACULTY_BY_DEPT.Management
  ])
];
const NUB_FACULTY_BY_DEPT = {
  CSE: [
    "Prof. Dr. Md. Fokhray Hossain", "Engr. Md. Raihan ul Islam",
    "Liton Kumar Biswas", "Md. Shahjalal", "Mostafa Rafid Un Nabi",
    "Tanjina Yeasmin", "Fatema Tuj Johora"
  ],
  EEE: [
    "Prof. Dr. Engr. Sheikh Anwar Hossain", "Engr. Md. Zillur Rahman",
    "Sayed Abu Taha", "Md. Jahangir Alam", "S. M. Mahfuzul Alam"
  ],
  Civil: [
    "Prof. Dr. Engr. Md. Shamsul Alam", "Md. Abu Rayhan",
    "A. S. M. Farhad Hossain", "Sharmin Sultana"
  ],
  Textile: [
    "Prof. Dr. Engr. Abu Bakr Siddique", "Engr. Md. Shariful Islam",
    "Engr. Tanjirul Islam", "Engr. Sumaiya Rahman"
  ],
  BusinessAdministration: [
    "Prof. Dr. Nazrul Islam", "Dr. Mohammad Ekramol Islam",
    "Md. Al-Amin", "Farhana Rahman", "Mahfuzur Rahman"
  ],
  English: [
    "Prof. Dr. Md. Nurul Islam", "Sultana Razia",
    "Tania Afroze", "Md. Shariful Islam"
  ],
  Law: [
    "Prof. Dr. A. W. M. Abdul Huq", "Md. Sazzad Hossain",
    "Nusrat Jahan", "Kazi Sefat Ullah"
  ],
  PublicHealth: [
    "Prof. Dr. A. J. M. Omar Faruque", "Dr. Md. Nazmul Ahsan"
  ]
};
const FACULTY_BY_UNIVERSITY = {
  "Dhaka International University": DHAKA_INTL_UNIV_FACULTY_BY_DEPT,
  "North South University": NSU_FACULTY_BY_DEPT,
  "BRAC University": BRAC_UNIV_FACULTY_BY_DEPT,
  "City University": CITY_UNIV_FACULTY_BY_DEPT,
  "Bangladesh University": BU_FACULTY_BY_DEPT,
  "Southeast University": SOUTHEAST_UNIV_FACULTY_BY_DEPT,
  "Shyamoli Ideal Polytechnic Institute": SIPI_FACULTY_BY_DEPT,
  "Bangladesh University of Business and Technology": BUBT_FACULTY_BY_DEPT,
  "Northern University Bangladesh": NUB_FACULTY_BY_DEPT
};
const FACULTY_DEPT_ALIASES_BY_UNIVERSITY = {
  "Dhaka International University": {
    Civil: ['civil engineering', 'civil', 'ce'],
    Microbiology: ['microbiology', 'micro'],
    BMB: ['biochemistry', 'molecular biology', 'biochemistry and molecular biology', 'bmb'],
    PoliticalScience: ['political science', 'politics', 'ps'],
    Sociology: ['sociology', 'socio'],
    Economics: ['economics', 'eco', 'econ'],
    DevelopmentStudies: ['development studies', 'dev studies', 'ds']
  },
  "North South University": {
    CEE: ['civil engineering', 'civil & environmental engineering', 'cee', 'civil'],
    ARCH: ['architecture', 'arch'],
    DMP: ['mathematics', 'physics', 'math & physics', 'dmp'],
    ACT: ['accounting', 'finance', 'accounting & finance', 'act'],
    MGT: ['management', 'mgt'],
    MKT: ['marketing', 'international business', 'mkt'],
    ECO: ['economics', 'eco', 'econ'],
    ENG: ['english', 'modern languages', 'eng'],
    LAW: ['law'],
    PSS: ['political science', 'sociology', 'pss'],
    HIS: ['history', 'philosophy', 'his']
  },
  "BRAC University": {
    CSE: ['computer science', 'computer science & engineering', 'cse', 'cs'],
    BBS: ['business', 'brac business school', 'bbs', 'bba', 'management', 'finance', 'accounting', 'marketing'],
    EEE: ['electrical and electronic engineering', 'eee', 'electrical'],
    ENH: ['english', 'english and humanities', 'enh', 'humanities'],
    ESS: ['economics', 'economics and social sciences', 'ess', 'social sciences', 'eco'],
    Pharmacy: ['pharmacy', 'pharm'],
    Architecture: ['architecture', 'arch'],
    MNS: ['mathematics', 'natural sciences', 'mathematics and natural sciences', 'mns', 'physics', 'biotechnology'],
    Law: ['law', 'laws', 'school of law']
  },
  "City University": {
    CSE: ['computer science', 'computer science & engineering', 'cse'],
    EEE: ['electrical and electronic engineering', 'eee'],
    BBA: ['business administration', 'business', 'bba', 'dba'],
    English: ['english', 'eng'],
    Law: ['law', 'laws']
  },
  "Bangladesh University": {
    CSE: ['computer science', 'computer science & engineering', 'cse'],
    EEE: ['electrical and electronic engineering', 'eee'],
    BBA: ['business administration', 'bba', 'business'],
    English: ['english', 'eng'],
    Law: ['law', 'laws'],
    Pharmacy: ['pharmacy', 'pharm'],
    Architecture: ['architecture', 'arch']
  },
  "Southeast University": {
    CSE: ['computer science', 'computer science & engineering', 'cse'],
    EEE: ['electrical and electronic engineering', 'eee'],
    Textile: ['textile engineering', 'textile', 'te'],
    Architecture: ['architecture', 'arch'],
    BBA: ['business administration', 'bba', 'business'],
    English: ['english', 'eng'],
    Law: ['law', 'llb'],
    Pharmacy: ['pharmacy', 'pharm']
  },
  "Shyamoli Ideal Polytechnic Institute": {
    // Note: no bare 2-letter aliases like "te"/"ce" here — they'd falsely
    // substring-match inside "Technology"/"Science" inside the CST department
    // name below, since matching elsewhere in this file is substring-based.
    Textile: ['textile', 'textile engineering'],
    CST: ['computer science and technology', 'computer science', 'cst', 'cse', 'computer'],
    Electrical: ['electrical', 'electrical engineering'],
    Electronics: ['electronics', 'electronics engineering'],
    Mechanical: ['mechanical', 'mechanical engineering', 'me'],
    Civil: ['civil', 'civil engineering'],
    Architecture: ['architecture', 'arch'],
    Automobile: ['automobile', 'automobile engineering', 'auto'],
    GraphicDesign: ['graphic design', 'graphics design', 'graphic arts', 'gd'],
    RAC: ['refrigeration and air conditioner', 'refrigeration and air conditioning', 'rac', 'r&ac']
  },
  "Bangladesh University of Business and Technology": {
    CSE: ['computer science', 'computer science & engineering', 'computer science and engineering', 'cse'],
    EEE: ['electrical and electronic engineering', 'electrical & electronic engineering', 'eee'],
    BBA: ['business administration', 'bba'],
    Accounting: ['accounting', 'accounting & information systems'],
    Marketing: ['marketing'],
    Management: ['management', 'human resource management', 'hrm']
  },
  "Northern University Bangladesh": {
    CSE: ['computer science', 'computer science & engineering', 'computer science and engineering', 'cse'],
    EEE: ['electrical and electronic engineering', 'electrical & electronic engineering', 'eee'],
    Civil: ['civil engineering', 'civil'],
    Textile: ['textile engineering', 'textile'],
    BusinessAdministration: ['business administration', 'bba', 'business'],
    English: ['english', 'english language & literature', 'english language and literature'],
    Law: ['law', 'llb'],
    PublicHealth: ['public health', 'ph']
  }
};
function resolveFacultyUniversity() {
  const raw = (state.universityName || '').trim().toLowerCase();
  if (!raw) return null;
  const stripped = raw.replace(/\s*\([^)]*\)\s*$/, '').trim();
  return Object.keys(FACULTY_BY_UNIVERSITY).find(uni => stripped === uni.toLowerCase()) || null;
}
function findFacultyDeptKey(dept, uniKey) {
  if (!dept || !uniKey) return null;
  const roster = FACULTY_BY_UNIVERSITY[uniKey];
  if (!roster) return null;
  const key = findDeptKey(dept);
  if (key && roster[key]) return key;
  const stripped = dept
    .trim()
    .toLowerCase()
    .replace(/^(department|dept)\.?\s+of\s+/i, '')
    .replace(/\s+(department|dept)\.?$/i, '')
    .trim();
  if (!stripped) return null;
  const aliases = FACULTY_DEPT_ALIASES_BY_UNIVERSITY[uniKey] || {};
  for (const [k, aliasList] of Object.entries(aliases)) {
    if (aliasList.some(a => stripped === a || stripped.includes(a) || a.includes(stripped))) {
      return k;
    }
  }
  return null;
}
function getFacultyList() {
  const uniKey = resolveFacultyUniversity();
  if (!uniKey) return [];
  const roster = FACULTY_BY_UNIVERSITY[uniKey];
  const dept = (state.department || '').trim();
  const deptKey = findFacultyDeptKey(dept, uniKey);
  if (deptKey) return roster[deptKey];
  const all = Object.values(roster).flat();
  return [...new Set(all)];
}
function setupStudentSuggestions() {
  const uniScopeHint = (uniGetter, showNoMatch = false) => (q) =>
    String(uniGetter() || '').trim().length < UNIVERSITY_SCOPE_MIN_CHARS
      ? 'Enter your university above to see saved matches.'
      : (showNoMatch ? 'No matches' : '');
  // No "No matches" panel while typing in any of these fields - a miss is
  // reported by the Fetch button's hint instead.
  // The lookup ID field intentionally has NO autosuggest: showing a dropdown of
  // other students' full IDs as soon as a few characters are typed is an easy
  // way to read out someone else's Registration ID without knowing it. Matching
  // still works via the "Fetch" button, which requires the full ID/roll.
  // The Student Identification section's own ID field gets the same treatment,
  // for the same reason: this section is only shown for an individual
  // (Assignment/Lab) doc — see toggleGroupUI — so it's one person entering
  // their own ID, not browsing a class roster. No suggestion is attached here.
  attachStudentSuggest(document.querySelector('[data-bind="studentName"]'), {
    mainField: 'name', fillMode: 'name', minChars: 1, max: 4,
    getEmptyMessage: uniScopeHint(() => state.universityName),
    getMatches: (q, max) => matchStudentsByName(q, max, state.universityName)
  });
  // There is one Department input in the individual form and one in the group form.
  document.querySelectorAll('[data-bind="department"]').forEach(deptEl => {
    if (!deptEl.closest('.field-suggest')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'field-suggest';
      deptEl.parentNode.insertBefore(wrapper, deptEl);
      wrapper.appendChild(deptEl);
    }
    attachStudentSuggest(deptEl, {
      staticList: DEPARTMENTS, minChars: 1, max: 4
    });
  });
  document.querySelectorAll('[data-bind="universityName"]').forEach(uniEl => {
    if (!uniEl.closest('.field-suggest')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'field-suggest';
      uniEl.parentNode.insertBefore(wrapper, uniEl);
      wrapper.appendChild(uniEl);
    }
    attachStudentSuggest(uniEl, {
      staticList: UNIVERSITIES, minChars: 1, max: 4
    });
  });
  const teacherDeptEl = document.querySelector('[data-bind="deptTitle"]');
  if (teacherDeptEl) {
    if (!teacherDeptEl.closest('.field-suggest')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'field-suggest';
      teacherDeptEl.parentNode.insertBefore(wrapper, teacherDeptEl);
      wrapper.appendChild(teacherDeptEl);
    }
    attachStudentSuggest(teacherDeptEl, {
      staticList: DEPARTMENTS, minChars: 1, max: 4
    });
    teacherDeptEl.addEventListener('blur', () => {
      const derived = deriveDeptTitle(teacherDeptEl.value);
      if (derived && derived !== teacherDeptEl.value) {
        teacherDeptEl.value = derived;
        state.deptTitle = derived;
        render();
      }
    });
  }
  const toUniEl = document.querySelector('[data-bind="toUniversity"]');
  if (toUniEl) {
    if (!toUniEl.closest('.field-suggest')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'field-suggest';
      toUniEl.parentNode.insertBefore(wrapper, toUniEl);
      wrapper.appendChild(toUniEl);
    }
    attachStudentSuggest(toUniEl, {
      staticList: UNIVERSITIES, minChars: 1, max: 4
    });
  }
  const courseTitleEl = document.querySelector('[data-bind="courseTitle"]');
  if (courseTitleEl) {
    if (!courseTitleEl.closest('.field-suggest')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'field-suggest';
      courseTitleEl.parentNode.insertBefore(wrapper, courseTitleEl);
      wrapper.appendChild(courseTitleEl);
    }
    attachStudentSuggest(courseTitleEl, {
      minChars: 1, max: 4,
      getMatches: (q, max) => filterWithPriority(getCourseList(), q, max)
    });
  }
  const courseCodeEl = document.querySelector('[data-bind="courseCode"]');
  if (courseCodeEl) {
    if (!courseCodeEl.closest('.field-suggest')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'field-suggest';
      courseCodeEl.parentNode.insertBefore(wrapper, courseCodeEl);
      wrapper.appendChild(courseCodeEl);
    }
    attachStudentSuggest(courseCodeEl, {
      minChars: 1, max: 4,
      getMatches: (q, max) => filterWithPriority(getCourseCodeList(), q, max)
    });
  }
  const toNameEl = document.querySelector('[data-bind="toName"]');
  if (toNameEl) {
    if (!toNameEl.closest('.field-suggest')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'field-suggest';
      toNameEl.parentNode.insertBefore(wrapper, toNameEl);
      wrapper.appendChild(toNameEl);
    }
    attachStudentSuggest(toNameEl, {
      minChars: 1, max: 4,
      getMatches: (q, max) => filterWithPriority(getFacultyList(), q, max)
    });
  }
}
function setupManualAutofill() { }