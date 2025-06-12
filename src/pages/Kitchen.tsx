import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, ChefHat, Flame, Coffee, IceCream } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { KitchenOrder, KitchenOrderItem } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

const Kitchen: React.FC = () => {
  const { kitchenOrders, updateKitchenOrderStatus } = useRestaurant();
  const [selectedStation, setSelectedStation] = useState<KitchenOrderItem['station'] | 'all'>('all');

  const stations = [
    { id: 'all', name: 'Todas', icon: ChefHat, color: 'text-gray-600' },
    { id: 'grill', name: 'Grill', icon: Flame, color: 'text-error-600' },
    { id: 'fryer', name: 'Frituras', icon: Flame, color: 'text-warning-600' },
    { id: 'salad', name: 'Saladas', icon: Coffee, color: 'text-success-600' },
    { id: 'desserts', name: 'Sobremesas', icon: IceCream, color: 'text-primary-600' },
    { id: 'beverages', name: 'Bebidas', icon: Coffee, color: 'text-secondary-600' },
  ];

  const filteredOrders = kitchenOrders.filter(order => {
    if (selectedStation === 'all') return true;
    return order.items.some(item => item.station === selectedStation);
  });

  const getOrderPriority = (order: KitchenOrder) => {
    const now = new Date();
    const orderTime = new Date(order.id.split('-')[1]); // Extract timestamp from ID
    const minutesElapsed = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (minutesElapsed > 30) return 'urgent';
    if (minutesElapsed > 20) return 'high';
    if (minutesElapsed > 10) return 'normal';
    return 'low';
  };

  const getPriorityColor = (priority: KitchenOrder['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-error-100 text-error-700 border-error-200';
      case 'high': return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'normal': return 'bg-primary-100 text-primary-700 border-primary-200';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: KitchenOrderItem['status']) => {
    switch (status) {
      case 'pending': return 'bg-warning-100 text-warning-700';
      case 'preparing': return 'bg-primary-100 text-primary-700';
      case 'ready': return 'bg-success-100 text-success-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: KitchenOrderItem['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      default: return status;
    }
  };

  const handleItemStatusUpdate = (orderId: string, itemId: string, newStatus: KitchenOrderItem['status']) => {
    updateKitchenOrderStatus(orderId, itemId, newStatus);
    toast.success(`Item ${getStatusText(newStatus).toLowerCase()}!`);
  };

  const getStationIcon = (station: KitchenOrderItem['station']) => {
    const stationData = stations.find(s => s.id === station);
    return stationData ? stationData.icon : ChefHat;
  };

  const getStationColor = (station: KitchenOrderItem['station']) => {
    const stationData = stations.find(s => s.id === station);
    return stationData ? stationData.color : 'text-gray-600';
  };

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const priority = getOrderPriority(order);
    if (!acc[priority]) acc[priority] = [];
    acc[priority].push(order);
    return acc;
  }, {} as Record<string, KitchenOrder[]>);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cozinha</h1>
          <p className="text-gray-600">Gerencie os pedidos em preparo</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredOrders.length}</span> pedidos ativos
          </div>
        </div>
      </div>

      {/* Station Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap gap-3">
          {stations.map((station) => {
            const Icon = station.icon;
            const isActive = selectedStation === station.id;
            return (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : station.color}`} />
                <span className="font-medium">{station.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders by Priority */}
      {Object.entries(groupedOrders).map(([priority, orders]) => (
        <div key={priority} className="space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              Prioridade {priority === 'urgent' ? 'Urgente' : priority === 'high' ? 'Alta' : priority === 'normal' ? 'Normal' : 'Baixa'}
            </h2>
            <span className="text-sm text-gray-500">({orders.length} pedidos)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`bg-white rounded-xl shadow-sm border-2 p-6 ${getPriorityColor(priority as KitchenOrder['priority'])}`}
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pedido #{order.orderId.slice(-6)}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                      {order.tableNumber && (
                        <span>Mesa {order.tableNumber}</span>
                      )}
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {order.estimatedTime}min
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {priority === 'urgent' && (
                      <AlertCircle className="w-5 h-5 text-error-600" />
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {order.items
                    .filter(item => selectedStation === 'all' || item.station === selectedStation)
                    .map((item) => {
                      const StationIcon = getStationIcon(item.station);
                      return (
                        <div key={item.id} className="bg-white bg-opacity-50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <StationIcon className={`w-4 h-4 ${getStationColor(item.station)}`} />
                                <span className="font-medium">{item.quantity}x {item.menuItem.name}</span>
                              </div>
                              {item.modifications.length > 0 && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Modificações: {item.modifications.join(', ')}
                                </p>
                              )}
                              {item.notes && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Obs: {item.notes}
                                </p>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {getStatusText(item.status)}
                            </span>
                          </div>

                          {/* Item Actions */}
                          <div className="flex space-x-2 mt-3">
                            {item.status === 'pending' && (
                              <button
                                onClick={() => handleItemStatusUpdate(order.id, item.id, 'preparing')}
                                className="flex-1 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                              >
                                Iniciar
                              </button>
                            )}
                            {item.status === 'preparing' && (
                              <button
                                onClick={() => handleItemStatusUpdate(order.id, item.id, 'ready')}
                                className="flex-1 px-3 py-1 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors text-sm"
                              >
                                Finalizar
                              </button>
                            )}
                            {item.status === 'ready' && (
                              <div className="flex-1 px-3 py-1 bg-success-100 text-success-700 rounded-lg text-center text-sm font-medium">
                                <CheckCircle className="w-4 h-4 inline mr-1" />
                                Pronto
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Order Notes */}
                {order.notes && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Observações:</strong> {order.notes}
                    </p>
                  </div>
                )}

                {/* Order Timer */}
                <div className="mt-4 pt-3 border-t border-current border-opacity-20">
                  <div className="flex justify-between items-center text-sm">
                    <span>Tempo decorrido:</span>
                    <span className="font-medium">
                      {Math.floor((Date.now() - parseInt(order.id.split('-')[1])) / (1000 * 60))}min
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido na cozinha</h3>
          <p className="text-gray-600">
            {selectedStation === 'all' 
              ? 'Não há pedidos pendentes no momento.'
              : `Não há pedidos pendentes para ${stations.find(s => s.id === selectedStation)?.name.toLowerCase()}.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Kitchen;