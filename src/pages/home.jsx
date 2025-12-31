import React from 'react';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getContent } from '../utils/content';
import { Link } from 'react-router-dom';

// Map string icon names from content.js to Lucide components
const IconMap = {
  Leaf: LucideIcons.Leaf,
  Droplet: LucideIcons.Droplet,
  Scale: LucideIcons.Scale,
  Zap: LucideIcons.Zap,
  CheckCircle: LucideIcons.CheckCircle
};

const Home = () => {
  const { lang } = useLanguage();
  const content = getContent(lang);
  const { home } = content;

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/Hero Section.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-green-400 font-bold tracking-widest uppercase mb-4 animate-fadeIn">{home.tagline}</p>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight animate-slideUp">
            {home.welcome}
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto animate-slideUp delay-100">
            {home.description}
          </p>
          <Link
            to="/products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 md:py-4 md:px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounce"
          >
            {home.viewProducts}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* What We Offer */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 relative inline-block">
              {home.whatWeOffer}
              <span className="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded-full"></span>
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {home.offerings.map((item, index) => {
              const ItemIcon = IconMap[item.icon];
              return (
                <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300 mx-auto">
                    {ItemIcon && <ItemIcon className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" />}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 text-center mb-2">{item.name}</h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="bg-green-700 p-8 md:p-12 text-white flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-8">{home.whyChooseUsTitle}</h3>
              <div className="space-y-6">
                {home.whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-green-600 p-2 rounded-lg flex-shrink-0">
                      <IconMap.CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-base md:text-lg leading-relaxed">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center items-center bg-gray-50 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">{home.readyToStart}</h3>
              <p className="text-gray-600 mb-8 text-base md:text-lg">{home.experienceQuality}</p>
              <p className="text-xl md:text-2xl font-bold text-green-700 mb-8 border-b-2 border-green-200 pb-2 inline-block">
                {home.callToAction}
              </p>
              <Link
                to="/contact"
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
              >
                {home.contactUsNow}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;