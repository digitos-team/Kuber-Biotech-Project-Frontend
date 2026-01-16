import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { COMPANY_NAME, FOOTER_YEAR, getContent } from '../../utils/content';
import { MapPin, Phone, Globe, Clock, Calendar, XCircle, Instagram, Facebook, MessageCircle } from 'lucide-react';

const Footer = () => {
  const { lang } = useLanguage();
  const content = getContent(lang);
  const { footer } = content;

  return (
    <footer className="bg-gray-900 text-white mt-12 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">

          {/* Company Info & Registered Office */}
          <div>
            <h3 className="text-xl font-bold text-green-400 mb-4">{COMPANY_NAME[lang]}</h3>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              {footer.visionStatement}
            </p>
            <h4 className="text-lg font-semibold text-white mb-2 border-b border-gray-700 pb-1 inline-block">
              {footer.registeredOffice.title}
            </h4>
            <div className="text-gray-400 text-sm space-y-1">
              {footer.registeredOffice.address.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>

          {/* Manufacturing Unit & Business Focus */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-1 inline-block">
              {footer.manufacturingUnit.title}
            </h4>
            <div className="flex items-start space-x-2 text-gray-400 text-sm mb-6">
              <MapPin className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              <div>
                {footer.manufacturingUnit.address.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>

            <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-1 inline-block">
              {footer.businessFocus.title}
            </h4>
            <ul className="text-gray-400 text-sm space-y-1">
              {footer.businessFocus.items.map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-1 inline-block">
              {footer.workingHours.title}
            </h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span>{footer.workingHours.weekdays}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-green-500" />
                <span>{footer.workingHours.saturday}</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>{footer.workingHours.sunday}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="border-t border-gray-800 pt-8 pb-6">
          <div className="flex justify-center items-center gap-6">
            <a
              href="https://www.instagram.com/kuber.biotech?utm_source=qr&igsh=MWwxZXM0Y2tocWZpbA=="
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-3 rounded-full hover:scale-110 transition-transform duration-300 shadow-lg"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://www.facebook.com/share/1DZTiBGbpV/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 p-3 rounded-full hover:scale-110 transition-transform duration-300 shadow-lg"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://wa.me/919850244123"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 p-3 rounded-full hover:scale-110 transition-transform duration-300 shadow-lg"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            &copy; {FOOTER_YEAR} {COMPANY_NAME[lang]}. {footer.rights}
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-600">
            <button className="hover:text-green-400 transition-colors bg-none border-none cursor-pointer">
              {lang === 'mr' ? 'गोपनीयता धोरण' : 'Privacy Policy'}
            </button>
            <span>|</span>
            <button className="hover:text-green-400 transition-colors bg-none border-none cursor-pointer">
              {lang === 'mr' ? 'अटी व शर्ती' : 'Terms & Conditions'}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-700">
            {lang === 'mr' ? 'कृषी विकासासाठी डिझाइन केलेले' : 'Designed for Agriculture Growth'}
          </p>
          <p className="mt-1 text-xs text-gray-600">
            Design By Digitos IT Solution
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;