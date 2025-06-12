import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UtensilsCrossed, 
  ShoppingCart, 
  ChefHat, 
  CreditCard, 
  Package, 
  BarChart3,
  Truck,
  Settings,
  QrCode,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['admin', 'manager'] },
    { icon: Users, label: 'Mesas', path: '/tables', roles: ['admin', 'manager', 'waiter'] },
    { icon: UtensilsCrossed, label: 'Cardápio', path: '/menu', roles: ['admin', 'manager'] },
    { icon: ShoppingCart, label: 'Pedidos', path: '/orders', roles: ['admin', 'manager', 'waiter'] },
    { icon: ChefHat, label: 'Cozinha', path: '/kitchen', roles: ['admin', 'manager', 'kitchen'] },
    { icon: CreditCard, label: 'Caixa', path: '/cashier', roles: ['admin', 'manager', 'cashier'] },
    { icon: Package, label: 'Estoque', path: '/inventory', roles: ['admin', 'manager'] },
    { icon: BarChart3, label: 'Relatórios', path: '/reports', roles: ['admin', 'manager'] },
    { icon: Truck, label: 'Delivery', path: '/delivery', roles: ['admin', 'manager'] },
    { icon: QrCode, label: 'QR Codes', path: '/qr-codes', roles: ['admin', 'manager'] },
    { icon: Clock, label: 'Histórico', path: '/history', roles: ['admin', 'manager'] },
    { icon: Settings, label: 'Configurações', path: '/settings', roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={clsx(
        'fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 transform transition-transform duration-300 ease-in-out',
        'w-64',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:shadow-none'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-primary-600">
            <div className="flex items-center space-x-2">
              <UtensilsCrossed className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">RestaurantePro</span>
            </div>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-3">
              {filteredMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={clsx(
                        'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                        isActive
                          ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      )}
                      onClick={onClose}
                    >
                      <item.icon className={clsx(
                        'w-5 h-5 mr-3',
                        isActive ? 'text-primary-600' : 'text-gray-500'
                      )} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2025 RestaurantePro
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;