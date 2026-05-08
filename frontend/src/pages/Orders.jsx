import { useState, useEffect } from 'react'
import axios from 'axios'

function Orders() {
  const [orders, setOrders] = useState([])
  const [grade, setGrade] = useState('standard')
  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  const fetchOrders = () => {
    axios.get('http://localhost:5001/api/orders/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleOrder = async () => {
    try {
      await axios.post('http://localhost:5001/api/orders/create', {
        items: [{
          grade,
          quantity: parseInt(quantity),
          unit_price: parseFloat(unitPrice)
        }]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('Order placed successfully!')
      setQuantity('')
      setUnitPrice('')
      fetchOrders()
    } catch (err) {
      setMessage('Failed to place order')
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Orders</h2>

      {role === 'buyer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>Place New Order</h3>
          {message && <p style={{ color: 'green' }}>{message}</p>}
          <select value={grade} onChange={e => setGrade(e.target.value)}>
            <option value="standard">Standard</option>
            <option value="downgrade">Downgrade</option>
          </select>
          <input placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
          <input placeholder="Unit Price" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
          <button onClick={handleOrder}>Place Order</button>
        </div>
      )}

      <h3>Order History</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Order ID</th>
            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Grade</th>
            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Quantity</th>
            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Unit Price</th>
            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, index) => (
            <tr key={index}>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{o.order_id}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{o.grade}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{o.quantity}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>${o.unit_price}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{o.status}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{o.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Orders