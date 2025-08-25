import React from 'react';
import { 
  createBrowserRouter,
  Navigate,
  Outlet,
  createRoutesFromElements,
  Route
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { routerConfig } from './config';

// Components
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import ResetPassword from '../components/auth/ResetPassword';
import EmailVerification from '../components/auth/EmailVerification';
import Profile from '../components/profile/Profile';
import ProfileEdit from '../components/profile/ProfileEdit';
import Settings from '../components/profile/Settings';
import Home from '../components/home/Home';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CampaignsList from '../components/donation/CampaignsList';
import CampaignDetail from '../components/donation/CampaignDetail';
import CreateCampaign from '../components/donation/CreateCampaign';
import DiscoverPage from '../components/discover/DiscoverPage';
import AdminDashboard from '../components/admin/AdminDashboard';

// 🆕 NOUVEAUX : Composants KYC
import { KYCVerification } from '../components/kyc';
import { KYCStatus } from '../components/kyc';
import { KYCSuccess } from '../components/kyc';
import { KYCError } from '../components/kyc';

// Protected route wrapper
const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public route wrapper (redirects to home if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to="/" /> : children;
};

// Simple Layout
const Layout = () => (
  <div>
    <Header />
    <main style={{ marginTop: '70px', minHeight: 'calc(100vh - 70px)' }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Route configuration using JSX syntax
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    }>
      <Route index element={<Home />} />
      <Route path="discover" element={<DiscoverPage />} />
      <Route
        path="login"
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        }
      />
      <Route
        path="register"
        element={
          <PublicRoute>
            <RegisterForm />
          </PublicRoute>
        }
      />
      <Route
        path="forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordForm />
          </PublicRoute>
        }
      />
      <Route
        path="reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route
        path="verify-email"
        element={
          <PublicRoute>
            <EmailVerification />
          </PublicRoute>
        }
      />
      <Route
        path="profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="profile/edit"
        element={
          <PrivateRoute>
            <ProfileEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="parametres"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path="campaigns"
        element={
          <PrivateRoute>
            <CampaignsList />
          </PrivateRoute>
        }
      />
      <Route
        path="campaigns/create"
        element={
          <PrivateRoute>
            <CreateCampaign />
          </PrivateRoute>
        }
      />
      <Route
        path="campaigns/:id"
        element={
          <PrivateRoute>
            <CampaignDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="admin"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* 🆕 NOUVELLES ROUTES : KYC/AML */}
      <Route
        path="kyc/verify"
        element={
          <PrivateRoute>
            <KYCVerification />
          </PrivateRoute>
        }
      />
      <Route
        path="kyc/status"
        element={
          <PrivateRoute>
            <KYCStatus />
          </PrivateRoute>
        }
      />
      <Route
        path="kyc/success"
        element={
          <PrivateRoute>
            <KYCSuccess />
          </PrivateRoute>
        }
      />
      <Route
        path="kyc/error"
        element={
          <PrivateRoute>
            <KYCError />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  ),
  {
    future: routerConfig
  }
);

export default router;