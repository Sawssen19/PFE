import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import theme from './theme';
import store from './store';
import router from './router/index';
import { setupMaintenanceInterceptor } from './utils/axiosInterceptor';
import './index.css';
import './styles/globals.css';
import './styles/layout.css';
import './styles/colors.css';
import './styles/action-buttons.css';

// Configurer les intercepteurs axios pour le mode maintenance
setupMaintenanceInterceptor();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);