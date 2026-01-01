import React, { useState, useEffect } from 'react';
import { Download, ChevronDown, FileText, Menu, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { COMPANY_NAME, getNavigation } from '../../utils/content';
import LanguageSelector from './languageSelector';
import NavItem from './navItem';
import { getAllBrochures, downloadBrochure } from '../../api/brochureApi';

const Header = () => {
  const { lang, setLang } = useLanguage();
  const navigation = getNavigation(lang);
  const [brochures, setBrochures] = useState([]);
  const [showBrochureDropdown, setShowBrochureDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBrochures();
  }, []);

  const fetchBrochures = async () => {
    try {
      const response = await getAllBrochures();
      const responseData = response.data?.data || response.data;
      let brochuresList = [];

      if (Array.isArray(responseData)) {
        brochuresList = responseData;
      } else if (responseData?.brochures) {
        brochuresList = responseData.brochures;
      }

      const validBrochures = Array.isArray(brochuresList)
        ? brochuresList.filter(item => item && typeof item === 'object')
        : [];

      setBrochures(validBrochures);
    } catch (error) {
      console.error("Error fetching brochures:", error);
    }
  };

  const handleDownloadBrochure = async (brochureId, filename) => {
    setLoading(true);
    try {
      const response = await downloadBrochure(brochureId);

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'brochure.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setShowBrochureDropdown(false);
    } catch (error) {
      console.error("Error downloading brochure:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center flex-wrap">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/Kuber Logo(1)(1).png"
            alt={COMPANY_NAME[lang]}
            className="h-10 sm:h-14 w-auto object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-2">
          {navigation.map(item => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-4">
            {/* Brochure Download Dropdown */}
            {brochures.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowBrochureDropdown(!showBrochureDropdown)}
                  className="flex items-center space-x-1 sm:space-x-2 bg-green-600 hover:bg-green-700 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-300 font-medium text-sm sm:text-base"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden md:inline">{lang === 'mr' ? 'माहितीपत्र' : 'Brochures'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showBrochureDropdown && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowBrochureDropdown(false)}
                    ></div>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-lg shadow-xl z-20 border border-gray-200 max-h-96 overflow-y-auto">
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="text-sm font-bold text-gray-800">
                          {lang === 'mr' ? 'माहितीपत्र डाउनलोड करा' : 'Download Brochures'}
                        </h3>
                      </div>
                      <div className="py-2">
                        {brochures.map((brochure) => (
                          <button
                            key={brochure._id}
                            onClick={() => handleDownloadBrochure(brochure._id, brochure.filename)}
                            disabled={loading}
                            className="w-full px-4 py-3 hover:bg-gray-50 transition-colors duration-200 flex items-start space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FileText className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium text-gray-800 line-clamp-2">
                                {brochure.title || brochure.filename || 'Brochure'}
                              </p>
                              {brochure.filesize && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {(brochure.filesize / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              )}
                            </div>
                            <Download className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <LanguageSelector lang={lang} setLang={setLang} />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="w-full lg:hidden mt-4 py-4 border-t border-gray-100 flex flex-col space-y-2 animate-slideDown">
            {navigation.map(item => (
              <div key={item.path} onClick={() => setIsMenuOpen(false)}>
                <NavItem item={item} />
              </div>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;