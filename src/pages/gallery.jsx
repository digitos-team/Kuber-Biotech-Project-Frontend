import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getContent } from '../utils/content';
import { Camera, Image, Smile, Zap } from 'lucide-react';

const icons = [Camera, Image, Smile, Zap, Camera]; // Simple icon rotation for categories

// Image paths with proper URL encoding for spaces
const images = [
  "/Product%20Packaging%20Image.png",
  "/Field.jpg",
  "/BeforeAndAfter.jpg",
  "/Farmer%20Sucess%20Stories.jpg",
  "/Agriculture%20Events%20and%20Workshops.jpg"
];

const Gallery = () => {
  const { lang } = useLanguage();
  const content = getContent(lang);
  const { gallery } = content;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12 border-b-2 border-green-600 pb-3 inline-block relative left-1/2 -translate-x-1/2">
          {gallery.title}
        </h2>

        <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-12">
          {lang === 'mr'
            ? 'गुणवत्ता, अनुप्रयोग आणि शेतकरी यशाप्रती आमच्या बांधिलकीचे दृश्य प्रदर्शन.'
            : 'A visual showcase of our commitment to quality, application, and farmer success.'}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gallery.categories.map((category, index) => {
            const Icon = icons[index % icons.length];
            const imageSrc = images[index % images.length];
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-green-500 flex flex-col hover:shadow-xl transition-shadow duration-300">
                <div className="h-56 w-full overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6 flex flex-col items-center text-center flex-grow">
                  <div className="p-3 bg-green-100 rounded-full mb-4 text-green-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{category}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Gallery;