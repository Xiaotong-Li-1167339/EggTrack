import { useState, useEffect } from 'react'
import axios from 'axios'

function Inventory() {
  const [inventory, setInventory] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5001/api/inventory/')
      .then(res => setInventory(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Egg Inventory</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Grade</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Available Quantity</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.grade}>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{item.grade}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{item.available_qty}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{item.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Inventory