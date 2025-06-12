import React, { useState } from 'react';
import { Plus, Search, Filter, Clock, CheckCircle, XCircle, Eye, Users } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { Order, OrderItem, MenuItem } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

const Orders: React.FC = () => {
  const { orders, menuItems, tables, addOrder, updateOrderStatus } = useRestaurant();
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.tableId && tables.find(t => t.id === order.tableId)?.number.toString().includes(searchTerm));
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-warning-100 text-warning-700';
      case 'preparing': return 'bg-primary-100 text-primary-700';
      case 'ready': return 'bg-success-100 text-success-700';
      case 'served': return 'bg-gray-100 text-gray-700';
      case 'paid': return 'bg-secondary-100 text-secondary-700';
      case 'cancelled': return 'bg-error-100 text-error-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      case 'served': return 'Servido';
      case 'paid': return 'Pago';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Pedido ${getStatusText(newStatus).toLowerCase()}!`);
  };

  const canUpdateStatus = (currentStatus: Order['status'], newStatus: Order['status']) => {
    const statusFlow = ['pending', 'preparing', 'ready', 'served', 'paid'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    const newIndex = statusFlow.indexOf(newStatus);
    return newIndex === currentIndex + 1 || newStatus === 'cancelled';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedidos</h1>
          <p className="text-gray-600">Gerencie todos os pedidos do restaurante</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'waiter') && (
          <button
            onClick={() => setShowNewOrderModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Pedido</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por ID do pedido ou mesa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as Order['status'] | 'all')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="preparing">Preparando</option>
              <option value="ready">Pronto</option>
              <option value="served">Servido</option>
              <option value="paid">Pago</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const table = order.tableId ? tables.find(t => t.id === order.tableId) : null;
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Pedido #{order.id.slice(-6)}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      {table && (
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          Mesa {table.number}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {format(order.createdAt, 'HH:mm', { locale: ptBR })}
                      </span>
                      <span className="capitalize">{order.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Ver detalhes"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span>{item.quantity}x {item.menuItem.name}</span>
                    <span className="text-gray-600">R$ {(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="text-sm text-gray-500">
                    +{order.items.length - 3} itens adicionais
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-lg font-semibold text-gray-900">
                  Total: R$ {order.total.toFixed(2)}
                </div>
                
                {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'waiter') && (
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'preparing')}
                        className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                      >
                        Iniciar Preparo
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                        className="px-3 py-1 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors text-sm"
                      >
                        Marcar Pronto
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'served')}
                        className="px-3 py-1 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors text-sm"
                      >
                        Marcar Servido
                      </button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'paid' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        className="px-3 py-1 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors text-sm"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pedido #{selectedOrder.id.slice(-6)}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Tipo:</span>
                  <span className="ml-2 capitalize">{selectedOrder.type}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Criado em:</span>
                  <span className="ml-2">{format(selectedOrder.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                </div>
                {selectedOrder.tableId && (
                  <div>
                    <span className="font-medium text-gray-700">Mesa:</span>
                    <span className="ml-2">{tables.find(t => t.id === selectedOrder.tableId)?.number}</span>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Itens do Pedido</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.quantity}x</span>
                          <span>{item.menuItem.name}</span>
                        </div>
                        {item.notes && (
                          <p className="text-sm text-gray-600 mt-1">Obs: {item.notes}</p>
                        )}
                        {item.modifications.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            Modificações: {item.modifications.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">R$ {(item.quantity * item.price).toFixed(2)}</div>
                        <div className="text-sm text-gray-600">R$ {item.price.toFixed(2)} cada</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-error-600">
                      <span>Desconto:</span>
                      <span>-R$ {selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Taxa de serviço:</span>
                    <span>R$ {selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>R$ {selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      <NewOrderModal 
        isOpen={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
        menuItems={menuItems}
        tables={tables}
        onSubmit={addOrder}
      />
    </div>
  );
};

// New Order Modal Component
interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  tables: any[];
  onSubmit: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose, menuItems, tables, onSubmit }) => {
  const [selectedTable, setSelectedTable] = useState('');
  const [orderType, setOrderType] = useState<Order['type']>('dine-in');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState('');

  const addItem = (menuItem: MenuItem) => {
    const existingItem = items.find(item => item.menuItemId === menuItem.id);
    if (existingItem) {
      setItems(items.map(item => 
        item.menuItemId === menuItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: OrderItem = {
        id: `item-${Date.now()}`,
        menuItemId: menuItem.id,
        menuItem,
        quantity: 1,
        price: menuItem.price,
        modifications: [],
        status: 'pending',
      };
      setItems([...items, newItem]);
    }
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      setItems(items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const tax = subtotal * 0.1; // 10% service fee
    return {
      subtotal,
      tax,
      total: subtotal + tax
    };
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      toast.error('Adicione pelo menos um item ao pedido');
      return;
    }

    if (orderType === 'dine-in' && !selectedTable) {
      toast.error('Selecione uma mesa para pedidos no salão');
      return;
    }

    const { subtotal, tax, total } = calculateTotal();

    const order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      tableId: orderType === 'dine-in' ? selectedTable : undefined,
      items,
      status: 'pending',
      type: orderType,
      total,
      subtotal,
      discount: 0,
      tax,
      tip: 0,
      notes: notes || undefined,
    };

    onSubmit(order);
    toast.success('Pedido criado com sucesso!');
    
    // Reset form
    setSelectedTable('');
    setOrderType('dine-in');
    setItems([]);
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  const { subtotal, tax, total } = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Novo Pedido</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Menu Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Cardápio</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {menuItems.filter(item => item.isAvailable).map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h5 className="font-medium">{item.name}</h5>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm font-medium text-primary-600">R$ {item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => addItem(item)}
                      className="ml-3 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Order Details */}
            <div>
              <div className="space-y-4">
                {/* Order Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo do Pedido</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as Order['type'])}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="dine-in">No Salão</option>
                    <option value="takeaway">Para Viagem</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>

                {/* Table Selection */}
                {orderType === 'dine-in' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mesa</label>
                    <select
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Selecione uma mesa</option>
                      {tables.filter(table => table.status === 'available' || table.status === 'occupied').map((table) => (
                        <option key={table.id} value={table.id}>
                          Mesa {table.number} ({table.capacity} pessoas)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Itens do Pedido</h4>
                  {items.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Nenhum item adicionado</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <span className="font-medium">{item.menuItem.name}</span>
                            <div className="text-sm text-gray-600">R$ {item.price.toFixed(2)} cada</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-2 text-error-600 hover:text-error-700"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Observações especiais do pedido..."
                  />
                </div>

                {/* Order Summary */}
                {items.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxa de serviço (10%):</span>
                        <span>R$ {tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                        <span>Total:</span>
                        <span>R$ {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={items.length === 0}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Criar Pedido
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;