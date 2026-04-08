import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { ToastProvider } from './context/ToastContext';
import { AIPanelProvider } from './context/AIPanelContext';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import PageErrorBoundary from './components/PageErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Storefront = lazy(() => import('./pages/Storefront'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFail = lazy(() => import('./pages/PaymentFail'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const AddressList = lazy(() => import('./pages/AddressList'));
const ReturnRequest = lazy(() => import('./pages/ReturnRequest'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const AdminInventory = lazy(() => import('./pages/AdminInventory'));

const PageFallback = () => <div className="flex justify-center p-12"><LoadingSpinner /></div>;

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <CartProvider>
          <ToastProvider>
            <AIPanelProvider>
              <BrowserRouter>
                <GlobalErrorBoundary>
                  <Suspense fallback={<PageFallback />}>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/" element={<Layout />}>
                        <Route index element={<PageErrorBoundary><Storefront /></PageErrorBoundary>} />
                        <Route path="products/:id" element={<PageErrorBoundary><ProductDetail /></PageErrorBoundary>} />
                        <Route path="cart" element={<PageErrorBoundary><Cart /></PageErrorBoundary>} />
                        <Route path="checkout" element={<ProtectedRoute><PageErrorBoundary><Checkout /></PageErrorBoundary></ProtectedRoute>} />
                        <Route path="checkout/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                        <Route path="checkout/fail" element={<PaymentFail />} />
                        <Route path="orders" element={<ProtectedRoute><PageErrorBoundary><Orders /></PageErrorBoundary></ProtectedRoute>} />
                        <Route path="orders/:id" element={<ProtectedRoute><PageErrorBoundary><OrderDetail /></PageErrorBoundary></ProtectedRoute>} />
                        <Route path="my/addresses" element={<ProtectedRoute><PageErrorBoundary><AddressList /></PageErrorBoundary></ProtectedRoute>} />
                        <Route path="my/returns/:orderId" element={<ProtectedRoute><PageErrorBoundary><ReturnRequest /></PageErrorBoundary></ProtectedRoute>} />
                        <Route path="admin" element={<ProtectedRoute adminOnly><PageErrorBoundary><AdminDashboard /></PageErrorBoundary></ProtectedRoute>} />
                        <Route path="admin/products" element={<ProtectedRoute adminOnly><PageErrorBoundary><AdminProducts /></PageErrorBoundary></ProtectedRoute>} />
                        <Route path="admin/orders" element={<ProtectedRoute adminOnly><PageErrorBoundary><AdminOrders /></PageErrorBoundary></ProtectedRoute>} />
                        <Route path="admin/inventory" element={<ProtectedRoute adminOnly><PageErrorBoundary><AdminInventory /></PageErrorBoundary></ProtectedRoute>} />
                      </Route>
                    </Routes>
                  </Suspense>
                </GlobalErrorBoundary>
              </BrowserRouter>
            </AIPanelProvider>
          </ToastProvider>
        </CartProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
