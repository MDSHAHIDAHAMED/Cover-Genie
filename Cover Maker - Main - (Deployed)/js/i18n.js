// Minimal i18n layer. Add a "language" state field ('en' | 'bn'). Every
// piece of fixed copy that should switch languages gets a STRINGS entry;
// user-typed data (names, titles, etc.) is never translated.
//
// Usage:
//   t('submittedBy')                       -> plain lookup
//   tf('titleGoesHere', { word: dt.word })  -> lookup + {placeholder} substitution
//
// NOTE: several bn values below are first-pass drafts (marked DRAFT) and
// are expected to be corrected by a native speaker before shipping.
const STRINGS = {
  // ---- Cards template ("The Noir") ----
  name: { en: "Name", bn: "নাম" },
  id: { en: "ID", bn: "আইডি" },
  roll: { en: "Roll", bn: "রোল" },
  semester: { en: "Semester", bn: "সেমিস্টার" },
  batch: { en: "Batch", bn: "ব্যাচ" },
  submittedBy: { en: "Submitted By", bn: "উপস্থাপনায় (শিক্ষার্থী)" },
  submittedTo: { en: "Submitted To", bn: "তত্বাবধানে (শিক্ষক)" }, // DRAFT
  instructorNamePlaceholder: { en: "Instructor Name", bn: "শিক্ষকের নাম" },
  designationFallback: { en: "Designation,", bn: "পদবি," },
  departmentFallback: { en: "Department", bn: "বিভাগ" },
  memberName: { en: "Member Name", bn: "সদস্যের নাম" },
  studentRegId: { en: "Student / Reg ID", bn: "শিক্ষার্থী / রেজিঃ আইডি" }, // DRAFT
  dateOfSubmission: { en: "Date of Submission", bn: "জমাদানের তারিখ" },
  submissionDueDate: { en: "Submission Due Date", bn: "জমাদানের নির্ধারিত তারিখ" }, // DRAFT
  universityNameFallback: { en: "University Name", bn: "বিশ্ববিদ্যালয়ের নাম" },
  course: { en: "Course", bn: "কোর্স" },
  courseCode: { en: "Course Code", bn: "কোর্স কোড" },
  dateOfExp: { en: "Date of Exp", bn: "পরীক্ষার তারিখ" }, // DRAFT
  titleGoesHere: { en: "{word} title goes here", bn: "{word} শিরোনাম এখানে দিন" }, // DRAFT
  groupDefaultName: { en: "Group 01", bn: "গ্রুপ ০১" }, // DRAFT
  member: { en: "Member", bn: "জন সদস্য" }, // DRAFT — used as "{n} {member}", check the count/classifier reads naturally
  leaderBadge: { en: "Leader", bn: "লিডার" },
  assignmentNoRowLabel: { en: "{word} No", bn: "{word} নং" },
  assignmentTitleRowLabel: { en: "{word} Name", bn: "শিরোনাম" },
  courseNameLabel: { en: "Course Name", bn: "কোর্সের নাম" },
  regNoLabel: { en: "Reg No", bn: "রেজিঃ নং" },
  batchSemesterLabel: { en: "Batch / Semester", bn: "ব্যাচ/সেমিস্টার" },
  slLabel: { en: "SL", bn: "ক্রম" },
  
  // Sidebar field labels (Bangla)
  assignmentNo: { en: "Assignment No.", bn: "অ্যাসাইনমেন্ট নং" },
  assignmentTitle: { en: "Assignment Title", bn: "শিরোনাম" },
  section: { en: "Section", bn: "শাখা/ব্যাচ" },
  courseTitle: { en: "Course Title", bn: "কোর্সের নাম" },
  departmentTitle: { en: "Department Title", bn: "কখগ বিভাগ" },

  // ---- Doc-type words (used across every template + sidebar) ----
  docType_assignment: { en: "Assignment", bn: "অ্যাসাইনমেন্ট" },
  docType_lab: { en: "Lab Report", bn: "ল্যাব রিপোর্ট" },
  docType_group: { en: "Group Assignment", bn: "গ্রুপ অ্যাসাইনমেন্ট" },

  // ---- Sidebar static copy (drives every [data-i18n] / [data-i18n-placeholder] / [data-i18n-title] element) ----
  // All bn values below are first-pass drafts (DRAFT) pending a native-speaker pass.
  sidebarCustomize: { en: "Customize", bn: "কাস্টমাইজ" }, // DRAFT
  sidebarTapPreview: { en: "TAP PREVIEW BELOW TO SEE CHANGES", bn: "পরিবর্তন দেখতে নিচের প্রিভিউ ট্যাপ করুন" }, // DRAFT
  autoMatchPaletteLabel: { en: "Auto-match palette", bn: "প্যালেট অটো-ম্যাচ করুন" }, // DRAFT
  autoMatchPaletteTitle: { en: "Automatically build a color palette from your logo whenever one is available", bn: "লোগো থাকলে তা থেকে স্বয়ংক্রিয়ভাবে একটি রঙের প্যালেট তৈরি করুন" }, // DRAFT

  coverPageTypeTitle: { en: "Cover Page Type", bn: "কভার পেজের ধরন" }, // DRAFT
  coverPageTypeDesc: { en: "Switch what this cover page is for — labels and fields below (and on the cover itself) update to match.", bn: "এই কভার পেজটি কীসের জন্য তা পরিবর্তন করুন — নিচের লেবেল ও ফিল্ড (এবং কভারেও) সেই অনুযায়ী আপডেট হবে।" }, // DRAFT
  coverLanguageLabel: { en: "Cover language", bn: "কভারের ভাষা" }, // DRAFT
  topPageForLabel: { en: "This is a top page for", bn: "টপ পেজ এর ধরণ" }, // DRAFT

  studentLookupTitle: { en: "Student Lookup", bn: "শিক্ষার্থী অনুসন্ধান" }, // DRAFT
  noteLabel: { en: "Note:", bn: "লক্ষ্য করুন:" }, // DRAFT
  lookupNote: { en: "Saved records live only in this browser on this device — there's no server or account behind it.", bn: "সংরক্ষিত রেকর্ডগুলো শুধু এই ডিভাইসের এই ব্রাউজারেই থাকে — এর পেছনে কোনো সার্ভার বা অ্যাকাউন্ট নেই।" }, // DRAFT
  universityCollegeNameLabel: { en: "University / College Name", bn: "বিশ্ববিদ্যালয় / কলেজের নাম" }, // DRAFT
  optionalAutoFillPlaceholder: { en: "Optional — filled in automatically on a match", bn: "ঐচ্ছিক — মিল পেলে স্বয়ংক্রিয়ভাবে পূরণ হবে" }, // DRAFT
  studentRegIdLabel: { en: "Student / Registration ID", bn: "শিক্ষার্থী / রেজিঃ আইডি" },
  lookupIdPlaceholder: { en: "Enter your Registration ID or roll number", bn: "আপনার রেজিস্ট্রেশন আইডি বা রোল নম্বর লিখুন" }, // DRAFT
  departmentLabel: { en: "Department", bn: "বিভাগ" },
  batchLabel: { en: "Batch", bn: "ব্যাচ" },
  fetchBtn: { en: "Fetch", bn: "খুঁজুন" }, // DRAFT
  lookupHintText: { en: "Check if your data is in local storage", bn: "আপনার তথ্য লোকাল স্টোরেজে আছে কিনা যাচাই করুন" }, // DRAFT

  studentIdTitle: { en: "Student Identification", bn: "শিক্ষার্থীর পরিচিতি" }, // DRAFT
  fullNameLabel: { en: "Full Name", bn: "পূর্ণ নাম" }, // DRAFT
  fullNamePlaceholder: { en: "Enter your full name", bn: "আপনার পূর্ণ নাম লিখুন" }, // DRAFT
  universityPlaceholder: { en: "Enter your university or college name", bn: "আপনার বিশ্ববিদ্যালয় বা কলেজের নাম লিখুন" }, // DRAFT
  studentRegIdShortLabel: { en: "Student / Reg ID", bn: "শিক্ষার্থী / রেজিঃ আইডি" }, // DRAFT
  studentRegIdPlaceholder: { en: "Enter your Student / Registration ID", bn: "আপনার শিক্ষার্থী/রেজিস্ট্রেশন আইডি লিখুন" }, // DRAFT
  rollNoLabel: { en: "Roll No.", bn: "রোল নং" }, // DRAFT
  rollPlaceholder: { en: "Enter your roll number", bn: "আপনার রোল নম্বর লিখুন" }, // DRAFT
  optionalTag: { en: "(Optional)", bn: "(ঐচ্ছিক)" }, // DRAFT
  optionalLowerTag: { en: "(optional)", bn: "(ঐচ্ছিক)" }, // DRAFT
  departmentPlaceholder: { en: "Enter your department", bn: "আপনার বিভাগ লিখুন" }, // DRAFT
  sectionBatchLabel: { en: "Section / Batch", bn: "শাখা/ব্যাচ" },
  sectionPlaceholder: { en: "Enter your section or batch", bn: "আপনার শাখা বা ব্যাচ লিখুন" }, // DRAFT
  semesterLabel: { en: "Semester", bn: "সেমিস্টার" },
  semesterPlaceholder: { en: "Enter your semester", bn: "আপনার সেমিস্টার লিখুন" }, // DRAFT
  saveStudentBtn: { en: "Save this student", bn: "সংরক্ষণ করুন" }, // DRAFT
  loadSampleBtn: { en: "Load sample", bn: "নমুনা লোড করুন" }, // DRAFT
  saveHintText: { en: "You might save a local record here", bn: "এখানে একটি লোকাল রেকর্ড সংরক্ষণ করতে পারেন" }, // DRAFT

  groupDetailsTitle: { en: "Group Details", bn: "গ্রুপের বিবরণ" }, // DRAFT
  groupDetailsDesc: { en: "Fill in your university and department, then add the members — names and IDs are suggested from saved records when the university and department match.", bn: "আপনার বিশ্ববিদ্যালয় ও বিভাগ পূরণ করুন, তারপর সদস্য যোগ করুন — বিশ্ববিদ্যালয় ও বিভাগ মিললে সংরক্ষিত রেকর্ড থেকে নাম ও আইডি সাজেস্ট হবে।" }, // DRAFT
  batchPlaceholder: { en: "Enter your batch", bn: "আপনার ব্যাচ লিখুন" }, // DRAFT
  groupNameLabel: { en: "Group Name", bn: "গ্রুপের নাম" },
  groupNamePlaceholder: { en: "Enter your group name", bn: "আপনার গ্রুপের নাম লিখুন" }, // DRAFT
  hasLeaderLabel: { en: "Does your group have a leader?", bn: "আপনার গ্রুপে কি একজন লিডার আছে?" }, // DRAFT
  membersLabel: { en: "Members", bn: "সদস্যগণ" }, // DRAFT
  addMemberBtn: { en: "Add member", bn: "সদস্য যোগ করুন" }, // DRAFT

  courseTitleLabel: { en: "Course Title / Subject", bn: "কোর্সের নাম/বিষয়" }, // DRAFT
  courseTitlePlaceholder: { en: "Enter course title", bn: "কোর্সের নাম লিখুন" }, // DRAFT
  courseCodeLabel: { en: "Course Code", bn: "কোর্স কোড" },
  courseCodePlaceholder: { en: "Enter course code", bn: "কোর্স কোড লিখুন" }, // DRAFT

  submissionDetailsTitle: { en: "Submission Details", bn: "জমাদানের বিবরণ" }, // DRAFT
  submittedToLabel: { en: "Submitted To — Teacher's Name", bn: "তত্বাবধানে (শিক্ষক) — শিক্ষকের নাম" }, // DRAFT
  teacherNamePlaceholder: { en: "Enter teacher's full name", bn: "শিক্ষকের পূর্ণ নাম লিখুন" }, // DRAFT
  designationLabel: { en: "Designation", bn: "পদবি" },
  designationPlaceholder: { en: "Enter designation", bn: "পদবি লিখুন" }, // DRAFT
  deptNamePlaceholder: { en: "Enter department name", bn: "বিভাগের নাম লিখুন" }, // DRAFT
  guestTeacherLabel: { en: "Guest teacher", bn: "অতিথি শিক্ষক" }, // DRAFT
  guestTeacherOptTag: { en: "(from another institution)", bn: "(অন্য প্রতিষ্ঠান থেকে)" }, // DRAFT
  teacherUniversityLabel: { en: "Teacher's University", bn: "শিক্ষকের বিশ্ববিদ্যালয়" }, // DRAFT
  teacherUniversityPlaceholder: { en: "Enter teacher's university", bn: "শিক্ষকের বিশ্ববিদ্যালয়ের নাম লিখুন" }, // DRAFT
  dateOfExperimentLabel: { en: "Date of Experiment", bn: "পরীক্ষার তারিখ" }, // DRAFT
  dateOfSubmissionLabel: { en: "Date of Submission", bn: "জমাদানের তারিখ" },

  institutionLogoTitle: { en: "Institution & Logo", bn: "প্রতিষ্ঠানের লোগো" }, // DRAFT
  institutionLogoDesc: { en: "Your institution details and logo appear in the cover header.", bn: "আপনার প্রতিষ্ঠানের তথ্য ও লোগো কভারের হেডারে দেখা যাবে।" }, // DRAFT
  checkLogoDirLabel: { en: "Check if your logo is available in our directory", bn: "আমাদের তালিকায় আপনার লোগো আছে কিনা যাচাই করুন" }, // DRAFT
  selectLogoOption: { en: "-- Select a logo --", bn: "-- একটি লোগো নির্বাচন করুন --" }, // DRAFT
  uploadLogoLabel: { en: "Upload Logo", bn: "লোগো আপলোড করুন" }, // DRAFT
  uploadLogoOptTag: { en: "(optional — PNG / SVG with transparency works best)", bn: "(ঐচ্ছিক — স্বচ্ছ ব্যাকগ্রাউন্ডসহ PNG/SVG সবচেয়ে ভালো কাজ করে)" }, // DRAFT
  noLogoText: { en: "No logo uploaded — that space will stay blank.", bn: "কোনো লোগো আপলোড করা হয়নি — জায়গাটি ফাঁকা থাকবে।" }, // DRAFT
  uploadLogoBtn: { en: "Upload Logo", bn: "লোগো আপলোড করুন" }, // DRAFT
  removeBtn: { en: "Remove", bn: "মুছুন" }, // DRAFT

  coverLayoutTitle: { en: "Cover Layout", bn: "কভার লেআউট" }, // DRAFT
  coverLayoutDesc: { en: "Start with a professionally crafted template. Make it yours with simple customization to match your vision.", bn: "একটি পেশাদার টেমপ্লেট দিয়ে শুরু করুন। সহজ কাস্টমাইজেশনের মাধ্যমে এটি আপনার মতো করে সাজান।" }, // DRAFT
  needIndexLabel: { en: "Do you need an index?", bn: "আপনার কি একটি ইনডেক্স দরকার?" }, // DRAFT
  needIndexHint: { en: "Click on the checkbox to get one list of all lab reports", bn: "সব ল্যাব রিপোর্টের একটি তালিকা পেতে চেকবক্সে ক্লিক করুন" }, // DRAFT
  indexLayoutTitle: { en: "Index Layout", bn: "ইনডেক্স লেআউট" }, // DRAFT
  indexLayoutDesc: { en: "Pick how the index / list of lab reports is laid out.", bn: "ল্যাব রিপোর্টের ইনডেক্স/তালিকা কীভাবে সাজানো হবে তা বেছে নিন।" }, // DRAFT
  indexTitleGroupTitle: { en: "Index Title", bn: "ইনডেক্সের শিরোনাম" }, // DRAFT
  indexTitleLabel: { en: "Index Title", bn: "ইনডেক্সের শিরোনাম" }, // DRAFT
  indexTitlePlaceholder: { en: "Enter index title", bn: "ইনডেক্সের শিরোনাম লিখুন" }, // DRAFT
  indexSubtitleLabel: { en: "Index subtitle", bn: "ইনডেক্সের উপ-শিরোনাম" }, // DRAFT
  indexSubtitlePlaceholder: { en: "Auto-fills from course code, submitted by & to", bn: "কোর্স কোড, উপস্থাপনায় (শিক্ষার্থী) ও তত্বাবধানে (শিক্ষক) থেকে স্বয়ংক্রিয়ভাবে পূরণ হয়" }, // DRAFT
  indexSubtitleHint: { en: "Leave blank to auto-build the subtitle from the course code and the submitted-by / submitted-to fields below.", bn: "খালি রাখলে নিচের কোর্স কোড, উপস্থাপনায় (শিক্ষার্থী) ও তত্বাবধানে (শিক্ষক) ফিল্ড থেকে উপ-শিরোনাম স্বয়ংক্রিয়ভাবে তৈরি হবে।" }, // DRAFT

  labEntriesTitle: { en: "Lab Report Entries", bn: "ল্যাব রিপোর্ট এন্ট্রি" }, // DRAFT
  addMultipleLabel: { en: "Add multiple at once", bn: "একসাথে একাধিক যোগ করুন" }, // DRAFT
  addRowsBtn: { en: "Add Rows", bn: "সারি যোগ করুন" }, // DRAFT
  addRowsHint: { en: "Adds that many blank rows below at once — quicker than clicking \"Add lab report\" one at a time.", bn: "একবারে নিচে ততগুলো খালি সারি যোগ হবে — বারবার \"ল্যাব রিপোর্ট যোগ করুন\" ক্লিক করার চেয়ে দ্রুত।" }, // DRAFT
  addMoreBtn: { en: "Add More", bn: "আরও যোগ করুন" }, // DRAFT

  styleTitle: { en: "Style", bn: "স্টাইল" }, // DRAFT
  styleDesc: { en: "Pick a background texture for the page.", bn: "পেজের জন্য একটি ব্যাকগ্রাউন্ড টেক্সচার বেছে নিন।" }, // DRAFT
  pageBgLabel: { en: "Background", bn: "ব্যাকগ্রাউন্ড" }, // DRAFT
  bgPlain: { en: "Plain", bn: "সাদামাটা" }, // DRAFT
  bgDotted: { en: "Dotted", bn: "ডটেড" }, // DRAFT
  bgGrid: { en: "Grid", bn: "গ্রিড" }, // DRAFT
  typographyTitle: { en: "Typography", bn: "টাইপোগ্রাফি" }, // DRAFT
  typographyDesc: { en: "Choose the typeface used across the cover page — body text and headings update together.", bn: "কভার পেজ জুড়ে ব্যবহৃত ফন্ট বেছে নিন — মূল লেখা ও শিরোনাম একসাথে আপডেট হবে।" }, // DRAFT
  coverFontLabel: { en: "Cover font", bn: "কভারের ফন্ট" }, // DRAFT

  colorPaletteTitle: { en: "Color Palette", bn: "কালার প্যালেট" }, // DRAFT
  colorPaletteDesc: { en: "Recolors bars, headings and highlights only — the layout underneath never moves.", bn: "শুধু বার, শিরোনাম ও হাইলাইটের রঙ পরিবর্তন করে — নিচের লেআউট কখনো নড়ে না।" }, // DRAFT
  matchPaletteLogoBtn: { en: "Match Palette to Logo", bn: "লোগোর সাথে প্যালেট মেলান" }, // DRAFT
  matchPaletteLogoTitle: { en: "Upload or select a logo first", bn: "প্রথমে একটি লোগো আপলোড বা নির্বাচন করুন" }, // DRAFT
  paletteNameLabel: { en: "Palette name", bn: "প্যালেটের নাম" }, // DRAFT
  paletteNamePlaceholder: { en: "Enter palette name", bn: "প্যালেটের নাম লিখুন" }, // DRAFT
  primaryColorsLabel: { en: "Primary colors", bn: "প্রধান রঙ" }, // DRAFT
  barLabel: { en: "Bar", bn: "বার" }, // DRAFT
  accentLabel: { en: "Accent", bn: "এক্সেন্ট" }, // DRAFT
  tintBgLabel: { en: "Tint backgrounds", bn: "টিন্ট ব্যাকগ্রাউন্ড" }, // DRAFT
  cardsTemplateTag: { en: "(cards template)", bn: "(কার্ড টেমপ্লেট)" }, // DRAFT
  tintLabel: { en: "Tint", bn: "টিন্ট" }, // DRAFT
  tintRowLabel: { en: "Tint row", bn: "টিন্ট সারি" }, // DRAFT
  emblemColorsLabel: { en: "Emblem colors", bn: "এমব্লেমের রঙ" }, // DRAFT
  emblemTemplateTag: { en: "(emblem template)", bn: "(এমব্লেম টেমপ্লেট)" }, // DRAFT
  primaryLabel: { en: "Primary", bn: "প্রাইমারি" }, // DRAFT
  secondaryLabel: { en: "Secondary", bn: "সেকেন্ডারি" }, // DRAFT
  savePaletteBtn: { en: "Save palette", bn: "প্যালেট সংরক্ষণ করুন" }, // DRAFT
  cancelBtn: { en: "Cancel", bn: "বাতিল" }, // DRAFT

  downloadNoticeText: { en: "The top page downloads by default. Check \"Do you need an index?\" above to include an index page too.", bn: "টপ পেজটি ডিফল্টভাবে ডাউনলোড হয়। ইনডেক্স পেজও যোগ করতে উপরে \"আপনার কি একটি ইনডেক্স দরকার?\" চেক করুন।" }, // DRAFT
  downloadNoticeBothText: { en: "You'll have <b>a cover page and an index page</b>. When you download, you'll be asked whether to get them <b>together as one file</b> or <b>one by one</b> as two files.", bn: "আপনার কাছে থাকবে একটি কভার পেজ ও একটি ইনডেক্স পেজ। ডাউনলোডের সময় জিজ্ঞেস করা হবে সেগুলো একসাথে একটি ফাইল হিসেবে নাকি আলাদা আলাদা দুটি ফাইল হিসেবে চান।" }, // DRAFT
  downloadPdfBtn: { en: "Download A4 PDF", bn: "A4 PDF ডাউনলোড করুন" }, // DRAFT
  downloadPngBtn: { en: "Download PNG (high-res)", bn: "PNG ডাউনলোড করুন (হাই-রেজ)" }, // DRAFT
  exportHintText: { en: "Renders at 3× resolution and downloads a true 210×297mm single-page PDF.", bn: "৩× রেজোলিউশনে রেন্ডার করে একটি সঠিক ২১০×২৯৭মিমি একক-পৃষ্ঠা PDF ডাউনলোড করে।" }, // DRAFT

  footerAbout: { en: "About", bn: "সম্পর্কে" }, // DRAFT
  footerPrivacy: { en: "Privacy", bn: "গোপনীয়তা" }, // DRAFT
  footerContact: { en: "Contact", bn: "যোগাযোগ" }, // DRAFT
  footerCreditPrefix: { en: "©", bn: "©" },
  footerCreditText: { en: "Cover Genie — made for students, free forever.", bn: "কভার জিনি — শিক্ষার্থীদের জন্য তৈরি, চিরকাল বিনামূল্যে।" }, // DRAFT

  // ---- Labels used across the 8 non-cards/emblem templates (Aurum, Evening
  // Dusk, Eclipse, Folio, Ledger, Sigil, Voltaic, Obliqua) — previously
  // hardcoded in English inside render-cover.js. ----
  studentIdLabel: { en: "Student ID", bn: "স্টুডেন্ট আইডি" }, // DRAFT
  academicProfileLabel: { en: "Academic Profile", bn: "একাডেমিক প্রোফাইল" }, // DRAFT
  courseTeacherLabel: { en: "Course teacher", bn: "কোর্স শিক্ষক" }, // DRAFT
  assessmentVerificationLabel: { en: "Assessment & Verification", bn: "মূল্যায়ন ও যাচাই" }, // DRAFT
  assessmentRemarksLabel: { en: "Assessment / Remarks", bn: "মূল্যায়ন/মন্তব্য" }, // DRAFT
  signatureLabel: { en: "Signature", bn: "স্বাক্ষর" }, // DRAFT
  groupLabel: { en: "Group", bn: "গ্রুপ" }, // DRAFT
  addMembersHint: { en: "Add group members from the sidebar", bn: "সাইডবার থেকে গ্রুপ সদস্য যোগ করুন" }, // DRAFT
  memberFallback: { en: "Member {n}", bn: "সদস্য {n}" }, // DRAFT
  coverCourseTitleFallback: { en: "Course Title", bn: "কোর্সের নাম" }, // DRAFT
  deptShortLabel: { en: "Dept", bn: "বিভাগ" }, // DRAFT
  rollNoRowLabel: { en: "Roll No", bn: "রোল নং" }, // DRAFT
  batchNoLabel: { en: "Batch No", bn: "ব্যাচ নং" }, // DRAFT
  dateOfExperimentLabel: { en: "Date of Experiment", bn: "পরীক্ষার তারিখ" }, // DRAFT
  experimentNumberLabel: { en: "Experiment Number", bn: "পরীক্ষার নম্বর" }, // DRAFT
  nameOfExptLabel: { en: "Name of the Expt.", bn: "পরীক্ষার নাম" }, // DRAFT
  docNumberFull: { en: "{word} Number", bn: "{word} নম্বর" }, // DRAFT
  labReportNameLabel: { en: "Lab Report Name", bn: "ল্যাব রিপোর্টের নাম" }, // DRAFT
  topicNameLabel: { en: "Topic Name", bn: "বিষয়ের নাম" }, // DRAFT
  universityLabel: { en: "University", bn: "বিশ্ববিদ্যালয়" }, // DRAFT
  designationLabel: { en: "Designation", bn: "পদবি" }, // DRAFT
  submittedOnLabel: { en: "Submitted on", bn: "জমা দেওয়া হয়েছে" }, // DRAFT
  signatureOfTeacherLabel: { en: "Signature Of Teacher", bn: "শিক্ষকের স্বাক্ষর" }, // DRAFT
  regLabel: { en: "Reg", bn: "রেজিঃ" }, // DRAFT
  paperDueDateLabel: { en: "Paper due date", bn: "জমাদানের নির্ধারিত তারিখ" }, // DRAFT
  submissionLabel: { en: "Submission", bn: "জমা" }, // DRAFT
  codeLabel: { en: "Code", bn: "কোড" }, // DRAFT
  semAbbrevLabel: { en: "Sem", bn: "সেম" }, // DRAFT
  studentNamePlaceholder: { en: "Student Name", bn: "শিক্ষার্থীর নাম" }, // DRAFT
  titleOfExperimentLabel: { en: "Title of Experiment", bn: "পরীক্ষার শিরোনাম" }, // DRAFT
  topicTitleLabel: { en: "Topic Title", bn: "বিষয়ের শিরোনাম" }, // DRAFT
  academicSubmissionLabel: { en: "Academic Submission", bn: "প্রাতিষ্ঠানিক নথি দাখিল" }, // DRAFT
  docNoDot: { en: "{word} No.", bn: "{word} নং" }, // DRAFT
  bnrTitleFmt: { en: "{word} On {course}", bn: "{course} বিষয়ে {word}" }, // DRAFT (Banner template title bar)
  bnrSubmittedOn: { en: "Submitted on", bn: "জমা দেওয়া হয়েছে" }, // DRAFT

  // ---- Chancery ("formal") template ----
  fmNoShort: { en: "No.", bn: "নং" },
  haSubmissionDate: { en: "Submission Date", bn: "জমাদানের তারিখ" }, // Halo template
  fmCourseLabel: { en: "Course Code & Title", bn: "কোর্স কোড ও নাম" }, // DRAFT
  fmSectionBatch: { en: "Section / Batch", bn: "শাখা / ব্যাচ" }, // DRAFT
  fmSemesterLabel: { en: "Academic Semester", bn: "একাডেমিক সেমিস্টার" }, // DRAFT

  // ---- Index page (render-index.js) + lab-entry rows (sidebar.js) ----
  ixColNo: { en: "No.", bn: "ক্রম" },
  ixColLabName: { en: "Lab Report Name", bn: "ল্যাব শিরোনাম" },
  ixColDate: { en: "Date", bn: "তারিখ" },
  ixColPage: { en: "Page", bn: "পৃষ্ঠা" },
  ixColSignature: { en: "Signature", bn: "সাক্ষর" },
  ixColRemarks: { en: "Remarks", bn: "মন্তব্য" },
  ixColExpNo: { en: "Exp. No", bn: "ক্রম" },
  ixColExpName: { en: "Name of Experiment", bn: "ল্যাব শিরোনাম" },
  ixColPageNo: { en: "Page No", bn: "পৃষ্ঠা" },
  ixDefaultTitle: { en: "Lab Report Index", bn: "ল্যাব রিপোর্ট ইনডেক্স" }, // DRAFT
  ixEyebrow: { en: "Index", bn: "ইনডেক্স" }, // DRAFT
  ixUniversityFallback: { en: "University Name", bn: "বিশ্ববিদ্যালয়ের নাম" },
  ixCheckedBy: { en: "Checked by", bn: "যাচাইকারী" }, // DRAFT
  ixUntitledLab: { en: "Untitled lab report", bn: "শিরোনামহীন ল্যাব রিপোর্ট" }, // DRAFT
  ixDateNotSet: { en: "Date not set", bn: "তারিখ দেওয়া হয়নি" }, // DRAFT
  ixEmpty: { en: "Add lab report entries from the sidebar to populate this index.", bn: "এই ইনডেক্স পূরণ করতে সাইডবার থেকে ল্যাব রিপোর্টের এন্ট্রি যোগ করুন।" }, // DRAFT
  ixSubBoth: { en: "Submitted by {by} to {to}", bn: "{by} কর্তৃক {to}-এর নিকট উপস্থাপিত" }, // DRAFT
  ixSubBy: { en: "Submitted by {by}", bn: "{by} কর্তৃক উপস্থাপিত" }, // DRAFT
  ixSubTo: { en: "Submitted to {to}", bn: "{to}-এর নিকট উপস্থাপিত" }, // DRAFT
  ixLogoAlt: { en: "Institution logo", bn: "প্রতিষ্ঠানের লোগো" },
  leEmpty: { en: "No lab reports added yet — enter a count above to add several at once, or use \"Add lab report\" below.", bn: "এখনো কোনো ল্যাব রিপোর্ট যোগ করা হয়নি — একসাথে কয়েকটি যোগ করতে উপরে সংখ্যা দিন, অথবা নিচের \"ল্যাব রিপোর্ট যোগ করুন\" ব্যবহার করুন।" }, // DRAFT
  leNamePlaceholder: { en: "Lab report name", bn: "ল্যাব শিরোনাম" },
  lePagePlaceholder: { en: "Pg. No.", bn: "পৃষ্ঠা নং" }, // DRAFT
  leNoPlaceholder: { en: "01", bn: "০১" },
  leRemoveAria: { en: "Remove lab report", bn: "ল্যাব রিপোর্ট সরান" }, // DRAFT

  // ---- Group member rows + limit hints (sidebar.js) ----
  gmFullNamePh: { en: "Full name", bn: "পূর্ণ নাম" }, // DRAFT
  gmRollPh: { en: "Roll", bn: "রোল" }, // DRAFT
  gmIdPh: { en: "Student / Reg ID (optional)", bn: "শিক্ষার্থী / রেজি. আইডি (ঐচ্ছিক)" }, // DRAFT
  gmLeaderLabel: { en: "Group leader", bn: "গ্রুপ লিডার" }, // DRAFT
  gmRemoveAria: { en: "Remove member", bn: "সদস্য সরান" }, // DRAFT
  gmNoMembers: { en: "No members added yet — use \"Add member\" below.", bn: "এখনও কোনো সদস্য যোগ করা হয়নি — নিচের \"সদস্য যোগ করুন\" ব্যবহার করুন।" }, // DRAFT
  gmLimitHint: { en: "This template supports up to {max} members.", bn: "এই টেমপ্লেটে সর্বোচ্চ {max} জন সদস্য যোগ করা যাবে।" }, // DRAFT
  gmLimitTrimmed: { en: "{tpl} supports up to {max} members — extra members were removed.", bn: "{tpl} টেমপ্লেটে সর্বোচ্চ {max} জন সদস্য যোগ করা যায় — অতিরিক্ত সদস্য সরানো হয়েছে।" }, // DRAFT
  gmLimitCap: { en: "{tpl} supports up to {max} members — remove one before adding another.", bn: "{tpl} টেমপ্লেটে সর্বোচ্চ {max} জন সদস্য যোগ করা যায় — নতুন যোগ করার আগে একজনকে সরান।" }, // DRAFT
  gmLimitTrimmedOne: { en: "{tpl} supports up to 1 member — extra members were removed.", bn: "{tpl} টেমপ্লেটে সর্বোচ্চ ১ জন সদস্য যোগ করা যায় — অতিরিক্ত সদস্য সরানো হয়েছে।" }, // DRAFT
  gmLimitCapOne: { en: "{tpl} supports up to 1 member — remove one before adding another.", bn: "{tpl} টেমপ্লেটে সর্বোচ্চ ১ জন সদস্য যোগ করা যায় — নতুন যোগ করার আগে একজনকে সরান।" }, // DRAFT,

  // ---- Missing required fields warning (export) ----
  mfTitle: { en: "Hold on — some required fields are empty", bn: "একটু দাঁড়ান — কিছু আবশ্যিক ঘর খালি আছে" },
  mfSubOne: { en: "You're trying to download without filling in {n} required field. Your page may look incomplete. Are you sure you want to download?", bn: "আপনি {n}টি আবশ্যিক ঘর পূরণ না করেই ডাউনলোড করতে যাচ্ছেন। পেজটি অসম্পূর্ণ দেখাতে পারে। আপনি কি নিশ্চিতভাবে ডাউনলোড করতে চান?" },
  mfSubMany: { en: "You're trying to download without filling in {n} required fields. Your page may look incomplete. Are you sure you want to download?", bn: "আপনি {n}টি আবশ্যিক ঘর পূরণ না করেই ডাউনলোড করতে যাচ্ছেন। পেজটি অসম্পূর্ণ দেখাতে পারে। আপনি কি নিশ্চিতভাবে ডাউনলোড করতে চান?" },
  mfListLabel: { en: "Still empty", bn: "যেগুলো এখনও খালি" },
  mfMore: { en: "+{n} more", bn: "+{n}টি আরও" },
  mfFill: { en: "Go back & fill", bn: "ফিরে গিয়ে পূরণ করি" },
  mfAnyway: { en: "Download anyway", bn: "তবুও ডাউনলোড করুন" },
  mfClose: { en: "Close", bn: "বন্ধ করুন" },
};

