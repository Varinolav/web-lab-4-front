import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage.tsx';
import Dashboard from './components/Dashboard.tsx';
import { apiService } from './services/api';
import type { SteamUser } from './services/api';

function App() {
  const [user, setUser] = useState<SteamUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we're returning from Steam auth callback
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth') === 'success') {
          // Clear the query parameter
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        const currentUser = await apiService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await apiService.logout();
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-dark">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return <LoginPage />;
}

export default App;
