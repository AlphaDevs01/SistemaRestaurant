import React, { useState } from 'react';
import { Users, Plus, QrCode, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { Table } from '../types';
import { clsx } from 'clsx';

const Tables: React.FC = () => {
  const { tables, updateTableStatus } = useRestaurant();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'occupied':
        return 'bg-error-100 text-error-700 border-error-200';
      case 'reserved':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'maintenance':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return CheckCircle;
      case 'occupied':
        return Users;
      case 'reserved':
        return Clock;
      case 'maintenance':
        return AlertCircle;
      default:
        return Users;
    }
  };

  const getStatusText = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'occupied':
        return 'Ocupada';
      case 'reserved':
        return 'Reservada';
      case 'maintenance':
        return 'Manutenção';
      default:
        return 'Desconhecido';
    }
  };

  const handleStatusChange = (tableId: string, newStatus: Table['status']) => {
    updateTableStatus(tableId, newStatus);
    setSelectedTable(null);
  };

  const generateQRCode = (tableId: string) => {
    // In a real app, this would generate and display/download a QR code
    alert(`QR Code gerado para Mesa ${tables.find(t => t.id === tableId)?.number}`);
  };

  const tablesBySection = tables.reduce((acc, table) => {
    if (!acc[table.section]) {
      acc[table.section] = [];
    }
    acc[table.section].push(table);
    return acc;
  }, {} as Record<string, Table[]>);

  const stats = {
    total: tables.length,
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Controle de Mesas</h1>
          <p className="text-gray-600">Gerencie o status e ocupação das mesas do restaurante</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Nova Mesa</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Mesas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disponíveis</p>
              <p className="text-2xl font-bold text-success-600">{stats.available}</p>
            </div>
            <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ocupadas</p>
              <p className="text-2xl font-bold text-error-600">{stats.occupied}</p>
            </div>
            <div className="w-12 h-12 bg-error-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-error-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reservadas</p>
              <p className="text-2xl font-bold text-warning-600">{stats.reserved}</p>
            </div>
            <div className="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tables by Section */}
      {Object.entries(tablesBySection).map(([section, sectionTables]) => (
        <div key={section} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{section}</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sectionTables.map((table) => {
                const StatusIcon = getStatusIcon(table.status);
                return (
                  <div
                    key={table.id}
                    className={clsx(
                      'relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md',
                      getStatusColor(table.status)
                    )}
                    onClick={() => setSelectedTable(table)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-5 h-5" />
                        <span className="font-semibold">Mesa {table.number}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateQRCode(table.id);
                        }}
                        className="p-1 hover:bg-white hover:bg-opacity-50 rounded"
                        title="Gerar QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Status:</span> {getStatusText(table.status)}</p>
                      <p><span className="font-medium">Capacidade:</span> {table.capacity} pessoas</p>
                    </div>

                    {table.status === 'occupied' && (
                      <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                        <p className="text-xs font-medium">Pedido: #{table.currentOrder}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Table Status Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mesa {selectedTable.number} - Alterar Status
            </h3>
            
            <div className="space-y-3">
              {(['available', 'occupied', 'reserved', 'maintenance'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(selectedTable.id, status)}
                  className={clsx(
                    'w-full p-3 rounded-lg border-2 text-left transition-all hover:shadow-sm',
                    selectedTable.status === status
                      ? getStatusColor(status)
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {React.createElement(getStatusIcon(status), { className: "w-5 h-5" })}
                    <span className="font-medium">{getStatusText(status)}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedTable(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;