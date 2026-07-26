import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Package, Tag } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Orders", href: "/admin/orders", icon: <ShoppingBag size={20} /> },
    { name: "Products", href: "/admin/products", icon: <Package size={20} /> },
    { name: "Categories", href: "/admin/categories", icon: <Tag size={20} /> },
    { name: "Customers", href: "/admin/customers", icon: <Users size={20} /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/admin" className="text-2xl font-serif tracking-widest text-[var(--color-text-main)]">
            SAVERA
          </Link>
          <span className="ml-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {sidebarLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-gold)] text-white flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        </header>
        
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
