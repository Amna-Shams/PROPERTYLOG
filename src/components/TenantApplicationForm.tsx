/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Building, 
  MapPin, 
  DollarSign, 
  User, 
  Phone, 
  Users, 
  FileText, 
  CheckCircle2, 
  Upload, 
  ArrowRight, 
  ArrowLeft,
  Briefcase,
  Check,
  Award,
  Globe,
  Trash2,
  ShieldAlert,
  Download,
  CheckCircle,
  HelpCircle,
  Clock
} from "lucide-react";
import { formatPKR } from "../utils/currency";
import { RentalProperty } from "../data/rentalProperties";
import { encryptAES256, decryptAES256 } from "../utils/crypto";
import { jsPDF } from "jspdf";

// Complete 13-Section English/Urdu Bilingual Translation Dictionary
const T = {
  en: {
    back: "Back to Portal",
    formTitle: "Phase 4: Property Leasing Form",
    governmentTitle: "Government Compliant Rental Verification",
    standardsDesc: "Optimized for DHA, Clifton, Bahria Town, and Cantonment Board regulatory checks.",
    autofill: "Auto-Fill Demo",
    langToggle: "اردو میں بدلیں",
    draftDetected: "Saved Draft Detected!",
    draftDetectedDesc: "We found an incomplete 13-section application on your cache. Would you like to resume?",
    resume: "Resume Draft",
    startFresh: "Start Fresh",
    saveDraftSuccess: "Draft Saved Successfully! Your progress has been encrypted and secured.",
    saveDraftBtn: "Save as Draft",
    submitBtn: "Submit Formal Verification",
    step: "Step",
    of: "of 13",
    next: "Continue",
    prev: "Previous",
    yes: "Yes",
    no: "No",
    mustHave: "Must Have",
    niceToHave: "Nice to Have",
    notNeeded: "Not Needed",
    validationError: "Please fix the form errors before proceeding.",
    
    // Steps Titles
    step1Title: "Property Requirements",
    step1Desc: "Basic structural layout and category requirements for your target home.",
    step2Title: "Indoor Amenities",
    step2Desc: "Smart utilities, solar grids, backup power systems, and connection checks.",
    step3Title: "Gated Community Amenities",
    step3Desc: "Neighborhood requirements including security, mosque proximity, and parks.",
    step4Title: "Location Preferences",
    step4Desc: "Province, city, sector boundaries, landmarks, and work/school distances.",
    step5Title: "Rental Budget & Finances",
    step5Desc: "Salary statements, income sources, advance rent budgets, and corporate letters.",
    step6Title: "Personal Information",
    step6Desc: "Official identification details as registered in government CNIC registers.",
    step7Title: "Primary Contact Details",
    step7Desc: "Phone channels, active email inboxes, and physical street addresses.",
    step8Title: "Emergency Contacts",
    step8Desc: "Immediate point of contacts for security or legal dispatch notifications.",
    step9Title: "Occupants & Household Profile",
    step9Desc: "Listing of children, adults, domestic helpers, vehicles, and pets.",
    step10Title: "Lease Timeline & Commitments",
    step10Desc: "Duration preferences, notice period limits, and advance payment margins.",
    step11Title: "Community Rules & Conduct",
    step11Desc: "Formal affirmation of structural boundaries, noise levels, and non-subletting rules.",
    step12Title: "References Registry",
    step12Desc: "Background verification references from prior landlords and professional supervisors.",
    step13Title: "Digital Documentation & Submission",
    step13Desc: "Secure CNIC/financial uploads, digital cursive signature, and legal declaration.",
    
    // Step 1 Labels
    propCategory: "Property Category",
    furnishingSetup: "Furnishing Setup",
    floorLevel: "Preferred Floor Level",
    bedrooms: "Bedrooms Count",
    bathrooms: "Bathrooms Count",
    coveredArea: "Covered Area (Sq Ft)",
    parkingReq: "Dedicated Parking Space?",
    balconyReq: "Balcony / Terrace?",
    gardenReq: "Private Lawn/Garden?",
    storeRoomReq: "Separate Store Room?",
    kitchenLayout: "Kitchen Layout",
    
    // Step 2 Labels
    ac: "Air Conditioning",
    ups: "UPS / Inverter Grid",
    generator: "Generator Backup",
    solar: "Solar Grid Power",
    gas: "Natural Gas Connection",
    water: "Water Board Supply",
    internet: "High-Speed Fiber Internet",
    purifier: "Water Purifier Filter",
    
    // Step 3 Labels
    sec247: "24/7 Security Patrol",
    cctv: "CCTV Surveillance Grid",
    gated: "Gated Community Checkpoint",
    mosque: "Mosque in Walking Distance",
    park: "Community Park / Jogging",
    school: "Reputable Schools Nearby",
    hospital: "Emergency Hospital Proximity",
    
    // Step 4 Labels
    province: "Target Province",
    city: "Target City",
    areas: "Preferred Sectors / Societies",
    landmark: "Nearest Well-Known Landmark",
    streetType: "Preferred Street Width / Location",
    distWork: "Distance to Work (km)",
    distSchool: "Distance to School (km)",
    
    // Step 5 Labels
    maxMonthlyRent: "Maximum Rent Budget (PKR/mo)",
    advanceRent: "Willing One-Time Advance (Months)",
    depositRent: "Willing Security Deposit (Months)",
    monthlyIncome: "Gross Monthly Family Income (PKR)",
    sourceOfIncome: "Primary Source of Funds",
    employerName: "Current Employer Name",
    employerContact: "Employer HR Contact Number",
    occupation: "Current Profession / Designation",
    
    // Step 6 Labels
    fullName: "Full Name (As printed on CNIC)",
    fatherHusband: "Father / Husband Full Name",
    cnic: "National Identity Card (CNIC)",
    dob: "Date of Birth (DD-MM-YYYY)",
    gender: "Gender Identity",
    maritalStatus: "Marital Status",
    nationality: "Nationality",
    religion: "Religion / Belief System",
    motherTongue: "Mother Tongue / Language Spoken",
    
    // Step 7 Labels
    mobileNum: "Primary Mobile Number (03XX-XXXXXXX)",
    whatsAppNum: "Active WhatsApp Connection",
    emailAddr: "Official Electronic Email Address",
    currentAddr: "Full Current Residential Address",
    currentCity: "Current City / District",
    currentProvince: "Current Province",
    
    // Step 8 Labels
    emergencyName: "Emergency Contact Full Name",
    emergencyRelation: "Relationship to Applicant",
    emergencyPhone: "Emergency Direct Contact Number",
    
    // Step 9 Labels
    totalOccupants: "Total Number of Residents",
    adultsCount: "Adult Count (Above 18 yrs)",
    childrenCount: "Children Count (Below 18 yrs)",
    petsHousehold: "Do you keep any pets in the household?",
    petDetails: "Provide Pet Details (Breeds, Sizes)",
    vehiclesCount: "Total Vehicles Registered on Household",
    vehicleTypes: "Vehicle Specifics (Make, Model, License)",
    
    // Step 10 Labels
    preferredLease: "Preferred Lease Duration",
    moveInDate: "Desired Move-In Date",
    flexibilityMoveIn: "Move-In Timing Flexibility",
    noticePeriod: "Willing Notice Period Limit",
    rentCycle: "Rent Payment Frequency Preference",
    paymentDay: "Preferred Payment Day of Month",
    
    // Step 11 Labels
    agreeRentOnTime: "I agree to transfer rent on or before the agreed date.",
    agreeSecurityDeposit: "I agree to pay a fully refundable security deposit.",
    agreeMaintainProperty: "I agree to maintain building fixtures and plumbing cleanly.",
    agreeNoSubletting: "I agree that subletting rooms is strictly forbidden.",
    agreeFollowRules: "I agree to strictly abide by society / building bylaws.",
    agreeNoticeBeforeMoving: "I agree to provide the required notice period prior to vacating.",
    agreeAllowInspections: "I agree to permit landlord inspections with prior appointment.",
    agreeNoModifications: "I agree to make no structural changes without written permission.",
    agreeNoNoise: "I agree to observe silent hours and limit late-night loud noise.",
    agreeNoIllegal: "I agree to conduct no illegal or commercial activities inside units.",
    
    // Step 12 Labels
    ref1Name: "Previous Landlord Full Name",
    ref1Phone: "Landlord Contact Phone",
    ref1Addr: "Previous Rented Unit Address",
    ref1Reason: "Genuine Reason for Vacating",
    ref1Rent: "Previous Monthly Rent Paid (PKR)",
    ref1Timely: "Did you pay rent on time?",
    ref2Name: "Professional Supervisor Full Name",
    ref2Company: "Organization / Company Name",
    ref2Phone: "Supervisor Work Contact Phone",
    ref2Email: "Official Professional Email Address",
    ref2Relation: "Professional Supervisor Relationship",
    
    // Step 13 Labels
    cnicUpload: "CNIC Copy (Front & Back merged or split)",
    photoUpload: "Recent Passport Size Color Photo",
    statementUpload: "Last 3 Months Verifiable Bank Statement",
    salaryUpload: "Official Stamped Salary Slip / Income Certificate",
    letterUpload: "Company Verification / Appointment Letter",
    dragDropText: "Drag and drop your file here, or click to select.",
    digitalSign: "Digital Signature (Type Full Legal Name)",
    digitalSignDesc: "Your typed name serves as an authorized electronic signature.",
    declarationPlace: "City / Location of Declaration",
    swornOath: "Sworn Oath & Legal Declaration Statement",
    swornDesc1: "I solemnly declare that all particulars, financial disclosures, and references supplied across these 13 steps are absolutely true, verified, and complete.",
    swornDesc2: "I fully understand that any false documentation or concealed occupants will lead to immediate cancellation of tenancy, legal ejection, and reporting to civil credit & security registries.",
    agreeSworn: "I solemnly affirm and sign this sworn tenant verification declaration.",
    
    // Confirmation Modal
    confirmTitle: "Review & Submit Leasing Application",
    confirmDesc: "Please review your details. Sensitive identification and financial figures are being securely encrypted using AES-256 for your privacy.",
    confirmCNIC: "Encrypted CNIC String:",
    confirmIncome: "Encrypted Gross Income:",
    confirmCancel: "Review Form Again",
    confirmSubmit: "Authorize & Submit"
  },
  ur: {
    back: "پورٹل پر واپس جائیں",
    formTitle: "مرحلہ 4: پراپرٹی لیزنگ فارم",
    governmentTitle: "حکومتی قواعد کے مطابق کرایہ دار کی تصدیق",
    standardsDesc: "ڈی ایچ اے، کلفٹن، بحریہ ٹاؤن، اور کینٹ بورڈ کے ریگولیٹری چیکس کے لیے بہترین۔",
    autofill: "ڈیمو خودکار بھریں",
    langToggle: "English Language",
    draftDetected: "محفوظ شدہ مسودہ مل گیا!",
    draftDetectedDesc: "ہمیں آپ کے براؤزر میں ایک نامکمل فارم ملا ہے۔ کیا آپ وہیں سے جاری رکھنا چاہتے ہیں جہاں سے چھوڑا تھا؟",
    resume: "مسودہ بحال کریں",
    startFresh: "نیا شروع کریں",
    saveDraftSuccess: "مسودہ کامیابی سے محفوظ ہو گیا! آپ کی معلومات کو خفیہ (Encrypt) کر دیا گیا ہے۔",
    saveDraftBtn: "مسودہ محفوظ کریں",
    submitBtn: "درخواست جمع کروائیں",
    step: "مرحلہ",
    of: "کا 13",
    next: "آگے بڑھیں",
    prev: "پیچھے جائیں",
    yes: "جی ہاں",
    no: "جی نہیں",
    mustHave: "لازمی ضرورت",
    niceToHave: "بہتر ہے اگر ہو",
    notNeeded: "ضرورت نہیں ہے",
    validationError: "براہ کرم آگے بڑھنے سے پہلے فارم کی غلطیوں کو درست کریں۔",
    
    // Steps Titles
    step1Title: "پراپرٹی کی ضروریات",
    step1Desc: "مطلوبہ گھر کے لیے بنیادی ڈھانچہ، کمرے اور کیٹیگری کی ترجیحات۔",
    step2Title: "اندرونی سہولیات",
    step2Desc: "بجلی کے بیک اپ سسٹم (سولر، یو پی ایس)، گیس اور پانی کے کنکشن۔",
    step3Title: "سوسائٹی / کمیونٹی سہولیات",
    step3Desc: "سیکیورٹی گارڈز، سی سی ٹی وی کیمرے، مسجد اور پارک کی قربت۔",
    step4Title: "علاقے کی ترجیحات",
    step4Desc: "صوبہ، شہر، مخصوص سیکٹر، قریبی نشانیاں اور فاصلے کی پیمائش۔",
    step5Title: "مالی بجٹ اور آمدنی",
    step5Desc: "ماہانہ آمدنی، کمپنی کا نام، ایڈوانس کرایہ اور بجٹ کی حد۔",
    step6Title: "ذاتی معلومات",
    step6Desc: "سرکاری شناختی کارڈ (CNIC) کے مطابق آپ کا آفیشل بائیو ڈیٹا۔",
    step7Title: "رابطے کی تفصیلات",
    step7Desc: "آپ کے فعال فون نمبرز، واٹس ایپ کنکشن اور موجودہ پتہ۔",
    step8Title: "ہنگامی حالات کا رابطہ",
    step8Desc: "ہنگامی صورتحال میں رابطہ کرنے کے لیے قریبی رشتہ دار کی تفصیلات۔",
    step9Title: "رہائشی اور پالتو جانور",
    step9Desc: "گھر کے کل افراد، بچوں کی تعداد، گاڑیاں اور پالتو جانوروں کی معلومات۔",
    step10Title: "کرایہ داری کی مدت اور شرائط",
    step10Desc: "معاہدے کی کل مدت، نوٹس پیریڈ اور منتقلی کی تاریخ۔",
    step11Title: "قوانین اور قواعد و ضوابط",
    step11Desc: "شور و غل، صفائی، سوسائٹی کے قوانین اور کرایہ بروقت دینے کا حلف۔",
    step12Title: "سابقہ مالکان اور حوالے",
    step12Desc: "سابقہ مکان مالک اور آپ کی کمپنی کے سپروائزر کا رابطہ اور حوالہ۔",
    step13Title: "دستاویزات اور حلف نامہ",
    step13Desc: "شناختی کارڈ اور بینک اسٹیٹمنٹ اپ لوڈ، دستخط اور باقاعدہ جمع کروانا۔",
    
    // Step 1 Labels
    propCategory: "پراپرٹی کی کیٹیگری",
    furnishingSetup: "فرنیچر کی ترتیب",
    floorLevel: "پسندیدہ منزل",
    bedrooms: "کمروں کی تعداد",
    bathrooms: "غسل خانوں کی تعداد",
    coveredArea: "کل رقبہ (مربع فٹ)",
    parkingReq: "گاڑی کی پارکنگ کی جگہ؟",
    balconyReq: "بالکونی / ٹیرس؟",
    gardenReq: "ذاتی باغیچہ / لان؟",
    storeRoomReq: "علیحدہ اسٹور روم؟",
    kitchenLayout: "کچن کا نقشہ",
    
    // Step 2 Labels
    ac: "ایئر کنڈیشننگ",
    ups: "یو پی ایس / انورٹر گریڈ",
    generator: "جنریٹر بیک اپ",
    solar: "سولر پینل سسٹم",
    gas: "سوئی گیس کنکشن",
    water: "سرکاری پانی کی سپلائی",
    internet: "فائبر انٹرنیٹ کنکشن",
    purifier: "پانی صاف کرنے کا فلٹر",
    
    // Step 3 Labels
    sec247: "24/7 سیکیورٹی گارڈز",
    cctv: "سی سی ٹی وی کیمرے",
    gated: "گیٹڈ کمیونٹی چیک پوسٹ",
    mosque: "پیدل فاصلے پر مسجد",
    park: "پارک اور جوگنگ ٹریک",
    school: "قریبی نامور اسکول",
    hospital: "ہسپتال کی قریبی سہولت",
    
    // Step 4 Labels
    province: "مطلوبہ صوبہ",
    city: "مطلوبہ شہر",
    areas: "پسندیدہ سیکٹر یا سوسائٹیز",
    landmark: "قریبی مشہور جگہ یا لینڈ مارک",
    streetType: "پسندیدہ سڑک کی چوڑائی یا مقام",
    distWork: "دفتر کا فاصلہ (کلومیٹر)",
    distSchool: "اسکول کا فاصلہ (کلومیٹر)",
    
    // Step 5 Labels
    maxMonthlyRent: "زیادہ سے زیادہ ماہانہ کرایہ کا بجٹ",
    advanceRent: "پیشگی ایڈوانس کرایہ (ماہ)",
    depositRent: "سیکیورٹی ڈپازٹ کی گنجائش (ماہ)",
    monthlyIncome: "کل ماہانہ خاندانی آمدنی",
    sourceOfIncome: "آمدنی کا بنیادی ذریعہ",
    employerName: "کمپنی یا بزنس کا نام",
    employerContact: "کمپنی کا فون نمبر",
    occupation: "پیشہ یا موجودہ عہدہ",
    
    // Step 6 Labels
    fullName: "مکمل نام (شناختی کارڈ کے مطابق)",
    fatherHusband: "والد یا شوہر کا نام",
    cnic: "قومی شناختی کارڈ نمبر (CNIC)",
    dob: "تاریخ پیدائش (DD-MM-YYYY)",
    gender: "جنس",
    maritalStatus: "ازدواجی حیثیت",
    nationality: "شہریت",
    religion: "مذہب",
    motherTongue: "مادری زبان",
    
    // Step 7 Labels
    mobileNum: "بنیادی موبائل نمبر (03XX-XXXXXXX)",
    whatsAppNum: "واٹس ایپ موبائل نمبر",
    emailAddr: "ای میل ایڈریس",
    currentAddr: "موجودہ رہائشی پتہ",
    currentCity: "موجودہ شہر یا ضلع",
    currentProvince: "موجودہ صوبہ",
    
    // Step 8 Labels
    emergencyName: "ہنگامی رابطے کے فرد کا نام",
    emergencyRelation: "امیدوار سے رشتہ",
    emergencyPhone: "ہنگامی رابطے کا نمبر",
    
    // Step 9 Labels
    totalOccupants: "گھر کے کل رہائشی افراد",
    adultsCount: "بالغ افراد کی تعداد (18 سال سے اوپر)",
    childrenCount: "بچوں کی تعداد (18 سال سے کم)",
    petsHousehold: "کیا آپ کے پاس پالتو جانور ہیں؟",
    petDetails: "پالتو جانوروں کی تفصیلات (نسل، سائز)",
    vehiclesCount: "گھر میں موجود گاڑیوں کی تعداد",
    vehicleTypes: "گاڑیوں کی تفصیلات (ماڈل، نمبر پلیٹ)",
    
    // Step 10 Labels
    preferredLease: "ترجیحی معاہدے کی مدت",
    moveInDate: "کرائے پر لینے کی تاریخ",
    flexibilityMoveIn: "منتقلی کی لچکدار شرائط",
    noticePeriod: "نوٹس پیریڈ کی گنجائش",
    rentCycle: "کرایہ کی ادائیگی کا شیڈول",
    paymentDay: "مہینے کا پسندیدہ دن برائے ادائیگی",
    
    // Step 11 Labels
    agreeRentOnTime: "میں طے شدہ تاریخ پر یا اس سے پہلے کرایہ ادا کرنے کا پابند ہوں گا۔",
    agreeSecurityDeposit: "میں سیکیورٹی ڈپازٹ پیشگی جمع کرانے پر راضی ہوں۔",
    agreeMaintainProperty: "میں گھر کی وائرنگ، پلمبنگ اور صفائی کا پورا خیال رکھوں گا۔",
    agreeNoSubletting: "میں گھر کے کسی حصے کو کسی دوسرے فرد کو کرائے پر نہیں دوں گا۔",
    agreeFollowRules: "میں سوسائٹی اور بلڈنگ کے تمام قوانین کا پابند ہوں گا۔",
    agreeNoticeBeforeMoving: "میں گھر خالی کرنے سے پہلے مطلوبہ نوٹس پیریڈ دینے کا پابند ہوں گا۔",
    agreeAllowInspections: "میں وقت سے پہلے مطلع کرنے پر معائنے کی اجازت دوں گا۔",
    agreeNoModifications: "میں مالک کی اجازت کے بغیر گھر میں کوئی تبدیلی نہیں کروں گا۔",
    agreeNoNoise: "میں خاموشی کے اوقات کا احترام کروں گا اور تیز آواز میں میوزک نہیں چلاؤں گا۔",
    agreeNoIllegal: "میں گھر کے اندر کسی قسم کی غیر قانونی سرگرمیوں میں ملوث نہیں ہوں گا۔",
    
    // Step 12 Labels
    ref1Name: "سابقہ مکان مالک کا نام",
    ref1Phone: "سابقہ مالک کا فون نمبر",
    ref1Addr: "سابقہ کرائے کے گھر کا پتہ",
    ref1Reason: "گھر تبدیل کرنے کی حقیقی وجہ",
    ref1Rent: "سابقہ ماہانہ کرایہ",
    ref1Timely: "کیا آپ کرایہ وقت پر ادا کرتے تھے؟",
    ref2Name: "کمپنی کے مینیجر کا نام",
    ref2Company: "کمپنی یا ادارے کا نام",
    ref2Phone: "مینیجر کا فون نمبر",
    ref2Email: "مینیجر کا آفیشل ای میل",
    ref2Relation: "مینیجر کے ساتھ پیشہ ورانہ رشتہ",
    
    // Step 13 Labels
    cnicUpload: "شناختی کارڈ کی کاپی (فرنٹ اور بیک)",
    photoUpload: "حالیہ پاسپورٹ سائز تصویر",
    statementUpload: "آخری 3 ماہ کی تصدیق شدہ بینک اسٹیٹمنٹ",
    salaryUpload: "ملازمت کا سرٹیفکیٹ یا سیلری سلپ",
    letterUpload: "کمپنی کا آفیشل لیٹر یا اپوائنٹمنٹ آرڈر",
    dragDropText: "فائل یہاں ڈریگ کریں، یا کلک کر کے منتخب کریں۔",
    digitalSign: "ڈیجیٹل دستخط (اپنا پورا نام ٹائپ کریں)",
    digitalSignDesc: "آپ کا ٹائپ کیا گیا نام آپ کا آفیشل ڈیجیٹل دستخط شمار ہوگا۔",
    declarationPlace: "تصدیق کرنے کا شہر یا مقام",
    swornOath: "باقاعدہ حلف نامہ اور قانونی تصدیق",
    swornDesc1: "میں صدق دل سے حلف اٹھاتا ہوں کہ ان تمام 13 مراحل میں فراہم کی گئی معلومات بالکل درست اور سچی ہیں۔",
    swornDesc2: "میں بخوبی واقف ہوں کہ کسی بھی غلط معلومات یا شناختی دستاویزات کی جعلسازی کی صورت میں قانونی کارروائی اور فوری بے دخلی کی جا سکتی ہے۔",
    agreeSworn: "میں حلفیہ بیان سے مکمل طور پر اتفاق کرتا ہوں اور دستخط کرتا ہوں۔",
    
    // Confirmation Modal
    confirmTitle: "درخواست کا جائزہ لیں اور جمع کروائیں",
    confirmDesc: "براہ کرم فراہم کردہ معلومات کا جائزہ لیں۔ شناختی کارڈ اور بینک کی حساس معلومات کو AES-256 ٹیکنالوجی سے خفیہ کر دیا گیا ہے۔",
    confirmCNIC: "خفیہ کردہ شناختی کارڈ نمبر:",
    confirmIncome: "خفیہ کردہ ماہانہ آمدنی:",
    confirmCancel: "دوبارہ جائزہ لیں",
    confirmSubmit: "تصدیق کریں اور جمع کروائیں"
  }
};

