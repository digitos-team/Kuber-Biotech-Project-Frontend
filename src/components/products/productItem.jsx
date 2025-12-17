import React, { useState } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import WhatsAppBuyButton from '../common/WhatsAppBuyButton';

// Map string icon names used for product types
const IconMap = {
  Leaf: LucideIcons.Leaf,
  Droplet: LucideIcons.Droplet,
};

const ProductItem = ({ name, benefits, iconKey, image, images, price }) => {
  const Icon = IconMap[iconKey];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Combine images array and single image prop into one list
  const allImages = [];
  if (images && Array.isArray(images)) {
    allImages.push(...images);
  } else if (image) {
    allImages.push(image);
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-l-4 border-green-500 flex flex-col overflow-hidden">
      {allImages.length > 0 && (
        <div className="h-48 w-full overflow-hidden relative group">
          <img
            src={allImages[currentImageIndex]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />

          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {allImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center mb-3">
          {Icon && allImages.length === 0 && <Icon className="w-6 h-6 text-green-600 mr-3" />}
          <h4 className="text-xl font-bold text-gray-800">{name}</h4>
        </div>
        {price && (
          <p className="text-lg font-semibold text-green-600 mb-2">₹{price}</p>
        )}
        <ul className="space-y-1 text-gray-600 ml-1 flex-grow mb-4">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <WhatsAppBuyButton productName={name} price={price} />
      </div>
    </div>
  );
};

export default ProductItem;