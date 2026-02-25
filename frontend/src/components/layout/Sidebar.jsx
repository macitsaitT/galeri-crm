import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Wallet, 
  Settings,
  Package,
  ShoppingCart,
  Trash2,
  LogOut,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

const menuItems = [
  { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
  { id: 'inventory', label: 'Stok Araçlar', icon: Car },
  { id: 'consignment', label: 'Konsinye', icon: Package },
  { id: 'sold', label: 'Satılan', icon: ShoppingCart },
  { id: 'customers', label: 'Müşteriler', icon: Users },
  { id: 'finance', label: 'Finans', icon: Wallet },
  { id: 'trash', label: 'Çöp Kutusu', icon: Trash2 },
];

const Sidebar = ({ activeView, setActiveView, isOpen, onClose }) => {
  const { user, logout, theme, toggleTheme } = useApp();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        data-testid="sidebar"
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg tracking-tight uppercase text-foreground">
                {user?.company_name || 'Aslanbaş Oto'}
              </h1>
              <p className="text-xs text-muted-foreground">CRM Sistemi</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="sidebar-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveView(item.id);
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      "text-left font-body text-sm font-medium",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    data-testid={`nav-${item.id}`}
                  >
                    <Icon size={20} className={isActive ? "text-primary" : ""} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            data-testid="theme-toggle"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-sm font-medium">{theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              setActiveView('settings');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            data-testid="nav-settings"
          >
            <Settings size={20} />
            <span className="text-sm font-medium">Ayarlar</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all"
            data-testid="logout-btn"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Çıkış Yap</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
