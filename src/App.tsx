import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DemoSwitcher } from './components/layout/DemoSwitcher';
import { PublicLayout } from './components/layout/PublicLayout';
import { ScrollManager } from './components/layout/ScrollManager';
import { ToastViewport } from './components/ui/ToastViewport';
import { AppProvider } from './context/AppContext';
import { AdminPage } from './pages/AdminPage';
import { BookingPage } from './pages/BookingPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ServicesPage } from './pages/ServicesPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollManager />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="services/:serviceId?" element={<ServicesPage />} />
            <Route path="book" element={<BookingPage />} />
            <Route path="book/confirmation/:ref" element={<ConfirmationPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="admin" element={<AdminPage />} />
        </Routes>
        <DemoSwitcher />
        <ToastViewport />
      </BrowserRouter>
    </AppProvider>
  );
}
