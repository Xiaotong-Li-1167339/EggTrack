import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        username,
        password
      })
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('role', response.data.role)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid username or password')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem' }}>
      <h2>Login</h2>
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
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  )
}

export default Login