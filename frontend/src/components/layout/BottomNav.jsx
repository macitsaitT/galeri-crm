import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Wallet,
  Plus
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Genel', icon: LayoutDashboard },
  { id: 'inventory', label: 'Araçlar', icon: Car },
  { id: 'customers', label: 'Müşteri', icon: Users },
  { id: 'finance', label: 'Finans', icon: Wallet },
];

const BottomNav = ({ activeView, setActiveView, onAddClick }) => {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass border-t border-border safe-bottom"
      data-testid="bottom-nav"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.id || 
            (item.id === 'inventory' && ['inventory', 'consignment', 'sold'].includes(activeView));

          // Add FAB in the middle
          if (index === 2) {
            return (
              <React.Fragment key={item.id}>
                {/* FAB Button */}
                <button
                  onClick={onAddClick}
                  className="relative -top-4 w-14 h-14 rounded-full gradient-gold shadow-lg flex items-center justify-center active:scale-95 transition-transform animate-pulse-glow"
                  data-testid="fab-add-btn"
                >
                  <Plus size={28} className="text-primary-foreground" />
                </button>

                {/* Nav Item */}
                <button
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )}
                  data-testid={`bottom-nav-${item.id}`}
                >
                  <Icon size={22} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              </React.Fragment>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
              data-testid={`bottom-nav-${item.id}`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
