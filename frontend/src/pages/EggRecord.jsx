import { useState, useEffect } from 'react'
import axios from 'axios'

function EggRecord() {
  const [records, setRecords] = useState([])
  const [date, setDate] = useState('')
  const [quantity, setQuantity] = useState('')
  const [flockSize, setFlockSize] = useState('')
  const [grade, setGrade] = useState('standard')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('token')

  const fetchRecords = () => {
    axios.get('http://localhost:5001/api/eggs/records', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setRecords(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5001/api/eggs/record', {
        record_date: date,
        quantity: parseInt(quantity),
        flock_size: parseInt(flockSize),
        grade,
        notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('Record added successfully!')
      setDate('')
      setQuantity('')
      setFlockSize('')
      setNotes('')
      fetchRecords()
    } catch (err) {
      setMessage('Failed to add record')
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Egg Production Records</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
        <h3>Add New Record</h3>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
        <input placeholder="Flock Size" value={flockSize} onChange={e => setFlockSize(e.target.value)} />
        <select value={grade} onChange={e => setGrade(e.target.value)}>
          <option value="standard">Standard</option>
          <option value="downgrade">Downgrade</option>
        </select>
        <input placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
        <button onClick={handleSubmit}>Add Record</button>
      </div>

      <h3>Recent Records</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Date</th>
            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Operator</th>
            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Quantity</th>
            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Flock Size</th>
            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Grade</th>
            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Lay Rate</th>
            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id}>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{r.record_date}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{r.operator}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{r.quantity}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{r.flock_size}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{r.grade}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                {(r.quantity / r.flock_size * 100).toFixed(1)}%
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{r.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EggRecord