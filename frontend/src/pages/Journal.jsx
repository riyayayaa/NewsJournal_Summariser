import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Link, FileText, Sparkles, Tag, Pencil, Trash2, X, Check, ChevronDown } from 'lucide-react'

const api = (path, opts) => fetch('/api' + path, opts).then(r => r.json())

export default function Journal() {
  const [entries, setEntries] = useState([])
  const [mode, setMode] = useState('url')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [busyId, setBusyId] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    const data = await api('/entries')
    setEntries(data.reverse())
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    if (mode === 'url') {
      await api('/entries/url', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
      setUrl('')
    } else {
      await api('/entries/text', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content }) })
      setTitle(''); setContent('')
    }
    setLoading(false)
    load()
  }

  async function action(id, endpoint) {
    setBusyId(id + endpoint)
    await api(`/entries/${id}/${endpoint}`, { method: 'POST' })
    setBusyId(null)
    load()
  }

  async function del(id) {
    if (!confirm('Delete this entry?')) return
    await api(`/entries/${id}`, { method: 'DELETE' })
    load()
  }

  async function saveEdit(id) {
    await api(`/entries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, content: editContent })
    })
    setEditId(null)
    load()
  }

  return (
    <div>
      {/* Hero section */}
      <div style={{
        padding: '4rem 1.5rem 3rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(124,109,250,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '.75rem', lineHeight: 1.2 }}>
            Your <em style={{ color: 'var(--accent)' }}>AI-Powered</em> News Journal
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', marginBottom: '2.5rem', maxWidth: '480px', margin: '0 auto 2.5rem' }}>
            Paste a URL or write a note. Let AI summarize, classify, and make sense of it.
          </p>
        </motion.div>

        {/* Main input card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22,1,0.36,1] }}
          className="card"
          style={{ maxWidth: '680px', margin: '0 auto', padding: '1.75rem' }}
        >
          {/* Mode toggle */}
          <div style={{
            display: 'flex', background: 'var(--surface2)',
            borderRadius: '10px', padding: '4px', marginBottom: '1.25rem', gap: '4px'
          }}>
            {[
              { key: 'url', icon: <Link size={14} />, label: 'Paste URL' },
              { key: 'text', icon: <FileText size={14} />, label: 'Write Note' }
            ].map(({ key, icon, label }) => (
              <button key={key} onClick={() => setMode(key)} style={{
                flex: 1, padding: '.5rem', borderRadius: '8px', border: 'none',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '.875rem', fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem',
                background: mode === key ? 'var(--surface)' : 'transparent',
                color: mode === key ? 'var(--text)' : 'var(--muted)',
                boxShadow: mode === key ? 'var(--shadow)' : 'none',
                transition: 'all 0.2s'
              }}>
                {icon} {label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
            <AnimatePresence mode="wait">
              {mode === 'url' ? (
                <motion.div key="url"
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}>
                  <input value={url} onChange={e => setUrl(e.target.value)} type="url"
                    placeholder="https://example.com/article — paste any news URL" required
                    style={{ fontSize: '1rem', padding: '.85rem 1.1rem' }} />
                </motion.div>
              ) : (
                <motion.div key="text"
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
                  <textarea value={content} onChange={e => setContent(e.target.value)}
                    placeholder="Write your note here..." rows={4} required />
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ alignSelf: 'stretch', padding: '.8rem', fontSize: '.95rem', justifyContent: 'center' }}>
              <Plus size={16} /> {loading ? 'Processing...' : mode === 'url' ? 'Extract & Save' : 'Save Entry'}
            </button>
          </form>
        </motion.div>

        {entries.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ marginTop: '2rem', color: 'var(--muted)', fontSize: '.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem' }}>
            <ChevronDown size={14} /> {entries.length} saved {entries.length === 1 ? 'entry' : 'entries'}
          </motion.div>
        )}
      </div>

      {/* Entries */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        {entries.length === 0 && (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem', fontSize: '.95rem' }}>
            No entries yet — paste a URL above to get started.
          </p>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1rem' }}>
          <AnimatePresence>
            {entries.map((entry, i) => (
              <motion.div key={entry.id} className="card"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22,1,0.36,1] }}
                style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '.7rem' }}
              >
                {editId === entry.id ? (
                  <>
                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                    <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={4} />
                    <div style={{ display: 'flex', gap: '.5rem' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => saveEdit(entry.id)}><Check size={13} /> Save</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditId(null)}><X size={13} /> Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.5rem' }}>
                      <h3 style={{ fontSize: '.97rem', lineHeight: 1.4, fontStyle: 'italic', flex: 1 }}>
                        {entry.title || 'Untitled'}
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', flexShrink: 0 }}>
                        {entry.topic && <span className="badge badge-topic">{entry.topic}</span>}
                        {entry.sentiment && <span className={`badge badge-${entry.sentiment.toLowerCase()}`}>{entry.sentiment}</span>}
                      </div>
                    </div>

                    {/* Content preview */}
                    <p style={{ color: 'var(--muted)', fontSize: '.84rem', lineHeight: 1.65 }}>
                      {entry.content?.slice(0, 160)}{entry.content?.length > 160 ? '…' : ''}
                    </p>

                    {/* Summary */}
                    {entry.summary && (
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(124,109,250,0.07), rgba(0,212,170,0.04))',
                        borderLeft: '3px solid var(--accent)',
                        padding: '.75rem 1rem', borderRadius: '0 10px 10px 0',
                        fontSize: '.83rem', lineHeight: 1.65
                      }}>
                        <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '.3rem', fontStyle: 'italic', fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                          AI Summary
                        </strong>
                        {entry.summary}
                      </div>
                    )}

                    {/* Meta */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', color: 'var(--muted)' }}>
                      {entry.sourceUrl
                        ? <a href={entry.sourceUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent2)', textDecoration: 'none' }}>🔗 Source</a>
                        : <span />}
                      <span>{new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', paddingTop: '.2rem', borderTop: '1px solid var(--border)' }}>
                      <button className="btn btn-ai btn-sm" onClick={() => action(entry.id, 'summarize')} disabled={!!busyId}>
                        <Sparkles size={12} /> {busyId === entry.id + 'summarize' ? 'Working…' : 'Summarise'}
                      </button>
                      <button className="btn btn-classify btn-sm" onClick={() => action(entry.id, 'classify')} disabled={!!busyId}>
                        <Tag size={12} /> {busyId === entry.id + 'classify' ? 'Working…' : 'Classify'}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setEditId(entry.id); setEditTitle(entry.title); setEditContent(entry.content) }}>
                        <Pencil size={12} /> Modify
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(entry.id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
