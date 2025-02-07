import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.tsx';
import PublicRoute from './components/PublicRoute.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ToastProvider } from './contexts/ToastContext.tsx';
import './index.css';
import LoginPage from './pages/login-page.tsx';
import MainPage from './pages/main-page.tsx';
import RegisterPage from './pages/register-page.tsx';
import { Provider } from 'react-redux';
import store, { persistor } from './store/store.ts';
import ProfilePage from './pages/profile-page.tsx';
import { PersistGate } from 'redux-persist/integration/react';
import SearchPage from './pages/search-page.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>

                <Route element={<PublicRoute />} >
                  <Route path='/login' element={<LoginPage />} />
                  <Route path='/register' element={<RegisterPage />} />
                </Route>

                <Route element={<PrivateRoute />} >
                  <Route path="/" element={<MainPage />} />
                  <Route path='/profile/:username' element={<ProfilePage />} />
                  <Route path='/search' element={<SearchPage />} />
                </Route>
              </Routes>

            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
