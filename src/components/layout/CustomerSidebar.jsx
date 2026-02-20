'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const navigation = (category) => [
  { name: 'Dashboard', href: `/dashboard/customer/${category}`, icon: HomeIcon },
  { name: 'Billing', href: `/dashboard/customer/${category}/billing`, icon: DocumentTextIcon },
  { name: 'Usage', href: `/dashboard/customer/${category}/usage`, icon: ChartBarIcon },
  { name: 'Profile', href: `/dashboard/customer/${category}/profile`, icon: UserIcon },
  { name: 'Report Outage', href: '/outage', icon: ExclamationTriangleIcon },
  { name: 'Vacation', href: '/vacation', icon: CalendarIcon },
];

export default function CustomerSidebar({ category }) {
  const pathname = usePathname();
  const navigationItems = navigation(category);

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r">
        <div className="flex items-center flex-shrink-0 px-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Customer {category}
          </h2>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Category-specific info */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 w-full group block">
            <p className="text-xs text-gray-400">Your Category</p>
            <p className="text-sm font-medium text-gray-700">{category}</p>
            <p className="text-xs text-gray-500 mt-1">
              {getCategoryDescription(category)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryDescription(category) {
  const descriptions = {
    R1: 'Residential (0-100 kWh/month)',
    R2: 'Residential (101-200 kWh/month)',
    R3: 'Residential (201-300 kWh/month)',
    R4: 'Residential (301-500 kWh/month)',
    R5: 'Residential (500+ kWh/month)',
    C1: 'Commercial - Small',
    C2: 'Commercial - Large',
  };
  return descriptions[category] || '';
}