// Renders a number with Bengali digits when the UI language is Bangla.
function numL(n) {
  const s = String(n);
  return (typeof state !== 'undefined' && state.language === 'bn')
    ? s.replace(/[0-9]/g, d => '\u09E6\u09E7\u09E8\u09E9\u09EA\u09EB\u09EC\u09ED\u09EE\u09EF'[d])
    : s;
}

function t(key) {
  const entry = STRINGS[key];
  if (!entry) { console.warn('[i18n] missing key:', key); return key; }
  const lang = (state.language === 'bn') ? 'bn' : 'en';
  return entry[lang] || entry.en;
}

// t() + simple {placeholder} substitution, e.g. tf('titleGoesHere', { word: dt.word })
function tf(key, vars) {
  let out = t(key);
  Object.keys(vars || {}).forEach(k => {
    out = out.split('{' + k + '}').join(vars[k]);
  });
  return out;
}

// Bangla text needs a font with Bengali glyphs — none of the current paper
// fonts (Times/Georgia/EB Garamond/...) have them. This list is swapped in on
// top of (not instead of) the Latin font picker: whenever language is 'bn',
// the "Cover font" dropdown shows these instead, and the chosen one applies
// automatically. "hindsiliguri" (a clean modern sans) is the default; "notoserifbengali"
// is offered as the formal/serif alternative for a more traditional cover look.
const BANGLA_FONTS = [
  { id: "adornoirrit", label: "Li Ador Noirrit (Modern Versatile)", cssValue: "'Li Ador Noirrit', 'Noto Serif Bengali', 'Times New Roman', Times, serif", webFamily: "Li Ador Noirrit" },
  { id: "notoserifbengali", label: "Noto Serif Bengali (Formal Serif)", cssValue: "'Noto Serif Bengali', 'Times New Roman', Times, serif", webFamily: "Noto Serif Bengali" }
];
function getBanglaFont() {
  return BANGLA_FONTS.find(f => f.id === state.banglaFont) || BANGLA_FONTS[0];
}

// Single source of truth for what --paper-font should be right now, used by
// both the live preview (applyPaperFont) and the index pagination probe
// (measureIndexOverflow) so they never disagree about layout.
function currentPaperFontCss() {
  return state.language === 'bn' ? getBanglaFont().cssValue : getFont().cssValue;
}

// Walks every element carrying a data-i18n / data-i18n-placeholder / data-i18n-title
// attribute and sets its text/placeholder/title from STRINGS via t(), in the
// language state.language currently holds. This is the generic counterpart to
// the doc-type/label-specific syncing already done by applyDocTypeCopy() and
// syncSidebarLabels() — it covers the rest of the sidebar's static copy
// (group titles, descriptions, buttons, hints, checkbox text, placeholders…)
// so nothing is left behind in English when the language toggle is used.
// Also re-syncs any enhanced <select> (see ui-controls.js enhanceSelect) whose
// <option> text just changed, so its custom dropdown trigger/panel match.
function applyStaticI18n(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  scope.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  scope.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
  scope.querySelectorAll('select').forEach(sel => {
    if (typeof sel.__cselSyncLabels === 'function') sel.__cselSyncLabels();
  });
}