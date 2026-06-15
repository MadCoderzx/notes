import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotesProvider } from './context/NotesContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotesPage from './pages/NotesPage';
import NoteDetailPage from './pages/NoteDetailPage';
import NoteEditorPage from './pages/NoteEditorPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotesProvider>
          <BrowserRouter>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Navbar />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <NotesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes/new"
                element={
                  <ProtectedRoute>
                    <NoteEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes/edit/:id"
                element={
                  <ProtectedRoute>
                    <NoteEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes/:id"
                element={
                  <ProtectedRoute>
                    <NoteDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </NotesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
