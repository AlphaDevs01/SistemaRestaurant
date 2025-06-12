export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'waiter' | 'kitchen' | 'cashier';
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  currentOrder?: string;
  section: string;
  qrCode: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Order {
  id: string;
  tableId?: string;
  customerId?: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';
  type: 'dine-in' | 'takeaway' | 'delivery';
  waiterId?: string;
  total: number;
  subtotal: number;
  discount: number;
  tax: number;
  tip: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedTime?: number;
  deliveryAddress?: Address;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  price: number;
  notes?: string;
  modifications: string[];
  status: 'pending' | 'preparing' | 'ready' | 'served';
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  addresses: Address[];
  orderHistory: string[];
  preferredPaymentMethod?: string;
  loyaltyPoints: number;
  createdAt: Date;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Payment {
  id: string;
  orderId: string;
  method: 'cash' | 'credit' | 'debit' | 'pix' | 'voucher';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  processedAt?: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitCost: number;
  supplier?: string;
  expirationDate?: Date;
  lastUpdated: Date;
}

export interface Recipe {
  id: string;
  menuItemId: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  yield: number;
}

export interface RecipeIngredient {
  inventoryItemId: string;
  inventoryItem: InventoryItem;
  quantity: number;
  unit: string;
}

export interface SalesReport {
  period: {
    start: Date;
    end: Date;
  };
  totalSales: number;
  totalOrders: number;
  averageTicket: number;
  topItems: { menuItem: MenuItem; quantity: number; revenue: number }[];
  salesByHour: { hour: number; sales: number; orders: number }[];
  salesByDay: { date: Date; sales: number; orders: number }[];
  paymentMethods: { method: string; amount: number; percentage: number }[];
}

export interface KitchenOrder {
  id: string;
  orderId: string;
  tableNumber?: number;
  items: KitchenOrderItem[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedTime: number;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

export interface KitchenOrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  modifications: string[];
  notes?: string;
  status: 'pending' | 'preparing' | 'ready';
  station: 'grill' | 'fryer' | 'salad' | 'desserts' | 'beverages';
}

export interface DeliveryOrder extends Order {
  deliveryFee: number;
  deliveryTime: number;
  deliveryStatus: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryPerson?: {
    id: string;
    name: string;
    phone: string;
  };
  trackingCode: string;
}