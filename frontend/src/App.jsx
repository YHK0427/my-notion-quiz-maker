import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import QuizCreator from './components/QuizCreator';
import QuizPlayer from './components/QuizPlayer';
import NotionConnect from './components/NotionConnect';

// API 서비스
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = {
  // Auth
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response.json();
  },
  
  register: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response.json();
  },

  // Notebooks
  getNotebooks: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/notebooks`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  createNotebook: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/api/notebooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  deleteNotebook: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/api/notebooks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // Quizzes
  generateQuiz: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  getQuiz: async (token, quizId) => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  startQuizAttempt: async (token, quizId) => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/start`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  submitAnswer: async (token, quizId, data) => {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Notion
  getNotionOAuthUrl: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/notion/oauth/url`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getNotionPages: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/notion/pages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  importNotionPages: async (token, pageIds) => {
    const response = await fetch(`${API_BASE_URL}/api/notion/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ page_ids: pageIds })
    });
    return response.json();
  },

  // Stats
  getStats: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/stats/overview`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};

// Auth Context
const AuthContext = React.createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            setUser(data);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    if (data.access_token) {
      setToken(data.access_token);
      setUser({ id: data.id, username: data.username });
      localStorage.setItem('token', data.access_token);
      return true;
    }
    return false;
  };

  const register = async (username, password) => {
    const data = await api.register(username, password);
    if (data.access_token) {
      setToken(data.access_token);
      setUser({ id: data.id, username: data.username });
      localStorage.setItem('token', data.access_token);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, api }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">로딩 중...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notion"
            element={
              <ProtectedRoute>
                <NotionConnect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <QuizCreator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <QuizPlayer />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;