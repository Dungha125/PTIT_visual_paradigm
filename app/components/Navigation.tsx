"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shapes } from 'lucide-react';
import AuthButton from './AuthButton';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Trang chủ' },
    { href: '/features', label: 'Tính năng' },
    { href: '/about', label: 'Giới thiệu' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Shapes className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">UML Designer</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <AuthButton />
            <Link 
              href="/uml-designer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Bắt đầu thiết kế
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
