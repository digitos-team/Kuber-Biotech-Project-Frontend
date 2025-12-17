// src/utils/content.js
import * as LucideIcons from 'lucide-react';

// --- Configuration ---
export const COMPANY_NAME = "AgriGrow Solutions";
export const FOOTER_YEAR = new Date().getFullYear();

// Define navigation items
export const navigation = [
  { name: 'Home', path: 'home', icon: LucideIcons.Leaf },
  { name: 'About Us', path: 'about', icon: LucideIcons.Users },
  { name: 'Products', path: 'products', icon: LucideIcons.Store },
  { name: 'Gallery', path: 'gallery', icon: LucideIcons.Zap },
  { name: 'Contact', path: 'contact', icon: LucideIcons.Mail },
];

// --- Main Content Based on Research Report ---
export const content = {
  home: {
    tagline: "Cultivating Excellence, Harvesting Success.",
    welcome: `Welcome to ${COMPANY_NAME}`,
    description: "We specialize in manufacturing high-quality Granules and Liquid Agricultural Products created to improve soil health, crop strength, and farmer productivity.",
    offerings: [
      { name: "Premium Granule Products", icon: 'Leaf' },
      { name: "High-performance Liquid Fertilizers", icon: 'Droplet' },
      { name: "Micronutrient Solutions", icon: 'Scale' },
      { name: "Organic Crop Enhancers", icon: 'Zap' },
    ],
    whyChooseUs: [
      "Trusted by experienced farmers",
      "Quality-tested agriculture products",
      "Expert agricultural support",
      "Fast customer assistance",
    ],
    callToAction: "Explore our products and see how we help farmers achieve better yields.",
  },
  about: {
    title: `About ${COMPANY_NAME}`,
    intro: "We are a dedicated agriculture solutions provider offering innovative and reliable products to improve crop health and soil productivity. Our experience in the farming industry helps us manufacture effective and affordable fertilizers that support sustainable agriculture.",
    vision: {
      title: "Our Vision",
      text: "To deliver modern, affordable, and efficient agricultural products that empower farmers nationwide.",
      icon: 'Target',
    },
    mission: {
      title: "Our Mission",
      points: [
        "Improve crop productivity",
        "Support balanced and organic farming",
        "Deliver research-based solutions",
        "Build trust with consistent quality",
      ],
      icon: 'Factory',
    },
    coreValues: {
      title: "Core Values",
      values: ["Quality", "Commitment", "Innovation", "Farmer Support"],
    },
  },
  products: {
    granule: {
      title: "Premium Granule Products",
      icon: 'Leaf',
      items: [
        { name: "Soil Conditioner Granules", benefits: ["Improves soil structure", "Enhances root development", "Helps retain soil nutrients"] },
        { name: "Organic Fertilizer Granules", benefits: ["Provides essential nutrients", "Promotes strong plant growth", "Supports sustainable farming"] },
        { name: "Pest Control Granules", benefits: ["Reduces soil-based pests", "Safe for crops", "Long-lasting protection"] },
      ],
    },
    liquid: {
      title: "High-Performance Liquid Products",
      icon: 'Droplet',
      items: [
        { name: "Liquid Fertilizer", benefits: ["Boosts nutrient absorption", "Improves plant growth", "Helps increase yield"] },
        { name: "Micronutrient Liquid", benefits: ["Corrects nutrient deficiencies", "Strengthens plant health", "Enhances crop performance"] },
        { name: "Bio-Liquid Booster", benefits: ["Organic plant growth enhancer", "Improves immunity and yield", "Supports eco-friendly farming"] },
      ],
    },
  },
  gallery: {
    title: "Our Gallery",
    categories: [
      "Product packaging photos",
      "Field application pictures",
      "Before and after crop results",
      "Farmer success stories",
      "Agricultural events and workshops",
    ],
  },
  contact: {
    address: "[Enter Company Address]",
    phone: "[Enter Phone Number]",
    email: "[Enter Email Address]",
    reportSection: "Customers can generate or submit their Report ID here for product support or feedback.",
  },
};