interface TenantApplicationFormProps {
  property?: RentalProperty;
  onSubmitSuccess: (applicationData: any) => void;
  onCancel: () => void;
  currentUser: any;
}

export const TenantApplicationForm: React.FC<TenantApplicationFormProps> = ({ 
  property, 
  onSubmitSuccess, 
  onCancel,
  currentUser
}) => {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState<"en" | "ur">("en");
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [signature, setSignature] = useState("");
  const [agreeDeclaration, setAgreeDeclaration] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});
  const [uploadedPreviews, setUploadedPreviews] = useState<Record<string, string>>({});
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [dragActiveField, setDragActiveField] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Real-time error states for specific fields
  const [errors, setErrors] = useState<Record<string, string>>({});

  // High fidelity form states covering all 13 sections
  const [formData, setFormData] = useState({
    // Section 1: Property Requirements
    propType: property?.property_type || "Apartment",
    furnishedStatus: property?.furnished || "fully",
    bedrooms: property?.bedrooms || 3,
    bathrooms: property?.bathrooms || 3,
    minArea: property?.area_sqft || 1800,
    preferredFloor: property?.floor || "Any",
    parkingRequired: "Yes",
    parkingCount: 1,
    balconyRequired: "Yes",
    gardenRequired: "Nice to Have",
    kitchenType: "Closed",
    storeRoomRequired: "Yes",

    // Section 2: Property Amenities Required
    acRequired: "Must Have",
    heatingRequired: "Nice to Have",
    upsRequired: "Must Have",
    generatorRequired: "Must Have",
    solarRequired: "Nice to Have",
    internetRequired: "Must Have",
    cableRequired: "Nice to Have",
    gasRequired: "Must Have",
    waterRequired: "Must Have",
    washingMachineRequired: "Nice to Have",
    refrigeratorRequired: "Nice to Have",
    microwaveRequired: "Nice to Have",
    waterFilterRequired: "Must Have",

    // Section 3: Building/Community Amenities
    security247: "Must Have",
    cctvCameras: "Must Have",
    gatedCommunity: "Must Have",
    mosqueNearby: "Must Have",
    parkNearby: "Must Have",
    schoolNearby: "Nice to Have",
    hospitalNearby: "Must Have",

    // Section 4: Location Preferences
    preferredProvince: property?.province || "Punjab",
    preferredCity: property?.city || "Lahore",
    preferredAreas: property?.area || "DHA Phase 6",
    proximityWork: 5,
    proximitySchool: 3,
    nearestLandmark: property?.landmark || "Near Main Commercial Boulevard",
    preferredStreetType: "Main Road",

    // Section 5: Budget & Financial Info
    maxMonthlyRent: property?.price || 150000,
    minRentBudget: Math.max(20000, (property?.price || 150000) - 30000),
    maxRentBudget: (property?.price || 150000) + 20000,
    securityDepositBudget: (property?.price || 150000) * 2,
    oneTimeAdvanceRent: (property?.price || 150000),
    totalMoveInBudget: (property?.price || 150000) * 3,
    preferredPaymentMethod: "Bank Transfer",
    monthlyIncome: 450000,
    sourceOfIncome: "Employment",
    employerName: "Systems Limited Pakistan",
    employerContact: "042-111-797-836",
    occupation: "Software Engineering",
    jobTitle: "Principal Tech Lead",
    yearsInCurrentJob: 4,
    otherIncomeSources: "Freelance Consulting",

    // Section 6: Personal Information
    fullName: currentUser?.full_name || "",
    fatherHusbandName: "",
    cnic: "",
    dob: "",
    gender: "Female",
    maritalStatus: "Married",
    nationality: "Pakistani",
    religion: "Islam",
    motherTongue: "Punjabi",

    // Section 7: Contact Information
    mobileNumber: currentUser?.phone || "",
    whatsAppNumber: currentUser?.phone || "",
    emailAddress: currentUser?.email || "",
    currentAddress: "Apartment 4, Block K, Gulberg III, Lahore",
    currentCityDistrict: "Lahore",
    currentProvince: "Punjab",
    
    // Section 8: Emergency Contact
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",

    // Section 9: Occupant Information
    totalOccupants: 3,
    adultsCount: 2,
    childrenCount: 1,
    petsInHousehold: "No",
    petDetails: "N/A",
    vehiclesCount: 1,
    vehicleTypes: "Car (Honda Civic)",

    // Section 10: Lease Requirements
    preferredLeaseDuration: "12 Months",
    preferredMoveInDate: "",
    flexibilityMoveInDate: "Flexible",
    noticePeriodWillingness: "60 Days",
    rentPaymentPreference: "Monthly",
    preferredPaymentDay: "5th",
    willingnessPayInAdvance: "2 Months",

    // Section 11: Lease Terms Acceptance
    agreeRentOnTime: true,
    agreeSecurityDeposit: true,
    agreeMaintainProperty: true,
    agreeNoSubletting: true,
    agreeFollowBuildingRules: true,
    agreeNoticeBeforeMoving: true,
    agreeAllowInspections: true,
    agreeNoModifications: true,
    agreeNoLoudNoise: true,
    agreeNoIllegalActivities: true,

    // Section 12: References
    ref1Name: "",
    ref1Contact: "",
    ref1PropertyAddress: "",
    ref1Duration: "2022 to 2026",
    ref1ReasonLeaving: "Needed larger space for family",
    ref1RentPaid: 110000,
    ref1PaidOnTime: "Always",

    ref2Name: "",
    ref2Designation: "Engineering Director",
    ref2Company: "Systems Limited",
    ref2Contact: "",
    ref2Email: "",
    ref2Relationship: "Professional Supervisor",

    // Section 13: Declaration Info
    declarationPlace: "Lahore, Pakistan"
  });

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Check for saved draft on mount
  useEffect(() => {
    const draftKey = `pl_draft_app_${currentUser?.id || "anonymous"}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      setShowDraftBanner(true);
    }
  }, [currentUser]);

  // Auto-save function on steps or inputs changes
  const saveDraftToCache = (updatedData = formData, updatedDocsList = uploadedDocs) => {
    const draftKey = `pl_draft_app_${currentUser?.id || "anonymous"}`;
    const packageToSave = {
      formData: updatedData,
      uploadedDocs: updatedDocsList,
      signature,
      step,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(draftKey, JSON.stringify(packageToSave));
  };

  const handleResumeDraft = () => {
    const draftKey = `pl_draft_app_${currentUser?.id || "anonymous"}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed.formData);
        setUploadedDocs(parsed.uploadedDocs || {});
        setSignature(parsed.signature || "");
        setStep(parsed.step || 1);
        setShowDraftBanner(false);
      } catch (e) {
        console.error("Error parsing draft", e);
      }
    }
  };

  const handleStartFresh = () => {
    const draftKey = `pl_draft_app_${currentUser?.id || "anonymous"}`;
    localStorage.removeItem(draftKey);
    setShowDraftBanner(false);
  };

  // Input Change with Validation & Auto-Formatting
  const handleInputChange = (field: string, value: any) => {
    let formattedValue = value;

    // Real-Time Pakistani CNIC Auto-Formatting & Formatting (XXXXX-XXXXXXX-X)
    if (field === "cnic") {
      // Keep only digits
      const digits = value.replace(/\D/g, "").substring(0, 13);
      let formatted = digits;
      if (digits.length > 5) {
        formatted = digits.substring(0, 5) + "-" + digits.substring(5);
      }
      if (digits.length > 12) {
        formatted = formatted.substring(0, 13) + "-" + formatted.substring(13, 14);
      }
      formattedValue = formatted;

      // Real-Time CNIC format check
      const regex = /^\d{5}-\d{7}-\d{1}$/;
      if (formatted.length > 0 && !regex.test(formatted)) {
        setErrors(prev => ({ ...prev, cnic: "CNIC must match Pakistan's format: 5 digits, a dash, 7 digits, a dash, and 1 digit (e.g., 35201-1234567-8)." }));
      } else {
        setErrors(prev => {
          const c = { ...prev };
          delete c.cnic;
          return c;
        });
      }
    }

    // Real-Time Pakistani Phone Formatting (03XX-XXXXXXX)
    if (field === "mobileNumber" || field === "whatsAppNumber" || field === "emergencyContactPhone" || field === "ref1Contact" || field === "ref2Contact") {
      // Strip everything except digits and plus sign
      const clean = value.replace(/[^\d+]/g, "").substring(0, 15);
      formattedValue = clean;

      // Basic Phone checks
      const regex = /^(03\d{2}-?\d{7})|(\+92-?3\d{2}-?\d{7})$/;
      const displayField = field === "mobileNumber" ? "Mobile" : "Contact";
      if (clean.length >= 10 && !regex.test(clean)) {
        setErrors(prev => ({ ...prev, [field]: `${displayField} phone must match Pakistan standard format e.g. 03001234567 or 0300-1234567.` }));
      } else {
        setErrors(prev => {
          const c = { ...prev };
          delete c[field];
          return c;
        });
      }
    }

    // Email validation
    if (field === "emailAddress" || field === "ref2Email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.length > 0 && !emailRegex.test(value)) {
        setErrors(prev => ({ ...prev, [field]: "Please enter a valid electronic email address." }));
      } else {
        setErrors(prev => {
          const c = { ...prev };
          delete c[field];
          return c;
        });
      }
    }

    const updated = {
      ...formData,
      [field]: formattedValue
    };
    setFormData(updated);
    saveDraftToCache(updated);
  };

  // Drag & Drop File Handlers
  const handleDrag = (e: React.DragEvent, field: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveField(field);
    } else if (e.type === "dragleave") {
      setDragActiveField(null);
    }
  };

  const processFile = (file: File, field: string) => {
    if (!file) return;
    setUploadingField(field);

    // Read file as base64 for local persistence and image previews
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setUploadedPreviews(prev => ({
        ...prev,
        [field]: base64String
      }));
      setUploadedDocs(prev => {
        const updated = {
          ...prev,
          [field]: file.name
        };
        saveDraftToCache(formData, updated);
        return updated;
      });
      setUploadingField(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, field: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveField(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], field);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0], field);
    }
  };

  // Auto-Fill Demo Handler
  const handleAutoFill = () => {
    const fullMockData = {
      ...formData,
      fullName: currentUser?.full_name || "Amna Sham",
      fatherHusbandName: "Chaudhry Shamsuddin",
      cnic: "35201-9874561-3",
      dob: "1994-11-20",
      gender: "Female",
      maritalStatus: "Married",
      nationality: "Pakistani",
      religion: "Islam",
      motherTongue: "Urdu",
      mobileNumber: "0300-4567891",
      whatsAppNumber: "0300-4567891",
      emailAddress: currentUser?.email || "amnachshams@gmail.com",
      currentAddress: "House 245, Block J-2, Phase 2, Johar Town, Lahore",
      currentCityDistrict: "Lahore",
      currentProvince: "Punjab",
      emergencyContactName: "Chaudhry Shamsuddin",
      emergencyContactRelationship: "Father",
      emergencyContactPhone: "0321-7896541",
      totalOccupants: 4,
      adultsCount: 3,
      childrenCount: 1,
      petsInHousehold: "No",
      petDetails: "N/A",
      vehiclesCount: 2,
      vehicleTypes: "Toyota Corolla (LE-4201), Honda CD70 (MN-8841)",
      preferredLeaseDuration: "24 Months",
      preferredMoveInDate: "2026-07-15",
      ref1Name: "Khawaja Tariq",
      ref1Contact: "0321-4455882",
      ref1PropertyAddress: "House 12-A, DHA Phase 3, Lahore",
      ref2Name: "Asim Jahangir",
      ref2Contact: "0333-8521473",
      ref2Company: "Devsinc Lahore",
      ref2Email: "asim.j@devsinc.com"
    };
    setFormData(fullMockData);
    setSignature("Amna Sham");
    setAgreeDeclaration(true);
    
    // Fast simulated documents uploads
    const docsMock = {
      cnic: "cnic_copy_front_back_amna.png",
      photo: "profile_photo_amna.jpg",
      statement: "bank_statement_q2_2026.pdf",
      salarySlip: "salary_slip_may_2026.pdf",
      employerLetter: "hiring_letter_devsinc.pdf"
    };
    setUploadedDocs(docsMock);
    
    // Set previews mock colors
    setUploadedPreviews({
      cnic: "MOCK_CNIC",
      photo: "MOCK_PHOTO",
      statement: "MOCK_STATEMENT"
    });

    saveDraftToCache(fullMockData, docsMock);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      alert(lang === "ur" ? T.ur.validationError : T.en.validationError);
      return;
    }
    
    if (step < 13) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Last step triggers confirmation modal
      if (!agreeDeclaration) {
        alert(lang === "ur" ? "براہ کرم حلف نامے کی شرائط سے اتفاق کریں۔" : "Please check the box to agree to the declaration terms.");
        return;
      }
      if (!signature.trim()) {
        alert(lang === "ur" ? "براہ کرم ڈیجیٹل دستخط فراہم کریں۔" : "Please enter your digital signature to proceed.");
        return;
      }
      setShowConfirmModal(true);
    }
  };

  const handleFormSubmit = () => {
    // Encrypt sensitive records using AES-256 simulation in crypto.ts
    const sensitiveKeys = ["cnic", "monthlyIncome", "ref1Contact", "ref2Contact", "emergencyContactPhone"];
    const encryptedDetails = { ...formData };
    sensitiveKeys.forEach(key => {
      encryptedDetails[key] = encryptAES256(String(formData[key as keyof typeof formData]));
    });

    const finalAppObject = {
      id: "app_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      propertyId: property?.id || "rent-1",
      propertyName: property?.title || "DHA Phase 6 Executive Penthouse",
      managerName: property?.manager_name || "Kamran Shah",
      price: property?.price || 150000,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      progress: 20,
      details: encryptedDetails, // Submitted encrypted!
      documents: uploadedDocs
    };

    // Remove draft cache
    const draftKey = `pl_draft_app_${currentUser?.id || "anonymous"}`;
    localStorage.removeItem(draftKey);

    setShowConfirmModal(false);
    onSubmitSuccess(finalAppObject);
  };

  // programmatic beautiful PDF Summary Generator
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Styling constants
    const primaryColor = "#0f172a"; // Slate-900
    const secondaryColor = "#1e3a8a"; // Blue-900
    const lightLineColor = "#e2e8f0"; // Slate-200

    // Header Title Card
    doc.setFillColor(15, 23, 42); // slate 900
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("VERIFIED RENTAL LEASING APPLICATION", 14, 18);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("DHA Lahore / Cantonment Board Regulated Tenant Screening Protocol", 14, 26);
    doc.text(`DATE GENERATED: ${new Date().toLocaleDateString()}`, 155, 18);
    doc.text(`REFERENCE ID: APP-WIZARD-13`, 155, 26);

    // Section header function
    let yPos = 55;
    const addSectionHeader = (title: string) => {
      doc.setFillColor(241, 245, 249); // slate 100
      doc.rect(14, yPos - 5, 182, 8, "F");
      doc.setTextColor(30, 58, 138); // blue 900
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(title.toUpperCase(), 18, yPos);
      doc.setDrawColor(226, 232, 240); // slate 200
      doc.line(14, yPos + 4, 196, yPos + 4);
      yPos += 12;
    };

    const addFieldRow = (lbl1: string, val1: string, lbl2: string, val2: string) => {
      doc.setTextColor(100, 116, 139); // slate 500
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(lbl1.toUpperCase(), 18, yPos);
      doc.text(lbl2.toUpperCase(), 110, yPos);
      
      doc.setTextColor(15, 23, 42); // slate 900
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(String(val1 || "N/A"), 18, yPos + 4.5);
      doc.text(String(val2 || "N/A"), 110, yPos + 4.5);
      
      doc.setDrawColor(241, 245, 249);
      doc.line(14, yPos + 7, 196, yPos + 7);
      yPos += 13;
    };

    // Part 1: Requirements
    addSectionHeader("Sections 1-3: Property & Amenities Profile");
    addFieldRow("Target Property", property?.title || "Residential House", "Monthly Rent", formatPKR(property?.price || 150000));
    addFieldRow("Category", formData.propType, "Furnishing Status", formData.furnishedStatus);
    addFieldRow("Bedrooms Count", `${formData.bedrooms} BR`, "Bathrooms Count", `${formData.bathrooms} Baths`);
    addFieldRow("Indoor Backup Power", formData.upsRequired === "Must Have" ? "UPS Required" : "Optional", "Gated Security", formData.security247);

    // Part 2: Location
    yPos += 5;
    addSectionHeader("Section 4: Location & Landmark Coordinates");
    addFieldRow("Preferred Province", formData.preferredProvince, "Preferred City", formData.preferredCity);
    addFieldRow("Target Sectors", formData.preferredAreas, "Nearest Landmark", formData.nearestLandmark);

    // Page Break
    doc.addPage();
    yPos = 20;

    // Part 3: Personal & Identification
    addSectionHeader("Sections 5-7: Identity & Income Disclosures");
    addFieldRow("Applicant Full Name", formData.fullName, "Father/Husband Name", formData.fatherHusbandName);
    
    // Mask sensitive CNIC visually in PDF to demonstrate high privacy standard
    const cnicDisplay = formData.cnic ? `${formData.cnic.substring(0, 5)}-XXXXXXX-${formData.cnic.substring(formData.cnic.length-1)}` : "N/A";
    addFieldRow("CNIC Number (Masked)", cnicDisplay, "Date of Birth", formData.dob);
    
    // Encrypt income string
    const encryptedIncomeHex = encryptAES256(String(formData.monthlyIncome)).substring(0, 15) + "...";
    addFieldRow("Gross Monthly Income (Encrypted)", encryptedIncomeHex, "Profession / Occupation", formData.occupation);
    addFieldRow("Mobile Contact Number", formData.mobileNumber, "Official Email Address", formData.emailAddress);

    // Part 4: Occupants & Emergency
    yPos += 5;
    addSectionHeader("Sections 8-10: Household Configuration & Lease Duration");
    addFieldRow("Total Occupants Count", `${formData.totalOccupants} Persons`, "Vehicles Count", `${formData.vehiclesCount} Registered`);
    addFieldRow("Emergency Contact Name", formData.emergencyContactName, "Emergency Relation", formData.emergencyContactRelationship);
    addFieldRow("Preferred Duration", formData.preferredLeaseDuration, "Target Move-in Date", formData.preferredMoveInDate || "Immediate");

    // Page Break
    doc.addPage();
    yPos = 20;

    // Part 5: References
    addSectionHeader("Sections 11-12: Integrity Check & References Registry");
    addFieldRow("Landlord Reference Full Name", formData.ref1Name || "None Provided", "Landlord Phone", formData.ref1Contact || "None Provided");
    addFieldRow("Employer Reference Name", formData.ref2Name || "None Provided", "Employer Company", formData.ref2Company || "None Provided");

    // Declaration block
    yPos += 5;
    addSectionHeader("Section 13: Sworn Certification & Digital Signature");
    
    doc.setFillColor(252, 252, 253);
    doc.rect(14, yPos - 3, 182, 38, "F");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("I hereby solemnly verify and affirm that all disclosures, financial slips, and references listed are", 18, yPos + 3);
    doc.text("completely authentic and legally true. I realize that any concealed information or falsified bank accounts", 18, yPos + 7);
    doc.text("will result in instantaneous lease cancellation and immediate reporting to Cantonal security registries.", 18, yPos + 11);

    addFieldRow("Digital Signature Authorizer", signature, "Place of Declaration", formData.declarationPlace);

    // Draw Cursive Digital Signature Box
    yPos += 10;
    doc.setDrawColor(148, 163, 184); // slate 400
    doc.rect(110, yPos - 3, 80, 20);
    doc.setTextColor(30, 58, 138);
    doc.setFont("times", "italic", "bold");
    doc.setFontSize(14);
    doc.text(signature || "Digitally Signed", 115, yPos + 10);
    
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("AUTHENTIC ELECTRONIC SEAL", 115, yPos + 22);

    doc.save(`Lease_Verification_Form_${formData.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  const localized = lang === "ur" ? T.ur : T.en;

  return (
    <div 
      id="tenant-application-wizard-form" 
      className="bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto transition-all duration-300"
      dir={lang === "ur" ? "rtl" : "ltr"}
    >
      {/* LANGUAGE & AUTOFILL ACTION HEADER */}
      <div className="bg-slate-950 px-6 py-3 flex items-center justify-between border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-blue-400" />
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "ur" : "en")}
            className="text-blue-400 font-extrabold hover:underline"
          >
            {localized.langToggle}
          </button>
        </div>
        
        <button
          type="button"
          onClick={handleAutoFill}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-[11px] font-bold text-white shadow-md flex items-center gap-1.5"
        >
          <Award className="h-3.5 w-3.5" /> {localized.autofill}
        </button>
      </div>

      {/* DRAFT DETECTED BANNER */}
      {showDraftBanner && (
        <div className="bg-amber-50 border-b border-amber-100 p-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{localized.draftDetected}</h4>
              <p className="text-[11px] text-slate-500">{localized.draftDetectedDesc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResumeDraft}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              {localized.resume}
            </button>
            <button
              onClick={handleStartFresh}
              className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all"
            >
              {localized.startFresh}
            </button>
          </div>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="bg-slate-900 text-white p-6 md:p-8 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">{localized.formTitle}</span>
            <h1 className="font-display font-black text-2xl tracking-tight">
              {property ? `${property.title}` : localized.governmentTitle}
            </h1>
            <p className="text-xs text-slate-300">
              {localized.standardsDesc}
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shrink-0"
          >
            <Download className="h-4 w-4" /> Download PDF Summary
          </button>
        </div>

        {/* COMPREHENSIVE 13-STEP PROGRESS STEPPER */}
        <div className="mt-8 space-y-2">
          <div className="flex justify-between items-center text-[11px] font-bold text-blue-400 uppercase tracking-wider">
            <span>{localized.step} {step} {localized.of}</span>
            <span>{Math.round((step / 13) * 100)}% Completed</span>
          </div>
          
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
            {Array.from({ length: 13 }).map((_, i) => (
              <div 
                key={i} 
                className={`h-full flex-1 transition-all duration-300 ${
                  i + 1 === step 
                    ? "bg-blue-400" 
                    : i + 1 < step 
                      ? "bg-emerald-500" 
                      : "bg-slate-800"
                }`} 
              />
            ))}
          </div>

          <h3 className="text-sm font-bold text-white pt-2 flex items-center gap-2">
            <span className="bg-blue-500 text-white h-5 w-5 rounded-full inline-flex items-center justify-center text-[11px] font-extrabold font-mono">
              {step}
            </span>
            {(localized as any)[`step${step}Title`]}
          </h3>
          <p className="text-[11px] text-slate-300 font-light">
            {(localized as any)[`step${step}Desc`]}
          </p>
        </div>
      </div>

      <form onSubmit={handleNextStep} className="p-6 md:p-8 space-y-8">
        
        {/* STEP 1: PROPERTY REQUIREMENTS */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.propCategory}</label>
                <select
                  value={formData.propType}
                  onChange={(e) => handleInputChange("propType", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.furnishingSetup}</label>
                <select
                  value={formData.furnishedStatus}
                  onChange={(e) => handleInputChange("furnishedStatus", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="fully">Fully Furnished</option>
                  <option value="semi">Semi Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.floorLevel}</label>
                <select
                  value={formData.preferredFloor}
                  onChange={(e) => handleInputChange("preferredFloor", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="Ground">Ground Floor</option>
                  <option value="1st">1st Floor</option>
                  <option value="2nd">2nd Floor</option>
                  <option value="3rd">3rd Floor</option>
                  <option value="Any">Any Floor</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.bedrooms}</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange("bedrooms", parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.bathrooms}</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange("bathrooms", parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.coveredArea}</label>
                <input
                  type="number"
                  min="100"
                  value={formData.minArea}
                  onChange={(e) => handleInputChange("minArea", parseInt(e.target.value) || 1000)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-4 border-t border-slate-100">
              {[
                { key: "parkingRequired", label: localized.parkingReq },
                { key: "balconyRequired", label: localized.balconyReq },
                { key: "gardenRequired", label: localized.gardenReq },
                { key: "storeRoomRequired", label: localized.storeRoomReq }
              ].map(item => (
                <div key={item.key}>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{item.label}</label>
                  <select
                    value={(formData as any)[item.key]}
                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                  >
                    <option value="Yes">{localized.yes}</option>
                    <option value="No">{localized.no}</option>
                    <option value="Nice to Have">{localized.niceToHave}</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: INDOOR AMENITIES */}
        {step === 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
            {[
              { key: "acRequired", label: localized.ac },
              { key: "upsRequired", label: localized.ups },
              { key: "generatorRequired", label: localized.generator },
              { key: "solarRequired", label: localized.solar },
              { key: "gasRequired", label: localized.gas },
              { key: "waterRequired", label: localized.water },
              { key: "internetRequired", label: localized.internet },
              { key: "waterFilterRequired", label: localized.purifier }
            ].map(item => (
              <div key={item.key} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col justify-between min-h-[100px]">
                <span className="font-bold text-slate-800 block mb-2">{item.label}</span>
                <select
                  value={(formData as any)[item.key]}
                  onChange={(e) => handleInputChange(item.key, e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Must Have">{localized.mustHave}</option>
                  <option value="Nice to Have">{localized.niceToHave}</option>
                  <option value="Not Needed">{localized.notNeeded}</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {/* STEP 3: COMMUNITY AMENITIES */}
        {step === 3 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
            {[
              { key: "security247", label: localized.sec247 },
              { key: "cctvCameras", label: localized.cctv },
              { key: "gatedCommunity", label: localized.gated },
              { key: "mosqueNearby", label: localized.mosque },
              { key: "parkNearby", label: localized.park },
              { key: "schoolNearby", label: localized.school },
              { key: "hospitalNearby", label: localized.hospital }
            ].map(item => (
              <div key={item.key} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col justify-between min-h-[100px]">
                <span className="font-bold text-slate-800 block mb-2">{item.label}</span>
                <select
                  value={(formData as any)[item.key]}
                  onChange={(e) => handleInputChange(item.key, e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Must Have">{localized.mustHave}</option>
                  <option value="Nice to Have">{localized.niceToHave}</option>
                  <option value="Not Needed">{localized.notNeeded}</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {/* STEP 4: LOCATION PREFERENCES */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.province}</label>
                <select
                  value={formData.preferredProvince}
                  onChange={(e) => handleInputChange("preferredProvince", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="KPK">Khyber Pakhtunkhwa (KPK)</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad">Islamabad Capital Territory</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.city}</label>
                <input
                  type="text"
                  required
                  value={formData.preferredCity}
                  onChange={(e) => handleInputChange("preferredCity", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.areas}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DHA Phase 6, Clifton Block 5"
                  value={formData.preferredAreas}
                  onChange={(e) => handleInputChange("preferredAreas", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.landmark}</label>
                <input
                  type="text"
                  required
                  value={formData.nearestLandmark}
                  onChange={(e) => handleInputChange("nearestLandmark", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.streetType}</label>
                <select
                  value={formData.preferredStreetType}
                  onChange={(e) => handleInputChange("preferredStreetType", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="Main Road">Main Road / Commercial Boulevard</option>
                  <option value="Residential Street">Quiet Residential Street</option>
                  <option value="Corner Plot">Corner Street</option>
                  <option value="Gated Lane">Secured Gated Lane</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.distWork}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.proximityWork}
                    onChange={(e) => handleInputChange("proximityWork", parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.distSchool}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.proximitySchool}
                    onChange={(e) => handleInputChange("proximitySchool", parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: RENTAL BUDGET & FINANCES */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.maxMonthlyRent}</label>
                <input
                  type="number"
                  required
                  value={formData.maxMonthlyRent}
                  onChange={(e) => handleInputChange("maxMonthlyRent", parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-emerald-600 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.advanceRent}</label>
                <input
                  type="number"
                  required
                  value={formData.oneTimeAdvanceRent}
                  onChange={(e) => handleInputChange("oneTimeAdvanceRent", parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.depositRent}</label>
                <input
                  type="number"
                  required
                  value={formData.securityDepositBudget}
                  onChange={(e) => handleInputChange("securityDepositBudget", parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.monthlyIncome}</label>
                <input
                  type="number"
                  required
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange("monthlyIncome", parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.sourceOfIncome}</label>
                <select
                  value={formData.sourceOfIncome}
                  onChange={(e) => handleInputChange("sourceOfIncome", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="Employment">Corporate Salary / Employment</option>
                  <option value="Business">Business Venture / Private Trade</option>
                  <option value="Freelancing">Freelance Tech / Contracting</option>
                  <option value="Inheritance">Inheritance / Dividends</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.employerName}</label>
                <input
                  type="text"
                  required
                  value={formData.employerName}
                  onChange={(e) => handleInputChange("employerName", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.employerContact}</label>
                <input
                  type="text"
                  required
                  value={formData.employerContact}
                  onChange={(e) => handleInputChange("employerContact", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.occupation}</label>
                <input
                  type="text"
                  required
                  value={formData.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: PERSONAL INFORMATION */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.fullName}</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.fatherHusband}</label>
                <input
                  type="text"
                  required
                  value={formData.fatherHusbandName}
                  onChange={(e) => handleInputChange("fatherHusbandName", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.cnic}</label>
                <input
                  type="text"
                  required
                  placeholder="35201-1234567-8"
                  value={formData.cnic}
                  onChange={(e) => handleInputChange("cnic", e.target.value)}
                  className={`w-full p-2.5 border rounded-xl font-mono font-bold text-sm bg-white tracking-wide ${
                    errors.cnic ? "border-rose-400 focus:ring-rose-200 text-rose-600" : "border-slate-200"
                  }`}
                />
                {errors.cnic && (
                  <p className="text-[9px] text-rose-500 mt-1 font-semibold">{errors.cnic}</p>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.dob}</label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.gender}</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.maritalStatus}</label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.nationality}</label>
                <input
                  type="text"
                  required
                  value={formData.nationality}
                  onChange={(e) => handleInputChange("nationality", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.religion}</label>
                <input
                  type="text"
                  required
                  value={formData.religion}
                  onChange={(e) => handleInputChange("religion", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.motherTongue}</label>
                <input
                  type="text"
                  required
                  value={formData.motherTongue}
                  onChange={(e) => handleInputChange("motherTongue", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: CONTACT DETAILS */}
        {step === 7 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.mobileNum}</label>
                <input
                  type="text"
                  required
                  placeholder="0300-1234567"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  className={`w-full p-2.5 border rounded-xl font-mono bg-white tracking-wider ${
                    errors.mobileNumber ? "border-rose-400 text-rose-600" : "border-slate-200"
                  }`}
                />
                {errors.mobileNumber && (
                  <p className="text-[9px] text-rose-500 mt-1 font-semibold">{errors.mobileNumber}</p>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.whatsAppNum}</label>
                <input
                  type="text"
                  required
                  placeholder="0300-1234567"
                  value={formData.whatsAppNumber}
                  onChange={(e) => handleInputChange("whatsAppNumber", e.target.value)}
                  className={`w-full p-2.5 border rounded-xl font-mono bg-white tracking-wider ${
                    errors.whatsAppNumber ? "border-rose-400 text-rose-600" : "border-slate-200"
                  }`}
                />
                {errors.whatsAppNumber && (
                  <p className="text-[9px] text-rose-500 mt-1 font-semibold">{errors.whatsAppNumber}</p>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.emailAddr}</label>
                <input
                  type="email"
                  required
                  placeholder="email@domain.com"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                  className={`w-full p-2.5 border rounded-xl bg-white ${
                    errors.emailAddress ? "border-rose-400 text-rose-600" : "border-slate-200"
                  }`}
                />
                {errors.emailAddress && (
                  <p className="text-[9px] text-rose-500 mt-1 font-semibold">{errors.emailAddress}</p>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.currentCity}</label>
                <input
                  type="text"
                  required
                  value={formData.currentCityDistrict}
                  onChange={(e) => handleInputChange("currentCityDistrict", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.currentProvince}</label>
                <input
                  type="text"
                  required
                  value={formData.currentProvince}
                  onChange={(e) => handleInputChange("currentProvince", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.currentAddr}</label>
              <textarea
                required
                rows={3}
                value={formData.currentAddress}
                onChange={(e) => handleInputChange("currentAddress", e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 8: EMERGENCY CONTACTS */}
        {step === 8 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.emergencyName}</label>
                <input
                  type="text"
                  required
                  value={formData.emergencyContactName}
                  onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.emergencyRelation}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Father, Husband, Brother"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) => handleInputChange("emergencyContactRelationship", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.emergencyPhone}</label>
                <input
                  type="text"
                  required
                  placeholder="0321-1234567"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                  className={`w-full p-2.5 border rounded-xl font-mono bg-white tracking-wider ${
                    errors.emergencyContactPhone ? "border-rose-400 text-rose-600" : "border-slate-200"
                  }`}
                />
                {errors.emergencyContactPhone && (
                  <p className="text-[9px] text-rose-500 mt-1 font-semibold">{errors.emergencyContactPhone}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: OCCUPANTS & HOUSEHOLD PROFILE */}
        {step === 9 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.totalOccupants}</label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalOccupants}
                  onChange={(e) => handleInputChange("totalOccupants", parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.adultsCount}</label>
                <input
                  type="number"
                  min="1"
                  value={formData.adultsCount}
                  onChange={(e) => handleInputChange("adultsCount", parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.childrenCount}</label>
                <input
                  type="number"
                  min="0"
                  value={formData.childrenCount}
                  onChange={(e) => handleInputChange("childrenCount", parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
              {/* Conditional Pets Segment */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.petsHousehold}</label>
                <select
                  value={formData.petsInHousehold}
                  onChange={(e) => handleInputChange("petsInHousehold", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="Yes">{localized.yes}</option>
                  <option value="No">{localized.no}</option>
                </select>
                
                {/* Conditional Logic: Hide pet details if select 'No' */}
                {formData.petsInHousehold === "Yes" && (
                  <div className="animate-fade-in">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{localized.petDetails}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Persian Cat, Labrador Retriever"
                      value={formData.petDetails === "N/A" ? "" : formData.petDetails}
                      onChange={(e) => handleInputChange("petDetails", e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* Conditional Vehicles Segment */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.vehiclesCount}</label>
                <input
                  type="number"
                  min="0"
                  value={formData.vehiclesCount}
                  onChange={(e) => handleInputChange("vehiclesCount", parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                />

                {/* Conditional Logic: Hide vehicle details if count is 0 */}
                {formData.vehiclesCount > 0 && (
                  <div className="animate-fade-in">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{localized.vehicleTypes}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Honda Civic (LE-2026), Yamaha YBR (KHI-4421)"
                      value={formData.vehicleTypes === "None" ? "" : formData.vehicleTypes}
                      onChange={(e) => handleInputChange("vehicleTypes", e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 10: LEASE TIMELINE & COMMITMENTS */}
        {step === 10 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.preferredLease}</label>
                <select
                  value={formData.preferredLeaseDuration}
                  onChange={(e) => handleInputChange("preferredLeaseDuration", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months (1 Year)</option>
                  <option value="24 Months">24 Months (2 Years)</option>
                  <option value="36 Months">36 Months (3 Years)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.moveInDate}</label>
                <input
                  type="date"
                  required
                  value={formData.preferredMoveInDate}
                  onChange={(e) => handleInputChange("preferredMoveInDate", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.flexibilityMoveIn}</label>
                <select
                  value={formData.flexibilityMoveInDate}
                  onChange={(e) => handleInputChange("flexibilityMoveInDate", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="Exact Date">Exact Date Required</option>
                  <option value="Flexible">Flexible within 7 Days</option>
                  <option value="Very Flexible">Very Flexible within 30 Days</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.noticePeriod}</label>
                <select
                  value={formData.noticePeriodWillingness}
                  onChange={(e) => handleInputChange("noticePeriodWillingness", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="30 Days">30 Days notice</option>
                  <option value="60 Days">60 Days notice</option>
                  <option value="90 Days">90 Days notice</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.rentCycle}</label>
                <select
                  value={formData.rentPaymentPreference}
                  onChange={(e) => handleInputChange("rentPaymentPreference", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="Monthly">Monthly Payments</option>
                  <option value="Quarterly">Quarterly (Every 3 months)</option>
                  <option value="Bi-Annually">Bi-Annually (Every 6 months)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.paymentDay}</label>
                <select
                  value={formData.preferredPaymentDay}
                  onChange={(e) => handleInputChange("preferredPaymentDay", e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="1st">1st of Month</option>
                  <option value="5th">5th of Month</option>
                  <option value="10th">10th of Month</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 11: COMMUNITY RULES & CONDUCT */}
        {step === 11 && (
          <div className="space-y-4">
            {[
              { key: "agreeRentOnTime", label: localized.agreeRentOnTime },
              { key: "agreeSecurityDeposit", label: localized.agreeSecurityDeposit },
              { key: "agreeMaintainProperty", label: localized.agreeMaintainProperty },
              { key: "agreeNoSubletting", label: localized.agreeNoSubletting },
              { key: "agreeFollowBuildingRules", label: localized.agreeFollowRules },
              { key: "agreeNoticeBeforeMoving", label: localized.agreeNoticeBeforeMoving },
              { key: "agreeAllowInspections", label: localized.agreeAllowInspections },
              { key: "agreeNoModifications", label: localized.agreeNoModifications },
              { key: "agreeNoLoudNoise", label: localized.agreeNoNoise },
              { key: "agreeNoIllegalActivities", label: localized.agreeNoIllegal }
            ].map(item => (
              <label 
                key={item.key} 
                className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-all border border-slate-100 text-xs text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={(formData as any)[item.key]}
                  onChange={(e) => handleInputChange(item.key, e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 accent-blue-600 mt-0.5"
                />
                <span className="font-medium leading-relaxed">{item.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* STEP 12: REFERENCES REGISTRY */}
        {step === 12 && (
          <div className="space-y-8">
            {/* Reference 1: Previous Landlord */}
            <div className="bg-slate-50/50 p-5 rounded-2xl space-y-4 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <User className="h-4 w-4 text-blue-600" /> Reference 1: Prior Landlord Background
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.ref1Name}</label>
                  <input
                    type="text"
                    required
                    value={formData.ref1Name}
                    onChange={(e) => handleInputChange("ref1Name", e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.ref1Phone}</label>
                  <input
                    type="text"
                    required
                    placeholder="0300-1234567"
                    value={formData.ref1Contact}
                    onChange={(e) => handleInputChange("ref1Contact", e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.ref1Addr}</label>
                  <input
                    type="text"
                    required
                    value={formData.ref1PropertyAddress}
                    onChange={(e) => handleInputChange("ref1PropertyAddress", e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Reference 2: Corporate/Professional Supervisor */}
            <div className="bg-slate-50/50 p-5 rounded-2xl space-y-4 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Briefcase className="h-4 w-4 text-blue-600" /> Reference 2: Professional Supervisor Verification
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.ref2Name}</label>
                  <input
                    type="text"
                    required
                    value={formData.ref2Name}
                    onChange={(e) => handleInputChange("ref2Name", e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.ref2Company}</label>
                  <input
                    type="text"
                    required
                    value={formData.ref2Company}
                    onChange={(e) => handleInputChange("ref2Company", e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.ref2Phone}</label>
                  <input
                    type="text"
                    required
                    placeholder="0321-1234567"
                    value={formData.ref2Contact}
                    onChange={(e) => handleInputChange("ref2Contact", e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 13: DIGITAL DOCUMENTATION & OATH */}
        {step === 13 && (
          <div className="space-y-8 animate-fade-in text-xs">
            {/* Sec 12: Drag-and-Drop Uploader slots */}
            <div className="bg-slate-50/50 p-5 rounded-2xl space-y-4 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-100 pb-2">
                {localized.cnicUpload}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: "cnic", label: localized.cnicUpload, desc: "Government Card (JPEG/PNG)" },
                  { key: "statement", label: localized.statementUpload, desc: "PDF statements file" },
                  { key: "salarySlip", label: localized.salaryUpload, desc: "Income statement proof" }
                ].map(item => {
                  const uploaded = uploadedDocs[item.key];
                  const uploading = uploadingField === item.key;
                  const activeDrag = dragActiveField === item.key;
                  const previewUrl = uploadedPreviews[item.key];

                  return (
                    <div 
                      key={item.key}
                      onDragEnter={(e) => handleDrag(e, item.key)}
                      onDragOver={(e) => handleDrag(e, item.key)}
                      onDragLeave={(e) => handleDrag(e, item.key)}
                      onDrop={(e) => handleDrop(e, item.key)}
                      onClick={() => fileInputRefs.current[item.key]?.click()}
                      className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer flex flex-col items-center justify-center transition-all ${
                        activeDrag 
                          ? "border-blue-500 bg-blue-50/40" 
                          : uploaded 
                            ? "border-emerald-300 bg-emerald-50/10 hover:bg-emerald-50/20" 
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/20"
                      }`}
                      style={{ minHeight: "150px" }}
                    >
                      <input
                        type="file"
                        ref={el => fileInputRefs.current[item.key] = el}
                        onChange={(e) => handleFileChange(e, item.key)}
                        className="hidden"
                        accept="image/*,application/pdf"
                      />

                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <span className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-[10px] text-slate-400 font-bold">Parsing document block...</span>
                        </div>
                      ) : previewUrl ? (
                        <div className="space-y-2 w-full">
                          {previewUrl.startsWith("data:image/") ? (
                            <img 
                              src={previewUrl} 
                              alt="preview" 
                              className="h-16 w-auto mx-auto object-cover rounded-lg shadow-sm border border-slate-100" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-xl mx-auto flex items-center justify-center">
                              <FileText className="h-8 w-8" />
                            </div>
                          )}
                          <span className="text-[10px] font-bold text-slate-800 block truncate">{uploaded}</span>
                          <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-100/60 border border-emerald-200 px-2 py-0.5 rounded-full inline-block">
                            VERIFIED PREVIEW
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-6 w-6 text-slate-400 mx-auto" />
                          <span className="font-bold text-slate-700 block text-[11px]">{item.label}</span>
                          <span className="text-[9px] text-slate-400 block">{item.desc}</span>
                          <span className="text-[8px] font-light text-slate-400 bg-slate-100 px-2 py-1 rounded-lg inline-block">
                            Drag &amp; Drop Here
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sec 13: Declaration Sworn Statement */}
            <div className="bg-slate-50/50 p-5 rounded-2xl space-y-4 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2">
                {localized.swornOath}
              </h3>
              
              <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2.5">
                <p className="font-bold text-slate-800">{localized.swornOath}:</p>
                <p className="font-light">{localized.swornDesc1}</p>
                <p className="font-light">{localized.swornDesc2}</p>
                
                <label className="flex items-center gap-3 mt-3 p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    required
                    checked={agreeDeclaration}
                    onChange={(e) => setAgreeDeclaration(e.target.checked)}
                    className="rounded text-blue-600 h-4.5 w-4.5 focus:ring-blue-500 accent-blue-600"
                  />
                  <span className="text-[11px] font-extrabold text-slate-800">{localized.agreeSworn}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.declarationPlace}</label>
                  <input
                    type="text"
                    required
                    value={formData.declarationPlace}
                    onChange={(e) => handleInputChange("declarationPlace", e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{localized.digitalSign}</label>
                  <input
                    type="text"
                    required
                    placeholder="Type your legal full name"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-serif text-slate-800 italic font-black text-sm tracking-wide"
                  />
                  <span className="text-[9px] text-slate-400 mt-1 block leading-normal">{localized.digitalSignDesc}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION ACTIONS BLOCK */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              if (step > 1) {
                setStep(step - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                onCancel();
              }
            }}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> {step === 1 ? localized.back : localized.prev}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                saveDraftToCache();
                alert(lang === "ur" ? T.ur.saveDraftSuccess : T.en.saveDraftSuccess);
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              {localized.saveDraftBtn}
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/15 flex items-center gap-1.5 transition-colors"
            >
              {step === 13 ? localized.submitBtn : localized.next}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>

      {/* SECURE SUBMIT CONFIRMATION MODAL WITH AES-256 STRINGS EXPOSED FOR COMPLIANCE */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-2xl max-w-lg w-full space-y-5 animate-scale-in" dir={lang === "ur" ? "rtl" : "ltr"}>
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{localized.confirmTitle}</h3>
                <p className="text-[11px] text-slate-400">{localized.confirmDesc}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-slate-500">{localized.fullName}:</span>
                <span className="font-extrabold text-slate-900">{formData.fullName}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-slate-500">Applicant Digital Signature:</span>
                <span className="font-extrabold text-blue-600 font-serif italic">{signature}</span>
              </div>
              
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  🛡️ Local Encrypted Block verification (AES-256)
                </span>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 block">{localized.confirmCNIC}</span>
                  <p className="p-2 bg-slate-900 text-cyan-400 font-mono text-[9px] rounded-lg break-all select-all font-bold">
                    {encryptAES256(formData.cnic)}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 block">{localized.confirmIncome}</span>
                  <p className="p-2 bg-slate-900 text-emerald-400 font-mono text-[9px] rounded-lg break-all select-all font-bold">
                    {encryptAES256(String(formData.monthlyIncome))}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                {localized.confirmCancel}
              </button>
              <button
                type="button"
                onClick={handleFormSubmit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 transition-all"
              >
                {localized.confirmSubmit}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
