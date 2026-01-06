import React, { useState } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import WhatsAppBuyButton from '../common/WhatsAppBuyButton';
import { Leaf, Droplet } from 'lucide-react';

const IconMap = {
  Leaf,
  Droplet,
};

const ProductItem = ({ name, benefits, iconKey, image, images }) => {
  const Icon = IconMap[iconKey];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-l-4 border-green-500 flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-2xl">

      {allImages.length > 0 && (
        <div className="h-64 w-full overflow-hidden relative group bg-white p-4 flex items-center justify-center border-b border-gray-100">
          <img
            src={allImages[currentImageIndex]}
            alt={name}
            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
          />

          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* ✅ FIXED BACKTICK ERROR HERE */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
                {allImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex
                      ? 'bg-green-500 w-4'
                      : 'bg-gray-300'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          {Icon && allImages.length === 0 && (
            <Icon className="w-6 h-6 text-green-600 mr-3" />
          )}
          <h4 className="text-xl font-bold text-gray-800 line-clamp-1">
            {name}
          </h4>
        </div>



        <ul className="space-y-2 text-gray-600 mb-6 flex-grow">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start text-sm leading-tight">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <WhatsAppBuyButton productName={name} />
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
