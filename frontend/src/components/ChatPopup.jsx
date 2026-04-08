import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'

export default function ChatPopup({ open, onToggle }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '👋 Ask me anything about your journal entries.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const question = input.trim()
    setInput('')
    setMessages(m => [...m, { role: 'user', text: question }])
    setLoading(true)
    try {
      const res = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', text: data.answer }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Error reaching server.' }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 200,
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          border: 'none', cursor: 'pointer', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(124,109,250,0.5)'
        }}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed', bottom: '6rem', right: '2rem', zIndex: 199,
              width: '360px', maxHeight: '520px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem 1.2rem',
              borderBottom: '1px solid var(--border)',
              background: 'linear-gradient(135deg, rgba(124,109,250,0.08), rgba(0,212,170,0.04))'
            }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem' }}>
                💬 <em>Chat with Journal</em>
              </h3>
              <p style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.2rem' }}>
                Powered by Groq RAG
              </p>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%'
                  }}
                >
                  <div style={{
                    padding: '.6rem .9rem',
                    borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: m.role === 'user' ? 'var(--accent)' : 'var(--surface2)',
                    color: m.role === 'user' ? '#fff' : 'var(--text)',
                    fontSize: '.85rem', lineHeight: 1.5,
                    border: m.role === 'assistant' ? '1px solid var(--border)' : 'none'
                  }}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', color: 'var(--muted)', fontSize: '.82rem', fontStyle: 'italic' }}>
                  thinking...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '.75rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '.5rem' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about your journal..."
                style={{ flex: 1, borderRadius: '10px', fontSize: '.85rem' }}
              />
              <button onClick={send} className="btn btn-primary" style={{ padding: '.55rem .8rem' }}>
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
