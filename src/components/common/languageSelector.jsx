import React from 'react';
import { Globe } from 'lucide-react';

const LanguageSelector = ({ lang, setLang }) => {
    return (
        <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gray-600" />
            <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
            >
                <option value="en">English</option>
                <option value="mr">Marathi</option>
            </select>
        </div>
    );
};

export default LanguageSelector;
