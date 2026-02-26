import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Wallet,
  Calendar,
  Plus
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Genel', icon: LayoutDashboard },
  { id: 'inventory', label: 'Araçlar', icon: Car },
  { id: 'customers', label: 'Müşteri', icon: Users },
  { id: 'finance', label: 'Finans', icon: Wallet },
  { id: 'calendar', label: 'Takvim', icon: Calendar },
];

const BottomNav = ({ activeView, setActiveView, onAddClick }) => {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0a0a0a] border-t border-border"
      data-testid="bottom-nav"
    >
      <div className="flex items-end justify-evenly px-1 pb-1 pt-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.id || 
            (item.id === 'inventory' && ['inventory', 'consignment', 'sold'].includes(activeView));

          if (index === 2) {
            return (
              <React.Fragment key="fab-group">
                {/* FAB */}
                <button
                  onClick={onAddClick}
                  className="relative -top-3 w-12 h-12 rounded-full bg-primary shadow-lg flex items-center justify-center active:scale-95 transition-transform flex-shrink-0"
                  data-testid="fab-add-btn"
                >
                  <Plus size={24} className="text-primary-foreground" />
                </button>
              </React.Fragment>
            );
          }

          const adjustedIndex = index > 2 ? index - 1 : index;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg transition-all min-w-0",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              data-testid={`bottom-nav-${item.id}`}
            >
              <Icon size={20} />
              <span className="text-[9px] font-medium truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
