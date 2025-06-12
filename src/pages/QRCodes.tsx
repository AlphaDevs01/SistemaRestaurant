import React, { useState } from 'react';
import { QrCode, Download, Eye, Settings, Printer, Share2 } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import QRCodeLib from 'qrcode';
import toast from 'react-hot-toast';

const QRCodes: React.FC = () => {
  const { tables } = useRestaurant();
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [qrSize, setQrSize] = useState(200);
  const [includeTableNumber, setIncludeTableNumber] = useState(true);
  const [includeRestaurantName, setIncludeRestaurantName] = useState(true);
  const [qrColor, setQrColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const generateQRCode = async (url: string): Promise<string> => {
    try {
      const qrDataURL = await QRCodeLib.toDataURL(url, {
        width: qrSize,
        color: {
          dark: qrColor,
          light: backgroundColor,
        },
        margin: 2,
      });
      return qrDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  };

  const handleTableSelection = (tableId: string) => {
    setSelectedTables(prev => 
      prev.includes(tableId) 
        ? prev.filter(id => id !== tableId)
        : [...prev, tableId]
    );
  };

  const selectAllTables = () => {
    setSelectedTables(tables.map(table => table.id));
  };

  const clearSelection = () => {
    setSelectedTables([]);
  };

  const downloadQRCode = async (table: any) => {
    try {
      const qrDataURL = await generateQRCode(table.qrCode);
      
      // Create download link
      const link = document.createElement('a');
      link.href = qrDataURL;
      link.download = `qr-mesa-${table.number}.png`;
      link.click();
      
      toast.success(`QR Code da Mesa ${table.number} baixado!`);
    } catch (error) {
      toast.error('Erro ao gerar QR Code');
    }
  };

  const downloadSelectedQRCodes = async () => {
    if (selectedTables.length === 0) {
      toast.error('Selecione pelo menos uma mesa');
      return;
    }

    try {
      for (const tableId of selectedTables) {
        const table = tables.find(t => t.id === tableId);
        if (table) {
          await downloadQRCode(table);
          // Add small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      toast.success(`${selectedTables.length} QR Codes baixados!`);
    } catch (error) {
      toast.error('Erro ao baixar QR Codes');
    }
  };

  const printQRCodes = () => {
    if (selectedTables.length === 0) {
      toast.error('Selecione pelo menos uma mesa');
      return;
    }

    // In a real app, this would integrate with a printer
    toast.success(`${selectedTables.length} QR Codes enviados para impressão`);
  };

  const shareQRCode = async (table: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code - Mesa ${table.number}`,
          text: `Acesse o cardápio da Mesa ${table.number}`,
          url: table.qrCode,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(table.qrCode);
        toast.success('Link copiado para a área de transferência!');
      }
    } else {
      navigator.clipboard.writeText(table.qrCode);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Codes</h1>
          <p className="text-gray-600">Gere e gerencie QR Codes para acesso ao cardápio digital</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={printQRCodes}
            disabled={selectedTables.length === 0}
            className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="w-5 h-5" />
            <span>Imprimir</span>
          </button>
          <button
            onClick={downloadSelectedQRCodes}
            disabled={selectedTables.length === 0}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            <span>Baixar Selecionados</span>
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Configurações do QR Code</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho (px)</label>
            <input
              type="range"
              min="100"
              max="400"
              value={qrSize}
              onChange={(e) => setQrSize(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">{qrSize}px</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cor do QR Code</label>
            <input
              type="color"
              value={qrColor}
              onChange={(e) => setQrColor(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Fundo</label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeTableNumber}
                onChange={(e) => setIncludeTableNumber(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Incluir número da mesa</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeRestaurantName}
                onChange={(e) => setIncludeRestaurantName(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Incluir nome do restaurante</span>
            </label>
          </div>
        </div>
      </div>

      {/* Table Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Selecionar Mesas ({selectedTables.length}/{tables.length})
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={selectAllTables}
              className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
            >
              Selecionar Todas
            </button>
            <button
              onClick={clearSelection}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpar Seleção
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => handleTableSelection(table.id)}
              className={`p-3 border-2 rounded-lg transition-all ${
                selectedTables.includes(table.id)
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">Mesa {table.number}</div>
                <div className="text-sm opacity-75">{table.capacity} pessoas</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* QR Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <QRCodeCard
            key={table.id}
            table={table}
            qrSize={qrSize}
            qrColor={qrColor}
            backgroundColor={backgroundColor}
            includeTableNumber={includeTableNumber}
            includeRestaurantName={includeRestaurantName}
            onDownload={() => downloadQRCode(table)}
            onShare={() => shareQRCode(table)}
            isSelected={selectedTables.includes(table.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface QRCodeCardProps {
  table: any;
  qrSize: number;
  qrColor: string;
  backgroundColor: string;
  includeTableNumber: boolean;
  includeRestaurantName: boolean;
  onDownload: () => void;
  onShare: () => void;
  isSelected: boolean;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({
  table,
  qrSize,
  qrColor,
  backgroundColor,
  includeTableNumber,
  includeRestaurantName,
  onDownload,
  onShare,
  isSelected,
}) => {
  const [qrDataURL, setQrDataURL] = useState<string>('');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const generateQR = async () => {
      setLoading(true);
      try {
        const dataURL = await QRCodeLib.toDataURL(table.qrCode, {
          width: 200, // Fixed size for card display
          color: {
            dark: qrColor,
            light: backgroundColor,
          },
          margin: 2,
        });
        setQrDataURL(dataURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [table.qrCode, qrColor, backgroundColor]);

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${
      isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-100'
    }`}>
      {/* Header */}
      <div className="text-center mb-4">
        {includeRestaurantName && (
          <h3 className="text-lg font-bold text-gray-900 mb-1">RestaurantePro</h3>
        )}
        {includeTableNumber && (
          <h4 className="text-xl font-semibold text-primary-600">Mesa {table.number}</h4>
        )}
        <p className="text-sm text-gray-600">Escaneie para ver o cardápio</p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-4">
        {loading ? (
          <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <img
            src={qrDataURL}
            alt={`QR Code Mesa ${table.number}`}
            className="w-48 h-48 rounded-lg border border-gray-200"
          />
        )}
      </div>

      {/* Table Info */}
      <div className="text-center mb-4 text-sm text-gray-600">
        <p>Capacidade: {table.capacity} pessoas</p>
        <p>Seção: {table.section}</p>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={onDownload}
          className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-1 text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Baixar</span>
        </button>
        <button
          onClick={onShare}
          className="flex-1 bg-secondary-600 text-white py-2 px-3 rounded-lg hover:bg-secondary-700 transition-colors flex items-center justify-center space-x-1 text-sm"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartilhar</span>
        </button>
      </div>
    </div>
  );
};

export default QRCodes;