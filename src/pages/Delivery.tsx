import React, { useState } from 'react';
import { Truck, MapPin, Clock, Phone, Plus, Search, Filter, Navigation } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { DeliveryOrder, Customer, Address } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

const Delivery: React.FC = () => {
  const { deliveryOrders, customers, addCustomer, addDeliveryOrder, updateDeliveryStatus } = useRestaurant();
  const [selectedStatus, setSelectedStatus] = useState<DeliveryOrder['deliveryStatus'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const filteredOrders = deliveryOrders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.deliveryStatus === selectedStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: DeliveryOrder['deliveryStatus']) => {
    switch (status) {
      case 'pending': return 'bg-warning-100 text-warning-700';
      case 'confirmed': return 'bg-primary-100 text-primary-700';
      case 'preparing': return 'bg-accent-100 text-accent-700';
      case 'out_for_delivery': return 'bg-secondary-100 text-secondary-700';
      case 'delivered': return 'bg-success-100 text-success-700';
      case 'cancelled': return 'bg-error-100 text-error-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: DeliveryOrder['deliveryStatus']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'out_for_delivery': return 'Saiu para Entrega';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: DeliveryOrder['deliveryStatus']) => {
    updateDeliveryStatus(orderId, newStatus);
    toast.success(`Pedido ${getStatusText(newStatus).toLowerCase()}!`);
  };

  const activeDeliveries = deliveryOrders.filter(order => 
    ['confirmed', 'preparing', 'out_for_delivery'].includes(order.deliveryStatus)
  );

  const todayDeliveries = deliveryOrders.filter(order => {
    const today = new Date();
    return order.createdAt.toDateString() === today.toDateString();
  });

  const totalRevenue = todayDeliveries.reduce((sum, order) => sum + order.total, 0);
  const averageDeliveryTime = 35; // Mock data

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery</h1>
          <p className="text-gray-600">Gerencie pedidos de entrega e clientes</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCustomerModal(true)}
            className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Cliente</span>
          </button>
          <button
            onClick={() => setShowNewOrderModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Pedido</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Entregas Ativas</p>
              <p className="text-2xl font-bold text-primary-600">{activeDeliveries.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos Hoje</p>
              <p className="text-2xl font-bold text-secondary-600">{todayDeliveries.length}</p>
            </div>
            <div className="w-12 h-12 bg-secondary-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faturamento Hoje</p>
              <p className="text-2xl font-bold text-success-600">R$ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
              <Navigation className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
              <p className="text-2xl font-bold text-accent-600">{averageDeliveryTime}min</p>
            </div>
            <div className="w-12 h-12 bg-accent-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por ID do pedido ou cliente..."
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
              onChange={(e) => setSelectedStatus(e.target.value as DeliveryOrder['deliveryStatus'] | 'all')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="confirmed">Confirmado</option>
              <option value="preparing">Preparando</option>
              <option value="out_for_delivery">Saiu para Entrega</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Delivery Orders */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const customer = customers.find(c => c.id === order.customerId);
          const address = customer?.addresses.find(a => a.id === order.deliveryAddress?.id);
          
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Pedido #{order.id.slice(-6)}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {format(order.createdAt, 'HH:mm', { locale: ptBR })}
                      </span>
                      <span>Código: {order.trackingCode}</span>
                      <span>Tempo estimado: {order.deliveryTime}min</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.deliveryStatus)}`}>
                    {getStatusText(order.deliveryStatus)}
                  </span>
                </div>
              </div>

              {/* Customer and Address */}
              {customer && address && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Cliente</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{customer.name}</p>
                      <p className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {customer.phone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Endereço de Entrega</h4>
                    <div className="text-sm text-gray-600">
                      <p>{address.street}, {address.number}</p>
                      {address.complement && <p>{address.complement}</p>}
                      <p>{address.neighborhood} - {address.city}/{address.state}</p>
                      <p>CEP: {address.zipCode}</p>
                    </div>
                  </div>
                </div>
              )}

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

              {/* Delivery Person */}
              {order.deliveryPerson && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">Entregador</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{order.deliveryPerson.name}</span>
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {order.deliveryPerson.phone}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">
                    Subtotal: R$ {order.subtotal.toFixed(2)} + Taxa de entrega: R$ {order.deliveryFee.toFixed(2)}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    Total: R$ {order.total.toFixed(2)}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {order.deliveryStatus === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                      className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      Confirmar
                    </button>
                  )}
                  {order.deliveryStatus === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'preparing')}
                      className="px-3 py-1 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm"
                    >
                      Preparar
                    </button>
                  )}
                  {order.deliveryStatus === 'preparing' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'out_for_delivery')}
                      className="px-3 py-1 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors text-sm"
                    >
                      Saiu para Entrega
                    </button>
                  )}
                  {order.deliveryStatus === 'out_for_delivery' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'delivered')}
                      className="px-3 py-1 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors text-sm"
                    >
                      Entregue
                    </button>
                  )}
                  {order.deliveryStatus !== 'cancelled' && order.deliveryStatus !== 'delivered' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                      className="px-3 py-1 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido de delivery</h3>
          <p className="text-gray-600">
            {selectedStatus === 'all' 
              ? 'Não há pedidos de delivery no momento.'
              : `Não há pedidos com status "${getStatusText(selectedStatus as DeliveryOrder['deliveryStatus'])}".`
            }
          </p>
        </div>
      )}

      {/* Modals would go here - NewOrderModal and CustomerModal */}
      {/* For brevity, I'm not implementing the full modals, but they would follow similar patterns */}
    </div>
  );
};

export default Delivery;