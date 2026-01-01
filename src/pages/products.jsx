import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getContent } from '../utils/content';
import ProductItem from '../components/products/productItem';
import { getAllProducts } from '../api/productApi';

const Products = () => {
  const { lang } = useLanguage();
  const content = getContent(lang);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Granule Products');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch ALL data (both languages) with cache busting
        const response = await getAllProducts(1, 100, null, Date.now());
        console.log("Products API response:", response);

        let productsList = [];
        const responseData = response.data?.data || response.data;

        if (Array.isArray(responseData)) {
          const innerArray = responseData.find(item => Array.isArray(item));
          if (innerArray) productsList = innerArray;
          else productsList = responseData;
        } else if (responseData?.products) {
          productsList = responseData.products;
        }

        const validProducts = Array.isArray(productsList)
          ? productsList.filter(item => item && typeof item === 'object')
          : [];

        setProducts(validProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(lang === 'mr' ? "उत्पादने लोड करण्यात अयशस्वी." : "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Run ONCE on mount (no language dependency needed)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  // Filter based on "en" category (database always stores { en: "Granule Products", mr: "..." })
  // We use .en or check if category is object
  const getCategoryEn = (p) => p.category?.en || p.category || "";

  const granuleProducts = products.filter(p => getCategoryEn(p) === 'Granule Products');
  const liquidProducts = products.filter(p => getCategoryEn(p) === 'Liquid Products');

  // Determine which products to show based on active tab
  const displayedProducts = activeCategory === 'Granule Products' ? granuleProducts : liquidProducts;

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-8">{content.products.title}</h2>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-lg shadow-md flex flex-col sm:flex-row w-full max-w-md">
            <button
              onClick={() => setActiveCategory('Granule Products')}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${activeCategory === 'Granule Products'
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-green-600'
                }`}
            >
              {content.products.granuleProducts}
            </button>
            <button
              onClick={() => setActiveCategory('Liquid Products')}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${activeCategory === 'Liquid Products'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              {content.products.liquidProducts}
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">{content.products.noProducts}</p>
        ) : (
          <div>
            {displayedProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 animate-fadeIn">
                {displayedProducts.map((item, index) => {
                  // Select language content safely
                  const displayName = item.name?.[lang] || item.name?.en || item.name || "Product";
                  const displayDesc = item.description?.[lang] || item.description?.en || item.description || "";

                  return (
                    <ProductItem
                      key={item._id || index}
                      name={displayName}
                      benefits={displayDesc ? [displayDesc] : []}
                      iconKey={activeCategory === 'Granule Products' ? "Leaf" : "Droplet"}

                      images={item.images}
                      image={item.image}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">{content.products.noCategory}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;