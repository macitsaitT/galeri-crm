import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

const Header = ({ title, onMenuClick }) => {
  return (
    <header 
      className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border bg-card/50 glass sticky top-0 z-30"
      data-testid="header"
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
          data-testid="menu-toggle-btn"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-heading font-bold text-xl md:text-2xl tracking-tight uppercase text-foreground">
          {title}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button 
          className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
          data-testid="search-btn"
        >
          <Search size={20} />
        </button>
        <button 
          className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 relative"
          data-testid="notifications-btn"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
      </div>
    </header>
  );
};

export default Header;
