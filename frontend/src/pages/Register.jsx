import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5001/api/auth/register', {
        username,
        password,
        role: 'buyer'
      })
      navigate('/login')
    } catch (err) {
      setError('Registration failed, username may already exist')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  )
}

export default Register