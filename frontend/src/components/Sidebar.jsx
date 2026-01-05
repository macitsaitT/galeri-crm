import React from 'react';
import {
  LayoutDashboard,
  Car,
  Users,
  Wallet,
  Plus,
  FileText,
  CheckCircle,
  Settings,
  X,
  Trash2,
  Handshake,
  Building2
} from 'lucide-react';

const SidebarItem = ({ id, icon: Icon, label, activeView, setActiveView, onClick }) => (
  <button
    onClick={() => { setActiveView(id); if(onClick) onClick(); }}
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
      activeView === id 
        ? 'bg-amber-500 text-black shadow-md font-bold' 
        : 'text-gray-400 hover:bg-neutral-800 hover:text-white'
    }`}
  >
    <Icon size={18} /> <span className="font-medium text-sm">{label}</span>
  </button>
);

export default function Sidebar({ 
  isSidebarOpen, 
  setSidebarOpen, 
  activeView, 
  setActiveView, 
  userProfile,
  onOpenAddCar,
  onOpenPromoCard,
  onOpenGeneralExpense,
  onOpenTransaction,
  onOpenSettings,
  onOpenReport
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-black text-white transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 flex flex-col`}>
        
        {/* Logo / Header */}
        <div className="p-5 border-b border-neutral-800 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">ASLANBAŞ</h1>
            <span className="text-[10px] text-neutral-400 tracking-widest">YÖNETİM PANELİ</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-neutral-400 hover:text-white">
            <X size={20}/>
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button 
              onClick={onOpenAddCar}
              className="bg-amber-500 text-black p-2 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-amber-400 transition-colors shadow-md h-20"
            >
              <Plus size={24} strokeWidth={3} />
              <span className="text-[10px] font-bold uppercase text-center leading-tight">ARAÇ<br/>GİRİŞİ</span>
            </button>
            <button 
              onClick={onOpenPromoCard}
              className="bg-neutral-800 text-white p-2 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-neutral-700 transition-colors border border-neutral-700 h-20"
            >
              <FileText size={24} className="text-blue-400"/>
              <span className="text-[10px] font-bold uppercase text-center leading-tight">TANITIM<br/>KARTI</span>
            </button>
            <button 
              onClick={onOpenGeneralExpense}
              className="bg-red-600 text-white p-2 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-red-500 transition-colors border border-red-700 shadow-sm h-14"
            >
              <Building2 size={16} className="text-white"/>
              <span className="text-[10px] font-bold uppercase tracking-wide">GİDER</span>
            </button>
            <button 
              onClick={onOpenTransaction}
              className="bg-neutral-800 text-white p-2 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-neutral-700 transition-colors border border-neutral-700 h-14"
            >
              <Wallet size={16} className="text-green-500"/>
              <span className="text-[10px] font-bold uppercase tracking-wide">İŞLEM</span>
            </button>
          </div>
          
          <div className="border-t border-neutral-800 my-2 pt-2"></div>
          
          {/* Navigation */}
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Genel Bakış" activeView={activeView} setActiveView={setActiveView} />
          <SidebarItem id="inventory" icon={Car} label="Stok Araçlar" activeView={activeView} setActiveView={setActiveView} />
          <SidebarItem id="consignment" icon={Handshake} label="Konsinye Araçlar" activeView={activeView} setActiveView={setActiveView} />
          <SidebarItem id="sold" icon={CheckCircle} label="Satılan Araçlar" activeView={activeView} setActiveView={setActiveView} />
          <SidebarItem id="finance" icon={Wallet} label="Gelir & Gider" activeView={activeView} setActiveView={setActiveView} />
          <SidebarItem id="reports" icon={FileText} label="Raporlar" activeView={activeView} setActiveView={setActiveView} onClick={onOpenReport} />
          <SidebarItem id="customers" icon={Users} label="Müşteriler" activeView={activeView} setActiveView={setActiveView} />
          <SidebarItem id="trash" icon={Trash2} label="Çöp Kutusu" activeView={activeView} setActiveView={setActiveView} />
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-t border-neutral-800">
          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-3 w-full hover:bg-neutral-800 p-2 rounded transition"
          >
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
              {userProfile.name?.[0]}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">{userProfile.name}</p>
              <p className="text-xs text-neutral-400">{userProfile.title}</p>
            </div>
            <Settings size={16} className="ml-auto text-neutral-500"/>
          </button>
        </div>
      </aside>
    </>
  );
}
