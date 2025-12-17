// src/utils/content.js
import * as LucideIcons from 'lucide-react';

// --- Configuration ---
export const COMPANY_NAME = {
  en: "Kuber Biotech",
  mr: "कुबेर बायोटेक"
};
export const FOOTER_YEAR = new Date().getFullYear();

// Define navigation items
export const getNavigation = (lang) => [
  { name: lang === 'mr' ? 'मुख्यपृष्ठ' : 'Home', path: '/', icon: LucideIcons.Leaf },
  { name: lang === 'mr' ? 'आमच्याबद्दल' : 'About Us', path: '/about', icon: LucideIcons.Users },
  { name: lang === 'mr' ? 'उत्पादने' : 'Products', path: '/products', icon: LucideIcons.Store },
  { name: lang === 'mr' ? 'गॅलरी' : 'Gallery', path: '/gallery', icon: LucideIcons.Zap },
  { name: lang === 'mr' ? 'संपर्क' : 'Contact', path: '/contact', icon: LucideIcons.Mail },
];

// For backward compatibility
export const navigation = getNavigation('en');

// --- Bilingual Content ---
export const getContent = (lang) => ({
  home: {
    tagline: lang === 'mr'
      ? "उत्कृष्टता जोपासणे, यश कापणी करणे."
      : "Cultivating Excellence, Harvesting Success.",
    welcome: lang === 'mr'
      ? `${COMPANY_NAME.mr} मध्ये आपले स्वागत आहे`
      : `Welcome to ${COMPANY_NAME.en}`,
    description: lang === 'mr'
      ? "कुबेर बायोटेक प्रायव्हेट लिमिटेड ही महाराष्ट्रातील कृषी जैवतंत्रज्ञान कंपनी आहे जी पीक उत्पादन आणि मातीचे आरोग्य सुधारणारे बायोस्टिम्युलंट्स आणि सेंद्रिय खते विकसित करण्यावर लक्ष केंद्रित करते. 2023 मध्ये स्थापित, कंपनी शाश्वत शेती, गुणवत्तापूर्ण उत्पादन आणि शेतकरी-केंद्रित उपायांसाठी वचनबद्ध आहे."
      : "Kuber Biotech Pvt. Ltd. is a Maharashtra-based agricultural biotechnology company focused on developing biostimulants and organic fertilizers that improve crop yield and soil health. Established in 2023, the company is committed to sustainable farming, quality manufacturing, and farmer-centric solutions.",
    offerings: lang === 'mr' ? [
      { name: "प्रीमियम ग्रॅन्युल उत्पादने", icon: 'Leaf' },
      { name: "उच्च-कार्यक्षम द्रव खते", icon: 'Droplet' },
      { name: "सूक्ष्म पोषक द्रावण", icon: 'Scale' },
      { name: "सेंद्रिय पीक वर्धक", icon: 'Zap' },
    ] : [
      { name: "Premium Granule Products", icon: 'Leaf' },
      { name: "High-performance Liquid Fertilizers", icon: 'Droplet' },
      { name: "Micronutrient Solutions", icon: 'Scale' },
      { name: "Organic Crop Enhancers", icon: 'Zap' },
    ],
    whyChooseUs: lang === 'mr' ? [
      "अनुभवी शेतकऱ्यांचा विश्वास",
      "गुणवत्ता-तपासलेली कृषी उत्पादने",
      "तज्ञ कृषी सहाय्य",
      "जलद ग्राहक सेवा",
    ] : [
      "Trusted by experienced farmers",
      "Quality-tested agriculture products",
      "Expert agricultural support",
      "Fast customer assistance",
    ],
    callToAction: lang === 'mr'
      ? "आमची उत्पादने एक्सप्लोर करा आणि आम्ही शेतकऱ्यांना चांगले उत्पादन मिळवण्यास कशी मदत करतो ते पहा."
      : "Explore our products and see how we help farmers achieve better yields.",
    viewProducts: lang === 'mr' ? "आमची उत्पादने पहा" : "View Our Products",
    whatWeOffer: lang === 'mr' ? "आम्ही काय देतो" : "What We Offer",
    whyChooseUsTitle: lang === 'mr' ? "आम्हाला का निवडा?" : "Why Choose Us?",
    readyToStart: lang === 'mr' ? "सुरू करायला तयार आहात?" : "Ready to get started?",
    experienceQuality: lang === 'mr'
      ? "आज आमच्या उत्पादनांची गुणवत्ता आणि विश्वासार्हता अनुभवा."
      : "Experience the quality and reliability of our products today.",
    contactUsNow: lang === 'mr' ? "आता संपर्क साधा" : "Contact Us Now",
  },
  about: {
    title: lang === 'mr' ? `${COMPANY_NAME.mr} बद्दल` : `About ${COMPANY_NAME.en}`,
    intro: lang === 'mr'
      ? "कुबेर बायोटेक प्रायव्हेट लिमिटेड ही 05 सप्टेंबर 2023 रोजी स्थापन झालेली एक उदयोन्मुख कृषी जैवतंत्रज्ञान कंपनी आहे, जिचे नोंदणीकृत कार्यालय छत्रपती संभाजीनगर, महाराष्ट्र येथे आहे. कंपनी बायोस्टिम्युलंट्स, सेंद्रिय खते, सूक्ष्म पोषक आणि शाश्वत कृषी निविष्ठांच्या क्षेत्रात कार्यरत आहे, मातीचे आरोग्य आणि पर्यावरणाचे रक्षण करताना पीक उत्पादकता सुधारण्यावर लक्ष केंद्रित करते."
      : "Kuber Biotech Private Limited is an emerging agricultural biotechnology company established on 05 September 2023, with its registered office located in Chhatrapati Sambhajinagar, Maharashtra. The company operates in the field of biostimulants, organic fertilizers, micronutrients, and sustainable agricultural inputs, focusing on improving crop productivity while protecting soil health and the environment.",
    specialization: lang === 'mr'
      ? "कुबेर बायोटेक बायो-स्टिम्युलंट्स, सेंद्रिय खते, वनस्पती वाढ वर्धक, सूक्ष्म पोषक मिश्रणे आणि इको-फ्रेंडली माती कंडिशनर्सच्या निर्मितीमध्ये माहिर आहे. ही उत्पादने सेंद्रिय आणि वनस्पती-आधारित घटकांचा वापर करून वैज्ञानिकदृष्ट्या विकसित केली जातात जसे की हायड्रोलायझ्ड प्रथिने, सीव्हीड अर्क, नैसर्गिक ऍसिड आणि बायो-एक्टिव्ह संयुगे शाश्वत आणि आधुनिक शेती पद्धतींना समर्थन देण्यासाठी."
      : "Kuber Biotech specializes in the manufacturing of bio-stimulants, organic fertilizers, plant growth enhancers, micronutrient mixtures, and eco-friendly soil conditioners. These products are scientifically developed using organic and plant-based ingredients such as hydrolyzed proteins, seaweed extracts, natural acids, and bio-active compounds to support sustainable and modern farming practices.",
    philosophy: lang === 'mr'
      ? "कंपनीचा असा विश्वास आहे की शाश्वत शेती हे शेतीचे भविष्य आहे. पारंपारिक कृषी ज्ञान आणि आधुनिक जैवतंत्रज्ञानाची सांगड घालून, कुबेर बायोटेकचे उद्दिष्ट शेतकऱ्यांना पिकांचे आरोग्य सुधारण्यास, उत्पादन वाढवण्यास आणि रासायनिक खतांवरील अवलंबित्व कमी करण्यास मदत करणे आहे. तिची उत्पादने मातीतील सूक्ष्मजीव क्रियाकलापांना चालना देण्यासाठी, मातीची सुपीकता पुनर्संचयित करण्यासाठी आणि पिकांमधील हानिकारक रासायनिक अवशेष कमी करण्यासाठी डिझाइन केलेली आहेत."
      : "The company is guided by the belief that sustainable agriculture is the future of farming. By combining traditional agricultural knowledge with modern biotechnology, Kuber Biotech aims to help farmers enhance crop health, increase yield, and reduce dependency on chemical fertilizers. Its products are designed to promote microbial activity in soil, restore soil fertility, and minimize harmful chemical residues in crops.",
    management: lang === 'mr'
      ? "कुबेर बायोटेक प्रायव्हेट लिमिटेडचे व्यवस्थापन श्री. गजेंद्र एस. राठोड आणि श्री. शेखर कुबेर करत आहेत, जे शेतकरी-केंद्रित कृषी उपाय विकसित करण्याच्या दिशेने अनुभव आणि वचनबद्धता आणतात. कंपनी आपल्या उत्पादन प्रक्रियेत कठोर गुणवत्ता नियंत्रण पद्धती राखते आणि संशोधन, क्षेत्र कामगिरी विश्लेषण आणि शेतकऱ्यांच्या अभिप्रायद्वारे आपली फॉर्म्युलेशन सतत सुधारते."
      : "Kuber Biotech Pvt. Ltd. is managed by Mr. Gajendra S. Rathod and Mr. Shekhar Kuber, who bring experience and commitment toward developing farmer-centric agricultural solutions. The company maintains strict quality control practices across its manufacturing processes and continuously improves its formulations through research, field performance analysis, and farmer feedback.",
    operations: lang === 'mr'
      ? "सुमारे 30 कर्मचाऱ्यांच्या टीमसह, कुबेर बायोटेक उत्पादन, विपणन, विक्री, वित्त, एचआर आणि ग्राहक समर्थन विभागांमध्ये मजबूत समन्वय सुनिश्चित करते, ज्यामुळे कार्यक्षम ऑपरेशन्स आणि वेळेवर सेवा वितरण शक्य होते. कंपनी शेतकरी, डीलर्स आणि वितरकांसह दीर्घकालीन संबंध निर्माण करण्याच्या दिशेने काम करत आहे आणि भारतीय शेतीच्या शाश्वत विकासात योगदान देत आहे."
      : "With a team of approximately 30 employees, Kuber Biotech ensures strong coordination between production, marketing, sales, finance, HR, and customer support departments, enabling efficient operations and timely service delivery. The company continues to work towards building long-term relationships with farmers, dealers, and distributors while contributing to the sustainable development of Indian agriculture.",
    vision: {
      title: lang === 'mr' ? "आमची दृष्टी" : "Our Vision",
      text: lang === 'mr'
        ? "सुरक्षित, इको-फ्रेंडली आणि वैज्ञानिकदृष्ट्या विकसित कृषी उपायांद्वारे शेतकऱ्यांना पाठिंबा देणे आणि शाश्वत शेती पद्धतींना प्रोत्साहन देणे."
        : "To support farmers through safe, eco-friendly, and scientifically developed agricultural solutions while promoting sustainable farming practices.",
      icon: 'Target',
    },
    mission: {
      title: lang === 'mr' ? "आमचे ध्येय" : "Our Mission",
      points: lang === 'mr' ? [
        "पीक उत्पादकता सुधारणे",
        "संतुलित आणि सेंद्रिय शेतीला पाठिंबा",
        "संशोधन-आधारित उपाय वितरित करणे",
        "सातत्यपूर्ण गुणवत्तेने विश्वास निर्माण करणे",
      ] : [
        "Improve crop productivity",
        "Support balanced and organic farming",
        "Deliver research-based solutions",
        "Build trust with consistent quality",
      ],
      icon: 'Factory',
    },
    coreValues: {
      title: lang === 'mr' ? "मूळ मूल्ये" : "Core Values",
      values: lang === 'mr'
        ? ["गुणवत्ता", "वचनबद्धता", "नवकल्पना", "शेतकरी समर्थन"]
        : ["Quality", "Commitment", "Innovation", "Farmer Support"],
    },
  },
  gallery: {
    title: lang === 'mr' ? "आमची गॅलरी" : "Our Gallery",
    categories: lang === 'mr' ? [
      "उत्पादन पॅकेजिंग फोटो",
      "फील्ड अनुप्रयोग चित्रे",
      "पीक परिणाम आधी आणि नंतर",
      "शेतकरी यशोगाथा",
      "कृषी कार्यक्रम आणि कार्यशाळा",
    ] : [
      "Product packaging photos",
      "Field application pictures",
      "Before and after crop results",
      "Farmer success stories",
      "Agricultural events and workshops",
    ],
  },
  contact: {
    title: lang === 'mr' ? "आमच्याशी संपर्क साधा" : "Contact Us",
    address: lang === 'mr'
      ? "ब्लॉक क्र. 105, वास्तुशिल्प अपार्टमेंट, देवलाई रोड, बीड बायपास, छत्रपती संभाजीनगर, महाराष्ट्र – 431010, भारत"
      : "Block No. 105, Vastushilpa Apartment, Devlai Road, Beed Bypass, Chhatrapati Sambhajinagar, Maharashtra – 431010, India",
    phone: "+91 9850244123",
    email: "info@kuberbiotech.com", // Assuming generic email or placeholder if not provided
    reportSection: lang === 'mr'
      ? "ग्राहक उत्पादन समर्थन किंवा अभिप्रायासाठी येथे त्यांची रिपोर्ट आयडी तयार करू शकतात किंवा सबमिट करू शकतात."
      : "Customers can generate or submit their Report ID here for product support or feedback.",
    sendMessage: lang === 'mr' ? "संदेश पाठवा" : "Send Message",
    namePlaceholder: lang === 'mr' ? "तुमचे नाव" : "Your Name",
    emailPlaceholder: lang === 'mr' ? "तुमचा ईमेल" : "Your Email",
    messagePlaceholder: lang === 'mr' ? "तुमचा संदेश" : "Your Message",
  },
  footer: {
    rights: lang === 'mr' ? "सर्व हक्क राखीव." : "All rights reserved.",
    registeredOffice: {
      title: lang === 'mr' ? "नोंदणीकृत कार्यालय" : "Registered Office",
      address: lang === 'mr'
        ? ["ब्लॉक क्र. 105, वास्तुशिल्प अपार्टमेंट,", "देवलाई रोड, बीड बायपास,", "छत्रपती संभाजीनगर,", "महाराष्ट्र – 431010, भारत"]
        : ["Block No. 105, Vastushilpa Apartment,", "Devlai Road, Beed Bypass,", "Chhatrapati Sambhajinagar,", "Maharashtra – 431010, India"]
    },
    manufacturingUnit: {
      title: lang === 'mr' ? "उत्पादन युनिट" : "Manufacturing Unit",
      address: lang === 'mr'
        ? ["सर्वे क्र. 45/4/5, गुरु व्हिला,", "केरू बोरहाडे मळा, जेल रोड,", "नाशिक – 422001, महाराष्ट्र, भारत"]
        : ["Survey No. 45/4/5, Guru Villa,", "Keru Borhade Mala, Jail Road,", "Nashik – 422001, Maharashtra, India"]
    },
    contactDetails: {
      title: lang === 'mr' ? "संपर्क तपशील" : "Contact Details",
      phone: "+91 9850244123",
      website: "https://kuberbiotech.com/"
    },
    workingHours: {
      title: lang === 'mr' ? "कामाचे तास" : "Working Hours",
      weekdays: lang === 'mr' ? "सोमवार – शुक्रवार: 10:30 AM – 8:00 PM" : "Monday – Friday: 10:30 AM – 8:00 PM",
      saturday: lang === 'mr' ? "शनिवार: 10:30 AM – 3:00 PM" : "Saturday: 10:30 AM – 3:00 PM",
      sunday: lang === 'mr' ? "रविवार: बंद" : "Sunday: Closed"
    },
    businessFocus: {
      title: lang === 'mr' ? "व्यवसाय फोकस" : "Business Focus",
      items: lang === 'mr'
        ? ["बायोस्टिम्युलंट्स", "सेंद्रिय खते", "सूक्ष्म पोषक", "वनस्पती वाढ वर्धक", "शाश्वत कृषी निविष्ठा"]
        : ["Biostimulants", "Organic Fertilizers", "Micronutrients", "Plant Growth Enhancers", "Sustainable Agricultural Inputs"]
    },
    visionStatement: lang === 'mr'
      ? "सुरक्षित, इको-फ्रेंडली आणि वैज्ञानिकदृष्ट्या विकसित कृषी उपायांद्वारे शेतकऱ्यांना पाठिंबा देणे आणि शाश्वत शेती पद्धतींना प्रोत्साहन देणे."
      : "To support farmers through safe, eco-friendly, and scientifically developed agricultural solutions while promoting sustainable farming practices."
  },
  products: {
    title: lang === 'mr' ? "आमची उत्पादने" : "Our Products",
    granuleProducts: lang === 'mr' ? "ग्रॅन्युल उत्पादने" : "Granule Products",
    liquidProducts: lang === 'mr' ? "द्रव उत्पादने" : "Liquid Products",
    noProducts: lang === 'mr' ? "कोणतीही उत्पादने सापडली नाहीत." : "No products found.",
    noCategory: lang === 'mr'
      ? "सध्या या श्रेणीतील उत्पादने उपलब्ध नाहीत."
      : "No products available in this category at the moment.",
  },
});

// For backward compatibility
export const content = getContent('en');