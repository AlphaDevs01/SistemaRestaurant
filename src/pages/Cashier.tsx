import React, { useState } from 'react';
import { CreditCard, DollarSign, Smartphone, Receipt, Users, Calculator, Percent } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { Order, Payment } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

const Cashier: React.FC = () => {
  const { orders, tables, updateOrderStatus, processPayment } = useRestaurant();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<Payment['method']>('cash');
  const [splitCount, setSplitCount] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');

  // Orders ready for payment
  const readyOrders = orders.filter(order => 
    order.status === 'served' || order.status === 'ready'
  );

  const paymentMethods = [
    { id: 'cash', name: 'Dinheiro', icon: DollarSign, color: 'text-success-600' },
    { id: 'credit', name: 'Cartão de Crédito', icon: CreditCard, color: 'text-primary-600' },
    { id: 'debit', name: 'Cartão de Débito', icon: CreditCard, color: 'text-secondary-600' },
    { id: 'pix', name: 'PIX', icon: Smartphone, color: 'text-accent-600' },
  ];

  const calculateOrderTotal = (order: Order) => {
    const subtotal = order.subtotal;
    let discountAmount = 0;
    
    if (discount > 0) {
      discountAmount = discountType === 'percentage' 
        ? (subtotal * discount) / 100 
        : discount;
    }
    
    const finalSubtotal = subtotal - discountAmount;
    const tax = finalSubtotal * 0.1; // 10% service fee
    const total = finalSubtotal + tax;
    
    return {
      subtotal,
      discountAmount,
      finalSubtotal,
      tax,
      total: Math.max(0, total),
      perPerson: Math.max(0, total / splitCount)
    };
  };

  const handlePayment = async () => {
    if (!selectedOrder) return;

    const { total } = calculateOrderTotal(selectedOrder);
    
    try {
      const payment: Omit<Payment, 'id'> = {
        orderId: selectedOrder.id,
        method: paymentMethod,
        amount: total,
        status: 'completed',
        processedAt: new Date(),
      };

      await processPayment(payment);
      updateOrderStatus(selectedOrder.id, 'paid');
      
      toast.success('Pagamento processado com sucesso!');
      setSelectedOrder(null);
      setDiscount(0);
      setSplitCount(1);
    } catch (error) {
      toast.error('Erro ao processar pagamento');
    }
  };

  const printReceipt = (order: Order) => {
    // In a real app, this would integrate with a printer
    const { total, discountAmount, tax } = calculateOrderTotal(order);
    
    const receiptData = {
      orderId: order.id,
      items: order.items,
      subtotal: order.subtotal,
      discount: discountAmount,
      tax,
      total,
      paymentMethod,
      timestamp: new Date(),
    };
    
    console.log('Printing receipt:', receiptData);
    toast.success('Comprovante enviado para impressão');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Caixa</h1>
          <p className="text-gray-600">Processe pagamentos e feche comandas</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{readyOrders.length}</span> comandas prontas
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comandas Prontas para Pagamento</h3>
            
            {readyOrders.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma comanda pronta para pagamento</p>
              </div>
            ) : (
              <div className="space-y-3">
                {readyOrders.map((order) => {
                  const table = order.tableId ? tables.find(t => t.id === order.tableId) : null;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedOrder?.id === order.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Pedido #{order.id.slice(-6)}
                          </h4>
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            {table && (
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                Mesa {table.number}
                              </span>
                            )}
                            <span>{format(order.createdAt, 'HH:mm', { locale: ptBR })}</span>
                            <span className="capitalize">{order.type}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            R$ {order.total.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index}>
                            {item.quantity}x {item.menuItem.name}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div>+{order.items.length - 2} itens adicionais</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Payment Panel */}
        <div className="space-y-6">
          {selectedOrder ? (
            <>
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pedido #{selectedOrder.id.slice(-6)}
                </h3>
                
                <div className="space-y-3 mb-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <span>R$ {(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Discount */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Percent className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Desconto</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={() => setDiscountType('percentage')}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        discountType === 'percentage'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Percentual
                    </button>
                    <button
                      onClick={() => setDiscountType('fixed')}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        discountType === 'fixed'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Valor Fixo
                    </button>
                  </div>
                  
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    placeholder={discountType === 'percentage' ? '0%' : 'R$ 0,00'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Split Bill */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Calculator className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Dividir Conta</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{splitCount}</span>
                    <button
                      onClick={() => setSplitCount(splitCount + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-600 ml-2">
                      {splitCount === 1 ? 'pessoa' : 'pessoas'}
                    </span>
                  </div>
                </div>

                {/* Total Calculation */}
                <div className="border-t border-gray-200 pt-4">
                  {(() => {
                    const calc = calculateOrderTotal(selectedOrder);
                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>R$ {calc.subtotal.toFixed(2)}</span>
                        </div>
                        {calc.discountAmount > 0 && (
                          <div className="flex justify-between text-error-600">
                            <span>Desconto:</span>
                            <span>-R$ {calc.discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Taxa de serviço (10%):</span>
                          <span>R$ {calc.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                          <span>Total:</span>
                          <span>R$ {calc.total.toFixed(2)}</span>
                        </div>
                        {splitCount > 1 && (
                          <div className="flex justify-between text-primary-600 font-medium">
                            <span>Por pessoa:</span>
                            <span>R$ {calc.perPerson.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Forma de Pagamento</h3>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as Payment['method'])}
                        className={`p-3 border-2 rounded-lg transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${
                          isSelected ? 'text-primary-600' : method.color
                        }`} />
                        <div className={`text-sm font-medium ${
                          isSelected ? 'text-primary-700' : 'text-gray-700'
                        }`}>
                          {method.name}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handlePayment}
                    className="w-full bg-success-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-success-700 transition-colors"
                  >
                    Processar Pagamento
                  </button>
                  
                  <button
                    onClick={() => printReceipt(selectedOrder)}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Imprimir Comprovante</span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center py-8">
                <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma Comanda</h3>
                <p className="text-gray-600">
                  Escolha uma comanda da lista para processar o pagamento
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cashier;