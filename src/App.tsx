import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurantContext';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import Dashboard from './pages/Dashboard';
import Tables from './pages/Tables';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Kitchen from './pages/Kitchen';
import Cashier from './pages/Cashier';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Delivery from './pages/Delivery';
import QRCodes from './pages/QRCodes';
import History from './pages/History';
import Settings from './pages/Settings';
import DigitalMenu from './pages/DigitalMenu';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <LoginForm /> : <Navigate to="/" replace />} />
      <Route path="/cardapio" element={
        <RestaurantProvider>
          <DigitalMenu />
        </RestaurantProvider>
      } />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <RestaurantProvider>
            <Layout>
              <Dashboard />
            </Layout>
          </RestaurantProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/tables" element={
        <ProtectedRoute>
          <RestaurantProvider>
            <Layout>
              <Tables />
            </Layout>
          </RestaurantProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/menu" element={
        <ProtectedRoute>
          <RestaurantProvider>
            <Layout>
              <Menu />
            </Layout>
          </RestaurantProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/orders" element={
        <ProtectedRoute>
          <RestaurantProvider>
            <Layout>
              <Orders />
            </Layout>
          </RestaurantProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/kitchen" element={
        <ProtectedRoute>
          <RestaurantProvider>
            <Layout>
              <Kitchen />
            </Layout>
          </RestaurantProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/cashier" element={
        <ProtectedRoute>
          <RestaurantProvider>
            <Layout>
              <Cashier />
            </Layout>
          </RestaurantProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/inventory" element={
        <ProtectedRoute>
          <RestaurantProvider>
            <Layout>
              <Inventory />
            </Layout>
          </RestaurantProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute>
          <RestaurantProvider>
            <Layout>
              <Reports />
            </Layout>
          </RestaurantProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/delivery" element={
        <ProtectedRoute>
          <RestaurantProvider>
            <Layout>
              <Delivery />
            </Layout>
          </RestaurantProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/qr-codes" element={
        <ProtectedRoute>
          <RestaurantProvider>
            <Layout>
              <QRCodes />
            </Layout>
          </RestaurantProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/history" element={
        <ProtectedRoute>
          <RestaurantProvider>
            <Layout>
              <History />
            </Layout>
          </RestaurantProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <RestaurantProvider>
            <Layout>
              <Settings />
            </Layout>
          </RestaurantProvider>
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
                color: '#fff',
              },
            },
            error: {
              style: {
                background: '#EF4444',
                color: '#fff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
};

export default App;