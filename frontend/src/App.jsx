import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import EggRecord from './pages/EggRecord'
import Inventory from './pages/Inventory'
import Orders from './pages/Orders'
import Chat from './pages/Chat'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inventory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/eggs" element={
          <PrivateRoute roles={['admin', 'operator']}>
            <EggRecord />
          </PrivateRoute>
        } />
        <Route path="/orders" element={
          <PrivateRoute roles={['admin', 'buyer']}>
            <Orders />
          </PrivateRoute>
        } />
      </Routes>
    </>
  )
}

export default App