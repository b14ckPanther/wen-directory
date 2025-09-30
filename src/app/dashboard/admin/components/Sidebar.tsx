'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Users, Layers, Settings, LifeBuoy, LogOut, LucideIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type NavItem = {
    href: string;
    icon: LucideIcon;
    label: string;
};

const navItems: NavItem[] = [
    { href: '/dashboard/admin', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { href: '/dashboard/admin/businesses', icon: Briefcase, label: 'إدارة الأعمال' },
    { href: '/dashboard/admin/users', icon: Users, label: 'إدارة المستخدمين' },
    { href: '/dashboard/admin/categories', icon: Layers, label: 'إدارة الفئات' },
    { href: '/dashboard/admin/settings', icon: Settings, label: 'الإعدادات' },
];

// FIX: Refactored NavLink to correctly handle buttons vs. links
const NavLink = ({ item, onClick }: { item: NavItem, onClick?: () => void }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;

    const content = (
        <div className={`flex items-center justify-center p-3 rounded-lg cursor-pointer group relative ${isActive ? 'bg-gold text-navy' : 'text-gray-400 hover:bg-gold/10 hover:text-gold'}`}>
            <item.icon size={24} />
            <span className="absolute left-14 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-[#0A1024] text-xs font-bold transition-all duration-100 scale-0 group-hover:scale-100">
                {item.label}
            </span>
        </div>
    );
    
    // If onClick is provided, it's a button for an action (like logout)
    if (onClick) {
        return (
            <button onClick={onClick} className="w-full">
                {content}
            </button>
        );
    }
    
    // Otherwise, it's a standard navigation link
    return (
        <Link href={item.href} className="w-full">
            {content}
        </Link>
    );
}

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-20 bg-[#1B2A41] p-4 flex flex-col justify-between items-center border-r border-gray-800">
        <div>
            {/* The logo is now just a simple link to home, with no logout function */}
            <Link href="/">
                <div className="w-12 h-12 bg-gold flex items-center justify-center rounded-2xl text-navy text-2xl font-bold font-dancing mb-8">
                   W
                </div>
            </Link>
            <nav className="space-y-4">
               {navItems.map(item => <NavLink key={item.label} item={item} />)}
            </nav>
        </div>
        <div className="space-y-4">
             <NavLink item={{ href: '#', icon: LifeBuoy, label: 'المساعدة' }} />
             {/* The logout functionality is now correctly and safely isolated to this button */}
             <NavLink item={{ href: '#', icon: LogOut, label: 'تسجيل الخروج' }} onClick={logout} />
        </div>
    </aside>
  );
}