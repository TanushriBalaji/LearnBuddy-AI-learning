import { useState } from 'react';
import axios from 'axios';

const ChatView = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hello! I am LearnBuddy. How can I help you learn today?' }]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    setQuery('');
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.post('http://localhost:5000/api/chat', { question: query }, config);
      
      setMessages([...newMsgs, { sender: 'ai', text: data.answer }]);
    } catch (error) {
      setMessages([...newMsgs, { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in card" style={{ maxWidth: '800px', margin: '0 auto', height: '600px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>AI Assistant</h2>
      
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            background: msg.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
            color: 'white',
            padding: '1rem',
            borderRadius: '1rem',
            maxWidth: '80%'
          }}>
            {msg.text}
          </div>
        ))}
        {loading && <div style={{ alignSelf: 'flex-start', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '1rem' }}>Thinking...</div>}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="Ask me anything about your topics..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>Send</button>
      </form>
    </div>
  );
};

export default ChatView;
