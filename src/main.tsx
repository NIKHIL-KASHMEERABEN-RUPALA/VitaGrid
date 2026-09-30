import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { RbacProvider } from './context/RbacContext';
import { ToastContainer } from './components/Notifications/ToastContainer';
import { PermissionDeniedModal } from './components/Modals/PermissionDeniedModal';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <RbacProvider>
          <App />
          <ToastContainer />
          <PermissionDeniedModal />
        </RbacProvider>
      </NotificationProvider>
    </ThemeProvider>
  </StrictMode>,
);

