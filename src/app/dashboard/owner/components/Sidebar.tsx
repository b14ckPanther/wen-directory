'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, Settings, LogOut, LucideIcon, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type NavItem = { href: string; icon: LucideIcon; label: string };

const navItems: NavItem[] = [
  { href: '/dashboard/owner', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { href: '/dashboard/owner/products', icon: Store, label: 'المنتجات/الخدمات' },
  { href: '/dashboard/owner/settings', icon: Settings, label: 'إعدادات الحساب' },
];

const NavLink = ({ item, onClick }: { item: NavItem; onClick?: () => void }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  const content = (
    <div
      onClick={onClick}
      className={`flex items-center justify-center p-3 rounded-lg cursor-pointer group relative ${
        isActive
          ? 'bg-gold text-navy'
          : 'text-gray-400 hover:bg-gold/10 hover:text-gold'
      }`}
    >
      <item.icon size={24} />
      {/* Tooltip shows on left side since sidebar is on the right */}
      <span className="absolute right-14 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-[#0A1024] text-xs font-bold transition-all duration-100 scale-0 group-hover:scale-100">
        {item.label}
      </span>
    </div>
  );

  return onClick ? (
    <button onClick={onClick} className="w-full">
      {content}
    </button>
  ) : (
    <Link href={item.href} className="w-full">
      {content}
    </Link>
  );
};

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside
      className="fixed top-0 right-0 h-screen w-20
                 bg-[#1B2A41] p-4 flex flex-col
                 justify-between items-center
                 border-l border-gray-800 z-50"
    >
      {/* Top Section */}
<nav className="flex flex-col items-center gap-8">
  {/* Logo (static, not a link anymore) */}
  <div className="w-12 h-12 bg-gold flex items-center justify-center rounded-2xl text-navy text-2xl font-bold font-dancing">
    W
  </div>

  {/* Functional nav items */}
  <div className="space-y-4">
    {navItems.map((item) => (
      <NavLink key={item.label} item={item} />
    ))}
  </div>
</nav>


      {/* Bottom Section */}
      <div className="space-y-4">
        <NavLink item={{ href: '#', icon: HelpCircle, label: 'المساعدة' }} />
        <NavLink
          item={{ href: '#', icon: LogOut, label: 'تسجيل الخروج' }}
          onClick={logout}
        />
      </div>
    </aside>
  );
}
