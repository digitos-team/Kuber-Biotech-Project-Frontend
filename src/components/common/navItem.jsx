import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ item }) => {
  // item.icon is a Lucide component passed from navigation array in content.js
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => `px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 flex items-center space-x-2 
          ${isActive
          ? 'bg-green-600 text-white shadow-lg'
          : 'text-gray-700 hover:bg-green-100 hover:text-green-700'
        } lg:text-base`}
    >
      <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
      <span>{item.name}</span>
    </NavLink>
  );
};

export default NavItem;