import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import TaskForm from './pages/TaskForm'
import Profile from './pages/Profile'

function App() {
  return <BrowserRouter><AuthProvider><Routes><Route path="/login" element={<Auth mode="login" />} /><Route path="/register" element={<Auth mode="register" />} /><Route element={<ProtectedRoute />}><Route element={<Layout />}><Route index element={<Dashboard />} /><Route path="tasks" element={<Tasks />} /><Route path="tasks/new" element={<TaskForm />} /><Route path="tasks/:id/edit" element={<TaskForm />} /><Route path="profile" element={<Profile />} /></Route></Route></Routes></AuthProvider></BrowserRouter>
}

export default App
