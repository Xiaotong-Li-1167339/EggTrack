import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const role = localStorage.getItem('role')
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Dashboard</h2>
      <p>Welcome! You are logged in as <strong>{role}</strong>.</p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <div
          onClick={() => navigate('/')}
          style={{ padding: '1.5rem', background: '#f0f0f0', borderRadius: '8px', cursor: 'pointer', flex: '1', minWidth: '150px' }}>
          <h3>Inventory</h3>
          <p>View current egg stock</p>
        </div>

        {(role === 'operator' || role === 'admin') && (
          <div
            onClick={() => navigate('/eggs')}
            style={{ padding: '1.5rem', background: '#e8f5e9', borderRadius: '8px', cursor: 'pointer', flex: '1', minWidth: '150px' }}>
            <h3>Egg Records</h3>
            <p>Record daily production</p>
          </div>
        )}

        {(role === 'buyer' || role === 'admin') && (
          <div
            onClick={() => navigate('/orders')}
            style={{ padding: '1.5rem', background: '#e3f2fd', borderRadius: '8px', cursor: 'pointer', flex: '1', minWidth: '150px' }}>
            <h3>Orders</h3>
            <p>View and place orders</p>
          </div>
        )}

        <div
          onClick={() => navigate('/chat')}
          style={{ padding: '1.5rem', background: '#fff3e0', borderRadius: '8px', cursor: 'pointer', flex: '1', minWidth: '150px' }}>
          <h3>AI Assistant</h3>
          <p>Get help and information</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard