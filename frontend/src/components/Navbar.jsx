import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  return (
    <nav style={{ padding: '1rem', background: '#333', color: 'white', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Link to="/" style={{ color: 'white' }}>Inventory</Link>
      <Link to="/chat" style={{ color: 'white' }}>AI Assistant</Link>

      {token && role === 'operator' || role === 'admin' ? (
        <Link to="/eggs" style={{ color: 'white' }}>Egg Records</Link>
      ) : null}

      {token && role === 'buyer' || role === 'admin' ? (
        <Link to="/orders" style={{ color: 'white' }}>Orders</Link>
      ) : null}

      {token ? (
        <>
          <Link to="/dashboard" style={{ color: 'white' }}>Dashboard</Link>
          <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: 'white', marginLeft: 'auto' }}>Login</Link>
          <Link to="/register" style={{ color: 'white' }}>Register</Link>
        </>
      )}
    </nav>
  )
}

export default Navbar