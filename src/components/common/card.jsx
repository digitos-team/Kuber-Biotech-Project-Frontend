import React from 'react';

const Card = ({ title, icon: Icon, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border border-green-100">
    <div className="flex items-center mb-4 text-green-600">
      <Icon className="w-7 h-7 mr-3" />
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

export default Card;