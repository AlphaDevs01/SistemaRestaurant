import React, { createContext, useContext, useState, useEffect } from 'react';
import { Table, Order, MenuItem, KitchenOrder, InventoryItem, DeliveryOrder, Customer, Payment } from '../types';

interface RestaurantContextData {
  tables: Table[];
  orders: Order[];
  menuItems: MenuItem[];
  kitchenOrders: KitchenOrder[];
  inventoryItems: InventoryItem[];
  deliveryOrders: DeliveryOrder[];
  customers: Customer[];
  updateTableStatus: (tableId: string, status: Table['status']) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (id: string) => void;
  updateKitchenOrderStatus: (orderId: string, itemId: string, status: KitchenOrderItem['status']) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateInventoryItem: (id: string, item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  deleteInventoryItem: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  addDeliveryOrder: (order: Omit<DeliveryOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDeliveryStatus: (orderId: string, status: DeliveryOrder['deliveryStatus']) => void;
  processPayment: (payment: Omit<Payment, 'id'>) => Promise<void>;
  refreshData: () => void;
}

const RestaurantContext = createContext<RestaurantContextData>({} as RestaurantContextData);

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

// Mock data
const mockTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: `table-${i + 1}`,
  number: i + 1,
  capacity: [2, 4, 6, 8][Math.floor(Math.random() * 4)],
  status: ['available', 'occupied', 'reserved'][Math.floor(Math.random() * 3)] as Table['status'],
  section: i < 6 ? 'Salão Principal' : 'Varanda',
  qrCode: `https://restaurant.com/menu?table=${i + 1}`,
}));

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Hambúrguer Artesanal',
    description: 'Hambúrguer 180g, queijo, alface, tomate, bacon',
    price: 35.90,
    category: 'Hambúrgueres',
    isAvailable: true,
    preparationTime: 15,
    ingredients: ['carne', 'queijo', 'alface', 'tomate', 'bacon'],
    allergens: ['glúten', 'lactose'],
  },
  {
    id: '2',
    name: 'Pizza Margherita',
    description: 'Molho de tomate, mussarela, manjericão',
    price: 45.00,
    category: 'Pizzas',
    isAvailable: true,
    preparationTime: 20,
    ingredients: ['massa', 'molho de tomate', 'mussarela', 'manjericão'],
    allergens: ['glúten', 'lactose'],
  },
  {
    id: '3',
    name: 'Salmão Grelhado',
    description: 'Salmão grelhado com legumes e molho de ervas',
    price: 65.90,
    category: 'Peixes',
    isAvailable: true,
    preparationTime: 25,
    ingredients: ['salmão', 'brócolis', 'cenoura', 'molho de ervas'],
    allergens: ['peixe'],
  },
  {
    id: '4',
    name: 'Coca-Cola',
    description: 'Refrigerante 350ml',
    price: 5.00,
    category: 'Bebidas',
    isAvailable: true,
    preparationTime: 2,
    ingredients: ['refrigerante'],
    allergens: [],
  },
  {
    id: '5',
    name: 'Salada Caesar',
    description: 'Alface, croutons, parmesão, molho caesar',
    price: 28.90,
    category: 'Saladas',
    isAvailable: true,
    preparationTime: 10,
    ingredients: ['alface', 'croutons', 'parmesão', 'molho caesar'],
    allergens: ['glúten', 'lactose'],
  },
];

const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Carne Bovina',
    category: 'Carnes',
    unit: 'kg',
    currentStock: 15.5,
    minimumStock: 10,
    maximumStock: 50,
    unitCost: 25.90,
    supplier: 'Frigorífico São Paulo',
    lastUpdated: new Date(),
  },
  {
    id: '2',
    name: 'Queijo Mussarela',
    category: 'Laticínios',
    unit: 'kg',
    currentStock: 8.2,
    minimumStock: 5,
    maximumStock: 20,
    unitCost: 18.50,
    supplier: 'Laticínios Bela Vista',
    lastUpdated: new Date(),
  },
  {
    id: '3',
    name: 'Tomate',
    category: 'Vegetais',
    unit: 'kg',
    currentStock: 3.1,
    minimumStock: 5,
    maximumStock: 15,
    unitCost: 4.20,
    supplier: 'Hortifruti Central',
    lastUpdated: new Date(),
  },
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '(11) 99999-9999',
    email: 'joao@email.com',
    addresses: [
      {
        id: '1',
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        isDefault: true,
      }
    ],
    orderHistory: [],
    loyaltyPoints: 150,
    createdAt: new Date(),
  },
];

