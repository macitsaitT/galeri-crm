import React from 'react';
import { formatCurrency, getStatusColor, getOwnershipBadge } from '../../utils/helpers';
import { 
  Fuel, 
  Gauge, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Receipt,
  CreditCard,
  ShoppingCart,
  Car
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const VehicleCard = ({ 
  car, 
  onEdit, 
  onDelete, 
  onView, 
  onExpenses, 
  onDeposit, 
  onSale,
  showActions = true 
}) => {
  const statusColor = getStatusColor(car.status);
  const ownershipBadge = getOwnershipBadge(car.ownership);
  
  // Placeholder image
  const imageUrl = car.photos?.[0] || 'https://images.unsplash.com/photo-1763165562062-91d744691c65?w=400&h=300&fit=crop';

  return (
    <div 
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
      data-testid={`vehicle-card-${car.id}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img 
          src={imageUrl} 
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1763165562062-91d744691c65?w=400&h=300&fit=crop';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2 py-1 text-xs font-bold rounded-full border ${statusColor}`}>
            {car.status}
          </span>
          <span className={`px-2 py-1 text-xs font-bold rounded-full border ${ownershipBadge.class}`}>
            {ownershipBadge.label}
          </span>
        </div>

        {/* Actions Menu */}
        {showActions && (
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
                  data-testid={`vehicle-menu-${car.id}`}
                >
                  <MoreVertical size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onView?.(car)} data-testid={`view-${car.id}`}>
                  <Eye size={16} className="mr-2" />
                  Detay Görüntüle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(car)} data-testid={`edit-${car.id}`}>
                  <Edit size={16} className="mr-2" />
                  Düzenle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExpenses?.(car)} data-testid={`expenses-${car.id}`}>
                  <Receipt size={16} className="mr-2" />
                  Masraflar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {car.status === 'Stokta' && (
                  <>
                    <DropdownMenuItem onClick={() => onDeposit?.(car)} data-testid={`deposit-${car.id}`}>
                      <CreditCard size={16} className="mr-2" />
                      Kapora Al
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSale?.(car)} data-testid={`sale-${car.id}`}>
                      <ShoppingCart size={16} className="mr-2" />
                      Satış Yap
                    </DropdownMenuItem>
                  </>
                )}
                {car.status === 'Kapora Alındı' && (
                  <>
                    <DropdownMenuItem onClick={() => onDeposit?.(car)} data-testid={`deposit-${car.id}`}>
                      <CreditCard size={16} className="mr-2" />
                      Kapora Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSale?.(car)} data-testid={`sale-${car.id}`}>
                      <ShoppingCart size={16} className="mr-2" />
                      Satış Tamamla
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete?.(car)} 
                  className="text-destructive focus:text-destructive"
                  data-testid={`delete-${car.id}`}
                >
                  <Trash2 size={16} className="mr-2" />
                  Sil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Plate */}
        <div className="mb-3">
          <h3 className="font-heading font-bold text-lg leading-tight">
            {car.brand} {car.model}
          </h3>
          <p className="text-primary font-mono text-sm font-bold mt-1">
            {car.plate?.toUpperCase() || '-'}
          </p>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {car.year}
          </span>
          <span className="flex items-center gap-1">
            <Gauge size={14} />
            {car.km || '0'} km
          </span>
          <span className="flex items-center gap-1">
            <Fuel size={14} />
            {car.fuel_type}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Satış Fiyatı</p>
            <p className="font-heading font-bold text-xl text-primary tabular-nums">
              {formatCurrency(car.sale_price)}
            </p>
          </div>
          {car.ownership === 'stock' && car.purchase_price > 0 && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Alış</p>
              <p className="font-medium text-sm tabular-nums">
                {formatCurrency(car.purchase_price)}
              </p>
            </div>
          )}
        </div>

        {/* Deposit info */}
        {car.deposit_amount > 0 && (
          <div className="mt-3 p-2 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-xs text-warning font-medium">
              Kapora: {formatCurrency(car.deposit_amount)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
