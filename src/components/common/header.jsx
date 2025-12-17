import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { COMPANY_NAME, getNavigation } from '../../utils/content';
import LanguageSelector from './languageSelector';
import NavItem from './navItem';

const Header = () => {
  const { lang, setLang } = useLanguage();
  const navigation = getNavigation(lang);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center flex-wrap">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/Kuber Logo(1)(1).png"
            alt={COMPANY_NAME[lang]}
            className="h-14 w-auto object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-2">
          {navigation.map(item => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <LanguageSelector lang={lang} setLang={setLang} />
        </div>

        {/* Mobile Menu */}
        <nav className="w-full lg:hidden mt-2 flex justify-center space-x-1 sm:space-x-3 overflow-x-auto pb-1">
          {navigation.map(item => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;