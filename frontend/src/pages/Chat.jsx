import { useState } from 'react'
import axios from 'axios'

function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:5001/api/chat/message', {
        message: input,
        history: messages
      })
      setMessages([...newMessages, {
        role: 'assistant',
        content: response.data.message
      }])
    } catch (err) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.'
      }])
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <h2>AI Assistant</h2>
      <p style={{ color: '#666' }}>Ask about our eggs, pricing, or farm operations.</p>

      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length === 0 && (
          <p style={{ color: '#999', textAlign: 'center', marginTop: '150px' }}>
            Start a conversation!
          </p>
        )}
        {messages.map((msg, index) => (
          <div key={index} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? '#333' : '#f0f0f0',
            color: msg.role === 'user' ? 'white' : 'black',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            maxWidth: '70%'
          }}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', color: '#999' }}>Thinking...</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} style={{ padding: '0.75rem 1.5rem' }}>Send</button>
      </div>
    </div>
  )
}

export default Chat