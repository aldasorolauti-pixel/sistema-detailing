import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { AdminProvider } from './context/AdminContext';
import { Lobby } from './components/user_flow';
import BookingWizard from './components/BookingWizard';
import { AdminPanel } from './components/admin_flow';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <BookingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/booking" element={
            <ErrorBoundary>
              <BookingWizard />
            </ErrorBoundary>
          } />
          <Route path="/admin" element={
            <AdminProvider>
              <AdminPanel />
            </AdminProvider>
          } />
        </Routes>
      </Router>
    </BookingProvider>
  );
}

export default App;
