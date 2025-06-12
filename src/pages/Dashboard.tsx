import React from 'react';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Clock, ChefHat, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
  // Mock data for charts
  const salesData = [
    { time: '08:00', vendas: 150, pedidos: 8 },
    { time: '10:00', vendas: 280, pedidos: 15 },
    { time: '12:00', vendas: 650, pedidos: 35 },
    { time: '14:00', vendas: 820, pedidos: 42 },
    { time: '16:00', vendas: 420, pedidos: 22 },
    { time: '18:00', vendas: 890, pedidos: 48 },
    { time: '20:00', vendas: 1200, pedidos: 65 },
    { time: '22:00', vendas: 750, pedidos: 38 },
  ];

  const categoryData = [
    { name: 'Hambúrgueres', value: 35, color: '#3B82F6' },
    { name: 'Pizzas', value: 25, color: '#10B981' },
    { name: 'Bebidas', value: 20, color: '#F59E0B' },
    { name: 'Sobremesas', value: 15, color: '#EF4444' },
    { name: 'Outros', value: 5, color: '#8B5CF6' },
  ];

  const topItems = [
    { name: 'Pizza Margherita', quantity: 45, revenue: 2025 },
    { name: 'Hambúrguer Artesanal', quantity: 38, revenue: 1364 },
    { name: 'Salmão Grelhado', quantity: 22, revenue: 1450 },
    { name: 'Coca-Cola', quantity: 67, revenue: 335 },
  ];

  const stats = [
    {
      title: 'Vendas Hoje',
      value: 'R$ 8.450,00',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
    {
      title: 'Pedidos',
      value: '127',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 66,53',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
    },
    {
      title: 'Mesas Ocupadas',
      value: '8/12',
      change: '66.7%',
      trend: 'up',
      icon: Users,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
  ];

  const quickStats = [
    { label: 'Na Cozinha', value: 7, icon: ChefHat, color: 'bg-warning-100 text-warning-700' },
    { label: 'Tempo Médio', value: '18min', icon: Clock, color: 'bg-primary-100 text-primary-700' },
    { label: 'Estoque Baixo', value: 3, icon: Package, color: 'bg-error-100 text-error-700' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu restaurante em tempo real</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-success-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-error-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-success-600' : 'text-error-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-lg p-4 flex items-center space-x-3`}>
            <stat.icon className="w-5 h-5" />
            <div>
              <p className="font-semibold">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Vendas por Horário</h3>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option>Hoje</option>
              <option>Esta Semana</option>
              <option>Este Mês</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="vendas" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Vendas por Categoria</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Produtos Mais Vendidos</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} vendidos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ {item.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Faturamento</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;