export const RestaurantProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);

  useEffect(() => {
    console.log("RestaurantProvider: montado");
  }, []);

  const updateTableStatus = (tableId: string, status: Table['status']) => {
    console.log("updateTableStatus", { tableId, status });
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, status } : table
    ));
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log("addOrder", orderData);
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setOrders(prev => [...prev, newOrder]);
    
    // Add to kitchen orders if it has food items
    if (newOrder.items.some(item => item.menuItem.category !== 'Bebidas')) {
      const kitchenOrder: KitchenOrder = {
        id: `kitchen-${newOrder.id}`,
        orderId: newOrder.id,
        tableNumber: newOrder.tableId ? parseInt(newOrder.tableId.split('-')[1]) : undefined,
        items: newOrder.items.map(item => ({
          id: `kitchen-item-${item.id}`,
          menuItem: item.menuItem,
          quantity: item.quantity,
          modifications: item.modifications,
          notes: item.notes,
          status: 'pending' as const,
          station: getStationForItem(item.menuItem.category),
        })),
        priority: 'normal',
        estimatedTime: Math.max(...newOrder.items.map(item => item.menuItem.preparationTime)),
      };
      setKitchenOrders(prev => [...prev, kitchenOrder]);
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status, updatedAt: new Date() } : order
    ));
  };

  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `item-${Date.now()}`,
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, itemData: Omit<MenuItem, 'id'>) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...itemData, id } : item
    ));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const updateKitchenOrderStatus = (orderId: string, itemId: string, status: KitchenOrderItem['status']) => {
    setKitchenOrders(prev => prev.map(order => 
      order.id === orderId 
        ? {
            ...order,
            items: order.items.map(item => 
              item.id === itemId ? { ...item, status } : item
            )
          }
        : order
    ));
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      lastUpdated: new Date(),
    };
    setInventoryItems(prev => [...prev, newItem]);
  };

  const updateInventoryItem = (id: string, itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    setInventoryItems(prev => prev.map(item => 
      item.id === id ? { ...itemData, id, lastUpdated: new Date() } : item
    ));
  };

  const deleteInventoryItem = (id: string) => {
    setInventoryItems(prev => prev.filter(item => item.id !== id));
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `customer-${Date.now()}`,
      createdAt: new Date(),
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const addDeliveryOrder = (orderData: Omit<DeliveryOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: DeliveryOrder = {
      ...orderData,
      id: `delivery-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      trackingCode: `TRK${Date.now().toString().slice(-6)}`,
    };
    setDeliveryOrders(prev => [...prev, newOrder]);
  };

  const updateDeliveryStatus = (orderId: string, status: DeliveryOrder['deliveryStatus']) => {
    setDeliveryOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, deliveryStatus: status, updatedAt: new Date() } : order
    ));
  };

  const processPayment = async (paymentData: Omit<Payment, 'id'>) => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would integrate with payment processors
    console.log('Processing payment:', paymentData);
  };

  const getStationForItem = (category: string): KitchenOrderItem['station'] => {
    switch (category) {
      case 'Hambúrgueres':
      case 'Carnes':
        return 'grill';
      case 'Pizzas':
      case 'Fritos':
        return 'fryer';
      case 'Saladas':
        return 'salad';
      case 'Sobremesas':
        return 'desserts';
      default:
        return 'beverages';
    }
  };

  const refreshData = () => {
    // In a real app, this would fetch fresh data from the API
    console.log('Refreshing restaurant data...');
  };

  return (
    <RestaurantContext.Provider
      value={{
        tables,
        orders,
        menuItems,
        kitchenOrders,
        inventoryItems,
        deliveryOrders,
        customers,
        updateTableStatus,
        addOrder,
        updateOrderStatus,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateKitchenOrderStatus,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        addCustomer,
        addDeliveryOrder,
        updateDeliveryStatus,
        processPayment,
        refreshData,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};